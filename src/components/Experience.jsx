import { useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { timeline } from '../data/content'
import { markFor } from './TimelineMarks'
import Reveal from './Reveal'

/**
 * The route so far, drawn as a serpentine rather than a straight line.
 *
 * Ten stops will not sit on one horizontal run at any sane size, so the
 * route snakes: left to right along the top, a turn at the end, then
 * right to left along the bottom. Reading order follows the line, which
 * is the whole point of drawing it as a route.
 *
 * The path is measured, not guessed. An SVG scaled with
 * preserveAspectRatio would stretch the dashes into different lengths on
 * each run; instead the container is measured and the path is built in
 * real pixels, so every dash is the same dash.
 *
 * Detail pops out beside the stop being pointed at, above or below
 * depending on which run it sits on, and clamped to the container so it
 * never leaves the section. Below `md` the whole thing becomes a vertical
 * spine with every detail already open, because there is no hover.
 */

// The gap between the two passes is set by the cards, not the line. A card
// runs to about 290px tall and has to open fully inside the section:
// measured at the first attempt, a 210px gap pushed upper-pass cards past
// the section's bottom edge and lower-pass cards up through the heading.
const ROW_GAP = 470
const PAD_TOP = 100
const CARD_W = 340
// Clears a stop's own label band, so a card never has to dodge the
// neighbours sharing its pass.
const CARD_OFFSET = 120
const EDGE = 90
// How far a stop may sit off its band, and how many ride the upper one.
const JITTER = 64
const STOPS_TOP = 6

export default function Experience() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [active, setActive] = useState(null)

  const height = PAD_TOP + ROW_GAP + PAD_TOP

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = () => setBox({ w: el.clientWidth, h: height })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [height])

  const points = box.w ? buildStops(timeline.length, box.w) : []

  return (
    <section
      id="experience"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, rgba(244,85,42,0.075) 0%, rgba(244,85,42,0.010) 26%, rgba(244,244,245,0.028) 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <Reveal
          className="mb-16 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Experience &amp; Education</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              The route so far<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            {timeline.length} stops · 2023 – present
          </p>
        </Reveal>

        {/* ---------- Desktop: serpentine ---------- */}
        <div
          ref={wrapRef}
          className="relative hidden md:block"
          style={{ height }}
          onMouseLeave={() => setActive(null)}
        >
          {box.w > 0 && (
            <svg
              aria-hidden="true"
              width={box.w}
              height={height}
              className="absolute left-0 top-0"
            >
              <path
                d={routePath(points, box.w)}
                fill="none"
                stroke="rgba(244,244,245,0.28)"
                strokeWidth="2"
                strokeDasharray="3 9"
                strokeLinecap="round"
              />
            </svg>
          )}

          {points.map((pt, i) => {
            const entry = timeline[i]
            if (!entry) return null
            return (
              <Stop
                key={entry.id}
                entry={entry}
                point={pt}
                index={i}
                points={points}
                active={active === i}
                dimmed={active !== null && active !== i}
                onEnter={() => setActive(i)}
                containerW={box.w}
                containerH={height}
                reduce={reduce}
              />
            )
          })}
        </div>

        {/* ---------- Touch: vertical spine ---------- */}
        <ol className="md:hidden">
          {timeline.map((t, i) => (
            <li key={t.id} className="relative grid grid-cols-[3.5rem_1fr] gap-4">
              {i < timeline.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[27px] top-[60px] w-[2px]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(180deg, rgba(244,244,245,0.28) 0 3px, transparent 3px 11px)',
                  }}
                />
              )}
              <div className="pt-1">
                <StopMark entry={t} isActive />
              </div>
              <div className="pb-10 pt-1">
                <Detail entry={t} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/**
 * Where the stops sit.
 *
 * Two loose bands, so a card always has a half of the section to open
 * into, but each stop is nudged off its band by a fixed amount of jitter.
 * A perfectly level row of stops is what made the old line read as a
 * diagram; a route's stops sit where the route found them.
 *
 * Seeded, so the wander is the same shape on every load. Regenerating it
 * per visit would make it decoration.
 */
function buildStops(count, w) {
  const rand = seededRandom(0x2545f491)
  const left = EDGE
  const right = w - EDGE
  const topY = PAD_TOP
  const botY = PAD_TOP + ROW_GAP
  const topN = Math.min(STOPS_TOP, count)
  const botN = count - topN
  const out = []

  for (let i = 0; i < topN; i++) {
    const t = topN > 1 ? i / (topN - 1) : 0
    out.push({ x: left + (right - left) * t, y: topY + (rand() - 0.5) * JITTER })
  }
  for (let i = 0; i < botN; i++) {
    const t = botN > 1 ? i / (botN - 1) : 0
    // Inset from the right so the first stop of the lower band does not
    // sit directly under the last of the upper one.
    const span = right - left - 40
    out.push({ x: right - 40 - span * t, y: botY + (rand() - 0.5) * JITTER })
  }
  return out
}

/**
 * The route through the stops: each stop is a waypoint, with a wandering
 * point inserted between every pair. The line leaves a stop, drifts off
 * the straight line to the next, and comes back to meet it.
 *
 * Because the stops are waypoints, the curve passes exactly through them.
 * The previous version placed stops onto a measured path with
 * getPointAtLength, which needed a second layout pass and put stops
 * wherever the arc happened to land rather than where a card could open.
 */
function buildWaypoints(stops, w) {
  if (!stops.length) return []
  const rand = seededRandom(0x9e3779b9)
  const wp = []

  // A short tail before the first stop, as a drawn line would have.
  wp.push({ x: stops[0].x - 46, y: stops[0].y + 26 })

  for (let i = 0; i < stops.length; i++) {
    wp.push(stops[i])
    const next = stops[i + 1]
    if (!next) break

    const a = stops[i]
    const dx = next.x - a.x
    const dy = next.y - a.y
    const len = Math.hypot(dx, dy) || 1
    // Perpendicular to the direct line between the two stops.
    let px = -dy / len
    let py = dx / len
    // On the descent the two stops sit above each other, so push the
    // wander outward rather than back across the section.
    const descending = Math.abs(dy) > Math.abs(dx)
    const sign = descending ? (a.x > w / 2 ? 1 : -1) : i % 2 === 0 ? -1 : 1
    const amp = (46 + rand() * 34) * sign * (descending ? 1.5 : 1)

    wp.push({
      x: (a.x + next.x) / 2 + px * amp,
      y: (a.y + next.y) / 2 + py * amp,
    })
  }

  const last = stops[stops.length - 1]
  wp.push({ x: last.x - 44, y: last.y + 30 })

  return wp
}

/**
 * A Catmull-Rom spline through the waypoints, written out as cubic
 * beziers. Straight segments joined by corner radii read as a diagram;
 * one continuous curve reads as a route someone drew.
 */
function routePath(stops, w) {
  const p = buildWaypoints(stops, w)
  if (p.length < 2) return ''
  let d = `M ${p[0].x.toFixed(2)} ${p[0].y.toFixed(2)}`

  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }

  return d
}

function seededRandom(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/**
 * Where a card goes.
 *
 * A stop always lands partway round the turn: the turn is 520px of arc
 * against 277px of stop spacing, so one has to. That stop sits at
 * mid-height against the right edge, where a card opening up or down has
 * nowhere to go without crossing its neighbours. It gets a card beside it
 * instead, which is the only direction with room.
 *
 * Everywhere else the card opens away from its own pass and is capped so
 * it cannot reach the other one. Without that cap a lower-pass card
 * reached the upper pass's labels, which made all six of those stops
 * blockers spanning the full width, left no clear slot at all, and
 * dropped the card back onto the stop it was trying to avoid.
 *
 * The two passes' extents are read off the stops themselves rather than
 * hardcoded, so the caps follow the curve if its shape changes.
 */
function passBounds(points, containerH) {
  const upper = points.filter((p) => p.y < containerH * 0.35)
  const lower = points.filter((p) => p.y > containerH * 0.65)
  return {
    upperBottom: upper.length ? Math.max(...upper.map((p) => p.y + 88)) : 0,
    lowerTop: lower.length
      ? Math.min(...lower.map((p) => p.y - 34))
      : containerH,
  }
}

function zoneOf(point, containerH) {
  if (point.y < containerH * 0.35) return 'below'
  if (point.y > containerH * 0.65) return 'above'
  return 'side'
}

/** The card's vertical box, and the CSS that puts it there. */
function cardBox(point, points, containerH, zone) {
  const { upperBottom, lowerTop } = passBounds(points, containerH)

  if (zone === 'below') {
    const top = point.y + CARD_OFFSET
    const maxHeight = Math.max(140, lowerTop - 10 - top)
    return { top, bottom: top + maxHeight, css: { top, maxHeight } }
  }

  if (zone === 'above') {
    const bottom = point.y - CARD_OFFSET
    const maxHeight = Math.max(140, bottom - upperBottom - 10)
    return {
      top: bottom - maxHeight,
      bottom,
      css: {
        bottom: `calc(100% - ${bottom}px)`,
        maxHeight,
      },
    }
  }

  const maxHeight = containerH - 16
  const top = clamp(point.y - 150, 8, Math.max(8, containerH - 308))
  return { top, bottom: top + 300, css: { top, maxHeight } }
}

function placeCard(point, index, points, containerW, zone, band) {
  const hi = Math.max(0, containerW - CARD_W)
  if (zone === 'side') return clamp(point.x - CARD_W - 46, 0, hi)

  const centred = point.x - CARD_W / 2
  const blockers = points
    .filter((_, j) => j !== index)
    .map((p) => ({ x0: p.x - 82, x1: p.x + 82, y0: p.y - 34, y1: p.y + 88 }))
    .filter((b) => band.bottom > b.y0 && band.top < b.y1)

  for (let step = 0; step <= 40; step++) {
    for (const dir of step === 0 ? [0] : [-1, 1]) {
      const left = clamp(centred + dir * step * 18, 0, hi)
      if (!blockers.some((b) => left + CARD_W > b.x0 && left < b.x1)) return left
    }
  }
  return clamp(centred, 0, hi)
}

function Stop({
  entry,
  point,
  index,
  points,
  active,
  dimmed,
  onEnter,
  containerW,
  containerH,
  reduce,
}) {
  // Which way a card opens comes from where the stop actually sits on the
  // curve, not from a row index: on a spline there are no rows, and a stop
  // can land anywhere including partway round the turn.
  const zone = zoneOf(point, containerH)
  const band = cardBox(point, points, containerH, zone)
  const left = placeCard(point, index, points, containerW, zone, band)

  return (
    <>
      <button
        type="button"
        onMouseEnter={onEnter}
        onFocus={onEnter}
        onBlur={() => {}}
        aria-describedby={active ? `stop-${entry.id}` : undefined}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-opacity duration-300"
        style={{ left: point.x, top: point.y, opacity: dimmed ? 0.45 : 1 }}
      >
        <StopMark entry={entry} isActive={active} />
        <span
          className="mono-label mt-3 whitespace-nowrap transition-colors duration-300"
          style={{ color: active ? textColor(entry) : 'var(--muted)' }}
        >
          {entry.year}
        </span>
        <span
          className="mt-1 whitespace-nowrap text-[12.5px] leading-snug transition-colors duration-300"
          style={{ color: active ? 'var(--ink)' : 'rgba(244,244,245,0.55)' }}
        >
          {entry.short}
        </span>
      </button>

      {active && (
        <div
          id={`stop-${entry.id}`}
          className="absolute z-20 border p-5"
          style={{
            left,
            width: CARD_W,
            ...band.css,
            overflow: 'hidden',
            borderColor: textColor(entry),
            background: '#0A0908',
            boxShadow: '0 30px 70px -40px rgba(0,0,0,0.95)',
            transition: reduce ? 'none' : 'opacity 200ms ease',
          }}
        >
          <Detail entry={entry} compact />
        </div>
      )}
    </>
  )
}

/** One stop's written detail. Shared by the card and the mobile spine. */
function Detail({ entry, compact = false }) {
  return (
    <>
      <p className="mono-label" style={{ color: textColor(entry) }}>
        {entry.year}
      </p>
      <h3
        className={`serif mt-1.5 leading-tight ${compact ? 'text-[1.15rem]' : 'text-[1.3rem]'}`}
        style={{ color: 'var(--ink)' }}
      >
        {entry.title}
      </h3>
      <p className="mono-label mt-2" style={{ color: 'var(--muted)' }}>
        {entry.org}
      </p>
      {entry.status && (
        <p
          className="mono-label mt-2 flex items-center gap-1.5"
          style={{ color: textColor(entry) }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: textColor(entry) }}
          />
          {entry.status}
        </p>
      )}
      <p
        className={`mt-3 leading-relaxed ${compact ? 'text-[13px]' : 'text-[15px]'}`}
        style={{ color: 'var(--ink-soft)' }}
      >
        {entry.body}
      </p>
      {entry.href && (
        <a
          href={entry.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 border-b pb-0.5 font-mono text-[11px] uppercase tracking-[0.1em]"
          style={{ color: textColor(entry), borderColor: textColor(entry) }}
        >
          {entry.kind === 'education' ? 'Course page' : 'Read it'}
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </>
  )
}

/**
 * Small text needs 4.5:1; a filled mark and a dotted rule only need 3:1.
 * `tint` carries a lightened variant for the entries whose real brand
 * colour is too dark to set type in on this ground.
 */
const textColor = (t) => t.tint || t.accent || 'var(--accent)'

/**
 * Picks black or white for whatever sits inside a filled mark. White and
 * near-black give equal contrast at L = 0.187; above it the dark ink wins.
 */
function onFill(hex) {
  if (!hex || hex[0] !== '#') return '#fff'
  const v = [1, 3, 5].map((i) => {
    const n = parseInt(hex.substr(i, 2), 16) / 255
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  })
  const L = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
  return L > 0.187 ? '#0B0A09' : '#fff'
}

function StopMark({ entry, isActive }) {
  const accent = entry.accent || 'var(--accent)'
  const ink = isActive ? onFill(entry.accent) : textColor(entry)
  const Mark = markFor(entry)

  return (
    <span
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
      style={{
        // Opaque, so the dotted route reads as running behind the stop.
        background: isActive ? accent : '#0A0908',
        border: `2px solid ${accent}`,
        color: ink,
        transform: isActive ? 'scale(1.06)' : 'scale(1)',
        boxShadow: isActive ? `0 0 0 6px ${accent}22` : 'none',
        // Only the motion is transitioned. Fill and ink switch together on
        // the same frame; letting them ease independently can leave the
        // mark sitting on the colour it was picked against.
        transition: 'transform 300ms ease, box-shadow 300ms ease',
      }}
    >
      {Mark ? (
        <Mark width="27" height="27" />
      ) : (
        <span
          className="serif text-[17px] leading-none tracking-tight"
          style={{ color: ink }}
        >
          {entry.monogram}
        </span>
      )}
    </span>
  )
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi))
