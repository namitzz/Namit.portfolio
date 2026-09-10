/**
 * Where things are on the journey map.
 *
 * The map is a single painted image rather than a tilemap, so everything
 * that has to line up with it is stored here as a fraction of the image
 * rather than as pixels. Fractions survive the map being drawn at any
 * size, which pixels do not.
 *
 * The numbers were read off the artwork and checked by drawing them back
 * over it, which is the only way to be sure a hotspot actually covers the
 * thing it claims to.
 */

/** The image's own proportions, which the plate matches so nothing skews. */
export const MAP_W = 1536
export const MAP_H = 1024
export const MAP_SRC = '/journey-map.webp'

/**
 * The lit trail, traced from the artwork.
 *
 * Used for the light that travels the road and for the figure that walks
 * it. It follows the painted dots closely rather than exactly, which is
 * enough: what moves along it is a soft glow, and a soft glow a few
 * pixels off a dotted line still reads as being on the road.
 */
export const TRAIL = [
  [0.20703, 0.2373],
  [0.22656, 0.23633],
  [0.26042, 0.20215],
  [0.28646, 0.17578],
  [0.31055, 0.16797],
  [0.33854, 0.19238],
  [0.35482, 0.2168],
  [0.3763, 0.23438],
  [0.39714, 0.25586],
  [0.41667, 0.27344],
  [0.4349, 0.28516],
  [0.45573, 0.30273],
  [0.48177, 0.32715],
  [0.51432, 0.34375],
  [0.54688, 0.35938],
  [0.57292, 0.38086],
  [0.58789, 0.39551],
  [0.61849, 0.40527],
  [0.65104, 0.41016],
  [0.67708, 0.41797],
  [0.69206, 0.42676],
  [0.70964, 0.45703],
  [0.72917, 0.47852],
  [0.75521, 0.49316],
  [0.78125, 0.50586],
  [0.79948, 0.51562],
  [0.78125, 0.52734],
  [0.7487, 0.53906],
  [0.70964, 0.54688],
  [0.67057, 0.55469],
  [0.6543, 0.57617],
  [0.64453, 0.60547],
  [0.63477, 0.63477],
  [0.62174, 0.65625],
  [0.61198, 0.66602],
  [0.58919, 0.68359],
  [0.5599, 0.69531],
  [0.5306, 0.68945],
  [0.50911, 0.67773],
  [0.52083, 0.70312],
  [0.54036, 0.72754],
  [0.56641, 0.75],
  [0.59896, 0.77148],
  [0.63802, 0.78613],
  [0.68359, 0.79883],
  [0.7194, 0.80566],
  [0.74414, 0.81055],
]

/**
 * Which milestones are written up further down the page.
 *
 * Three of the eleven have a section of their own; the rest are a
 * competition, a visit or a placement, and their reference is the link
 * in the card rather than anything on this page. Double-clicking one of
 * these three jumps to it, and the card says so, because a shortcut
 * nobody is told about is not a feature.
 */
export const SECTIONS = {
  uniwise: { id: 'uniwise', label: 'Read the case study' },
  cloudseven: { id: 'cloud', label: 'Read the case study' },
  classfutures: { id: 'writing', label: 'See it in writing' },
}

/**
 * Each milestone: the lit node it sits on, and the box you can click.
 *
 * `at` is the glowing node on the road, which is what the walking figure
 * heads for and what the detail card is anchored to. `hit` is the icon
 * and its caption together, as [x, y, w, h] — the caption is painted into
 * the map, so the thing a reader would aim at is the label, not the dot.
 */
export const PLACES = {
  leicester: {
    at: [0.20703, 0.2373],
    hit: [0.0651, 0.2002, 0.11198, 0.08984],
  },
  modelling: {
    at: [0.31055, 0.16797],
    hit: [0.32357, 0.10938, 0.11784, 0.09766],
  },
  consultancy: {
    at: [0.3763, 0.23438],
    hit: [0.3112, 0.25195, 0.11654, 0.0918],
  },
  consul: {
    at: [0.4349, 0.28516],
    hit: [0.44661, 0.27148, 0.07422, 0.13086],
  },
  microinternship: {
    at: [0.58789, 0.39551],
    hit: [0.58594, 0.34668, 0.09115, 0.10059],
  },
  ctf: {
    at: [0.69206, 0.42676],
    hit: [0.70703, 0.37305, 0.10677, 0.08984],
  },
  classfutures: {
    at: [0.79948, 0.51562],
    hit: [0.8099, 0.46875, 0.07422, 0.09961],
  },
  cloudseven: {
    at: [0.67057, 0.55469],
    hit: [0.67448, 0.50391, 0.10677, 0.09961],
  },
  uniwise: {
    at: [0.61198, 0.66602],
    hit: [0.61458, 0.61133, 0.08073, 0.11328],
  },
  graduation: {
    at: [0.50911, 0.67773],
    hit: [0.44661, 0.66797, 0.10677, 0.10742],
  },
  aston: {
    at: [0.74414, 0.81055],
    hit: [0.7487, 0.74219, 0.17578, 0.16113],
  },
}
