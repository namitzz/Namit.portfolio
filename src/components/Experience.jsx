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
import Building, {
  useBuildings,
  footprintFor,
} from './MapBuildings'
import { SCALE, TILE as ART_TILE } from '../lib/tileset'

// The map is a town, not a band. Tall enough for three streets, with room
// between them for a structure, the label hanging under it, and the
// stagger that stops the streets reading as ruled lines.
const TRACK_H = 980
// Everything on the map is snapped to this, so roads meet buildings
// squarely and corners land on tile boundaries rather than between them.
// One tile of art, at the scale the art is shown.
const TILE = ART_TILE * SCALE
const CARD_W = 340
const CARD_H = 280
const CARD_GAP = 78
// Half the widest structure, the treeline, and the width of the chrome
// pinned down each side, so the outermost stop on each street stands on
// open ground and never behind a caption.
const EDGE = 215

// The three streets, and how far every other stop steps off its street.
//
// Solved rather than guessed, against every box on the map at once:
// eleven structures of eleven different sizes, their labels, and the six
// pieces of chrome pinned to the frame. The combinations that collide
// with none of them at any plate width the page can reach are a narrow
// set. The top row in particular is held down far enough that the
// gatehouse, which is the tallest thing here, clears the title block.
const ROWS = [0.26, 0.55, 0.84]
const STAGGER = 0.05

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
  const sprites = useBuildings()

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

  // Where each structure actually stands, so the map can clear its plot
  // before anything grows on it, and so the card knows what it must not
  // park on. Every structure is a different size, so this is not a
  // constant and nothing downstream may treat it as one.
  const plots = useMemo(
    () =>
      points.map((p, i) => ({
        ...p,
        ...footprintFor(timeline[i] || {}),
      })),
    [points],
  )

  const card = useMemo(() => {
    if (active === null || !plots[active]) {
      return null
    }

    // Placed against the plots, not the points: the card has to know how
    // big each structure is to stay off it.
    return {
      entry: timeline[active],
      ...placeCard(
        plots[active],
        active,
        plots,
        box.w,
        height,
      ),
    }
  }, [
    active,
    plots,
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
              '#0A1119',
            boxShadow:
              '0 40px 100px -55px rgba(0,0,0,0.9)',
          }}
        >
          {/* Tiles, drawn from the route: the dirt road on the map and
              the journey through the timeline are the same line. */}
          <PixelMap
            d={d}
            width={box.w}
            height={height}
            plots={plots}
          />

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

                <filter
                  id="journeyLamps"
                  x="-120%"
                  y="-120%"
                  width="340%"
                  height="340%"
                >
                  <feGaussianBlur stdDeviation="3.4" />
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
                stroke="#FFDCA8"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="2 13"
                opacity="1"
                filter="url(#journeyLamps)"
              />

              {/* The lit trail. Warm, and always on: at night the road is
                  the brightest thing on the map, and the travelled
                  section brightens over it rather than being the only
                  thing that shows. */}
              <path
                d={d}
                fill="none"
                stroke="#FFE6BC"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="2 13"
                opacity="0.96"
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
                stroke="#8A5A2A"
                strokeWidth="1.5"
                strokeDasharray="5 10"
                strokeLinecap="round"
                opacity="0.55"
              />

              {/* A lamp burning at every milestone. */}
              {points.map((pt, i) => (
                <g key={`lamp-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={active === i ? 11 : 8}
                    fill="#FFC873"
                    opacity="0.5"
                    filter="url(#journeyLamps)"
                    style={{
                      transition: reduce ? 'none' : 'r 220ms ease',
                    }}
                  />
                  <circle cx={pt.x} cy={pt.y} r="4.2" fill="#FFE6BC" />
                  <circle cx={pt.x} cy={pt.y} r="2" fill="#FFFDF4" />
                </g>
              ))}

              {/* ---------------------------------------------------
                  TRAVELLER
                 --------------------------------------------------- */}

            </svg>
          )}

          {/* -------------------------------------------------------
              TRAVELLER
             ------------------------------------------------------- */}

          {traveller.visible && (
            <Traveller
              x={traveller.x}
              y={traveller.y}
              rotation={traveller.rotation}
              length={traveller.length}
              reduce={reduce}
            />
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
                  sprites={sprites}
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
              CHROME
             ------------------------------------------------------- */}

          <Chrome />

          <Compass />
        </div>

        {/* The tileset is public domain and asks for nothing. The credit
            is here because taking someone's work without naming them is
            a poor way to use a gift. */}
        <p
          className="mono-label mt-4 hidden text-right md:block"
          style={{ color: 'rgba(244,244,245,0.34)' }}
        >
          Map art:{' '}
          <a
            href="https://opengameart.org/content/zelda-like-tilesets-and-sprites"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted underline-offset-2 transition-colors hover:text-[rgba(244,244,245,0.7)]"
          >
            ArMM1998
          </a>
          , CC0
        </p>

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
                  <MobileMark entry={entry} />
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

/**
 * The person walking the route.
 *
 * A sprite from the tileset's own character sheet rather than a drawn
 * figure: the map is pixel art now, and a smooth vector walker standing
 * on it looked like a cursor rather than like someone on the road.
 *
 * The walk cycle is driven by distance covered, not by a clock. Stepping
 * every fourteen pixels means the legs move in time with the ground, so
 * the character never moonwalks through a fast stretch or marches on the
 * spot through a slow one.
 */

/** One frame of the sheet, in its own pixels. */
const WALK_W = 16
const WALK_H = 32

/** Sheet rows, in the order the sheet stores them. */
const FACING = { down: 0, right: 1, up: 2, left: 3 }

function Traveller({ x, y, rotation = 0, length = 0, reduce }) {
  // Rotation is measured off the +x axis, which is how the route reports
  // its own heading, so the quadrants fall out of it directly.
  const a = ((rotation % 360) + 360) % 360
  const row =
    a < 45 || a >= 315
      ? FACING.right
      : a < 135
        ? FACING.down
        : a < 225
          ? FACING.left
          : FACING.up

  // Standing still shows the passing pose rather than a mid-stride one.
  const frame = reduce ? 0 : Math.floor(length / 14) % 4

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[6]"
      style={{
        left: x,
        top: y,
        width: WALK_W * SCALE,
        height: WALK_H * SCALE,
        // The feet land on the point, not the middle of the sprite, so
        // the character stands on the road rather than hovering over it.
        transform: `translate(-50%, -${WALK_H * SCALE - 8}px)`,
        backgroundImage: 'url(/tiles/character.png)',
        backgroundPosition: `-${frame * WALK_W * SCALE}px -${row * WALK_H * SCALE}px`,
        backgroundSize: `${272 * SCALE}px ${256 * SCALE}px`,
        imageRendering: 'pixelated',
        transition: reduce ? 'none' : 'left 45ms linear, top 45ms linear',
        filter: 'drop-shadow(0 2px 2px rgba(12,26,12,0.5))',
      }}
    />
  )
}

/* ==================================================================
   COMPASS
   ================================================================== */

/**
 * The map's furniture: the title it is filed under, how to use it, and
 * the words down the sides.
 *
 * All of it is `pointer-events-none` and pinned to the frame, because
 * none of it is a control and none of it may take a click meant for a
 * building. The side columns sit inside the 190px margin the outermost
 * stop is held back from, so they never land on a roof.
 */
function Chrome() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[7] select-none"
      style={{ color: 'rgba(226,236,246,0.62)' }}
    >
      {/* Filed under */}
      <div className="absolute left-7 top-6">
        <p
          className="font-mono text-[12px] tracking-[0.02em]"
          style={{ color: 'rgba(245,248,252,0.94)' }}
        >
          Namit Singh Sarna
        </p>
        <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.22em]">
          Journey map · 2023 – present
        </p>
        <p
          className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.22em]"
          style={{ color: 'rgba(226,236,246,0.4)' }}
        >
          AI · Software · Impact
        </p>
      </div>

      {/* How to use it */}
      <div
        className="absolute right-7 top-6 rounded-[4px] border px-3 py-2 text-right"
        style={{
          borderColor: 'rgba(180,200,220,0.16)',
          background: 'rgba(10,15,22,0.7)',
        }}
      >
        <p className="font-mono text-[8.5px] uppercase tracking-[0.2em]">
          Explore ›
        </p>
        <p
          className="font-mono text-[8.5px] uppercase tracking-[0.2em]"
          style={{ color: 'rgba(245,248,252,0.86)' }}
        >
          My journey
        </p>
        <p
          className="font-mono text-[8.5px] uppercase tracking-[0.2em]"
          style={{ color: '#D79A4E' }}
        >
          Click a milestone
        </p>
      </div>

      {/* What the road is for, down one side */}
      <Column
        className="left-7 top-1/2 -translate-y-1/2 text-left"
        items={['Learn', 'Build', 'Compete', 'Contribute', 'Graduate', 'Go further']}
      />
      <Column
        className="right-7 top-[28%] text-right"
        items={['Ideas', 'Skills', 'Experience', 'Impact']}
      />

      {/* Beside the compass, not in the far corner: the last stop on the
          road is bottom right, and its label was already standing there. */}
      <div className="absolute bottom-6 left-[108px]">
        <p
          className="font-mono text-[8.5px] uppercase tracking-[0.2em]"
          style={{ color: 'rgba(226,236,246,0.4)' }}
        >
          Same person
        </p>
        <p className="font-mono text-[8.5px] uppercase tracking-[0.2em]">
          More to explore ›
        </p>
      </div>
    </div>
  )
}

function Column({ className, items }) {
  return (
    <div className={`absolute ${className}`}>
      <p className="font-mono text-[9px]" style={{ color: 'rgba(226,236,246,0.3)' }}>
        ›
      </p>
      {items.map((item) => (
        <p
          key={item}
          className="font-mono text-[8.5px] uppercase leading-[1.9] tracking-[0.2em]"
        >
          {item}
        </p>
      ))}
      <p className="font-mono text-[9px]" style={{ color: 'rgba(226,236,246,0.3)' }}>
        ›
      </p>
    </div>
  )
}

function Compass() {
  return (
    <div
      className="pointer-events-none absolute bottom-6 left-7 z-[6] flex h-16 w-16 items-center justify-center rounded-full border"
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

/**
 * Three streets, walked as a serpentine: left to right, down, right to
 * left, down, left to right again, with every other stop stepped off its
 * street so the road has to climb and fall between neighbours.
 *
 * The stagger is the difference between a plan and a place. Without it
 * the three rows are ruled lines and the road is three straight bars.
 * With it the road meanders, and it still reads in order, because the
 * rows underneath it are still rows.
 *
 * Because each row hands off at the x it ended on, the turn between rows
 * is a single drop. No dog-legs, and nothing doubles back.
 */
function buildStops(count, width, height) {
  const snap = (v) => Math.round(v / TILE) * TILE + TILE / 2
  const left = EDGE
  const right = width - EDGE
  const out = []
  const perRow = spread(count, ROWS.length)

  for (let r = 0; r < ROWS.length; r++) {
    const n = perRow[r]
    const xs = []
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0.5
      xs.push(snap(left + (right - left) * t))
    }
    // Odd rows run the other way, which is what makes it a serpentine
    // and what lets the drop between rows be vertical.
    if (r % 2) xs.reverse()
    xs.forEach((x, i) => {
      out.push({ x, y: snap(height * (ROWS[r] + (i % 2 ? STAGGER : 0))) })
    })
  }

  return out.slice(0, count)
}

/** Stops per row, front-loaded, so the last street is never the crowded one. */
function spread(count, rows) {
  const base = Math.ceil(count / rows)
  const out = []
  let left = count
  for (let r = 0; r < rows; r++) {
    const take = Math.min(base, left - (rows - r - 1))
    out.push(Math.max(1, take))
    left -= out[r]
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

/**
 * What a stop takes up on the map: its structure, which stands from the
 * road up, plus room for the label that hangs under it.
 *
 * Measured from the structure rather than assumed. These numbers once
 * described a 96px SVG marker and were left behind when the marker
 * became a sprite, so the card thought every building was a third of its
 * real height and parked happily on the roofs.
 */
function occupies(p) {
  return {
    x0: p.x - (p.w || 0) / 2 - 8,
    x1: p.x + (p.w || 0) / 2 + 8,
    y0: p.y - (p.h || 0) - 10,
    y1: p.y + 70,
  }
}

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
      .map(occupies)

  const own = occupies(point)

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
  sprites,
  onEnter,
  onClick,
}) {
  const { w, h } = footprintFor(entry)

  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onClick}
      aria-describedby={active ? 'route-card' : undefined}
      aria-label={`${entry.year} ${entry.short || entry.title}`}
      className="absolute z-10 -translate-x-1/2 transition-opacity duration-300"
      style={{
        left: point.x,
        // The button box IS the structure, with its base on the road, so
        // the footprint lands on the tile the route passes through. The
        // label is floated off that box rather than stacked with it: in
        // a flex column a label above the building pushed the building
        // down off its own plot.
        top: point.y - h,
        width: w,
        height: h,
        opacity: dimmed ? 0.55 : 1,
      }}
    >
      <StopMark
        entry={entry}
        isActive={active}
        sprites={sprites}
      />

      {/* Every label hangs under its own structure. Alternating the
          side by row put one street's labels directly on top of the next
          street's, because a label above a building and a label below
          the one behind it land in the same band of the map.

          It sits inside the button, so it is part of the target. Without
          that the shrine would be a 52px thing to hit. */}
      <span className="absolute left-1/2 top-full -translate-x-1/2">
        <StopLabel entry={entry} active={active} />
      </span>
    </button>
  )
}

/* ==================================================================
   STOP LABEL
   ================================================================== */

/**
 * The mobile stand-in for a building.
 *
 * The map is a desktop thing: a town seen from above needs room, and a
 * phone has none. The list gets the institution's own outline mark
 * instead, at the size the rest of the list is set in.
 */
function MobileMark({ entry }) {
  const Mark = markFor(entry)
  const accent = entry.accent || 'var(--accent)'
  return (
    <span
      className="flex h-11 w-11 items-center justify-center rounded-full border"
      style={{
        color: accent,
        borderColor: `${accent}55`,
        background: 'rgba(244,244,245,0.04)',
      }}
    >
      {Mark ? (
        <Mark width="22" height="22" />
      ) : (
        <span className="font-mono text-[11px] tracking-[0.08em]">
          {entry.monogram || entry.year}
        </span>
      )}
    </span>
  )
}

function StopLabel({ entry, active }) {
  return (
    <span
      className="mt-3 block whitespace-nowrap rounded-[5px] border px-2.5 py-1.5 text-left backdrop-blur-[2px]"
      style={{
        borderColor: active
          ? 'rgba(255,200,120,0.42)'
          : 'rgba(180,200,220,0.16)',
        background: active
          ? 'rgba(14,20,28,0.92)'
          : 'rgba(10,15,22,0.84)',
        boxShadow: active
          ? '0 0 20px rgba(255,180,90,0.28), 0 6px 16px rgba(0,0,0,0.6)'
          : '0 6px 16px rgba(0,0,0,0.55)',
      }}
    >
      <span className="flex items-center gap-1.5">
        {/* The diamond is the map's own bullet: it marks a place rather
            than starting a list. */}
        <span
          aria-hidden="true"
          className="text-[7px] leading-none"
          style={{ color: active ? '#FFC873' : '#D79A4E' }}
        >
          ◆
        </span>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{ color: active ? '#FFD79A' : '#C79A62' }}
        >
          {entry.year}
        </span>
      </span>

      <span
        className="mt-0.5 block text-[11px] font-medium leading-tight"
        style={{ color: active ? '#FFFFFF' : 'rgba(238,242,247,0.9)' }}
      >
        {entry.short || entry.title}
      </span>

      {entry.id === 'aston' && (
        <span
          className="mt-1 inline-block rounded-full px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.16em]"
          style={{ color: '#0A1119', background: '#FFC873' }}
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
function StopMark({ entry, isActive, sprites }) {
  return (
    <Building
      entry={entry}
      sprites={sprites}
      active={isActive}
    />
  )
}

/* ==================================================================
   LINK LABEL
   ================================================================== */

/**
 * What the button on a card should say. An entry can override it with
 * `linkText` where the generic answer would be wrong: the modelling
 * award was announced by a teammate, so "the post" would claim I wrote
 * something I did not.
 */
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
          {entry.linkText ||
            linkLabel(entry.href)}

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
