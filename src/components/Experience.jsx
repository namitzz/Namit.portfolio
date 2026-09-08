import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { timeline } from '../data/content'
import { markFor } from './TimelineMarks'
import Reveal from './Reveal'

const TRACK_H = 520
const CARD_W = 340
const CARD_H = 280
const CARD_GAP = 82
const EDGE = 80

export default function Experience() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const pathRef = useRef(null)

  const [box, setBox] = useState({
    w: 0,
    h: TRACK_H,
  })

  const [active, setActive] = useState(null)

  const [arc, setArc] = useState({
    total: 0,
    at: [],
  })

  const height = TRACK_H

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

  const points = useMemo(
    () =>
      box.w
        ? buildStops(
            timeline.length,
            box.w,
            height,
          )
        : [],
    [box.w, height],
  )

  const d = useMemo(
    () =>
      points.length
        ? routePath(points)
        : '',
    [points],
  )

  const inkStops = useMemo(
    () =>
      gradientStops(
        points,
        box.w,
      ),
    [points, box.w],
  )

  const card = useMemo(() => {
    if (
      active === null ||
      !points[active]
    ) {
      return null
    }

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
  }, [
    active,
    points,
    box.w,
    height,
  ])

  useLayoutEffect(() => {
    const el = pathRef.current

    if (
      !el ||
      !d ||
      !points.length
    ) {
      return
    }

    const total = el.getTotalLength()

    setArc({
      total,
      at: points.map((point) =>
        lengthAt(
          el,
          point,
          total,
        ),
      ),
    })
  }, [d, points])

  const travelled =
    active !== null
      ? arc.at[active] || 0
      : 0

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

        {/* SECTION HEADING */}

        <Reveal
          className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{
            borderColor:
              'var(--hairline)',
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
              <span
                style={{
                  color:
                    'var(--accent)',
                }}
              >
                .
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <p
              className="mono-label"
              style={{
                color:
                  'var(--muted)',
              }}
            >
              {timeline.length} stops · 2023 – present
            </p>

            <div
              className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] md:flex"
              style={{
                color:
                  'var(--muted)',
              }}
            >
              <span>● EDUCATION</span>
              <span>● PROJECT</span>
              <span>● EXPERIENCE</span>
            </div>
          </div>
        </Reveal>

        {/* DESKTOP TIMELINE */}

        <div
          ref={wrapRef}
          className="relative hidden md:block"
          style={{
            height,
          }}
          onMouseLeave={() =>
            setActive(null)
          }
        >
          <AnimatedMapBackground />

          {/* ROUTE */}

          {box.w > 0 && (
            <svg
              aria-hidden="true"
              width={box.w}
              height={height}
              className="absolute left-0 top-0 z-[3]"
            >
              <defs>
                <filter
                  id="routeGlow"
                  x="-10%"
                  y="-20%"
                  width="120%"
                  height="140%"
                >
                  <feGaussianBlur
                    stdDeviation="7"
                  />
                </filter>

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

              {arc.total > 0 && (
                <path
                  d={d}
                  fill="none"
                  stroke="url(#routeInk)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  filter="url(#routeGlow)"
                  style={{
                    strokeDasharray:
                      arc.total,
                    strokeDashoffset:
                      arc.total -
                      travelled,
                    opacity:
                      travelled > 0
                        ? 0.9
                        : 0,
                    transition: reduce
                      ? 'none'
                      : 'stroke-dashoffset 460ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease',
                  }}
                />
              )}

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

          {/* TIMELINE STOPS */}

          {points.map(
            (point, index) => {
              const entry =
                timeline[index]

              if (!entry) {
                return null
              }

              return (
                <Stop
                  key={entry.id}
                  entry={entry}
                  point={point}
                  active={
                    active === index
                  }
                  dimmed={
                    active !== null &&
                    active !== index
                  }
                  onEnter={() =>
                    setActive(index)
                  }
                />
              )
            },
          )}

          {/* DETAIL CARD */}

          {card && (
            <div
              id="route-card"
              className="absolute z-20 border p-5"
              style={{
                left: card.left,
                top: card.top,
                width: CARD_W,
                maxHeight:
                  height -
                  card.top -
                  8,
                overflow: 'hidden',
                borderColor:
                  textColor(
                    card.entry,
                  ),
                background:
                  '#0A0908',
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

        {/* MOBILE TIMELINE */}

        <ol className="md:hidden">
          {timeline.map(
            (entry, index) => (
              <li
                key={entry.id}
                className="relative grid grid-cols-[3.5rem_1fr] gap-4"
              >
                {index <
                  timeline.length - 1 && (
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
                  <StopMark
                    entry={entry}
                    isActive
                  />
                </div>

                <div className="pb-10 pt-1">
                  <Detail
                    entry={entry}
                  />
                </div>
              </li>
            ),
          )}
        </ol>
      </div>
    </section>
  )
}

/* ================================================================
   ANIMATED CARTOGRAPHIC BACKGROUND
   ================================================================ */

function AnimatedMapBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      style={{
        opacity: 0.85,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 520"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>

          {/* GRID */}

          <pattern
            id="mapGrid"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 72 0 L 0 0 0 72"
              fill="none"
              stroke="rgba(244,244,245,0.09)"
              strokeWidth="1"
            />

            <circle
              cx="0"
              cy="0"
              r="1.5"
              fill="rgba(244,244,245,0.16)"
            />
          </pattern>

          {/* CENTRE GLOW */}

          <radialGradient
            id="mapGlow"
            cx="50%"
            cy="50%"
            r="60%"
          >
            <stop
              offset="0%"
              stopColor="rgba(244,85,42,0.13)"
            />

            <stop
              offset="45%"
              stopColor="rgba(244,85,42,0.055)"
            />

            <stop
              offset="75%"
              stopColor="rgba(244,85,42,0.018)"
            />

            <stop
              offset="100%"
              stopColor="rgba(0,0,0,0)"
            />
          </radialGradient>

          {/* SIGNAL GLOW */}

          <filter
            id="mapSignalGlow"
            x="-200%"
            y="-200%"
            width="400%"
            height="400%"
          >
            <feGaussianBlur
              stdDeviation="5"
            />
          </filter>

          {/* NETWORK GLOW */}

          <filter
            id="softMapGlow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur
              stdDeviation="2"
            />
          </filter>
        </defs>

        {/* GRID */}

        <rect
          width="1200"
          height="520"
          fill="url(#mapGrid)"
        />

        {/* CENTRE LIGHT */}

        <rect
          width="1200"
          height="520"
          fill="url(#mapGlow)"
        />

        {/* TOPOGRAPHIC CONTOURS */}

        <g
          fill="none"
          stroke="rgba(244,244,245,0.14)"
          strokeWidth="1"
        >
          <path d="M-80 100 C120 20 190 160 370 105 S620 25 820 105 S1060 170 1280 80" />
          <path d="M-100 135 C110 55 210 190 390 135 S630 55 835 135 S1080 200 1300 110" />
          <path d="M-120 170 C90 90 220 220 405 165 S650 90 850 165 S1090 235 1320 145" />
          <path d="M-130 205 C70 125 235 250 420 195 S675 125 870 195 S1110 270 1340 180" />

          <path d="M-120 350 C100 280 220 410 410 350 S650 285 850 350 S1080 420 1320 330" />
          <path d="M-110 385 C100 315 240 445 430 385 S670 320 875 385 S1095 455 1320 365" />
          <path d="M-100 420 C100 350 250 480 445 420 S690 355 890 420 S1110 490 1320 400" />
        </g>

        {/* SECONDARY LINES */}

        <g
          fill="none"
          stroke="rgba(244,244,245,0.08)"
          strokeWidth="1"
        >
          <path d="M130 -40 C190 90 95 180 170 290 S220 430 170 570" />
          <path d="M330 -40 C390 80 295 190 365 300 S410 440 360 570" />
          <path d="M540 -40 C600 100 500 180 570 300 S620 450 570 570" />
          <path d="M760 -40 C820 80 720 190 790 310 S835 450 790 570" />
          <path d="M970 -40 C1030 90 930 190 1000 310 S1045 450 995 570" />
        </g>

        {/* MAP JUNCTIONS */}

        <g
          fill="none"
          stroke="rgba(244,244,245,0.14)"
          strokeWidth="1"
        >
          <circle cx="170" cy="145" r="24" />
          <circle cx="170" cy="145" r="42" />

          <circle cx="475" cy="335" r="18" />
          <circle cx="475" cy="335" r="34" />

          <circle cx="890" cy="185" r="25" />
          <circle cx="890" cy="185" r="47" />

          <circle cx="1080" cy="370" r="20" />
          <circle cx="1080" cy="370" r="38" />
        </g>

        {/* SMALL NODES */}

        <g
          fill="rgba(244,244,245,0.38)"
        >
          <circle
            cx="170"
            cy="145"
            r="2"
          />
          <circle
            cx="475"
            cy="335"
            r="2"
          />
          <circle
            cx="890"
            cy="185"
            r="2"
          />
          <circle
            cx="1080"
            cy="370"
            r="2"
          />

          <circle
            cx="305"
            cy="90"
            r="1.5"
          />
          <circle
            cx="680"
            cy="425"
            r="1.5"
          />
          <circle
            cx="1010"
            cy="120"
            r="1.5"
          />
        </g>

        {/* EXTRA NETWORK CONNECTIONS */}

        <g
          fill="none"
          stroke="rgba(244,85,42,0.16)"
          strokeWidth="1"
          filter="url(#softMapGlow)"
        >
          <path d="M170 145 L305 90 L475 335" />
          <path d="M475 335 L680 425 L890 185" />
          <path d="M890 185 L1010 120 L1080 370" />
        </g>

        {/* MOVING SIGNAL */}

        <g>
          <circle
            r="12"
            fill="rgba(244,85,42,0.22)"
            filter="url(#mapSignalGlow)"
          >
            <animateMotion
              dur="18s"
              repeatCount="indefinite"
              path="M40 420 C180 120 300 450 470 160 S760 80 900 340 S1100 160 1180 80"
            />
          </circle>

          <circle
            r="3"
            fill="rgba(244,85,42,0.75)"
          >
            <animateMotion
              dur="18s"
              repeatCount="indefinite"
              path="M40 420 C180 120 300 450 470 160 S760 80 900 340 S1100 160 1180 80"
            />
          </circle>
        </g>

        {/* SCANNING LINE */}

        <line
          x1="-100"
          y1="0"
          x2="-100"
          y2="520"
          stroke="rgba(244,85,42,0.16)"
          strokeWidth="1"
        >
          <animate
            attributeName="x1"
            values="-100;1300;-100"
            dur="22s"
            repeatCount="indefinite"
          />

          <animate
            attributeName="x2"
            values="-100;1300;-100"
            dur="22s"
            repeatCount="indefinite"
          />
        </line>
      </svg>

      {/* EDGE FADE */}

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 15%, rgba(5,5,5,0.12) 55%, rgba(5,5,5,0.55) 100%)',
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,5,0.65), transparent)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            'linear-gradient(0deg, rgba(5,5,5,0.65), transparent)',
        }}
      />
    </div>
  )
}

/* ================================================================
   BUILD STOPS
   ================================================================ */

function buildStops(
  count,
  width,
  height,
) {
  const out = []

  const left = EDGE
  const right =
    width - EDGE

  const center =
    height / 2

  const amplitude = Math.min(
    145,
    height * 0.28,
  )

  for (
    let i = 0;
    i < count;
    i++
  ) {
    const progress =
      count > 1
        ? i / (count - 1)
        : 0

    const x =
      left +
      (right - left) *
        progress

    const wave =
      Math.sin(
        progress *
          Math.PI *
          2.15,
      )

    const secondary =
      Math.sin(
        progress *
          Math.PI *
          5.1 +
          0.7,
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

/* ================================================================
   WAYPOINTS
   ================================================================ */

function buildWaypoints(
  stops,
) {
  if (!stops.length) {
    return []
  }

  const waypoints = []

  waypoints.push({
    x:
      stops[0].x - 42,
    y:
      stops[0].y - 24,
  })

  for (
    let i = 0;
    i < stops.length;
    i++
  ) {
    const current =
      stops[i]

    waypoints.push(
      current,
    )

    const next =
      stops[i + 1]

    if (!next) {
      break
    }

    const dx =
      next.x -
      current.x

    const dy =
      next.y -
      current.y

    const length =
      Math.hypot(
        dx,
        dy,
      ) || 1

    const direction =
      i % 2 === 0
        ? -1
        : 1

    const amplitude =
      28 +
      (i % 3) * 8

    waypoints.push({
      x:
        (current.x +
          next.x) /
          2 +
        (-dy / length) *
          amplitude *
          direction,

      y:
        (current.y +
          next.y) /
          2 +
        (dx / length) *
          amplitude *
          direction,
    })
  }

  const last =
    stops[
      stops.length - 1
    ]

  waypoints.push({
    x:
      last.x + 42,
    y:
      last.y + 24,
  })

  return waypoints
}

/* ================================================================
   ROUTE PATH
   ================================================================ */

function routePath(
  stops,
) {
  const points =
    buildWaypoints(
      stops,
    )

  if (
    points.length < 2
  ) {
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
      points[i - 1] ||
      points[i]

    const p1 =
      points[i]

    const p2 =
      points[i + 1]

    const p3 =
      points[i + 2] ||
      p2

    const c1x =
      p1.x +
      (p2.x - p0.x) /
        6

    const c1y =
      p1.y +
      (p2.y - p0.y) /
        6

    const c2x =
      p2.x -
      (p3.x - p1.x) /
        6

    const c2y =
      p2.y -
      (p3.y - p1.y) /
        6

    d +=
      ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ` +
      `${c2x.toFixed(2)} ${c2y.toFixed(2)}, ` +
      `${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }

  return d
}

/* ================================================================
   ROUTE GRADIENT
   ================================================================ */

function gradientStops(
  points,
  width,
) {
  let last = 0

  return points.map(
    (point, index) => {
      const entry =
        timeline[index] ||
        {}

      const offset =
        Math.max(
          last,
          clamp(
            point.x /
              (width || 1),
            0,
            1,
          ),
        )

      last = offset

      return (
        <stop
          key={
            entry.id ||
            index
          }
          offset={offset}
          stopColor={textColor(
            entry,
          )}
        />
      )
    },
  )
}

/* ================================================================
   ROUTE DISTANCE
   ================================================================ */

function lengthAt(
  element,
  target,
  total,
) {
  let best = 0
  let bestDistance =
    Infinity

  const steps = 260

  for (
    let i = 0;
    i <= steps;
    i++
  ) {
    const distance =
      (i / steps) *
      total

    const point =
      element.getPointAtLength(
        distance,
      )

    const difference =
      (point.x -
        target.x) ** 2 +
      (point.y -
        target.y) ** 2

    if (
      difference <
      bestDistance
    ) {
      bestDistance =
        difference

      best =
        distance
    }
  }

  const span =
    total / steps

  for (
    let i = -20;
    i <= 20;
    i++
  ) {
    const distance =
      clamp(
        best +
          (i / 20) *
            span,
        0,
        total,
      )

    const point =
      element.getPointAtLength(
        distance,
      )

    const difference =
      (point.x -
        target.x) ** 2 +
      (point.y -
        target.y) ** 2

    if (
      difference <
      bestDistance
    ) {
      bestDistance =
        difference

      best =
        distance
    }
  }

  return best
}

/* ================================================================
   CARD PLACEMENT
   ================================================================ */

function placeCard(
  point,
  index,
  points,
  width,
  height,
) {
  const blockers =
    points
      .filter(
        (_, i) =>
          i !== index,
      )
      .map((p) => ({
        x0:
          p.x - 78,
        x1:
          p.x + 78,
        y0:
          p.y - 32,
        y1:
          p.y + 84,
      }))

  const own = {
    x0:
      point.x - 78,
    x1:
      point.x + 78,
    y0:
      point.y - 32,
    y1:
      point.y + 84,
  }

  const overlaps = (
    rect,
    obstacle,
  ) =>
    rect.left +
      CARD_W >
      obstacle.x0 &&
    rect.left <
      obstacle.x1 &&
    rect.top +
      CARD_H >
      obstacle.y0 &&
    rect.top <
      obstacle.y1

  const centerLeft =
    point.x -
    CARD_W / 2

  const centerTop =
    point.y -
    CARD_H / 2

  const preferDown =
    point.y <
    height / 2

  let best = null

  const consider = (
    left,
    top,
  ) => {
    if (
      left < 0 ||
      top < 0 ||
      left + CARD_W >
        width ||
      top + CARD_H >
        height
    ) {
      return
    }

    const rect = {
      left,
      top,
    }

    if (
      overlaps(
        rect,
        own,
      )
    ) {
      return
    }

    const covered =
      blockers.filter(
        (obstacle) =>
          overlaps(
            rect,
            obstacle,
          ),
      ).length

    const distance =
      Math.hypot(
        left +
          CARD_W / 2 -
          point.x,

        top +
          CARD_H / 2 -
          point.y,
      )

    const score =
      distance +
      covered * 100

    if (
      !best ||
      score <
        best.score
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
      point.y +
      CARD_GAP

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
        centerLeft -
          offset,
        down,
      )

      consider(
        centerLeft +
          offset,
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
        centerLeft -
          offset,
        up,
      )

      consider(
        centerLeft +
          offset,
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
      point.x -
        CARD_W -
        72,
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
      fallbackTop(
        point,
        height,
      ),
      0,
      Math.max(
        0,
        height - CARD_H,
      ),
    ),
  }
}

function fallbackTop(
  point,
  height,
) {
  if (
    point.y +
      CARD_GAP +
      CARD_H <=
    height
  ) {
    return (
      point.y +
      CARD_GAP
    )
  }

  return (
    point.y -
    CARD_GAP -
    CARD_H
  )
}

/* ================================================================
   DESKTOP STOP
   ================================================================ */

function Stop({
  entry,
  point,
  active,
  dimmed,
  onEnter,
}) {
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
      aria-label={`${entry.year} — ${
        entry.short ||
        entry.title
      }`}
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-opacity duration-300"
      style={{
        left: point.x,
        top: point.y,
        opacity:
          dimmed ? 0.42 : 1,
      }}
    >
      {labelAbove && (
        <StopLabel
          entry={entry}
          active={active}
          above
        />
      )}

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

/* ================================================================
   STOP LABEL
   ================================================================ */

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
        className="mt-1 max-w-[160px] whitespace-nowrap text-center text-[11.5px] leading-tight transition-opacity duration-300"
        style={{
          color:
            'var(--ink)',
          opacity:
            active ? 1 : 0.68,
        }}
      >
        {entry.short ||
          entry.title}
      </span>

      {entry.id ===
        'aston' && (
        <span
          className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em]"
          style={{
            color:
              textColor(
                entry,
              ),
            opacity:
              active ? 1 : 0.9,
          }}
        >
          Now
        </span>
      )}
    </span>
  )
}

/* ================================================================
   DETAIL
   ================================================================ */

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
          color:
            'var(--ink)',
        }}
      >
        {entry.title}
      </h3>

      <p
        className="mono-label mt-2"
        style={{
          color:
            'var(--muted)',
        }}
      >
        {entry.org}
      </p>

      {entry.status && (
        <p
          className="mono-label mt-2 flex items-center gap-1.5"
          style={{
            color:
              textColor(
                entry,
              ),
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              background:
                textColor(
                  entry,
                ),
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
              textColor(
                entry,
              ),
            borderColor:
              textColor(
                entry,
              ),
          }}
        >
          {linkLabel(
            entry.href,
          )}

          <span aria-hidden="true">
            ↗
          </span>
        </a>
      )}
    </>
  )
}

/* ================================================================
   LINK LABEL
   ================================================================ */

function linkLabel(
  href = '',
) {
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

/* ================================================================
   STOP MARK
   ================================================================ */

function StopMark({
  entry,
  isActive,
}) {
  const accent =
    entry.accent ||
    'var(--accent)'

  const ink = isActive
    ? onFill(
        entry.accent,
      )
    : textColor(entry)

  const Mark =
    markFor(entry)

  const isCurrent =
    entry.id === 'aston'

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
            : isCurrent
              ? `0 0 0 5px ${accent}12`
              : 'none',

        transition:
          'transform 300ms ease, box-shadow 300ms ease',
      }}
    >
      {isCurrent && (
        <>
          <span
            className="absolute inset-[-10px] rounded-full border"
            style={{
              borderColor:
                `${accent}30`,
              animation:
                'timelinePulse 3.2s ease-out infinite',
            }}
          />

          <span
            className="absolute -right-3 -top-3 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em]"
            style={{
              color:
                accent,
              background:
                '#0A0908',
              border:
                `1px solid ${accent}55`,
            }}
          >
            NOW
          </span>
        </>
      )}

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

/* ================================================================
   COLOUR HELPERS
   ================================================================ */

const textColor = (
  entry,
) =>
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

/* ================================================================
   CLAMP
   ================================================================ */

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

/* ================================================================
   CURRENT NODE ANIMATION
   ================================================================ */

if (
  typeof document !==
    'undefined' &&
  !document.getElementById(
    'timeline-pulse-style',
  )
) {
  const style =
    document.createElement(
      'style',
    )

  style.id =
    'timeline-pulse-style'

  style.textContent = `
    @keyframes timelinePulse {
      0% {
        transform: scale(0.82);
        opacity: 0.65;
      }

      70% {
        transform: scale(1.18);
        opacity: 0;
      }

      100% {
        transform: scale(1.18);
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .timeline-map-motion {
        animation: none !important;
      }
    }
  `

  document.head.appendChild(
    style,
  )
}
