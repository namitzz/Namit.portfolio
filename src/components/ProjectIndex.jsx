import { motion } from 'framer-motion'
import { useState } from 'react'
import { projects } from '../data/content'

/**
 * Work index as a table. Each row is a project: index, name, domain,
 * year, status, link glyph. Hover expands a row to reveal tagline +
 * stack + CTAs inline. Nothing rounded, no glass, hairline dividers.
 */
const domains = {
  uniwise: 'RAG · EdTech',
  vision: 'Computer Vision',
  cloud: 'Client site',
  crime: 'Data science',
  course: 'Backend · MySQL',
  agentforge: 'Agent orchestration',
}

const years = {
  uniwise: '2026',
  vision: '2025',
  cloud: '2025',
  crime: '2024',
  course: '2024',
  agentforge: '—',
}

const statusMap = {
  uniwise: 'dissertation',
  vision: 'prototype',
  cloud: 'shipped',
  crime: 'coursework',
  course: 'group work',
  agentforge: 'coming soon',
}

export default function ProjectIndex() {
  return (
    <section id="work" className="relative px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4"
        >
          <div className="flex items-baseline gap-4">
            <span className="mono-label">§01</span>
            <h2 className="section-title text-2xl text-white md:text-3xl">
              work
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            {projects.length} entries · hover to expand
          </p>
        </motion.div>

        {/* Column headers */}
        <div className="hidden grid-cols-[3rem_1fr_10rem_5rem_9rem_2rem] items-center gap-4 border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 md:grid">
          <span>idx</span>
          <span>name</span>
          <span>domain</span>
          <span>year</span>
          <span>status</span>
          <span className="text-right">→</span>
        </div>

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
  const [open, setOpen] = useState(false)
  const isComing = project.comingSoon
  const isLinked = !isComing

  const rowContent = (
    <div className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-4 md:grid-cols-[3rem_1fr_10rem_5rem_9rem_2rem]">
      <span className="font-mono text-[12px] text-white/40 group-hover:text-white/70">
        {project.index}
      </span>

      <span className="flex items-baseline gap-3">
        <span className="text-[17px] text-white group-hover:text-white md:text-[19px]">
          {project.title}
        </span>
        {isComing && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
            soon
          </span>
        )}
      </span>

      <span className="hidden font-mono text-[12px] text-white/50 md:inline">
        {domains[project.id] || '—'}
      </span>
      <span className="hidden font-mono text-[12px] text-white/50 md:inline">
        {years[project.id] || '—'}
      </span>
      <span className="hidden font-mono text-[12px] text-white/50 md:inline">
        {statusMap[project.id] || '—'}
      </span>
      <span
        className={`hidden text-right font-mono text-[14px] md:inline ${
          isLinked ? 'text-white/40 group-hover:text-white' : 'text-white/20'
        }`}
        aria-hidden="true"
      >
        {isLinked ? '→' : '·'}
      </span>
    </div>
  )

  return (
    <li
      className="group border-b border-white/[0.07]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {isLinked ? (
        <a
          href={`#${project.id}`}
          aria-label={`Jump to ${project.title}`}
          className="block cursor-pointer transition-colors hover:bg-white/[0.02]"
        >
          {rowContent}
        </a>
      ) : (
        <div className="block">{rowContent}</div>
      )}

      {/* Inline hover panel */}
      <motion.div
        initial={false}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 gap-4 pb-5 pl-12 pr-4 md:grid-cols-[1fr_auto]">
          {project.tagline && (
            <p className="max-w-2xl text-[13.5px] leading-relaxed text-white/60">
              {project.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {project.cta?.github && (
              <a
                href={project.cta.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/55 underline decoration-white/20 underline-offset-[4px] transition-colors hover:text-white hover:decoration-white"
              >
                github ↗
              </a>
            )}
            {project.cta?.githubPrivate && (
              <span
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40"
                title={project.cta.githubPrivate.reason}
              >
                repo · private
              </span>
            )}
            {project.cta?.demo && (
              <a
                href={project.cta.demo}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-[11px] uppercase tracking-[0.12em] underline decoration-white/20 underline-offset-[4px] transition-colors hover:decoration-white"
                style={{ color: 'var(--accent)' }}
              >
                live ↗
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </li>
  )
}
