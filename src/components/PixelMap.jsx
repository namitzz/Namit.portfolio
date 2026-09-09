import { useEffect, useRef } from 'react'

/**
 * The ground: a top-down tile map in the overworld tradition, drawn to a
 * canvas rather than assembled out of vector shapes.
 *
 * Tiles, not illustration. Every cell is classified once — path, water,
 * grass, tree, cliff — and painted as flat colour with hard edges, which
 * is what makes it read as a tile map instead of a drawing of one. The
 * canvas is drawn a single time per size; nothing here animates.
 *
 * The path is not decoration laid near the route: it is carved from the
 * route. Cells within a fixed distance of the actual spline become dirt,
 * so the road on the map and the journey through the timeline are the
 * same line, and a stop always stands on its own road.
 *
 * Everything is seeded, so the same map is drawn on every load. A
 * landscape that rearranges itself between visits is wallpaper.
 */

const TILE = 16
const PATH_HALF = 26

// Muted a little from a true overworld palette, so the section can carry
// cream type and a warm accent without either fighting the grass.
const C = {
  grassA: '#5E8F52',
  grassB: '#688F58',
  grassC: '#547F4A',
  tuft: '#48713F',
  dirt: '#B49463',
  dirtEdge: '#93764B',
  water: '#3E7FA3',
  waterLite: '#4E96B8',
  cliff: '#7A5E3F',
  cliffTop: '#93724C',
  canopy: '#396B37',
  canopyLite: '#457F41',
  trunk: '#5A3F27',
}

export default function PixelMap({ d, width, height }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !width || !height || !d) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // Hard edges: a tile map that resamples smoothly stops being one.
    ctx.imageSmoothingEnabled = false

    const cols = Math.ceil(width / TILE)
    const rows = Math.ceil(height / TILE)
    const rand = seeded(0x5bf03635)

    // Sample the route once, then measure each cell against those samples.
    // Cheaper than solving the spline per cell, and accurate enough at
    // tile resolution.
    const route = sampleRoute(d, 900)

    // Ponds, kept off the road. Any that would sit on the route is
    // dropped rather than nudged, so water never interrupts the path.
    const ponds = [
      { x: width * 0.12, y: height * 0.76, rx: 86, ry: 46 },
      { x: width * 0.83, y: height * 0.18, rx: 70, ry: 38 },
      { x: width * 0.46, y: height * 0.86, rx: 64, ry: 32 },
    ].filter((p) => nearRoute(route, p.x, p.y) > 74)

    const grid = []
    for (let r = 0; r < rows; r++) {
      grid[r] = []
      for (let c = 0; c < cols; c++) {
        const x = c * TILE + TILE / 2
        const y = r * TILE + TILE / 2
        const edge = Math.min(x, y, width - x, height - y)
        const dRoute = nearRoute(route, x, y)

        let kind = 'grass'
        if (edge < 26 + rand() * 16) kind = 'cliff'
        else if (dRoute < PATH_HALF) kind = 'path'
        else if (ponds.some((p) => inPond(p, x, y))) kind = 'water'
        // Trees clump. A per-tile coin toss gives evenly scattered
        // shrubs; woodland needs a low-frequency term so neighbouring
        // tiles agree with each other, with the coin toss only breaking
        // up the edges.
        else if (dRoute > 48) {
          const clump = hash2(c >> 2, r >> 2)
          if (clump * 0.72 + rand() * 0.28 > 0.44) kind = 'tree'
        }

        grid[r][c] = { kind, x: c * TILE, y: r * TILE, tone: rand() }
      }
    }

    // --- paint ---
    ctx.clearRect(0, 0, width, height)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const t = grid[r][c]
        // Grass under everything, so a tree or a tuft never sits on a hole.
        ctx.fillStyle =
          t.tone > 0.72 ? C.grassB : t.tone > 0.36 ? C.grassA : C.grassC
        ctx.fillRect(t.x, t.y, TILE, TILE)

        if (t.kind === 'water') {
          ctx.fillStyle = t.tone > 0.5 ? C.water : C.waterLite
          ctx.fillRect(t.x, t.y, TILE, TILE)
        } else if (t.kind === 'path') {
          ctx.fillStyle = C.dirt
          ctx.fillRect(t.x, t.y, TILE, TILE)
        } else if (t.kind === 'cliff') {
          ctx.fillStyle = t.tone > 0.5 ? C.cliff : C.cliffTop
          ctx.fillRect(t.x, t.y, TILE, TILE)
        } else if (t.tone > 0.93) {
          // Grass tuft: two pixels, which is all an overworld ever used.
          ctx.fillStyle = C.tuft
          ctx.fillRect(t.x + 5, t.y + 9, 3, 2)
          ctx.fillRect(t.x + 9, t.y + 6, 2, 3)
        }
      }
    }

    // Edges after the fill, so a tile's border always sits on its
    // finished neighbour rather than under it.
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const t = grid[r][c]
        if (t.kind !== 'path' && t.kind !== 'water') continue
        const same = (rr, cc) => grid[rr]?.[cc]?.kind === t.kind
        ctx.fillStyle = t.kind === 'path' ? C.dirtEdge : '#2F6685'
        if (!same(r - 1, c)) ctx.fillRect(t.x, t.y, TILE, 2)
        if (!same(r + 1, c)) ctx.fillRect(t.x, t.y + TILE - 2, TILE, 2)
        if (!same(r, c - 1)) ctx.fillRect(t.x, t.y, 2, TILE)
        if (!same(r, c + 1)) ctx.fillRect(t.x + TILE - 2, t.y, 2, TILE)
      }
    }

    // Trees last and slightly oversized, so canopies overlap into
    // clusters the way an overworld's woodland does.
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].kind !== 'tree') continue
        drawTree(ctx, grid[r][c].x, grid[r][c].y, grid[r][c].tone)
      }
    }
  }, [d, width, height])

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

function drawTree(ctx, x, y, tone) {
  const lite = tone > 0.5
  ctx.fillStyle = C.trunk
  ctx.fillRect(x + 7, y + 12, 3, 4)
  ctx.fillStyle = lite ? C.canopyLite : C.canopy
  // A canopy built from three rects reads rounder than a circle does at
  // this size, and stays on the pixel grid.
  ctx.fillRect(x + 3, y + 3, 11, 8)
  ctx.fillRect(x + 1, y + 5, 15, 4)
  ctx.fillRect(x + 5, y + 1, 7, 12)
  ctx.fillStyle = lite ? C.canopy : '#2E5A2C'
  ctx.fillRect(x + 3, y + 10, 11, 2)
}

/** Points along the route, in the map's own coordinates. */
function sampleRoute(d, n) {
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
    out.push({ x: p.x, y: p.y })
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

const inPond = (p, x, y) =>
  ((x - p.x) / p.rx) ** 2 + ((y - p.y) / p.ry) ** 2 < 1

/** Stable value noise on a coarse grid, so woods hold together. */
function hash2(a, b) {
  let h = (a * 374761393 + b * 668265263) >>> 0
  h = (h ^ (h >>> 13)) * 1274126177
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
