import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Hamburger-only nav (conqr.mx pattern). Serif wordmark top-left, a
 * hamburger icon top-right that opens a full-screen overlay menu.
 * No inline links. Massive negative space is the point.
 */
const links = [
  { href: '#top', label: 'Home', num: '00' },
  { href: '#work', label: 'Work', num: '01' },
  { href: '#about', label: 'About', num: '02' },
  { href: '#skills', label: 'Skills', num: '03' },
  { href: '#experience', label: 'Experience', num: '04' },
  { href: '#contact', label: 'Contact', num: '05' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  // Close on Esc; lock body scroll while overlay is open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = open ? 'hidden' : ''
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Fixed top bar: logo + hamburger */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-[60]"
      >
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
          <a
            href="#top"
            className="serif text-[22px] leading-none tracking-tight md:text-[24px]"
            style={{ color: 'var(--ink)' }}
          >
            namit<span style={{ color: 'var(--accent)' }}>.</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="group relative z-[70] flex h-11 w-11 items-center justify-center"
            style={{ color: 'var(--ink)' }}
          >
            <span
              className="absolute h-[2px] w-6 transition-transform duration-300"
              style={{
                background: 'currentColor',
                transform: open ? 'rotate(45deg) translateY(0)' : 'translateY(-5px)',
              }}
            />
            <span
              className="absolute h-[2px] w-6 transition-opacity duration-300"
              style={{
                background: 'currentColor',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="absolute h-[2px] w-6 transition-transform duration-300"
              style={{
                background: 'currentColor',
                transform: open ? 'rotate(-45deg) translateY(0)' : 'translateY(5px)',
              }}
            />
          </button>
        </div>
      </motion.header>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[65] flex flex-col"
            style={{ background: '#000' }}
          >
            {/* Menu items */}
            <div className="flex flex-1 items-center px-6 md:px-10">
              <ul className="mx-auto w-full max-w-[1500px]">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05 + i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b"
                    style={{ borderColor: 'var(--hairline)' }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="group grid grid-cols-[3rem_1fr_2rem] items-baseline gap-6 py-4 md:py-6"
                    >
                      <span
                        className="mono-label"
                        style={{ color: 'var(--muted)' }}
                      >
                        {l.num}
                      </span>
                      <span
                        className="serif text-[clamp(2.5rem,7vw,5.5rem)] leading-none tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-2"
                        style={{ color: 'var(--ink)' }}
                      >
                        {l.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="serif text-right text-[1.4rem] leading-none opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ color: 'var(--ink)' }}
                      >
                        →
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Bottom strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="mx-auto grid w-full max-w-[1500px] grid-cols-2 gap-6 border-t px-6 py-6 md:grid-cols-3 md:px-10"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <div>
                <p className="mono-label" style={{ color: 'var(--muted)' }}>
                  Status
                </p>
                <p
                  className="mt-1 flex items-center gap-2 text-[13px]"
                  style={{ color: 'var(--ink)' }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                  Available for graduate roles
                </p>
              </div>
              <div>
                <p className="mono-label" style={{ color: 'var(--muted)' }}>
                  Email
                </p>
                <a
                  href="mailto:namitmec@gmail.com"
                  className="mt-1 block text-[13px] hover:opacity-70"
                  style={{ color: 'var(--ink)' }}
                >
                  namitmec@gmail.com
                </a>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="mono-label" style={{ color: 'var(--muted)' }}>
                  Location
                </p>
                <p
                  className="mt-1 text-[13px]"
                  style={{ color: 'var(--ink)' }}
                >
                  United Kingdom · 2026
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
