import { motion } from 'framer-motion'
import { profile } from '../data/content'

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
          <h2 className="section-title mt-3 text-3xl md:text-4xl">
            A short, honest version.
          </h2>
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
              'RAG systems',
              'Education technology',
              'Computer vision',
              'Data science',
              'UX',
              'Digital transformation',
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
