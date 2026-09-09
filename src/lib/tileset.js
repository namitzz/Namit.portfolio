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
  fountain: [352, 144, 48, 48],
}

/** Flower beds. Warm ground, and the only warm thing on the grass. */
export const FLOWERS = [
  [0, 544, 16, 16],
  [16, 544, 16, 16],
  [0, 560, 16, 16],
]

/**
 * The two houses. `hall` is the wider one with dormers in its roof and no
 * door on the face; `cottage` has the door, the windows and the rose
 * light in the gable.
 *
 * The hall is cropped to 76 rather than its apparent 79: the three
 * columns past that belong to the water tile sitting next to it on the
 * sheet, and they came through as a blue stripe down its side.
 */
export const HOUSES = {
  cottage: [99, 0, 74, 80],
  hall: [179, 0, 76, 80],
}

export const HOUSE_W = 74
export const HOUSE_H = 80

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
export function tintSprite(img, [sx, sy, sw, sh], hueShift = 0, sat = 1, lift = 1) {
  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
  if (!hueShift && sat === 1 && lift === 1) return canvas

  const data = ctx.getImageData(0, 0, sw, sh)
  const p = data.data
  for (let i = 0; i < p.length; i += 4) {
    if (p[i + 3] === 0) continue
    const [h, s, l] = rgbToHsl(p[i], p[i + 1], p[i + 2])
    // Cool hues read darker than warm ones at the same lightness, so a
    // roof rotated to blue or violet comes out muddy unless it is lifted
    // to compensate. That is a fact about eyes, not about the maths.
    const [r, g, b] = hslToRgb(
      (h + hueShift / 360 + 1) % 1,
      Math.min(1, s * sat),
      Math.min(1, l * lift),
    )
    p[i] = r
    p[i + 1] = g
    p[i + 2] = b
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
/* Noise                                                             */

/** Stable value noise, so the same map is drawn on every load. */
export function hash2(a, b) {
  let h = (a * 374761393 + b * 668265263) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
