import { motion } from 'framer-motion'
import { timeline } from '../data/content'

/**
 * One chronological timeline covering study and work together — these
 * used to be two separate sections (Experience + Education), which
 * split a single story in half.
 *
 * Education entries carry an institution monogram, a classification,
 * and a link out. Work entries use the same row shape without them.
 *
 * This is the one inverted section on the page. The light band breaks the
 * run of dark sections and sets up the colour of the project sections
 * that follow. Its tokens are redefined locally so everything inside
 * reads ink-on-paper without disturbing the global palette.
 */
export default function Experience() {
  return (
    <section
      id="experience"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{
        background: '#F2EFE8',
        '--ink': '#12100D',
        '--ink-soft': 'rgba(18,16,13,0.74)',
        '--muted': 'rgba(18,16,13,0.52)',
        '--hairline': 'rgba(18,16,13,0.14)',
        '--accent': '#B8330F',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Experience &amp; Education</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              Timeline<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            2023 – present
          </p>
        </div>

        <ol>
          {timeline.map((t, i) => (
            <motion.li
              key={t.title}
              initial={{ y: 12 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: 'easeOut' }}
              className="border-b"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <TimelineRow entry={t} />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function TimelineRow({ entry: t }) {
  const isEducation = t.kind === 'education'

  const inner = (
    <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[9rem_3.5rem_1fr] md:gap-8">
      {/* Year */}
      <span className="mono-label pt-1" style={{ color: 'var(--muted)' }}>
        {t.year}
      </span>

      {/* Institution monogram — education entries only */}
      <span className="hidden md:block">
        {isEducation && (
          <span
            className="serif flex h-11 w-11 items-center justify-center rounded-sm text-[20px] leading-none"
            style={{ background: t.accent, color: '#fff' }}
            aria-hidden="true"
          >
            {t.monogram}
          </span>
        )}
      </span>

      {/* Body */}
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="serif text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight"
            style={{ color: 'var(--ink)' }}
          >
            {t.title}
          </h3>
          {t.href && (
            <span
              aria-hidden="true"
              className="serif shrink-0 text-[1.05rem] leading-none opacity-30 transition-opacity group-hover:opacity-100"
              style={{ color: 'var(--ink)' }}
            >
              ↗
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="mono-label" style={{ color: 'var(--muted)' }}>
            {t.org}
          </span>
          {t.status && (
            <span
              className="mono-label flex items-center gap-1.5"
              style={{ color: t.accent || 'var(--accent)' }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: t.accent || 'var(--accent)' }}
              />
              {t.status}
            </span>
          )}
        </div>

        <p
          className="mt-4 max-w-3xl text-[15px] leading-relaxed"
          style={{ color: 'var(--ink-soft)' }}
        >
          {t.body}
        </p>
      </div>
    </div>
  )

  if (!t.href) return <div className="group">{inner}</div>

  return (
    <a
      href={t.href}
      target="_blank"
      rel="noreferrer"
      className="group block transition-colors hover:bg-[rgba(18,16,13,0.035)]"
    >
      {inner}
    </a>
  )
}
