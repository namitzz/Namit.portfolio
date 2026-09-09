import { useEffect, useState } from 'react'
import { SCALE, STRUCTURES, loadTileset, tintSprite } from '../lib/tileset'

/**
 * The structure that stands at each stop.
 *
 * Eleven stops, eleven different things: a university gatehouse, a
 * shrine, a triumphal arch, a fountain, a tunnel mouth, a timber gate, a
 * market stall, a long tiled hall, a workshop, a walled court, a
 * cottage. Not eleven houses in eleven colours, which is what the map
 * had before and what made every stop read as the same kind of place.
 *
 * Each one is then tinted to its own colour. The timber sprites have a
 * hue to rotate; the stone ones do not, so those are given a hue and a
 * saturation outright. Assigned by hand rather than generated, so
 * neighbours on the road never land on the same colour and no two stops
 * in a row are the same material.
 */

const LOOK = {
  // Stone, entered rather than lived in: the gate you go through to
  // start a degree.
  leicester: { of: 'gatehouse', hue: 0.985, floor: 0.52, lift: 0.86 },
  // A small shrine on a plinth, which is what an award is.
  modelling: { of: 'shrine', hue: 0.11, floor: 0.44, lift: 1.05 },
  // A triumphal arch for a win.
  consultancy: { of: 'archLight', hue: 0.07, floor: 0.52, lift: 0.96 },
  // A fountain: the civic square where a delegation is received.
  consul: { of: 'fountain', hue: 0.55, floor: 0.2 },
  // A way in through the dark, which is the whole shape of a CTF.
  ctf: { of: 'archDark', hue: 0.45, floor: 0.42, lift: 1.3 },
  microinternship: { of: 'woodgate', rot: -52, sat: 0.85, lift: 1.12 },
  // Commerce, and the only awning on the map.
  cloudseven: { of: 'stall', rot: 150, sat: 0.7, lift: 1.1 },
  // A long low hall: a press.
  classfutures: { of: 'roof', rot: -120, sat: 0.62, lift: 1.18 },
  // The workshop the dissertation was built in.
  uniwise: { of: 'hall', rot: 80, sat: 0.7, lift: 1.15 },
  // Blue rather than violet: at 0.73 this walled court and the press's
  // purple roof were the same colour from across the map.
  graduation: { of: 'keep', hue: 0.6, floor: 0.42, lift: 0.9 },
  // The warmest, most worked sprite on the sheet, for where I am now.
  aston: { of: 'cottage' },
}

const FALLBACK = { of: 'cottage' }

const lookFor = (entry) => LOOK[entry.id] || FALLBACK

/**
 * What a stop takes up on the map, in CSS pixels.
 *
 * Every structure is a different size, so nothing downstream may assume
 * one. The card placement, the hover target and the map's own clearing
 * of building plots all ask here.
 */
export function footprintFor(entry) {
  const [, , w, h] = STRUCTURES[lookFor(entry).of] || STRUCTURES.cottage
  return { w: w * SCALE, h: h * SCALE }
}

/* ------------------------------------------------------------------ */

/**
 * Every tinted sprite, built once and shared. Tinting walks a sprite's
 * pixels, so doing it per stop per render would be eleven passes over
 * the whole set on every hover. Doing it once at load costs nothing.
 */
let cache = null

function buildAll(sheet) {
  const out = {}
  for (const [id, look] of Object.entries(LOOK)) {
    out[id] = tintSprite(sheet, STRUCTURES[look.of], look).toDataURL()
  }
  out._fallback = tintSprite(sheet, STRUCTURES.cottage).toDataURL()
  return out
}

/** The tinted sprites, once the sheet has arrived. */
export function useBuildings() {
  const [sprites, setSprites] = useState(cache)

  useEffect(() => {
    if (cache) return
    let live = true
    loadTileset()
      .then((sheet) => {
        cache = buildAll(sheet)
        if (live) setSprites(cache)
      })
      .catch(() => {
        // No sheet, no buildings. The road and the labels still read.
      })
    return () => {
      live = false
    }
  }, [])

  return sprites
}

export default function Building({ entry, sprites, active }) {
  const { w, h } = footprintFor(entry)
  const src = sprites?.[entry.id] || sprites?._fallback
  // Nothing is drawn until the art is here. A placeholder box would be a
  // grey rectangle standing where a building goes, which is worse than a
  // gap for the fraction of a second it takes to decode one PNG.
  if (!src) return <span style={{ display: 'block', width: w, height: h }} />

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable="false"
      width={w}
      height={h}
      style={{
        display: 'block',
        imageRendering: 'pixelated',
        // Anchored at the base, so hovering lifts the structure off its
        // plot rather than zooming it. Scale alone reads as a zoom;
        // lifting and shadowing together reads as picking something up,
        // which is what "pops" has to mean on a map seen from above.
        transformOrigin: '50% 100%',
        transform: active ? 'translateY(-8px) scale(1.07)' : 'none',
        transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1)',
        filter: active
          ? 'drop-shadow(0 12px 12px rgba(12,26,12,0.55))'
          : 'drop-shadow(0 4px 3px rgba(12,26,12,0.4))',
      }}
    />
  )
}
