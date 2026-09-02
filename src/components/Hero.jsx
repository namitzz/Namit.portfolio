import { motion } from 'framer-motion'
import { profile } from '../data/content'

/**
 * Hero as a title card / manifest. No cards, no gradients, no glow.
 * Reads like the front matter of a spec doc: identity, build info,
 * a big serif name for contrast, and a small keyboard-first CTA row.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between px-6 pt-24 pb-10 md:px-10 md:pt-28"
    >
      {/* Front-matter meta block */}
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-6 border-b border-white/10 pb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 md:grid-cols-4"
        >
          <MetaCell k="portfolio" v="namit.ss" />
          <MetaCell k="build" v="2026.03" />
          <MetaCell k="loc" v="United Kingdom" />
          <MetaCell k="status" v="available" hot />
        </motion.div>
      </div>

      {/* Main title card */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center py-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mono-label"
        >
          §00 · Identity
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="serif mt-4 text-[clamp(3rem,10vw,8rem)] leading-[0.95] tracking-[-0.02em] text-white"
        >
          Namit Singh Sarna
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 max-w-2xl font-mono text-[13px] leading-[1.7] text-white/70"
        >
          <span className="text-white/40">&gt;</span> {profile.headline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55"
        >
          {profile.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center gap-2"
        >
          <a href="#work" className="btn-primary">
            [w] View work
          </a>
          <a href="#contact" className="btn-ghost">
            [c] Contact
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            GitHub ↗
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            LinkedIn ↗
          </a>
          {profile.links.cv && (
            <a
              href={profile.links.cv}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              CV ↗
            </a>
          )}
        </motion.div>
      </div>

      {/* Footer strip */}
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          <span>press [w][a][s][x][c] to navigate</span>
          <span className="hidden md:inline">↓ scroll</span>
        </div>
      </div>
    </section>
  )
}

function MetaCell({ k, v, hot }) {
  return (
    <div>
      <div className="text-white/30">{k}</div>
      <div className="mt-1 flex items-center gap-1.5 text-white/80">
        {hot && (
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}
            aria-hidden="true"
          />
        )}
        <span>{v}</span>
      </div>
    </div>
  )
}
