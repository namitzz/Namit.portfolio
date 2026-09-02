import { motion } from 'framer-motion'
import { skills } from '../data/content'

/**
 * Editorial skills list. Group name in mono uppercase, items as a
 * dot-separated stream in sans. No cards, no icons, hairline dividers.
 */
export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1400px]">
        <div
          className="mb-16 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <p className="eyebrow">Skills</p>
          <h2
            className="serif mt-3 text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ color: 'var(--ink)' }}
          >
            The toolbox.
          </h2>
        </div>

        <ol>
          {skills.map((s, i) => (
            <motion.li
              key={s.group}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-b py-5 md:grid-cols-[3rem_14rem_1fr] md:gap-8"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <span
                className="mono-label"
                style={{ color: 'var(--muted)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <p
                className="mono-label"
                style={{ color: 'var(--ink)' }}
              >
                {s.group}
              </p>

              <p
                className="col-span-2 text-[15.5px] leading-relaxed md:col-span-1"
                style={{ color: 'var(--ink-soft)' }}
              >
                {s.items.map((it, idx) => (
                  <span key={it}>
                    <span className="whitespace-nowrap">{it}</span>
                    {idx < s.items.length - 1 && (
                      <span
                        className="mx-2"
                        style={{ color: 'var(--muted)' }}
                      >
                        ·
                      </span>
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
