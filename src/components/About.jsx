import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { profile } from '../data/content'

/**
 * About as a two-column editorial spread: a direction line on the left,
 * two sentences and the social links on the right, closed by the marker
 * that hands over to what follows.
 *
 * Deliberately short. The section used to carry three paragraphs of
 * biography and a five-item numbered list, which said less than the two
 * lines that replaced them.
 *
 * Animation note, as elsewhere on the page: `initial` never sets opacity
 * on content that has to be readable. Only transform is animated, so if
 * the reveal never runs the copy is still there. Reduced motion is
 * handled in JS because these are Framer animations on the Web Animations
 * API, which the stylesheet's `prefers-reduced-motion` rule does not
 * reach.
 */
export default function About() {
  const reduce = useReducedMotion()

  return (
    <section
      id="about"
      className="relative px-6 py-24 md:px-16 md:py-36"
      style={{
        background:
          'linear-gradient(180deg, rgba(244,85,42,0.085) 0%, rgba(244,85,42,0.012) 26%, rgba(244,244,245,0.014) 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {/* ---------- Header ---------- */}
        <Reveal reduce={reduce} y={10}>
          <div
            className="mb-16 border-b pb-6 md:mb-24"
            style={{ borderColor: 'var(--hairline)' }}
          >
            <p className="eyebrow">About</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              A short, honest version
              <span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* ---------- Left: direction ---------- */}
          <Reveal reduce={reduce} delay={0.06} className="md:col-span-4">
            <p className="mono-label" style={{ color: 'var(--muted)' }}>
              Direction
            </p>
            {/* Set as metadata rather than a sentence: mono, tracked out,
                with the separators carrying the accent so the three terms
                read as one specification. */}
            <p
              className="mt-4 font-mono text-[11.5px] uppercase leading-[2]"
              style={{ color: 'var(--ink-soft)', letterSpacing: '0.2em' }}
            >
              {profile.positioning.split(' · ').map((term, i) => (
                <span key={term}>
                  {i > 0 && (
                    <span style={{ color: 'var(--accent)' }}>{' · '}</span>
                  )}
                  {term}
                </span>
              ))}
            </p>
          </Reveal>

          {/* ---------- Right: copy + links ---------- */}
          <div className="md:col-span-7">
            <Reveal reduce={reduce} delay={0.12}>
              <div
                className="max-w-[42ch] space-y-6 text-[clamp(1.02rem,1.32vw,1.28rem)] leading-[1.55]"
                style={{ color: 'var(--ink)', letterSpacing: '-0.008em' }}
              >
                {profile.about.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </Reveal>

            <Reveal reduce={reduce} delay={0.22}>
              <div className="mt-14 flex flex-wrap gap-4">
                <EditorialLink
                  href={profile.links.github}
                  label="GitHub"
                  reduce={reduce}
                />
                <EditorialLink
                  href={profile.links.linkedin}
                  label="LinkedIn"
                  reduce={reduce}
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* ---------- Hand-off ---------- */}
        <Reveal reduce={reduce} delay={0.3}>
          <div
            className="mt-24 flex items-center gap-5 border-t pt-6 md:mt-32"
            style={{ borderColor: 'var(--hairline)' }}
          >
            <span className="mono-label" style={{ color: 'var(--muted)' }}>
              Highlights
            </span>
            {/* Leader rule: carries the eye across the empty space to the
                arrow instead of leaving the label stranded. */}
            <span
              aria-hidden="true"
              className="h-px flex-1"
              style={{
                background:
                  'linear-gradient(90deg, var(--hairline), color-mix(in srgb, var(--accent) 45%, transparent))',
              }}
            />
            <span
              aria-hidden="true"
              className="font-mono text-[13px] leading-none"
              style={{ color: 'var(--accent)' }}
            >
              →
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/** Staggered scroll reveal. Transform only, and inert under reduced motion. */
function Reveal({ children, reduce, delay = 0, y = 14, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ y: reduce ? 0 : y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={
        reduce ? { duration: 0 } : { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  )
}

const clamp = (v, max) => Math.max(-max, Math.min(max, v))

/**
 * A link set as a piece of the grid rather than a button: hairline box,
 * wide letter-spaced mono label, arrow. It leans a few pixels toward the
 * cursor while the pointer is inside it, which is the whole of the
 * interaction. The pull is clamped so it never detaches from its row.
 *
 * Colour changes are Tailwind hover states; only the lean is scripted, so
 * the link still responds normally if the motion never runs.
 */
function EditorialLink({ href, label, reduce }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { stiffness: 280, damping: 22, mass: 0.4 }
  const x = useSpring(mx, spring)
  const y = useSpring(my, spring)

  const onMove = (e) => {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(clamp((e.clientX - (r.left + r.width / 2)) * 0.26, 8))
    my.set(clamp((e.clientY - (r.top + r.height / 2)) * 0.42, 5))
  }

  const release = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={release}
      onBlur={release}
      className="group inline-flex items-center gap-4 border px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] border-[color:var(--hairline)] text-[color:var(--ink-soft)] transition-colors duration-300 hover:border-[color:var(--accent)] hover:bg-[rgba(244,85,42,0.05)] hover:text-[color:var(--ink)]"
    >
      {label}
      <span
        aria-hidden="true"
        className="text-[color:var(--muted)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--accent)]"
      >
        ↗
      </span>
    </motion.a>
  )
}
