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
    let frame = 0
    let running = true

    // Where the pointer is, and where the field currently believes it is.
    // The gap between the two is what makes it feel like material rather
    // than a cursor follower.
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, strength: 0 }

    const accent =
      getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#F4552A'
    const accentRGB = hexToRgb(accent) || { r: 244, g: 85, b: 42 }

    const LINK_DIST = 168
    const POINTER_DIST = 230

    function layout() {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      nodes = buildNodes(width, height)

      // Links are fixed to the lattice, not recomputed per frame: the
      // structure should hold still while the nodes breathe inside it.
      links = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (d < LINK_DIST) links.push([i, j, 1 - d / LINK_DIST])
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
        const drift = reduced ? 0 : 1
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
      for (const [i, j, closeness] of links) {
        const a = nodes[i]
        const b = nodes[j]
        const lift = Math.max(a.lift, b.lift)
        const alpha = closeness * 0.05 + lift * 0.14
        if (alpha < 0.004) continue
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
          const a = (0.30 + n.lift * 0.5) * beat + 0.14
          ctx.fillStyle = `rgba(${accentRGB.r},${accentRGB.g},${accentRGB.b},${a.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(n.px, n.py, 1.9 + n.lift * 1.1, 0, Math.PI * 2)
          ctx.fill()

          // Faint coordinate readout, the only text in the field.
          ctx.font = '9px "JetBrains Mono", ui-monospace, monospace'
          ctx.fillStyle = `rgba(${accentRGB.r},${accentRGB.g},${accentRGB.b},${(
            0.10 +
            n.lift * 0.22
          ).toFixed(3)})`
          ctx.fillText(
            `${Math.round(n.px).toString().padStart(4, '0')}.${Math.round(n.py)
              .toString()
              .padStart(4, '0')}`,
            n.px + 9,
            n.py + 3.5,
          )
        } else {
          const a = 0.13 + n.lift * 0.42
          ctx.fillStyle = `rgba(244,244,245,${a.toFixed(3)})`
          ctx.beginPath()
          ctx.arc(n.px, n.py, 1.15 + n.lift * 0.8, 0, Math.PI * 2)
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
 * A jittered lattice, thinned out on the left so the field never competes
 * with the name. Seeded, so the architecture is identical on every load.
 */
function buildNodes(w, h) {
  let seed = 0x9e3779b9
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }

  const cols = Math.max(4, Math.round(w / 138))
  const rows = Math.max(3, Math.round(h / 138))
  const nodes = []

  for (let cx = 0; cx < cols; cx++) {
    for (let cy = 0; cy < rows; cy++) {
      const bias = cols > 1 ? cx / (cols - 1) : 1
      // Keep roughly a quarter of the left-hand cells and most of the right.
      if (rand() > 0.24 + bias * 0.66) continue
      nodes.push({
        x: ((cx + 0.5) / cols) * w + (rand() - 0.5) * 52,
        y: ((cy + 0.5) / rows) * h + (rand() - 0.5) * 52,
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

  // Three live nodes, taken from the right-hand two thirds so the accent
  // never lands on top of the headline.
  const candidates = nodes
    .filter((n) => n.x > w * 0.42)
    .sort((a, b) => b.rank - a.rank)
  candidates.slice(0, 3).forEach((n) => {
    n.live = true
  })

  return nodes
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
