import { motion } from 'framer-motion'
import { projects } from '../data/content'

/**
 * Projects directory. Compact card grid that lets visitors see every
 * project at a glance and jump straight to the full case study, or
 * open the GitHub / live demo directly when available.
 *
 * This is the `#projects` view referenced by the navbar. Each card
 * also deep-links to the full project section via `#${project.id}`.
 */
const labels = {
  uniwise: 'RAG · EdTech',
  vision: 'Computer Vision',
  cloud: 'Client Platform',
  crime: 'Data Science',
  course: 'Spring Boot · MySQL',
}

export default function ProjectIndex() {
  return (
    <section
      id="projects"
      className="relative z-10 px-6 pt-4 pb-16 md:px-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <p className="eyebrow">Skip ahead</p>
          <h3 className="section-title mt-3 text-2xl font-semibold leading-tight md:text-3xl">
            Project directory
          </h3>
          <p className="mt-3 max-w-xl text-sm text-white/65">
            Short on time? Jump straight to the project you care about.
          </p>
        </motion.div>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className={
                p.comingSoon
                  ? 'flex h-full flex-col rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5'
                  : 'flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.06]'
              }
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-white/40">
                  {p.index}
                </span>
                {!p.comingSoon && (
                  <span
                    className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]"
                    style={{ color: 'var(--accent)' }}
                  >
                    {labels[p.id] || p.themeKey}
                  </span>
                )}
              </div>

              <h4
                className={`mt-3 font-display text-lg font-semibold leading-snug ${
                  p.comingSoon ? 'text-white/70' : 'text-white'
                }`}
              >
                {p.title}
              </h4>

              {p.status && (
                <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/70">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                  {p.status}
                </span>
              )}

              {!p.comingSoon && p.tagline && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/65">
                  {p.tagline}
                </p>
              )}

              {!p.comingSoon && p.stack?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {!p.comingSoon && (
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <a
                    href={`#${p.id}`}
                    aria-label={`View details for ${p.title}`}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:border-white/40 hover:bg-white/[0.05]"
                  >
                    View details →
                  </a>
                  {p.cta?.github && (
                    <a
                      href={p.cta.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${p.title} on GitHub`}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/75 transition hover:border-white/35 hover:text-white"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {!p.cta?.github && p.cta?.githubPrivate && (
                    <span
                      title={p.cta.githubPrivate.reason}
                      aria-label={`${p.title} repository is private`}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-white/50"
                    >
                      <span aria-hidden="true">🔒</span>
                      GitHub · Private
                    </span>
                  )}
                  {p.cta?.demo && (
                    <a
                      href={p.cta.demo}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${p.title} live demo`}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium transition"
                      style={{
                        borderColor: 'var(--accent)',
                        color: 'var(--accent)',
                      }}
                    >
                      Live demo ↗
                    </a>
                  )}
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
