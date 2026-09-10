import { useEffect, useState } from 'react'
import { PLACES, SCALE, loadSheet, nightPixel, WORLD_SRC } from '../lib/tileset'
import { markFor } from './TimelineMarks'

/**
 * What stands at each stop.
 *
 * Two kinds, because the journey has two kinds of place in it. The
 * universities at either end are cities, drawn from the tileset: they
 * are where you arrive and where you are, and they should have weight on
 * the map. Everything between is a marker — a dark plate with the
 * institution's own outline mark on it — because a competition or a
 * paper is a thing that happened at a point, not a settlement, and
 * giving each one a building made nine identical-looking towns.
 *
 * The marks are the site's existing line art, reused rather than
 * reinvented. Drawing nine pixel icons would have meant nine pieces of
 * art that answer to nothing else on the page.
 */

/** Which stops are cities. Everything else gets a marker. */
const CITIES = { leicester: 'city', aston: 'city' }

export const MARKER = 34
const CITY_W = PLACES.city[2] * SCALE
const CITY_H = PLACES.city[3] * SCALE

export function footprintFor(entry) {
  return CITIES[entry.id]
    ? { w: CITY_W, h: CITY_H }
    : { w: MARKER, h: MARKER }
}

/* ------------------------------------------------------------------ */

let cache = null

/**
 * The city sprite, taken to night once and shared.
 *
 * The terrain is graded on the canvas, so a sprite drawn over it at full
 * daylight would be the one bright thing on a dark map. It goes through
 * the same grade, on its own offscreen canvas, once at load.
 */
function buildCity(sheet) {
  const [sx, sy, sw, sh] = PLACES.city
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
  return canvas.toDataURL()
}

/** The city sprite, once the sheet has arrived. */
export function useBuildings() {
  const [city, setCity] = useState(cache)

  useEffect(() => {
    if (cache) return
    let live = true
    loadSheet(WORLD_SRC)
      .then((sheet) => {
        cache = buildCity(sheet)
        if (live) setCity(cache)
      })
      .catch(() => {
        // No sheet, no cities. The road and the labels still read.
      })
    return () => {
      live = false
    }
  }, [])

  return city
}

/* ------------------------------------------------------------------ */

export default function Building({ entry, sprites, active }) {
  const accent = entry.accent || 'var(--accent)'
  const { w, h } = footprintFor(entry)

  if (CITIES[entry.id]) {
    if (!sprites) {
      return <span style={{ display: 'block', width: w, height: h }} />
    }
    return (
      <img
        src={sprites}
        alt=""
        aria-hidden="true"
        draggable="false"
        width={w}
        height={h}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
          // Anchored at the base, so hovering lifts the city off its
          // ground rather than zooming it.
          transformOrigin: '50% 100%',
          transform: active ? 'translateY(-6px) scale(1.06)' : 'none',
          transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1)',
          filter: active
            ? `drop-shadow(0 10px 14px rgba(4,10,18,0.7)) drop-shadow(0 0 14px ${accent}66)`
            : 'drop-shadow(0 4px 6px rgba(4,10,18,0.6))',
        }}
      />
    )
  }

  const Mark = markFor(entry)
  return (
    <span
      className="flex items-center justify-center rounded-[7px] border"
      style={{
        width: w,
        height: h,
        color: active ? '#FFE6BC' : '#E6EDF6',
        borderColor: active
          ? 'rgba(255,200,120,0.62)'
          : 'rgba(190,208,226,0.28)',
        background: active ? 'rgba(20,26,34,0.96)' : 'rgba(12,18,26,0.9)',
        boxShadow: active
          ? `0 0 18px ${accent}55, 0 6px 14px rgba(0,0,0,0.6)`
          : '0 4px 10px rgba(0,0,0,0.55)',
        transform: active ? 'translateY(-4px) scale(1.1)' : 'none',
        transition:
          'transform 220ms cubic-bezier(0.22,1,0.36,1), box-shadow 220ms ease, border-color 220ms ease',
      }}
    >
      {Mark ? (
        <Mark width="19" height="19" />
      ) : (
        <span className="font-mono text-[10px]">{entry.monogram || '·'}</span>
      )}
    </span>
  )
}
