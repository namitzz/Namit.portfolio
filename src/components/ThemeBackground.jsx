import { AnimatePresence, motion } from 'framer-motion'
import { themes } from '../data/themes'

/**
 * Fixed full-viewport background that smoothly transitions between project
 * palettes. Uses AnimatePresence with a key per theme so we get a real
 * cross-fade rather than trying to interpolate complex gradient strings
 * (which Framer Motion can't always do smoothly).
 *
 * Sits behind everything (z-0). All other content lives on z >= 10.
 */
export default function ThemeBackground({ themeKey }) {
  const theme = themes[themeKey] || themes.base

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{
        // Expose theme tokens as CSS variables so child components can opt-in.
        '--accent': theme.accent,
        '--accent-2': theme.accent2,
        '--muted': theme.muted,
      }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={theme.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(1200px 800px at 18% 8%, ${theme.glow}, transparent 60%), radial-gradient(900px 700px at 90% 80%, ${theme.accent2}22, transparent 60%), linear-gradient(180deg, ${theme.bgFrom} 0%, ${theme.bgTo} 100%)`,
          }}
        />
      </AnimatePresence>

      {/* Subtle technical grid overlay (theme-agnostic) */}
      <div className="absolute inset-0 bg-tech-grid opacity-[0.35]" />

      {/* Floating accent orbs that crossfade with the theme */}
      <AnimatePresence mode="sync">
        <motion.div
          key={theme.id + '-orb1'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute -top-40 -left-32 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: theme.accent + '33' }}
        />
        <motion.div
          key={theme.id + '-orb2'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute bottom-[-200px] right-[-120px] h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: theme.accent2 + '22' }}
        />
      </AnimatePresence>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  )
}
