import { motion } from 'framer-motion'
import { profile, writing } from '../data/content'

/**
 * About as a two-column editorial spread. Left column: eyebrow + big
 * serif title + tags. Right column: paragraphs + highlights list.
 * No cards, warm cream ground, hairline dividers.
 */
export default function About() {
  return (
    <section id="about" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-16 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <p className="eyebrow">About</p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="serif mt-3 text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ color: 'var(--ink)' }}
          >
            A short, honest version.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Left column: direction + tags */}
          <div className="md:col-span-4">
            <p className="mono-label" style={{ color: 'var(--muted)' }}>
              Direction
            </p>
            <p
              className="mt-3 text-[15px] leading-relaxed"
              style={{ color: 'var(--ink-soft)' }}
            >
              {profile.positioning}
            </p>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {[
                'AI integration',
                'RAG systems',
                'Backend / APIs',
                'Full-stack',
                'ML',
                'Computer vision',
                'Data science',
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-3 py-1 text-[12px]"
                  style={{
                    borderColor: 'var(--hairline)',
                    color: 'var(--ink-soft)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right column: body + highlights */}
          <div className="md:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="space-y-5 text-[19px] leading-relaxed"
              style={{ color: 'var(--ink)' }}
            >
              {profile.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            {profile.highlights?.length > 0 && (
              <div className="mt-14">
                <p
                  className="mono-label mb-4"
                  style={{ color: 'var(--muted)' }}
                >
                  Highlights
                </p>
                <ol
                  className="border-t"
                  style={{ borderColor: 'var(--hairline)' }}
                >
                  {profile.highlights.map((h, i) => (
                    <li
                      key={h}
                      className="grid grid-cols-[2.5rem_1fr] gap-4 border-b py-4 text-[15px] leading-snug"
                      style={{
                        borderColor: 'var(--hairline)',
                        color: 'var(--ink-soft)',
                      }}
                    >
                      <span
                        className="mono-label"
                        style={{ color: 'var(--muted)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {writing?.[0] && (
              <p
                className="mt-8 text-[14px]"
                style={{ color: 'var(--muted)' }}
              >
                Published:{' '}
                <a
                  href={writing[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-[4px] transition-colors hover:opacity-80"
                  style={{ color: 'var(--accent)' }}
                >
                  {writing[0].publisher} · {writing[0].title} ↗
                </a>{' '}
                ({writing[0].role})
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
