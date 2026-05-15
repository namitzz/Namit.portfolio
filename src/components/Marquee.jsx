import { motion } from 'framer-motion'

/**
 * Edge-faded infinite marquee. Duplicates `items` to create a seamless loop.
 * `speed` is seconds per full pass.
 */
export default function Marquee({ items, speed = 32 }) {
  const loop = [...items, ...items]

  return (
    <div className="relative overflow-hidden py-3">
      {/* Edge gradients */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{
          background:
            'linear-gradient(90deg, var(--bg-from, #08070d) 0%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{
          background:
            'linear-gradient(-90deg, var(--bg-from, #08070d) 0%, transparent 100%)',
        }}
      />

      <motion.div
        className="flex w-max items-center gap-10"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap font-mono text-sm uppercase tracking-[0.18em] text-white/55"
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
            {it}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
