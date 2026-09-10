import { skills } from '../data/content'
import Reveal from './Reveal'
import { sectionGlow, AMBER } from '../lib/sectionGlow'

/**
 * Skills as a set of catalogue cards: a numbered group, and its tools as
 * mono chips, with a ghost index behind for depth.
 *
 * The cards carry their own count rather than a decorative label. They
 * used to say "FRAME 01", which was borrowed styling and told a reader
 * nothing; the number of tools in a group is at least true.
 *
 * Hover lights the whole card rather than one glyph in it: the rule under
 * the group name draws itself across, the border warms, and the ghost
 * index comes up out of the background. One gesture, three things moving
 * together, so the card reads as a single object responding.
 */
export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 md:px-16 md:py-32"
      style={{ background: sectionGlow(AMBER, 0.07) }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className="mb-16 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Skills</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              What I work with<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            {skills.length} groups
          </p>
        </div>

        {/* Bento grid — haiman-style FRAME cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <Reveal
              as="article"
              key={s.group}
              y={16}
              duration={0.45}
              delay={i * 0.04}
              className="group relative flex h-full flex-col overflow-hidden border p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 md:p-7"
              style={{
                borderColor: 'var(--hairline)',
                background: 'rgba(244,244,245,0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'rgba(244,244,245,0.035)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--hairline)'
                e.currentTarget.style.background = 'rgba(244,244,245,0.02)'
              }}
            >
              {/* Big ghost index in the corner */}
              <span
                className="serif text-outline-strong pointer-events-none absolute -top-2 -right-2 select-none leading-none tracking-[-0.04em] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  fontSize: 'clamp(4rem, 8vw, 6rem)',
                }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Top strip: what the group holds, not a decorative label */}
              <div className="mb-6 flex items-baseline justify-between">
                <span className="mono-label" style={{ color: 'var(--muted)' }}>
                  {String(s.items.length).padStart(2, '0')} tools
                </span>
                <span
                  aria-hidden="true"
                  className="serif text-[1.1rem] leading-none opacity-30 transition-all duration-500 group-hover:rotate-90 group-hover:opacity-100"
                  style={{ color: 'var(--accent)' }}
                >
                  ✦
                </span>
              </div>

              {/* Group name */}
              <h3
                className="serif text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.05] tracking-[-0.015em]"
                style={{ color: 'var(--ink)' }}
              >
                {s.group}
              </h3>

              {/* A rule that draws itself across on hover. Scale rather
                  than width, so it animates on the compositor instead of
                  forcing a layout pass on every frame. */}
              <span
                aria-hidden="true"
                className="mt-4 block h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                style={{ background: 'var(--accent)' }}
              />

              {/* Items as mono chips */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-sm border px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors duration-300 group-hover:border-[color:var(--accent)]/40"
                    style={{
                      borderColor: 'var(--hairline)',
                      color: 'var(--ink-soft)',
                    }}
                  >
                    {it}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
