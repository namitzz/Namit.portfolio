/**
 * The map's art: two CC-BY sheets, and the coordinates of the pieces
 * this site uses from them.
 *
 * The map used to be a village drawn from a Zelda-like tileset. It was
 * good pixel art and it was the wrong pixel art: a village set has no
 * mountains, no coastline, no rivers and no cities, so a journey across
 * a country could only ever be a walk down a street. This is a worldmap
 * set, which has all four, and the map is a world now.
 *
 * Sheets are MrBeast's "Worldmap/Overworld tileset" (CC BY 3.0) and, for
 * the walking figure only, ArMM1998's "Zelda-like tilesets and sprites"
 * (CC0). See public/tiles/CREDITS.txt.
 */

/** Source tile size, in sheet pixels. */
export const TILE = 16

/**
 * Sheet pixels to CSS pixels. Pixel art at 1:1 on a modern display is
 * too fine to read as pixel art; at 2 each source pixel is a visible
 * square, which is the whole point of the style.
 */
export const SCALE = 2

export const WORLD_SRC = '/tiles/world.png'
export const MOUNTAIN_SRC = '/tiles/mountains.png'

/* ---------------------------------------------------------------- */
/* Atlas                                                             */

/**
 * The sheet has no seamless grass tile: it is drawn to sit on a flat
 * ground colour with autotiles laid over the top. This is that colour,
 * sampled from the sheet's own grass, with two neighbours for mottling.
 */
export const GROUND = [90, 128, 44]
export const GROUND_LIGHT = [97, 139, 48]
export const GROUND_DARK = [82, 117, 41]

/** Deep water, shallow water, and the foam where it meets land. */
export const SEA_DEEP = [38, 86, 140]
export const SEA_SHALLOW = [48, 104, 162]
export const FOAM = [226, 244, 250]

/**
 * The road, and its shoulder — already in night values.
 *
 * The road is laid after the night grade rather than before it. Graded
 * like everything else, a bright warm track came out blue-grey, because
 * the grade keeps blue and cuts red, and then the lamps lit it to a pale
 * ribbon. Drawn afterwards it can be what a dirt road at night actually
 * is: dark, and warm where the light falls on it.
 */
export const ROAD = [96, 78, 56]
export const ROAD_EDGE = [66, 55, 41]

/**
 * Forest, as a nine-slice. Row is north/middle/south, column is
 * west/middle/east, so a patch gets its own edges and the wood stops
 * looking like a rectangle of trees.
 */
export const FOREST = [
  [[48, 160], [64, 160], [80, 160]],
  [[48, 176], [64, 176], [80, 176]],
  [[48, 192], [64, 192], [80, 192]],
]

/**
 * The same wood under snow, for the ground below the northern range.
 *
 * A snow line is the cheapest altitude cue there is: the eye reads a
 * band of white trees under a white summit as high ground without being
 * told, and the map stops being flat country with mountains stuck round
 * the edge.
 */
export const FOREST_SNOW = [
  [[96, 160], [112, 160], [128, 160]],
  [[96, 176], [112, 176], [128, 176]],
  [[96, 192], [112, 192], [128, 192]],
]

/** The ground up there, and the ground where the sea meets the land. */
export const SNOW_GROUND = [214, 222, 230]
export const SAND = [206, 186, 140]

/**
 * Mountains, as whole ranges rather than tiles: each is a single sprite
 * of a jagged massif, and a chain of them overlapping reads as a range.
 * `s` is snow-capped, for the high ground.
 */
export const RANGES = {
  grey: [7, 15, 73, 68],
  greySmall: [0, 96, 60, 64],
  snow: [104, 15, 82, 69],
  snowSmall: [104, 96, 56, 64],
}

/**
 * A road crossing a river: the sheet draws the bridge and the water it
 * spans as one tile, so the crossing is a single blit rather than a
 * bridge that has to be lined up against a river drawn separately.
 */
export const BRIDGE = [208, 240, 16, 16]

/** Places, as [x, y, w, h] on the world sheet. */
export const PLACES = {
  walledCity: [32, 249, 62, 46],
  village: [2, 250, 44, 28],
  tower: [146, 294, 11, 35],
  field: [0, 248, 32, 30],
  cave: [82, 258, 28, 14],
}

/**
 * A city, as a skyline of towers rather than as one sprite.
 *
 * The sheet has no city: it has a walled keep, which reads as a castle,
 * and a single tower. A search for a CC0 modern skyline at world-map
 * scale in this perspective turned up nothing — the packs that exist are
 * street-scale and flat top-down, which will not stand beside terrain
 * drawn in elevation.
 *
 * So the skyline is composed from that one tower, cut to different
 * heights and staggered. Seven of them at varying heights give the
 * silhouette a city has and a castle does not, and it stays in one
 * style because it is all the same sprite.
 *
 * Each entry is [x, topCrop, lift]: where the tower stands, how much of
 * its top is cut off, and how far it sits forward of the back row.
 */
export const SKYLINE = [
  [0, 14, 2],
  [11, 0, 0],
  [23, 20, 4],
  [34, 6, 1],
  [45, 18, 3],
  [56, 2, 0],
  [67, 16, 2],
]
export const SKYLINE_W = 78
export const SKYLINE_H = 56

/* ---------------------------------------------------------------- */
/* Loading                                                           */

const cache = new Map()

/** One sheet, loaded once and shared by everything that wants it. */
export function loadSheet(src) {
  if (cache.has(src)) return cache.get(src)
  const pending = new Promise((resolve, reject) => {
    if (typeof Image === 'undefined') {
      reject(new Error('no DOM'))
      return
    }
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`could not load ${src}`))
    img.src = src
  })
  cache.set(src, pending)
  return pending
}

/** Both map sheets, together, because the map needs both to draw once. */
export function loadTileset() {
  return Promise.all([loadSheet(WORLD_SRC), loadSheet(MOUNTAIN_SRC)]).then(
    ([world, mountains]) => ({ world, mountains }),
  )
}

/* ---------------------------------------------------------------- */
/* Night                                                             */

/**
 * One pixel, taken from daylight to night.
 *
 * Not a dimmer. Turning the brightness down gives you a grey daytime
 * map; night is a change of hue as well as level, because at low light
 * the eye loses red first and blue last. So red is cut hardest, blue
 * kept, and a little of the pixel's own luminance folded back in so that
 * what was bright stays relatively bright and the art keeps its
 * modelling instead of flattening into silhouette.
 */
export function nightPixel(r, g, b) {
  const l = r * 0.3 + g * 0.59 + b * 0.11
  return [
    r * 0.19 + l * 0.1 + 3,
    g * 0.27 + l * 0.06 + 7,
    Math.min(255, b * 0.44 + l * 0.1 + 22),
  ]
}

/**
 * A sprite cut from a sheet and taken to night, as a canvas.
 *
 * Anything drawn after the map has been graded has to be graded itself,
 * or it stands in daylight on a dark map. Built once and reused, because
 * this walks every pixel of the sprite.
 */
export function nightSprite(sheet, [sx, sy, sw, sh]) {
  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(sheet, sx, sy, sw, sh, 0, 0, sw, sh)
  const data = ctx.getImageData(0, 0, sw, sh)
  const p = data.data
  for (let i = 0; i < p.length; i += 4) {
    if (p[i + 3] === 0) continue
    const [r, g, b] = nightPixel(p[i], p[i + 1], p[i + 2])
    p[i] = r
    p[i + 1] = g
    p[i + 2] = b
  }
  ctx.putImageData(data, 0, 0)
  return canvas
}

/* ---------------------------------------------------------------- */
/* Noise                                                             */

/** Stable value noise, so the same world is drawn on every load. */
export function hash2(a, b) {
  let h = (a * 374761393 + b * 668265263) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

/**
 * Fractal noise: several octaves of value noise, each half the
 * amplitude and twice the frequency of the last. One octave gives soft
 * blobs; four give something with both a shape and a texture, which is
 * what coastlines and woodland need.
 */
export function fbm(x, y, octaves = 4, freq = 0.012) {
  let total = 0
  let amp = 1
  let f = freq
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    const xi = x * f
    const yi = y * f
    const x0 = Math.floor(xi)
    const y0 = Math.floor(yi)
    let fx = xi - x0
    let fy = yi - y0
    // Smoothstep, so the lattice does not show as a grid of diamonds.
    fx = fx * fx * (3 - 2 * fx)
    fy = fy * fy * (3 - 2 * fy)
    const n =
      (hash2(x0, y0) * (1 - fx) + hash2(x0 + 1, y0) * fx) * (1 - fy) +
      (hash2(x0, y0 + 1) * (1 - fx) + hash2(x0 + 1, y0 + 1) * fx) * fy
    total += n * amp
    norm += amp
    amp *= 0.5
    f *= 2
  }
  return total / norm
}

/* ---------------------------------------------------------------- */
/* Route geometry                                                    */

/**
 * The road as a smooth curve through the stops.
 *
 * Straight runs between milestones read as a diagram: the road changes
 * direction with a hard corner at every stop, which is not how a road
 * behaves and not what the map is trying to say. A Catmull-Rom spline
 * passes exactly through each point and rounds everything between, so
 * the route bends the way a road bends.
 *
 * Both the drawn road and the SVG route ask this, so the dirt on the
 * ground and the lit trail over it are the same line rather than two
 * lines that happen to agree at the stops.
 */
export function smoothRoute(points, per = 14) {
  if (points.length < 3) return points.slice()
  const at = (i) => points[Math.max(0, Math.min(points.length - 1, i))]
  const out = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    for (let k = 0; k < per; k++) {
      const t = k / per
      const t2 = t * t
      const t3 = t2 * t
      out.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      })
    }
  }
  out.push(points[points.length - 1])
  return out
}
