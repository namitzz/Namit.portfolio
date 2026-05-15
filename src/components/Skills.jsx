import { motion } from 'framer-motion'
import { skills } from '../data/content'

const icons = {
  'AI & Machine Learning': IconBrain,
  'RAG & LLM Systems': IconCite,
  'Backend / API': IconStack,
  'Frontend / UI': IconBrowser,
  'Data Science': IconChart,
  'Computer Vision': IconEye,
  'Tools & Deployment': IconTools,
  'Product & UX Thinking': IconSpark,
}

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Skills</p>
            <h2 className="section-title mt-3 text-3xl md:text-4xl">
              The toolbox, grouped by intent.
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/55">
            I optimise for fluency in the boring middle of a stack: clean data
            in, a model that respects its limits, a UI that explains itself.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => {
            const Icon = icons[s.group] || IconSpark
            return (
              <motion.div
                key={s.group}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="glass group relative overflow-hidden rounded-2xl p-5 transition-shadow hover:shadow-glow"
              >
                {/* hover sheen */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.06), transparent 40%)',
                  }}
                />
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <Icon />
                  </span>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                    {s.group}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <motion.span
                      key={it}
                      whileHover={{ y: -1 }}
                      className="cursor-default rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[12px] text-white/80 transition-colors hover:border-white/25 hover:text-white"
                    >
                      {it}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- inline animated SVG icons ---------- */

function Wrap({ children }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

function IconBrain() {
  return (
    <Wrap>
      <path
        d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6 3 3 0 0 0 3 3v1a2 2 0 0 0 4 0V5a1 1 0 0 0-1-1Z"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <path
        d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6 3 3 0 0 1-3 3"
        stroke="var(--accent-2)"
        strokeWidth="1.5"
      />
      <motion.circle
        cx="12"
        cy="12"
        r="1.4"
        fill="var(--accent)"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </Wrap>
  )
}

function IconCite() {
  return (
    <Wrap>
      <rect x="3" y="4" width="18" height="14" rx="2" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M6 9h12M6 12h8M6 15h6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
      <motion.circle
        cx="18"
        cy="15"
        r="2"
        fill="var(--accent-2)"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
    </Wrap>
  )
}

function IconStack() {
  return (
    <Wrap>
      <motion.g
        animate={{ y: [0, -1.2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="3" y="4" width="18" height="4" rx="1.5" stroke="var(--accent)" strokeWidth="1.5" />
        <rect x="3" y="10" width="18" height="4" rx="1.5" stroke="var(--accent-2)" strokeWidth="1.5" />
        <rect x="3" y="16" width="18" height="4" rx="1.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
      </motion.g>
    </Wrap>
  )
}

function IconBrowser() {
  return (
    <Wrap>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M3 8h18" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="6" cy="6" r="0.7" fill="var(--accent-2)" />
      <circle cx="8" cy="6" r="0.7" fill="rgba(255,255,255,0.6)" />
      <motion.rect
        x="6"
        y="11"
        width="6"
        height="2"
        rx="1"
        fill="var(--accent-2)"
        animate={{ width: [4, 10, 6] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
    </Wrap>
  )
}

function IconChart() {
  return (
    <Wrap>
      <path d="M4 20V6M4 20H20" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      <motion.path
        d="M6 16l3-4 3 2 4-6 4 4"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />
    </Wrap>
  )
}

function IconEye() {
  return (
    <Wrap>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <motion.circle
        cx="12"
        cy="12"
        r="3"
        stroke="var(--accent-2)"
        strokeWidth="1.5"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <circle cx="12" cy="12" r="1" fill="var(--accent-2)" />
    </Wrap>
  )
}

function IconTools() {
  return (
    <Wrap>
      <path
        d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.6-2.6Z"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <motion.circle
        cx="6"
        cy="18"
        r="0.9"
        fill="var(--accent-2)"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </Wrap>
  )
}

function IconSpark() {
  return (
    <Wrap>
      <motion.path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"
        stroke="var(--accent)"
        strokeWidth="1.5"
        animate={{ rotate: [0, 90] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '12px 12px' }}
      />
      <circle cx="12" cy="12" r="2.5" fill="var(--accent-2)" />
    </Wrap>
  )
}
