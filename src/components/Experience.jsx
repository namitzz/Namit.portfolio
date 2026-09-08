import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { timeline } from '../data/content'
import { markFor } from './TimelineMarks'
import Reveal from './Reveal'

/*
 * EXPERIENCE / EDUCATION TIMELINE
 *
 * Desktop:
 * - Animated cartographic background
 * - Curved progression route
 * - Permanent year + event labels
 * - Interactive coloured nodes
 * - Current Aston position highlighted as NOW
 * - Hover/focus opens detailed information card
 * - Route lights up towards the selected event
 *
 * Mobile:
 * - Clean vertical timeline
 * - Full details visible
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

  /* ================================================================ */
  /* MEASURE CONTAINER                                                */
  /* ================================================================ */

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

  /* ================================================================ */
  /* ROUTE GEOMETRY                                                   */
  /* ================================================================ */

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

  /* ================================================================ */
  /* ACTIVE CARD                                                      */
  /* ================================================================ */

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

  /* ================================================================ */
  /* MEASURE ROUTE LENGTH                                             */
  /* ================================================================ */

  useLayoutEffect(() => {
    const el = pathRef.current

    if (
      !el ||
      !d ||
      !points.length
    ) {
      return
    }

    const total =
      el.getTotalLength()

    setArc({
      total,

      at: points.map(
        (point) =>
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

  /* ================================================================ */

  return (
    <section
      id="experience"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, #050505 0%, #080706 45%, #050505 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">

        {/* ========================================================== */}
        {/* SECTION HEADING                                             */}
        {/* ========================================================== */}

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

            {/* Small legend */}
            <div
              className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] md:flex"
              style={{
                color:
                  'var(--muted)',
              }}
            >
              <span>
                ● EDUCATION
              </span>

              <span>
                ● PROJECT
              </span>

              <span>
                ● EXPERIENCE
              </span>
            </div>
          </div>
        </Reveal>

        {/* ========================================================== */}
        {/* DESKTOP TIMELINE                                           */}
        {/* ========================================================== */}

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

          {/* ======================================================== */}
          {/* ANIMATED MAP BACKGROUND                                  */}
          {/* ======================================================== */}

          <AnimatedMapBackground />

          {/* ======================================================== */}
          {/* ROUTE SVG                                                */}
          {/* ======================================================== */}

          {box.w > 0 && (
            <svg
              aria-hidden="true"
              width={box.w}
              height={height}
              className="absolute left-0 top-0 z-[3]"
            >
              <defs>

                {/* ================================================== */}
                {/* ROUTE GLOW                                          */}
                {/* ================================================== */}

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

                {/* ================================================== */}
                {/* ROUTE COLOUR GRADIENT                              */}
                {/* ================================================== */}

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

              {/* ==================================================== */}
              {/* TRAVELLING ROUTE GLOW                               */}
              {/* ==================================================== */}

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

              {/* ==================================================== */}
              {/* MAIN DOTTED ROUTE                                   */}
              {/* ==================================================== */}

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

          {/* ======================================================== */}
          {/* TIMELINE STOPS                                          */}
          {/* ======================================================== */}

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

          {/* ======================================================== */}
          {/* DETAIL CARD                                              */}
          {/* ======================================================== */}

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

        {/* ========================================================== */}
        {/* MOBILE TIMELINE                                            */}
        {/* ========================================================== */}

        <ol className="md:hidden">
          {timeline.map(
            (entry, index) => (
              <li
                key={entry.id}
                className="relative grid grid-cols-[3.5rem_1fr] gap-4"
              >

                {index <
                  timeline.length -
                    1 && (
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

/* ================================================================== */
/* ANIMATED CARTOGRAPHIC BACKGROUND                                   */
/* ================================================================== */

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

          {/* ======================================================== */}
          {/* MAP GRID                                                */}
          {/* ======================================================== */}

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

          {/* ======================================================== */}
          {/* SOFT CENTRE GLOW                                         */}
          {/* ======================================================== */}

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

          {/* ======================================================== */}
          {/* SIGNAL GLOW                                             */}
          {/* ======================================================== */}

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

          {/* ======================================================== */}
          {/* ROUTE-LIKE MAP GLOW                                     */}
          {/* ======================================================== */}

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

        {/* ========================================================== */}
        {/* GRID                                                       */}
        {/* ========================================================== */}

        <rect
          width="1200"
          height="520"
          fill="url(#mapGrid)"
        />

        {/* ========================================================== */}
        {/* CENTRE LIGHT                                              */}
        {/* ========================================================== */}

        <rect
          width="1200"
          height="520"
          fill="url(#mapGlow)"
        />

        {/* ========================================================== */}
        {/* TOPOGRAPHIC CONTOURS                                      */}
        {/* ========================================================== */}

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

        {/* ========================================================== */}
        {/* SECONDARY CARTOGRAPHIC LINES                              */}
        {/* ========================================================== */}

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

        {/* ========================================================== */}
        {/* MAP JUNCTIONS                                             */}
        {/* ========================================================== */}

        <g
          fill="none"
          stroke="rgba(244,244,245,0.14)"
          strokeWidth="1"
        >
          <circle
            cx="170"
            cy="145"
            r="24"
          />

          <circle
            cx="170"
            cy="145"
            r="42"
          />

          <circle
            cx="475"
            cy="335"
            r="18"
          />

          <circle
            cx="475"
            cy="335"
            r="34"
          />

          <circle
            cx="890"
            cy="185"
            r="25"
          />

          <circle
            cx="890"
            cy="185"
            r="47"
          />

          <circle
            cx="1080"
            cy="370"
            r="20"
          />

          <circle
            cx="1080"
            cy="370"
            r="38"
          />
        </g>

        {/* ========================================================== */}
        {/* SMALL MAP NODES                                           */}
        {/* ========================================================== */}

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

        {/* ========================================================== */}
        {/* EXTRA NETWORK CONNECTIONS                                 */}
        {/* ========================================================== */}

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

        {/* ========================================================== */}
        {/* MOVING SIGNAL                                             */}
        {/* ========================================================== */}

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

        {/* ========================================================== */}
        {/* SCANNING LINE                                             */}
        {/* ========================================================== */}

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

      {/* ============================================================ */}
      {/* EDGE FADE                                                    */}
      {/* ============================================================ */}

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
