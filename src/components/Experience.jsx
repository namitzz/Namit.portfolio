import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { timeline } from '../data/content'
import { markFor } from './TimelineMarks'
import Reveal from './Reveal'

/*
 * Experience / Education timeline
 *
 * Desktop:
 * - A continuous curved route
 * - Permanent small year + title labels
 * - Coloured timeline marks
 * - Hover/focus reveals the detailed card
 * - Route lights up towards the active stop
 *
 * Mobile:
 * - Clean vertical timeline
 * - All details visible
 */

const TRACK_H = 520
const CARD_W = 340
const CARD_H = 280
const CARD_GAP = 82
const EDGE = 80

export default function Experience() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const pathRef = useRef(null)

  const [box, setBox] = useState({ w: 0, h: TRACK_H })
  const [active, setActive] = useState(null)
  const [arc, setArc] = useState({ total: 0, at: [] })

  const height = TRACK_H

  /* -------------------------------------------------------------- */
  /* Measure the route container                                    */
  /* -------------------------------------------------------------- */

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined

    const measure = () => {
      setBox({
        w: el.clientWidth,
        h: height,
      })
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)

    return () => ro.disconnect()
  }, [height])

  /* -------------------------------------------------------------- */
  /* Build route geometry                                            */
  /* -------------------------------------------------------------- */

  const points = useMemo(
    () => (box.w ? buildStops(timeline.length, box.w, height) : []),
    [box.w, height],
  )

  const d = useMemo(
    () => (points.length ? routePath(points) : ''),
    [points],
  )

  const inkStops = useMemo(
    () => gradientStops(points, box.w),
    [points, box.w],
  )

  /* -------------------------------------------------------------- */
  /* Active card                                                     */
  /* -------------------------------------------------------------- */

  const card = useMemo(() => {
    if (active === null || !points[active]) return null

    return {
      entry: timeline[active],
      ...placeCard(
        points[active],
        active,
        points,
        box.w,
        height,
      ),
    }
  }, [active, points, box.w, height])

  /* -------------------------------------------------------------- */
  /* Measure route distance for the travelling glow                  */
  /* -------------------------------------------------------------- */

  useLayoutEffect(() => {
    const el = pathRef.current

    if (!el || !d || !points.length) return

    const total = el.getTotalLength()

    setArc({
      total,
      at: points.map((point) =>
        lengthAt(el, point, total),
      ),
    })
  }, [d, points])

  const travelled =
    active !== null
      ? arc.at[active] || 0
      : 0

  /* -------------------------------------------------------------- */

  return (
    <section
      id="experience"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, rgba(244,85,42,0.075) 0%, rgba(244,85,42,0.010) 30%, rgba(244,244,245,0.028) 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">

        {/* -------------------------------------------------------- */}
        {/* Section heading                                          */}
        {/* -------------------------------------------------------- */}

        <Reveal
          className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{
            borderColor: 'var(--hairline)',
          }}
        >
          <div>
            <p className="eyebrow">
              Experience &amp; Education
            </p>

            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{
                color: 'var(--ink)',
              }}
            >
              The route so far
              <span style={{ color: 'var(--accent)' }}>
                .
              </span>
            </h2>
          </div>

          <p
            className="mono-label"
            style={{
              color: 'var(--muted)',
            }}
          >
            {timeline.length} stops · 2023 – present
          </p>
        </Reveal>

        {/* ======================================================== */}
        {/* DESKTOP                                                  */}
        {/* ======================================================== */}

        <div
          ref={wrapRef}
          className="relative hidden md:block"
          style={{
            height,
          }}
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

                {/* ---------------------------------------------- */}
                {/* Route glow                                     */}
                {/* ---------------------------------------------- */}

                <filter
                  id="routeGlow"
                  x="-10%"
                  y="-20%"
                  width="120%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="7" />
                </filter>

                {/* ---------------------------------------------- */}
                {/* Multi-colour route gradient                    */}
                {/* ---------------------------------------------- */}

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

              {/* ------------------------------------------------ */}
              {/* Travelling glow                                 */}
              {/* ------------------------------------------------ */}

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
                    strokeDashoffset:
                      arc.total - travelled,
                    opacity:
                      travelled > 0 ? 0.9 : 0,
                    transition: reduce
                      ? 'none'
                      : 'stroke-dashoffset 460ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease',
                  }}
                />
              )}

              {/* ------------------------------------------------ */}
              {/* Main dotted route                                */}
              {/* ------------------------------------------------ */}

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

          {/* ==================================================== */}
          {/* Timeline stops                                      */}
          {/* ==================================================== */}

          {points.map((point, index) => {
            const entry = timeline[index]

            if (!entry) return null

            return (
              <Stop
                key={entry.id}
                entry={entry}
                point={point}
                active={active === index}
                dimmed={
                  active !== null &&
                  active !== index
                }
                onEnter={() => setActive(index)}
              />
            )
          })}

          {/* ==================================================== */}
          {/* Detail card                                          */}
          {/* ==================================================== */}

          {card && (
            <div
              id="route-card"
              className="absolute z-20 border p-5"
              style={{
                left: card.left,
                top: card.top,
                width: CARD_W,
                maxHeight:
                  height - card.top - 8,
                overflow: 'hidden',
                borderColor:
                  textColor(card.entry),
                background: '#0A0908',
                boxShadow:
                  '0 30px 70px -40px rgba(0,0,0,0.95)',
                transition: reduce
                  ? 'none'
                  : 'border-color 260ms ease',
              }}
            >
              <Detail
                entry={card.entry}
                compact
              />
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* MOBILE                                                   */}
        {/* ======================================================== */}

        <ol className="md:hidden">
          {timeline.map((entry, index) => (
            <li
              key={entry.id}
              className="relative grid grid-cols-[3.5rem_1fr] gap-4"
            >
              {/* Vertical line */}

              {index < timeline.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[27px] top-[60px] w-[2px]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(180deg, rgba(244,244,245,0.28) 0 3px, transparent 3px 11px)',
                  }}
                />
              )}

              {/* Mark */}

              <div className="pt-1">
                <StopMark
                  entry={entry}
                  isActive
                />
              </div>

              {/* Detail */}

              <div className="pb-10 pt-1">
                <Detail entry={entry} />
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  )
}

/* ================================================================== */
/* ROUTE GEOMETRY                                                    */
/* ================================================================== */

/*
 * Creates a deliberate wave rather than a random walk.
 *
 * This is important visually: the old version looked like a network
 * diagram because the nodes wandered too far vertically.
 *
 * The new route has:
 * - controlled vertical movement
 * - slight irregularity
 * - consistent left-to-right progress
 */
function buildStops(count, width, height) {
  const out = []

  const left = EDGE
  const right = width - EDGE

  const center = height / 2
  const amplitude = Math.min(
    145,
    height * 0.28,
  )

  for (let i = 0; i < count; i++) {
    const progress =
      count > 1
        ? i / (count - 1)
        : 0

    const x =
      left +
      (right - left) * progress

    /*
     * Two gentle waves across the route.
     *
     * The small deterministic offset keeps it from
     * looking mechanically perfect.
     */
    const wave =
      Math.sin(progress * Math.PI * 2.15)

    const secondary =
      Math.sin(
        progress * Math.PI * 5.1 + 0.7,
      ) * 18

    const y =
      center +
      wave * amplitude +
      secondary

    out.push({
      x,
      y: clamp(
        y,
        78,
        height - 78,
      ),
    })
  }

  return out
}

/* ================================================================== */
/* WAYPOINTS                                                         */
/* ================================================================== */

function buildWaypoints(stops) {
  if (!stops.length) return []

  const waypoints = []

  waypoints.push({
    x: stops[0].x - 42,
    y: stops[0].y - 24,
  })

  for (let i = 0; i < stops.length; i++) {
    const current = stops[i]

    waypoints.push(current)

    const next = stops[i + 1]

    if (!next) break

    const dx = next.x - current.x
    const dy = next.y - current.y

    const length =
      Math.hypot(dx, dy) || 1

    /*
     * Alternating bends give the route a hand-drawn
     * editorial quality without becoming chaotic.
     */
    const direction =
      i % 2 === 0 ? -1 : 1

    const amplitude = 28 + (i % 3) * 8

    waypoints.push({
      x:
        (current.x + next.x) / 2 +
        (-dy / length) *
          amplitude *
          direction,

      y:
        (current.y + next.y) / 2 +
        (dx / length) *
          amplitude *
          direction,
    })
  }

  const last =
    stops[stops.length - 1]

  waypoints.push({
    x: last.x + 42,
    y: last.y + 24,
  })

  return waypoints
}

/* ================================================================== */
/* CURVED ROUTE                                                      */
/* ================================================================== */

function routePath(stops) {
  const points = buildWaypoints(stops)

  if (points.length < 2) {
    return ''
  }

  let d =
    `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`

  for (
    let i = 0;
    i < points.length - 1;
    i++
  ) {
    const p0 =
      points[i - 1] || points[i]

    const p1 = points[i]
    const p2 = points[i + 1]

    const p3 =
      points[i + 2] || p2

    const c1x =
      p1.x +
      (p2.x - p0.x) / 6

    const c1y =
      p1.y +
      (p2.y - p0.y) / 6

    const c2x =
      p2.x -
      (p3.x - p1.x) / 6

    const c2y =
      p2.y -
      (p3.y - p1.y) / 6

    d +=
      ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ` +
      `${c2x.toFixed(2)} ${c2y.toFixed(2)}, ` +
      `${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }

  return d
}

/* ================================================================== */
/* ROUTE COLOUR                                                     */
/* ================================================================== */

function gradientStops(points, width) {
  let last = 0

  return points.map((point, index) => {
    const entry =
      timeline[index] || {}

    const offset = Math.max(
      last,
      clamp(
        point.x / (width || 1),
        0,
        1,
      ),
    )

    last = offset

    return (
      <stop
        key={entry.id || index}
        offset={offset}
        stopColor={textColor(entry)}
      />
    )
  })
}

/* ================================================================== */
/* PATH DISTANCE                                                     */
/* ================================================================== */

function lengthAt(
  element,
  target,
  total,
) {
  let best = 0
  let bestDistance = Infinity

  const steps = 260

  for (
    let i = 0;
    i <= steps;
    i++
  ) {
    const distance =
      (i / steps) * total

    const point =
      element.getPointAtLength(
        distance,
      )

    const difference =
      (point.x - target.x) ** 2 +
      (point.y - target.y) ** 2

    if (difference < bestDistance) {
      bestDistance = difference
      best = distance
    }
  }

  const span =
    total / steps

  for (
    let i = -20;
    i <= 20;
    i++
  ) {
    const distance = clamp(
      best + (i / 20) * span,
      0,
      total,
    )

    const point =
      element.getPointAtLength(
        distance,
      )

    const difference =
      (point.x - target.x) ** 2 +
      (point.y - target.y) ** 2

    if (difference < bestDistance) {
      bestDistance = difference
      best = distance
    }
  }

  return best
}

/* ================================================================== */
/* CARD PLACEMENT                                                    */
/* ================================================================== */

function placeCard(
  point,
  index,
  points,
  width,
  height,
) {
  const blockers = points
    .filter((_, i) => i !== index)
    .map((p) => ({
      x0: p.x - 78,
      x1: p.x + 78,
      y0: p.y - 32,
      y1: p.y + 84,
    }))

  const own = {
    x0: point.x - 78,
    x1: point.x + 78,
    y0: point.y - 32,
    y1: point.y + 84,
  }

  const overlaps = (rect, box) =>
    rect.left + CARD_W > box.x0 &&
    rect.left < box.x1 &&
    rect.top + CARD_H > box.y0 &&
    rect.top < box.y1

  const centerLeft =
    point.x - CARD_W / 2

  const centerTop =
    point.y - CARD_H / 2

  const preferDown =
    point.y < height / 2

  let best = null

  const consider = (
    left,
    top,
  ) => {
    if (
      left < 0 ||
      top < 0 ||
      left + CARD_W > width ||
      top + CARD_H > height
    ) {
      return
    }

    const rect = {
      left,
      top,
    }

    if (overlaps(rect, own)) {
      return
    }

    const covered =
      blockers.filter((box) =>
        overlaps(rect, box),
      ).length

    const distance =
      Math.hypot(
        left + CARD_W / 2 - point.x,
        top + CARD_H / 2 - point.y,
      )

    const score =
      distance + covered * 100

    if (
      !best ||
      score < best.score
    ) {
      best = {
        left,
        top,
        score,
      }
    }
  }

  for (
    let step = 0;
    step <= 18;
    step++
  ) {
    const offset =
      step * 22

    const down =
      point.y + CARD_GAP

    const up =
      point.y -
      CARD_GAP -
      CARD_H

    if (preferDown) {
      consider(
        centerLeft,
        down,
      )

      consider(
        centerLeft - offset,
        down,
      )

      consider(
        centerLeft + offset,
        down,
      )

      consider(
        centerLeft,
        up,
      )
    } else {
      consider(
        centerLeft,
        up,
      )

      consider(
        centerLeft - offset,
        up,
      )

      consider(
        centerLeft + offset,
        up,
      )

      consider(
        centerLeft,
        down,
      )
    }

    consider(
      point.x + 72,
      centerTop,
    )

    consider(
      point.x - CARD_W - 72,
      centerTop,
    )
  }

  if (best) {
    return best
  }

  return {
    left: clamp(
      centerLeft,
      0,
      Math.max(
        0,
        width - CARD_W,
      ),
    ),

    top: clamp(
      downFallback(point, height),
      0,
      Math.max(
        0,
        height - CARD_H,
      ),
    ),
  }
}

function downFallback(
  point,
  height,
) {
  if (
    point.y + CARD_GAP + CARD_H <=
    height
  ) {
    return point.y + CARD_GAP
  }

  return point.y -
    CARD_GAP -
    CARD_H
}

/* ================================================================== */
/* DESKTOP STOP                                                      */
/* ================================================================== */

function Stop({
  entry,
  point,
  active,
  dimmed,
  onEnter,
}) {
  /*
   * Labels alternate above and below the route.
   *
   * This makes the timeline readable without putting
   * every label on top of the route.
   */
  const labelAbove =
    point.y > 255

  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      aria-describedby={
        active
          ? 'route-card'
          : undefined
      }
      aria-label={`${entry.year} — ${entry.short || entry.title}`}
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-opacity duration-300"
      style={{
        left: point.x,
        top: point.y,
        opacity:
          dimmed ? 0.42 : 1,
      }}
    >

      {/* ======================================================== */}
      {/* Permanent label                                          */}
      {/* ======================================================== */}

      {labelAbove && (
        <StopLabel
          entry={entry}
          active={active}
          above
        />
      )}

      {/* ======================================================== */}
      {/* Mark                                                     */}
      {/* ======================================================== */}

      <StopMark
        entry={entry}
        isActive={active}
      />

      {!labelAbove && (
        <StopLabel
          entry={entry}
          active={active}
        />
      )}
    </button>
  )
}

/* ================================================================== */
/* PERMANENT STOP LABEL                                               */
/* ================================================================== */

function StopLabel({
  entry,
  active,
  above = false,
}) {
  return (
    <span
      className={
        above
          ? 'mb-3 flex flex-col items-center'
          : 'mt-3 flex flex-col items-center'
      }
    >
      <span
        className="mono-label whitespace-nowrap text-[10px] tracking-[0.14em] transition-opacity duration-300"
        style={{
          color:
            textColor(entry),
          opacity:
            active ? 1 : 0.78,
        }}
      >
        {entry.year}
      </span>

      <span
        className="mt-1 max-w-[150px] whitespace-nowrap text-center text-[11.5px] leading-tight transition-opacity duration-300"
        style={{
          color: 'var(--ink)',
          opacity:
            active ? 1 : 0.68,
        }}
      >
        {entry.short ||
          entry.title}
      </span>
    </span>
  )
}

/* ================================================================== */
/* DETAIL CARD / MOBILE DETAIL                                        */
/* ================================================================== */

function Detail({
  entry,
  compact = false,
}) {
  return (
    <>
      <p
        className="mono-label"
        style={{
          color:
            textColor(entry),
        }}
      >
        {entry.year}
      </p>

      <h3
        className={`serif mt-1.5 leading-tight ${
          compact
            ? 'text-[1.15rem]'
            : 'text-[1.3rem]'
        }`}
        style={{
          color: 'var(--ink)',
        }}
      >
        {entry.title}
      </h3>

      <p
        className="mono-label mt-2"
        style={{
          color: 'var(--muted)',
        }}
      >
        {entry.org}
      </p>

      {entry.status && (
        <p
          className="mono-label mt-2 flex items-center gap-1.5"
          style={{
            color:
              textColor(entry),
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              background:
                textColor(entry),
            }}
          />

          {entry.status}
        </p>
      )}

      <p
        className={`mt-3 leading-relaxed ${
          compact
            ? 'text-[13px]'
            : 'text-[15px]'
        }`}
        style={{
          color:
            'var(--ink-soft)',
        }}
      >
        {entry.body}
      </p>

      {entry.href && (
        <a
          href={entry.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 border-b pb-0.5 font-mono text-[11px] uppercase tracking-[0.1em]"
          style={{
            color:
              textColor(entry),
            borderColor:
              textColor(entry),
          }}
        >
          {linkLabel(entry.href)}

          <span aria-hidden="true">
            ↗
          </span>
        </a>
      )}
    </>
  )
}

/* ================================================================== */
/* LINK LABEL                                                         */
/* ================================================================== */

function linkLabel(href = '') {
  if (
    href.includes(
      'github.com',
    )
  ) {
    return 'Repository'
  }

  if (
    href.includes(
      'le.ac.uk',
    ) ||
    href.includes(
      'aston.ac.uk',
    )
  ) {
    return 'Course page'
  }

  if (
    href.includes(
      'linkedin.com',
    )
  ) {
    return 'The post'
  }

  if (
    href.includes(
      'classfutures',
    )
  ) {
    return 'Read it'
  }

  return 'Visit'
}

/* ================================================================== */
/* COLOUR HELPERS                                                     */
/* ================================================================== */

const textColor = (entry) =>
  entry.tint ||
  entry.accent ||
  'var(--accent)'

function onFill(hex) {
  if (
    !hex ||
    hex[0] !== '#'
  ) {
    return '#fff'
  }

  const rgb = [1, 3, 5].map(
    (index) => {
      const value =
        parseInt(
          hex.substr(
            index,
            2,
          ),
          16,
        ) / 255

      return value <=
        0.03928
        ? value / 12.92
        : Math.pow(
            (value + 0.055) /
              1.055,
            2.4,
          )
    },
  )

  const luminance =
    0.2126 * rgb[0] +
    0.7152 * rgb[1] +
    0.0722 * rgb[2]

  return luminance > 0.187
    ? '#0B0A09'
    : '#fff'
}

/* ================================================================== */
/* STOP MARK                                                          */
/* ================================================================== */

function StopMark({
  entry,
  isActive,
}) {
  const accent =
    entry.accent ||
    'var(--accent)'

  const ink = isActive
    ? onFill(entry.accent)
    : textColor(entry)

  const Mark =
    markFor(entry)

  return (
    <span
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
      style={{
        background:
          isActive
            ? accent
            : '#0A0908',

        border:
          `2px solid ${accent}`,

        color: ink,

        transform:
          isActive
            ? 'scale(1.06)'
            : 'scale(1)',

        boxShadow:
          isActive
            ? `0 0 0 6px ${accent}22`
            : 'none',

        transition:
          'transform 300ms ease, box-shadow 300ms ease',
      }}
    >
      {Mark ? (
        <Mark
          width="27"
          height="27"
        />
      ) : (
        <span
          className="serif text-[17px] leading-none tracking-tight"
          style={{
            color: ink,
          }}
        >
          {entry.monogram}
        </span>
      )}
    </span>
  )
}

/* ================================================================== */
/* UTILITY                                                            */
/* ================================================================== */

const clamp = (
  value,
  min,
  max,
) =>
  Math.max(
    min,
    Math.min(
      value,
      max,
    ),
  )
