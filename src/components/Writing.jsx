import { useState } from 'react'
import { writing } from '../data/content'
import Reveal from './Reveal'
import { sectionGlow, EMBER } from '../lib/sectionGlow'

/**
 * Writing. Published work gets its own spread rather than being buried as
 * a one-line link inside About.
 *
 * Built for one piece rather than for a list. It was a repeating row, and
 * a repeating row with a single entry in it reads as an empty list — the
 * layout kept promising a second item that never came. The summary is now
 * set as a lead rather than as body copy, so the section has something at
 * the top the size of the claim it is making.
 */
export default function Writing() {
  if (!writing?.length) return null

  return (
    <section
      id="writing"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{ background: sectionGlow(EMBER, 0.08) }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Writing</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              Published work<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            {String(writing.length).padStart(2, '0')}{' '}
            {writing.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>

        {writing.map((item, i) => (
          <Reveal
            as="article"
            key={item.id}
            y={16}
            duration={0.5}
            delay={i * 0.06}
            className="grid grid-cols-1 gap-8 py-4 md:grid-cols-12 md:gap-12"
          >
            {/* Left: meta. Sticky, so the publisher and the role stay
                beside the piece while a long read scrolls past them. */}
            <div className="md:col-span-4">
              <div className="md:sticky md:top-24">
                <span
                  aria-hidden="true"
                  className="mb-5 block h-px w-10"
                  style={{ background: 'var(--accent)' }}
                />
                <p className="mono-label" style={{ color: 'var(--accent)' }}>
                  {item.publisher}
                </p>
                <p className="mono-label mt-2" style={{ color: 'var(--muted)' }}>
                  {item.role}
                </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {item.tags?.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em]"
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
            </div>

            {/* Right: title + body + link */}
            <div className="md:col-span-8">
              <h3
                className="serif text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.015em]"
                style={{ color: 'var(--ink)' }}
              >
                {item.title}
              </h3>

              <p
                className="serif mt-6 max-w-3xl text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.45]"
                style={{ color: 'var(--ink)' }}
              >
                {item.summary}
              </p>

              {item.description && (
                <p
                  className="mt-5 max-w-3xl border-l pl-5 text-[15px] leading-relaxed"
                  style={{
                    color: 'var(--muted)',
                    borderColor:
                      'color-mix(in srgb, var(--accent) 30%, transparent)',
                  }}
                >
                  {item.description}
                </p>
              )}

              <ArticleReader url={item.url} title={item.title} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/**
 * Lets the piece be read without leaving the page: a toggle that
 * expands an embedded reader, plus a permanent link out.
 *
 * Publishers often send `X-Frame-Options` or a CSP `frame-ancestors`
 * directive that blocks embedding, in which case the frame renders
 * blank — so the external link is always present, and the fallback
 * note sits directly under the frame rather than being hidden.
 */
function ArticleReader({ url, title }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="group inline-flex items-center gap-2 border-b pb-1 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors"
          style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
        >
          {open ? 'Hide reader' : 'Read on this page'}
          <span
            aria-hidden="true"
            className="transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          >
            ↓
          </span>
        </button>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-1.5 border-b pb-1 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors"
          style={{
            color: 'rgba(244,244,245,0.75)',
            borderColor: 'rgba(244,244,245,0.25)',
          }}
        >
          Open original
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </a>
      </div>

      {/* Plain conditional render, no height/opacity animation. An
          auto-height transition here left the panel frozen at
          `height: 0` whenever the animation did not run, which hides
          the article outright. Visibility is never animated. */}
      {open && (
        <div className="mt-6">
          <iframe
            src={url}
            title={title}
            loading="lazy"
            className="h-[70vh] w-full rounded-sm border bg-white"
            style={{ borderColor: 'var(--hairline)' }}
          />
          <p className="mt-3 text-[12.5px]" style={{ color: 'var(--muted)' }}>
            If the reader stays blank, the publisher blocks embedding.{' '}
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-[3px]"
              style={{ color: 'var(--accent)' }}
            >
              Open it on classfutures.co.uk ↗
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
