import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * Compact contact strip. Sits high on the homepage (after the tech
 * marquee) so visitors do not have to scroll the full site to find
 * how to reach me. The full Contact section still lives at the bottom.
 */
export default function ContactStrip() {
  return (
    <section
      aria-label="Quick contact"
      className="relative z-10 px-6 pt-10 md:px-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="glass mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center"
      >
        <p className="text-sm text-white/75">
          Open to graduate roles in AI, machine learning, and software
          engineering.
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-white/20 px-3 py-1.5 font-medium text-white/90 transition hover:border-white/40 hover:bg-white/[0.05]"
          >
            {profile.email}
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-3 py-1.5 font-medium text-white/75 transition hover:border-white/35 hover:text-white"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-3 py-1.5 font-medium text-white/75 transition hover:border-white/35 hover:text-white"
          >
            GitHub ↗
          </a>
        </div>
      </motion.div>
    </section>
  )
}
