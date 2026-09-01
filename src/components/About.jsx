import { motion } from 'framer-motion'
import { profile, writing } from '../data/content'

export default function About() {
  return (
    <section id="about" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto grid w-full max-w-6xl gap-14 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="md:col-span-4"
        >
          <p className="eyebrow">About</p>
          <motion.h2
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="section-title mt-3 text-3xl md:text-4xl"
          >
            A short, honest version.
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="md:col-span-8"
        >
          <div className="space-y-5 text-lg leading-relaxed text-white/80">
            {profile.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              'Applied AI',
              'Machine learning',
              'RAG systems',
              'Backend / APIs',
              'Full-stack',
              'Computer vision',
              'Data science',
              'Product-quality UX',
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70"
              >
                {t}
              </span>
            ))}
          </div>

          {profile.positioning && (
            <p className="mt-8 text-sm text-white/55">
              {profile.positioning}
            </p>
          )}

          {profile.highlights?.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <p className="eyebrow">Selected highlights</p>
              <ul className="mt-3 space-y-2">
                {profile.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-3 text-sm leading-relaxed text-white/80"
                  >
                    <span
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {writing?.[0] && (
            <p className="mt-6 text-sm text-white/55">
              Published:{' '}
              <a
                href={writing[0].url}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
                style={{ color: 'var(--accent)' }}
              >
                {writing[0].publisher} · {writing[0].title}
              </a>{' '}
              ({writing[0].role})
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
