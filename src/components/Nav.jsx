import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Hamburger-only nav (conqr.mx pattern). Serif wordmark top-left, a
 * hamburger icon top-right that opens a full-screen overlay menu.
 * No inline links. Massive negative space is the point.
 */
const links = [
  { href: '#top', label: 'Home', num: '00' },
  { href: '#about', label: 'About', num: '01' },
  { href: '#work', label: 'Work', num: '02' },
  { href: '#experience', label: 'Experience', num: '03' },
  { href: '#skills', label: 'Skills', num: '04' },
  { href: '#writing', label: 'Writing', num: '05' },
  { href: '#contact', label: 'Contact', num: '06' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)
  const wasOpen = useRef(false)

  // While the menu is open: Esc closes it, the page behind cannot scroll,
  // and the page behind cannot take focus. It used to be possible to Tab
  // straight out of the menu into links hidden under it.
  //
  // It only touches body overflow while it is actually open. It used to
  // write '' on every mount as well, which silently undid the intro's own
  // scroll lock the moment the page loaded.
  useEffect(() => {
    if (!open) {
      // Hand focus back to the button that opened it, but only when it was
      // closed from inside (Esc or the button). A link choice moves on.
      if (wasOpen.current && document.activeElement === document.body) {
        toggleRef.current?.focus({ preventScroll: true })
      }
      wasOpen.current = false
      return undefined
    }
    wasOpen.current = true
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus({ preventScroll: true })
      }
    }
    const main = document.querySelector('main')
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (main) main.inert = true
    window.addEventListener('keydown', onKey)
    firstLinkRef.current?.focus({ preventScroll: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
      if (main) main.inert = false
    }
  }, [open])

  // Past the top of the page the bar gets a ground of its own. Transparent,
  // it let every section scroll straight through the logo and the menu
  // button, which on a phone put the wordmark on top of body text.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Fixed top bar: logo + hamburger */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        // Above the menu overlay (z-65), so the close button stays visible
        // and takes the tap. Below it, the open menu covered its own close
        // button: on a phone the only way out was to pick a link.
        className="fixed top-0 left-0 right-0 z-[70] transition-[background-color,border-color,backdrop-filter] duration-300"
        style={{
          background: scrolled && !open ? 'rgba(0,0,0,0.72)' : 'transparent',
          backdropFilter: scrolled && !open ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled && !open ? 'blur(12px)' : 'none',
          borderBottom: `1px solid ${scrolled && !open ? 'var(--hairline)' : 'transparent'}`,
        }}
      >
        {/* Padding matches the hero's own band (px-6 / md:px-16) so the
            wordmark and the hamburger land on the same left and right
            edges as the metadata, headline and rule below them. */}
        <div
          className={`mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 transition-[padding] duration-300 md:px-16 ${
            scrolled && !open ? 'py-3 md:py-4' : 'py-6 md:py-8'
          }`}
        >
          <a
            href="#top"
            data-field-guard
            className="serif group relative text-[22px] leading-none tracking-tight md:text-[24px]"
            style={{ color: 'var(--ink)' }}
          >
            namit
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-[2px]"
              style={{ color: 'var(--accent)' }}
            >
              .
            </span>
            {/* Rule draws in from the left on hover. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-0 transition-[width] duration-300 ease-out group-hover:w-full"
              style={{ background: 'var(--accent)' }}
            />
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            data-field-guard
            className="group relative z-[70] flex h-11 w-11 items-center justify-center"
            // The 44px hit area is wider than the 24px bars; the offset
            // sets the bars' right edge on the grid, not the button's.
            style={{ color: 'var(--ink)', marginRight: '-10px' }}
          >
            {/* Closed, the lower bar is short and evens up on hover (the
                `!` is needed to beat the inline width); open, they cross. */}
            <span
              className="absolute h-[1.5px] transition-all duration-300"
              style={{
                background: 'currentColor',
                width: '24px',
                transform: open
                  ? 'rotate(45deg) translateY(0)'
                  : 'translateY(-4px)',
              }}
            />
            <span
              className="absolute h-[1.5px] transition-all duration-300"
              style={{
                background: 'currentColor',
                opacity: open ? 0 : 1,
                width: '24px',
              }}
            />
            <span
              className="absolute h-[1.5px] transition-all duration-300 group-hover:!w-6"
              style={{
                background: 'currentColor',
                width: open ? '24px' : '15px',
                transform: open
                  ? 'rotate(-45deg) translateY(0)'
                  : 'translateY(4px)',
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
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            // Scrolls as a last resort, on a window too short for even the
            // height-fitted list below.
            className="fixed inset-0 z-[65] flex flex-col overflow-y-auto overscroll-contain"
            style={{ background: '#000' }}
          >
            {/* Menu items */}
            {/* `safe center` centres the list when it fits and top-aligns it
                when it does not, so an overflowing list can still be
                scrolled to its first item instead of losing it off the top. */}
            <nav
              aria-label="Sections"
              className="flex flex-1 items-center px-6 pt-20 [align-items:safe_center] md:px-10 md:pt-24"
            >
              <ul className="mx-auto w-full max-w-[1600px]">
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
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="group grid grid-cols-[3rem_1fr_2rem] items-baseline gap-6 py-[clamp(0.5rem,1.6vh,1.5rem)]"
                    >
                      <span
                        className="mono-label"
                        style={{ color: 'var(--muted)' }}
                      >
                        {l.num}
                      </span>
                      <span
                        // Sized by the window's height as well as its width:
                        // by width alone, seven rows at 88px ran past the
                        // bottom of an 800px laptop screen and Contact could
                        // not be reached.
                        className="serif text-[clamp(2.25rem,min(7vw,8vh),5.5rem)] leading-none tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-2"
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
            </nav>

            {/* Bottom strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-6 border-t px-6 py-6 md:grid-cols-3 md:px-10"
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
