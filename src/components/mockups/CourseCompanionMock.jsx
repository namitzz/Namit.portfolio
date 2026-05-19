import { motion } from 'framer-motion'

/**
 * Faithful preview of the Course Companion app interior.
 *
 * Mirrors the real `styles.css` from the repo:
 *   body { background: linear-gradient(135deg, #6a11cb, #2575fc); }
 *   .login-container { background: rgba(255,255,255,0.9); border-radius: 15px; }
 *   button { background: #2575fc; border-radius: 8px; }
 *   font-family: 'Poppins', sans-serif;
 *
 * Browser chrome contrasts the dark portfolio surround, then inside
 * we render the dashboard surfaces (XP, streak, badges, deadlines,
 * search, leaderboard) that exist in the Thymeleaf templates.
 */
export default function CourseCompanionMock() {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span>Course Companion · Group coursework · CO2302</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-emerald-400" />
          backend up · localhost:8080
        </span>
      </div>

      {/* Browser chrome */}
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-card">
        <div className="flex items-center gap-1.5 border-b border-black/20 bg-[#1d1730] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 rounded-md bg-black/30 px-3 py-0.5 font-mono text-[10px] text-white/70">
            http://localhost:8080/dashboard
          </span>
        </div>

        {/* Interior — the real body gradient from styles.css */}
        <div
          className="relative px-5 py-5"
          style={{
            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
            fontFamily: "'Poppins', system-ui, sans-serif",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mortarboard />
              <div className="leading-tight">
                <p className="text-[14px] font-semibold text-white">
                  Course Companion
                </p>
                <p className="text-[10px] text-white/75">
                  Sample dashboard preview · local test data
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <ChipDark>Spring Boot</ChipDark>
              <ChipDark>MySQL</ChipDark>
              <ChipDark>Thymeleaf</ChipDark>
            </div>
          </div>

          {/* Main grid */}
          <div className="mt-4 grid grid-cols-12 gap-3">
            {/* Left: course search + cards (template: search.html) */}
            <Card className="col-span-12 md:col-span-7">
              <CardHeader title="Search courses" hint="GET /search" />
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-black/40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
                <span className="text-[12px] text-black/75">
                  software engineering
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['All', 'Year 2', 'Year 3', 'AI', 'Databases'].map((f, i) => (
                  <FilterChip key={f} active={i === 0}>
                    {f}
                  </FilterChip>
                ))}
              </div>

              <div className="mt-3 space-y-2">
                {[
                  {
                    code: 'CO2302',
                    title: 'Software Engineering Project',
                    meta: 'Year 2 · 30 credits',
                    tag: 'Group',
                  },
                  {
                    code: 'CO2103',
                    title: 'Software Architecture & Design',
                    meta: 'Year 2 · 15 credits',
                    tag: 'Core',
                  },
                  {
                    code: 'CO3093',
                    title: 'Big Data & Predictive Analytics',
                    meta: 'Year 3 · 15 credits',
                    tag: 'AI',
                  },
                ].map((c, i) => (
                  <motion.div
                    key={c.code}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-black/50">
                          {c.code}
                        </span>
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                          style={{
                            background: 'rgba(37,117,252,0.10)',
                            color: '#1a5bbf',
                          }}
                        >
                          {c.tag}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12.5px] font-semibold text-[#1a1730]">
                        {c.title}
                      </p>
                      <p className="text-[10px] text-black/50">{c.meta}</p>
                    </div>
                    <PrimaryButton>View</PrimaryButton>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Right column: badges + leaderboard */}
            <div className="col-span-12 space-y-3 md:col-span-5">
              {/* Badges (template: badges.html) */}
              <Card>
                <CardHeader title="Badges" hint="sample" />
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[
                    { c: '#f59e0b', l: 'Sample' },
                    { c: '#2575fc', l: 'Sample' },
                    { c: '#a78bfa', l: 'Sample' },
                    { c: '#10b981', l: 'Sample' },
                    { c: '#ef4444', l: 'Sample' },
                    { c: '#06b6d4', l: 'Sample' },
                    { c: '#ec4899', l: 'Sample' },
                    { c: '#94a3b8', l: 'Locked', locked: true },
                  ].map((b, i) => (
                    <motion.div
                      key={b.l + i}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={{
                          background: b.locked
                            ? 'rgba(255,255,255,0.18)'
                            : `radial-gradient(circle at 30% 30%, ${b.c}, ${b.c}88 60%, ${b.c}33 100%)`,
                          opacity: b.locked ? 0.55 : 1,
                        }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {b.locked ? '🔒' : '★'}
                        </span>
                      </span>
                      <span className="text-[9.5px] text-white/85">
                        {b.l}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Leaderboard (template: all-users-xp.html) — generic sample rows */}
              <Card>
                <CardHeader title="Leaderboard" hint="sample" />
                <ol className="mt-2 space-y-1.5 text-[11.5px]">
                  {[
                    { r: 1, n: 'Student A' },
                    { r: 2, n: 'Student B' },
                    { r: 3, n: 'Student C' },
                  ].map((u) => (
                    <li
                      key={u.r}
                      className="flex items-center justify-between rounded-md border border-black/10 px-2 py-1.5"
                      style={{ background: 'rgba(255,255,255,0.85)' }}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="flex h-4 w-4 items-center justify-center rounded-full font-mono text-[9px] font-bold"
                          style={{
                            background:
                              u.r === 1
                                ? '#f59e0b'
                                : u.r === 2
                                  ? '#cbd5e1'
                                  : '#b45309',
                            color: '#1a1730',
                          }}
                        >
                          {u.r}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: '#1a1730' }}
                        >
                          {u.n}
                        </span>
                      </span>
                      <span
                        className="font-mono"
                        style={{ color: 'rgba(26,23,48,0.55)' }}
                      >
                        sample
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          </div>

          {/* Bottom row: generic sample views from the templates folder */}
          <div className="mt-3 grid grid-cols-12 gap-3">
            <Card className="col-span-12 md:col-span-4">
              <CardHeader title="Sample list view" hint="local test data" />
              <ul className="mt-2 space-y-1.5 text-[11px] text-[#1a1730]">
                {[
                  { d: 'A', tone: '#ef4444' },
                  { d: 'B', tone: '#f59e0b' },
                  { d: 'C', tone: '#2575fc' },
                ].map((d) => (
                  <li
                    key={d.d}
                    className="flex items-center gap-2 rounded-md border border-black/10 bg-white px-2 py-1.5"
                  >
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold text-white"
                      style={{ background: d.tone }}
                    >
                      {d.d}
                    </span>
                    <span className="truncate">Sample item {d.d}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="col-span-12 md:col-span-4">
              <CardHeader title="Sample card view" hint="local test data" />
              <div className="mt-2 rounded-lg border border-black/10 bg-white p-3 text-[11.5px] text-[#1a1730]">
                <p className="text-[10px] uppercase tracking-wider text-black/45">
                  Module label
                </p>
                <p className="mt-1 font-semibold">Sample card content</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-black/55">
                  <span>Sample preview</span>
                  <span className="font-mono">local data</span>
                </div>
              </div>
            </Card>

            <Card className="col-span-12 md:col-span-4">
              <CardHeader title="Sample progress view" hint="local test data" />
              <div className="mt-2 flex items-end gap-1.5 px-1">
                {[40, 55, 50, 60, 55, 65, 60].map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${v}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.05 }}
                    className="w-full rounded-sm"
                    style={{
                      background:
                        'linear-gradient(180deg,#a78bfa,#2575fc)',
                      maxHeight: 60,
                    }}
                  />
                ))}
              </div>
              <p className="mt-2 text-[10px] text-white/85">
                Sample progress view, local test data only.
              </p>
            </Card>
          </div>

          {/* Footer toolbar */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-[10px] text-white/80 backdrop-blur">
            <span className="font-mono">
              [INFO] CourseService :: search("software") → 3 results
            </span>
            <span className="hidden font-mono text-white/55 sm:inline">
              JUnit tests · local build
            </span>
          </div>
        </div>
      </div>

      {/* Notes strip — under the browser frame, lives in dark portfolio */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
        {[
          { l: 'Stack', v: 'Spring Boot · MySQL · Thymeleaf' },
          { l: 'Type', v: 'Group coursework · CO2302' },
          { l: 'My focus', v: 'Backend, DB, testing, integration' },
        ].map((n) => (
          <div key={n.l} className="glass rounded-xl px-3.5 py-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              {n.l}
            </p>
            <p className="mt-1 text-sm font-medium text-white/85">{n.v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- building blocks ---------- */

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-[15px] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.18)] ${className}`}
      style={{ background: 'rgba(255,255,255,0.92)' }}
    >
      {children}
    </div>
  )
}

function CardHeader({ title, hint }) {
  return (
    <div className="flex items-center justify-between">
      <p
        className="text-[12px] font-semibold"
        style={{ color: '#1a5bbf' }}
      >
        {title}
      </p>
      {hint && (
        <span className="font-mono text-[10px] text-black/45">{hint}</span>
      )}
    </div>
  )
}

function ChipDark({ children }) {
  return (
    <span className="rounded-full border border-white/20 bg-black/15 px-2.5 py-1 font-mono text-[10px] text-white/85">
      {children}
    </span>
  )
}

function FilterChip({ children, active }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 text-[10px] font-medium"
      style={
        active
          ? {
              background: '#2575fc',
              borderColor: '#2575fc',
              color: '#ffffff',
            }
          : {
              background: 'rgba(255,255,255,0.85)',
              borderColor: 'rgba(0,0,0,0.10)',
              color: 'rgba(26,23,48,0.75)',
            }
      }
    >
      {children}
    </span>
  )
}

function PrimaryButton({ children }) {
  return (
    <span
      className="ml-3 shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-semibold text-white shadow-[0_4px_10px_rgba(37,117,252,0.35)]"
      style={{ background: '#2575fc' }}
    >
      {children}
    </span>
  )
}

function Mortarboard() {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-lg"
      style={{ background: 'rgba(255,255,255,0.18)' }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M2 9l10-4 10 4-10 4L2 9z"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M6 11v4c0 1.5 3 3 6 3s6-1.5 6-3v-4"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M22 9v5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}
