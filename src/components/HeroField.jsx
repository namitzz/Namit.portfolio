import { useEffect, useRef } from 'react'

/**
 * The hero's background field.
 *
 * A lattice of nodes joined by hairlines, weighted to the right where the
 * composition is emptiest, drifting slowly enough that you notice it only
 * after looking for a few seconds. A handful of nodes are live and carry
 * the accent plus a coordinate readout. The pointer lifts and pulls the
 * nodes near it, like pressing on a taut material.
 *
 * Deliberately not random per load: the layout is generated from a fixed
 * seed so the field is the same architecture every time, and only the
 * movement varies. Randomising it each visit reads as decoration; a fixed
 * structure reads as a system.
 *
 * Canvas rather than DOM or WebGL: a few dozen nodes and their links are
 * far cheaper to draw in 2D than to lay out as elements, and this does not
 * warrant a 3D library.
 *
 * The first frame is painted synchronously on mount, so the field is fully
 * composed even if the animation loop never runs (throttled tab, reduced
 * motion, low-power). Movement is an enhancement, never the thing that
 * makes it visible.
 */
export default function HeroField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    let width = 0
    let height = 0
    let nodes = []
    let links = []
    let guards = []
    let frame = 0
    let running = true

    // Where the pointer is, and where the field currently believes it is.
    // The gap between the two is what makes it feel like material rather
    // than a cursor follower.
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, strength: 0 }

    const accent =
      getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#F4552A'
    const accentRGB = hexToRgb(accent) || { r: 244, g: 85, b: 42 }

    const LINK_DIST = 138
    // How far the field keeps off the type, in px.
    const FEATHER = 52
    const POINTER_DIST = 230

    function layout() {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      guards = collectGuards(canvas)
      nodes = buildNodes(width, height)
        .map((n) => ({ ...n, vis: visibility(n.x, n.y, guards, FEATHER) }))
        .filter((n) => n.vis > 0.02)

      // Links are fixed to the lattice, not recomputed per frame: the
      // structure should hold still while the nodes breathe inside it.
      //
      // A link also carries its own visibility, sampled along its length
      // rather than taken from its endpoints. Two nodes can both sit clear
      // of the type with the segment between them running straight across
      // it, which is how faint lines were still crossing the caption.
      links = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d >= LINK_DIST) continue

          let vis = Math.min(a.vis, b.vis)
          for (let k = 1; k < 4 && vis > 0; k++) {
            const t = k / 4
            vis = Math.min(
              vis,
              visibility(
                a.x + (b.x - a.x) * t,
                a.y + (b.y - a.y) * t,
                guards,
                FEATHER,
              ),
            )
          }
          if (vis <= 0) continue

          links.push([i, j, 1 - d / LINK_DIST, vis])
        }
      }
    }

    function render(time) {
      const t = time / 1000

      ctx.clearRect(0, 0, width, height)

      // Ease the field's idea of the pointer towards the real one.
      pointer.x += (pointer.tx - pointer.x) * 0.055
      pointer.y += (pointer.ty - pointer.y) * 0.055

      for (const n of nodes) {
        // Visibility is sampled at a node's resting position, so a node
        // sitting just clear of the type could drift into it. Scaling the
        // amplitude by visibility holds the field taut where it meets the
        // type and lets it move freely further out.
        const drift = reduced ? 0 : n.vis
        n.px = n.x + Math.sin(t * n.speed + n.phase) * n.amp * drift
        n.py = n.y + Math.cos(t * n.speed * 0.82 + n.phase) * n.amp * 0.72 * drift
        n.lift = 0

        if (pointer.strength > 0.001) {
          const dx = pointer.x - n.px
          const dy = pointer.y - n.py
          const d = Math.hypot(dx, dy)
          if (d < POINTER_DIST) {
            const f = (1 - d / POINTER_DIST) ** 2 * pointer.strength
            n.lift = f
            // Drawn towards the pointer, but only just.
            n.px += dx * f * 0.11
            n.py += dy * f * 0.11
          }
        }
      }

      // Hairlines first, so nodes sit on top of their own structure.
      for (const [i, j, closeness, vis] of links) {
        const a = nodes[i]
        const b = nodes[j]
        const lift = Math.max(a.lift, b.lift)
        // Closeness gives a link its weight, but as a bare multiplier it
        // crushed the field: most pairs sit near the distance limit, so
        // closeness runs 0.1-0.3 and every line came out under 3% opacity
        // no matter how far the coefficient was raised. It varies the line
        // around a floor now instead of scaling it from zero.
        const alpha = ((0.5 + closeness * 0.5) * 0.15 + lift * 0.3) * vis
        if (alpha < 0.0025) continue
        ctx.strokeStyle = `rgba(244,244,245,${alpha.toFixed(4)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(a.px, a.py)
        ctx.lineTo(b.px, b.py)
        ctx.stroke()
      }

      for (const n of nodes) {
        if (n.live) {
          // Live nodes breathe on their own slow cycle.
          const beat = reduced
            ? 0.6
            : 0.42 + (Math.sin(t * 0.5 + n.phase) * 0.5 + 0.5) * 0.5
          const a = ((0.5 + n.lift * 0.45) * beat + 0.2) * n.vis
          ctx.fillStyle = `rgba(${accentRGB.r},${accentRGB.g},${accentRGB.b},${a.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(n.px, n.py, 2.2 + n.lift * 1.2, 0, Math.PI * 2)
          ctx.fill()

          // Faint coordinate readout, the only text in the field. Drawn
          // only well inside the safe area: near an edge it collided with
          // the hamburger and the scroll cue.
          if (n.vis > 0.62 && n.px + 78 < width) {
            ctx.font = '9px "JetBrains Mono", ui-monospace, monospace'
            ctx.fillStyle = `rgba(${accentRGB.r},${accentRGB.g},${
              accentRGB.b
            },${((0.19 + n.lift * 0.24) * n.vis).toFixed(3)})`
            ctx.fillText(
              `${Math.round(n.px).toString().padStart(4, '0')}.${Math.round(
                n.py,
              )
                .toString()
                .padStart(4, '0')}`,
              n.px + 9,
              n.py + 3.5,
            )
          }
        } else {
          const a = (0.3 + n.lift * 0.5) * n.vis
          ctx.fillStyle = `rgba(244,244,245,${a.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(n.px, n.py, 1.5 + n.lift * 0.9, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    function loop(time) {
      if (!running) return
      render(time)
      frame = requestAnimationFrame(loop)
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect()
      pointer.tx = e.clientX - rect.left
      pointer.ty = e.clientY - rect.top
      if (pointer.x < -1000) {
        pointer.x = pointer.tx
        pointer.y = pointer.ty
      }
      pointer.strength = 1
    }

    function onPointerLeave() {
      pointer.strength = 0
    }

    layout()
    // Paint immediately, so a stalled loop still leaves a composed field.
    render(0)

    const ro = new ResizeObserver(() => {
      layout()
      render(performance.now())
    })
    ro.observe(canvas)

    // The headline's ink box is only final once Instrument Serif has
    // loaded; measured against the fallback the guard sits wrong.
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (cancelled || !running) return
      layout()
      render(performance.now())
    })

    if (!reduced) frame = requestAnimationFrame(loop)

    // No pointer wiring on touch, and none under reduced motion either:
    // with no loop running there is nothing to redraw, so the listeners
    // would only cost battery.
    if (fine && !reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerleave', onPointerLeave)
    }

    return () => {
      running = false
      cancelled = true
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}

/**
 * Where the type actually is, in canvas coordinates.
 *
 * Every element carrying `data-field-guard` is measured and kept clear.
 * Text is measured by its ink (the union of its line boxes) rather than
 * its element box, so a full-width `h1` guards only the letters, not the
 * empty half of the line it sits on.
 *
 * This replaced a mask written as fractions of the hero, which was tuned
 * at desktop and so ran straight through the caption on mobile, where the
 * bottom band is three rows taller. Reading the real layout costs one
 * measurement per resize and cannot drift out of step with it.
 */
function collectGuards(canvas) {
  const base = canvas.getBoundingClientRect()
  return [...document.querySelectorAll('[data-field-guard]')].map((el) =>
    inkRect(el, base),
  )
}

function inkRect(el, base) {
  const range = document.createRange()
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  let found = false

  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.textContent.trim()) continue
    range.selectNodeContents(node)
    for (const r of range.getClientRects()) {
      if (!r.width || !r.height) continue
      found = true
      x0 = Math.min(x0, r.left)
      y0 = Math.min(y0, r.top)
      x1 = Math.max(x1, r.right)
      y1 = Math.max(y1, r.bottom)
    }
  }

  if (!found) {
    // No text: an icon or a rule. Its own box is the right guard.
    const r = el.getBoundingClientRect()
    x0 = r.left
    y0 = r.top
    x1 = r.right
    y1 = r.bottom
  }

  return {
    x0: x0 - base.left,
    y0: y0 - base.top,
    x1: x1 - base.left,
    y1: y1 - base.top,
  }
}

/** Full strength clear of every guard, feathering to nothing at each. */
function visibility(x, y, guards, feather) {
  let v = 1
  for (const g of guards) {
    const dx = Math.max(g.x0 - x, 0, x - g.x1)
    const dy = Math.max(g.y0 - y, 0, y - g.y1)
    v = Math.min(v, smooth(Math.hypot(dx, dy) / feather))
    if (v <= 0) return 0
  }
  return v
}

function smooth(t) {
  const c = t < 0 ? 0 : t > 1 ? 1 : t
  return c * c * (3 - 2 * c)
}

/**
 * A jittered lattice, thinned out on the left so the field never competes
 * with the name. Seeded, so the architecture is identical on every load.
 */
function buildNodes(w, h) {
  let seed = 0x9e3779b9
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }

  const cols = Math.max(5, Math.round(w / 112))
  const rows = Math.max(4, Math.round(h / 112))
  const nodes = []

  for (let cx = 0; cx < cols; cx++) {
    for (let cy = 0; cy < rows; cy++) {
      const bias = cols > 1 ? cx / (cols - 1) : 1
      // Keep roughly a quarter of the left-hand cells and most of the right.
      if (rand() > 0.3 + bias * 0.6) continue
      nodes.push({
        x: ((cx + 0.5) / cols) * w + (rand() - 0.5) * 44,
        y: ((cy + 0.5) / rows) * h + (rand() - 0.5) * 44,
        phase: rand() * Math.PI * 2,
        speed: 0.1 + rand() * 0.16,
        amp: 3 + rand() * 7,
        rank: rand(),
        live: false,
        px: 0,
        py: 0,
        lift: 0,
      })
    }
  }

  // Hard cap. Links are drawn every frame and grow with the square of the
  // node count, so an ultrawide or 4K hero would otherwise pay for a few
  // hundred nodes it gains nothing from. Trimmed by rank, which is stable
  // for a given seed.
  const MAX_NODES = 90
  const kept =
    nodes.length > MAX_NODES
      ? nodes.sort((a, b) => b.rank - a.rank).slice(0, MAX_NODES)
      : nodes

  // Three live nodes, taken from the right-hand two thirds so the accent
  // never lands near the headline.
  kept
    .filter((n) => n.x > w * 0.42)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 3)
    .forEach((n) => {
      n.live = true
    })

  return kept
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return null
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  }
}
