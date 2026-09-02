import { motion } from 'framer-motion'

/**
 * Editorial minimal nav. Small serif wordmark on the left, a handful
 * of quiet links in the centre, and a discreet "Available" tag on
 * the right. No keyboard-hint brackets, no terminal dot.
 */
const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav
        className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-6 py-5 md:px-10"
        style={{ color: 'var(--ink)' }}
      >
        <a
          href="#top"
          className="serif text-[22px] leading-none tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          Namit Singh Sarna
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[14px] transition-opacity hover:opacity-60"
                style={{ color: 'var(--ink-soft)' }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <span
          className="mono-label hidden items-center gap-2 md:inline-flex"
          style={{ color: 'var(--muted)' }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
          Available
        </span>
      </nav>
    </motion.header>
  )
}
