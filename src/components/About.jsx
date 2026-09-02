import { motion } from 'framer-motion'
import { profile, writing } from '../data/content'

/**
 * About as a spec document. Left column: numbered marker, section
 * title, tag list. Right column: body copy and highlights table.
 * No cards, no glass; hairline dividers only.
 */
export default function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <SectionHeader index="§02" label="about" hint="a short, honest version" />

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          {/* Left column: identity + tags */}
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
              Direction
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              {profile.positioning}
            </p>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {[
                'AI integration',
                'RAG systems',
                'Backend / APIs',
                'Full-stack',
                'ML',
                'Computer vision',
                'Data science',
              ].map((t) => (
                <span
                  key={t}
                  className="border border-white/10 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/65"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right column: body + highlights */}
          <div className="md:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="space-y-5 text-[17px] leading-relaxed text-white/80"
            >
              {profile.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            {profile.highlights?.length > 0 && (
              <div className="mt-12">
                <p className="mono-label mb-4">§02.1 · selected highlights</p>
                <ol className="border-t border-white/10">
                  {profile.highlights.map((h, i) => (
                    <li
                      key={h}
                      className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/10 py-3.5 text-[14.5px] leading-snug text-white/75"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {writing?.[0] && (
              <p className="mt-8 font-mono text-[12px] text-white/50">
                <span className="text-white/30">&gt;</span>{' '}
                <span className="text-white/40">published:</span>{' '}
                <a
                  href={writing[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/20 underline-offset-[4px] transition-colors hover:decoration-white"
                  style={{ color: 'var(--accent)' }}
                >
                  {writing[0].publisher} · {writing[0].title} ↗
                </a>{' '}
                <span className="text-white/40">({writing[0].role})</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Numbered spec-style section header, used in About and mirrored in
 * Skills / Experience / Contact for a unified look.
 */
function SectionHeader({ index, label, hint }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
      <div className="flex items-baseline gap-4">
        <span className="mono-label">{index}</span>
        <h2 className="section-title text-2xl text-white md:text-3xl">
          {label}
        </h2>
      </div>
      {hint && (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
          {hint}
        </p>
      )}
    </div>
  )
}
