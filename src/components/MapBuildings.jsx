import { useEffect, useState } from 'react'
import {
  HOUSES,
  HOUSE_H,
  HOUSE_W,
  SCALE,
  loadTileset,
  tintSprite,
} from '../lib/tileset'

/**
 * The building that stands at each stop.
 *
 * Two house sprites from the tileset, each hue-rotated to its stop's own
 * colour. That is how an overworld town is built: one or two roof
 * shapes, many roof colours, so a street reads as a street rather than
 * as eleven unrelated landmarks.
 *
 * The previous version drew these as SVG — a trapezoid roof, some
 * shingle courses, framed windows. It was as far as drawing can get, and
 * it was not far enough. These are the real thing.
 *
 * The institution marks are not here. At this size a shield is a smudge,
 * so they live in the card where they can be seen.
 */

export const BUILDING_W = HOUSE_W * SCALE
export const BUILDING_H = HOUSE_H * SCALE

/**
 * Which sprite and which colour each stop gets.
 *
 * `hue` is a rotation in degrees off the sheet's own timber brown, `sat`
 * pulls the wood back towards grey where a fully saturated roof would
 * shout, and `lift` brightens it. The cool roofs need the lift: rotated
 * to blue or violet at their original lightness they came out muddy,
 * which made half the street look like it was standing in shade.
 *
 * Assigned by hand rather than generated, so neighbours on the road
 * never land on the same colour.
 */
const LOOK = {
  leicester: { house: 'cottage', hue: 0, sat: 1, lift: 1 },
  modelling: { house: 'hall', hue: -24, sat: 0.95, lift: 1.06 },
  consultancy: { house: 'cottage', hue: 44, sat: 0.9, lift: 1.04 },
  consul: { house: 'hall', hue: 132, sat: 0.62, lift: 1.22 },
  ctf: { house: 'cottage', hue: -66, sat: 0.72, lift: 1.24 },
  microinternship: { house: 'hall', hue: 196, sat: 0.55, lift: 1.26 },
  cloudseven: { house: 'cottage', hue: 22, sat: 1, lift: 1.04 },
  classfutures: { house: 'hall', hue: -104, sat: 0.6, lift: 1.26 },
  uniwise: { house: 'cottage', hue: 78, sat: 0.62, lift: 1.2 },
  graduation: { house: 'hall', hue: -40, sat: 0.9, lift: 1.08 },
  aston: { house: 'cottage', hue: 166, sat: 0.6, lift: 1.24 },
}

const FALLBACK = { house: 'cottage', hue: 0, sat: 1, lift: 1 }

export function buildingFor(entry) {
  return LOOK[entry.id] || FALLBACK
}

/* ------------------------------------------------------------------ */

/**
 * Every tinted sprite, built once and shared. Tinting walks the sprite's
 * pixels, so doing it per stop per render would be eleven passes over
 * 5,920 pixels on every hover. Doing it once at load costs nothing.
 */
let cache = null

function buildAll(sheet) {
  const out = {}
  for (const [id, look] of Object.entries(LOOK)) {
    out[id] = tintSprite(
      sheet,
      HOUSES[look.house],
      look.hue,
      look.sat,
      look.lift,
    ).toDataURL()
  }
  out._fallback = tintSprite(sheet, HOUSES.cottage).toDataURL()
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
  const src = sprites?.[entry.id] || sprites?._fallback
  // Nothing is drawn until the art is here. A placeholder box would be a
  // grey rectangle standing where a house goes, which is worse than a
  // gap for the fraction of a second it takes to decode one PNG.
  if (!src) return <span style={{ display: 'block', width: BUILDING_W, height: BUILDING_H }} />

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable="false"
      width={BUILDING_W}
      height={BUILDING_H}
      style={{
        display: 'block',
        imageRendering: 'pixelated',
        // Anchored at the base, so hovering lifts the building off its
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
