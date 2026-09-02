import { motion } from 'framer-motion'
import { timeline } from '../data/content'

/**
 * Timeline as an editorial spread. Year on the left, entry on the
 * right, hairline dividers, no chrome. Warm cream ground.
 */
export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <div
          className="mb-16 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <p className="eyebrow">Experience &amp; Education</p>
          <h2
            className="serif mt-3 text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ color: 'var(--ink)' }}
          >
            A short timeline.
          </h2>
        </div>

        <ol>
          {timeline.map((t, i) => (
            <motion.li
              key={t.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="grid grid-cols-1 gap-3 border-b py-8 md:grid-cols-[10rem_1fr] md:gap-10"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <span
                className="mono-label"
                style={{ color: 'var(--muted)' }}
              >
                {t.year}
              </span>

              <div>
                <h3
                  className="serif text-[clamp(1.5rem,3vw,2.2rem)] leading-tight"
                  style={{ color: 'var(--ink)' }}
                >
                  {t.title}
                </h3>
                <p
                  className="mono-label mt-2"
                  style={{ color: 'var(--accent)' }}
                >
                  {t.org}
                </p>
                <p
                  className="mt-4 max-w-3xl text-[15.5px] leading-relaxed"
                  style={{ color: 'var(--ink-soft)' }}
                >
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
