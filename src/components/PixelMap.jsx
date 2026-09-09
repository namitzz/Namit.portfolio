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
  grassA: '#63975A',
  grassB: '#6FA463',
  grassC: '#56854E',
  grassDeep: '#4A7644',
  tuft: '#3F6B3A',
  bloomA: '#E8A9C0',
  bloomB: '#F2E6C8',
  dirt: '#CBB183',
  dirtLite: '#DCC69A',
  dirtEdge: '#A98D5E',
  dirtGrit: '#B69A6C',
  water: '#3E85B0',
  waterLite: '#57A2C8',
  waterFoam: '#9AD2E4',
  waterDeep: '#2E6A90',
  cliffTop: '#6E9C5C',
  cliffTopLite: '#7CAD68',
  cliffFace: '#8A6A45',
  cliffFaceDark: '#6B5033',
  cliffLip: '#AE8A58',
  canopy: '#3B7238',
  canopyLite: '#4C8A44',
  canopyHi: '#5FA254',
  canopyDeep: '#2C5A2B',
  trunk: '#5A3F27',
  fence: '#8A6A45',
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
        // Raised ground: the frame of the map, plus a few interior
        // plateaus so the terrain steps rather than sitting on one level.
        const plateau =
          hash2((c >> 3) + 41, (r >> 3) + 17) > 0.86 && dRouteFar(route, x, y)
        if (edge < 22 + rand() * 14 || plateau) kind = 'cliff'
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
        // Grass in patches rather than per-tile noise. A fresh random
        // per tile is television static; a low-frequency term makes
        // neighbouring tiles agree, so the field reads as meadow with
        // lighter and darker ground rather than as dither.
        const patch = hash2((c >> 2) + 7, (r >> 2) + 13)
        ctx.fillStyle =
          patch > 0.66 ? C.grassB : patch > 0.3 ? C.grassA : C.grassC
        ctx.fillRect(t.x, t.y, TILE, TILE)

        if (t.kind === 'water') {
          const shore =
            grid[r - 1]?.[c]?.kind !== 'water' ||
            grid[r + 1]?.[c]?.kind !== 'water' ||
            grid[r]?.[c - 1]?.kind !== 'water' ||
            grid[r]?.[c + 1]?.kind !== 'water'
          ctx.fillStyle = shore ? C.waterLite : C.waterDeep
          ctx.fillRect(t.x, t.y, TILE, TILE)
          // Two ripples per tile, offset by the tile's own noise, so the
          // surface moves without anything animating.
          ctx.fillStyle = shore ? C.waterFoam : C.water
          ctx.fillRect(t.x + 2, t.y + 4 + (t.tone > 0.5 ? 2 : 0), 6, 2)
          ctx.fillRect(t.x + 8, t.y + 10 - (t.tone > 0.5 ? 2 : 0), 5, 2)
        } else if (t.kind === 'path') {
          ctx.fillStyle = C.dirt
          ctx.fillRect(t.x, t.y, TILE, TILE)
          // Worn centre and a little grit, so the road has a camber
          // instead of being one flat band of brown.
          ctx.fillStyle = C.dirtLite
          ctx.fillRect(t.x + 2, t.y + 2, TILE - 4, TILE - 4)
          if (t.tone > 0.72) {
            ctx.fillStyle = C.dirtGrit
            ctx.fillRect(t.x + 5, t.y + 4, 3, 2)
            ctx.fillRect(t.x + 9, t.y + 10, 2, 2)
          }
        } else if (t.kind === 'cliff') {
          // The top surface is grass seen from above, so raised ground
          // still reads as ground.
          ctx.fillStyle = t.tone > 0.5 ? C.cliffTopLite : C.cliffTop
          ctx.fillRect(t.x, t.y, TILE, TILE)
        } else if (t.tone > 0.88) {
          // Grass tuft: a few pixels, which is all an overworld ever used.
          ctx.fillStyle = C.tuft
          ctx.fillRect(t.x + 4, t.y + 10, 4, 2)
          ctx.fillRect(t.x + 5, t.y + 8, 2, 2)
          ctx.fillRect(t.x + 10, t.y + 6, 2, 3)
        } else if (t.tone < 0.055) {
          // Blossom. Small, sparse, and the only warm thing on the
          // ground, which is what stops the green reading as flat.
          ctx.fillStyle = t.x % 3 ? C.bloomA : C.bloomB
          ctx.fillRect(t.x + 5, t.y + 6, 2, 2)
          ctx.fillRect(t.x + 9, t.y + 9, 2, 2)
          ctx.fillRect(t.x + 7, t.y + 11, 2, 2)
        }
      }
    }

    // Cliff faces. A raised tile with open ground below it shows its
    // side, lit at the lip and darkening down, so the step reads as a
    // drop rather than as a change of colour.
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const t = grid[r][c]
        if (t.kind !== 'cliff') continue
        if (grid[r + 1]?.[c]?.kind === 'cliff') continue
        ctx.fillStyle = C.cliffLip
        ctx.fillRect(t.x, t.y + TILE - 3, TILE, 3)
        ctx.fillStyle = C.cliffFace
        ctx.fillRect(t.x, t.y + TILE, TILE, 11)
        ctx.fillStyle = C.cliffFaceDark
        ctx.fillRect(t.x, t.y + TILE + 11, TILE, 4)
        // Returns on the exposed sides, so a plateau corner has a
        // thickness rather than a cut edge.
        if (grid[r]?.[c - 1]?.kind !== 'cliff') {
          ctx.fillStyle = C.cliffFaceDark
          ctx.fillRect(t.x, t.y + TILE - 3, 3, 14)
        }
        if (grid[r]?.[c + 1]?.kind !== 'cliff') {
          ctx.fillStyle = C.cliffFaceDark
          ctx.fillRect(t.x + TILE - 3, t.y + TILE - 3, 3, 14)
        }
        // A couple of pixels of rubble, so the face is not a flat band.
        if (t.tone > 0.6) {
          ctx.fillStyle = C.cliffFaceDark
          ctx.fillRect(t.x + 4, t.y + TILE + 3, 3, 3)
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
  // Same direction as every building's shadow, so one light governs the
  // whole map.
  ctx.fillStyle = 'rgba(22,36,20,0.30)'
  ctx.fillRect(x + 4, y + 13, 12, 4)
  ctx.fillRect(x + 2, y + 14, 16, 2)

  ctx.fillStyle = C.trunk
  ctx.fillRect(x + 7, y + 11, 3, 5)

  // The canopy is built in courses, widest in the middle, so its
  // silhouette rounds off instead of ending in a hard corner.
  const mid = lite ? C.canopyLite : C.canopy
  ctx.fillStyle = C.canopyDeep
  ctx.fillRect(x + 2, y + 8, 13, 4)
  ctx.fillStyle = mid
  ctx.fillRect(x + 4, y + 1, 9, 3)
  ctx.fillRect(x + 2, y + 3, 13, 3)
  ctx.fillRect(x + 1, y + 5, 15, 4)
  ctx.fillRect(x + 3, y + 9, 11, 2)
  // Highlight on the side the light comes from, which is what turns a
  // flat blob into something with a top.
  ctx.fillStyle = lite ? C.canopyHi : C.canopyLite
  ctx.fillRect(x + 5, y + 2, 5, 2)
  ctx.fillRect(x + 3, y + 4, 4, 2)
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

/** True when a point is well clear of the road, so terrain never blocks it. */
const dRouteFar = (route, x, y) => nearRoute(route, x, y) > 96

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
