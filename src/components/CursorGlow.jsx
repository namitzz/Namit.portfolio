import { useEffect, useRef } from 'react'

/**
 * Soft accent-coloured light that follows the cursor on pointer devices.
 * Disables itself on touch / coarse pointer devices for performance.
 */
export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(hover: none)').matches) {
      el.style.display = 'none'
      return
    }

    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let x = tx
    let y = ty

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
    }

    const loop = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      el.style.transform = `translate3d(${x - 240}px, ${y - 240}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[5] h-[480px] w-[480px] rounded-full opacity-60 mix-blend-screen"
      style={{
        background:
          'radial-gradient(closest-side, var(--accent) 0%, transparent 70%)',
        filter: 'blur(40px)',
        willChange: 'transform',
      }}
    />
  )
}
