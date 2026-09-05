import { motion } from 'framer-motion'

/**
 * Editorial landing hero — a magazine cover. Masthead, name, contents.
 *
 * Animation note: `initial` never sets opacity on content that must be
 * readable. Only transform is animated, so if the mount animation never
 * runs (throttled background tab, low-power mode) the text is still
 * visible rather than stuck invisible.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden px-6 pt-28 pb-8 md:px-16 md:pt-32 md:pb-12"
    >
      {/* Masthead */}
      <motion.div
        initial={{ y: -6 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto flex w-full max-w-[1600px] items-start justify-between gap-6"
      >
        <div className="flex flex-col gap-1">
          <span className="mono-label" style={{ color: 'var(--muted)' }}>
            Portfolio · Vol. 01
          </span>
          <span className="mono-label" style={{ color: 'var(--muted)' }}>
            2026 · United Kingdom
          </span>
        </div>

        <div className="hidden flex-col items-end gap-1 md:flex">
          <span className="mono-label" style={{ color: 'var(--muted)' }}>
            AI · Full-stack · Data
          </span>
          <span
            className="mono-label flex items-center gap-2"
            style={{ color: 'var(--muted)' }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
            Available · Graduate roles
          </span>
        </div>
      </motion.div>

      {/* Name */}
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 items-center py-8">
        <h1
          className="serif relative z-10 w-full whitespace-nowrap leading-[1.05] tracking-[-0.03em]"
          style={{
            color: 'var(--ink)',
            fontSize: 'clamp(1.9rem, 7vw, 5.5rem)',
          }}
        >
          <NameLine delay={0.15}>
            <>
              Namit Singh Sarna
              <span
                className="ml-[0.02em] inline-block align-baseline"
                style={{ color: 'var(--accent)' }}
              >
                .
              </span>
            </>
          </NameLine>
        </h1>
      </div>

      {/* Footer: single scroll cue, no competing nav */}
      <motion.div
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-6 border-t pt-6"
        style={{ borderColor: 'var(--hairline)' }}
      >
        <p
          className="serif max-w-md text-[clamp(1.05rem,1.5vw,1.4rem)] leading-[1.25] tracking-[-0.01em]"
          style={{ color: 'var(--ink)' }}
        >
          Software engineer at the edge of AI and the web.
        </p>

        <a
          href="#about"
          className="mono-label group flex shrink-0 items-center gap-2 transition-opacity hover:opacity-70"
          style={{ color: 'var(--muted)' }}
        >
          Scroll
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-y-0.5"
          >
            ↓
          </span>
        </a>
      </motion.div>
    </section>
  )
}

function NameLine({ children, delay = 0 }) {
  return (
    <span
      className="block overflow-hidden"
      style={{ paddingTop: '0.06em', paddingBottom: '0.02em' }}
    >
      <motion.span
        className="block"
        style={{
          marginTop: '-0.06em',
          marginBottom: '-0.02em',
          willChange: 'transform',
        }}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}
