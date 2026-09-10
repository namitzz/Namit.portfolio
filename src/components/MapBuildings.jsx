import { useEffect, useState } from 'react'
import {
  PLACES,
  SCALE,
  SKYLINE,
  SKYLINE_H,
  SKYLINE_W,
  WORLD_SRC,
  hash2,
  loadSheet,
  nightPixel,
} from '../lib/tileset'
import { markFor } from './TimelineMarks'

/**
 * What stands at each stop.
 *
 * Two kinds, because the journey has two kinds of place in it. The
 * universities at either end are cities, and everything between is a
 * plate carrying the institution's own outline mark. A competition or a
 * paper happened at a point, not in a settlement, and giving each one a
 * building made nine identical-looking towns.
 *
 * The marks are the site's existing line art, reused rather than
 * reinvented. Drawing nine pixel icons would have meant nine pieces of
 * art that answer to nothing else on the page.
 */

/** Which stops are cities. Everything else gets a marker. */
const CITIES = { leicester: true, aston: true }

export const MARKER = 34
const CITY_W = SKYLINE_W * SCALE
const CITY_H = SKYLINE_H * SCALE

export function footprintFor(entry) {
  return CITIES[entry.id] ? { w: CITY_W, h: CITY_H } : { w: MARKER, h: MARKER }
}

/* ------------------------------------------------------------------ */

let cache = null

/**
 * The city, composed once: towers, then night, then the lights coming on.
 *
 * The windows are painted after the grade rather than before it. A lit
 * window is a light source, and a light source does not get darker when
 * night falls — grading it with the masonry turned the whole skyline off.
 */
function buildCity(sheet) {
  const canvas = document.createElement('canvas')
  canvas.width = SKYLINE_W
  canvas.height = SKYLINE_H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingEnabled = false

  const [tx, ty, tw, th] = PLACES.tower
  for (const [x, cut, lift] of SKYLINE) {
    const h = th - cut
    ctx.drawImage(sheet, tx, ty + cut, tw, h, x, SKYLINE_H - h - lift, tw, h)
  }

  const data = ctx.getImageData(0, 0, SKYLINE_W, SKYLINE_H)
  const p = data.data
  for (let i = 0; i < p.length; i += 4) {
    if (p[i + 3] === 0) continue
    const [r, g, b] = nightPixel(p[i], p[i + 1], p[i + 2])
    p[i] = r
    p[i + 1] = g
    p[i + 2] = b
  }
  ctx.putImageData(data, 0, 0)

  // Lit windows, on the towers only and never on empty sky: the alpha of
  // the graded skyline is the mask.
  ctx.globalCompositeOperation = 'source-atop'
  for (const [x, cut, lift] of SKYLINE) {
    const h = th - cut
    const top = SKYLINE_H - h - lift
    for (let wy = top + 5; wy < SKYLINE_H - lift - 3; wy += 4) {
      for (let wx = x + 2; wx < x + tw - 2; wx += 3) {
        if (hash2(wx * 7, wy * 13) < 0.55) continue
        ctx.fillStyle =
          hash2(wx, wy) > 0.75 ? 'rgba(255,226,168,0.95)' : 'rgba(226,186,120,0.7)'
        ctx.fillRect(wx, wy, 1, 1)
      }
    }
  }
  ctx.globalCompositeOperation = 'source-over'
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
