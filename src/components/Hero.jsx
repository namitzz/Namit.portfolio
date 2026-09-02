import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * Editorial hero. Left column: eyebrow, oversized serif name, short
 * one-line intro, minimal CTAs. Right: a large playful geometric
 * shape that slowly drifts. Everything on a warm cream ground.
 * References: karliekloss.com scale, conqr.mx anchor confidence,
 * v-labs.co shape playfulness.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden px-6 pt-32 pb-16 md:px-10 md:pt-40"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 md:grid-cols-12 md:gap-6">
        {/* Left column: copy */}
        <div className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mono-label"
            style={{ color: 'var(--muted)' }}
          >
            Portfolio · 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="serif mt-6 text-[clamp(3.5rem,12vw,10rem)] leading-[0.92] tracking-[-0.02em]"
            style={{ color: 'var(--ink)' }}
          >
            Namit
            <br />
            Singh Sarna
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 max-w-xl text-[17px] leading-relaxed md:text-[19px]"
            style={{ color: 'var(--ink-soft)' }}
          >
            {profile.headline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-4 max-w-xl text-[14.5px] leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {profile.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a href="#work" className="btn-primary">
              View work
            </a>
            <a href="#contact" className="btn-ghost">
              Contact
            </a>
            {profile.links.cv && (
              <a
                href={profile.links.cv}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                Download CV ↗
              </a>
            )}
          </motion.div>
        </div>

        {/* Right column: playful hero shape */}
        <div className="md:col-span-5">
          <HeroShape />
        </div>
      </div>

      {/* Footer strip: identity meta */}
      <div className="mx-auto mt-24 grid w-full max-w-[1400px] grid-cols-2 gap-6 border-t pt-6 md:mt-32 md:grid-cols-4"
        style={{ borderColor: 'var(--hairline)' }}
      >
        <MetaCell k="Based" v="United Kingdom" />
        <MetaCell k="Education" v="Leicester · First Class" />
        <MetaCell k="Focus" v="AI · Backend · Full-stack" />
        <MetaCell k="Available for" v="Graduate roles" />
      </div>
    </section>
  )
}

/** Meta cell in the hero footer strip. Small mono key, cream ink value. */
function MetaCell({ k, v }) {
  return (
    <div>
      <p className="mono-label" style={{ color: 'var(--muted)' }}>
        {k}
      </p>
      <p className="mt-1 text-[13px]" style={{ color: 'var(--ink)' }}>
        {v}
      </p>
    </div>
  )
}

/**
 * Big drifting geometric shape. Two overlapping soft-warm circles that
 * rotate + drift slowly. Cheap, no images, feels playful without being
 * cartoonish.
 */
function HeroShape() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center">
      {/* Outer soft disc */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #d97757 0%, #b1442a 65%, #7a2a15 100%)',
          filter: 'blur(0.5px)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Inner ink disc that drifts */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          width: '55%',
          height: '55%',
          background: 'var(--ink)',
        }}
        animate={{
          x: [0, 12, -8, 0],
          y: [0, -6, 10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Small teal accent dot for depth */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          width: '14%',
          height: '14%',
          right: '8%',
          top: '18%',
          background: '#7edcc0',
        }}
        animate={{
          x: [0, -6, 4, 0],
          y: [0, 8, -4, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Sworm circles at the bottom (v-labs style dots) */}
      <div className="absolute -bottom-4 left-4 grid grid-cols-4 gap-2 opacity-60">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--ink)' }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}
