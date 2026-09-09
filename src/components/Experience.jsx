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
import PixelMap from './PixelMap'
import Building, { buildingFor, BUILDING_H } from './MapBuildings'

// The map is a town now, not a band. Taller gives the buildings somewhere
// to stand and the roads somewhere to turn.
const TRACK_H = 820
// Everything on the map is snapped to this, so roads meet buildings
// squarely and corners land on tile boundaries rather than between them.
const TILE = 16
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
              '#4E7B45',
            boxShadow:
              '0 40px 100px -55px rgba(0,0,0,0.9)',
          }}
        >
          {/* Tiles, drawn from the route: the dirt road on the map and
              the journey through the timeline are the same line. */}
          <PixelMap d={d} width={box.w} height={height} />

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

/** Deterministic noise, so the town is the same town on every load. */
function seededRandom(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function buildStops(count, width, height) {
  const snap = (v) => Math.round(v / TILE) * TILE + TILE / 2
  const left = EDGE
  const right = width - EDGE
  const rand = seededRandom(0x7f4a7c15)
  const out = []

  // Stops walk left to right so the timeline still reads in order, but
  // each one steps to a different band so the roads between them have to
  // turn. A town where every building sits on one line is a street.
  const bands = [0.2, 0.44, 0.68, 0.34, 0.58, 0.24, 0.5, 0.74, 0.3, 0.62, 0.42]

  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0
    const band = bands[i % bands.length]
    out.push({
      x: snap(left + (right - left) * t),
      y: snap(height * band + (rand() - 0.5) * 26),
    })
  }
  return out
}

/* ==================================================================
   WAYPOINTS
   ================================================================== */

/**
 * The road between two stops, as tiles rather than as a curve: out along
 * one axis, a square corner, then in along the other. Alternating which
 * axis leads stops every junction looking the same.
 */
function buildWaypoints(stops) {
  if (!stops.length) return []
  const pts = [stops[0]]
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]
    // Always out along x, then in along y. Alternating which axis led
    // looked more varied but made the road retrace itself: a segment that
    // arrived vertically and then left vertically ran back down the line
    // it had just come up, so the traveller walked the same stretch twice
    // and the glow doubled back over it.
    pts.push({ x: b.x, y: a.y }, { x: b.x, y: b.y })
  }
  return pts
}

/* ==================================================================
   ROUTE PATH
   ================================================================== */

/**
 * Straight segments and square corners. The spline is gone: it fought the
 * tile grid, and a road that meets a building at an angle never looks
 * like it was built there.
 */
function routePath(stops) {
  const p = buildWaypoints(stops)
  if (p.length < 2) return ''
  return (
    `M ${p[0].x} ${p[0].y} ` +
    p.slice(1).map((q) => `L ${q.x} ${q.y}`).join(' ')
  )
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
      className="absolute z-10 flex -translate-x-1/2 flex-col items-center transition-all duration-300"
      style={{
        left: point.x,
        // The building's base sits on the road, so the whole sprite is
        // lifted by its own height rather than centred on the point.
        top: point.y - BUILDING_H + 10,
        opacity: dimmed ? 0.55 : 1,
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

/**
 * The building that stands at a stop.
 *
 * It sits on the road rather than over it: the anchor is the base of the
 * building, not its middle, so the footprint lands on the tile the route
 * actually passes through and the roof rises away from it.
 *
 * Hovering lifts it. Scale alone reads as a zoom; lifting and growing the
 * shadow together reads as picking something up off the ground, which is
 * what "pops" has to mean on a map seen from above.
 */
function StopMark({ entry, isActive }) {
  const accent = entry.accent || 'var(--accent)'
  return (
    <span
      className="block"
      style={{
        // Anchored at the base, so the building stands on its plot.
        transformOrigin: '50% 100%',
        transform: isActive
          ? 'translateY(-7px) scale(1.14)'
          : 'translateY(0) scale(1)',
        transition: 'transform 260ms cubic-bezier(0.22,1,0.36,1)',
        filter: isActive
          ? `drop-shadow(0 10px 14px rgba(0,0,0,0.45)) drop-shadow(0 0 10px ${accent}66)`
          : 'drop-shadow(0 6px 8px rgba(0,0,0,0.35))',
      }}
    >
      <Building
        type={buildingFor(entry)}
        accent={accent}
        active={isActive}
      />
    </span>
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
