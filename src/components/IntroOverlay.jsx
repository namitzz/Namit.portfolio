import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Cinematic first-load intro. Full-screen black takeover. A single
 * "opening card" reveal: eyebrow + big serif name, a hairline scan-
 * bar wipes across, then the whole panel slides up to reveal the
 * hero. Plays once per browser session (sessionStorage flag) so
 * repeat navigations don't re-play it.
 *
 * Total runtime: ~1.7s. Skippable by click or Esc.
 */
const SESSION_KEY = 'namitss_intro_played_v1'

export default function IntroOverlay() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return !sessionStorage.getItem(SESSION_KEY)
    } catch {
      return true
    }
  })

  // Auto-dismiss + hook Esc/click.
  useEffect(() => {
    if (!show) return

    // Lock scroll while intro is visible.
    document.body.style.overflow = 'hidden'

    const dismiss = () => setShow(false)
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)

    const t = setTimeout(dismiss, 1700)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [show])

  // Persist the "played" flag when we start dismissing.
  useEffect(() => {
    if (!show) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* private mode / disabled storage — silently ignore */
      }
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          onClick={() => setShow(false)}
          role="presentation"
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-black"
          style={{ willChange: 'transform' }}
        >
          {/* Top-left timestamp (movie-opening card) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 md:top-10 md:left-10"
          >
            NAMIT.SS · 2026
          </motion.p>

          {/* Top-right skip cue */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 md:top-10 md:right-10"
          >
            skip →
          </motion.p>

          {/* Kinetic reveal — three lines, each mask-slides up */}
          <div className="mx-auto flex flex-col items-center gap-2 px-6 text-center">
            <IntroLine delay={0.05}>Namit</IntroLine>
            <IntroLine delay={0.18}>Singh</IntroLine>
            <IntroLine delay={0.31}>
              <>
                Sarna
                <span
                  className="ml-[0.03em] inline-block align-baseline"
                  style={{ color: 'var(--accent)' }}
                >
                  .
                </span>
              </>
            </IntroLine>
          </div>

          {/* Bottom-left tagline */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 md:bottom-10 md:left-10"
          >
            Software · AI · full-stack
          </motion.p>

          {/* Bottom-right loading meter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute bottom-6 right-6 flex items-center gap-3 md:bottom-10 md:right-10"
          >
            <div className="h-[1px] w-16 overflow-hidden md:w-32" style={{ background: 'rgba(255,255,255,0.14)' }}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.05 }}
                className="h-full w-full origin-left"
                style={{ background: 'var(--accent)' }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              loading
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function IntroLine({ children, delay = 0 }) {
  return (
    <span
      className="serif block overflow-hidden leading-[0.9] tracking-[-0.04em] text-white"
      style={{
        fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
        paddingTop: '0.06em',
        paddingBottom: '0.02em',
      }}
    >
      <motion.span
        className="block"
        style={{ marginTop: '-0.06em', marginBottom: '-0.02em', willChange: 'transform' }}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}
