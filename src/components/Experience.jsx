import { motion } from 'framer-motion'
import { timeline } from '../data/content'

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <p className="eyebrow">Experience & Education</p>
        <h2 className="section-title mt-3 text-3xl md:text-4xl">
          A short timeline.
        </h2>

        <ol className="relative mt-12 border-l border-white/10 pl-8">
          {timeline.map((t, i) => (
            <motion.li
              key={t.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="relative mb-10 last:mb-0"
            >
              <span
                className="absolute -left-[37px] top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: 'var(--accent)',
                  background: 'rgba(0,0,0,0.6)',
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              </span>

              <p className="font-mono text-xs text-white/45">{t.year}</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-white">
                {t.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--accent)' }}>
                {t.org}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                {t.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
