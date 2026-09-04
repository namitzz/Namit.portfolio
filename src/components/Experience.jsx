import { motion } from 'framer-motion'
import { timeline } from '../data/content'

/**
 * Timeline as a karlie-style press-card grid. Each entry is a card
 * with a small tag/date, a large title, an org line, and body text.
 * Two columns on desktop, one on mobile.
 * The only karlie borrow in the whole site.
 */
export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Experience</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              Timeline.
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            {timeline.length} entries
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {timeline.map((t, i) => (
            <motion.article
              key={t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: 'easeOut' }}
              className="group relative flex h-full flex-col border p-6 transition-colors md:p-8"
              style={{
                borderColor: 'var(--hairline)',
                background: 'rgba(244,244,245,0.02)',
              }}
            >
              {/* Top row: year tag + expand arrow */}
              <div className="mb-6 flex items-baseline justify-between">
                <span
                  className="mono-label"
                  style={{ color: 'var(--accent)' }}
                >
                  {t.year}
                </span>
                <span
                  aria-hidden="true"
                  className="serif text-[1.4rem] leading-none opacity-30 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: 'var(--ink)' }}
                >
                  +
                </span>
              </div>

              {/* Title */}
              <h3
                className="serif text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.05] tracking-[-0.015em]"
                style={{ color: 'var(--ink)' }}
              >
                {t.title}
              </h3>

              {/* Org */}
              <p
                className="mt-3 text-[13px]"
                style={{ color: 'var(--muted)' }}
              >
                {t.org}
              </p>

              {/* Body */}
              <p
                className="mt-5 text-[14.5px] leading-relaxed"
                style={{ color: 'var(--ink-soft)' }}
              >
                {t.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
