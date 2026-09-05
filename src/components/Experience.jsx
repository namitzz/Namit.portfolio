import { useState } from 'react'
import { motion } from 'framer-motion'
import { timeline } from '../data/content'
import { markFor } from './TimelineMarks'

/**
 * Small text needs 4.5:1; a filled mark and a dotted rule only need 3:1.
 * `tint` carries a lightened variant for the entries whose real brand
 * colour is too dark to set type in on this ground.
 */
const textColor = (t) => t.tint || t.accent || 'var(--accent)'

/**
 * Picks black or white for whatever sits inside a filled mark. The amber
 * and mint stops render white at 1.8:1 and 1.4:1, which is unreadable.
 */
function onFill(hex) {
  if (!hex || hex[0] !== '#') return '#fff'
  const v = [1, 3, 5].map((i) => {
    const n = parseInt(hex.substr(i, 2), 16) / 255
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  })
  const L = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
  // White and near-black give equal contrast at L = 0.187; above it the
  // dark ink wins. 0.32 was too generous and put white on the orange at
  // 3.4:1 where dark would have given 5.8:1.
  return L > 0.187 ? '#0B0A09' : '#fff'
}

/**
 * The timeline as a route map. One dotted track runs left to right in
 * chronological order; each stop is an institution or a stretch of work,
 * and hovering or focusing a stop pulls its detail up below the track.
 *
 * Study and work sit on the same line on purpose. They used to be two
 * separate sections, which split a single journey in half.
 *
 * Below `md` the track turns vertical and every detail is shown at once,
 * since there is no hover on touch.
 *
 * Stop marks are outline drawings from TimelineMarks, resolved on the
 * entry's `markKey` or `id`, and fall back to a monogram.
 */
export default function Experience() {
  // Defaults to the most recent stop so the detail panel is never empty.
  const [active, setActive] = useState(timeline.length - 1)
  const entry = timeline[active] ?? timeline[0]

  return (
    <section
      id="experience"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, rgba(244,85,42,0.075) 0%, rgba(244,85,42,0.010) 26%, rgba(244,244,245,0.028) 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-16 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Experience &amp; Education</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              The route so far<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            2023 – present
          </p>
        </div>

        {/* ---------- Desktop: horizontal route ---------- */}
        <div className="hidden md:block">
          <div className="relative">
            {/* The track. Runs behind the stops, level with their centres. */}
            <div
              className="absolute left-0 right-0"
              aria-hidden="true"
              style={{
                top: '27px',
                height: '2px',
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(244,244,245,0.28) 0 3px, transparent 3px 11px)',
              }}
            />
            {/* The stretch already travelled, drawn in the stop's colour. */}
            <div
              className="absolute left-0 transition-all duration-500"
              aria-hidden="true"
              style={{
                top: '27px',
                height: '2px',
                width: `${((active + 0.5) / timeline.length) * 100}%`,
                backgroundImage: `repeating-linear-gradient(90deg, ${textColor(
                  entry,
                )} 0 3px, transparent 3px 11px)`,
              }}
            />

            <ol
              className="relative grid"
              style={{
                gridTemplateColumns: `repeat(${timeline.length}, minmax(0, 1fr))`,
              }}
            >
              {timeline.map((t, i) => (
                <li key={t.id} className="flex flex-col items-center">
                  <Stop
                    entry={t}
                    isActive={i === active}
                    onSelect={() => setActive(i)}
                  />
                </li>
              ))}
            </ol>
          </div>

          {/* Detail for the selected stop. The container holds its height
              so moving along the track never shifts the page. */}
          <div className="mt-14 min-h-[210px]">
            <motion.div
              key={entry.id}
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="grid grid-cols-12 gap-12 border-t pt-8"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <div className="col-span-4">
                <p
                  className="mono-label"
                  style={{ color: textColor(entry) }}
                >
                  {entry.year}
                </p>
                <p className="mono-label mt-2" style={{ color: 'var(--muted)' }}>
                  {entry.org}
                </p>
                {entry.status && (
                  <p
                    className="mono-label mt-2 flex items-center gap-1.5"
                    style={{ color: textColor(entry) }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: textColor(entry) }}
                    />
                    {entry.status}
                  </p>
                )}
              </div>

              <div className="col-span-8">
                <h3
                  className="serif text-[clamp(1.35rem,2.6vw,2rem)] leading-tight"
                  style={{ color: 'var(--ink)' }}
                >
                  {entry.title}
                </h3>
                <p
                  className="mt-4 max-w-3xl text-[15.5px] leading-relaxed"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {entry.body}
                </p>
                {entry.href && (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-5 inline-flex items-center gap-1.5 border-b pb-0.5 font-mono text-[12px] uppercase tracking-[0.1em]"
                    style={{
                      color: textColor(entry),
                      borderColor: textColor(entry),
                    }}
                  >
                    {entry.kind === 'education' ? 'Course page' : 'Read it'}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ---------- Mobile: vertical route, everything open ---------- */}
        <ol className="md:hidden">
          {timeline.map((t, i) => (
            <li key={t.id} className="relative grid grid-cols-[3.5rem_1fr] gap-4">
              {/* Dotted spine, stopping after the last mark. */}
              {i < timeline.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[27px] top-[60px] w-[2px]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(180deg, rgba(244,244,245,0.28) 0 3px, transparent 3px 11px)',
                  }}
                />
              )}
              <div className="pt-1">
                <StopMark entry={t} isActive />
              </div>
              <div className="pb-10 pt-1">
                <p
                  className="mono-label"
                  style={{ color: textColor(t) }}
                >
                  {t.year}
                </p>
                <h3
                  className="serif mt-1.5 text-[1.3rem] leading-tight"
                  style={{ color: 'var(--ink)' }}
                >
                  {t.title}
                </h3>
                <p className="mono-label mt-2" style={{ color: 'var(--muted)' }}>
                  {t.org}
                </p>
                <p
                  className="mt-3 text-[15px] leading-relaxed"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {t.body}
                </p>
                {t.href && (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 border-b pb-0.5 font-mono text-[12px] uppercase tracking-[0.1em]"
                    style={{
                      color: textColor(t),
                      borderColor: textColor(t),
                    }}
                  >
                    {t.kind === 'education' ? 'Course page' : 'Read it'}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** One stop on the desktop track: the mark, plus its year and short name. */
function Stop({ entry, isActive, onSelect }) {
  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      aria-pressed={isActive}
      className="group flex w-full flex-col items-center px-2 text-center"
    >
      <StopMark entry={entry} isActive={isActive} />

      <span
        className="mono-label mt-4 transition-colors"
        style={{
          color: isActive ? textColor(entry) : 'var(--muted)',
        }}
      >
        {entry.year}
      </span>
      <span
        className="mt-1 text-[13.5px] leading-snug transition-colors"
        style={{ color: isActive ? 'var(--ink)' : 'rgba(244,244,245,0.55)' }}
      >
        {entry.short}
      </span>
    </button>
  )
}

/**
 * The mark itself. Uses `entry.logo` when one is supplied, otherwise a
 * typographic mark: initials for institutions, a glyph for work.
 *
 * Fixed at 56px so the dotted track lines up through the centre of every
 * stop regardless of which kind of mark it draws.
 */
function StopMark({ entry, isActive }) {
  const accent = entry.accent || 'var(--accent)'
  const ink = isActive ? onFill(entry.accent) : textColor(entry)
  const Mark = markFor(entry)

  return (
    <span
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
      style={{
        // Opaque, so the dotted track reads as running behind the stop.
        background: isActive ? accent : '#0A0908',
        border: `2px solid ${accent}`,
        color: ink,
        transform: isActive ? 'scale(1.06)' : 'scale(1)',
        boxShadow: isActive ? `0 0 0 6px ${accent}22` : 'none',
        // Only the motion is transitioned. Fill and ink switch together on
        // the same frame; letting them ease independently can leave the
        // mark sitting on the colour it was picked against.
        transition: 'transform 300ms ease, box-shadow 300ms ease',
      }}
    >
      {Mark ? (
        <Mark width="27" height="27" />
      ) : (
        <span
          className="serif text-[17px] leading-none tracking-tight"
          style={{ color: ink }}
        >
          {entry.monogram}
        </span>
      )}
    </span>
  )
}
