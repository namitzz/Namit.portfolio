import { motion } from 'framer-motion'

/**
 * Analytics command centre. Top: London ward map with cluster colouring.
 * Bottom: KPI tiles + sparkline + bar + model table. Layout is deliberately
 * "map-led" so this mockup reads differently from UniWise / Vision / Cloud.
 */
export default function CrimeMock() {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span>Met Police · Crime panel</span>
        <span className="flex items-center gap-3">
          <span style={{ color: 'var(--accent-2)' }}>k-means · k=5</span>
          <span className="font-mono text-white/55">1.04M rows</span>
        </span>
      </div>

      {/* Map card */}
      <div className="glass-strong overflow-hidden rounded-2xl shadow-card">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">
            London · ward heatmap
          </p>
          <div className="flex items-center gap-2 text-[10px] text-white/55">
            <Legend label="C1" color="#7CF5B8" />
            <Legend label="C2" color="#FF4FA2" />
            <Legend label="C3" color="#F5C36B" />
            <Legend label="C4" color="#6BA8FF" />
            <Legend label="C5" color="#C58CFF" />
          </div>
        </div>

        <LondonMap />
      </div>

      {/* KPI ribbon */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[
          { l: 'records', v: '1.04M' },
          { l: 'wards', v: '624' },
          { l: 'R² (RF)', v: '0.81' },
          { l: 'clusters', v: '5' },
        ].map((k) => (
          <div
            key={k.l}
            className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5"
          >
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/45">
              {k.l}
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-white">
              {k.v}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom row: sparkline + bar + model table */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        <div className="col-span-12 rounded-xl border border-white/10 bg-white/[0.02] p-3 md:col-span-5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/45">
            <span>Volume · 12 mo</span>
            <span style={{ color: 'var(--accent-2)' }}>+3.4% MoM</span>
          </div>
          <LineChart />
        </div>

        <div className="col-span-6 rounded-xl border border-white/10 bg-white/[0.02] p-3 md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
            By category
          </p>
          <BarChart />
        </div>

        <div className="col-span-6 rounded-xl border border-white/10 bg-white/[0.02] p-3 md:col-span-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              Model performance
            </p>
            <span className="text-[10px] text-white/35">CV · 5 folds</span>
          </div>
          <table className="mt-2 w-full text-left text-[11px] text-white/75">
            <thead className="text-white/40">
              <tr>
                <th className="py-1 font-normal">Model</th>
                <th className="py-1 font-normal">R²</th>
                <th className="py-1 font-normal">RMSE</th>
                <th className="py-1 font-normal">MAE</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Linear', '0.62', '14.1', '9.8'],
                ['Tree', '0.74', '11.0', '8.2'],
                ['Random F.', '0.81', '9.4', '7.1'],
              ].map(([m, r, e, a], i) => (
                <motion.tr
                  key={m}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="border-t border-white/5"
                >
                  <td className="py-1.5">{m}</td>
                  <td className="py-1.5 font-mono" style={{ color: 'var(--accent-2)' }}>
                    {r}
                  </td>
                  <td className="py-1.5 font-mono">{e}</td>
                  <td className="py-1.5 font-mono">{a}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cluster cards */}
      <div className="mt-3 grid grid-cols-5 gap-2">
        {[
          { c: 'C1', l: 'Low / residential', n: '142 wards', color: '#7CF5B8' },
          { c: 'C2', l: 'High / night-economy', n: '38 wards', color: '#FF4FA2' },
          { c: 'C3', l: 'Mixed urban', n: '186 wards', color: '#F5C36B' },
          { c: 'C4', l: 'Transit-hub', n: '94 wards', color: '#6BA8FF' },
          { c: 'C5', l: 'Outer / quiet', n: '164 wards', color: '#C58CFF' },
        ].map((c, i) => (
          <motion.div
            key={c.c}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: c.color }}
              />
              <span className="font-mono text-[10px] text-white/55">{c.c}</span>
            </div>
            <p className="mt-1 text-[11px] font-medium text-white/85">{c.l}</p>
            <p className="text-[10px] text-white/45">{c.n}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Legend({ label, color }) {
  return (
    <span className="flex items-center gap-1 font-mono">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

/**
 * Stylised London ward map. Hand-tuned SVG polygons — not geographic
 * truth, just enough to read as "London". Each ward is coloured by cluster.
 */
function LondonMap() {
  // Pseudo-wards: { points, cluster }
  const clusters = ['#7CF5B8', '#FF4FA2', '#F5C36B', '#6BA8FF', '#C58CFF']
  const wards = [
    // Inner ring — high activity (mostly C2 / C3)
    { p: '180,90 220,80 245,100 240,130 200,140 175,120', c: 1 },
    { p: '240,130 280,115 305,140 295,170 250,170', c: 2 },
    { p: '295,170 330,160 355,185 340,215 295,210', c: 1 },
    { p: '200,140 240,130 250,170 220,200 185,180', c: 2 },
    { p: '185,180 220,200 215,235 175,240 155,210', c: 4 },
    { p: '220,200 250,170 295,210 280,240 240,250 215,235', c: 2 },
    { p: '280,240 295,210 340,215 335,250 300,260', c: 3 },
    // Outer ring — quieter (mostly C0 / C4)
    { p: '120,100 180,90 175,120 145,130 110,120', c: 0 },
    { p: '110,120 145,130 155,170 130,190 90,170', c: 0 },
    { p: '90,170 130,190 155,210 135,240 95,230', c: 4 },
    { p: '95,230 135,240 175,240 165,275 110,275', c: 4 },
    { p: '335,250 340,215 380,210 395,250 370,280', c: 3 },
    { p: '395,250 380,210 410,180 450,200 440,250', c: 3 },
    { p: '410,180 355,185 340,215', c: 2 },
    { p: '300,260 335,250 370,280 340,310 290,300', c: 3 },
    { p: '215,235 240,250 290,300 250,320 200,290', c: 1 },
    { p: '110,275 165,275 200,290 175,330 120,330', c: 0 },
    // Top edge
    { p: '180,90 220,80 245,100 240,60 195,55', c: 2 },
    { p: '245,100 280,115 305,140 320,90 270,75', c: 0 },
    { p: '305,140 330,160 355,185 410,180 380,130 325,115', c: 2 },
    // Bottom
    { p: '290,300 340,310 370,280 395,330 320,340', c: 3 },
    { p: '200,290 250,320 290,300 320,340 250,360 195,340', c: 1 },
    { p: '120,330 175,330 195,340 170,375 115,365', c: 4 },
    // Far west / east trims
    { p: '60,140 90,170 95,230 60,220', c: 4 },
    { p: '440,250 395,250 395,330 445,310', c: 3 },
  ]

  return (
    <div className="relative">
      <svg viewBox="0 0 500 380" className="block h-[260px] w-full md:h-[300px]">
        <defs>
          <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* Subtle base grid */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={'h' + i}
            x1="0"
            x2="500"
            y1={i * 40}
            y2={i * 40}
            stroke="rgba(255,255,255,0.04)"
          />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={'v' + i}
            y1="0"
            y2="380"
            x1={i * 40}
            x2={i * 40}
            stroke="rgba(255,255,255,0.04)"
          />
        ))}

        {wards.map((w, i) => (
          <motion.polygon
            key={i}
            points={w.p}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.02, duration: 0.5 }}
            fill={clusters[w.c]}
            fillOpacity="0.28"
            stroke={clusters[w.c]}
            strokeOpacity="0.65"
            strokeWidth="0.8"
            filter="url(#mapGlow)"
          />
        ))}

        {/* River Thames (very stylised) */}
        <motion.path
          d="M 40 240 C 120 230, 180 270, 240 250 S 360 230, 420 260 S 480 270, 500 255"
          stroke="rgba(123,180,255,0.55)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />

        {/* Pin: hotspot */}
        <g>
          <motion.circle
            cx="270"
            cy="175"
            r="4"
            fill="#FF4FA2"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          />
          <motion.circle
            cx="270"
            cy="175"
            r="12"
            fill="none"
            stroke="#FF4FA2"
            strokeWidth="1"
            initial={{ opacity: 0.8, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </g>
      </svg>

      {/* Floating annotation */}
      <div className="absolute right-3 top-3 rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 font-mono text-[10px] backdrop-blur">
        <span className="text-white/45">hotspot </span>
        <span style={{ color: '#FF4FA2' }}>Westminster · C2</span>
      </div>
    </div>
  )
}

function LineChart() {
  const pts = [38, 32, 41, 48, 44, 52, 58, 56, 62, 68, 64, 72]
  const w = 360
  const h = 90
  const step = w / (pts.length - 1)
  const max = Math.max(...pts)
  const min = Math.min(...pts)
  const norm = (v) => h - ((v - min) / (max - min)) * (h - 12) - 6
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * step},${norm(v)}`).join(' ')
  const area = `${d} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-24 w-full">
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lineFill)" />
      <motion.path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {pts.map((v, i) => (
        <circle key={i} cx={i * step} cy={norm(v)} r="1.6" fill="var(--accent)" />
      ))}
    </svg>
  )
}

function BarChart() {
  const bars = [
    { l: 'Theft', v: 88 },
    { l: 'ASB', v: 72 },
    { l: 'Drugs', v: 46 },
    { l: 'Viol.', v: 64 },
    { l: 'Burg.', v: 38 },
  ]
  return (
    <div className="mt-3 flex h-24 items-end gap-2">
      {bars.map((b, i) => (
        <div key={b.l} className="flex flex-1 flex-col items-center gap-1.5">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${b.v}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.06 }}
            className="w-full rounded-sm"
            style={{
              background: 'linear-gradient(180deg, var(--accent), var(--accent-2))',
            }}
          />
          <span className="text-[9px] uppercase tracking-wider text-white/45">
            {b.l}
          </span>
        </div>
      ))}
    </div>
  )
}
