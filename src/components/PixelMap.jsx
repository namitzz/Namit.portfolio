import { useEffect, useRef } from 'react'
import {
  DIRT,
  FLOWERS,
  GRASS,
  SCALE,
  SPRITES,
  TILE,
  hash2,
  loadTileset,
  nightPixel,
} from '../lib/tileset'

/**
 * The ground: a top-down tile map, blitted from a real tileset.
 *
 * Every cell is classified once — road, woodland, or open grass — and
 * then a tile is copied into it from the sheet. Nothing here is drawn.
 * An earlier version painted the terrain with `fillRect`, and the honest
 * result was that hand-authored pixel art cannot be approximated with
 * rectangles: the craft lives in the individual pixels.
 *
 * The road is not decoration laid near the route: it is carved from the
 * route. Cells within a distance of the actual path become earth, so the
 * road on the map and the journey through the timeline are the same
 * line, and a stop always stands on its own road.
 *
 * The canvas is drawn once per size. Nothing here animates.
 */

/** Half-width of the road, in sheet pixels, before any widening. */
const PATH_HALF = 11

/** Cleared ground around a stop, so a building has a forecourt. */
const PLAZA = 19

export default function PixelMap({ d, width, height, plots = [] }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !width || !height || !d) return

    let cancelled = false
    loadTileset()
      .then((sheet) => {
        if (!cancelled) paint(canvas, sheet, d, width, height, plots)
      })
      .catch(() => {
        // A missing sheet leaves the plate's own green showing, which is
        // a map without its detail rather than a hole in the page.
      })
    return () => {
      cancelled = true
    }
  }, [d, width, height, plots])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

/* ------------------------------------------------------------------ */

function paint(canvas, sheet, d, width, height, plots) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // The canvas is sized in sheet pixels and stretched to its CSS box, so
  // one source pixel always lands on exactly SCALE device pixels and the
  // art stays square. Rendering at devicePixelRatio instead would put
  // source pixels on fractional boundaries and soften every edge.
  const aw = Math.ceil(width / SCALE)
  const ah = Math.ceil(height / SCALE)
  canvas.width = aw
  canvas.height = ah
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, aw, ah)

  const cols = Math.ceil(aw / TILE) + 1
  const rows = Math.ceil(ah / TILE) + 1

  // Plots arrive in CSS pixels; everything in here is sheet pixels.
  const marks = plots.map((p) => ({
    x: p.x / SCALE,
    y: p.y / SCALE,
    w: (p.w || 0) / SCALE,
    h: (p.h || 0) / SCALE,
  }))
  const route = sampleRoute(d, 1400, SCALE)
  // The road does not begin at the first stop and end at the last one.
  // It arrives from somewhere and carries on somewhere, which is what
  // makes this a town on a route rather than the whole world.
  if (route.length) {
    const first = route[0]
    const last = route[route.length - 1]
    for (let i = 1; i <= 140; i++) {
      route.push({ x: first.x - i, y: first.y })
      route.push({ x: last.x + i, y: last.y })
    }
  }

  const blit = ([sx, sy, sw = TILE, sh = TILE], dx, dy) =>
    ctx.drawImage(sheet, sx, sy, sw, sh, dx, dy, sw, sh)

  /* --- classify --- */
  const kind = []
  for (let r = 0; r < rows; r++) {
    kind[r] = []
    for (let c = 0; c < cols; c++) {
      const x = c * TILE + TILE / 2
      const y = r * TILE + TILE / 2
      const dRoute = nearRoute(route, x, y)
      // The wobble may only widen the road. Letting it narrow the road
      // punched holes through it: below one tile of half-width the
      // stretch between two stops stopped being continuous.
      const widen = hash2(c >> 1, r >> 1) * 5 + hash2(c, r) * 2
      const plaza = nearest(marks, x, y)

      if (dRoute < PATH_HALF + widen || plaza < PLAZA) {
        kind[r][c] = 'path'
        continue
      }

      // A structure's plot is cleared before anything grows on it, so
      // no canopy ever sits across a roof. Measured per structure: they
      // are all different sizes, and one fixed box left canopies over
      // the wide ones and bald patches around the small ones.
      const onPlot = marks.some(
        (m) =>
          Math.abs(m.x - x) < m.w / 2 + 10 &&
          y - m.y > -(m.h + 8) &&
          y - m.y < 14,
      )
      // Woodland clumps: a per-tile coin toss scatters shrubs evenly,
      // while a low-frequency term makes neighbours agree and become a
      // wood. Dense in the outer margin and thin inside, so the map is
      // bounded by a treeline rather than by a cut edge.
      const density = hash2(c >> 1, r >> 1) * 0.68 + hash2(c + 7, r + 3) * 0.32
      const edge = Math.min(x, y, aw - x, ah - y)
      const needed = edge < 54 ? 0.16 : 0.62
      kind[r][c] =
        dRoute > 34 && density > needed && !onPlot ? 'tree' : 'grass'
    }
  }

  /* --- ground --- */
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      blit(GRASS[Math.floor(hash2(c + 5, r + 11) * GRASS.length) % GRASS.length], c * TILE, r * TILE)
      if (kind[r][c] === 'path') {
        blit(DIRT[Math.floor(hash2(c + 3, r + 2) * DIRT.length) % DIRT.length], c * TILE, r * TILE)
      }
    }
  }

  /* --- ground cover --- */
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (kind[r][c] !== 'grass') continue
      const n = hash2(c + 61, r + 29)
      if (n > 0.972) blit(FLOWERS[Math.floor(hash2(c, r) * 3) % 3], c * TILE, r * TILE)
      else if (n > 0.955) blit(SPRITES.bush, c * TILE, r * TILE)
      else if (n > 0.945) blit(SPRITES.rocks, c * TILE, r * TILE)
    }
  }

  /* --- woodland --- */
  // Canopies are wider than their cell and hang past it, so neighbouring
  // trees overlap into a wood instead of lining up on the grid.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (kind[r][c] !== 'tree') continue
      if (hash2(c + 31, r + 17) < 0.34) continue
      blit(SPRITES.tree, c * TILE - 8, r * TILE - 14)
    }
  }

  night(ctx, aw, ah)
  lantern(ctx, route, marks)
}

/* ------------------------------------------------------------------ */

/**
 * Dusk, and then the lights.
 *
 * The grade runs over every pixel once, which is one pass over a quarter
 * of a million pixels and costs a couple of milliseconds at the size the
 * map is drawn. Doing it as a translucent dark rectangle over the top
 * would have been cheaper and wrong: a scrim flattens the art towards
 * one colour, where a grade keeps the relationships between colours and
 * only moves where they sit.
 */
function night(ctx, aw, ah) {
  const data = ctx.getImageData(0, 0, aw, ah)
  const p = data.data
  for (let i = 0; i < p.length; i += 4) {
    const [r, g, b] = nightPixel(p[i], p[i + 1], p[i + 2])
    p[i] = r
    p[i + 1] = g
    p[i + 2] = b
  }
  ctx.putImageData(data, 0, 0)

  // The frame falls away into the dark, so the eye goes to the road
  // rather than to the corners.
  const vignette = ctx.createRadialGradient(
    aw / 2,
    ah / 2,
    Math.min(aw, ah) * 0.32,
    aw / 2,
    ah / 2,
    Math.max(aw, ah) * 0.68,
  )
  vignette.addColorStop(0, 'rgba(3,7,14,0)')
  vignette.addColorStop(1, 'rgba(3,7,14,0.86)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, aw, ah)
}

/**
 * Warm light, added rather than laid over.
 *
 * `lighter` adds the light to what is already there, which is what
 * light does. Painting the same amber at partial alpha would wash the
 * ground towards orange instead, and the map would look tinted rather
 * than lit.
 */
function lantern(ctx, route, marks) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  const pool = (x, y, radius, alpha) => {
    ctx.save()
    ctx.translate(x, y)
    // Squashed, because a pool of light on the ground is an ellipse seen
    // from this angle, not a circle.
    ctx.scale(1, 0.68)
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
    g.addColorStop(0, `rgba(255,186,104,${alpha})`)
    g.addColorStop(0.45, `rgba(214,132,58,${alpha * 0.42})`)
    g.addColorStop(1, 'rgba(120,64,20,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Every twelfth sample is roughly a lamp every twelve pixels of road.
  for (let i = 0; i < route.length; i += 12) pool(route[i].x, route[i].y, 24, 0.2)
  for (const m of marks) pool(m.x, m.y, 62, 0.42)

  ctx.restore()
}

/* ------------------------------------------------------------------ */

/**
 * Points along the route, converted from CSS pixels into sheet pixels.
 */
function sampleRoute(d, n, scale) {
  if (typeof document === 'undefined') return []
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  svg.appendChild(path)
  // Detached elements report zero length in some engines, so the probe is
  // attached, measured and removed within the same frame.
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden')
  document.body.appendChild(svg)
  const total = path.getTotalLength()
  const out = []
  for (let i = 0; i <= n; i++) {
    const p = path.getPointAtLength((i / n) * total)
    out.push({ x: p.x / scale, y: p.y / scale })
  }
  document.body.removeChild(svg)
  return out
}

function nearRoute(route, x, y) {
  let best = Infinity
  for (let i = 0; i < route.length; i++) {
    const dx = route[i].x - x
    const dy = route[i].y - y
    const dd = dx * dx + dy * dy
    if (dd < best) best = dd
  }
  return Math.sqrt(best)
}

function nearest(points, x, y) {
  let best = Infinity
  for (let i = 0; i < points.length; i++) {
    const dd = (points[i].x - x) ** 2 + (points[i].y - y) ** 2
    if (dd < best) best = dd
  }
  return Math.sqrt(best)
}
