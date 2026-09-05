import { motion } from 'framer-motion'

/**
 * Education credential band. Two institution cards with a monogram
 * mark, degree, dates, and classification. Deliberately restrained —
 * this is the block a recruiter scans for credibility, so it reads
 * clean rather than decorative.
 */
const institutions = [
  {
    mark: 'A',
    name: 'Aston University',
    location: 'Birmingham, UK',
    degree: 'MSc AI for Business Transformation',
    period: '2026 – present',
    status: 'In progress',
    accent: '#c8102e', // Aston red
    href: 'https://www.aston.ac.uk/study/courses/ai-business-transformation-msc',
  },
  {
    mark: 'L',
    name: 'University of Leicester',
    location: 'Leicester, UK',
    degree: 'BSc (Hons) Computer Science',
    period: '2023 – 2026',
    status: 'First Class Honours',
    accent: '#d5203d', // Leicester red
    href: 'https://le.ac.uk/',
  },
]

export default function Education() {
  return (
    <section id="education" className="relative px-6 py-24 md:px-16 md:py-32"
      style={{ background: 'rgba(244,244,245,0.060)' }}>
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Education</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              Where I studied.
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            2023 – present
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {institutions.map((inst, i) => (
            <motion.a
              key={inst.name}
              href={inst.href}
              target="_blank"
              rel="noreferrer"
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              className="group flex items-start gap-5 border p-6 transition-colors md:p-8"
              style={{
                borderColor: 'var(--hairline)',
                background: 'rgba(244,244,245,0.02)',
              }}
            >
              {/* Monogram mark */}
              <span
                className="serif flex h-14 w-14 shrink-0 items-center justify-center rounded-sm text-[26px] leading-none md:h-16 md:w-16 md:text-[30px]"
                style={{
                  background: inst.accent,
                  color: '#fff',
                }}
                aria-hidden="true"
              >
                {inst.mark}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className="serif text-[clamp(1.15rem,2vw,1.5rem)] leading-tight"
                    style={{ color: 'var(--ink)' }}
                  >
                    {inst.name}
                  </p>
                  <span
                    aria-hidden="true"
                    className="serif shrink-0 text-[1.1rem] leading-none opacity-30 transition-opacity group-hover:opacity-100"
                    style={{ color: 'var(--ink)' }}
                  >
                    ↗
                  </span>
                </div>

                <p
                  className="mt-2 text-[14.5px] leading-snug"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {inst.degree}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="mono-label" style={{ color: 'var(--muted)' }}>
                    {inst.period}
                  </span>
                  <span className="mono-label" style={{ color: 'var(--muted)' }}>
                    {inst.location}
                  </span>
                  <span
                    className="mono-label flex items-center gap-1.5"
                    style={{ color: inst.accent }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: inst.accent }}
                    />
                    {inst.status}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
