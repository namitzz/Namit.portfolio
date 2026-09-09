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
const PATH_HALF = 15

/** Cleared ground around a stop, so a building has a forecourt. */
const PLAZA = 26

export default function PixelMap({ d, width, height, stops = [] }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !width || !height || !d) return

    let cancelled = false
    loadTileset()
      .then((sheet) => {
        if (!cancelled) paint(canvas, sheet, d, width, height, stops)
      })
      .catch(() => {
        // A missing sheet leaves the plate's own green showing, which is
        // a map without its detail rather than a hole in the page.
      })
    return () => {
      cancelled = true
    }
  }, [d, width, height, stops])

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

function paint(canvas, sheet, d, width, height, stops) {
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

  // Stops arrive in CSS pixels; everything in here is sheet pixels.
  const marks = stops.map((s) => ({ x: s.x / SCALE, y: s.y / SCALE }))
  const route = sampleRoute(d, 1400, SCALE)

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
      const widen = hash2(c >> 1, r >> 1) * 6 + hash2(c, r) * 2
      const plaza = nearest(marks, x, y)

      if (dRoute < PATH_HALF + widen || plaza < PLAZA) {
        kind[r][c] = 'path'
        continue
      }

      // A building's plot is cleared before anything grows on it, so no
      // canopy ever sits across a roof.
      const onPlot = marks.some(
        (m) => Math.abs(m.x - x) < 46 && y - m.y > -86 && y - m.y < 14,
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

  /* --- town square --- */
  // One fountain, on the open ground between the first and second rows.
  if (marks.length > 4) {
    const [fw, fh] = [SPRITES.fountain[2], SPRITES.fountain[3]]
    blit(
      SPRITES.fountain,
      Math.round(aw / 2 - fw / 2),
      Math.round((marks[0].y + marks[4].y) / 2 - fh / 2),
    )
  }
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
