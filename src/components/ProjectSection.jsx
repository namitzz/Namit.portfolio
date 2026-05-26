import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef } from 'react'
import ProjectBanner from './ProjectBanner'

/**
 * Full-height project section.
 *
 * Left column: thematic banner + narrative.
 * Right column: sticky JSX mockup with mouse-tilt parallax.
 *
 * Pushes its `themeKey` up to the parent when scrolled into view.
 */
export default function ProjectSection({ project, onActivate, mockup, accentLabel }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.45, margin: '-10% 0px -10% 0px' })

  useEffect(() => {
    if (inView) onActivate?.(project.themeKey)
  }, [inView, project.themeKey, onActivate])

  return (
    <section id={project.id} ref={ref} className="relative z-10 px-6 py-24 md:px-12">
      <div className="mx-auto grid w-full max-w-7xl gap-14 md:grid-cols-12 md:gap-10 lg:gap-16">
        {/* Narrative column */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="md:col-span-5"
        >
          {/* Thematic banner */}
          <ProjectBanner themeKey={project.themeKey} />

          <div className="mt-6 flex items-center gap-3">
            <span className="font-mono text-xs text-white/40">{project.index}</span>
            <span className="h-px flex-1 bg-white/10" />
            <span
              className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]"
              style={{ color: 'var(--accent)' }}
            >
              {accentLabel || project.themeKey}
            </span>
          </div>

          <h3 className="section-title mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            {project.title}
          </h3>
          {project.status && (
            <span
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em]"
              style={{
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
              {project.status}
            </span>
          )}
          <p className="mt-3 text-lg text-white/70">{project.tagline}</p>

          <div className="mt-8 space-y-6">
            <Block label="Problem" body={project.problem} />
            <Block label="Solution" body={project.solution} />

            <div>
              <p className="eyebrow">Tech stack</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <motion.span
                    key={s}
                    whileHover={{ y: -1, scale: 1.03 }}
                    className="cursor-default rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/75 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">Key features</p>
              <ul className="mt-3 space-y-2">
                {project.features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="flex gap-3 text-sm text-white/80"
                  >
                    <span
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                    <span>{f}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <Block label="Impact / what I learned" body={project.impact} />
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
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
                GitHub
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
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* Sticky mockup column with mouse-tilt */}
        <div className="md:col-span-7">
          <div className="md:sticky md:top-28">
            <TiltMockup>{mockup}</TiltMockup>
          </div>
        </div>
      </div>
    </section>
  )
}

function Block({ label, body }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-white/75">{body}</p>
    </div>
  )
}

/**
 * Inline "Private" affordance for a GitHub repo that exists but is not
 * publicly accessible. Uses a native <details> element so it is keyboard
 * accessible, works on mobile (tap to expand), and needs no JS state.
 *
 * Drop-in: set `cta.githubPrivate = { reason: '...' }` on a project in
 * content.js, leave `cta.github` as null, and this renders automatically.
 */
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

/** Subtle 3D mouse-tilt around the project mockup. */
function TiltMockup({ children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], ['4deg', '-4deg']), {
    stiffness: 180,
    damping: 20,
  })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], ['-4deg', '4deg']), {
    stiffness: 180,
    damping: 20,
  })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
      }}
    >
      {children}
    </motion.div>
  )
}
