import { motion } from 'framer-motion'
import { useMemo } from 'react'

/**
 * Animated backdrop for the hero. Two layers:
 *   1) A drifting field of "code tokens" (small floating monospace fragments).
 *   2) A few orbiting accent dots.
 *
 * Pure SVG / motion, no canvas — cheap and theme-aware.
 */
export default function HeroBackdrop() {
  const tokens = useMemo(
    () => [
      'def retrieve(q)',
      'rerank(top_k=8)',
      'confidence < 0.40',
      'cite(slide_id)',
      'cv2.VideoCapture(0)',
      'mediapipe.Pose',
      'fit(X, y)',
      'k_means(n=5)',
      'embed(chunk)',
      'fastapi.APIRouter',
      'tailwind.config.js',
      'np.array([...])',
      'verify(title)',
      'R² = 0.81',
      'RAG · grounded',
      'pipeline.run()',
      'lecture_only=True',
    ],
    [],
  )

  // Deterministic pseudo-random positions so they don't reshuffle every render.
  const placed = useMemo(() => {
    return tokens.map((t, i) => {
      const seed = (i * 9301 + 49297) % 233280
      const x = (seed / 233280) * 100
      const y = ((seed * 1.7) % 100)
      const drift = 20 + ((seed * 3.3) % 30)
      const dur = 14 + ((seed * 0.7) % 16)
      const delay = (seed % 7) * 0.5
      const opacity = 0.10 + ((seed * 0.013) % 0.20)
      return { t, x, y, drift, dur, delay, opacity }
    })
  }, [tokens])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {placed.map((p, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-[11px] tracking-tight"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: 'rgba(255,255,255,0.85)',
            opacity: p.opacity,
            textShadow: '0 0 12px rgba(0,0,0,0.6)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -p.drift, 0],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.t}
        </motion.span>
      ))}

      {/* Orbiting accent dots */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ border: '1px dashed rgba(255,255,255,0.05)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
          style={{ background: 'var(--accent)' }}
        />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[920px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ border: '1px dashed rgba(255,255,255,0.04)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ background: 'var(--accent-2)' }}
        />
      </motion.div>
    </div>
  )
}
