import Reveal from './Reveal'
import { profile } from '../data/content'

/**
 * The evidence behind About, as a band of numbered columns rather than a
 * list. About states the position in two lines; this is what it rests on,
 * and it reads faster across than down.
 *
 * Deliberately short entries. Each one is a thing that exists and can be
 * checked, which is the only reason the section earns its place.
 */
export default function Highlights() {
  if (!profile.highlights?.length) return null

  return (
    <section
      id="highlights"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, rgba(245,180,71,0.065) 0%, rgba(245,180,71,0.009) 26%, rgba(244,244,245,0.022) 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <Reveal>
          <div
            className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b pb-6 md:mb-20"
            style={{ borderColor: 'var(--hairline)' }}
          >
            <div>
              <p className="eyebrow">Highlights</p>
              <h2
                className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
                style={{ color: 'var(--ink)' }}
              >
                The short list
                <span style={{ color: 'var(--accent)' }}>.</span>
              </h2>
            </div>
            <p className="mono-label" style={{ color: 'var(--muted)' }}>
              {String(profile.highlights.length).padStart(2, '0')} entries
            </p>
          </div>
        </Reveal>

        <ol className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {profile.highlights.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 0.07} y={16}>
              {/* A rule per column rather than one across the row: the
                  entries are separate claims, not a continuous list. */}
              <span
                aria-hidden="true"
                className="mb-5 block h-px w-full"
                style={{ background: 'var(--hairline)' }}
              />
              <span
                className="mono-label block"
                style={{ color: 'var(--accent)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                className="mt-4 text-[15px] leading-[1.6]"
                style={{ color: 'var(--ink-soft)' }}
              >
                {item}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
