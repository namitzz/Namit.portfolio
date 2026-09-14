import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { profile } from '../data/content'
import Reveal from './Reveal'
import { EditorialLink } from './About'
import { sectionGlow, EMBER } from '../lib/sectionGlow'

/**
 * Contact as an editorial closing block: the pitch on the left, the ways
 * to reach me on the right.
 *
 * Buttons and one address, not a list of URLs. The address is the one
 * thing worth reading off the page, so it is set large, opens mail, and
 * has a copy button beside it: a bare `mailto:` does nothing visible for
 * anyone without a mail client configured, and copying always works.
 */
export default function Contact() {
  const reduce = useReducedMotion()

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
              Open to graduate roles in AI, software engineering, data and
              technology consulting.
            </p>
            <p
              className="mt-4 text-[15px] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              Helping an organisation adopt AI, building the system it adopts,
              or a frontend that has to feel right. Happy to talk about any of
              it.
            </p>
          </div>

          {/* Right column: the address, then everything else as buttons */}
          <div className="md:col-span-7">
            <Reveal x={-6} y={0} duration={0.4}>
              <p className="mono-label" style={{ color: 'var(--muted)' }}>
                Email
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="serif group relative text-[clamp(1.7rem,3.4vw,2.8rem)] leading-none tracking-[-0.02em]"
                  style={{ color: 'var(--ink)' }}
                >
                  {profile.email}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                    style={{ background: 'var(--accent)' }}
                  />
                </a>
                <CopyButton value={profile.email} />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div
                className="mt-10 flex flex-wrap gap-3 border-t pt-10"
                style={{ borderColor: 'var(--hairline)' }}
              >
                <EditorialLink href={profile.links.linkedin} label="LinkedIn" reduce={reduce} />
                <EditorialLink href={profile.links.github} label="GitHub" reduce={reduce} />
                {profile.links.cv && (
                  <EditorialLink href={profile.links.cv} label="Download CV" reduce={reduce} icon={'\u2193'} />
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* A closing note, because this is where the page ends and a
            reader who got here has read all of it. */}
        <Reveal delay={0.1}>
          <div className="mt-24 max-w-2xl">
            <span
              aria-hidden="true"
              className="block h-px w-10"
              style={{ background: 'var(--accent)' }}
            />
            <p
              className="serif mt-6 text-[clamp(1.25rem,2vw,1.6rem)] italic leading-[1.4]"
              style={{ color: 'var(--ink-soft)' }}
            >
              Thanks for reading this far. If a role, a project or a question
              brought you here, I would be glad to hear about it.
            </p>
            <p className="mono-label mt-4" style={{ color: 'var(--muted)' }}>
              Namit
            </p>
          </div>
        </Reveal>

        <SiteFooter />
      </div>
    </section>
  )
}

/**
 * The last line of the page: whose site it is, and where the privacy
 * notice lives. `/privacy` is a static page rather than a section of this
 * one, so it is a plain link that leaves the app, not a scroll target.
 */
function SiteFooter() {
  return (
    <footer
      className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t pt-6"
      style={{ borderColor: 'var(--hairline)' }}
    >
      <p className="mono-label" style={{ color: 'var(--muted)' }}>
        &copy; {new Date().getFullYear()} Namit Singh Sarna
      </p>
      <a
        href="/privacy"
        className="mono-label underline-offset-4 transition-colors hover:underline focus-visible:underline"
        style={{ color: 'var(--muted)' }}
      >
        Privacy and cookies
      </a>
    </footer>
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
 * Beside the address rather than inside its link, because a button nested
 * inside an anchor is not valid HTML and browsers disagree about which of
 * the two owns the click. Always visible: there is no hover on a phone.
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
      // browser that wants a permission first. The address is still a
      // mailto link and still on screen to be read off.
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
      className="rounded-sm border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--ink)]"
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
