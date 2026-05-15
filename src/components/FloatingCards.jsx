import { motion } from 'framer-motion'

/**
 * Four small polaroid-style cards that float around the hero, one per
 * project. Each card is a miniature themed scene drawn in SVG so it
 * reads as "thumbnail of that project" without needing a real image.
 */
export default function FloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      <FloatCard
        className="absolute right-[6%] top-[14%]"
        rotate={-6}
        delay={0}
        tag="UniWise"
        accent="#6B5CFF"
      >
        <UniWiseThumb />
      </FloatCard>

      <FloatCard
        className="absolute right-[20%] top-[58%]"
        rotate={5}
        delay={0.4}
        tag="Vision AI"
        accent="#34F5C5"
      >
        <VisionThumb />
      </FloatCard>

      <FloatCard
        className="absolute right-[2%] top-[44%]"
        rotate={4}
        delay={0.7}
        tag="Cloud Seven"
        accent="#C9A86A"
      >
        <CloudThumb />
      </FloatCard>

      <FloatCard
        className="absolute right-[36%] top-[8%]"
        rotate={-3}
        delay={0.2}
        tag="Crime · Met"
        accent="#FF4FA2"
      >
        <CrimeThumb />
      </FloatCard>
    </div>
  )
}

function FloatCard({ children, className, rotate = 0, delay = 0, tag, accent }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, rotate: rotate - 4 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.9, delay: 0.4 + delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5 + delay,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
        className="rounded-2xl border border-white/10 bg-black/55 p-2 shadow-2xl backdrop-blur"
        style={{ boxShadow: `0 30px 60px -25px ${accent}55` }}
      >
        <div className="h-24 w-44 overflow-hidden rounded-xl sm:h-28 sm:w-52">
          {children}
        </div>
        <div className="flex items-center justify-between px-1 pt-2 pb-1">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/65">
            {tag}
          </span>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Thumbnails ---------- */

function UniWiseThumb() {
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full">
      <defs>
        <linearGradient id="uwbg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0a1022" />
          <stop offset="100%" stopColor="#060915" />
        </linearGradient>
      </defs>
      <rect width="200" height="110" fill="url(#uwbg)" />
      {/* radial blobs */}
      <circle cx="40" cy="20" r="40" fill="#6B5CFF" opacity="0.25" />
      <circle cx="180" cy="90" r="50" fill="#2DB8E8" opacity="0.18" />
      {/* answer card */}
      <rect x="14" y="22" width="170" height="48" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
      <rect x="14" y="22" width="3" height="48" fill="#6aa8ff" />
      <rect x="24" y="30" width="80" height="4" rx="2" fill="rgba(255,255,255,0.65)" />
      <rect x="24" y="40" width="140" height="3" rx="1.5" fill="rgba(255,255,255,0.30)" />
      <rect x="24" y="47" width="120" height="3" rx="1.5" fill="rgba(255,255,255,0.30)" />
      <rect x="24" y="54" width="100" height="3" rx="1.5" fill="rgba(255,255,255,0.30)" />
      <circle cx="158" cy="35" r="4" fill="#6aa8ff" />
      <text x="158" y="38" textAnchor="middle" fontSize="6" fill="#06101F" fontWeight="700">1</text>
      {/* steps */}
      <g transform="translate(14,80)">
        {[0,1,2,3].map(i => (
          <rect key={i} x={i*38} y="0" width="34" height="10" rx="5" fill={i===1?"rgba(107,92,255,0.30)":"rgba(255,255,255,0.06)"} stroke={i===1?"rgba(107,92,255,0.6)":"rgba(255,255,255,0.10)"} />
        ))}
      </g>
    </svg>
  )
}

function VisionThumb() {
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full">
      <rect width="200" height="110" fill="#03100E" />
      <rect width="200" height="110" fill="url(#vGlow)" opacity="0.6" />
      <defs>
        <radialGradient id="vGlow" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="#34F5C5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#34F5C5" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* skeleton */}
      <g stroke="#34F5C5" strokeWidth="1.3" fill="none">
        <circle cx="100" cy="32" r="10" />
        <line x1="100" y1="42" x2="100" y2="74" />
        <line x1="80" y1="50" x2="120" y2="50" />
        <line x1="80" y1="50" x2="68" y2="72" />
        <line x1="120" y1="50" x2="132" y2="72" />
        <line x1="88" y1="74" x2="78" y2="100" />
        <line x1="112" y1="74" x2="122" y2="100" />
      </g>
      {[ [100,32], [80,50], [120,50], [68,72], [132,72], [88,74], [112,74], [78,100], [122,100] ].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2" fill="#34F5C5" />
      ))}
      {/* HUD corners */}
      <g stroke="#34F5C5" strokeWidth="1">
        <path d="M6 6 L6 14 M6 6 L14 6" />
        <path d="M194 6 L194 14 M194 6 L186 6" />
        <path d="M6 104 L6 96 M6 104 L14 104" />
        <path d="M194 104 L194 96 M194 104 L186 104" />
      </g>
      {/* FPS chip */}
      <rect x="8" y="10" width="34" height="10" rx="2" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" />
      <text x="11" y="17" fontSize="6" fontFamily="monospace" fill="#34F5C5">FPS 34</text>
    </svg>
  )
}

function CloudThumb() {
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full">
      <defs>
        <linearGradient id="cBg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f7f3eb" />
          <stop offset="100%" stopColor="#e8dfcc" />
        </linearGradient>
        <linearGradient id="cMt" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5d6e57" />
          <stop offset="100%" stopColor="#2b362a" />
        </linearGradient>
      </defs>
      <rect width="200" height="110" fill="url(#cBg)" />
      {/* mountains (Srinagar nod) */}
      <path d="M 0 80 L 40 50 L 70 70 L 110 40 L 150 65 L 200 50 L 200 110 L 0 110 Z" fill="url(#cMt)" />
      <path d="M 0 90 L 30 70 L 60 80 L 100 60 L 140 78 L 200 70 L 200 110 L 0 110 Z" fill="#1a1814" opacity="0.85" />
      {/* sun */}
      <circle cx="160" cy="32" r="10" fill="#C9A86A" />
      {/* property card */}
      <rect x="14" y="14" width="80" height="24" rx="5" fill="white" stroke="rgba(0,0,0,0.08)" />
      <rect x="18" y="18" width="20" height="16" rx="2" fill="#C9A86A" />
      <rect x="42" y="20" width="40" height="3" rx="1.5" fill="#1a1814" />
      <rect x="42" y="26" width="28" height="2.5" rx="1.2" fill="rgba(26,24,20,0.5)" />
      <rect x="42" y="32" width="14" height="3" rx="1.5" fill="#8a6a2e" />
    </svg>
  )
}

function CrimeThumb() {
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full">
      <rect width="200" height="110" fill="#0B0820" />
      {/* grid */}
      {[...Array(6)].map((_, i) => (
        <line key={'h'+i} x1="0" x2="200" y1={i*20} y2={i*20} stroke="rgba(255,255,255,0.04)" />
      ))}
      {[...Array(11)].map((_, i) => (
        <line key={'v'+i} y1="0" y2="110" x1={i*20} x2={i*20} stroke="rgba(255,255,255,0.04)" />
      ))}
      {/* heatmap blobs */}
      {[
        [40, 30, '#FF4FA2', 0.6],
        [80, 60, '#F5C36B', 0.5],
        [130, 40, '#6BA8FF', 0.5],
        [160, 80, '#7CF5B8', 0.45],
        [110, 80, '#C58CFF', 0.5],
      ].map(([x, y, c, o], i) => (
        <circle key={i} cx={x} cy={y} r="22" fill={c} opacity={o} filter="url(#blur)" />
      ))}
      <defs>
        <filter id="blur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      {/* Thames */}
      <path
        d="M 0 70 C 40 60, 80 80, 120 65 S 200 70, 200 65"
        stroke="rgba(123,180,255,0.55)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* sparkline */}
      <polyline
        points="10,98 30,92 50,95 70,86 90,90 110,82 130,84 150,76 170,78 190,72"
        fill="none"
        stroke="#FF4FA2"
        strokeWidth="1.4"
      />
    </svg>
  )
}
