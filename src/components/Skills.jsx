import { motion } from 'framer-motion'
import { skills } from '../data/content'

/**
 * Skills as a bento grid of catalogue cards — haiman FRAME 2025-style.
 * Each group is a numbered card: index, group name, and its items as
 * mono chips. Layers a subtle ghost-outlined number for depth.
 */
export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-16 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Skills</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              What I work with.
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            {skills.length} groups
          </p>
        </div>

        {/* Bento grid — haiman-style FRAME cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <motion.article
              key={s.group}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: 'easeOut' }}
              className="group relative flex h-full flex-col overflow-hidden border p-6 transition-colors md:p-7"
              style={{
                borderColor: 'var(--hairline)',
                background: 'rgba(244,244,245,0.02)',
              }}
            >
              {/* Big ghost index in the corner */}
              <span
                className="serif text-outline-strong pointer-events-none absolute -top-2 -right-2 select-none leading-none tracking-[-0.04em]"
                style={{
                  fontSize: 'clamp(4rem, 8vw, 6rem)',
                }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Top strip: reel number + arrow */}
              <div className="mb-6 flex items-baseline justify-between">
                <span
                  className="mono-label"
                  style={{ color: 'var(--muted)' }}
                >
                  Frame {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className="serif text-[1.1rem] leading-none opacity-30 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: 'var(--ink)' }}
                >
                  ✦
                </span>
              </div>

              {/* Group name */}
              <h3
                className="serif text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.05] tracking-[-0.015em]"
                style={{ color: 'var(--ink)' }}
              >
                {s.group}
              </h3>

              {/* Items as mono chips */}
              <div className="mt-6 flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-sm border px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em]"
                    style={{
                      borderColor: 'var(--hairline)',
                      color: 'var(--ink-soft)',
                    }}
                  >
                    {it}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
