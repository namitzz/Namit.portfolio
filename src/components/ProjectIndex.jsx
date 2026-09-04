import { motion } from 'framer-motion'
import { projects } from '../data/content'

/**
 * Work index as an editorial list. Big serif project name per row,
 * small mono meta on the right, hairline dividers, huge line-height.
 * On hover the row's accent underline extends and the arrow slides.
 * Reference: karliekloss.com item rows scaled up.
 */
const domains = {
  uniwise: 'RAG · EdTech',
  vision: 'Computer Vision',
  cloud: 'Client site',
  crime: 'Data Science',
  course: 'Backend · MySQL',
  tovo: 'React · Supabase',
  agentforge: 'Agent orchestration',
}

const years = {
  uniwise: '2026',
  vision: '2025',
  cloud: '2025',
  crime: '2024',
  course: '2024',
  tovo: '2026',
  agentforge: '—',
}

export default function ProjectIndex() {
  return (
    <section id="work" className="relative px-6 py-40 md:px-20 md:py-56">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Reel 01 · Selected work</p>
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
        {domains[project.id] || '—'}
      </span>
      <span
        className="mono-label hidden md:inline"
        style={{ color: 'var(--muted)' }}
      >
        {years[project.id] || '—'}
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        type: 'spring',
        bounce: 0.28,
      }}
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
