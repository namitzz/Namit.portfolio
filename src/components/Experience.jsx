import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useReducedMotion } from 'framer-motion'
import { timeline } from '../data/content'
import Reveal from './Reveal'

/*
|--------------------------------------------------------------------------
| EXPERIENCE — CODED RPG / ISOMETRIC JOURNEY MAP
|--------------------------------------------------------------------------
|
| No external map image.
|
| Everything is drawn with SVG:
|   - terrain
|   - water
|   - roads
|   - trees
|   - buildings
|   - bridges
|   - route
|   - destination markers
|   - traveller
|
| The important part:
| the artwork and the interaction are the SAME coordinate system.
|
|--------------------------------------------------------------------------
*/

const VIEW_W = 1400
const VIEW_H = 820

/*
 * These are the actual timeline destinations.
 *
 * Coordinates are deliberately hand placed so the route feels like
 * travelling through a little world rather than reading a chart.
 */
const MAP_STOPS = {
  leicester: {
    x: 150,
    y: 235,
    building: 'university',
  },

  modelling: {
    x: 360,
    y: 150,
    building: 'competition',
  },

  consultancy: {
    x: 585,
    y: 205,
    building: 'hall',
  },

  consul: {
    x: 815,
    y: 145,
    building: 'office',
  },

  ctf: {
    x: 1080,
    y: 245,
    building: 'lab',
  },

  microinternship: {
    x: 985,
    y: 430,
    building: 'studio',
  },

  cloudseven: {
    x: 760,
    y: 535,
    building: 'office',
  },

  classfutures: {
    x: 490,
    y: 470,
    building: 'library',
  },

  uniwise: {
    x: 270,
    y: 620,
    building: 'lab',
  },

  graduation: {
    x: 690,
    y: 690,
    building: 'university',
  },

  aston: {
    x: 1110,
    y: 655,
    building: 'aston',
  },
}

/*
|--------------------------------------------------------------------------
| ROUTE
|--------------------------------------------------------------------------
*/

const ROUTE = [
  [150, 235],
  [215, 205],
  [275, 175],
  [360, 150],

  [425, 170],
  [505, 185],
  [585, 205],

  [670, 180],
  [745, 155],
  [815, 145],

  [890, 175],
  [965, 205],
  [1080, 245],

  [1060, 315],
  [1020, 370],
  [985, 430],

  [900, 475],
  [830, 510],
  [760, 535],

  [670, 515],
  [580, 490],
  [490, 470],

  [425, 515],
  [350, 565],
  [270, 620],

  [365, 650],
  [480, 675],
  [590, 685],
  [690, 690],

  [795, 680],
  [900, 665],
  [1000, 655],
  [1110, 655],
]

function routePath(points) {
  if (!points.length) return ''

  return points
    .map(([x, y], index) => {
      if (index === 0) return `M ${x} ${y}`

      const [px, py] = points[index - 1]

      const cx = (px + x) / 2
      const cy = (py + y) / 2

      return `Q ${cx} ${cy} ${x} ${y}`
    })
    .join(' ')
}

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export default function Experience() {
  const reduce = useReducedMotion()

  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const animationRef = useRef(null)

  const [active, setActive] = useState(null)

  const [traveller, setTraveller] = useState({
    x: ROUTE[0][0],
    y: ROUTE[0][1],
    rotation: 0,
    length: 0,
  })

  const [routeLength, setRouteLength] = useState(0)
  const [stopLengths, setStopLengths] = useState([])

  const path = useMemo(
    () => routePath(ROUTE),
    [],
  )

  /*
   * Convert each destination into a distance along the SVG route.
   */
  useEffect(() => {
    if (!pathRef.current) return

    const element = pathRef.current
    const total = element.getTotalLength()

    const lengths = timeline.map((entry) => {
      const stop = MAP_STOPS[entry.id]

      if (!stop) return 0

      let best = 0
      let bestDistance = Infinity

      for (let i = 0; i <= 500; i += 1) {
        const length =
          (i / 500) * total

        const point =
          element.getPointAtLength(
            length,
          )

        const distance =
          (point.x - stop.x) ** 2 +
          (point.y - stop.y) ** 2

        if (distance < bestDistance) {
          bestDistance = distance
          best = length
        }
      }

      return best
    })

    setRouteLength(total)
    setStopLengths(lengths)

    const first =
      element.getPointAtLength(0)

    setTraveller({
      x: first.x,
      y: first.y,
      rotation: 0,
      length: 0,
    })
  }, [path])

  /*
   * Stop animation.
   */
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current,
        )
      }
    }
  }, [])

  /*
   * Walk the character to a destination.
   */
  const travelTo = (index) => {
    if (
      !pathRef.current ||
      !routeLength ||
      !stopLengths[index]
    ) {
      setActive(index)
      return
    }

    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current,
      )
    }

    const target =
      stopLengths[index]

    const start =
      traveller.length

    const distance =
      Math.abs(target - start)

    const duration = reduce
      ? 0
      : Math.min(
          2600,
          Math.max(
            900,
            distance * 2.7,
          ),
        )

    const started =
      performance.now()

    const tick = (now) => {
      const raw =
        duration === 0
          ? 1
          : Math.min(
              1,
              (now - started) /
                duration,
            )

      const eased =
        1 -
        Math.pow(
          1 - raw,
          3,
        )

      const length =
        start +
        (target - start) *
          eased

      const point =
        pathRef.current.getPointAtLength(
          length,
        )

      const lookLength = Math.min(
        routeLength,
        Math.max(
          0,
          length +
            (target >= start
              ? 3
              : -3),
        ),
      )

      const next =
        pathRef.current.getPointAtLength(
          lookLength,
        )

      const rotation =
        Math.atan2(
          next.y - point.y,
          next.x - point.x,
        ) *
        (180 / Math.PI)

      setTraveller({
        x: point.x,
        y: point.y,
        rotation,
        length,
      })

      if (raw < 1) {
        animationRef.current =
          requestAnimationFrame(
            tick,
          )
      } else {
        animationRef.current = null
        setActive(index)
      }
    }

    animationRef.current =
      requestAnimationFrame(
        tick,
      )
  }

  /*
   * Current progress along the route.
   */
  const travelled =
    active !== null
      ? stopLengths[active] || 0
      : traveller.length

  const currentEntry =
    active !== null
      ? timeline[active]
      : null

  return (
    <section
      id="experience"
      className="relative px-6 py-24 md:px-12 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, rgba(244,85,42,0.07), transparent 35%, rgba(244,244,245,0.02))',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">

        {/* ----------------------------------------------------------
            HEADER
           ---------------------------------------------------------- */}

        <Reveal
          className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b pb-6"
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
              className="serif mt-3 text-[clamp(2rem,4vw,3.4rem)] leading-none"
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

            <p
              className="mt-4 max-w-xl text-sm leading-relaxed"
              style={{
                color:
                  'var(--muted)',
              }}
            >
              Start in Leicester. Follow the road.
              Click a building to explore what happened there.
            </p>
          </div>

          <div
            className="font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{
              color:
                'var(--muted)',
            }}
          >
            {timeline.length} destinations · 2023 – present
          </div>
        </Reveal>

        {/* ----------------------------------------------------------
            DESKTOP WORLD
           ---------------------------------------------------------- */}

        <div
          className="relative hidden overflow-hidden rounded-[2rem] border md:block"
          style={{
            borderColor:
              'rgba(244,244,245,0.12)',
            background:
              '#6f9b62',
            boxShadow:
              '0 40px 120px -50px rgba(0,0,0,0.9)',
          }}
        >

          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="block h-auto w-full"
            role="img"
            aria-label="Interactive experience journey map"
          >
            <defs>

              {/* =====================================================
                  WORLD LIGHT
                 ===================================================== */}

              <linearGradient
                id="worldSky"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#a9c98b"
                />
                <stop
                  offset="100%"
                  stopColor="#719b61"
                />
              </linearGradient>

              <linearGradient
                id="grass"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#82ad6c"
                />
                <stop
                  offset="100%"
                  stopColor="#5e8955"
                />
              </linearGradient>

              <linearGradient
                id="water"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#79b9ca"
                />
                <stop
                  offset="100%"
                  stopColor="#4b8498"
                />
              </linearGradient>

              <linearGradient
                id="road"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#e8cf9f"
                />
                <stop
                  offset="100%"
                  stopColor="#c39b62"
                />
              </linearGradient>

              <linearGradient
                id="roofRed"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#d96849"
                />
                <stop
                  offset="100%"
                  stopColor="#8d382d"
                />
              </linearGradient>

              <linearGradient
                id="roofBlue"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#597fa0"
                />
                <stop
                  offset="100%"
                  stopColor="#304e6d"
                />
              </linearGradient>

              <filter
                id="mapShadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="7"
                  floodColor="#1b2a1d"
                  floodOpacity="0.35"
                />
              </filter>

              <filter
                id="routeGlow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur
                  stdDeviation="7"
                />
              </filter>

              <pattern
                id="grassTexture"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M5 25l3-5M17 11l3-5M27 28l2-4"
                  stroke="#4f7d4b"
                  strokeWidth="2"
                  opacity="0.22"
                />
              </pattern>

            </defs>

            {/* =======================================================
                WORLD
               ======================================================= */}

            <rect
              width={VIEW_W}
              height={VIEW_H}
              fill="url(#worldSky)"
            />

            {/* Large landmass */}

            <path
              d="
                M0 80
                Q180 20 330 70
                Q500 10 690 75
                Q870 20 1060 80
                Q1240 35 1400 100
                L1400 820
                L0 820
                Z
              "
              fill="url(#grass)"
            />

            <path
              d="
                M0 80
                Q180 20 330 70
                Q500 10 690 75
                Q870 20 1060 80
                Q1240 35 1400 100
                L1400 820
                L0 820
                Z
              "
              fill="url(#grassTexture)"
            />

            {/* =======================================================
                RIVER
               ======================================================= */}

            <path
              d="
                M1180 -20
                C1080 80 1210 155 1110 245
                C1010 335 1110 400 1210 455
                C1300 505 1230 625 1130 850
                L1400 850
                L1400 -20
                Z
              "
              fill="url(#water)"
              opacity="0.92"
            />

            {/* Water highlights */}

            <g
              fill="none"
              stroke="#a8d6dc"
              strokeWidth="4"
              opacity="0.35"
            >
              <path d="M1230 110q55-25 105 5" />
              <path d="M1160 280q55-25 105 5" />
              <path d="M1250 500q55-25 105 5" />
              <path d="M1180 690q55-25 105 5" />
            </g>

            {/* =======================================================
                ISOMETRIC TERRAIN BLOCKS
               ======================================================= */}

            <g opacity="0.95">

              {/* hill 1 */}

              <polygon
                points="30,330 115,285 200,330 115,375"
                fill="#73975d"
              />
              <polygon
                points="30,330 115,375 115,405 30,360"
                fill="#587d50"
              />
              <polygon
                points="115,375 200,330 200,360 115,405"
                fill="#4f7249"
              />

              {/* hill 2 */}

              <polygon
                points="1120,500 1210,450 1300,500 1210,550"
                fill="#789b5e"
              />
              <polygon
                points="1120,500 1210,550 1210,580 1120,530"
                fill="#597c4e"
              />
              <polygon
                points="1210,550 1300,500 1300,530 1210,580"
                fill="#4f7148"
              />

              {/* hill 3 */}

              <polygon
                points="370,705 450,665 530,705 450,745"
                fill="#789b5e"
              />
              <polygon
                points="370,705 450,745 450,770 370,730"
                fill="#597c4e"
              />
              <polygon
                points="450,745 530,705 530,730 450,770"
                fill="#4e7047"
              />

            </g>

            {/* =======================================================
                ROADS / STREETS
               ======================================================= */}

            {/* Main journey road */}

            <path
              d={path}
              fill="none"
              stroke="#9a764c"
              strokeWidth="58"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.45"
            />

            <path
              d={path}
              fill="none"
              stroke="url(#road)"
              strokeWidth="48"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Road edge */}

            <path
              d={path}
              fill="none"
              stroke="#f1dfb8"
              strokeWidth="3"
              strokeDasharray="3 15"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Side streets */}

            <g
              fill="none"
              stroke="#c5a36e"
              strokeWidth="26"
              strokeLinecap="round"
              opacity="0.72"
            >
              <path d="M360 150L350 90L285 65" />
              <path d="M585 205L610 275L680 310" />
              <path d="M815 145L850 90L920 70" />
              <path d="M760 535L690 580L610 600" />
              <path d="M270 620L205 675L135 680" />
              <path d="M690 690L690 760L755 790" />
            </g>

            {/* =======================================================
                BRIDGES
               ======================================================= */}

            <g
              transform="translate(1065 315) rotate(28)"
              filter="url(#mapShadow)"
            >
              <rect
                x="-45"
                y="-25"
                width="90"
                height="50"
                rx="6"
                fill="#76523b"
              />

              <path
                d="M-38-16h76M-38 0h76M-38 16h76"
                stroke="#cda476"
                strokeWidth="7"
              />
            </g>

            {/* =======================================================
                TREES
               ======================================================= */}

            <Trees />

            {/* =======================================================
                FARMS / FIELDS
               ======================================================= */}

            <g opacity="0.8">

              <polygon
                points="70,550 170,495 260,545 160,600"
                fill="#b9a866"
              />

              <path
                d="M95 555l90-50M120 570l90-50M145 585l90-50"
                stroke="#8d7c48"
                strokeWidth="4"
              />

              <polygon
                points="870,730 970,675 1050,720 950,775"
                fill="#b5a261"
              />

              <path
                d="M895 735l90-50M920 750l90-50M945 765l90-50"
                stroke="#897646"
                strokeWidth="4"
              />

            </g>

            {/* =======================================================
                TOWN / BUILDINGS
               ======================================================= */}

            {timeline.map((entry, index) => {
              const position =
                MAP_STOPS[entry.id]

              if (!position) return null

              return (
                <MapDestination
                  key={entry.id}
                  entry={entry}
                  index={index}
                  position={position}
                  active={
                    active === index
                  }
                  onClick={() =>
                    travelTo(index)
                  }
                />
              )
            })}

            {/* =======================================================
                ROUTE GLOW
               ======================================================= */}

            {routeLength > 0 && (
              <path
                d={path}
                fill="none"
                stroke="#F4552A"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.22"
                filter="url(#routeGlow)"
                style={{
                  strokeDasharray:
                    routeLength,
                  strokeDashoffset:
                    routeLength -
                    travelled,
                }}
              />
            )}

            {/* =======================================================
                ACTIVE ROUTE
               ======================================================= */}

            {routeLength > 0 && (
              <path
                d={path}
                fill="none"
                stroke="#F4552A"
                strokeWidth="7"
                strokeLinecap="round"
                style={{
                  strokeDasharray:
                    routeLength,
                  strokeDashoffset:
                    routeLength -
                    travelled,
                }}
              />
            )}

            {/* =======================================================
                HIDDEN MEASUREMENT PATH
               ======================================================= */}

            <path
              ref={pathRef}
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth="1"
            />

            {/* =======================================================
                TRAVELLER
               ======================================================= */}

            <Traveller
              x={traveller.x}
              y={traveller.y}
              rotation={
                traveller.rotation
              }
            />

            {/* =======================================================
                MAP TITLE
               ======================================================= */}

            <g transform="translate(45 45)">
              <rect
                width="250"
                height="54"
                rx="12"
                fill="rgba(20,32,24,0.78)"
                stroke="rgba(255,255,255,0.15)"
              />

              <text
                x="20"
                y="22"
                fill="#f7e8c9"
                fontSize="10"
                fontFamily="monospace"
                letterSpacing="2"
              >
                NAMIT'S JOURNEY
              </text>

              <text
                x="20"
                y="41"
                fill="#ffffff"
                fontSize="15"
                fontFamily="Georgia, serif"
              >
                Leicester → Birmingham
              </text>
            </g>

            {/* =======================================================
                COMPASS
               ======================================================= */}

            <Compass
              x={1320}
              y={700}
            />

          </svg>

          {/* --------------------------------------------------------
              DETAIL CARD
             -------------------------------------------------------- */}

          {currentEntry && (
            <ExperienceCard
              entry={currentEntry}
              index={active}
              total={timeline.length}
              onPrevious={() =>
                travelTo(
                  Math.max(
                    0,
                    active - 1,
                  ),
                )
              }
              onNext={() =>
                travelTo(
                  Math.min(
                    timeline.length - 1,
                    active + 1,
                  ),
                )
              }
              onClose={() =>
                setActive(null)
              }
            />
          )}

          {/* --------------------------------------------------------
              MAP HINT
             -------------------------------------------------------- */}

          {!currentEntry && (
            <div
              className="pointer-events-none absolute bottom-5 left-6 rounded-full border px-4 py-2 backdrop-blur-md"
              style={{
                background:
                  'rgba(20,30,22,0.65)',
                borderColor:
                  'rgba(255,255,255,0.12)',
              }}
            >
              <span
                className="font-mono text-[9px] uppercase tracking-[0.15em]"
                style={{
                  color:
                    'rgba(255,255,255,0.72)',
                }}
              >
                Click a destination to begin
              </span>
            </div>
          )}

        </div>

        {/* ==========================================================
            MOBILE
           ========================================================== */}

        <div className="md:hidden">

          <div
            className="mb-8 overflow-hidden rounded-2xl border"
            style={{
              borderColor:
                'var(--hairline)',
              background:
                '#668c59',
            }}
          >
            <svg
              viewBox="0 0 800 620"
              className="block w-full"
            >
              <rect
                width="800"
                height="620"
                fill="#6f9b62"
              />

              <path
                d="
                  M0 100
                  Q180 40 350 90
                  Q550 30 800 100
                  L800 620
                  L0 620
                  Z
                "
                fill="#6f985e"
              />

              {/* river */}

              <path
                d="
                  M690 0
                  C620 110 735 170 650 260
                  C590 340 690 410 730 480
                  C760 530 720 580 690 620
                  L800 620
                  L800 0
                  Z
                "
                fill="#5d99ac"
              />

              {/* road */}

              <path
                d={path}
                transform="translate(-300 -80) scale(0.72)"
                fill="none"
                stroke="#d7b77c"
                strokeWidth="55"
                strokeLinecap="round"
              />

              {/* trees */}

              <Trees mobile />

              {timeline.map(
                (entry, index) => {
                  const p =
                    MAP_STOPS[entry.id]

                  if (!p) return null

                  return (
                    <g
                      key={entry.id}
                      transform={`
                        translate(
                          ${p.x * 0.55 - 10}
                          ${p.y * 0.55 + 30}
                        )
                      `}
                      onClick={() =>
                        travelTo(index)
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <circle
                        r="19"
                        fill={
                          active === index
                            ? '#F4552A'
                            : '#f5e8c9'
                        }
                        stroke="#3d3025"
                        strokeWidth="3"
                      />

                      <text
                        textAnchor="middle"
                        y="5"
                        fontSize="11"
                        fontFamily="monospace"
                        fill={
                          active === index
                            ? '#fff'
                            : '#332a20'
                        }
                      >
                        {index + 1}
                      </text>
                    </g>
                  )
                },
              )}
            </svg>
          </div>

          <div className="space-y-5">
            {timeline.map(
              (entry, index) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() =>
                    travelTo(index)
                  }
                  className="flex w-full gap-4 rounded-2xl border p-4 text-left transition-all"
                  style={{
                    borderColor:
                      active === index
                        ? textColor(entry)
                        : 'var(--hairline)',
                    background:
                      active === index
                        ? `${textColor(entry)}10`
                        : 'transparent',
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
                    style={{
                      color:
                        active === index
                          ? '#fff'
                          : textColor(entry),
                      background:
                        active === index
                          ? textColor(entry)
                          : `${textColor(entry)}12`,
                    }}
                  >
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </div>

                  <div>
                    <p
                      className="font-mono text-[9px] uppercase tracking-[0.12em]"
                      style={{
                        color:
                          textColor(entry),
                      }}
                    >
                      {entry.year}
                    </p>

                    <h3
                      className="serif mt-1 text-lg"
                      style={{
                        color:
                          'var(--ink)',
                      }}
                    >
                      {entry.title}
                    </h3>

                    <p
                      className="mt-1 text-xs"
                      style={{
                        color:
                          'var(--muted)',
                      }}
                    >
                      {entry.org}
                    </p>
                  </div>
                </button>
              ),
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

/*
|--------------------------------------------------------------------------
| DESTINATION
|--------------------------------------------------------------------------
*/

function MapDestination({
  entry,
  index,
  position,
  active,
  onClick,
}) {
  return (
    <g
      transform={`
        translate(
          ${position.x}
          ${position.y}
        )
      `}
      onClick={onClick}
      role="button"
      tabIndex="0"
      aria-label={`${entry.year}: ${entry.title}`}
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault()
          onClick()
        }
      }}
      style={{
        cursor: 'pointer',
      }}
    >

      {/* clickable ground shadow */}

      <ellipse
        cx="0"
        cy="28"
        rx="70"
        ry="24"
        fill="#253923"
        opacity="0.25"
      />

      {/* active beacon */}

      {active && (
        <>
          <circle
            cx="0"
            cy="-5"
            r="38"
            fill="none"
            stroke="#F4552A"
            strokeWidth="4"
            opacity="0.5"
            style={{
              animation:
                'experiencePulse 1.6s ease-out infinite',
            }}
          />

          <circle
            cx="0"
            cy="-5"
            r="26"
            fill="#F4552A"
            opacity="0.13"
          />
        </>
      )}

      <Building
        type={position.building}
        active={active}
      />

      {/* destination plaque */}

      <g
        transform="translate(0 58)"
      >
        <rect
          x="-76"
          y="-18"
          width="152"
          height="32"
          rx="8"
          fill="rgba(245,232,201,0.94)"
          stroke="rgba(54,42,29,0.24)"
        />

        <text
          x="0"
          y="-3"
          textAnchor="middle"
          fontSize="9"
          fontFamily="monospace"
          fill="#493a2c"
          letterSpacing="0.5"
        >
          {entry.short ||
            entry.title}
        </text>

        <text
          x="0"
          y="10"
          textAnchor="middle"
          fontSize="7"
          fontFamily="monospace"
          fill="#8b6e4d"
        >
          {entry.year}
        </text>
      </g>

      {/* number */}

      <circle
        cx="30"
        cy="-48"
        r="12"
        fill={
          active
            ? '#F4552A'
            : '#2d4732'
        }
        stroke="#f4e8cd"
        strokeWidth="2"
      />

      <text
        x="30"
        y="-44"
        textAnchor="middle"
        fontSize="7"
        fontFamily="monospace"
        fill="#fff"
      >
        {index + 1}
      </text>

    </g>
  )
}

/*
|--------------------------------------------------------------------------
| BUILDINGS
|--------------------------------------------------------------------------
*/

function Building({
  type,
  active,
}) {
  const roof =
    type === 'lab' ||
    type === 'office'
      ? 'url(#roofBlue)'
      : 'url(#roofRed)'

  const scale =
    active ? 1.08 : 1

  return (
    <g
      transform={`scale(${scale})`}
      filter="url(#mapShadow)"
    >

      {/* foundation */}

      <polygon
        points="-48,5 0,-22 48,5 0,32"
        fill="#66523d"
      />

      {/* left wall */}

      <polygon
        points="-42,-5 0,17 0,-45 -42,-68"
        fill={
          type === 'university'
            ? '#d9d1b7'
            : '#cbbd9e'
        }
      />

      {/* right wall */}

      <polygon
        points="0,17 42,-5 42,-68 0,-45"
        fill="#9e8e74"
      />

      {/* roof left */}

      <polygon
        points="-53,-65 0,-94 0,-42 -43,-17"
        fill={roof}
      />

      {/* roof right */}

      <polygon
        points="0,-94 53,-65 43,-17 0,-42"
        fill={roof}
      />

      {/* roof ridge */}

      <path
        d="M-53-65L0-94L53-65"
        fill="none"
        stroke="#e7c8a2"
        strokeWidth="3"
      />

      {/* windows */}

      <polygon
        points="-31,-38 -14,-29 -14,-13 -31,-22"
        fill="#7bb2bd"
        stroke="#584c3c"
        strokeWidth="2"
      />

      <polygon
        points="14,-29 31,-38 31,-22 14,-13"
        fill="#75aab5"
        stroke="#584c3c"
        strokeWidth="2"
      />

      {/* door */}

      <polygon
        points="-9,10 9,1 9,-25 -9,-16"
        fill="#5b4535"
      />

      {/* sign */}

      {type !== 'office' && (
        <g
          transform="translate(0 -106)"
        >
          <rect
            x="-28"
            y="-8"
            width="56"
            height="16"
            rx="4"
            fill="#f1e2c0"
            stroke="#66533e"
            strokeWidth="2"
          />

          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontSize="6"
            fontFamily="monospace"
            fill="#4d3b2a"
          >
            {buildingLabel(type)}
          </text>
        </g>
      )}

      {/* special flags */}

      {type === 'university' && (
        <g>
          <path
            d="M0-94V-130"
            stroke="#503b2c"
            strokeWidth="3"
          />

          <path
            d="M0-130L25-122L0-115Z"
            fill="#d5203d"
          />
        </g>
      )}

      {type === 'aston' && (
        <g>
          <path
            d="M0-94V-132"
            stroke="#503b2c"
            strokeWidth="3"
          />

          <path
            d="M0-132L28-124L0-116Z"
            fill="#F4552A"
          />
        </g>
      )}

    </g>
  )
}

function buildingLabel(type) {
  const labels = {
    university: 'CAMPUS',
    competition: 'CMS',
    hall: 'CHALLENGE',
    office: 'CONSUL',
    lab: 'CTF LAB',
    studio: 'MICRO',
    library: 'CLASS',
    aston: 'ASTON',
  }

  return labels[type] || 'STOP'
}

/*
|--------------------------------------------------------------------------
| TREES
|--------------------------------------------------------------------------
*/

function Trees({ mobile = false }) {
  const trees = [
    [75, 170],
    [105, 125],
    [230, 110],
    [290, 300],
    [430, 315],
    [520, 95],
    [650, 115],
    [735, 330],
    [880, 320],
    [970, 105],
    [1130, 105],
    [1250, 180],
    [1260, 600],
    [1130, 570],
    [900, 600],
    [610, 390],
    [380, 390],
    [150, 430],
    [80, 700],
    [190, 750],
    [540, 750],
    [850, 770],
  ]

  const scale =
    mobile ? 0.58 : 1

  return (
    <g
      transform={`scale(${scale})`}
    >
      {trees.map(
        ([x, y], index) => (
          <Tree
            key={index}
            x={x}
            y={y}
            variant={
              index % 3
            }
          />
        ),
      )}
    </g>
  )
}

function Tree({
  x,
  y,
  variant = 0,
}) {
  const size =
    variant === 1
      ? 1.15
      : variant === 2
        ? 0.85
        : 1

  return (
    <g
      transform={`
        translate(${x} ${y})
        scale(${size})
      `}
    >
      {/* shadow */}

      <ellipse
        cx="0"
        cy="22"
        rx="20"
        ry="8"
        fill="#30482f"
        opacity="0.3"
      />

      {/* trunk */}

      <polygon
        points="-6,12 6,8 6,31 -6,35"
        fill="#694b36"
      />

      {/* lower canopy */}

      <polygon
        points="0,-30 25,-5 13,17 0,23 -14,17 -25,-5"
        fill="#356442"
      />

      {/* upper canopy */}

      <polygon
        points="0,-52 19,-28 10,-5 0,5 -12,-5 -20,-28"
        fill="#487a4d"
      />

      {/* highlight */}

      <polygon
        points="-4,-42 7,-27 1,-17 -9,-24"
        fill="#78a961"
        opacity="0.75"
      />
    </g>
  )
}

/*
|--------------------------------------------------------------------------
| TRAVELLER
|--------------------------------------------------------------------------
*/

function Traveller({
  x,
  y,
  rotation,
}) {
  return (
    <g
      transform={`
        translate(${x} ${y})
        rotate(${rotation})
      `}
      style={{
        transition:
          'transform 45ms linear',
        pointerEvents:
          'none',
      }}
    >

      {/* shadow */}

      <ellipse
        cx="0"
        cy="14"
        rx="15"
        ry="6"
        fill="#1e2a20"
        opacity="0.45"
      />

      {/* backpack */}

      <rect
        x="-14"
        y="-15"
        width="10"
        height="19"
        rx="3"
        fill="#285c49"
        stroke="#152d24"
        strokeWidth="2"
      />

      {/* body */}

      <polygon
        points="-7,-12 6,-9 10,8 -8,8"
        fill="#F4552A"
        stroke="#42190f"
        strokeWidth="2"
      />

      {/* head */}

      <circle
        cx="1"
        cy="-21"
        r="8"
        fill="#d99a70"
        stroke="#3c2116"
        strokeWidth="2"
      />

      {/* hair */}

      <path
        d="
          M-7-23
          Q0-32 8-24
          L7-18
          L-7-18
          Z
        "
        fill="#241b18"
      />

      {/* arm */}

      <path
        d="M6-5L15 2"
        fill="none"
        stroke="#d99a70"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* legs */}

      <path
        d="M-4 7L-11 17"
        stroke="#283033"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M5 7L12 16"
        stroke="#283033"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* travelling spark */}

      <circle
        cx="-16"
        cy="19"
        r="2"
        fill="#F4552A"
      />

      <circle
        cx="18"
        cy="16"
        r="1.5"
        fill="#F5B447"
      />

    </g>
  )
}

/*
|--------------------------------------------------------------------------
| COMPASS
|--------------------------------------------------------------------------
*/

function Compass({
  x,
  y,
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
    >
      <circle
        r="42"
        fill="rgba(20,32,24,0.65)"
        stroke="#eadbbd"
        strokeWidth="2"
        opacity="0.9"
      />

      <path
        d="M0-30L8 0L0 30L-8 0Z"
        fill="#F4552A"
      />

      <path
        d="M0-30L8 0L0 30L-8 0Z"
        fill="none"
        stroke="#eadbbd"
        strokeWidth="2"
      />

      <text
        x="0"
        y="-35"
        textAnchor="middle"
        fill="#eadbbd"
        fontSize="10"
        fontFamily="monospace"
      >
        N
      </text>
    </g>
  )
}

/*
|--------------------------------------------------------------------------
| EXPERIENCE CARD
|--------------------------------------------------------------------------
*/

function ExperienceCard({
  entry,
  index,
  total,
  onPrevious,
  onNext,
  onClose,
}) {
  return (
    <div
      className="absolute bottom-6 left-6 z-30 w-[min(380px,calc(100%-3rem))] overflow-hidden rounded-2xl border p-5"
      style={{
        borderColor:
          textColor(entry),
        background:
          'rgba(17,20,18,0.94)',
        backdropFilter:
          'blur(18px)',
        boxShadow:
          '0 30px 90px -35px rgba(0,0,0,0.95)',
      }}
    >

      <div className="flex items-start justify-between gap-4">

        <div>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{
              color:
                textColor(entry),
            }}
          >
            Destination {index + 1} / {total}
          </p>

          <p
            className="mt-1 font-mono text-[9px]"
            style={{
              color:
                'rgba(255,255,255,0.45)',
            }}
          >
            {entry.year}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full border text-sm"
          style={{
            color:
              'rgba(255,255,255,0.65)',
            borderColor:
              'rgba(255,255,255,0.12)',
          }}
          aria-label="Close experience"
        >
          ×
        </button>

      </div>

      <h3
        className="serif mt-3 text-[1.35rem] leading-tight"
        style={{
          color:
            '#f4f4f5',
        }}
      >
        {entry.title}
      </h3>

      <p
        className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em]"
        style={{
          color:
            'rgba(255,255,255,0.45)',
        }}
      >
        {entry.org}
      </p>

      {entry.status && (
        <span
          className="mt-3 inline-flex rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em]"
          style={{
            color:
              textColor(entry),
            borderColor:
              `${textColor(entry)}55`,
            background:
              `${textColor(entry)}12`,
          }}
        >
          {entry.status}
        </span>
      )}

      <p
        className="mt-4 text-[13px] leading-relaxed"
        style={{
          color:
            'rgba(244,244,245,0.72)',
        }}
      >
        {entry.body}
      </p>

      {entry.href && (
        <a
          href={entry.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex border-b pb-0.5 font-mono text-[10px] uppercase tracking-[0.1em]"
          style={{
            color:
              textColor(entry),
            borderColor:
              textColor(entry),
          }}
        >
          View related link ↗
        </a>
      )}

      <div
        className="mt-5 flex items-center justify-between border-t pt-4"
        style={{
          borderColor:
            'rgba(255,255,255,0.08)',
        }}
      >

        <button
          type="button"
          onClick={onPrevious}
          disabled={index === 0}
          className="font-mono text-[9px] uppercase tracking-[0.12em] disabled:opacity-20"
          style={{
            color:
              'rgba(255,255,255,0.65)',
          }}
        >
          ← Previous
        </button>

        <span
          className="font-mono text-[8px]"
          style={{
            color:
              'rgba(255,255,255,0.3)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
          {' '}
          /
          {' '}
          {String(total).padStart(2, '0')}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={index === total - 1}
          className="font-mono text-[9px] uppercase tracking-[0.12em] disabled:opacity-20"
          style={{
            color:
              'rgba(255,255,255,0.65)',
          }}
        >
          Next →
        </button>

      </div>

    </div>
  )
}

/*
|--------------------------------------------------------------------------
| COLOUR
|--------------------------------------------------------------------------
*/

function textColor(entry) {
  if (entry.tint) return entry.tint
  if (entry.accent) return entry.accent

  if (entry.kind === 'education') {
    return '#F4552A'
  }

  if (entry.kind === 'project') {
    return '#4C8FD8'
  }

  if (entry.kind === 'experience') {
    return '#35B89A'
  }

  return '#F5B447'
}

/*
|--------------------------------------------------------------------------
| MAP ANIMATION
|--------------------------------------------------------------------------
*/

if (
  typeof document !== 'undefined' &&
  !document.getElementById(
    'experience-map-animation',
  )
) {
  const style =
    document.createElement(
      'style',
    )

  style.id =
    'experience-map-animation'

  style.textContent = `
    @keyframes experiencePulse {
      0% {
        transform: scale(0.65);
        opacity: 0.7;
      }

      70% {
        transform: scale(1.35);
        opacity: 0;
      }

      100% {
        transform: scale(1.35);
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #experience svg *,
      #experience * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `

  document.head.appendChild(
    style,
  )
}
