/**
 * The map's art: one CC0 sprite sheet, and the coordinates of the pieces
 * this site uses from it.
 *
 * The map used to be drawn: every tile was a handful of `fillRect` calls
 * approximating pixel art. That can get close to the palette of an
 * overworld but never to its craft, because the craft is in thousands of
 * individually placed pixels. So the drawing is gone and the map now
 * blits real tiles from a real tileset.
 *
 * The sheet is ArMM1998's "Zelda-like tilesets and sprites", released
 * CC0. See public/tiles/CREDITS.txt.
 *
 * Coordinates below are in the sheet's own pixels. Every terrain tile
 * here was checked to wrap cleanly against itself, so a field of them has
 * no seam running through it.
 */

/** Source tile size, in sheet pixels. */
export const TILE = 16

/**
 * Sheet pixels to CSS pixels. Pixel art at 1:1 on a modern display is too
 * fine to read as pixel art; at 2 each source pixel is a visible square,
 * which is the whole point of the style.
 */
export const SCALE = 2

const SRC = '/tiles/overworld.png'

/* ---------------------------------------------------------------- */
/* Atlas                                                             */

/** Grass, six ways. Same family, so the field varies without patching. */
export const GRASS = [
  [240, 480],
  [272, 480],
  [288, 480],
  [272, 464],
  [288, 464],
  [272, 512],
]

/** Trodden earth. Two is enough: more brought paving in with them. */
export const DIRT = [
  [16, 480],
  [32, 512],
]

/** Sprites, as [x, y, w, h]. */
export const SPRITES = {
  tree: [80, 256, 32, 32],
  bush: [32, 224, 16, 16],
  rocks: [176, 160, 32, 16],
}

/** Flower beds. Warm ground, and the only warm thing on the grass. */
export const FLOWERS = [
  [0, 544, 16, 16],
  [16, 544, 16, 16],
  [0, 560, 16, 16],
]

/**
 * Every structure the map can stand at a stop, as [x, y, w, h].
 *
 * Eleven of them, and no two alike. The sheet has exactly two houses, so
 * a town built only out of houses can never be more than two shapes in
 * eleven colours. These are the rest of what the artist drew that stands
 * on the ground: gates, arches, a market stall, a fountain, a walled
 * court, a shrine. A journey has more kinds of place in it than houses.
 *
 * Each box was cut to the sprite's own pixels and checked against the
 * grass. The sheet packs sprites tightly, so a lazy crop brings in a
 * neighbour: `hall` is 76 wide rather than its apparent 79 because the
 * next three columns are the water tile beside it, which arrived as a
 * blue stripe down its side.
 */
export const STRUCTURES = {
  cottage: [99, 0, 74, 80],
  hall: [179, 0, 76, 80],
  stall: [288, 359, 80, 86],
  gatehouse: [409, 361, 62, 94],
  keep: [313, 457, 62, 71],
  woodgate: [512, 155, 48, 85],
  roof: [390, 196, 87, 72],
  archLight: [392, 504, 48, 40],
  archDark: [168, 504, 48, 40],
  fountain: [352, 144, 48, 48],
  shrine: [98, 355, 26, 30],
}

/* ---------------------------------------------------------------- */
/* Loading                                                           */

let pending = null

/**
 * The sheet, loaded once for the whole app. Returns the same promise to
 * every caller, so the map and the eleven buildings share one decode.
 */
export function loadTileset() {
  if (pending) return pending
  pending = new Promise((resolve, reject) => {
    if (typeof Image === 'undefined') {
      reject(new Error('no DOM'))
      return
    }
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`could not load ${SRC}`))
    img.src = SRC
  })
  return pending
}

/* ---------------------------------------------------------------- */
/* Recolouring                                                       */

/**
 * A tinted copy of one sprite, as a canvas.
 *
 * Eleven stops and two house sprites would be five of each unless the
 * houses can differ, so each one is hue-rotated to its own colour. It is
 * how a real overworld town is built too: one or two roof shapes, many
 * roof colours.
 *
 * The rotation runs in HSL over the sprite's own pixels rather than as a
 * CSS filter, because a CSS filter would also swing the windows, the
 * door and the shadow, and because doing it once at load costs nothing
 * while doing it per frame in the compositor costs every frame.
 */
export function tintSprite(img, [sx, sy, sw, sh], look = {}) {
  const { hue = null, rot = 0, sat = 1, lift = 1, floor = 0 } = look
  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
  // No early return for an untinted sprite: everything still has to be
  // taken to night, or it stands in daylight on a dark map.

  const data = ctx.getImageData(0, 0, sw, sh)
  const p = data.data
  for (let i = 0; i < p.length; i += 4) {
    if (p[i + 3] === 0) continue
    const [h, s, l] = rgbToHsl(p[i], p[i + 1], p[i + 2])
    let hh
    let ss
    if (floor > 0 && s < 0.18) {
      // Grey stone. Rotating its hue does nothing at all, because grey
      // has no hue to rotate, so half the structures on the sheet would
      // have come out identical. These get a hue outright and enough
      // saturation to read as a colour, pulled back in the highlights so
      // the masonry keeps its modelling instead of going flat.
      hh = hue
      ss = floor * (1 - 1.1 * Math.max(0, l - 0.5))
    } else {
      hh = (h + rot / 360 + 1) % 1
      ss = Math.min(1, s * sat)
    }
    // Cool hues read darker than warm ones at the same lightness, so a
    // roof turned blue or violet comes out muddy unless it is lifted to
    // compensate. That is a fact about eyes, not about the maths.
    const [r, g, b] = hslToRgb(
      (hh + 1) % 1,
      Math.max(0, Math.min(1, ss)),
      Math.min(1, l * lift),
    )
    const [nr, ng, nb] = nightPixel(r, g, b)
    p[i] = nr
    p[i + 1] = ng
    p[i + 2] = nb
  }
  ctx.putImageData(data, 0, 0)
  return canvas
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return [h / 6, s, l]
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const c = (t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return [
    Math.round(c(h + 1 / 3) * 255),
    Math.round(c(h) * 255),
    Math.round(c(h - 1 / 3) * 255),
  ]
}

/* ---------------------------------------------------------------- */
/* Night                                                             */

/**
 * One pixel, taken from daylight to night.
 *
 * Not a dimmer. Turning the brightness down gives you a grey daytime
 * map; night is a change of hue as well as level, because at low light
 * the eye loses red first and blue last. So red is cut hardest, blue
 * kept, and a little of the pixel's own luminance is folded back in so
 * that what was bright stays relatively bright and the art keeps its
 * modelling instead of flattening into silhouette.
 *
 * Terrain and structures both run through this, or the buildings would
 * stand in daylight on a map that had gone dark.
 */
export function nightPixel(r, g, b) {
  const l = r * 0.3 + g * 0.59 + b * 0.11
  return [
    r * 0.19 + l * 0.1 + 3,
    g * 0.27 + l * 0.06 + 7,
    Math.min(255, b * 0.44 + l * 0.1 + 22),
  ]
}

/* ---------------------------------------------------------------- */
/* Noise                                                             */

/** Stable value noise, so the same map is drawn on every load. */
export function hash2(a, b) {
  let h = (a * 374761393 + b * 668265263) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
