import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { writing } from '../data/content'

/**
 * Writing section. Renders a card per article from `writing` in content.js.
 * Each card has a "Read article" external link and a "Preview on page"
 * toggle that expands an inline iframe preview underneath the card.
 *
 * Some publishers send X-Frame-Options: deny / sameorigin or a CSP frame-
 * ancestors directive that blocks iframe embedding. In that case the iframe
 * may render blank. The fallback message + external link below the iframe
 * always provides a working route to the article.
 */
export default function Writing() {
  return (
    <section id="writing" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <p className="eyebrow">Writing</p>
        <h2 className="section-title mt-3 text-3xl md:text-4xl">
          Writing and public guidance
        </h2>
        <p className="mt-4 max-w-2xl text-white/70">
          Alongside building projects, I have contributed to guidance on
          responsible AI use in student learning.
        </p>

        <div className="mt-10 space-y-6">
          {writing.map((item) => (
            <ArticleCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleCard({ item }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur md:p-8"
    >
      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/45">
        <span style={{ color: 'var(--accent)' }}>{item.role}</span>
        <span className="text-white/25">·</span>
        <span>{item.publisher}</span>
      </div>

      <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-white md:text-3xl">
        {item.title}
      </h3>

      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-white/75">
        {item.summary}
      </p>

      {item.description && (
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-white/65">
          {item.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags?.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          Read article ↗
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn-ghost"
          aria-expanded={open}
          aria-controls={`preview-${item.id}`}
        >
          {open ? 'Hide preview' : 'Preview on page'}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`preview-${item.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <ArticlePreview url={item.url} title={item.title} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function ArticlePreview({ url, title }) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-[12px] text-white/55">
        If the preview does not load, open the article directly using the link
        below.
      </p>

      <iframe
        src={url}
        title={title}
        loading="lazy"
        className="h-[70vh] w-full rounded-2xl border border-white/10 bg-white"
      />

      <p className="mt-3 text-[12px] text-white/55">
        Some publishers block embedded previews. If this frame is blank,{' '}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="underline"
          style={{ color: 'var(--accent)' }}
        >
          open the article on classfutures.co.uk ↗
        </a>
        .
      </p>
    </div>
  )
}
