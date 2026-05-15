import { motion } from 'framer-motion'

/**
 * Wide thematic SVG banner shown above each project section's narrative.
 * Each variant is an illustrative scene matching the project's identity —
 * NOT a real photo. Animated subtleties (drift, pulse) add life.
 */
export default function ProjectBanner({ themeKey }) {
  const Banner = {
    uniwise: UniWiseBanner,
    vision: VisionBanner,
    cloud: CloudBanner,
    crime: CrimeBanner,
  }[themeKey] || UniWiseBanner

  return (
    <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10 md:h-36">
      <Banner />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  )
}

/* ---------------- UniWise: knowledge graph ---------------- */
function UniWiseBanner() {
  return (
    <svg viewBox="0 0 800 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="uwBan" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0a1022" />
          <stop offset="100%" stopColor="#060915" />
        </linearGradient>
        <radialGradient id="uwGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#6B5CFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#6B5CFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="160" fill="url(#uwBan)" />
      <circle cx="400" cy="80" r="140" fill="url(#uwGlow)" />

      {/* Knowledge graph — nodes and edges */}
      {[
        [120, 60], [200, 110], [300, 50], [380, 100], [470, 50],
        [560, 90], [650, 40], [720, 100], [200, 30], [340, 130],
        [500, 130], [620, 130],
      ].map(([x, y], i) => (
        <g key={i}>
          <motion.circle
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 5 : 3.5}
            fill="#6B5CFF"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, delay: (i % 5) * 0.3, repeat: Infinity }}
          />
        </g>
      ))}

      {[
        [120, 60, 200, 110], [200, 110, 300, 50], [300, 50, 380, 100],
        [380, 100, 470, 50], [470, 50, 560, 90], [560, 90, 650, 40],
        [650, 40, 720, 100], [200, 30, 300, 50], [380, 100, 340, 130],
        [470, 50, 500, 130], [560, 90, 620, 130],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={'e' + i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(45,184,232,0.30)"
          strokeWidth="1"
        />
      ))}

      <text x="32" y="142" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.4)">
        retrieve · rerank · cite
      </text>
    </svg>
  )
}

/* ---------------- Vision AI: pose + scan ---------------- */
function VisionBanner() {
  return (
    <svg viewBox="0 0 800 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="visBan" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#04221F" />
          <stop offset="100%" stopColor="#03100E" />
        </linearGradient>
      </defs>
      <rect width="800" height="160" fill="url(#visBan)" />

      {/* Grid */}
      {[...Array(9)].map((_, i) => (
        <line key={'h' + i} x1="0" x2="800" y1={i * 20} y2={i * 20} stroke="rgba(52,245,197,0.05)" />
      ))}
      {[...Array(20)].map((_, i) => (
        <line key={'v' + i} y1="0" y2="160" x1={i * 40} x2={i * 40} stroke="rgba(52,245,197,0.05)" />
      ))}

      {/* Multiple silhouettes */}
      {[180, 400, 620].map((cx, idx) => (
        <g key={idx} stroke="#34F5C5" strokeWidth="1.4" fill="none" opacity={idx === 1 ? 1 : 0.45}>
          <circle cx={cx} cy="40" r="12" />
          <line x1={cx} y1="52" x2={cx} y2="100" />
          <line x1={cx - 22} y1="64" x2={cx + 22} y2="64" />
          <line x1={cx - 22} y1="64" x2={cx - 32} y2="92" />
          <line x1={cx + 22} y1="64" x2={cx + 32} y2="92" />
          <line x1={cx - 12} y1="100" x2={cx - 18} y2="135" />
          <line x1={cx + 12} y1="100" x2={cx + 18} y2="135" />
        </g>
      ))}

      {/* Scan line */}
      <motion.rect
        x="0"
        y="0"
        width="800"
        height="20"
        fill="url(#visScan)"
        animate={{ y: [-20, 160, -20] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <defs>
        <linearGradient id="visScan" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#34F5C5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      <text x="32" y="142" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.4)">
        webcam · pose · squat · rep count
      </text>
    </svg>
  )
}

/* ---------------- Cloud Seven: Srinagar skyline ---------------- */
function CloudBanner() {
  return (
    <svg viewBox="0 0 800 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="clBan" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f7f3eb" />
          <stop offset="100%" stopColor="#e8dfcc" />
        </linearGradient>
        <linearGradient id="mtnFar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a89ca5" />
          <stop offset="100%" stopColor="#6a6470" />
        </linearGradient>
        <linearGradient id="mtnNear" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5d6e57" />
          <stop offset="100%" stopColor="#2b362a" />
        </linearGradient>
      </defs>
      <rect width="800" height="160" fill="url(#clBan)" />

      {/* Sun */}
      <motion.circle
        cx="650"
        cy="50"
        r="22"
        fill="#C9A86A"
        opacity="0.7"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Mountains (Srinagar Himalayan silhouette) */}
      <path
        d="M 0 110 L 80 75 L 140 95 L 220 60 L 300 90 L 380 55 L 460 88 L 540 60 L 620 92 L 720 70 L 800 95 L 800 160 L 0 160 Z"
        fill="url(#mtnFar)"
        opacity="0.85"
      />
      <path
        d="M 0 130 L 60 100 L 130 115 L 200 90 L 280 110 L 360 85 L 440 115 L 520 95 L 600 120 L 680 100 L 760 125 L 800 115 L 800 160 L 0 160 Z"
        fill="url(#mtnNear)"
      />
      {/* Snow caps */}
      <g fill="rgba(255,255,255,0.85)">
        <path d="M 215 62 L 220 60 L 225 62 L 220 66 Z" />
        <path d="M 378 57 L 380 55 L 384 57 L 380 61 Z" />
        <path d="M 538 62 L 540 60 L 544 62 L 540 66 Z" />
      </g>

      {/* Dal lake reflection hint */}
      <rect x="0" y="135" width="800" height="25" fill="rgba(120,140,160,0.18)" />

      {/* Brand text */}
      <text x="32" y="32" fontFamily="Space Grotesk, sans-serif" fontSize="14" fontWeight="700" fill="#1a1814">
        Cloud Seven Realty
      </text>
      <text x="32" y="48" fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(26,24,20,0.55)">
        Jammu &amp; Kashmir · verified titles
      </text>
    </svg>
  )
}

/* ---------------- Crime: city heatmap ---------------- */
function CrimeBanner() {
  return (
    <svg viewBox="0 0 800 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="crBan" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0B0820" />
          <stop offset="100%" stopColor="#1B0F33" />
        </linearGradient>
        <filter id="crBlur"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <rect width="800" height="160" fill="url(#crBan)" />

      {/* Grid */}
      {[...Array(8)].map((_, i) => (
        <line key={'h' + i} x1="0" x2="800" y1={i * 20} y2={i * 20} stroke="rgba(255,255,255,0.04)" />
      ))}
      {[...Array(20)].map((_, i) => (
        <line key={'v' + i} y1="0" y2="160" x1={i * 40} x2={i * 40} stroke="rgba(255,255,255,0.04)" />
      ))}

      {/* Heatmap blobs */}
      <g filter="url(#crBlur)">
        {[
          [120, 50, '#FF4FA2', 0.65],
          [240, 90, '#F5C36B', 0.5],
          [380, 60, '#6BA8FF', 0.55],
          [500, 95, '#7CF5B8', 0.45],
          [620, 55, '#C58CFF', 0.55],
          [720, 100, '#FF4FA2', 0.45],
          [180, 110, '#C58CFF', 0.4],
        ].map(([x, y, c, o], i) => (
          <circle key={i} cx={x} cy={y} r="36" fill={c} opacity={o} />
        ))}
      </g>

      {/* River */}
      <motion.path
        d="M 0 120 C 80 110, 160 130, 240 115 S 400 105, 480 120 S 640 115, 720 120 S 800 115, 800 115"
        stroke="rgba(123,180,255,0.55)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Hotspot pin */}
      <g>
        <motion.circle
          cx="380"
          cy="60"
          r="4"
          fill="#FF4FA2"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <motion.circle
          cx="380"
          cy="60"
          r="14"
          fill="none"
          stroke="#FF4FA2"
          strokeWidth="1"
          animate={{ opacity: [0.8, 0], scale: [0.4, 1.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </g>

      <text x="32" y="142" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.4)">
        ~1M+ records · k-means k=4 · R² 0.83
      </text>
    </svg>
  )
}
