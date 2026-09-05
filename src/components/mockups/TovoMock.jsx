import { motion, useReducedMotion } from 'framer-motion'
import { grow } from '../Reveal'

/**
 * Tovo mockup. Approximates the live onboarding screen at
 * https://namitzz.github.io/Tovo/ — dark backdrop, small logo,
 * progress bar (segment 1 of 3 active), a greeting, a name input,
 * a continue button. Pure CSS, no external assets.
 */
export default function TovoMock() {
  const reduce = useReducedMotion()
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/45">
        <span>Tovo · Learn German (A1–C1)</span>
        <a
          href="https://namitzz.github.io/Tovo/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white"
          style={{ color: 'var(--accent)' }}
        >
          Live demo ↗
        </a>
      </div>

      {/* Phone-ish frame */}
      <div
        className="mx-auto flex aspect-[4/5] w-full max-w-[560px] flex-col justify-between rounded-[28px] border border-white/10 p-6 md:p-9"
        style={{
          background:
            'radial-gradient(circle at 50% -20%, rgba(244,85,42,0.12) 0%, transparent 60%), #0f0f10',
        }}
      >
        {/* Logo + progress */}
        <div>
          <div className="flex items-center gap-2 text-white">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{
                background:
                  'linear-gradient(135deg, #f4552a 0%, #f5b447 50%, #f4552a 100%)',
              }}
              aria-hidden="true"
            />
            <span className="text-[17px] font-semibold tracking-tight">
              Tovo
            </span>
          </div>

          {/* Onboarding progress: 3 segments, first active */}
          <div className="mt-5 flex gap-2">
            <motion.span
              {...grow(
                reduce,
                { scaleX: 0 },
                { scaleX: 1 },
                { duration: 0.8, ease: 'easeOut' },
              )}
              className="h-1 w-1/3 origin-left rounded-full"
              style={{ background: '#f4552a' }}
            />
            <span className="h-1 w-1/3 rounded-full bg-white/10" />
            <span className="h-1 w-1/3 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Greeting + field */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.h4
            initial={{ y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[36px] font-semibold leading-tight tracking-tight text-white md:text-[42px]"
          >
            Hallo! <span aria-hidden="true">👋</span>
          </motion.h4>
          <p className="mt-2 text-[15px] text-white/60">
            What should we call you?
          </p>

          <motion.div
            initial={{ y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex h-14 items-center rounded-2xl border border-white/15 bg-white/[0.04] px-5 md:h-16"
          >
            <span className="text-[15px] text-white/40">Your name</span>
            <span
              className="ml-1 inline-block h-4 w-[2px] animate-pulse"
              style={{ background: '#f4552a' }}
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* Continue button */}
        <motion.div
          initial={{ y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] md:h-16"
        >
          <span className="text-[15px] font-medium text-white/85">Continue</span>
        </motion.div>
      </div>

      {/* Chip strip */}
      <div className="mt-4 flex flex-wrap gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-white/55">
        {['A1', 'A2', 'B1', 'B2', 'C1'].map((lvl, i) => (
          <span
            key={lvl}
            className="rounded-sm border px-2 py-1 font-mono"
            style={{
              borderColor:
                i === 0 ? '#f4552a' : 'rgba(244,244,245,0.14)',
              color: i === 0 ? '#f4552a' : 'rgba(244,244,245,0.6)',
            }}
          >
            {lvl}
          </span>
        ))}
      </div>
    </div>
  )
}
