import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { timeline } from '../data/content'
import Reveal from './Reveal'

const VB = { w: 1000, h: 760 }

// These coordinates deliberately follow the supplied reference rather than
// auto-laying the timeline out. The point of the section is that the map has
// a recognisable geography: Leicester -> Modelling -> Consultancy -> Consul
// and then back through the centre to the lower row.
const LANDMARKS = [
  { x: 175, y: 165, labelX: 175, labelY: 188, kind: 'castle', tone: '#c73d4e' },
  { x: 400, y: 165, labelX: 400, labelY: 214, kind: 'stall', tone: '#d9a55d' },
  { x: 610, y: 165, labelX: 610, labelY: 188, kind: 'arch', tone: '#d69b64' },
  { x: 820, y: 165, labelX: 820, labelY: 188, kind: 'fountain', tone: '#5aa7dc' },
  { x: 820, y: 365, labelX: 820, labelY: 414, kind: 'ctf', tone: '#54c2a2' },
  { x: 610, y: 365, labelX: 610, labelY: 414, kind: 'micro', tone: '#a86eaa' },
  { x: 400, y: 365, labelX: 400, labelY: 414, kind: 'market', tone: '#e45e63' },
  { x: 175, y: 430, labelX: 175, labelY: 479, kind: 'class', tone: '#9d8dbb' },
  { x: 175, y: 650, labelX: 175, labelY: 688, kind: 'uniwise', tone: '#7e8872' },
  { x: 500, y: 650, labelX: 500, labelY: 704, kind: 'graduation', tone: '#7b9bc4' },
  { x: 825, y: 650, labelX: 825, labelY: 688, kind: 'aston', tone: '#9a7151' },
]

const ROUTE = 'M175 165 H400 H610 H820 V365 H610 H400 H175 V650 H500 H825'

const TREE_POSITIONS = [
  [30, 60, 1.2], [78, 95, 1], [120, 48, 1.15], [225, 45, 1.25],
  [275, 90, 1.1], [335, 42, 1.25], [470, 58, 1.1], [520, 35, 1.25],
  [690, 52, 1.1], [750, 62, 1.2], [900, 55, 1.25], [950, 105, 1.1],
  [35, 280, 1.25], [75, 330, 1.1], [100, 540, 1.2], [60, 610, 1.15],
  [105, 705, 1.2], [260, 705, 1.25], [315, 600, 1.1], [365, 550, 1.2],
  [660, 525, 1.15], [710, 570, 1.2], [900, 525, 1.2], [950, 600, 1.25],
  [915, 705, 1.2], [755, 720, 1.25], [585, 720, 1.1], [450, 720, 1.1],
  [965, 320, 1.25], [930, 405, 1.1], [875, 470, 1.15], [710, 300, 1.1],
  [700, 410, 1.2], [300, 260, 1.15], [255, 320, 1.1], [305, 460, 1.2],
]

const FLOWERS = [
  [70, 220], [260, 120], [470, 250], [715, 105], [875, 225],
  [285, 515], [720, 495], [905, 345], [355, 610], [555, 610],
]

export default function Experience() {
  const reduce = useReducedMotion()
  const pathRef = useRef(null)
  const rafRef = useRef(null)
  const [active, setActive] = useState(null)
  const [traveller, setTraveller] = useState({ x: LANDMARKS[0].x, y: LANDMARKS[0].y, length: 0, rotation: 0 })
  const [routeLength, setRouteLength] = useState(0)
  const [routeStops, setRouteStops] = useState([])

  const current = active === null ? null : timeline[active]

  useLayoutEffect(() => {
    if (!pathRef.current) return
    const path = pathRef.current
    const total = path.getTotalLength()
    const stops = LANDMARKS.map((point) => nearestLength(path, point, total))
    setRouteLength(total)
    setRouteStops(stops)
    const p = path.getPointAtLength(stops[0])
    setTraveller({ x: p.x, y: p.y, length: stops[0], rotation: 0 })
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const walkTo = (index) => {
    if (!pathRef.current || !routeLength || !routeStops.length) {
      setActive(index)
      return
    }
    cancelAnimationFrame(rafRef.current)

    const path = pathRef.current
    const start = traveller.length
    const target = routeStops[index]
    const distance = Math.abs(target - start)
    const duration = reduce ? 0 : Math.min(2200, Math.max(650, distance * 3.5))
    const started = performance.now()

    const tick = (now) => {
      const raw = duration === 0 ? 1 : Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - raw, 3)
      const length = start + (target - start) * eased
      const point = path.getPointAtLength(length)
      const ahead = path.getPointAtLength(Math.min(routeLength, Math.max(0, length + (target >= start ? 2 : -2))))
      const rotation = Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180 / Math.PI
      setTraveller({ x: point.x, y: point.y, length, rotation })
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setActive(index)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const progress = traveller.length
  const previous = () => active !== null && walkTo(Math.max(0, active - 1))
  const next = () => active !== null && walkTo(Math.min(timeline.length - 1, active + 1))

  return (
    <section id="experience" className="relative px-6 py-24 md:px-16 md:py-32" style={{ background: 'linear-gradient(180deg, rgba(244,85,42,0.075), rgba(244,244,245,0.015) 45%, rgba(244,244,245,0.025))' }}>
      <div className="mx-auto w-full max-w-[1600px]">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--hairline)' }}>
          <div>
            <p className="eyebrow">Experience &amp; Education</p>
            <h2 className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
              The route so far<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              A little pixel-art version of the route — click a destination and watch the traveller walk there.
            </p>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>{timeline.length} stops · 2023 – present</p>
        </Reveal>

        <div className="hidden md:block">
          <div className="relative mx-auto aspect-[1000/760] w-full max-w-[1280px] overflow-hidden rounded-[28px] border bg-[#2f6d3a] shadow-[0_40px_100px_-55px_rgba(0,0,0,.9)]" style={{ borderColor: 'rgba(244,244,245,.12)' }}>
            <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Interactive pixel-art career journey map">
              <defs>
                <pattern id="grassTexture" width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill="#3c914b" />
                  <path d="M4 9h3M18 5h2M26 18h3M10 27h2M22 29h4M2 21h2" stroke="#4ca057" strokeWidth="2" shapeRendering="crispEdges" opacity=".55" />
                  <path d="M7 17h1M15 22h2M28 8h1M12 3h1" stroke="#2e7c3d" strokeWidth="2" shapeRendering="crispEdges" opacity=".65" />
                </pattern>
                <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="7" stdDeviation="4" floodColor="#17371d" floodOpacity=".38" />
                </filter>
                <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#74c5ef" />
                  <stop offset="1" stopColor="#317db2" />
                </linearGradient>
              </defs>

              <rect width="1000" height="760" fill="url(#grassTexture)" />
              <rect x="0" y="0" width="1000" height="760" fill="none" stroke="#24572e" strokeWidth="12" shapeRendering="crispEdges" />

              <MapPatches />
              {TREE_POSITIONS.map(([x, y, s], i) => <PixelTree key={i} x={x} y={y} scale={s} />)}
              {FLOWERS.map(([x, y], i) => <Flower key={i} x={x} y={y} />)}

              <path d={ROUTE} fill="none" stroke="#8c6a4c" strokeWidth="58" strokeLinecap="square" strokeLinejoin="miter" opacity=".85" />
              <path d={ROUTE} fill="none" stroke="#b18a62" strokeWidth="45" strokeLinecap="square" strokeLinejoin="miter" />
              <path d={ROUTE} fill="none" stroke="#c8a579" strokeWidth="2" strokeDasharray="1 12" strokeLinecap="round" opacity=".55" />

              <path d="M400 165v-48M610 165v-48M820 365v48M610 365v55M400 365v50M175 650v-52M500 650v-50M825 650v-52" stroke="#b18a62" strokeWidth="24" strokeLinecap="square" />

              {LANDMARKS.map((point, index) => (
                <g key={timeline[index]?.id || index}>
                  <Landmark point={point} />
                  <LandmarkButton point={point} entry={timeline[index]} active={active === index} onClick={() => walkTo(index)} />
                </g>
              ))}

              <path pointerEvents="none" d={ROUTE} fill="none" stroke="#f8e8c8" strokeWidth="7" strokeDasharray="2 13" strokeLinecap="round" opacity=".98" />
              <path pointerEvents="none" d={ROUTE} fill="none" stroke="#fff7df" strokeWidth="2" strokeDasharray="1 13" strokeLinecap="round" opacity=".8" />

              <path pointerEvents="none" d={ROUTE} fill="none" stroke="#f4552a" strokeWidth="5" strokeDasharray={routeLength || 1} strokeDashoffset={(routeLength || 1) - progress} strokeLinecap="round" opacity=".9" />
              <path pointerEvents="none" ref={pathRef} d={ROUTE} fill="none" stroke="transparent" strokeWidth="2" />

              <Traveller x={traveller.x} y={traveller.y} rotation={traveller.rotation} reduce={reduce} />
            </svg>

            {current && <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="pointer-events-none absolute inset-0 h-full w-full">
              <foreignObject x={active >= 7 ? 285 : 545} y={active >= 7 ? 430 : 205} width="310" height="275">
                <div className="pointer-events-auto rounded-2xl border p-4 shadow-2xl backdrop-blur-md" style={{ background: 'rgba(17,19,18,.94)', borderColor: current?.accent || '#f4552a', color: '#f4f4f5' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[.16em] opacity-55">{current?.year}</div>
                      <div className="mt-1 font-semibold leading-tight">{current?.title}</div>
                      <div className="mt-1 text-xs opacity-60">{current?.org}</div>
                    </div>
                    <button type="button" onClick={() => setActive(null)} className="rounded-full border px-2 py-1 font-mono text-[9px] opacity-55 hover:opacity-100">×</button>
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed opacity-75">{current?.body || current?.description || current?.summary}</p>
                  {current?.status && <div className="mt-3 inline-flex rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-wider" style={{ borderColor: current.accent || '#fff', color: current.accent || '#fff' }}>{current.status}</div>}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button type="button" onClick={previous} disabled={active === 0} className="rounded-lg border px-3 py-2 font-mono text-[9px] uppercase tracking-wider opacity-70 hover:opacity-100 disabled:opacity-25">← Previous</button>
                    {current?.href && <a href={current.href} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-2 font-mono text-[9px] uppercase tracking-wider opacity-70 hover:opacity-100">Open ↗</a>}
                    <button type="button" onClick={next} disabled={active === timeline.length - 1} className="rounded-lg border px-3 py-2 font-mono text-[9px] uppercase tracking-wider opacity-70 hover:opacity-100">Next →</button>
                  </div>
                </div>
              </foreignObject>
            </svg>}

            <div className="pointer-events-none absolute bottom-5 left-5 z-20 rounded-full border px-3 py-1.5 backdrop-blur-sm" style={{ borderColor: 'rgba(244,244,245,.14)', background: 'rgba(10,14,12,.45)' }}>
              <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/60">Interactive journey map</span>
            </div>
            <div className="pointer-events-none absolute right-5 top-5 z-20 rounded-full border px-3 py-1.5 backdrop-blur-sm" style={{ borderColor: 'rgba(244,244,245,.14)', background: 'rgba(10,14,12,.45)' }}>
              <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/60">Click a landmark</span>
            </div>
            <style>{`\n              .pixel-walker { animation: pixel-bob .28s steps(2, end) infinite alternate; transform-origin: center; }\n              @keyframes pixel-bob { from { translate: 0 0; } to { translate: 0 -2px; } }\n            `}</style>
          </div>
        </div>

        <div className="md:hidden">
          <ol className="relative ml-2 border-l pl-7" style={{ borderColor: 'var(--hairline)' }}>
            {timeline.map((entry, index) => (
              <li key={entry.id} className="relative pb-10 last:pb-0">
                <button type="button" onClick={() => setActive(index)} className="absolute -left-[35px] top-0 h-4 w-4 rounded-full border-2" style={{ background: active === index ? (entry.accent || 'var(--accent)') : 'var(--paper)', borderColor: entry.accent || 'var(--accent)' }} aria-label={`Show ${entry.title}`} />
                <div className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: 'var(--muted)' }}>{entry.year}</div>
                <h3 className="mt-1 text-base font-semibold" style={{ color: 'var(--ink)' }}>{entry.title}</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{entry.org}</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{entry.body || entry.description || entry.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function nearestLength(path, point, total) {
  let lo = 0
  let hi = total
  for (let i = 0; i < 18; i += 1) {
    const a = lo + (hi - lo) / 3
    const b = hi - (hi - lo) / 3
    const pa = path.getPointAtLength(a)
    const pb = path.getPointAtLength(b)
    const da = (pa.x - point.x) ** 2 + (pa.y - point.y) ** 2
    const db = (pb.x - point.x) ** 2 + (pb.y - point.y) ** 2
    if (da < db) hi = b
    else lo = a
  }
  return (lo + hi) / 2
}

function MapPatches() {
  return (
    <g shapeRendering="crispEdges" opacity=".65">
      <path d="M0 145h110v35H0zM260 145h75v45h-75zM690 120h65v45h-65zM870 285h130v42H870zM250 520h65v34h-65zM650 515h105v38H650zM420 690h65v35h-65z" fill="#4b9c4f" />
      <path d="M0 205h45v28H0zM325 215h52v30h-52zM735 245h55v32h-55zM290 585h42v27h-42zM560 485h52v30h-52zM850 455h60v32h-60z" fill="#368943" />
      <path d="M110 255h12v8h-12zM240 300h14v7h-14zM455 285h12v8h-12zM680 285h13v7h-13zM845 245h15v8h-15zM350 515h12v7h-12zM610 570h13v7h-13z" fill="#2d773a" />
    </g>
  )
}

function PixelTree({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} shapeRendering="crispEdges" filter="url(#softShadow)">
      <rect x="-5" y="20" width="10" height="17" fill="#70482e" />
      <rect x="-10" y="26" width="20" height="6" fill="#5d3d29" />
      <path d="M-25 18h7v-18h8v-10h20v10h8V0h8v18h7v9h-11v6h-34v-6h-11z" fill="#126b38" />
      <path d="M-18 10h8V0h20v8h10v10h-9v6h-28v-6h-10z" fill="#22a64b" />
      <path d="M-10 -2h12v-7h11v10h-5v8h-18z" fill="#4bc65a" />
      <rect x="-18" y="17" width="7" height="5" fill="#0d5b31" />
      <rect x="12" y="10" width="7" height="6" fill="#18823c" />
      <rect x="-4" y="24" width="6" height="4" fill="#0d5b31" />
    </g>
  )
}

function Flower({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`} shapeRendering="crispEdges">
      <rect x="0" y="4" width="3" height="9" fill="#28773a" />
      <rect x="-4" y="0" width="4" height="4" fill="#f2d35c" />
      <rect x="4" y="0" width="4" height="4" fill="#e65f72" />
      <rect x="0" y="-4" width="4" height="4" fill="#f4f0c9" />
    </g>
  )
}

function Landmark({ point }) {
  const { x, y, kind } = point
  switch (kind) {
    case 'castle': return <Castle x={x} y={y} />
    case 'stall': return <WoodenArch x={x} y={y} />
    case 'arch': return <WoodenArch x={x} y={y} wide />
    case 'fountain': return <Fountain x={x} y={y} />
    case 'ctf': return <GreenGate x={x} y={y} />
    case 'micro': return <PurpleGate x={x} y={y} />
    case 'market': return <Market x={x} y={y} />
    case 'class': return <ClassBuilding x={x} y={y} />
    case 'uniwise': return <Uniwise x={x} y={y} />
    case 'graduation': return <Graduation x={x} y={y} />
    case 'aston': return <Aston x={x} y={y} />
    default: return <rect x={x - 20} y={y - 20} width="40" height="40" fill="#fff" shapeRendering="crispEdges" />
  }
}

function LandmarkButton({ point, entry, active, onClick }) {
  const width = 74
  const label = shortLabel(entry)
  return (
    <g className="cursor-pointer" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }} aria-label={`Go to ${entry?.title}`}>
      <rect x={point.x - width / 2} y={point.labelY - 18} width={width} height="23" rx="3" fill={active ? '#fff6dd' : '#f4ead5'} stroke={active ? '#f4552a' : '#725a45'} strokeWidth="2" />
      <text x={point.labelX} y={point.labelY - 3} textAnchor="middle" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fill="#42372f">{label}</text>
      <rect x={point.x - 20} y={point.labelY + 7} width="40" height="8" rx="2" fill="#42372f" opacity=".22" />
    </g>
  )
}

function shortLabel(entry) {
  if (!entry) return ''
  const map = { leicester: 'Leicester', modelling: 'Modelling', consultancy: 'Consultancy', consul: 'Consul visit', ctf: 'CTF', microinternship: 'Micro-internship', cloudseven: 'Cloud Seven', classfutures: 'ClassFutures', uniwise: 'UniWise', graduation: 'Graduation', aston: 'Aston' }
  return map[entry.id] || entry.short || entry.title
}

function Castle({ x, y }) {
  return <g transform={`translate(${x - 48} ${y - 58})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <rect x="6" y="0" width="25" height="58" fill="#b93649" /><rect x="65" y="0" width="25" height="58" fill="#b93649" />
    <rect x="0" y="-10" width="37" height="18" fill="#ce4454" /><rect x="59" y="-10" width="37" height="18" fill="#ce4454" />
    <path d="M0-10h9v-8h9v8h10v-8h9v8M59-10h9v-8h9v8h10v-8h9v8" fill="#e15a68" />
    <rect x="31" y="12" width="34" height="46" fill="#c74654" /><rect x="38" y="25" width="20" height="33" fill="#713b31" />
    <path d="M38 25h20v-7H38z" fill="#7e4a39" /><rect x="13" y="18" width="10" height="13" fill="#7e3141" /><rect x="67" y="18" width="10" height="13" fill="#7e3141" />
    <rect x="2" y="7" width="90" height="5" fill="#ef6d77" opacity=".55" />
  </g>
}

function WoodenArch({ x, y, wide = false }) {
  const w = wide ? 70 : 56
  return <g transform={`translate(${x - w / 2} ${y - 45})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <rect x="0" y="0" width={w} height="10" fill="#9a663d" /><rect x="0" y="0" width="8" height="58" fill="#81542f" /><rect x={w - 8} y="0" width="8" height="58" fill="#81542f" />
    <path d={`M8 26Q${w / 2} -10 ${w - 8} 26`} fill="none" stroke="#d79b60" strokeWidth="7" />
    <rect x="14" y="34" width={w - 28} height="24" fill="#b47b48" opacity=".8" /><rect x="19" y="36" width="8" height="8" fill="#d6a36c" /><rect x={w - 27} y="36" width="8" height="8" fill="#d6a36c" />
  </g>
}

function Fountain({ x, y }) {
  return <g transform={`translate(${x} ${y - 25})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <ellipse cx="0" cy="30" rx="40" ry="18" fill="#56707b" /><ellipse cx="0" cy="26" rx="34" ry="15" fill="#8eb5c5" /><ellipse cx="0" cy="24" rx="27" ry="12" fill="url(#water)" />
    <rect x="-7" y="-4" width="14" height="28" fill="#d3e0e0" /><rect x="-13" y="14" width="26" height="8" fill="#c2d3d5" /><rect x="-4" y="-16" width="8" height="12" fill="#e2eceb" />
    <path d="M-4-16Q-20-4-12 8M4-16Q20-4 12 8" fill="none" stroke="#66b9e8" strokeWidth="5" />
    <circle cx="0" cy="-19" r="5" fill="#74c9ef" />
  </g>
}

function GreenGate({ x, y }) {
  return <g transform={`translate(${x - 38} ${y - 38})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <path d="M5 60V22Q5 0 38 0t33 22v38H58V25Q58 14 38 14T18 25v35z" fill="#f0f2e8" />
    <path d="M18 60V27Q18 14 38 14t20 13v33z" fill="#2e8c73" />
    <path d="M20 25Q38 10 56 25" fill="none" stroke="#bde7d7" strokeWidth="4" />
  </g>
}

function PurpleGate({ x, y }) {
  return <g transform={`translate(${x - 38} ${y - 48})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <path d="M2 65V18L18 11L38 2L58 11L74 18v47H55V28Q55 19 38 19T21 28v37z" fill="#6e4b73" />
    <path d="M14 65V22L38 10L62 22v43H53V30Q53 21 38 21T23 30v35z" fill="#8d5d91" />
    <rect x="5" y="39" width="10" height="26" fill="#523c5d" /><rect x="61" y="39" width="10" height="26" fill="#523c5d" />
  </g>
}

function Market({ x, y }) {
  return <g transform={`translate(${x - 55} ${y - 44})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <rect x="7" y="26" width="96" height="39" fill="#9ca6a1" /><rect x="7" y="26" width="96" height="8" fill="#c6d0ca" />
    <rect x="0" y="0" width="110" height="28" fill="#ece1cf" /><path d="M0 0h18v28H0zM36 0h18v28H36zM72 0h18v28H72z" fill="#d9535f" />
    <path d="M0 28Q0 37 9 37t9-9Q18 37 27 37t9-9Q36 37 45 37t9-9Q54 37 63 37t9-9Q72 37 81 37t9-9Q90 37 99 37t11-9" fill="#f1e6d4" />
    <rect x="18" y="40" width="14" height="25" fill="#687773" /><rect x="80" y="40" width="14" height="25" fill="#687773" />
  </g>
}

function ClassBuilding({ x, y }) {
  return <g transform={`translate(${x - 58} ${y - 45})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <path d="M0 20L56 0l55 23v53H0z" fill="#75658e" /><path d="M8 21L56 5l47 19-25 14-22-8-25 10z" fill="#9b8ac0" />
    <path d="M15 28l41 14 41-17v42L56 53 15 41z" fill="#6b627d" /><rect x="52" y="39" width="8" height="36" fill="#4d4a5d" />
    <path d="M30 34l26 9 26-11" stroke="#b6a7d0" strokeWidth="3" fill="none" />
  </g>
}

function Uniwise({ x, y }) {
  return <g transform={`translate(${x - 53} ${y - 48})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <path d="M0 22L54 0l54 22v50H0z" fill="#69745f" /><path d="M6 21L54 4l47 18-47 18z" fill="#8b957c" />
    <rect x="8" y="33" width="92" height="37" fill="#78836e" /><rect x="16" y="37" width="19" height="14" fill="#d8d8ca" /><rect x="69" y="37" width="19" height="14" fill="#d8d8ca" />
    <rect x="42" y="50" width="25" height="20" fill="#4f4f45" /><rect x="49" y="55" width="11" height="15" fill="#343630" />
    <rect x="4" y="27" width="100" height="5" fill="#b1b8a5" />
  </g>
}

function Graduation({ x, y }) {
  return <g transform={`translate(${x - 50} ${y - 58})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <rect x="7" y="5" width="86" height="70" fill="#7f9cc1" /><rect x="0" y="12" width="18" height="70" fill="#5e83b0" /><rect x="82" y="12" width="18" height="70" fill="#5e83b0" />
    <path d="M0 12l9-18 9 18M82 12l9-18 9 18" fill="#7ea0c8" /><path d="M16 5h67v15H16z" fill="#b4c8df" /><rect x="35" y="25" width="30" height="55" fill="#667e9e" />
    <path d="M42 43h16v37H42z" fill="#394d67" /><rect x="22" y="28" width="12" height="14" fill="#a9bfd8" /><rect x="66" y="28" width="12" height="14" fill="#a9bfd8" />
  </g>
}

function Aston({ x, y }) {
  return <g transform={`translate(${x - 55} ${y - 50})`} shapeRendering="crispEdges" filter="url(#softShadow)">
    <path d="M0 25L55 0l55 25v55H0z" fill="#755039" /><path d="M7 24L55 3l48 22-48 21z" fill="#9a6f4f" />
    <rect x="13" y="39" width="84" height="41" fill="#875f42" /><rect x="44" y="55" width="23" height="25" fill="#3c3029" />
    <rect x="20" y="48" width="16" height="13" fill="#e0d6b5" /><rect x="74" y="48" width="16" height="13" fill="#e0d6b5" />
    <path d="M52 11v24M43 22h18" stroke="#f0e7d0" strokeWidth="4" />
  </g>
}

function Traveller({ x, y, rotation, reduce }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotation})`} className={reduce ? '' : 'pixel-walker'}>
    <ellipse cx="0" cy="13" rx="10" ry="4" fill="#1c3b22" opacity=".3" />
    <rect x="-6" y="-9" width="12" height="12" fill="#d9a06b" shapeRendering="crispEdges" />
    <rect x="-9" y="-2" width="18" height="18" rx="2" fill="#7d4f39" shapeRendering="crispEdges" />
    <rect x="-7" y="7" width="6" height="10" fill="#273c4d" shapeRendering="crispEdges" />
    <rect x="1" y="7" width="6" height="10" fill="#273c4d" shapeRendering="crispEdges" />
    <rect x="-13" y="-1" width="5" height="11" fill="#a95b40" shapeRendering="crispEdges" />
    <rect x="-4" y="-14" width="8" height="5" fill="#4c342d" shapeRendering="crispEdges" />
    <rect x="6" y="0" width="7" height="12" fill="#4d6b45" shapeRendering="crispEdges" />
  </g>
}
