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
      style={{ opacity: 0.82 }}
    >
      <style>{`
        @keyframes mountainDrift {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-14px, 3px, 0);
          }
        }

        @keyframes cloudDrift {
          0% {
            transform: translate3d(-40px, 0, 0);
          }
          50% {
            transform: translate3d(30px, -4px, 0);
          }
          100% {
            transform: translate3d(-40px, 0, 0);
          }
        }

        @keyframes roadSignal {
          0%, 100% {
            opacity: .35;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes carJourney {
          0% {
            offset-distance: 0%;
            opacity: 0;
          }
          6% {
            opacity: 1;
          }
          94% {
            opacity: 1;
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
          }
        }

        @keyframes birds {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(18px, -7px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .comic-map-animated {
            animation: none !important;
          }
        }
      `}</style>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 520"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Atmospheric background */}
          <linearGradient
            id="comicSky"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="rgba(18,20,27,0.92)"
            />
            <stop
              offset="55%"
              stopColor="rgba(10,12,15,0.72)"
            />
            <stop
              offset="100%"
              stopColor="rgba(4,5,6,0.96)"
            />
          </linearGradient>

          {/* Mountain haze */}
          <linearGradient
            id="mountainFar"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="rgba(100,108,116,0.20)"
            />
            <stop
              offset="100%"
              stopColor="rgba(35,39,43,0.05)"
            />
          </linearGradient>

          <linearGradient
            id="mountainMid"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="rgba(54,61,67,0.75)"
            />
            <stop
              offset="100%"
              stopColor="rgba(13,16,18,0.92)"
            />
          </linearGradient>

          <linearGradient
            id="mountainDark"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="rgba(28,32,35,0.92)"
            />
            <stop
              offset="100%"
              stopColor="rgba(4,5,6,1)"
            />
          </linearGradient>

          {/* Road */}
          <linearGradient
            id="comicRoad"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="rgba(20,21,22,0.98)"
            />
            <stop
              offset="50%"
              stopColor="rgba(38,38,37,0.98)"
            />
            <stop
              offset="100%"
              stopColor="rgba(17,18,18,0.98)"
            />
          </linearGradient>

          {/* Road glow */}
          <filter
            id="roadGlow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>

          <filter
            id="softGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Mountain texture */}
          <pattern
            id="comicHatch"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(24)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="12"
              stroke="rgba(244,244,245,0.055)"
              strokeWidth="1"
            />
          </pattern>

          {/* Route for the tiny car */}
          <path
            id="carRoute"
            d="
              M -70 455
              C 75 425 80 330 205 342
              C 315 353 305 440 415 414
              C 530 388 505 274 610 266
              C 735 257 708 350 830 327
              C 945 305 900 184 1010 174
              C 1085 167 1130 130 1270 84
            "
          />
        </defs>

        {/* =====================================================
            SKY
           ===================================================== */}

        <rect
          x="0"
          y="0"
          width="1200"
          height="520"
          fill="url(#comicSky)"
        />

        {/* tiny stars / comic specks */}

        <g opacity="0.28">
          <circle cx="120" cy="54" r="1.2" fill="#f4f4f5" />
          <circle cx="215" cy="88" r="1" fill="#f4f4f5" />
          <circle cx="350" cy="42" r="1.4" fill="#f4f4f5" />
          <circle cx="505" cy="75" r="1" fill="#f4f4f5" />
          <circle cx="675" cy="43" r="1.3" fill="#f4f4f5" />
          <circle cx="835" cy="82" r="1" fill="#f4f4f5" />
          <circle cx="1010" cy="50" r="1.2" fill="#f4f4f5" />
        </g>

        {/* =====================================================
            CLOUDS
           ===================================================== */}

        <g
          className="comic-map-animated"
          style={{
            animation:
              'cloudDrift 24s ease-in-out infinite',
          }}
          opacity="0.38"
        >
          <path
            d="
              M60 125
              C50 106 70 90 92 94
              C100 70 138 69 148 96
              C172 89 190 107 186 126
              Z
            "
            fill="rgba(115,120,125,0.32)"
            stroke="rgba(244,244,245,0.10)"
            strokeWidth="1"
          />

          <path
            d="
              M880 112
              C868 94 890 77 912 84
              C920 60 958 61 969 87
              C995 79 1012 99 1006 119
              Z
            "
            fill="rgba(115,120,125,0.30)"
            stroke="rgba(244,244,245,0.09)"
            strokeWidth="1"
          />
        </g>

        {/* =====================================================
            DISTANT MOUNTAINS
           ===================================================== */}

        <g
          className="comic-map-animated"
          style={{
            animation:
              'mountainDrift 22s ease-in-out infinite',
          }}
        >
          <path
            d="
              M0 260
              L95 138
              L145 204
              L220 95
              L290 185
              L375 110
              L445 210
              L535 132
              L610 205
              L700 100
              L790 205
              L875 125
              L955 212
              L1050 112
              L1200 245
              L1200 360
              L0 360
              Z
            "
            fill="url(#mountainFar)"
            stroke="rgba(244,244,245,0.08)"
            strokeWidth="2"
          />

          {/* snow-like comic highlights */}

          <g
            fill="none"
            stroke="rgba(244,244,245,0.16)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M80 158 L95 138 L108 160" />
            <path d="M202 120 L220 95 L240 121" />
            <path d="M357 137 L375 110 L395 139" />
            <path d="M682 126 L700 100 L722 128" />
            <path d="M1030 138 L1050 112 L1070 140" />
          </g>
        </g>

        {/* =====================================================
            MID MOUNTAINS
           ===================================================== */}

        <path
          d="
            M0 330
            L105 188
            L170 272
            L260 150
            L340 264
            L450 170
            L530 286
            L630 150
            L725 274
            L835 165
            L920 280
            L1025 175
            L1110 270
            L1200 205
            L1200 520
            L0 520
            Z
          "
          fill="url(#mountainMid)"
          stroke="rgba(244,244,245,0.12)"
          strokeWidth="2"
        />

        {/* mountain hatch */}

        <path
          d="
            M0 330
            L105 188
            L170 272
            L260 150
            L340 264
            L450 170
            L530 286
            L630 150
            L725 274
            L835 165
            L920 280
            L1025 175
            L1110 270
            L1200 205
            L1200 520
            L0 520
            Z
          "
          fill="url(#comicHatch)"
        />

        {/* mountain ridge highlights */}

        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M105 188 L170 272"
            stroke="rgba(244,244,245,0.18)"
            strokeWidth="3"
          />
          <path
            d="M260 150 L340 264"
            stroke="rgba(244,244,245,0.16)"
            strokeWidth="3"
          />
          <path
            d="M450 170 L530 286"
            stroke="rgba(244,244,245,0.15)"
            strokeWidth="3"
          />
          <path
            d="M630 150 L725 274"
            stroke="rgba(244,244,245,0.16)"
            strokeWidth="3"
          />
          <path
            d="M835 165 L920 280"
            stroke="rgba(244,244,245,0.14)"
            strokeWidth="3"
          />
        </g>

        {/* =====================================================
            PINE FOREST
           ===================================================== */}

        <g opacity="0.72">
          {[
            [45, 350, 34],
            [82, 372, 28],
            [126, 342, 38],
            [174, 380, 30],
            [235, 344, 35],
            [300, 365, 28],
            [355, 342, 40],
            [405, 375, 28],
            [470, 350, 36],
            [525, 372, 28],
            [585, 345, 34],
            [655, 365, 30],
            [710, 342, 38],
            [770, 375, 28],
            [825, 350, 34],
            [890, 370, 30],
            [945, 345, 38],
            [1010, 375, 30],
            [1070, 350, 35],
            [1140, 370, 30],
          ].map(([x, y, size], index) => (
            <path
              key={index}
              d={`
                M ${x} ${y}
                L ${x - size / 2} ${y + size * 1.5}
                L ${x - size * 0.18} ${y + size * 1.5}
                L ${x - size * 0.42} ${y + size * 2.1}
                L ${x + size * 0.42} ${y + size * 2.1}
                L ${x + size * 0.18} ${y + size * 1.5}
                L ${x + size / 2} ${y + size * 1.5}
                Z
              `}
              fill="rgba(5,7,8,0.92)"
              stroke="rgba(244,244,245,0.06)"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* =====================================================
            WINDING MOUNTAIN ROAD
           ===================================================== */}

        {/* soft road glow */}

        <path
          d="
            M-70 455
            C75 425 80 330 205 342
            C315 353 305 440 415 414
            C530 388 505 274 610 266
            C735 257 708 350 830 327
            C945 305 900 184 1010 174
            C1085 167 1130 130 1270 84
          "
          fill="none"
          stroke="rgba(244,85,42,0.25)"
          strokeWidth="20"
          strokeLinecap="round"
          filter="url(#roadGlow)"
        />

        {/* road body */}

        <path
          d="
            M-70 455
            C75 425 80 330 205 342
            C315 353 305 440 415 414
            C530 388 505 274 610 266
            C735 257 708 350 830 327
            C945 305 900 184 1010 174
            C1085 167 1130 130 1270 84
          "
          fill="none"
          stroke="rgba(3,4,5,0.96)"
          strokeWidth="30"
          strokeLinecap="round"
        />

        {/* road surface */}

        <path
          d="
            M-70 455
            C75 425 80 330 205 342
            C315 353 305 440 415 414
            C530 388 505 274 610 266
            C735 257 708 350 830 327
            C945 305 900 184 1010 174
            C1085 167 1130 130 1270 84
          "
          fill="none"
          stroke="url(#comicRoad)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* road outer comic outlines */}

        <path
          d="
            M-70 455
            C75 425 80 330 205 342
            C315 353 305 440 415 414
            C530 388 505 274 610 266
            C735 257 708 350 830 327
            C945 305 900 184 1010 174
            C1085 167 1130 130 1270 84
          "
          fill="none"
          stroke="rgba(244,244,245,0.16)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* yellow/orange road markings */}

        <path
          d="
            M-70 455
            C75 425 80 330 205 342
            C315 353 305 440 415 414
            C530 388 505 274 610 266
            C735 257 708 350 830 327
            C945 305 900 184 1010 174
            C1085 167 1130 130 1270 84
          "
          fill="none"
          stroke="rgba(244,85,42,0.72)"
          strokeWidth="2"
          strokeDasharray="12 14"
          strokeLinecap="round"
        />

        {/* =====================================================
            ROAD MARKERS
           ===================================================== */}

        {[
          [72, 418],
          [205, 342],
          [320, 427],
          [515, 322],
          [705, 294],
          [900, 250],
          [1015, 173],
          [1115, 137],
        ].map(([cx, cy], index) => (
          <g
            key={index}
            style={{
              animation:
                `roadSignal ${2.2 + index * 0.12}s ease-in-out infinite`,
              animationDelay: `${index * 180}ms`,
            }}
          >
            <circle
              cx={cx}
              cy={cy}
              r="10"
              fill="rgba(244,85,42,0.14)"
              filter="url(#softGlow)"
            />

            <circle
              cx={cx}
              cy={cy}
              r="3"
              fill="rgba(244,85,42,0.8)"
            />
          </g>
        ))}

        {/* =====================================================
            LITTLE CAR
           ===================================================== */}

        <g
          className="comic-map-animated"
          style={{
            offsetPath:
              "path('M -70 455 C75 425 80 330 205 342 C315 353 305 440 415 414 C530 388 505 274 610 266 C735 257 708 350 830 327 C945 305 900 184 1010 174 C1085 167 1130 130 1270 84')",
            animation:
              'carJourney 32s linear infinite',
          }}
        >
          {/* car shadow */}

          <ellipse
            cx="0"
            cy="10"
            rx="17"
            ry="5"
            fill="rgba(0,0,0,0.55)"
          />

          {/* car body */}

          <path
            d="
              M-18 3
              L-12 -6
              L-4 -9
              L7 -8
              L15 -2
              L19 5
              L16 9
              L-16 9
              Z
            "
            fill="#111315"
            stroke="rgba(244,85,42,0.9)"
            strokeWidth="1.5"
          />

          {/* windows */}

          <path
            d="M-9 -5 L-3 -7 L3 -6 L7 -2 L-8 -2 Z"
            fill="rgba(180,190,195,0.18)"
            stroke="rgba(244,244,245,0.22)"
            strokeWidth="0.8"
          />

          {/* headlights */}

          <circle
            cx="18"
            cy="3"
            r="1.5"
            fill="rgba(255,214,150,0.95)"
          />

          <circle
            cx="-16"
            cy="3"
            r="1.2"
            fill="rgba(244,85,42,0.8)"
          />

          {/* wheels */}

          <circle
            cx="-10"
            cy="9"
            r="3"
            fill="#050505"
            stroke="rgba(244,244,245,0.25)"
            strokeWidth="1"
          />

          <circle
            cx="11"
            cy="9"
            r="3"
            fill="#050505"
            stroke="rgba(244,244,245,0.25)"
            strokeWidth="1"
          />
        </g>

        {/* =====================================================
            COMIC BIRDS
           ===================================================== */}

        <g
          className="comic-map-animated"
          style={{
            animation:
              'birds 7s ease-in-out infinite',
          }}
          fill="none"
          stroke="rgba(244,244,245,0.30)"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M420 105 q5 -5 10 0 q5 -5 10 0" />
          <path d="M452 124 q4 -4 8 0 q4 -4 8 0" />
          <path d="M780 92 q5 -5 10 0 q5 -5 10 0" />
        </g>

        {/* =====================================================
            WOODEN SIGNPOST
           ===================================================== */}

        <g transform="translate(1020 355) rotate(-4)">
          <path
            d="M0 0 L5 90"
            stroke="rgba(19,13,9,0.9)"
            strokeWidth="7"
          />

          <path
            d="
              M-45 15
              L28 4
              L35 29
              L-38 40
              Z
            "
            fill="rgba(35,25,18,0.92)"
            stroke="rgba(244,244,245,0.13)"
            strokeWidth="1"
          />

          <path
            d="
              M-42 49
              L32 38
              L39 63
              L-35 74
              Z
            "
            fill="rgba(35,25,18,0.92)"
            stroke="rgba(244,244,245,0.13)"
            strokeWidth="1"
          />

          <text
            x="-29"
            y="30"
            fill="rgba(244,244,245,0.55)"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="700"
            letterSpacing="1"
          >
            AHEAD
          </text>

          <text
            x="-27"
            y="64"
            fill="rgba(244,244,245,0.42)"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="700"
            letterSpacing="1"
          >
            NEXT
          </text>
        </g>

        {/* =====================================================
            SMALL CAMPS / LANDMARKS
           ===================================================== */}

        <g opacity="0.55">
          {/* cabin */}
          <g transform="translate(150 395)">
            <path
              d="M0 15 L22 0 L44 15 V38 H0 Z"
              fill="rgba(8,9,9,0.92)"
              stroke="rgba(244,244,245,0.13)"
              strokeWidth="1"
            />
            <path
              d="M-3 16 L22 -3 L47 16"
              fill="none"
              stroke="rgba(244,85,42,0.45)"
              strokeWidth="2"
            />
            <rect
              x="17"
              y="24"
              width="8"
              height="14"
              fill="rgba(244,85,42,0.18)"
            />
          </g>

          {/* tiny flag */}
          <g transform="translate(860 210)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="42"
              stroke="rgba(244,244,245,0.28)"
              strokeWidth="1"
            />
            <path
              d="M0 2 L22 7 L0 13 Z"
              fill="rgba(244,85,42,0.45)"
            />
          </g>
        </g>

        {/* =====================================================
            VIGNETTE
           ===================================================== */}

        <rect
          x="0"
          y="0"
          width="1200"
          height="520"
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth="80"
        />
      </svg>
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
