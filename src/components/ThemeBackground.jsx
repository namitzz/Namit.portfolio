import { AnimatePresence, motion } from 'framer-motion'
import { themes } from '../data/themes'

/**
 * Fixed full-viewport background that smoothly transitions between project
 * palettes. Uses AnimatePresence with a key per theme so we get a real
 * cross-fade rather than trying to interpolate complex gradient strings
 * (which Framer Motion can't always do smoothly).
 *
 * Sits behind everything (z-0). All other content lives on z >= 10.
 * Paints only. The palette variables are set by App on the ancestor both
 * this and <main> share, so the content inherits them too.
 */
export default function ThemeBackground({ themeKey }) {
  const theme = themes[themeKey] || themes.base

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <AnimatePresence mode="sync">
        <motion.div
          key={theme.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(1100px 750px at 15% 5%, ${theme.glow}, transparent 62%), linear-gradient(180deg, ${theme.bgFrom} 0%, ${theme.bgTo} 100%)`,
          }}
        />
      </AnimatePresence>

      {/* Subtle technical grid overlay (theme-agnostic) */}
      <div className="absolute inset-0 bg-tech-grid opacity-[0.12]" />

      {/* One restrained accent orb, top-left only. */}
      <AnimatePresence mode="sync">
        <motion.div
          key={theme.id + '-orb1'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute -top-48 -left-40 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: theme.accent + '10' }}
        />
      </AnimatePresence>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  )
}
