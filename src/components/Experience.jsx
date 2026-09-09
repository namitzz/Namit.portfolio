import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useReducedMotion } from 'framer-motion'
import { timeline } from '../data/content'
import { markFor } from './TimelineMarks'
import Reveal from './Reveal'

const TRACK_H = 560
const CARD_W = 340
const CARD_H = 280
const CARD_GAP = 78
const EDGE = 80

export default function Experience() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const pathRef = useRef(null)
  const animationRef = useRef(null)

  const [box, setBox] = useState({
    w: 0,
    h: TRACK_H,
  })

  const [active, setActive] = useState(null)

  const [arc, setArc] = useState({
    total: 0,
    at: [],
  })

  const [traveller, setTraveller] = useState({
    x: 0,
    y: 0,
    rotation: 0,
    length: 0,
    visible: false,
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

    const total =
      el.getTotalLength()

    const at = points.map(
      (point) =>
        lengthAt(
          el,
          point,
          total,
        ),
    )

    setArc({
      total,
      at,
    })

    if (
      traveller.length === 0 &&
      at.length
    ) {
      const first =
        el.getPointAtLength(0)

      setTraveller({
        x: first.x,
        y: first.y,
        rotation: 0,
        length: 0,
        visible: true,
      })
    }
  }, [d, points])

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current,
      )

      animationRef.current = null
    }
  }

  const walkTo = (index) => {
    if (
      !pathRef.current ||
      !arc.total ||
      !points[index]
    ) {
      setActive(index)
      return
    }

    stopAnimation()

    const path =
      pathRef.current

    const target =
      arc.at[index] || 0

    const start =
      traveller.visible
        ? traveller.length
        : 0

    const distance = Math.abs(
      target - start,
    )

    const duration = reduce
      ? 0
      : Math.min(
          2400,
          Math.max(
            850,
            distance * 3.4,
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
        path.getPointAtLength(
          length,
        )

      const lookDistance =
        Math.min(
          arc.total,
          Math.max(
            0,
            length +
              (target >= start
                ? 2
                : -2),
          ),
        )

      const next =
        path.getPointAtLength(
          lookDistance,
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
        visible: true,
      })

      if (raw < 1) {
        animationRef.current =
          requestAnimationFrame(
            tick,
          )
      } else {
        animationRef.current =
          null

        setActive(index)
      }
    }

    animationRef.current =
      requestAnimationFrame(
        tick,
      )
  }

  useLayoutEffect(() => {
    return () => stopAnimation()
  }, [])

  const travelled =
    active !== null
      ? arc.at[active] || 0
      : traveller.length

  return (
    <section
      id="experience"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, rgba(244,85,42,0.075) 0%, rgba(244,244,245,0.015) 42%, rgba(244,244,245,0.025) 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">

        {/* =========================================================
            HEADING
           ========================================================= */}

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

            <p
              className="mt-4 max-w-xl text-sm leading-relaxed"
              style={{
                color:
                  'var(--muted)',
              }}
            >
              Click a stop and follow the journey.
            </p>
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
              <span className="text-[#F4552A]">
                ● EDUCATION
              </span>

              <span className="text-[#4C8FD8]">
                ● PROJECT
              </span>

              <span className="text-[#35B89A]">
                ● EXPERIENCE
              </span>
            </div>
          </div>
        </Reveal>

        {/* =========================================================
            DESKTOP MAP
           ========================================================= */}

        <div
          ref={wrapRef}
          className="relative hidden overflow-hidden rounded-[2rem] border md:block"
          style={{
            height,
            borderColor:
              'rgba(244,244,245,0.10)',
            background:
              '#17251F',
            boxShadow:
              '0 40px 100px -55px rgba(0,0,0,0.9)',
          }}
        >
          <IllustratedMap />

          {/* -------------------------------------------------------
              ROUTE
             ------------------------------------------------------- */}

          {box.w > 0 && (
            <svg
              aria-hidden="true"
              width={box.w}
              height={height}
              className="absolute left-0 top-0 z-[4]"
            >
              <defs>
                <filter
                  id="journeyGlow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur
                    stdDeviation="6"
                  />
                </filter>

                <linearGradient
                  id="journeyRoute"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2={box.w}
                  y2={height}
                >
                  {inkStops}
                </linearGradient>
              </defs>

              {/* glow */}

              {arc.total > 0 && (
                <path
                  d={d}
                  fill="none"
                  stroke="#F4552A"
                  strokeWidth="12"
                  strokeLinecap="round"
                  filter="url(#journeyGlow)"
                  opacity="0.18"
                  style={{
                    strokeDasharray:
                      arc.total,
                    strokeDashoffset:
                      arc.total -
                      travelled,
                  }}
                />
              )}

              {/* cream trail */}

              <path
                d={d}
                fill="none"
                stroke="#F7E8C9"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="2 13"
                opacity="0.95"
              />

              {/* orange centre */}

              {arc.total > 0 && (
                <path
                  d={d}
                  fill="none"
                  stroke="url(#journeyRoute)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray:
                      arc.total,
                    strokeDashoffset:
                      arc.total -
                      travelled,
                    opacity:
                      travelled > 0
                        ? 1
                        : 0,
                    transition:
                      reduce
                        ? 'none'
                        : 'stroke-dashoffset 300ms ease',
                  }}
                />
              )}

              {/* little trail dashes */}

              <path
                ref={pathRef}
                d={d}
                fill="none"
                stroke="#A83B20"
                strokeWidth="1.5"
                strokeDasharray="5 10"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* ---------------------------------------------------
                  TRAVELLER
                 --------------------------------------------------- */}

              {traveller.visible && (
                <Traveller
                  x={traveller.x}
                  y={traveller.y}
                  rotation={
                    traveller.rotation
                  }
                  reduce={reduce}
                />
              )}
            </svg>
          )}

          {/* -------------------------------------------------------
              DESTINATIONS
             ------------------------------------------------------- */}

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
                  onClick={() =>
                    walkTo(index)
                  }
                />
              )
            },
          )}

          {/* -------------------------------------------------------
              DETAIL CARD
             ------------------------------------------------------- */}

          {card && (
            <div
              id="route-card"
              className="absolute z-30 overflow-hidden rounded-2xl border p-5"
              style={{
                left: card.left,
                top: card.top,
                width: CARD_W,
                maxHeight:
                  height -
                  card.top -
                  12,
                borderColor:
                  textColor(
                    card.entry,
                  ),
                background:
                  'rgba(17,19,18,0.94)',
                backdropFilter:
                  'blur(14px)',
                boxShadow:
                  '0 30px 80px -40px rgba(0,0,0,0.95)',
              }}
            >
              <Detail
                entry={card.entry}
                compact
              />
            </div>
          )}

          {/* -------------------------------------------------------
              MAP LABEL
             ------------------------------------------------------- */}

          <div
            className="pointer-events-none absolute bottom-5 left-6 z-[6] rounded-full border px-3 py-1.5 backdrop-blur-sm"
            style={{
              borderColor:
                'rgba(244,244,245,0.12)',
              background:
                'rgba(10,14,12,0.48)',
            }}
          >
            <span
              className="font-mono text-[9px] uppercase tracking-[0.16em]"
              style={{
                color:
                  'rgba(244,244,245,0.55)',
              }}
            >
              Interactive journey map
            </span>
          </div>

          <Compass />
        </div>

        {/* =========================================================
            MOBILE
           ========================================================= */}

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

/* ==================================================================
   ILLUSTRATED MAP
   ================================================================== */

function IllustratedMap() {
  const trees = [
    [40, 110, 0.8],
    [85, 170, 0.65],
    [140, 90, 0.7],
    [190, 125, 0.85],
    [250, 80, 0.6],
    [315, 150, 0.75],
    [370, 92, 0.65],
    [430, 130, 0.9],
    [505, 75, 0.6],
    [560, 125, 0.75],
    [630, 85, 0.7],
    [700, 145, 0.8],
    [770, 90, 0.65],
    [835, 135, 0.85],
    [905, 80, 0.7],
    [970, 135, 0.75],
    [1040, 90, 0.6],
    [1110, 150, 0.8],
    [1160, 95, 0.7],

    [55, 420, 0.8],
    [110, 465, 0.7],
    [170, 425, 0.9],
    [230, 480, 0.65],
    [290, 425, 0.75],
    [355, 470, 0.8],
    [420, 420, 0.7],
    [485, 480, 0.85],
    [555, 425, 0.65],
    [620, 470, 0.8],
    [690, 420, 0.75],
    [760, 470, 0.65],
    [825, 420, 0.85],
    [895, 470, 0.75],
    [965, 420, 0.7],
    [1035, 470, 0.8],
    [1100, 425, 0.7],
    [1160, 470, 0.85],
  ]

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 560"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient
            id="land"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#315B4B"
            />
            <stop
              offset="100%"
              stopColor="#1D382F"
            />
          </linearGradient>

          <linearGradient
            id="mountainBack"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#4E7180"
            />
            <stop
              offset="100%"
              stopColor="#304C55"
            />
          </linearGradient>

          <linearGradient
            id="mountainFront"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#3D6454"
            />
            <stop
              offset="100%"
              stopColor="#203D34"
            />
          </linearGradient>

          <linearGradient
            id="river"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#4E9EB5"
            />
            <stop
              offset="50%"
              stopColor="#5DB7C5"
            />
            <stop
              offset="100%"
              stopColor="#397C98"
            />
          </linearGradient>

          <pattern
            id="terrainLines"
            width="35"
            height="35"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 18 C8 8 20 8 35 16"
              fill="none"
              stroke="#8EB78A"
              strokeWidth="1"
              opacity="0.12"
            />
          </pattern>

          <filter
            id="mapShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="5"
              floodColor="#08120E"
              floodOpacity="0.4"
            />
          </filter>
        </defs>

        {/* =========================================================
            LAND
           ========================================================= */}

        <rect
          width="1200"
          height="560"
          fill="url(#land)"
        />

        <rect
          width="1200"
          height="560"
          fill="url(#terrainLines)"
        />

        {/* =========================================================
            DISTANT MOUNTAINS
           ========================================================= */}

        <path
          d="
            M0 210
            L90 75
            L145 145
            L220 35
            L295 145
            L375 55
            L455 160
            L545 45
            L630 150
            L720 25
            L815 150
            L900 50
            L990 155
            L1080 42
            L1200 155
            L1200 300
            L0 300
            Z
          "
          fill="url(#mountainBack)"
          stroke="#9BC2C4"
          strokeWidth="2"
          opacity="0.75"
        />

        {/* snow caps */}

        <g
          fill="#DDE6DF"
          opacity="0.65"
        >
          <path d="M73 101 L90 75 L108 102 L91 94 Z" />
          <path d="M201 63 L220 35 L241 66 L220 55 Z" />
          <path d="M357 80 L375 55 L398 84 L376 73 Z" />
          <path d="M526 72 L545 45 L568 76 L546 65 Z" />
          <path d="M700 52 L720 25 L744 56 L721 45 Z" />
          <path d="M882 77 L900 50 L924 81 L900 70 Z" />
          <path d="M1060 70 L1080 42 L1105 76 L1080 62 Z" />
        </g>

        {/* =========================================================
            FRONT MOUNTAINS
           ========================================================= */}

        <path
          d="
            M0 300
            L110 185
            L185 285
            L285 155
            L360 280
            L465 175
            L550 300
            L655 165
            L750 285
            L850 175
            L935 295
            L1040 165
            L1120 270
            L1200 205
            L1200 560
            L0 560
            Z
          "
          fill="url(#mountainFront)"
          stroke="#83A98D"
          strokeWidth="2"
          opacity="0.92"
        />

        {/* mountain ink lines */}

        <g
          fill="none"
          stroke="#B3C89E"
          strokeWidth="2"
          opacity="0.23"
        >
          <path d="M110 185 L145 245 L185 285" />
          <path d="M285 155 L320 230 L360 280" />
          <path d="M465 175 L510 245 L550 300" />
          <path d="M655 165 L705 240 L750 285" />
          <path d="M850 175 L895 245 L935 295" />
          <path d="M1040 165 L1080 230 L1120 270" />
        </g>

        {/* =========================================================
            RIVER
           ========================================================= */}

        <path
          d="
            M0 390
            C110 340 155 420 245 392
            C330 365 350 300 440 322
            C535 345 520 425 610 420
            C710 415 700 345 790 360
            C885 375 870 460 960 445
            C1050 430 1090 360 1200 385
            L1200 560
            L0 560
            Z
          "
          fill="url(#river)"
          opacity="0.88"
        />

        {/* river highlight */}

        <path
          d="
            M-20 420
            C100 370 155 445 245 416
            C330 388 355 327 440 348
            C525 370 530 448 615 444
            C710 440 715 370 790 382
            C875 395 875 480 960 466
            C1050 452 1090 385 1220 408
          "
          fill="none"
          stroke="#BDE1DB"
          strokeWidth="3"
          opacity="0.38"
        />

        {/* =========================================================
            BRIDGES
           ========================================================= */}

        <MapBridge x={270} y={398} />
        <MapBridge x={785} y={369} />

        {/* =========================================================
            TREES
           ========================================================= */}

        {trees.map(
          ([x, y, scale], index) => (
            <MapTree
              key={index}
              x={x}
              y={y}
              scale={scale}
            />
          ),
        )}

        {/* =========================================================
            CABINS
           ========================================================= */}

        <MapCabin x={365} y={255} />
        <MapCabin x={905} y={310} />

        {/* =========================================================
            UNIVERSITY / CITY LANDMARK
           ========================================================= */}

        <MapBuilding
          x={700}
          y={255}
        />

        {/* =========================================================
            LITTLE MAP CLOUDS
           ========================================================= */}

        <g
          fill="#F4EBD9"
          opacity="0.62"
        >
          <path
            d="
              M90 52
              C82 42 92 30 106 34
              C111 20 133 22 136 37
              C151 32 161 44 157 55
              Z
            "
          />

          <path
            d="
              M980 62
              C970 50 982 38 996 42
              C1001 27 1023 30 1027 45
              C1043 41 1054 54 1048 67
              Z
            "
          />
        </g>

        {/* =========================================================
            MAP TEXT
           ========================================================= */}

        <g
          fill="#E9E0C9"
          fontFamily="monospace"
          letterSpacing="2"
          opacity="0.42"
        >
          <text
            x="55"
            y="325"
            fontSize="9"
          >
            LEICESTER HILLS
          </text>

          <text
            x="460"
            y="205"
            fontSize="8"
          >
            NORTH TRAIL
          </text>

          <text
            x="930"
            y="290"
            fontSize="8"
          >
            BIRMINGHAM
          </text>
        </g>

        {/* =========================================================
            DECORATIVE MAP LINES
           ========================================================= */}

        <g
          fill="none"
          stroke="#D6C49B"
          strokeWidth="1"
          strokeDasharray="3 7"
          opacity="0.22"
        >
          <path d="M25 285 C180 235 300 250 410 210" />
          <path d="M780 200 C910 180 1040 220 1175 190" />
          <path d="M420 500 C530 475 610 495 720 475" />
        </g>

        {/* =========================================================
            MAP BORDER
           ========================================================= */}

        <rect
          x="8"
          y="8"
          width="1184"
          height="544"
          rx="26"
          fill="none"
          stroke="#F4EBD9"
          strokeWidth="2"
          opacity="0.10"
        />
      </svg>
    </div>
  )
}

/* ==================================================================
   TRAVELLER
   ================================================================== */

function Traveller({
  x,
  y,
  rotation = 0,
  reduce,
}) {
  return (
    <g
      transform={`
        translate(${x} ${y})
        rotate(${rotation})
      `}
      style={{
        transition: reduce
          ? 'none'
          : 'transform 45ms linear',
      }}
    >
      {/* shadow */}

      <ellipse
        cx="0"
        cy="9"
        rx="8"
        ry="3"
        fill="rgba(0,0,0,0.38)"
      />

      {/* backpack */}

      <rect
        x="-8"
        y="-8"
        width="7"
        height="12"
        rx="2"
        fill="#245D4A"
        stroke="#13251E"
        strokeWidth="1"
      />

      {/* backpack strap */}

      <path
        d="M-4 -7 Q0 -10 4 -6"
        fill="none"
        stroke="#CFAE72"
        strokeWidth="1"
      />

      {/* body */}

      <path
        d="
          M-3 -6
          Q1 -9 4 -5
          L5 5
          L-4 5
          Z
        "
        fill="#F4552A"
        stroke="#35150D"
        strokeWidth="1"
      />

      {/* head */}

      <circle
        cx="1"
        cy="-11"
        r="4.2"
        fill="#D99A70"
        stroke="#35150D"
        strokeWidth="1"
      />

      {/* hair */}

      <path
        d="
          M-3 -12
          Q0 -16 4 -13
          L5 -10
          L-3 -10
          Z
        "
        fill="#241A16"
      />

      {/* arm */}

      <path
        d="M3 -4 L8 1"
        fill="none"
        stroke="#D99A70"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* legs */}

      <path
        d="M-2 5 L-6 11"
        fill="none"
        stroke="#24282A"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      <path
        d="M3 5 L7 10"
        fill="none"
        stroke="#24282A"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      {/* walking spark */}

      <circle
        cx="-8"
        cy="12"
        r="1"
        fill="#F4552A"
        opacity="0.8"
      />

      <circle
        cx="9"
        cy="11"
        r="0.8"
        fill="#F5B447"
        opacity="0.7"
      />
    </g>
  )
}

/* ==================================================================
   MAP TREE
   ================================================================== */

function MapTree({
  x,
  y,
  scale = 1,
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      opacity="0.86"
    >
      <path
        d="M0 0 L-18 34 L-8 34 L-24 52 L24 52 L8 34 L18 34 Z"
        fill="#17372D"
        stroke="#10231E"
        strokeWidth="1.5"
      />

      <path
        d="M0 7 L-11 27 L-4 27"
        fill="none"
        stroke="#70926E"
        strokeWidth="1.5"
        opacity="0.45"
      />

      <rect
        x="-2"
        y="50"
        width="4"
        height="9"
        fill="#5C4830"
      />
    </g>
  )
}

/* ==================================================================
   MAP CABIN
   ================================================================== */

function MapCabin({
  x,
  y,
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      opacity="0.82"
      filter="url(#mapShadow)"
    >
      <path
        d="
          M0 20
          L22 3
          L44 20
          V45
          H0
          Z
        "
        fill="#76523B"
        stroke="#E0C29A"
        strokeWidth="1.5"
      />

      <path
        d="
          M-4 20
          L22 0
          L48 20
        "
        fill="none"
        stroke="#D7B887"
        strokeWidth="3"
      />

      <rect
        x="17"
        y="29"
        width="9"
        height="16"
        fill="#35251C"
      />

      <rect
        x="5"
        y="25"
        width="8"
        height="8"
        fill="#E6B45C"
        opacity="0.72"
      />

      <rect
        x="31"
        y="25"
        width="8"
        height="8"
        fill="#E6B45C"
        opacity="0.72"
      />
    </g>
  )
}

/* ==================================================================
   MAP BRIDGE
   ================================================================== */

function MapBridge({
  x,
  y,
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      opacity="0.75"
    >
      <path
        d="M0 0 Q24 22 48 0"
        fill="none"
        stroke="#6B4932"
        strokeWidth="7"
      />

      <path
        d="M0 0 Q24 22 48 0"
        fill="none"
        stroke="#D1A875"
        strokeWidth="3"
        strokeDasharray="5 4"
      />

      <line
        x1="6"
        y1="8"
        x2="6"
        y2="22"
        stroke="#62442F"
        strokeWidth="2"
      />

      <line
        x1="42"
        y1="8"
        x2="42"
        y2="22"
        stroke="#62442F"
        strokeWidth="2"
      />
    </g>
  )
}

/* ==================================================================
   UNIVERSITY / CITY BUILDING
   ================================================================== */

function MapBuilding({
  x,
  y,
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      opacity="0.86"
      filter="url(#mapShadow)"
    >
      <rect
        x="0"
        y="20"
        width="80"
        height="48"
        rx="2"
        fill="#D7C39B"
        stroke="#6D5237"
        strokeWidth="2"
      />

      <path
        d="M-8 21 L40 -4 L88 21 Z"
        fill="#B18A5C"
        stroke="#6D5237"
        strokeWidth="2"
      />

      <rect
        x="32"
        y="42"
        width="16"
        height="26"
        fill="#5C4836"
      />

      {[10, 27, 54, 67].map(
        (xPos) => (
          <rect
            key={xPos}
            x={xPos}
            y="32"
            width="8"
            height="10"
            fill="#7E9AA0"
            stroke="#5B4632"
            strokeWidth="1"
          />
        ),
      )}

      <circle
        cx="40"
        cy="10"
        r="5"
        fill="#F4552A"
      />

      <path
        d="M40 5 L40 -12"
        stroke="#5C4836"
        strokeWidth="2"
      />
    </g>
  )
}

/* ==================================================================
   COMPASS
   ================================================================== */

function Compass() {
  return (
    <div
      className="pointer-events-none absolute bottom-5 right-6 z-[6] flex h-16 w-16 items-center justify-center rounded-full border"
      style={{
        borderColor:
          'rgba(244,235,217,0.24)',
        background:
          'rgba(13,25,20,0.5)',
        backdropFilter:
          'blur(8px)',
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width="52"
        height="52"
      >
        <circle
          cx="32"
          cy="32"
          r="25"
          fill="none"
          stroke="#E6D7B8"
          strokeWidth="1"
          opacity="0.35"
        />

        <path
          d="M32 9 L37 32 L32 55 L27 32 Z"
          fill="#F4552A"
          opacity="0.8"
        />

        <path
          d="M32 9 L37 32 L32 55 L27 32 Z"
          fill="none"
          stroke="#E6D7B8"
          strokeWidth="1"
        />

        <text
          x="32"
          y="7"
          textAnchor="middle"
          fill="#E6D7B8"
          fontSize="6"
          fontFamily="monospace"
        >
          N
        </text>

        <text
          x="32"
          y="62"
          textAnchor="middle"
          fill="#E6D7B8"
          fontSize="6"
          fontFamily="monospace"
        >
          S
        </text>
      </svg>
    </div>
  )
}

/* ==================================================================
   ROUTE STOPS
   ================================================================== */

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
    height * 0.57

  const amplitude =
    Math.min(
      115,
      height * 0.22,
    )

  for (
    let i = 0;
    i < count;
    i++
  ) {
    const progress =
      count > 1
        ? i /
          (count - 1)
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
      ) * 14

    const y =
      center +
      wave * amplitude +
      secondary

    out.push({
      x,
      y: clamp(
        y,
        100,
        height - 90,
      ),
    })
  }

  return out
}

/* ==================================================================
   WAYPOINTS
   ================================================================== */

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
      stops[0].y - 20,
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

    const amount =
      25 +
      (i % 3) * 7

    waypoints.push({
      x:
        (current.x +
          next.x) /
          2 +
        (-dy / length) *
          amount *
          direction,

      y:
        (current.y +
          next.y) /
          2 +
        (dx / length) *
          amount *
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
      last.y + 20,
  })

  return waypoints
}

/* ==================================================================
   ROUTE PATH
   ================================================================== */

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
    i <
    points.length - 1;
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

/* ==================================================================
   ROUTE GRADIENT
   ================================================================== */

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
          offset={
            `${offset * 100}%`
          }
          stopColor={
            routeColor(
              entry,
            )
          }
        />
      )
    },
  )
}

/* ==================================================================
   ROUTE DISTANCE
   ================================================================== */

function lengthAt(
  element,
  target,
  total,
) {
  let best = 0
  let bestDistance =
    Infinity

  const steps = 320

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
        target.x) **
        2 +
      (point.y -
        target.y) **
        2

    if (
      difference <
      bestDistance
    ) {
      bestDistance =
        difference
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
        target.x) **
        2 +
      (point.y -
        target.y) **
        2

    if (
      difference <
      bestDistance
    ) {
      bestDistance =
        difference
      best = distance
    }
  }

  return best
}

/* ==================================================================
   CARD PLACEMENT
   ================================================================== */

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
        x0: p.x - 82,
        x1: p.x + 82,
        y0: p.y - 34,
        y1: p.y + 78,
      }))

  const own = {
    x0: point.x - 82,
    x1: point.x + 82,
    y0: point.y - 34,
    y1: point.y + 78,
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
      left < 12 ||
      top < 12 ||
      left + CARD_W >
        width - 12 ||
      top + CARD_H >
        height - 12
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
      covered * 110

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
      step * 20

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
      point.x + 70,
      centerTop,
    )

    consider(
      point.x -
        CARD_W +
        70,
      centerTop,
    )
  }

  if (best) {
    return best
  }

  return {
    left: clamp(
      centerLeft,
      12,
      Math.max(
        12,
        width -
          CARD_W -
          12,
      ),
    ),

    top: clamp(
      fallbackTop(
        point,
        height,
      ),
      12,
      Math.max(
        12,
        height -
          CARD_H -
          12,
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

/* ==================================================================
   STOP
   ================================================================== */

function Stop({
  entry,
  point,
  active,
  dimmed,
  onEnter,
  onClick,
}) {
  const labelAbove =
    point.y > 285

  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onClick}
      aria-describedby={
        active
          ? 'route-card'
          : undefined
      }
      aria-label={`${entry.year} ${entry.short || entry.title}`}
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-300"
      style={{
        left: point.x,
        top: point.y,
        opacity:
          dimmed ? 0.45 : 1,
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

/* ==================================================================
   STOP LABEL
   ================================================================== */

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
        className="rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] shadow-sm"
        style={{
          color: '#332A1E',
          borderColor:
            'rgba(74,54,33,0.18)',
          background:
            'rgba(246,232,201,0.94)',
        }}
      >
        {entry.year}
      </span>

      <span
        className="mt-1 max-w-[170px] whitespace-nowrap rounded bg-[#F3E5C5]/90 px-2 py-1 text-center text-[10.5px] font-medium leading-tight shadow-sm"
        style={{
          color: '#30291F',
          opacity:
            active ? 1 : 0.88,
        }}
      >
        {entry.short ||
          entry.title}
      </span>

      {entry.id ===
        'aston' && (
        <span
          className="mt-1 rounded-full px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.16em]"
          style={{
            color: '#FFF4E5',
            background:
              '#F4552A',
          }}
        >
          Now
        </span>
      )}
    </span>
  )
}

/* ==================================================================
   STOP MARK
   ================================================================== */

function StopMark({
  entry,
  isActive,
}) {
  const accent =
    routeColor(entry)

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
            : '#F5E8CC',

        border:
          `3px solid ${accent}`,

        color:
          isActive
            ? onFill(accent)
            : accent,

        transform:
          isActive
            ? 'scale(1.10)'
            : 'scale(1)',

        boxShadow:
          isActive
            ? `0 0 0 7px ${accent}35, 0 7px 18px rgba(0,0,0,0.28)`
            : '0 5px 12px rgba(0,0,0,0.20)',

        transition:
          'transform 260ms ease, box-shadow 260ms ease, background 260ms ease',
      }}
    >
      {isCurrent && (
        <span
          className="absolute inset-[-10px] rounded-full border-2"
          style={{
            borderColor:
              `${accent}65`,
            animation:
              'timelinePulse 3s ease-out infinite',
          }}
        />
      )}

      {Mark ? (
        <Mark
          width="27"
          height="27"
        />
      ) : (
        <span
          className="serif text-[16px]"
          style={{
            color:
              isActive
                ? onFill(
                    accent,
                  )
                : accent,
          }}
        >
          {entry.monogram}
        </span>
      )}
    </span>
  )
}

/* ==================================================================
   DETAIL
   ================================================================== */

function Detail({
  entry,
  compact = false,
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <p
          className="mono-label"
          style={{
            color:
              textColor(entry),
          }}
        >
          {entry.year}
        </p>

        {entry.status && (
          <span
            className="rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em]"
            style={{
              color:
                textColor(
                  entry,
                ),
              borderColor:
                `${textColor(entry)}55`,
              background:
                `${textColor(entry)}12`,
            }}
          >
            {entry.status}
          </span>
        )}
      </div>

      <h3
        className={`serif mt-2 leading-tight ${
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
          {linkLabel(
            entry.href,
          )}

          <span
            aria-hidden="true"
          >
            ↗
          </span>
        </a>
      )}
    </>
  )
}

/* ==================================================================
   LINK LABEL
   ================================================================== */

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

/* ==================================================================
   COLOUR HELPERS
   ================================================================== */

function routeColor(
  entry = {},
) {
  if (entry.id === 'aston') {
    return '#F4552A'
  }

  if (
    entry.kind ===
    'education'
  ) {
    return (
      entry.accent ||
      '#F4552A'
    )
  }

  if (
    entry.kind ===
    'project'
  ) {
    return (
      entry.accent ||
      '#4C8FD8'
    )
  }

  if (
    entry.kind ===
    'experience'
  ) {
    return (
      entry.accent ||
      '#35B89A'
    )
  }

  return (
    entry.accent ||
    entry.tint ||
    '#F4552A'
  )
}

const textColor = (
  entry,
) =>
  entry.tint ||
  entry.accent ||
  routeColor(entry)

function onFill(hex) {
  if (
    !hex ||
    hex[0] !== '#'
  ) {
    return '#fff'
  }

  const rgb = [
    1,
    3,
    5,
  ].map(
    (index) => {
      const value =
        parseInt(
          hex.substring(
            index,
            index + 2,
          ),
          16,
        ) / 255

      return value <=
        0.03928
        ? value / 12.92
        : Math.pow(
            (value +
              0.055) /
              1.055,
            2.4,
          )
    },
  )

  const luminance =
    0.2126 * rgb[0] +
    0.7152 * rgb[1] +
    0.0722 * rgb[2]

  return luminance >
    0.187
    ? '#0B0A09'
    : '#fff'
}

/* ==================================================================
   CLAMP
   ================================================================== */

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

/* ==================================================================
   TIMELINE PULSE
   ================================================================== */

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
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  `

  document.head.appendChild(
    style,
  )
}
