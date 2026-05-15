import { motion } from 'framer-motion'
import { profile } from '../data/content'
import Avatar from './Avatar'
import HeroBackdrop from './HeroBackdrop'
import FloatingCards from './FloatingCards'
import CountUp from './CountUp'
import MagneticButton from './MagneticButton'

const headline = [
  ['I', 'build'],
  ['AI', 'systems'],
  ['that', 'are'],
]

export default function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden px-6 pt-32 pb-24 md:px-12"
    >
      <HeroBackdrop />
      <FloatingCards />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-12">
        {/* Left: copy */}
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              Available · graduating July 2026
            </span>
          </motion.div>

          {/* Word-reveal headline */}
          <h1 className="section-title mt-7 max-w-5xl text-[clamp(2.4rem,6.4vw,5.2rem)] font-semibold leading-[1.02] tracking-tight">
            <RevealLine delay={0.1}>I build AI systems that are</RevealLine>
            <RevealLine delay={0.55} className="block">
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                practical,
              </span>{' '}
              <ShimmerWord text="explainable," delay={0.9} />{' '}
              and human-centred.
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg"
          >
            Final-year BSc Computer Science at the University of Leicester.
            Working across applied AI, retrieval-augmented generation, education
            technology, computer vision, data science, UX, and digital
            transformation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href="#work" className="btn-primary">
              View Projects →
            </MagneticButton>
            <a
              href={profile.links.github}
              className="btn-ghost"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href={profile.links.linkedin}
              className="btn-ghost"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href={profile.links.cv}
              className="btn-ghost"
              target="_blank"
              rel="noreferrer"
            >
              Download CV
            </a>
          </motion.div>

          {/* Stat strip with count-up */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-4"
          >
            <Stat to={4} suffix="" label="shipped projects" />
            <Stat to={1.04} decimals={2} suffix="M" label="records modelled" />
            <Stat to={5} suffix="+" label="doc formats" />
            <Stat to={2026} label="grad year" />
          </motion.div>
        </div>

        {/* Right: avatar */}
        <div className="flex items-center justify-center md:col-span-5 md:justify-end">
          <Avatar />
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.1, duration: 1 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40 md:flex"
      >
        <span>Scroll</span>
        <span className="h-8 w-px bg-white/30" />
      </motion.div>
    </section>
  )
}

/** Lifts a line of text up from below as it reveals. */
function RevealLine({ children, delay = 0, className = '' }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** A single word that gets a one-shot shimmer when revealed. */
function ShimmerWord({ text, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="relative inline-block"
    >
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #ffffff 0%, #ffffff 35%, var(--accent) 50%, #ffffff 65%, #ffffff 100%)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          animation: 'shimmerSweep 3.6s ease-in-out infinite',
        }}
      >
        {text}
      </span>
      <style>{`
        @keyframes shimmerSweep {
          0% { background-position: 100% 0; }
          60% { background-position: -100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </motion.span>
  )
}

function Stat({ to, label, suffix = '', decimals = 0 }) {
  return (
    <div className="bg-white/[0.02] p-5">
      <div className="font-display text-2xl font-semibold">
        <CountUp to={to} suffix={suffix} decimals={decimals} />
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-white/45">
        {label}
      </div>
    </div>
  )
}
