import { motion } from 'framer-motion'

/**
 * Operator console layout: large live feed with HUD on the left,
 * event log + radial FPS gauge on the right. Feels distinctly
 * different from UniWise's "answer card" pattern.
 */
export default function VisionMock() {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span>Posture AI · Set in progress</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-red-400" />
            REC · set 2 · 00:00:18
          </span>
          <span style={{ color: 'var(--accent)' }}>squat</span>
        </span>
      </div>

      {/* Two-column console */}
      <div className="grid grid-cols-12 gap-3">
        {/* Left: live camera feed */}
        <div className="col-span-12 lg:col-span-8">
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10"
            style={{ aspectRatio: '16 / 10', background: 'linear-gradient(180deg,#04221F,#03100E)' }}
          >
            {/* Scan line */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan opacity-50"
              style={{
                background: 'linear-gradient(180deg, transparent, var(--accent), transparent)',
                mixBlendMode: 'screen',
                filter: 'blur(8px)',
              }}
            />

            {/* Subject glow */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  'radial-gradient(ellipse 28% 36% at 50% 56%, rgba(52,245,197,0.12), transparent 70%)',
              }}
            />

            {/* Pose skeleton */}
            <svg
              viewBox="0 0 400 250"
              className="absolute inset-0 h-full w-full"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.4"
            >
              <circle cx="200" cy="60" r="18" />
              <line x1="200" y1="78" x2="200" y2="160" />
              <line x1="160" y1="92" x2="240" y2="92" />
              <line x1="160" y1="92" x2="130" y2="140" />
              <line x1="130" y1="140" x2="115" y2="180" />
              <line x1="240" y1="92" x2="270" y2="140" />
              <line x1="270" y1="140" x2="285" y2="180" />
              <line x1="175" y1="160" x2="225" y2="160" />
              <line x1="175" y1="160" x2="165" y2="220" />
              <line x1="225" y1="160" x2="235" y2="220" />
              {[
                [200, 60], [160, 92], [240, 92], [130, 140], [270, 140],
                [115, 180], [285, 180], [200, 130], [175, 160], [225, 160],
                [165, 220], [235, 220],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.2" fill="var(--accent)" stroke="none" />
              ))}

              {/* Reference depth line — squat target */}
              <line
                x1="120"
                y1="170"
                x2="280"
                y2="170"
                stroke="var(--accent-2)"
                strokeDasharray="3 3"
              />
            </svg>

            {/* HUD corners */}
            <Corner pos="tl" />
            <Corner pos="tr" />
            <Corner pos="bl" />
            <Corner pos="br" />

            {/* Top-left chips */}
            <div className="absolute left-3 top-3 flex flex-col gap-1">
              <HudChip label="src" value="webcam · 0" />
              <HudChip label="res" value="1280×720" />
              <HudChip label="latency" value="29 ms" />
            </div>

            {/* Top-right chips */}
            <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
              <HudChip label="exercise" value="squat" />
              <HudChip label="reps" value="6 / 10" />
              <HudChip label="frame skip" value="2" />
            </div>

            {/* Bottom telemetry */}
            <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white/55 backdrop-blur">
              <span>squat depth · good</span>
              <span className="text-center" style={{ color: 'var(--accent)' }}>
                form 0.87
              </span>
              <span className="text-right">knees · tracking ok</span>
            </div>
          </div>
        </div>

        {/* Right: gauge + event log */}
        <div className="col-span-12 flex flex-col gap-3 lg:col-span-4">
          {/* Radial FPS gauge */}
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              FPS · live
            </p>
            <div className="mt-2 flex items-center gap-3">
              <FpsGauge value={34} max={60} />
              <div className="text-xs leading-tight text-white/65">
                <p style={{ color: 'var(--accent)' }} className="font-mono text-lg">
                  34
                </p>
                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  budget 30+
                </p>
              </div>
            </div>
          </div>

          {/* Event log */}
          <div className="glass min-h-[180px] flex-1 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Event log
              </p>
              <span className="text-[10px] text-white/30">last 8s</span>
            </div>

            <ul className="mt-3 space-y-1.5 font-mono text-[11px]">
              {[
                { t: '00:00:18', m: 'rep 6 · clean · depth ok', tone: 'ok' },
                { t: '00:00:15', m: 'audio cue · "drive heels"', tone: 'accent' },
                { t: '00:00:13', m: 'rep 5 · partial · -depth', tone: 'warn' },
                { t: '00:00:10', m: 'knees tracking · ok', tone: 'ok' },
                { t: '00:00:07', m: 'torso angle · 38°', tone: 'muted' },
                { t: '00:00:02', m: 'set 2 started · squat', tone: 'ok' },
              ].map((e, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-white/35">{e.t}</span>
                  <span
                    style={{
                      color:
                        e.tone === 'ok'
                          ? '#7CF5B8'
                          : e.tone === 'accent'
                          ? 'var(--accent)'
                          : e.tone === 'warn'
                          ? '#F5C36B'
                          : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {e.m}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Set telemetry cards under the console */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        {[
          { l: 'Rep count', v: '6 / 10', d: 'set 2' },
          { l: 'Squat depth', v: 'Good', d: '0.87' },
          { l: 'Knee tracking', v: 'Ok', d: 'within line' },
          { l: 'Posture score', v: '0.86', d: 'torso 38°' },
        ].map((c, i) => (
          <motion.div
            key={c.l}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="glass rounded-xl px-3.5 py-3"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              {c.l}
            </p>
            <p className="mt-1.5 text-sm font-medium text-white">{c.v}</p>
            <p className="mt-0.5 font-mono text-[11px]" style={{ color: 'var(--accent)' }}>
              {c.d}
            </p>
          </motion.div>
        ))}
      </div>

      {/* AI coaching summary — end-of-set */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-3 rounded-2xl border p-4"
        style={{
          background: 'rgba(52,245,197,0.06)',
          borderColor: 'rgba(52,245,197,0.22)',
          borderLeft: '3px solid var(--accent)',
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: 'var(--accent)' }}
        >
          AI coaching summary
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/85">
          Good depth on 5 of 6 reps. Rep 5 was a partial, so slow the descent
          and aim hips below the knee crease. Knee tracking is staying inside
          the toe line, keep that. Try the next set at the same tempo.
        </p>
      </motion.div>
    </div>
  )
}

function FpsGauge({ value, max }) {
  const pct = Math.min(1, value / max)
  const r = 28
  const c = 2 * Math.PI * r
  const dash = c * pct
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="6"
      />
      <motion.circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </svg>
  )
}

function HudChip({ label, value }) {
  return (
    <span className="rounded-md border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70 backdrop-blur">
      <span className="text-white/40">{label}</span>{' '}
      <span style={{ color: 'var(--accent)' }}>{value}</span>
    </span>
  )
}

function Corner({ pos }) {
  const styles = {
    tl: 'top-2 left-2 border-l border-t',
    tr: 'top-2 right-2 border-r border-t',
    bl: 'bottom-2 left-2 border-l border-b',
    br: 'bottom-2 right-2 border-r border-b',
  }[pos]
  return (
    <span
      className={`absolute h-4 w-4 ${styles}`}
      style={{ borderColor: 'var(--accent)' }}
    />
  )
}
