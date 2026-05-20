import { motion } from 'framer-motion'
import { themes } from '../data/themes'

const links = [
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#writing', label: 'Writing' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav({ themeKey }) {
  const theme = themes[themeKey] || themes.base

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5"
    >
      <nav className="glass-strong flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-2.5">
        <a href="#top" className="flex items-center gap-2.5">
          <motion.span
            className="inline-block h-2.5 w-2.5 rounded-full"
            animate={{ background: theme.accent, boxShadow: `0 0 16px ${theme.accent}` }}
            transition={{ duration: 0.8 }}
          />
          <span className="font-display text-sm font-semibold tracking-tight">
            Namit Singh Sarna
          </span>
          <motion.span
            className="ml-1 hidden text-[10px] uppercase tracking-[0.2em] text-white/40 sm:inline"
            key={theme.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
          >
            / {theme.name}
          </motion.span>
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-2.5 py-1.5 text-[13px] text-white/70 transition hover:bg-white/5 hover:text-white lg:px-3 lg:text-sm"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/90 transition hover:bg-white/5 sm:inline-block"
        >
          Get in touch
        </a>
      </nav>
    </motion.header>
  )
}
