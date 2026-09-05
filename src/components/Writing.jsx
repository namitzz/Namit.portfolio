import { useState } from 'react'
import { motion } from 'framer-motion'
import { writing } from '../data/content'

/**
 * Writing section. Gives published work its own proper spread rather
 * than burying it as a one-line link inside About. Each entry is a
 * wide editorial row: role + publisher meta, big serif title, summary,
 * tags, and a read link.
 */
export default function Writing() {
  if (!writing?.length) return null

  return (
    <section
      id="writing"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{ background:
          'linear-gradient(180deg, rgba(244,85,42,0.080) 0%, rgba(244,85,42,0.012) 26%, rgba(244,244,245,0.048) 100%)' }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-14 border-b pb-6"
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
        </div>

        {writing.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ y: 16 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-8 border-b py-10 md:grid-cols-12 md:gap-12"
            style={{ borderColor: 'var(--hairline)' }}
          >
            {/* Left: meta */}
            <div className="md:col-span-4">
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

            {/* Right: title + body + link */}
            <div className="md:col-span-8">
              <h3
                className="serif text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.015em]"
                style={{ color: 'var(--ink)' }}
              >
                {item.title}
              </h3>

              <p
                className="mt-5 max-w-3xl text-[16px] leading-relaxed"
                style={{ color: 'var(--ink-soft)' }}
              >
                {item.summary}
              </p>

              {item.description && (
                <p
                  className="mt-4 max-w-3xl text-[14.5px] leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.description}
                </p>
              )}

              <ArticleReader url={item.url} title={item.title} />
            </div>
          </motion.article>
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
