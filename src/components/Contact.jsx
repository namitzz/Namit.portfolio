import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * Contact as a terminal-prompt block. Each channel is a monospaced
 * line prefixed with `>`, action on the right. No hero card,
 * no orbs, no glass.
 */
export default function Contact() {
  const rows = [
    { label: 'email', value: profile.email, href: `mailto:${profile.email}`, action: 'copy' },
    { label: 'github', value: profile.links.github.replace('https://', ''), href: profile.links.github, action: 'visit' },
    { label: 'linkedin', value: profile.links.linkedin.replace('https://www.', ''), href: profile.links.linkedin, action: 'visit' },
    profile.links.cv && {
      label: 'cv',
      value: profile.links.cv.replace(/^\//, ''),
      href: profile.links.cv,
      action: 'download',
    },
  ].filter(Boolean)

  return (
    <section id="contact" className="relative px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-baseline gap-4">
            <span className="mono-label">§05</span>
            <h2 className="section-title text-2xl text-white md:text-3xl">
              contact
            </h2>
          </div>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ color: 'var(--accent)' }}
          >
            ● available
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Left: pitch */}
          <div className="md:col-span-5">
            <p className="text-[17px] leading-relaxed text-white/80">
              Open to graduate roles in AI, machine learning, and software
              engineering.
            </p>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/55">
              Applied AI, backend, data pipelines, or a frontend that has to
              feel right. Happy to talk about any of it.
            </p>
          </div>

          {/* Right: channel rows */}
          <div className="md:col-span-7">
            <ul className="border-t border-white/10">
              {rows.map((r) => (
                <motion.li
                  key={r.label}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35 }}
                  className="group border-b border-white/10"
                >
                  <a
                    href={r.href}
                    target={r.href.startsWith('http') ? '_blank' : undefined}
                    rel={r.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="grid grid-cols-[1.5rem_5rem_1fr_auto] items-center gap-4 py-4 font-mono text-[13px] transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="text-white/30 group-hover:text-white/60">
                      &gt;
                    </span>
                    <span className="uppercase tracking-[0.12em] text-white/45">
                      {r.label}
                    </span>
                    <span className="truncate text-white/85">{r.value}</span>
                    <span className="mono-label opacity-0 transition-opacity group-hover:opacity-100">
                      [{r.action}] ↗
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
              response time · usually within 24h
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
