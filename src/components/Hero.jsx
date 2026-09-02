import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * Cinematic hero (conqr.mx pattern). One dramatic 3D-feel torus /
 * subsurface-glow shape as the anchor, massive negative space, minimal
 * text at the corners. Name and details are quiet edge chrome; the
 * shape is the show.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 md:px-10"
    >
      {/* The dramatic hero object */}
      <HeroTorus />

      {/* Bottom-left: identity + short line */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="absolute bottom-8 left-6 z-10 max-w-lg md:bottom-14 md:left-10"
      >
        <p className="mono-label" style={{ color: 'var(--muted)' }}>
          Portfolio · 2026
        </p>
        <h1
          className="serif mt-3 text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[0.95] tracking-[-0.02em]"
          style={{ color: 'var(--ink)' }}
        >
          Namit Singh Sarna
        </h1>
        <p
          className="mt-3 max-w-md text-[14px] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {profile.headline}
        </p>
      </motion.div>

      {/* Bottom-right: status */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="absolute bottom-8 right-6 z-10 hidden md:bottom-14 md:right-10 md:block"
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
          <span
            className="mono-label"
            style={{ color: 'var(--muted)' }}
          >
            United Kingdom
          </span>
        </div>
      </motion.div>

      {/* Top-left tiny meta below logo (logo is in Nav) */}
      {/* Scroll indicator, bottom-centre */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.6 },
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 md:bottom-6"
      >
        <div className="flex flex-col items-center gap-1">
          <span
            className="mono-label"
            style={{ color: 'var(--muted)' }}
          >
            Scroll
          </span>
          <span
            className="h-6 w-px"
            style={{ background: 'var(--faint)' }}
          />
        </div>
      </motion.div>
    </section>
  )
}

/**
 * Cinematic torus. Two overlapping radial-gradient discs create a
 * subsurface-glow torus effect (conqr.mx metallic donut vibe). Slowly
 * drifts and rotates for depth. Pure CSS/SVG, no external deps.
 */
function HeroTorus() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none relative aspect-square w-[min(88vw,72vh)]"
      aria-hidden="true"
    >
      {/* Ambient bloom underneath */}
      <div
        className="absolute inset-[-20%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(220,38,38,0.22) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Outer disc with subsurface red/blue */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, #f87171 0%, #dc2626 25%, #7f1d1d 55%, #1e293b 78%, #0b1220 92%)',
          boxShadow:
            'inset 0 0 120px rgba(59,130,246,0.35), inset 0 0 40px rgba(0,0,0,0.6), 0 40px 160px rgba(220,38,38,0.18)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner black hole (creates the torus/donut) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: '28%',
          left: '28%',
          width: '44%',
          height: '44%',
          background:
            'radial-gradient(circle at 50% 50%, #0a0a0a 60%, #000 100%)',
          boxShadow:
            'inset 0 20px 60px rgba(220,38,38,0.30), inset 0 -20px 60px rgba(59,130,246,0.20), 0 0 60px rgba(0,0,0,0.9)',
        }}
        animate={{
          x: [0, 4, -3, 0],
          y: [0, -3, 4, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Highlight sheen top-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: '8%',
          left: '18%',
          width: '35%',
          height: '15%',
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 70%)',
          transform: 'rotate(-20deg)',
          filter: 'blur(6px)',
        }}
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle grain noise */}
      <div
        className="absolute inset-0 rounded-full opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.5\'/></svg>")',
        }}
      />
    </motion.div>
  )
}
