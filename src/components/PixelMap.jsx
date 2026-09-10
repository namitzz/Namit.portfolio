import { useEffect, useRef } from 'react'
import {
  BRIDGE,
  FOAM,
  FOREST,
  GROUND,
  GROUND_DARK,
  GROUND_LIGHT,
  PLACES,
  RANGES,
  ROAD,
  ROAD_EDGE,
  SCALE,
  SEA_DEEP,
  SEA_SHALLOW,
  TILE,
  fbm,
  hash2,
  loadTileset,
  nightPixel,
  nightSprite,
  smoothRoute,
} from '../lib/tileset'

/**
 * The world the journey crosses: coast, river, woodland, mountains and
 * the road between them, drawn to a canvas from a worldmap tileset.
 *
 * The regions are placed by hand and detailed by noise. Pure noise gives
 * a plausible island and no composition: the mountains end up wherever,
 * and the eye has nothing to travel along. So the sea, the lake, the
 * river and the four ranges are put where the map wants them, and
 * fractal noise only decides where each edge actually falls, which is
 * the part a hand is bad at.
 *
 * The canvas is drawn once per size. Nothing here animates.
 */

/** Half-width of the road surface and of its shoulder, in sheet pixels. */
const ROAD_HALF = 2.7
const SHOULDER = 4.0

export default function PixelMap({ width, height, plots = [], stops = [] }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !width || !height || !stops.length) return

    let cancelled = false
    loadTileset()
      .then((sheets) => {
        if (!cancelled) paint(canvas, sheets, width, height, plots, stops)
      })
      .catch(() => {
        // A missing sheet leaves the plate's own ground showing, which is
        // a map without its detail rather than a hole in the page.
      })
    return () => {
      cancelled = true
    }
  }, [width, height, plots, stops])

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

function paint(canvas, { world, mountains }, width, height, plots, stops) {
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

  const route = stops.map((s) => ({ x: s.x / SCALE, y: s.y / SCALE }))
  // The same spline the SVG route draws, so the dirt on the ground and
  // the lit trail over it are one line rather than two that agree only
  // where the milestones are.
  const path = densify(smoothRoute(route), 3)
  const nearRoad = distanceField(path, aw, ah)
  const geo = regions(aw, ah)

  const blit = (sheet, [sx, sy, sw = TILE, sh = TILE], dx, dy) =>
    ctx.drawImage(sheet, sx, sy, sw, sh, Math.round(dx), Math.round(dy), sw, sh)

  ground(ctx, aw, ah, geo)
  woodland(world, aw, ah, geo, nearRoad, plots, blit)
  ranges(mountains, aw, ah, blit)
  clouds(ctx, aw, ah)
  places(world, aw, ah, geo, nearRoad, blit)

  night(ctx, aw, ah)
  // The road goes down after the grade, in its own night colours, and
  // the lamps go on top of that.
  road(ctx, aw, ah, nearRoad)
  crossings(ctx, world, path, geo)
  lantern(ctx, path, route)
}

/* ------------------------------------------------------------------ */
/* Regions                                                            */

/**
 * Where the sea, the lake and the river are, as functions of position.
 *
 * Written against the map's proportions rather than its pixels, so the
 * same coast appears at every plate width instead of the sea sliding off
 * the edge when the window grows.
 */
function regions(aw, ah) {
  const sea = (x, y) =>
    Math.hypot(x - aw * 0.01, (y - ah * 1.02) / 0.72) <
    aw * 0.22 + fbm(x, y, 4, 0.02) * aw * 0.1
  const lake = (x, y) =>
    Math.hypot((x - aw * 0.79) / 1.35, (y - ah * 0.1) / 0.85) <
    aw * 0.097 + fbm(x, y, 4, 0.03) * aw * 0.044
  const river = (x, y) => {
    const bank = aw * 0.873 + Math.sin((y - ah * 0.085) * 0.02) * aw * 0.05
    return (
      Math.abs(x - bank) < aw * 0.0133 + fbm(x, y, 3, 0.05) * aw * 0.01 &&
      y > ah * 0.064 &&
      y < ah - ah * 0.085
    )
  }
  const water = (x, y) => sea(x, y) || lake(x, y) || river(x, y)
  return { sea, lake, river, water }
}

/** Grass, mottled, and then the water cut out of it. */
function ground(ctx, aw, ah, geo) {
  ctx.fillStyle = rgb(GROUND)
  ctx.fillRect(0, 0, aw, ah)

  // Mottling in blocks of four, because a per-pixel wash is static and a
  // field is not static: it is patchy.
  for (let y = 0; y < ah; y += 4) {
    for (let x = 0; x < aw; x += 4) {
      const n = fbm(x, y, 3, 0.055)
      if (n > 0.6) ctx.fillStyle = rgb(GROUND_LIGHT)
      else if (n < 0.4) ctx.fillStyle = rgb(GROUND_DARK)
      else continue
      ctx.fillRect(x, y, 4, 4)
    }
  }

  const img = ctx.getImageData(0, 0, aw, ah)
  const p = img.data
  const wet = new Uint8Array(aw * ah)
  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      if (!geo.water(x, y)) continue
      wet[y * aw + x] = 1
      const c = fbm(x, y, 3, 0.09) < 0.5 ? SEA_DEEP : SEA_SHALLOW
      const i = (y * aw + x) * 4
      p[i] = c[0]
      p[i + 1] = c[1]
      p[i + 2] = c[2]
    }
  }
  // Foam, read off the mask rather than by asking the region functions
  // again: one array lookup instead of four more noise evaluations per
  // pixel, over a quarter of a million pixels.
  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      if (!wet[y * aw + x]) continue
      const edge =
        !wet[y * aw + Math.max(0, x - 2)] ||
        !wet[y * aw + Math.min(aw - 1, x + 2)] ||
        !wet[Math.max(0, y - 2) * aw + x] ||
        !wet[Math.min(ah - 1, y + 2) * aw + x]
      if (!edge) continue
      const i = (y * aw + x) * 4
      p[i] = FOAM[0]
      p[i + 1] = FOAM[1]
      p[i + 2] = FOAM[2]
    }
  }
  ctx.putImageData(img, 0, 0)
}

/** Woodland, as a nine-slice so a wood has edges rather than corners. */
function woodland(world, aw, ah, geo, nearRoad, plots, blit) {
  const cols = Math.ceil(aw / TILE) + 1
  const rows = Math.ceil(ah / TILE) + 1
  const tree = []
  for (let r = 0; r < rows; r++) {
    tree[r] = []
    for (let c = 0; c < cols; c++) {
      const x = c * TILE + TILE / 2
      const y = r * TILE + TILE / 2
      if (geo.water(x, y) || nearRoad(x, y) < 15) continue
      // Nothing grows on the plot a milestone stands on.
      if (
        plots.some(
          (m) =>
            Math.abs(m.x / SCALE - x) < m.w / SCALE / 2 + 12 &&
            y - m.y / SCALE > -(m.h / SCALE + 10) &&
            y - m.y / SCALE < 14,
        )
      ) {
        continue
      }
      // Two scales: the coarse one decides where woods are, the fine one
      // breaks their edges up so they are not ellipses.
      tree[r][c] = fbm(x, y, 4, 0.021) > 0.435 && fbm(x, y, 2, 0.008) < 0.78
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!tree[r][c]) continue
      const up = !!tree[r - 1]?.[c]
      const down = !!tree[r + 1]?.[c]
      const left = !!tree[r][c - 1]
      const right = !!tree[r][c + 1]
      const row = up && down ? 1 : up ? 2 : 0
      const col = left && right ? 1 : left ? 2 : 0
      blit(world, FOREST[row][col], c * TILE, r * TILE)
    }
  }
}

/** The road, laid onto the ground rather than tiled over it. */
function road(ctx, aw, ah, nearRoad) {
  const img = ctx.getImageData(0, 0, aw, ah)
  const p = img.data
  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      const dd = nearRoad(x, y)
      if (dd > SHOULDER) continue
      const c = dd < ROAD_HALF ? ROAD : ROAD_EDGE
      const i = (y * aw + x) * 4
      p[i] = c[0]
      p[i + 1] = c[1]
      p[i + 2] = c[2]
    }
  }
  ctx.putImageData(img, 0, 0)
}

/**
 * A bridge wherever the road meets the river.
 *
 * Without one the road simply painted itself across the water, which
 * reads as a mistake rather than as a ford: a track cannot cross a river
 * by being drawn over it. The sheet has the bridge and the water it
 * spans as one tile, so each crossing is a single blit.
 *
 * Crossings are found by walking the road and grouping the wet stretches,
 * so a route that crosses twice gets two bridges and a route that
 * crosses none gets none.
 */
function crossings(ctx, world, path, geo) {
  const runs = []
  let run = null
  for (const p of path) {
    if (geo.water(p.x, p.y)) {
      if (!run) run = []
      run.push(p)
    } else if (run) {
      runs.push(run)
      run = null
    }
  }
  if (run) runs.push(run)

  const sprite = nightSprite(world, BRIDGE)
  for (const r of runs) {
    // A wide crossing needs more than one tile of bridge, and a river
    // met at an angle is wider than the river itself.
    const mid = r[Math.floor(r.length / 2)]
    const span = Math.hypot(r[0].x - r[r.length - 1].x, r[0].y - r[r.length - 1].y)
    const tiles = Math.max(1, Math.round((span + 8) / TILE))
    for (let i = 0; i < tiles; i++) {
      const x = mid.x - (tiles * TILE) / 2 + i * TILE
      ctx.drawImage(sprite, Math.round(x), Math.round(mid.y - TILE / 2))
    }
  }
}

/**
 * Four mountain ranges, each a chain of overlapping massif sprites.
 *
 * The sheet draws mountains as whole ranges rather than as tiles, so a
 * chain of them with a little jitter reads as one long massif. Placed
 * around the frame: a snow range across the top with a spur below it,
 * and grey ranges down the left and across the bottom. The map is a
 * basin with a road through it, which is what gives the middle somewhere
 * to be.
 */
function ranges(mountains, aw, ah, blit) {
  const chain = (points, snowy, step) => {
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i]
      const [x1, y1] = points[i + 1]
      const len = Math.hypot(x1 - x0, y1 - y0)
      for (let k = 0; k < len; k += step) {
        const t = k / len
        const x = x0 + (x1 - x0) * t
        const y = y0 + (y1 - y0) * t
        const j = (hash2(Math.round(x), Math.round(y)) - 0.5) * 9
        const small = hash2(Math.round(x) + 3, Math.round(y) + 7) < 0.4
        const key = snowy
          ? small
            ? 'snowSmall'
            : 'snow'
          : small
            ? 'greySmall'
            : 'grey'
        const s = RANGES[key]
        blit(mountains, s, x - s[2] / 2 + j, y - s[3] + 10 + j * 0.4)
      }
    }
  }
  const X = (f) => aw * f
  const Y = (f) => ah * f
  chain(
    [
      [X(0.5), Y(0.07)],
      [X(0.65), Y(0.04)],
      [X(0.8), Y(0.06)],
      [X(1.02), Y(0.11)],
    ],
    true,
    30,
  )
  chain(
    [
      [X(0.16), Y(0.03)],
      [X(0.32), Y(0.055)],
      [X(0.47), Y(0.085)],
    ],
    false,
    30,
  )
  chain(
    [
      [X(-0.02), Y(0.3)],
      [X(0.017), Y(0.47)],
      [X(-0.007), Y(0.64)],
    ],
    false,
    34,
  )
  chain(
    [
      [X(0.05), Y(0.91)],
      [X(0.22), Y(0.97)],
      [X(0.4), Y(1.0)],
    ],
    false,
    32,
  )
}

/** Cloud banks lying on the high ground, and only there. */
function clouds(ctx, aw, ah) {
  const bank = (cx, cy, r, alpha) => {
    ctx.save()
    ctx.translate(cx, cy)
    // Flattened hard, because cloud lying along a ridge is a sheet, not a
    // ball. A circular gradient here reads as fog rather than weather.
    ctx.scale(1, 0.3)
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
    g.addColorStop(0, `rgba(238,244,252,${alpha})`)
    g.addColorStop(0.55, `rgba(232,240,250,${alpha * 0.4})`)
    g.addColorStop(1, 'rgba(226,236,248,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  bank(aw * 0.58, ah * 0.05, aw * 0.12, 0.62)
  bank(aw * 0.72, ah * 0.03, aw * 0.14, 0.68)
  bank(aw * 0.88, ah * 0.07, aw * 0.11, 0.55)
  bank(aw * 0.28, ah * 0.03, aw * 0.09, 0.45)
  bank(aw * 0.02, ah * 0.47, aw * 0.07, 0.4)
  bank(aw * 0.2, ah * 0.95, aw * 0.08, 0.4)
}

/**
 * The places nobody stops at: a lighthouse on the point, a field inland,
 * a hamlet, a cave mouth in the hills.
 *
 * Each is offered a few positions and takes the first that is on dry
 * open ground and off the road. Fixed positions put the hamlet inside a
 * mountain the first time the ranges moved.
 */
function places(world, aw, ah, geo, nearRoad, blit) {
  const put = (sprite, options) => {
    for (const [fx, fy] of options) {
      const x = aw * fx
      const y = ah * fy
      const w = sprite[2]
      const h = sprite[3]
      let ok = true
      for (let dy = -h; dy <= 4 && ok; dy += 8) {
        for (let dx = -w / 2; dx <= w / 2 && ok; dx += 8) {
          if (geo.water(x + dx, y + dy) || nearRoad(x + dx, y + dy) < 14) {
            ok = false
          }
        }
      }
      if (!ok) continue
      blit(world, sprite, x - w / 2, y - h)
      return
    }
  }
  // The lighthouse is the exception: it wants the water's edge, so it is
  // placed against the coast rather than away from it.
  blit(world, PLACES.tower, aw * 0.055, ah * 0.79)
  put(PLACES.field, [[0.29, 0.31], [0.38, 0.24], [0.22, 0.44]])
  put(PLACES.village, [[0.2, 0.62], [0.15, 0.55], [0.26, 0.7]])
  put(PLACES.cave, [[0.955, 0.34], [0.955, 0.27], [0.93, 0.42]])
}

/* ------------------------------------------------------------------ */

/**
 * Dusk, and then the lights.
 *
 * The grade runs over every pixel once. Doing it as a translucent dark
 * rectangle over the top would have been cheaper and wrong: a scrim
 * flattens the art towards one colour, where a grade keeps the
 * relationships between colours and only moves where they sit.
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

  const vignette = ctx.createRadialGradient(
    aw / 2,
    ah / 2,
    Math.min(aw, ah) * 0.34,
    aw / 2,
    ah / 2,
    Math.max(aw, ah) * 0.7,
  )
  vignette.addColorStop(0, 'rgba(3,7,14,0)')
  vignette.addColorStop(1, 'rgba(3,7,14,0.84)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, aw, ah)
}

/**
 * Warm light, added rather than laid over.
 *
 * `lighter` adds the light to what is already there, which is what light
 * does. Painting the same amber at partial alpha would wash the ground
 * towards orange instead, and the map would look tinted rather than lit.
 */
function lantern(ctx, path, stops) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const pool = (x, y, radius, alpha) => {
    ctx.save()
    ctx.translate(x, y)
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
  for (let i = 0; i < path.length; i += 10) pool(path[i].x, path[i].y, 22, 0.18)
  for (const s of stops) pool(s.x, s.y, 58, 0.4)
  ctx.restore()
}

/* ------------------------------------------------------------------ */

/** The route, resampled so consecutive points are about `step` apart. */
function densify(points, step) {
  if (points.length < 2) return points
  const out = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    const n = Math.max(1, Math.round(len / step))
    for (let k = 0; k < n; k++) {
      const t = k / n
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
    }
  }
  out.push(points[points.length - 1])
  return out
}

/**
 * Distance to the road, from a grid rather than from the point list.
 *
 * The naive version measures every pixel against every sample, which at
 * this size is tens of millions of comparisons and visibly stalls the
 * page. Bucketing the samples into a coarse grid and checking only the
 * neighbouring buckets costs one pass to build and a handful of
 * comparisons per lookup.
 */
function distanceField(path, aw, ah) {
  const CELL = 24
  const cols = Math.ceil(aw / CELL) + 1
  const rows = Math.ceil(ah / CELL) + 1
  const buckets = new Map()
  for (const p of path) {
    const key = Math.floor(p.y / CELL) * cols + Math.floor(p.x / CELL)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(p)
  }
  return (x, y) => {
    const cx = Math.floor(x / CELL)
    const cy = Math.floor(y / CELL)
    let best = Infinity
    // Two rings out, so a lookup still finds the road when the nearest
    // stretch of it is a whole cell away.
    for (let r = cy - 2; r <= cy + 2; r++) {
      if (r < 0 || r >= rows) continue
      for (let c = cx - 2; c <= cx + 2; c++) {
        if (c < 0 || c >= cols) continue
        const list = buckets.get(r * cols + c)
        if (!list) continue
        for (const p of list) {
          const dd = (p.x - x) ** 2 + (p.y - y) ** 2
          if (dd < best) best = dd
        }
      }
    }
    return Math.sqrt(best)
  }
}

const rgb = ([r, g, b]) => `rgb(${r},${g},${b})`
