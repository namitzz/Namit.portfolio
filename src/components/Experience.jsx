import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { timeline } from '../data/content'
import { markFor } from './TimelineMarks'
import Reveal from './Reveal'
import JourneyMap from './JourneyMap'
import { MAP_H, MAP_W, PLACES, TRAIL } from '../data/journeyMap'
import { useMapView } from './useMapView'

/**
 * The journey, as a map.
 *
 * Every earlier version of this built the world out of tiles - a village,
 * then a country - and each one was a closer approximation of a picture
 * that already existed. This one stops approximating. The map is Namit's
 * own artwork, and the code does the part a painting cannot: it lights
 * the road, answers when you point at a milestone, lets you go in for a
 * closer look, and walks the figure along the way you came.
 *
 * Nothing here draws terrain. Everything here is about registration -
 * keeping the interactive layer exactly on top of the painted one at any
 * size - which is why every position is a fraction of the image.
 */

const CARD_W = 330
const CARD_GAP = 22

export default function Experience() {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const animationRef = useRef(null)

  const [box, setBox] = useState({ w: 0, h: 0 })
  const [active, setActive] = useState(null)
  const [walker, setWalker] = useState({ at: 0, facing: 0, visible: false })

  // The plate keeps the artwork's proportions, so the map is never
  // stretched and the hotspots never drift off what they cover.
  const height = box.w ? Math.round((box.w * MAP_H) / MAP_W) : 0
  const map = useMapView(box.w, height)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const entries = useMemo(
    () => timeline.filter((entry) => PLACES[entry.id]),
    [],
  )

  /** The trail in map pixels, evenly spaced, for the figure to walk. */
  const path = useMemo(() => {
    if (!box.w || !height) return []
    return walkPath(TRAIL.map(([fx, fy]) => ({ x: fx * box.w, y: fy * height })))
  }, [box.w, height])

  /** Where along that path each milestone sits. */
  const stations = useMemo(() => {
    if (!path.length) return []
    return entries.map((entry) => {
      const [fx, fy] = PLACES[entry.id].at
      const x = fx * box.w
      const y = fy * height
      let best = 0
      let bestD = Infinity
      for (let i = 0; i < path.length; i++) {
        const dd = (path[i].x - x) ** 2 + (path[i].y - y) ** 2
        if (dd < bestD) {
          bestD = dd
          best = i
        }
      }
      return best
    })
  }, [entries, path, box.w, height])

  const card = useMemo(() => {
    if (active === null || !entries[active] || !box.w) return null
    const entry = entries[active]
    const [hx, hy, hw, hh] = PLACES[entry.id].hit
    return {
      entry,
      ...placeCard(
        { x: hx * box.w, y: hy * height, w: hw * box.w, h: hh * height },
        box.w,
        height,
      ),
    }
  }, [active, entries, box.w, height])

  /* --- the figure walks --- */

  const stopWalking = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    animationRef.current = null
  }

  const walkTo = (index) => {
    setActive(index)
    const target = stations[index]
    if (target === undefined || !path.length) return
    stopWalking()

    const from = walker.visible ? walker.at : stations[0] || 0
    const distance = Math.abs(target - from)
    // Longer journeys take longer, but not proportionally: crossing the
    // whole map should feel like a walk, not like waiting.
    const duration = reduce ? 0 : Math.min(2600, Math.max(700, distance * 7))
    const started = performance.now()

    const tick = (now) => {
      const raw = duration === 0 ? 1 : Math.min(1, (now - started) / duration)
      const eased = 1 - (1 - raw) ** 3
      const at = from + (target - from) * eased
      const here = path[Math.round(at)]
      const ahead = path[Math.round(at) + (target >= from ? 2 : -2)] || here
      if (here) {
        setWalker({
          at,
          facing: Math.atan2(ahead.y - here.y, ahead.x - here.x) * (180 / Math.PI),
          visible: true,
        })
      }
      if (raw < 1) animationRef.current = requestAnimationFrame(tick)
      else animationRef.current = null
    }
    tick(performance.now())
  }

  const walkerAt = path[Math.round(walker.at)] || path[0]

  return (
    <section
      id="experience"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{ background: 'linear-gradient(180deg, rgba(10,15,22,0) 0%, rgba(10,15,22,0.5) 100%)' }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <Reveal>
          <div
            className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b pb-6 md:mb-14"
            style={{ borderColor: 'var(--hairline)' }}
          >
            <div>
              <p className="eyebrow">Experience &amp; education</p>
              <h2
                className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
                style={{ color: 'var(--ink)' }}
              >
                The route so far
                <span style={{ color: 'var(--accent)' }}>.</span>
              </h2>
              <p className="mt-3 text-[14px]" style={{ color: 'var(--muted)' }}>
                Point at a milestone to read it. Click one and I will walk there.
              </p>
            </div>
            <p className="mono-label" style={{ color: 'var(--muted)' }}>
              {String(entries.length).padStart(2, '0')} stops · 2023 – present
            </p>
          </div>
        </Reveal>

        {/* =========================================================
            THE MAP
           ========================================================= */}

        <div
          ref={wrapRef}
          {...map.handlers}
          className="relative hidden touch-none select-none overflow-hidden rounded-[1.5rem] border lg:block"
          style={{
            aspectRatio: `${MAP_W} / ${MAP_H}`,
            cursor: map.dragging ? 'grab' : 'default',
            borderColor: 'rgba(244,244,245,0.10)',
            background: '#0A1119',
            boxShadow: '0 40px 100px -55px rgba(0,0,0,0.9)',
          }}
        >
          {/* The artwork and everything pinned to it share one transform,
              so panning and zooming move them together and no position
              has to be projected twice. */}
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${map.view.zoom}) translate(${-map.view.x}px, ${-map.view.y}px)`,
              transformOrigin: '0 0',
            }}
          >
            {box.w > 0 && (
              <JourneyMap
                width={box.w}
                height={height}
                activeAt={active !== null && entries[active] ? PLACES[entries[active].id].at : null}
              />
            )}

            {box.w > 0 &&
              entries.map((entry, index) => (
                <Hotspot
                  key={entry.id}
                  entry={entry}
                  hit={PLACES[entry.id].hit}
                  width={box.w}
                  height={height}
                  active={active === index}
                  onEnter={() => setActive(index)}
                  onClick={() => walkTo(index)}
                />
              ))}

            {walker.visible && walkerAt && (
              <Traveller
                x={walkerAt.x}
                y={walkerAt.y}
                rotation={walker.facing}
                length={walker.at * 3}
                reduce={reduce}
                width={box.w}
              />
            )}
          </div>

          {/* The card sits outside the transform: it is text, and text
              should not be magnified by a map zoom. */}
          {card && (
            <div
              id="route-card"
              className="pointer-events-none absolute z-30 overflow-hidden rounded-xl border p-4"
              style={{
                left: map.project(card.left, card.top).x,
                top: map.project(card.left, card.top).y,
                width: CARD_W,
                maxHeight: height - map.project(card.left, card.top).y - 12,
                borderColor: textColor(card.entry),
                background: 'rgba(10,15,22,0.95)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 30px 80px -40px rgba(0,0,0,0.95)',
              }}
            >
              <Detail entry={card.entry} compact />
            </div>
          )}

          <ZoomControls map={map} />
        </div>

        <p
          className="mono-label mt-4 hidden text-right lg:block"
          style={{ color: 'rgba(244,244,245,0.34)' }}
        >
          Map illustration by Namit Singh Sarna
        </p>

        {/* =========================================================
            MOBILE
           ========================================================= */}

        <ol className="lg:hidden">
          {timeline.map((entry, index) => (
            <li key={entry.id} className="relative grid grid-cols-[3.5rem_1fr] gap-4">
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
              <div className="pt-1">
                <MobileMark entry={entry} />
              </div>
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

/* ==================================================================
   HOTSPOT
   ================================================================== */

/**
 * The clickable area over a painted milestone.
 *
 * It covers the icon and its caption together, because the caption is
 * painted into the map and the caption is what a reader aims at. There is
 * nothing inside it: the label already exists in the artwork, so drawing
 * a second one would be drawing over Namit's.
 *
 * Its accessible name carries the text the artwork shows, so the map is
 * navigable without seeing it.
 */
function Hotspot({ entry, hit, width, height, active, onEnter, onClick }) {
  const [fx, fy, fw, fh] = hit
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onClick}
      aria-describedby={active ? 'route-card' : undefined}
      aria-label={`${entry.year} — ${entry.short || entry.title}`}
      className="absolute rounded-lg border transition-all duration-200"
      style={{
        left: fx * width,
        top: fy * height,
        width: fw * width,
        height: fh * height,
        borderColor: active ? 'rgba(255,206,140,0.75)' : 'transparent',
        background: active ? 'rgba(255,196,120,0.10)' : 'transparent',
        boxShadow: active ? '0 0 26px rgba(255,180,90,0.30)' : 'none',
      }}
    />
  )
}

/* ==================================================================
   CARD PLACEMENT
   ================================================================== */

/**
 * Where the detail card goes: beside the milestone, on whichever side has
 * room, and always inside the map.
 *
 * Placed against the milestone's whole painted box rather than against
 * the lit node on the road. Measuring from the node put the card on top
 * of the caption the reader had just pointed at, because the caption is
 * up to a hundred and eighty pixels wide and the node is one point in it.
 */
function placeCard(hit, width, height) {
  const estimate = 260
  const right = hit.x + hit.w + CARD_GAP
  const left = hit.x - CARD_GAP - CARD_W
  // Prefer the right, take the left when the right would run off the map,
  // and fall back to whichever has more room when neither fits cleanly.
  const fitsRight = right + CARD_W <= width - 14
  const fitsLeft = left >= 14
  const useLeft = !fitsRight && fitsLeft
  return {
    left: clamp(useLeft ? left : right, 14, Math.max(14, width - CARD_W - 14)),
    top: clamp(
      hit.y + hit.h / 2 - estimate / 2,
      14,
      Math.max(14, height - estimate - 14),
    ),
  }
}

/**
 * Points spaced evenly along the trail, so the figure walks at a steady
 * pace instead of hurrying through the corners where the traced points
 * bunch up.
 */
function walkPath(points, step = 3) {
  if (points.length < 2) return points
  const out = [points[0]]
  let carry = 0
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    let at = carry
    while (at < len) {
      const t = at / len
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
      at += step
    }
    carry = at - len
  }
  out.push(points[points.length - 1])
  return out
}

/**
 * The figure that walks the road.
 *
 * It is Namit's own character, lifted out of his artwork rather than
 * borrowed from a tileset, so the person on the map and the person in the
 * map are the same person. Keyed out by flooding in from the edges of a
 * crop until the fill met his outline, which works because the artwork
 * outlines him in near-black and outlines nothing else nearby.
 *
 * One frame, so there is no walk cycle to run. What sells the walking is
 * the bob: a small vertical rise and fall while he is moving, which is
 * what a walk looks like from this far up. He turns to face the way he is
 * going by flipping, because a single frame has only two directions.
 */

/** The figure's size on the artwork, as a fraction of the map's width. */
const WALKER_W = 48 / 1536
const WALKER_H = 59 / 1536

function Traveller({ x, y, rotation = 0, length = 0, reduce, width }) {
  const w = WALKER_W * width
  const h = WALKER_H * width
  // Facing right covers everything from due north through to due south.
  const facingLeft = Math.abs(rotation) > 90
  // The bob is driven by distance covered rather than by a clock, so he
  // is still when he is still and steps in time with the ground when he
  // is not.
  const bob = reduce ? 0 : Math.abs(Math.sin(length * 0.11)) * (h * 0.06)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[6]"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        // Anchored at the feet, so he stands on the road rather than
        // hovering over it.
        transform: `translate(-50%, calc(-100% + ${h * 0.12 - bob}px)) scaleX(${facingLeft ? -1 : 1})`,
        // No CSS transition on the position. The walk already sets `left`
        // and `top` on every frame, and a transition on top of that is a
        // second animation chasing the first: it lags the figure behind
        // where the code says it is, and stalls outright anywhere frames
        // are scarce.
        filter: 'drop-shadow(0 3px 4px rgba(4,10,18,0.7)) drop-shadow(0 0 12px rgba(255,190,110,0.55))',
      }}
    >
      <img
        src="/traveller.png"
        alt=""
        draggable="false"
        className="h-full w-full select-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}

/**
 * Zoom, on buttons rather than on the wheel.
 *
 * Catching the wheel over a section of a page steals the reader's
 * scroll, and a map that traps you on the way past is worse than a map
 * you cannot zoom. These are real buttons, so they are reachable by
 * keyboard and say what they do.
 */
function ZoomControls({ map }) {
  const btn =
    'flex h-8 w-8 items-center justify-center rounded-[6px] border font-mono text-[13px] leading-none transition-colors disabled:opacity-30'
  const style = {
    borderColor: 'rgba(190,208,226,0.24)',
    background: 'rgba(12,18,26,0.82)',
    color: '#E6EDF6',
  }
  return (
    <div className="absolute right-7 z-[8] flex flex-col gap-1.5" style={{ bottom: 26 }}>
      <button
        type="button"
        className={btn}
        style={style}
        onClick={map.zoomIn}
        disabled={!map.canZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        type="button"
        className={btn}
        style={style}
        onClick={map.zoomOut}
        disabled={!map.canZoomOut}
        aria-label="Zoom out"
      >
        −
      </button>
      {map.canZoomOut && (
        <button
          type="button"
          className={`${btn} text-[8px] tracking-[0.1em]`}
          style={style}
          onClick={map.reset}
          aria-label="Show the whole map"
        >
          ALL
        </button>
      )}
    </div>
  )
}

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
