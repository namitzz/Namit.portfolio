import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion'
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
export default function ProjectSection({ project, onActivate, mockup, accentLabel }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.35, margin: '-10% 0px -10% 0px' })

  useEffect(() => {
    if (inView) onActivate?.(project.themeKey)
  }, [inView, project.themeKey, onActivate])

  // Scroll-linked parallax on the mockup (conqr scroll method).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const mockupY = useTransform(scrollYProgress, [0, 1], ['4%', '-6%'])
  const mockupScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98])

  return (
    <section
      id={project.id}
      ref={ref}
      className="relative z-10 py-28 md:py-36"
    >
      {/* Full-viewport picture: the mockup takes the stage first. */}
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center px-6 md:px-16">
        {/* Small header strip above the mockup */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8 flex w-full flex-wrap items-center justify-between gap-3 border-b pb-4"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
              {project.index}
            </span>
            <span
              className="serif text-[clamp(1.4rem,2.4vw,2rem)] leading-none"
              style={{ color: '#fff' }}
            >
              {project.title}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            {accentLabel || project.themeKey}
          </span>
        </motion.div>

        {/* Mockup — the dramatic picture reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
            type: 'spring',
            bounce: 0.18,
          }}
          className="relative w-full"
          style={{
            y: mockupY,
            scale: mockupScale,
            willChange: 'transform',
          }}
        >
          {mockup}
        </motion.div>

        {/* Status pill */}
        {project.status && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em]"
            style={{
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
            {project.status}
          </motion.span>
        )}
      </div>

      {/* Wide editorial narrative row below the mockup */}
      <div className="mx-auto mt-24 grid w-full max-w-[1600px] gap-12 px-6 md:mt-32 md:grid-cols-12 md:gap-12 md:px-16">
        {/* Left: tagline + narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="md:col-span-7"
        >
          <p
            className="serif text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.15] tracking-[-0.015em]"
            style={{ color: '#fff' }}
          >
            {project.tagline}
          </p>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
            <Block label="Problem" body={project.problem} />
            <Block label="Solution" body={project.solution} />
          </div>

          <div className="mt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
              Key features
            </p>
            <ul className="mt-4 space-y-2.5">
              {project.features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="flex gap-3 text-[15px] text-white/80"
                >
                  <span
                    className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                  <span>{f}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <Block label="Impact / what I learned" body={project.impact} />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {project.cta.caseStudy && (
              <a href={project.cta.caseStudy} className="btn-primary">
                View Case Study →
              </a>
            )}
            {project.cta.github && (
              <a
                href={project.cta.github}
                className="btn-ghost"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            )}
            {!project.cta.github && project.cta.githubPrivate && (
              <PrivateRepoNote reason={project.cta.githubPrivate.reason} />
            )}
            {project.cta.demo && (
              <a
                href={project.cta.demo}
                className="btn-ghost"
                target="_blank"
                rel="noreferrer"
              >
                Live Demo ↗
              </a>
            )}
          </div>
        </motion.div>

        {/* Right: tech stack sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
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
              {project.stack.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.03,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                  whileHover={{ y: -2 }}
                  className="cursor-default rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[12px] text-white/75 transition-colors hover:border-white/30 hover:text-white"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Block({ label, body }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <p className="mt-3 text-[15.5px] leading-relaxed text-white/80">{body}</p>
    </div>
  )
}

function PrivateRepoNote({ reason }) {
  return (
    <details className="group rounded-full border border-white/15 bg-white/[0.03] open:rounded-2xl open:bg-white/[0.04] open:px-4 open:py-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition group-open:px-0 group-open:py-0 hover:text-white">
        <LockIcon />
        GitHub · Private
        <span
          className="text-[11px] text-white/45 transition group-open:hidden"
          aria-hidden="true"
        >
          (why?)
        </span>
      </summary>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{reason}</p>
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
