import { motion, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

/**
 * Conqr-style dramatic project section.
 *
 * Structure: full-viewport "picture" reveal (the mockup as the anchor,
 * subtly parallaxed and scaled with scroll), then a wide editorial
 * narrative row below. Bouncy v-labs-style spring reveals on entry.
 *
 * Pushes its `themeKey` up to the parent when scrolled into view.
 */
export default function ProjectSection({ project, onActivate, mockup }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.35, margin: '-10% 0px -10% 0px' })

  useEffect(() => {
    if (inView) onActivate?.(project.themeKey)
  }, [inView, project.themeKey, onActivate])

  return (
    <section
      id={project.id}
      ref={ref}
      className="relative z-10 py-14 md:py-20"
    >
      {/* Full-viewport picture: the mockup takes the stage first. */}
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center px-6 md:px-16">
        {/* Small header strip above the mockup */}
        <motion.div
          initial={{ y: 12 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8 flex w-full flex-wrap items-center justify-between gap-3 border-b pb-4"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
              {project.index}
            </span>
            <span
              className="serif text-[clamp(1.4rem,2.4vw,2rem)] leading-none"
              style={{ color: '#fff' }}
            >
              {project.title}
            </span>
            {/* Status now sits inline here rather than as its own row */}
            {project.status && (
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: 'var(--accent)' }}
              >
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
                {project.status}
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            {project.domain || project.themeKey}
          </span>
        </motion.div>

        {/* Mockup. Note: these have intrinsic heights and reflow taller
            when narrowed, so constraining width makes them *bigger*.
            Left full-width deliberately. */}
        <motion.div
          initial={{ y: 16 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative w-full"
        >
          {mockup}
        </motion.div>

      </div>

      {/* Wide editorial narrative row below the mockup */}
      <div className="mx-auto mt-10 grid w-full max-w-[1600px] gap-12 px-6 md:mt-12 md:grid-cols-12 md:gap-12 md:px-16">
        {/* Left: tagline + narrative */}
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7 }}
          className="md:col-span-7"
        >
          <p
            className="serif text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.15] tracking-[-0.015em]"
            style={{ color: '#fff' }}
          >
            {project.tagline}
          </p>

          {/* Problem + Solution merged into one Context block —
              they read as a single idea and cost two headings before. */}
          <div className="mt-10">
            <Block label="Context">
              <>
                {project.problem}{' '}
                <span className="text-white/90">{project.solution}</span>
              </>
            </Block>
          </div>

          <div className="mt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
              Key features
            </p>
            <ul className="mt-4 space-y-2.5">
              {project.features.slice(0, 4).map((f) => (
                <li key={f} className="flex gap-3 text-[15px] text-white/80">
                  <span
                    className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <Block label="What I learned">{project.impact}</Block>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            {project.cta.github && (
              <ProjectLink href={project.cta.github} external>
                GitHub
              </ProjectLink>
            )}
            {!project.cta.github && project.cta.githubPrivate && (
              <PrivateRepoNote reason={project.cta.githubPrivate.reason} />
            )}
            {project.cta.demo && (
              <ProjectLink href={project.cta.demo} external accent>
                Live demo
              </ProjectLink>
            )}
          </div>
        </motion.div>

        {/* Right: tech stack sidebar */}
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="md:col-span-5"
        >
          <div
            className="md:sticky md:top-32 md:border-l md:pl-10"
            style={{ borderColor: 'rgba(255,255,255,0.10)' }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
              Tech stack
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="cursor-default rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[12px] text-white/75 transition-colors hover:border-white/30 hover:text-white"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Block({ label, children }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-white/70">
        {children}
      </p>
    </div>
  )
}

/**
 * Small inline project link. Replaces the old oversized pill buttons —
 * reads as editorial text with a hairline underline, not a CTA slab.
 */
function ProjectLink({ href, children, external, accent }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group inline-flex items-center gap-1.5 border-b pb-0.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors"
      style={{
        color: accent ? 'var(--accent)' : 'rgba(255,255,255,0.85)',
        borderColor: accent ? 'var(--accent)' : 'rgba(255,255,255,0.25)',
      }}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-0.5"
      >
        {external ? '↗' : '→'}
      </span>
    </a>
  )
}

/** Inline "repo is private" affordance, sized to match ProjectLink. */
function PrivateRepoNote({ reason }) {
  return (
    <details className="group inline-block">
      <summary
        className="inline-flex cursor-pointer list-none items-center gap-1.5 border-b pb-0.5 font-mono text-[12px] uppercase tracking-[0.1em] text-white/55 transition-colors hover:text-white/80"
        style={{ borderColor: 'rgba(255,255,255,0.18)' }}
      >
        <LockIcon />
        Repo private
        <span
          className="text-white/35 transition group-open:hidden"
          aria-hidden="true"
        >
          (why?)
        </span>
      </summary>
      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-white/60">
        {reason}
      </p>
    </details>
  )
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  )
}
