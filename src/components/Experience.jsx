import { motion } from 'framer-motion'
import { timeline } from '../data/content'

/**
 * Experience as a timeline table. Year on the left, entry on the right,
 * hairline dividers, no chrome.
 */
export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-baseline gap-4">
            <span className="mono-label">§04</span>
            <h2 className="section-title text-2xl text-white md:text-3xl">
              experience &amp; education
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            {timeline.length} entries
          </p>
        </div>

        <ol className="mt-10">
          {timeline.map((t, i) => (
            <motion.li
              key={t.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="grid grid-cols-1 gap-3 border-b border-white/[0.07] py-6 md:grid-cols-[10rem_1fr] md:gap-8"
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/40">
                {t.year}
              </span>

              <div>
                <h3 className="text-[18px] text-white">{t.title}</h3>
                <p
                  className="mt-0.5 font-mono text-[12px] uppercase tracking-[0.12em]"
                  style={{ color: 'var(--accent)' }}
                >
                  {t.org}
                </p>
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-white/60">
                  {t.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
