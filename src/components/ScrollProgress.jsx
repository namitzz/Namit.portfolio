import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin accent line at the top of the page that fills with scroll progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent))',
        boxShadow: '0 0 12px var(--accent)',
      }}
    />
  )
}
