import { motion } from 'framer-motion'
import { projects } from '../data/content'

/**
 * Compact card grid that lets visitors jump straight to a specific
 * project section without scrolling through every full case study.
 *
 * Each card is a single anchor (whole-card link) for accessibility and
 * to avoid nested interactive elements. The deep-link target is the
 * existing project section `id` (e.g. `#uniwise`).
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
      id="project-index"
      className="relative z-10 px-6 pt-4 pb-16 md:px-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <p className="eyebrow">Project index</p>
          <h3 className="section-title mt-3 text-2xl font-semibold leading-tight md:text-3xl">
            Jump straight to a project
          </h3>
          <p className="mt-3 max-w-xl text-sm text-white/65">
            A quick overview if you want to skip straight to a specific build.
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
              className="h-full"
            >
              <a
                href={`#${p.id}`}
                aria-label={`View ${p.title}`}
                className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04] focus:outline-none focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/20"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-white/40">
                      {p.index}
                    </span>
                    <span
                      className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors group-hover:border-white/25"
                      style={{ color: 'var(--accent)' }}
                    >
                      {labels[p.id] || p.themeKey}
                    </span>
                  </div>

                  <h4 className="mt-3 font-display text-lg font-semibold leading-snug text-white">
                    {p.title}
                  </h4>

                  {p.status && (
                    <span
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/70"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: 'var(--accent)' }}
                      />
                      {p.status}
                    </span>
                  )}

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/65">
                    {p.tagline}
                  </p>
                </div>

                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white/55 transition-colors group-hover:text-white"
                  aria-hidden="true"
                >
                  View project
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
