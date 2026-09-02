import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * Cinematic hero (conqr.mx pattern). One dramatic torus / subsurface
 * glow shape as the anchor, huge negative space, minimal corner
 * chrome. Animations kept cheap on the GPU: no rotating radial
 * gradients, no big filter blurs on animated elements.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 md:px-10"
    >
      {/* The dramatic hero object */}
      <HeroTorus />

      {/* Bottom-left: identity */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="absolute bottom-12 left-6 z-10 max-w-lg md:bottom-16 md:left-14 lg:bottom-20 lg:left-20"
      >
        <p className="mono-label" style={{ color: 'var(--muted)' }}>
          Portfolio · 2026
        </p>
        <h1
          className="serif mt-4 text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] tracking-[-0.02em]"
          style={{ color: 'var(--ink)' }}
        >
          Namit Singh Sarna
        </h1>
        <p
          className="mt-4 max-w-md text-[14px] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {profile.headline}
        </p>
      </motion.div>

      {/* Bottom-right: status */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="absolute bottom-12 right-6 z-10 hidden md:bottom-16 md:right-14 md:block lg:bottom-20 lg:right-20"
      >
        <div className="flex flex-col items-end gap-2 text-right">
          <span
            className="mono-label flex items-center gap-2"
            style={{ color: 'var(--muted)' }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
            Available
          </span>
          <span className="mono-label" style={{ color: 'var(--muted)' }}>
            United Kingdom
          </span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.1, duration: 0.6 },
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 md:bottom-6"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="mono-label" style={{ color: 'var(--muted)' }}>
            Scroll
          </span>
          <span className="h-6 w-px" style={{ background: 'var(--faint)' }} />
        </div>
      </motion.div>
    </section>
  )
}

/**
 * Cinematic torus. Static gradient with a subtle drift on the black
 * centre only — no rotating radial-gradients (that repaints every
 * frame) and no filter blurs on animated elements (also expensive).
 * The static bloom uses filter:blur but never animates, so it's
 * cached by the compositor.
 */
function HeroTorus() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none relative aspect-square w-[min(62vw,56vh)]"
      style={{ willChange: 'transform, opacity' }}
      aria-hidden="true"
    >
      {/* Static ambient bloom — filter blurred once, not animated */}
      <div
        className="absolute inset-[-15%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(220,38,38,0.20) 0%, rgba(59,130,246,0.09) 45%, transparent 72%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Outer red disc — static, no rotation */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #f87171 0%, #dc2626 24%, #7f1d1d 50%, #1e293b 76%, #0b1220 92%)',
          boxShadow: '0 30px 120px rgba(220,38,38,0.14)',
        }}
      />

      {/* Inner black hole — drifts subtly (only transform, cheap) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: '28%',
          left: '28%',
          width: '44%',
          height: '44%',
          background: '#050505',
          boxShadow:
            'inset 0 0 40px rgba(220,38,38,0.20), inset 0 0 20px rgba(0,0,0,0.9)',
          willChange: 'transform',
        }}
        animate={{
          x: [0, 3, -2, 0],
          y: [0, -2, 3, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Small highlight sheen — CSS-only, static */}
      <div
        className="absolute rounded-full"
        style={{
          top: '10%',
          left: '20%',
          width: '30%',
          height: '12%',
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 70%)',
          transform: 'rotate(-20deg)',
          opacity: 0.6,
        }}
      />
    </motion.div>
  )
}
