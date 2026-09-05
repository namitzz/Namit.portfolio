import { useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import HeroField from './HeroField'

/**
 * Editorial landing hero: masthead metadata, the name, a caption.
 *
 * Every band shares one container — the same max width and the same
 * horizontal padding as the nav bar above it — so the logo, the metadata,
 * the headline's cap, the rule and the caption all land on one left edge
 * and one right edge. That single alignment is what makes the empty space
 * read as composed rather than merely large.
 *
 * Animation note: `initial` never sets opacity on content that must be
 * readable. Only transform is animated, so if the mount animation never
 * runs (throttled background tab, low-power mode) the text is still
 * visible rather than stuck invisible. The same rule governs the caret and
 * the availability dot: both animate from a visible resting state.
 *
 * Reduced motion is handled here in JS rather than left to the stylesheet.
 * The global `prefers-reduced-motion` rule shortens CSS animations, but
 * these are driven by Framer through the Web Animations API, which that
 * rule does not reach. Under the preference the loops simply do not start
 * and the reveal renders in place.
 */

// One container, quoted by every band in the hero and by the nav bar.
const BAND = 'mx-auto w-full max-w-[1600px]'

export default function Hero() {
  const reduce = useReducedMotion()
  const { x: nameX, y: nameY } = usePointerDrift(reduce)

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden px-6 pt-28 pb-8 md:px-16 md:pt-32 md:pb-11"
    >
      <HeroField />

      {/* Atmosphere: a low warm illumination off the top-left corner and a
          fine grain over the top of it. Both sit above the field and below
          the type, and neither is a full-bleed gradient — the page has to
          stay predominantly black.

          The grain blends normally rather than through `overlay`: overlay
          preserves blacks, so on this ground it resolved to nothing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(680px 520px at 6% 0%, rgba(244,85,42,0.075), transparent 68%), radial-gradient(900px 620px at 88% 96%, rgba(244,244,245,0.022), transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Register marks at the four corners of the content band, inset to
          exactly the section's own padding. Printer's crop marks: they
          state the grid everything else is set on, which is the whole
          point of the alignment work, and at this weight you only find
          them if you go looking. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-8 top-28 md:inset-x-16 md:bottom-11 md:top-32"
      >
        <div className={`${BAND} relative h-full`}>
          {[
            ['top-0 left-0', 'border-l border-t'],
            ['top-0 right-0', 'border-r border-t'],
            ['bottom-0 left-0', 'border-l border-b'],
            ['bottom-0 right-0', 'border-r border-b'],
          ].map(([pos, edges]) => (
            <span
              key={pos}
              className={`absolute h-2.5 w-2.5 ${pos} ${edges}`}
              style={{ borderColor: 'rgba(244,244,245,0.17)' }}
            />
          ))}
        </div>
      </div>

      {/* ---------- Masthead ---------- */}
      <motion.div
        initial={{ y: -6 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${BAND} relative z-10 flex items-start justify-between gap-8`}
      >
        <MetaBlock>
          <MetaLine primary>Portfolio · Vol. 01</MetaLine>
          <MetaLine>2026 · United Kingdom</MetaLine>
          {/* Availability is the one line worth carrying on small screens,
              where the right-hand block has nowhere to go. */}
          <span className="md:hidden">
            <MetaLine>
              <AvailabilityDot reduce={reduce} />
              Available · Graduate roles
            </MetaLine>
          </span>
        </MetaBlock>

        <MetaBlock align="right" className="hidden md:flex">
          <MetaLine primary>AI · Full-stack · Data</MetaLine>
          {/* The dot hangs outside the text column so both lines keep a
              clean right edge against the margin. */}
          <MetaLine className="relative pr-0">
            <span className="absolute -left-4 top-1/2 -translate-y-1/2">
              <AvailabilityDot reduce={reduce} />
            </span>
            Available · Graduate roles
          </MetaLine>
        </MetaBlock>
      </motion.div>

      {/* ---------- Name ---------- */}
      <div className={`${BAND} relative z-10 flex flex-1 items-center py-10`}>
        <motion.div className="w-full" style={{ x: nameX, y: nameY }}>
          <h1
            data-field-guard
            className="serif relative w-full whitespace-nowrap leading-[1.02]"
            style={{
              color: 'var(--ink)',
              // Tuned so the name holds ~63% of the measure at every desktop
              // width, which keeps it dominant while leaving the right of the
              // composition to the field. Measured, not guessed.
              fontSize: 'clamp(1.72rem, 9.2vw, 9rem)',
              letterSpacing: '-0.033em',
              // Instrument Serif sets the cap's ink 1px right of the text
              // origin at 104px. This pulls the N's stem back onto the grid
              // line; anything larger overshoots into the margin.
              marginLeft: '-0.0105em',
            }}
          >
            <NameLine delay={0.15} reduce={reduce}>
              <>
                Namit Singh Sarna
                <span
                  className="ml-[0.015em] inline-block align-baseline"
                  style={{ color: 'var(--accent)' }}
                >
                  .
                </span>
                <Caret reduce={reduce} />
              </>
            </NameLine>
          </h1>
        </motion.div>
      </div>

      {/* ---------- Rule + caption ---------- */}
      <motion.div
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className={`${BAND} relative z-10`}
      >
        <GridRule />

        {/* Mobile gives the caption the full measure and drops the cue to
            its own row. Side by side, the standfirst wrapped to three lines
            of tracked-out mono, which reads as a wall rather than a note. */}
        <div className="flex flex-col gap-7 pt-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="min-w-0">
            <p
              data-field-guard
              className="serif text-[clamp(1rem,1.42vw,1.35rem)] leading-[1.3] md:max-w-[34rem]"
              style={{
                color: 'rgba(244,244,245,0.80)',
                letterSpacing: '-0.011em',
              }}
            >
              Applied AI, and how organisations actually adopt it.
            </p>

            {/* The standfirst: what the caption is currently grounded in.
                Set in mono against the serif above it so it reads as a
                note on the line, not a second headline. */}
            <p
              data-field-guard
              className="mt-3.5 font-mono text-[10.5px] uppercase leading-[1.75] tracking-[0.14em] md:tracking-[0.18em]"
              style={{ color: 'rgba(244,244,245,0.52)' }}
            >
              <span style={{ color: 'var(--accent)' }}>Currently</span>
              {'  ·  MSc AI for Business Transformation, Aston University'}
            </p>
          </div>

          <div className="self-end md:self-auto">
            <ScrollCue reduce={reduce} />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/**
 * A few pixels of counter-drift on the headline, sprung so it trails the
 * pointer rather than tracking it. The range is deliberately smaller than
 * the eye reads as movement: it registers as the page having weight, not
 * as an effect.
 *
 * Driven through motion values, so pointer movement never re-renders the
 * component. Off entirely under reduced motion and on touch, where there
 * is no pointer to answer to.
 */
function usePointerDrift(reduce) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  useEffect(() => {
    if (reduce) return undefined
    if (!window.matchMedia('(pointer: fine)').matches) return undefined

    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, mx, my])

  const spring = { stiffness: 40, damping: 24, mass: 0.7 }
  const sx = useSpring(mx, spring)
  const sy = useSpring(my, spring)

  return {
    x: useTransform(sx, [-1, 1], [7, -7]),
    y: useTransform(sy, [-1, 1], [4, -4]),
  }
}

function MetaBlock({ children, align = 'left', className = '' }) {
  return (
    <div
      data-field-guard
      className={`flex flex-col gap-[0.42rem] ${
        align === 'right' ? 'items-end text-right' : 'items-start'
      } ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Metadata sets in two weights. The first line of each block is the label
 * and sits brighter; the second is its value and steps back. Both are well
 * clear of the background — this is information, not texture.
 */
function MetaLine({ children, primary = false, className = '' }) {
  return (
    <span
      className={`flex items-center gap-2 font-mono text-[10.5px] uppercase leading-none ${className}`}
      style={{
        letterSpacing: '0.2em',
        color: primary ? 'rgba(244,244,245,0.86)' : 'rgba(244,244,245,0.60)',
      }}
    >
      {children}
    </span>
  )
}

/** Slow pulse, from a resting state that is already fully visible. */
function AvailabilityDot({ reduce }) {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block h-[5px] w-[5px] shrink-0 rounded-full"
      style={{ background: 'var(--accent)' }}
      animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/**
 * The accent signature after the name. A hairline rather than a block
 * cursor, sized off the type so it tracks the headline at every breakpoint,
 * and resting at full strength so it is never invisible.
 */
function Caret({ reduce }) {
  return (
    <motion.span
      aria-hidden="true"
      className="ml-[0.085em] inline-block w-[0.018em] align-baseline"
      style={{
        // Just under the cap height and sitting on the baseline. At 0.78em
        // it stood proud of the caps and read as a selection bar rather
        // than a cursor.
        height: '0.62em',
        background: 'var(--accent)',
        transform: 'translateY(0.02em)',
      }}
      animate={reduce ? undefined : { opacity: [1, 0.22, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/**
 * The divider, ticked at the quarter points. The ticks are what tie the
 * rule to the columns everything else is set on — without them it is just
 * a line, and the grid stays invisible in the wrong way.
 */
function GridRule() {
  return (
    <div className="relative h-px w-full" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: 'var(--hairline)' }}
      />
      {/* A short accent lead-in at the origin of the grid. */}
      <div
        className="absolute left-0 top-0 h-px w-10"
        style={{ background: 'var(--accent)', opacity: 0.7 }}
      />
      {[25, 50, 75].map((pct) => (
        <div
          key={pct}
          className="absolute top-0 hidden h-[5px] w-px md:block"
          style={{ left: `${pct}%`, background: 'var(--hairline)' }}
        />
      ))}
    </div>
  )
}

/**
 * Scroll cue. The rail is always drawn; the travelling segment is the only
 * animated part, so the cue still reads when nothing is moving.
 */
function ScrollCue({ reduce }) {
  return (
    <a
      href="#about"
      data-field-guard
      className="group flex shrink-0 items-center gap-3 transition-colors"
      style={{ color: 'rgba(244,244,245,0.60)' }}
    >
      <span
        className="font-mono text-[10.5px] uppercase leading-none transition-colors group-hover:text-[rgba(244,244,245,0.92)]"
        style={{ letterSpacing: '0.2em' }}
      >
        Scroll
      </span>
      <span
        aria-hidden="true"
        className="relative block h-7 w-px overflow-hidden"
        style={{ background: 'var(--hairline)' }}
      >
        <motion.span
          className="absolute left-0 top-0 block h-2.5 w-px"
          style={{ background: 'var(--accent)' }}
          animate={reduce ? undefined : { y: ['-100%', '280%'] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: [0.55, 0, 0.45, 1],
          }}
        />
      </span>
    </a>
  )
}

function NameLine({ children, delay = 0, reduce = false }) {
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
        initial={{ y: reduce ? '0%' : '110%' }}
        animate={{ y: '0%' }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {children}
      </motion.span>
    </span>
  )
}
