import { motion } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Software-artifact nav. Mono type, keyboard hints in brackets, terminal
 * status dot, hairline border. Keyboard letters (w/a/s/x/c) jump straight
 * to sections without hitting Tab.
 */
const links = [
  { key: 'w', href: '#work', label: 'Work' },
  { key: 'a', href: '#about', label: 'About' },
  { key: 's', href: '#skills', label: 'Skills' },
  { key: 'x', href: '#experience', label: 'Experience' },
  { key: 'c', href: '#contact', label: 'Contact' },
]

export default function Nav() {
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey)
        return
      const hit = links.find((l) => l.key === e.key.toLowerCase())
      if (hit) {
        e.preventDefault()
        const target = document.querySelector(hit.href)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm"
    >
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-6 py-3 font-mono text-[12px] md:px-8">
        {/* Left: identity + availability */}
        <a
          href="#top"
          className="group flex items-center gap-2.5 whitespace-nowrap text-white/90 transition-colors hover:text-white"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent)',
            }}
            aria-hidden="true"
          />
          <span className="font-medium tracking-wide">
            namit<span className="text-white/40">.ss</span>
          </span>
          <span className="hidden text-white/40 sm:inline">/ available</span>
        </a>

        {/* Middle: numbered index of sections */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group flex items-center gap-2 px-2 py-1 text-white/60 transition-colors hover:text-white"
              >
                <span className="text-white/30 group-hover:text-white/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{l.label}</span>
                <span
                  className="ml-0.5 hidden rounded-sm border border-white/15 px-1 text-[9px] text-white/40 group-hover:text-white/70 lg:inline"
                  aria-hidden="true"
                >
                  {l.key}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Right: contact link */}
        <a
          href="#contact"
          className="whitespace-nowrap text-white/60 transition-colors hover:text-white"
        >
          <span className="hidden md:inline">→ </span>get_in_touch
        </a>
      </nav>
    </motion.header>
  )
}
