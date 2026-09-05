import { motion } from 'framer-motion'
import { writing } from '../data/content'

/**
 * Writing section. Gives published work its own proper spread rather
 * than burying it as a one-line link inside About. Each entry is a
 * wide editorial row: role + publisher meta, big serif title, summary,
 * tags, and a read link.
 */
export default function Writing() {
  if (!writing?.length) return null

  return (
    <section
      id="writing"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{ background: 'rgba(244,244,245,0.055)' }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-14 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Writing</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              Published work.
            </h2>
          </div>
        </div>

        {writing.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ y: 16 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-8 border-b py-10 md:grid-cols-12 md:gap-12"
            style={{ borderColor: 'var(--hairline)' }}
          >
            {/* Left: meta */}
            <div className="md:col-span-4">
              <p className="mono-label" style={{ color: 'var(--accent)' }}>
                {item.publisher}
              </p>
              <p className="mono-label mt-2" style={{ color: 'var(--muted)' }}>
                {item.role}
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {item.tags?.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em]"
                    style={{
                      borderColor: 'var(--hairline)',
                      color: 'var(--ink-soft)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: title + body + link */}
            <div className="md:col-span-8">
              <h3
                className="serif text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.015em]"
                style={{ color: 'var(--ink)' }}
              >
                {item.title}
              </h3>

              <p
                className="mt-5 max-w-3xl text-[16px] leading-relaxed"
                style={{ color: 'var(--ink-soft)' }}
              >
                {item.summary}
              </p>

              {item.description && (
                <p
                  className="mt-4 max-w-3xl text-[14.5px] leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.description}
                </p>
              )}

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-center gap-2 border-b pb-1 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors"
                style={{
                  color: 'var(--accent)',
                  borderColor: 'var(--accent)',
                }}
              >
                Read the guide
                <span className="transition-transform group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
