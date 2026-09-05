import { motion } from 'framer-motion'
import { projects } from '../data/content'

/**
 * Work index as an editorial list. Big serif project name per row,
 * small mono meta on the right, hairline dividers.
 *
 * `domain` and `year` come from the project object in content.js —
 * they used to live in local maps here that drifted out of sync with
 * the labels App.jsx passed to ProjectSection.
 */
export default function ProjectIndex() {
  return (
    <section id="work" className="relative px-6 py-24 md:px-16 md:py-32"
      style={{ background: 'rgba(244,244,245,0.045)' }}>
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Section header */}
        <motion.div
          initial={{ y: 12 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Selected work</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              Projects.
            </h2>
          </div>
          <p
            className="mono-label"
            style={{ color: 'var(--muted)' }}
          >
            {projects.length} · 2024–2026
          </p>
        </motion.div>

        {/* Rows */}
        <ul>
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProjectRow({ project, index }) {
  const isComing = project.comingSoon
  const isLinked = !isComing

  const inner = (
    <div className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-8 md:grid-cols-[4rem_1fr_10rem_5rem_2.5rem] md:gap-6 md:py-10">
      {/* Numeric index */}
      <span
        className="mono-label"
        style={{ color: 'var(--muted)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Big serif title */}
      <div className="col-span-1 md:col-span-1">
        <h3
          className="serif text-[clamp(1.5rem,3vw,2.4rem)] leading-[1] tracking-[-0.015em] transition-colors"
          style={{ color: 'var(--ink)' }}
        >
          {project.title}
        </h3>
        {isComing && (
          <p className="mono-label mt-2" style={{ color: 'var(--muted)' }}>
            Coming soon
          </p>
        )}
      </div>

      {/* Domain, year, arrow — desktop only */}
      <span
        className="mono-label hidden md:inline"
        style={{ color: 'var(--muted)' }}
      >
        {project.domain || '—'}
      </span>
      <span
        className="mono-label hidden md:inline"
        style={{ color: 'var(--muted)' }}
      >
        {project.year || '—'}
      </span>
      <span
        aria-hidden="true"
        className="serif hidden text-right text-[1.8rem] leading-none transition-transform md:inline"
        style={{
          color: isLinked ? 'var(--ink)' : 'var(--muted)',
        }}
      >
        {isLinked ? '→' : '·'}
      </span>
    </div>
  )

  return (
    <motion.li
      initial={{ y: 40 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: 'easeOut' }}
      className="group border-b"
      style={{ borderColor: 'var(--hairline)' }}
    >
      {isLinked ? (
        <a
          href={`#${project.id}`}
          aria-label={`Jump to ${project.title}`}
          className="block transition-colors hover:bg-[rgba(26,24,20,0.03)]"
        >
          {inner}
        </a>
      ) : (
        <div className="block opacity-70">{inner}</div>
      )}
    </motion.li>
  )
}
