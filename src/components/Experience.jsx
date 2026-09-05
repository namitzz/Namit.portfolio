import { useLayoutEffect, useMemo, useRef, useState } from 'react'
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

// The section is sized to the route, not the other way round. Two level
// passes with a void between them wasted most of the height; the stops
// now use it, so the whole thing can be shorter.
const TRACK_H = 600
const CARD_W = 340
// Must clear a stop's own box (90 below the centre, 80 either side) or
// every candidate overlaps the stop it belongs to, gets rejected, and the
// placement falls through to an untested fallback.
const CARD_GAP = 104
const CARD_SIDE = 96
// Placement reserves this much height. It is an upper bound, not a cap:
// the card is then allowed the rest of the section below it, so a longer
// entry grows instead of being cut off.
const CARD_H = 280
const EDGE = 96
// Consecutive stops must differ in height by at least this much, which is
// what stops their labels colliding when they are close in x.
const MIN_DY = 118

export default function Experience() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [active, setActive] = useState(null)

  const height = TRACK_H

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = () => setBox({ w: el.clientWidth, h: height })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [height])

  // Memoised on width alone. All of this used to be rebuilt on every
  // render, and every hover is a render, so moving the pointer between
  // stops was re-running the spline and re-solving all eleven card
  // placements: about eighteen thousand operations per move.
  const points = useMemo(
    () => (box.w ? buildStops(timeline.length, box.w, height) : []),
    [box.w, height],
  )
  const d = useMemo(() => (points.length ? routePath(points) : ''), [points])
  const inkStops = useMemo(() => gradientStops(points, box.w), [points, box.w])

  // Only the stop being pointed at needs a placement, so this solves one
  // rather than eleven.
  const card = useMemo(() => {
    if (active === null || !points[active]) return null
    return {
      entry: timeline[active],
      ...placeCard(points[active], active, points, box.w, height),
    }
  }, [active, points, box.w, height])

  // How far along the route each stop sits, so the glow can be drawn up
  // to exactly that point. Read off the rendered path: nothing else knows
  // where a spline actually reaches.
  const pathRef = useRef(null)
  const [arc, setArc] = useState({ total: 0, at: [] })

  useLayoutEffect(() => {
    const el = pathRef.current
    if (!el || !d) return
    const total = el.getTotalLength()
    setArc({ total, at: points.map((pt) => lengthAt(el, pt, total)) })
    // `d` alone identifies the geometry; points are derived from the same
    // width, so it is not a separate dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d])

  const travelled = active !== null ? arc.at[active] || 0 : 0

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
              <defs>
                <filter
                  id="routeGlow"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
                  <feGaussianBlur stdDeviation="7" />
                </filter>

                {/* The route's colours, laid along it. Each stop
                    contributes its own tint at its own position, so the
                    glow is the right colour wherever it has reached.
                    Mapped on x rather than arc length because the stops
                    advance left to right, which makes x a faithful stand
                    in for progress and avoids a second measurement. */}
                <linearGradient
                  id="routeInk"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2={box.w}
                  y2="0"
                >
                  {inkStops}
                </linearGradient>
              </defs>

              {/* The glow, revealed up to the stop being pointed at. One
                  dash as long as the whole route, pulled back by its own
                  length so nothing shows, then let out to that stop's
                  distance. Animating the offset is what makes the light
                  travel along the route as the pointer moves between
                  stops. Drawn first, so it sits under the line. */}
              {arc.total > 0 && (
                <path
                  d={d}
                  fill="none"
                  stroke="url(#routeInk)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  filter="url(#routeGlow)"
                  style={{
                    strokeDasharray: arc.total,
                    strokeDashoffset: arc.total - travelled,
                    opacity: travelled > 0 ? 0.9 : 0,
                    transition: reduce
                      ? 'none'
                      : 'stroke-dashoffset 460ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease',
                  }}
                />
              )}

              {/* The line itself, always drawn, and the element the arc
                  lengths are measured from. */}
              <path
                ref={pathRef}
                d={d}
                fill="none"
                stroke="rgba(244,244,245,0.30)"
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
                active={active === i}
                dimmed={active !== null && active !== i}
                onEnter={() => setActive(i)}
              />
            )
          })}

          {/* One card for the whole route, moved and refilled rather than
              unmounted and remounted per stop. Remounting made it blink
              between neighbours; keeping it lets the border colour and the
              position ease across instead. */}
          {card && (
            <div
              id="route-card"
              className="absolute z-20 border p-5"
              style={{
                left: card.left,
                top: card.top,
                width: CARD_W,
                maxHeight: height - card.top - 8,
                overflow: 'hidden',
                borderColor: textColor(card.entry),
                background: '#0A0908',
                boxShadow: '0 30px 70px -40px rgba(0,0,0,0.95)',
                // Position is not transitioned. Stops sit hundreds of
                // pixels apart, so easing between them sent the card
                // flying across the section on every move; it lands where
                // it belongs instead. Only the colour crosses over.
                transition: reduce ? 'none' : 'border-color 260ms ease',
              }}
            >
              <Detail entry={card.entry} compact />
            </div>
          )}
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
 * One pass left to right, but the height is a random walk rather than a
 * band: each stop steps up or down from the last by a real distance, so
 * the route uses the whole box instead of hugging two lines with nothing
 * between them.
 *
 * The step has a floor (MIN_DY) for a practical reason, not a visual one.
 * Eleven stops across this width sit about 110px apart, and a label like
 * "Micro-internship" is that wide on its own; separating consecutive
 * stops vertically is what keeps their labels from running together.
 *
 * Seeded, so the walk is the same shape on every load. Regenerating it
 * per visit would make it decoration rather than a route.
 */
function buildStops(count, w, h) {
  const rand = seededRandom(0x6d2b79f5)
  const left = EDGE
  const right = w - EDGE
  const lo = 88
  const hi = h - 96
  const out = []
  let y = lo + rand() * 60
  let dir = 1

  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0
    // A little slack on x lets the route drift back on itself the way a
    // drawn line does, without ever losing left-to-right reading order.
    const x = left + (right - left) * t + (rand() - 0.5) * 46

    if (i > 0) {
      const step = MIN_DY + rand() * 130
      if (y + dir * step > hi || y + dir * step < lo) dir *= -1
      y = clamp(y + dir * step, lo, hi)
      if (rand() > 0.62) dir *= -1
    }

    out.push({ x: clamp(x, left - 20, right + 20), y })
  }

  return out
}

/**
 * The route through the stops: each stop is a waypoint, with a wandering
 * point inserted between every pair, so the line leaves a stop, drifts
 * off the direct line to the next, and comes back to meet it.
 *
 * Because the stops are waypoints the curve passes exactly through them.
 */
function buildWaypoints(stops) {
  if (!stops.length) return []
  const rand = seededRandom(0x9e3779b9)
  const wp = [{ x: stops[0].x - 44, y: stops[0].y - 30 }]

  for (let i = 0; i < stops.length; i++) {
    wp.push(stops[i])
    const next = stops[i + 1]
    if (!next) break

    const a = stops[i]
    const dx = next.x - a.x
    const dy = next.y - a.y
    const len = Math.hypot(dx, dy) || 1
    const amp = (34 + rand() * 40) * (i % 2 === 0 ? -1 : 1)

    wp.push({
      x: (a.x + next.x) / 2 + (-dy / len) * amp,
      y: (a.y + next.y) / 2 + (dx / len) * amp,
    })
  }

  const last = stops[stops.length - 1]
  wp.push({ x: last.x + 42, y: last.y + 32 })
  return wp
}

/**
 * A Catmull-Rom spline through the waypoints, written out as cubic
 * beziers. Straight segments joined by corner radii read as a diagram;
 * one continuous curve reads as a route someone drew.
 */
function routePath(stops) {
  const p = buildWaypoints(stops)
  if (p.length < 2) return ''
  let d = `M ${p[0].x.toFixed(2)} ${p[0].y.toFixed(2)}`

  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p2
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(2)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(2)}, ${(p2.x - (p3.x - p1.x) / 6).toFixed(2)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

/**
 * A gradient stop per route stop, in that stop's own colour. Offsets are
 * forced non-decreasing: the stops carry a little horizontal jitter, and
 * an offset that steps backwards makes the browser drop the gradient.
 */
function gradientStops(points, w) {
  let last = 0
  return points.map((p, i) => {
    const at = Math.max(last, clamp(p.x / (w || 1), 0, 1))
    last = at
    return (
      <stop
        key={timeline[i]?.id || i}
        offset={at}
        stopColor={textColor(timeline[i] || {})}
      />
    )
  })
}

/**
 * How far along a path a point sits. Coarse sweep, then a refinement
 * around the best sample, which is far cheaper than sampling the whole
 * length finely and lands within a pixel.
 */
function lengthAt(el, target, total) {
  let best = 0
  let bestD = Infinity
  const STEPS = 260

  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * total
    const p = el.getPointAtLength(t)
    const dd = (p.x - target.x) ** 2 + (p.y - target.y) ** 2
    if (dd < bestD) {
      bestD = dd
      best = t
    }
  }

  const span = total / STEPS
  for (let i = -20; i <= 20; i++) {
    const t = clamp(best + (i / 20) * span, 0, total)
    const p = el.getPointAtLength(t)
    const dd = (p.x - target.x) ** 2 + (p.y - target.y) ** 2
    if (dd < bestD) {
      bestD = dd
      best = t
    }
  }

  return best
}

/** Names the destination, rather than guessing from the kind of stop. */
function linkLabel(href = '') {
  if (href.includes('github.com')) return 'Repository'
  if (href.includes('le.ac.uk') || href.includes('aston.ac.uk')) return 'Course page'
  if (href.includes('linkedin.com')) return 'The post'
  if (href.includes('classfutures')) return 'Read it'
  return 'Visit'
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
 * The stops are on a random walk, so there is no free half of the section
 * to open into, and often no clear rectangle at all: a card covers a
 * seventh of the box and eleven stops are scattered through it.
 *
 * Two attempts got this wrong in opposite ways. Demanding a fully clear
 * placement found none and fell back to one overlapping several stops.
 * Then scoring it with a heavy penalty for coverage sent cards up to
 * 531px from the stop they belong to, chasing empty space across the
 * section.
 *
 * So distance leads and coverage is a tiebreak worth about a hundred
 * pixels. A card sits beside its own stop and may cover a neighbour,
 * which is what a panel opening over a map does anyway. What it may not
 * do is leave the section, cover its own stop, or clip its text.
 */
function placeCard(point, index, points, cw, ch) {
  const blockers = points
    .filter((_, j) => j !== index)
    .map((p) => ({ x0: p.x - 80, x1: p.x + 80, y0: p.y - 32, y1: p.y + 90 }))
  const own = { x0: point.x - 80, x1: point.x + 80, y0: point.y - 32, y1: point.y + 90 }
  const hits = (r, b) =>
    r.left + CARD_W > b.x0 && r.left < b.x1 && r.top + CARD_H > b.y0 && r.top < b.y1

  const cx = point.x - CARD_W / 2
  const cy = point.y - CARD_H / 2
  const preferDown = point.y < ch / 2

  let best = null
  const consider = (left, top) => {
    if (left < 0 || top < 0 || left + CARD_W > cw || top + CARD_H > ch) return
    const r = { left, top }
    if (hits(r, own)) return
    const covered = blockers.filter((b) => hits(r, b)).length
    const dist = Math.hypot(left + CARD_W / 2 - point.x, top + CARD_H / 2 - point.y)
    const score = dist + covered * 110
    if (!best || score < best.score) best = { left, top, score }
  }

  for (let step = 0; step <= 20; step++) {
    for (const off of step === 0 ? [0] : [-step * 24, step * 24]) {
      const near = preferDown ? point.y + CARD_GAP : point.y - CARD_GAP - CARD_H
      const far = preferDown ? point.y - CARD_GAP - CARD_H : point.y + CARD_GAP
      consider(cx + off, near)
      consider(cx + off, far)
      consider(point.x + CARD_SIDE, cy + off)
      consider(point.x - CARD_W - CARD_SIDE, cy + off)
    }
  }

  if (best) return best
  return {
    left: clamp(cx, 0, Math.max(0, cw - CARD_W)),
    top: clamp(point.y + CARD_GAP, 0, Math.max(0, ch - CARD_H)),
  }
}

function Stop({ entry, point, active, dimmed, onEnter }) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      aria-describedby={active ? 'route-card' : undefined}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-opacity duration-300"
      style={{ left: point.x, top: point.y, opacity: dimmed ? 0.45 : 1 }}
    >
      <StopMark entry={entry} isActive={active} />

      {/* Idle, the route is the marks and the line and nothing else.
          Eleven labels standing over it turned a drawn route into a
          diagram; the name arrives with the card, for whichever stop is
          being pointed at.

          Kept mounted rather than conditional, so the button's accessible
          name is always its stop and the label never reflows the row. */}
      <span
        className="mono-label mt-3 whitespace-nowrap transition-opacity duration-300"
        style={{ color: textColor(entry), opacity: active ? 1 : 0 }}
      >
        {entry.year}
      </span>
      <span
        className="mt-1 whitespace-nowrap text-[12.5px] leading-snug transition-opacity duration-300"
        style={{ color: 'var(--ink)', opacity: active ? 1 : 0 }}
      >
        {entry.short}
      </span>
    </button>
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
          {linkLabel(entry.href)}
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
