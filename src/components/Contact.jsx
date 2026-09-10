import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/content'
import Reveal from './Reveal'
import { sectionGlow, EMBER } from '../lib/sectionGlow'

/**
 * Contact as an editorial closing block: the pitch on the left, the ways
 * to reach me on the right.
 *
 * The email row copies as well as opening a mail client. A bare `mailto:`
 * assumes the reader has one configured and does nothing visible when
 * they do not, which is the worst outcome for the most important link on
 * the page. Copying always works, and the row still opens mail for anyone
 * who wants that.
 */
export default function Contact() {
  const rows = [
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      copy: profile.email,
    },
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
    <section id="contact" className="relative px-6 py-24 md:px-16 md:py-32"
      style={{ background: sectionGlow(EMBER, 0.1) }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-16 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Contact</p>
              <Reveal>
                <h2
                  className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
                  style={{ color: 'var(--ink)' }}
                >
                  Let&apos;s talk<span style={{ color: 'var(--accent)' }}>.</span>
                </h2>
              </Reveal>
            </div>
            <Available />
          </div>
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
          </div>

          {/* Right column: channels */}
          <div className="md:col-span-7">
            <ul
              className="border-t"
              style={{ borderColor: 'var(--hairline)' }}
            >
              {rows.map((r) => (
                <Reveal
                  as="li"
                  key={r.label}
                  x={-6}
                  y={0}
                  duration={0.4}
                  className="group relative border-b"
                  style={{ borderColor: 'var(--hairline)' }}
                >
                  <a
                    href={r.href}
                    target={r.href.startsWith('http') ? '_blank' : undefined}
                    rel={r.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="grid grid-cols-[6rem_1fr_auto] items-center gap-4 py-5 pr-2 transition-colors hover:bg-white/[0.03]"
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
                      className="serif text-right text-[24px] leading-none opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                      aria-hidden="true"
                      style={{ color: 'var(--accent)' }}
                    >
                      {r.href.startsWith('http') ? '\u2197' : '\u2192'}
                    </span>
                  </a>

                  {/* A rule that draws in from the left under the row it
                      belongs to, so the list answers the pointer without
                      anything moving. Scale rather than width, so it runs
                      on the compositor instead of relaying out the row. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                    style={{ background: 'var(--accent)' }}
                  />

                  {r.copy && <CopyButton value={r.copy} />}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}


/* ------------------------------------------------------------------ */

/**
 * Availability, stated once and plainly.
 *
 * The dot is the only thing on this page that repeats forever, so it is
 * slow and low-contrast, and `motion-safe` stops it entirely for anyone
 * who has asked for less movement. A status light that insists on being
 * noticed is an alarm.
 */
function Available() {
  return (
    <p
      className="inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
        background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
      }}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping"
          style={{ background: 'var(--accent)' }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ background: 'var(--accent)' }}
        />
      </span>
      <span className="mono-label" style={{ color: 'var(--accent)' }}>
        Available &middot; graduate roles
      </span>
    </p>
  )
}

/**
 * Copies an address to the clipboard and says so.
 *
 * It sits over its row rather than inside the link, because a button
 * nested inside an anchor is not valid HTML and browsers disagree about
 * which of the two owns the click.
 */
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard access can be refused outright: an insecure origin, or a
      // browser that wants a permission first. The row is still a mailto
      // link and the address is still on screen to be read off.
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Email address copied' : 'Copy email address'}
      className="absolute right-11 top-1/2 -translate-y-1/2 rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] opacity-0 transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
      style={{
        borderColor: copied ? 'var(--accent)' : 'var(--hairline)',
        color: copied ? 'var(--accent)' : 'var(--muted)',
        background: 'rgba(10,12,14,0.8)',
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
