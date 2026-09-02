import { motion } from 'framer-motion'
import { skills } from '../data/content'

/**
 * Skills as a plain-list index. No icons, no cards, no hover sheens.
 * Each group is a numbered row: group name in mono, items as an
 * inline dot-separated stream.
 */
export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-baseline gap-4">
            <span className="mono-label">§03</span>
            <h2 className="section-title text-2xl text-white md:text-3xl">
              skills
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            {skills.length} groups
          </p>
        </div>

        <ol className="mt-10">
          {skills.map((s, i) => (
            <motion.li
              key={s.group}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/[0.07] py-5 md:grid-cols-[3rem_14rem_1fr] md:gap-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
                {String(i + 1).padStart(2, '0')}
              </span>

              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/85">
                {s.group}
              </p>

              <p className="col-span-2 text-[14.5px] leading-relaxed text-white/60 md:col-span-1">
                {s.items.map((it, idx) => (
                  <span key={it}>
                    <span className="whitespace-nowrap">{it}</span>
                    {idx < s.items.length - 1 && (
                      <span className="mx-2 text-white/25">·</span>
                    )}
                  </span>
                ))}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
