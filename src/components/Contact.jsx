import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * Contact as an editorial closing block. Big serif line on the left,
 * neat list of channels on the right, warm cream throughout.
 */
export default function Contact() {
  const rows = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    {
      label: 'GitHub',
      value: profile.links.github.replace('https://', ''),
      href: profile.links.github,
    },
    {
      label: 'LinkedIn',
      value: profile.links.linkedin.replace('https://www.', ''),
      href: profile.links.linkedin,
    },
    profile.links.cv && {
      label: 'CV',
      value: profile.links.cv.replace(/^\//, ''),
      href: profile.links.cv,
    },
  ].filter(Boolean)

  return (
    <section id="contact" className="relative px-6 py-40 md:px-20 md:py-56">
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-16 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <p className="eyebrow">Reel 05 · Contact</p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="serif mt-3 text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ color: 'var(--ink)' }}
          >
            Let&apos;s talk.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Left column: pitch */}
          <div className="md:col-span-5">
            <p
              className="text-[19px] leading-relaxed"
              style={{ color: 'var(--ink)' }}
            >
              Open to graduate roles in AI, machine learning, and software
              engineering.
            </p>
            <p
              className="mt-4 text-[15px] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              Applied AI, backend, data pipelines, or a frontend that has to
              feel right. Happy to talk about any of it.
            </p>

            <p className="mono-label mt-8" style={{ color: 'var(--accent)' }}>
              <span
                className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: 'var(--accent)' }}
              />
              Currently available
            </p>
          </div>

          {/* Right column: channels */}
          <div className="md:col-span-7">
            <ul
              className="border-t"
              style={{ borderColor: 'var(--hairline)' }}
            >
              {rows.map((r) => (
                <motion.li
                  key={r.label}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35 }}
                  className="group border-b"
                  style={{ borderColor: 'var(--hairline)' }}
                >
                  <a
                    href={r.href}
                    target={r.href.startsWith('http') ? '_blank' : undefined}
                    rel={r.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="grid grid-cols-[6rem_1fr_2rem] items-center gap-4 py-5 transition-colors hover:bg-[rgba(26,24,20,0.03)]"
                  >
                    <span
                      className="mono-label"
                      style={{ color: 'var(--muted)' }}
                    >
                      {r.label}
                    </span>
                    <span
                      className="serif truncate text-[19px] tracking-tight"
                      style={{ color: 'var(--ink)' }}
                    >
                      {r.value}
                    </span>
                    <span
                      className="serif text-right text-[24px] leading-none opacity-40 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                      style={{ color: 'var(--ink)' }}
                    >
                      →
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
