import { motion } from 'framer-motion'
import { profile } from '../data/content'
import MagneticButton from './MagneticButton'

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 px-6 py-32 md:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-10 md:p-14"
        >
          {/* Animated decorative orbs */}
          <motion.div
            className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full blur-3xl"
            style={{ background: 'var(--accent)', opacity: 0.18 }}
            animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full blur-3xl"
            style={{ background: 'var(--accent-2)', opacity: 0.14 }}
            animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          <p className="eyebrow">Contact</p>
          <h2 className="section-title mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Open to AI, software engineering, education technology, digital
            transformation, and research opportunities.
          </h2>
          <p className="mt-5 max-w-xl text-white/65">
            If any of the work above resonates, or you’re building something
            adjacent, the inbox is the fastest way to start a conversation.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton href={`mailto:${profile.email}`} className="btn-primary">
              {profile.email} →
            </MagneticButton>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              LinkedIn
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              GitHub
            </a>
            <a
              href={profile.links.cv}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              CV
            </a>
          </div>
        </motion.div>

        <footer className="mt-10 flex flex-col items-start justify-between gap-3 text-xs text-white/40 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Namit Singh Sarna</span>
          <span className="font-mono">
            Built with React · Tailwind · Framer Motion
          </span>
        </footer>
      </div>
    </section>
  )
}
