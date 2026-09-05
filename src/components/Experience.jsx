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

const COLS = 5
// The gap between runs is set by the cards, not the line. A card is close
// to 290px tall and has to open fully inside the section: measured at the
// first attempt, a 210px gap pushed top-row cards past the section's
// bottom edge and bottom-row cards up through the heading.
const ROW_GAP = 470
const PAD_TOP = 100
const CARD_W = 340
const CARD_OFFSET = 96

export default function Experience() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [active, setActive] = useState(null)

  const rows = Math.ceil(timeline.length / COLS)
  const height = PAD_TOP + (rows - 1) * ROW_GAP + PAD_TOP

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = () => setBox({ w: el.clientWidth, h: height })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [height])

  const points = layoutStops(timeline.length, box.w, height)

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
 * Where each stop sits. Odd rows run right to left so the line never has
 * to jump back across the page: the route reads as one continuous walk.
 */
function layoutStops(count, w, h) {
  const rows = Math.ceil(count / COLS)
  const out = []
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / COLS)
    const col = i % COLS
    const reversed = row % 2 === 1
    const slot = reversed ? COLS - 1 - col : col
    const x = w ? ((slot + 0.5) / COLS) * w : 0
    const y = rows > 1 ? PAD_TOP + row * ROW_GAP : h / 2
    out.push({ x, y, row, reversed })
  }
  return out
}

/** The dotted line through the stops, with a rounded turn at each end. */
function routePath(points, w) {
  if (!points.length || !w) return ''
  const rows = [...new Set(points.map((p) => p.row))]
  const inset = w / (COLS * 2)
  let d = ''

  rows.forEach((row, idx) => {
    const y = PAD_TOP + row * ROW_GAP
    const leftX = inset
    const rightX = w - inset
    const goingRight = row % 2 === 0
    const from = goingRight ? leftX : rightX
    const to = goingRight ? rightX : leftX

    if (idx === 0) d += `M ${from} ${y} `
    d += `L ${to} ${y} `

    if (idx < rows.length - 1) {
      const nextY = PAD_TOP + (row + 1) * ROW_GAP
      // A turn with real radius, so the run reads as an S rather than a
      // rectangle folded in half.
      const r = Math.min(70, (nextY - y) / 2)
      const dir = goingRight ? 1 : -1
      d += `C ${to + dir * r} ${y} ${to + dir * r} ${nextY} ${to} ${nextY} `
    }
  })

  return d
}

function Stop({
  entry,
  point,
  active,
  dimmed,
  onEnter,
  containerW,
  containerH,
  reduce,
}) {
  // Cards hang below a top-run stop and above a bottom-run one, so they
  // always open into the section rather than out of it.
  const below = point.row % 2 === 0
  const left = clamp(point.x - CARD_W / 2, 0, Math.max(0, containerW - CARD_W))
  // A hard ceiling as well as the geometry, so a longer entry can never
  // reopen the overflow the row gap was widened to fix.
  const maxHeight = below
    ? containerH - (point.y + CARD_OFFSET) - 8
    : point.y - CARD_OFFSET - 8

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
            [below ? 'top' : 'bottom']: below
              ? point.y + CARD_OFFSET
              : `calc(100% - ${point.y - CARD_OFFSET}px)`,
            maxHeight,
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
