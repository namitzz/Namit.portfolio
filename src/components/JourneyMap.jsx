import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MAP_H, MAP_SRC, MAP_W, TRAIL } from '../data/journeyMap'

/**
 * The map itself: Namit's own painted artwork, with the parts that move
 * drawn over it.
 *
 * Everything before this built the world out of tiles. This does not,
 * because it does not have to: the artwork exists, it is his, and no
 * tileset was ever going to reach it. What the code adds is the part a
 * picture cannot do on its own — a light that travels the road, and the
 * milestones answering when you point at them.
 *
 * The image and the animated layer sit in the same transformed box, so
 * panning and zooming move them together and nothing has to be projected
 * twice.
 */

/** How long the light takes to walk the whole road, in milliseconds. */
const LAP = 26000

export default function JourneyMap({ width, height, activeAt }) {
  const ref = useRef(null)
  const activeRef = useRef(activeAt)
  const reduce = useReducedMotion()
  activeRef.current = activeAt

  // The trail is stored as fractions of the image; the canvas works in the
  // pixels the map is currently drawn at.
  const path = useMemo(() => {
    const pts = TRAIL.map(([fx, fy]) => ({ x: fx * width, y: fy * height }))
    return resample(smoothRoute(pts, 10), 3)
  }, [width, height])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !width || !height || path.length < 2) return undefined

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    const ctx = canvas.getContext('2d')

    const draw = (t) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      // The light that walks the road. It is drawn as a short comet
      // rather than a dot, because a single moving point reads as a bug
      // crawling and a tapering tail reads as travel.
      const head = ((t % LAP) / LAP) * (path.length - 1)
      for (let i = 0; i < 26; i++) {
        const at = head - i * 1.6
        if (at < 0) continue
        const p = path[Math.floor(at)]
        if (!p) continue
        const fade = 1 - i / 26
        halo(ctx, p.x, p.y, 3 + fade * 9, `rgba(255,214,150,${0.5 * fade * fade})`)
      }

      // The milestone under the pointer answers with its own light.
      if (activeRef.current) {
        const [fx, fy] = activeRef.current
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.005)
        halo(ctx, fx * width, fy * height, 34 * pulse, 'rgba(255,196,120,0.34)')
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    // Painted once immediately, so the map is right even where animation
    // frames never arrive: a background tab, or reduced motion.
    draw(0)
    if (reduce) return undefined

    let raf = 0
    const started = performance.now()
    const tick = (now) => {
      draw(now - started)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [width, height, path, reduce])

  return (
    <>
      <img
        src={MAP_SRC}
        alt="An illustrated map of the journey from Leicester to Aston, with a lit road connecting eleven milestones."
        width={MAP_W}
        height={MAP_H}
        draggable="false"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        style={{ imageRendering: 'pixelated' }}
      />
      <canvas
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </>
  )
}

/* ------------------------------------------------------------------ */

/** A soft round light. */
function halo(ctx, x, y, r, colour) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, colour)
  g.addColorStop(1, 'rgba(255,180,90,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Points spaced evenly along a path.
 *
 * The traced trail has points wherever the road bends, which means they
 * are close together on the corners and far apart on the straights.
 * Anything that walks such a list at a constant rate speeds up and slows
 * down for no reason; resampling by distance fixes that.
 */
function resample(points, step) {
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
 * A smooth curve through the traced points.
 *
 * The trail was read off the artwork by hand, so it is a short list of
 * corners. A Catmull-Rom spline passes through every one of them and
 * rounds everything between, which is what keeps the travelling light on
 * a road that bends rather than cutting the corners off it.
 */
function smoothRoute(points, per = 14) {
  if (points.length < 3) return points.slice()
  const at = (i) => points[Math.max(0, Math.min(points.length - 1, i))]
  const out = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    for (let k = 0; k < per; k++) {
      const t = k / per
      const t2 = t * t
      const t3 = t2 * t
      out.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      })
    }
  }
  out.push(points[points.length - 1])
  return out
}
