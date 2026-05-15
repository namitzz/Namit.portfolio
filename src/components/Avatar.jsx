import { motion } from 'framer-motion'

/**
 * Stylised SVG portrait — a low-poly geometric headshot. Avoids needing a
 * real photo while still anchoring the hero with a "person" focal point.
 *
 * Pure SVG, theme-aware via CSS vars. Includes orbit ring + pulse.
 */
export default function Avatar() {
  return (
    <div className="relative h-[280px] w-[280px] md:h-[340px] md:w-[340px]">
      {/* Orbit ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px dashed rgba(255,255,255,0.15)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
          style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--accent)' }}
        />
        <span
          className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ background: 'var(--accent-2)' }}
        />
      </motion.div>

      {/* Inner glow */}
      <div
        className="absolute inset-6 rounded-full opacity-50 blur-2xl"
        style={{ background: 'var(--accent)' }}
      />

      {/* Portrait */}
      <motion.svg
        viewBox="0 0 240 240"
        className="absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)] drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id="avSkin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a2a26" />
            <stop offset="100%" stopColor="#231915" />
          </linearGradient>
          <linearGradient id="avShirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="avBg" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.0)" />
          </radialGradient>
          <clipPath id="avClip">
            <circle cx="120" cy="120" r="118" />
          </clipPath>
        </defs>

        {/* Background plate */}
        <circle cx="120" cy="120" r="118" fill="#0a0a14" />
        <circle cx="120" cy="120" r="118" fill="url(#avBg)" />

        <g clipPath="url(#avClip)">
          {/* Shoulders / shirt */}
          <path
            d="M 12 240 C 12 195, 60 175, 120 175 C 180 175, 228 195, 228 240 Z"
            fill="url(#avShirt)"
          />
          {/* Collar */}
          <path
            d="M 90 190 L 120 210 L 150 190 L 145 175 L 120 185 L 95 175 Z"
            fill="rgba(255,255,255,0.10)"
          />
          {/* Neck */}
          <rect x="108" y="150" width="24" height="32" rx="6" fill="url(#avSkin)" />
          {/* Head */}
          <ellipse cx="120" cy="115" rx="46" ry="52" fill="url(#avSkin)" />
          {/* Hair */}
          <path
            d="M 76 100 C 78 70, 100 56, 120 58 C 144 56, 168 72, 166 104 C 166 92, 152 84, 134 84 C 116 82, 96 88, 88 102 C 84 110, 78 108, 76 100 Z"
            fill="#0f0a08"
          />
          {/* Beard hint */}
          <path
            d="M 86 132 C 96 156, 144 156, 154 132 C 150 144, 140 152, 120 152 C 100 152, 90 144, 86 132 Z"
            fill="#1a120f"
            opacity="0.85"
          />
          {/* Eyes */}
          <ellipse cx="104" cy="120" rx="4" ry="2.6" fill="#eef2ff" />
          <ellipse cx="136" cy="120" rx="4" ry="2.6" fill="#eef2ff" />
          <circle cx="104" cy="120" r="1.4" fill="#0a0a14" />
          <circle cx="136" cy="120" r="1.4" fill="#0a0a14" />
          {/* Brows */}
          <rect x="96" y="111" width="16" height="2" rx="1" fill="#0f0a08" />
          <rect x="128" y="111" width="16" height="2" rx="1" fill="#0f0a08" />
          {/* Nose */}
          <path
            d="M 120 122 L 116 134 L 124 134 Z"
            fill="rgba(0,0,0,0.18)"
          />
          {/* Mouth */}
          <path
            d="M 110 144 Q 120 148 130 144"
            stroke="#e0c7b8"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Glasses (subtle, optional academic vibe) */}
          <g
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.75"
          >
            <rect x="92" y="113" width="24" height="14" rx="4" />
            <rect x="124" y="113" width="24" height="14" rx="4" />
            <line x1="116" y1="120" x2="124" y2="120" />
          </g>
        </g>

        {/* Outer ring */}
        <circle
          cx="120"
          cy="120"
          r="117"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
        />
      </motion.svg>

      {/* Floating chip — "available" */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur"
        style={{ color: 'var(--accent)' }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        Grad July 2026 · Open
      </motion.div>
    </div>
  )
}
