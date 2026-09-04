import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * Editorial landing hero. The dramatic intro plays first (IntroOverlay);
 * once it exits, this is the "spread you land on" — a magazine cover
 * table-of-contents. No torus, no chrome, pure typography.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden px-6 pt-28 pb-8 md:px-16 md:pt-32 md:pb-12"
    >
      {/* Top strip: magazine masthead */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
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

      {/* Centre: stacked name */}
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 items-center py-10">
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
                style={{ color: '#f4552a' }}
              >
                .
              </span>
            </>
          </NameLine>
        </h1>
      </div>

      {/* Bottom strip: table of contents */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-end gap-8 md:grid-cols-12"
      >
        <div className="md:col-span-5">
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            The Role
          </p>
          <p
            className="serif mt-3 text-[clamp(1.2rem,1.8vw,1.65rem)] leading-[1.2] tracking-[-0.01em]"
            style={{ color: 'var(--ink)' }}
          >
            Software engineer at the edge of AI and the web.
          </p>
        </div>

        <div className="hidden md:col-span-3 md:block">
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            Focus
          </p>
          <ul
            className="mt-3 space-y-1 text-[13px]"
            style={{ color: 'var(--ink-soft)' }}
          >
            <li>RAG · retrieval-grounded systems</li>
            <li>Backend · data · ML</li>
            <li>Product-quality frontend</li>
          </ul>
        </div>

        <div className="md:col-span-4 md:text-right">
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            Contents
          </p>
          <ul
            className="mt-3 space-y-1 text-[13px]"
            style={{ color: 'var(--ink-soft)' }}
          >
            <li>
              <a href="#work" className="hover:opacity-70">
                01 · Selected work
              </a>
            </li>
            <li>
              <a href="#about" className="hover:opacity-70">
                02 · About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:opacity-70">
                03 · Contact
              </a>
            </li>
          </ul>
        </div>
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
