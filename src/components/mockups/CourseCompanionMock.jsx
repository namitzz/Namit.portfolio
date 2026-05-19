import { motion } from 'framer-motion'

/**
 * Course Companion Web App preview.
 * Stylised admin/student view: search bar at the top, a column of
 * course cards, an API/DB status strip, and a small badge ribbon
 * for the preloaded test dataset.
 */
export default function CourseCompanionMock() {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span>Course Companion · Group coursework · CO2302</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-emerald-400" />
          backend up · localhost
        </span>
      </div>

      <div
        className="overflow-hidden rounded-2xl border border-white/10 shadow-card"
        style={{
          background:
            'radial-gradient(circle at 10% 8%, rgba(90,200,255,0.10) 0%, transparent 32%), radial-gradient(circle at 88% 90%, rgba(245,184,75,0.10) 0%, transparent 30%), linear-gradient(160deg,#07111F 0%,#0B1728 60%,#0A1421 100%)',
        }}
      >
        {/* Top bar */}
        <div className="m-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur">
          <div className="min-w-0">
            <h3 className="font-display text-[16px] font-semibold leading-tight tracking-tight text-white">
              Course Companion
            </h3>
            <p className="mt-0.5 text-[10px] text-white/55">
              Spring Boot · MySQL · REST
            </p>
          </div>
          <div className="hidden gap-1.5 sm:flex">
            <Pill tone="accent">/api/courses</Pill>
            <Pill tone="accent2">MySQL · online</Pill>
            <Pill>JUnit · passing</Pill>
          </div>
        </div>

        {/* Search bar */}
        <div className="mx-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-white/45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] text-white/70">
              search courses, modules, badges
            </span>
            <span className="ml-auto rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/45">
              /
            </span>
          </div>

          {/* Filter chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['All', 'Year 2', 'Year 3', 'Software', 'AI', 'Databases'].map(
              (f, i) => (
                <span
                  key={f}
                  className="rounded-full border px-2.5 py-1 text-[10px]"
                  style={{
                    borderColor:
                      i === 0
                        ? 'rgba(245,184,75,0.45)'
                        : 'rgba(255,255,255,0.10)',
                    background:
                      i === 0
                        ? 'rgba(245,184,75,0.12)'
                        : 'rgba(255,255,255,0.03)',
                    color: i === 0 ? '#F5B84B' : 'rgba(255,255,255,0.70)',
                  }}
                >
                  {f}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Course cards */}
        <div className="m-3 grid grid-cols-12 gap-3">
          <div className="col-span-12 space-y-2 md:col-span-7">
            {[
              {
                code: 'CO2302',
                title: 'Software Engineering Project',
                meta: 'Year 2 · 30 credits',
                badge: 'Group',
              },
              {
                code: 'CO2103',
                title: 'Software Architecture & Design',
                meta: 'Year 2 · 15 credits',
                badge: 'Core',
              },
              {
                code: 'CO2017',
                title: 'Operating Systems & Concurrency',
                meta: 'Year 2 · 15 credits',
                badge: 'Lab',
              },
              {
                code: 'CO3093',
                title: 'Big Data & Predictive Analytics',
                meta: 'Year 3 · 15 credits',
                badge: 'AI',
              },
            ].map((c, i) => (
              <motion.div
                key={c.code}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-white/50">
                      {c.code}
                    </span>
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                      style={{
                        background: 'rgba(90,200,255,0.12)',
                        color: '#5AC8FF',
                      }}
                    >
                      {c.badge}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] font-medium text-white/90">
                    {c.title}
                  </p>
                  <p className="text-[10px] text-white/45">{c.meta}</p>
                </div>
                <span
                  className="ml-3 shrink-0 rounded-md border px-2 py-1 text-[10px]"
                  style={{
                    borderColor: 'rgba(245,184,75,0.35)',
                    color: '#F5B84B',
                  }}
                >
                  View →
                </span>
              </motion.div>
            ))}
          </div>

          {/* Right column: API/DB strip + badges */}
          <div className="col-span-12 space-y-2 md:col-span-5">
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Backend status
              </p>
              <div className="mt-2 space-y-1.5 text-[11px]">
                <StatusRow
                  label="GET /api/courses"
                  value="200 OK"
                  good
                />
                <StatusRow
                  label="GET /api/courses/search"
                  value="200 OK"
                  good
                />
                <StatusRow
                  label="MySQL · courses_db"
                  value="connected"
                  good
                />
                <StatusRow label="JUnit suite" value="14 / 14 passing" good />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Test dataset · badges
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  'Preloaded',
                  'Year 2',
                  'Year 3',
                  'Group project',
                  'Search-tested',
                  'Sample dataset',
                ].map((b) => (
                  <span
                    key={b}
                    className="rounded-full border px-2 py-0.5 text-[10px]"
                    style={{
                      borderColor: 'rgba(245,184,75,0.30)',
                      background: 'rgba(245,184,75,0.08)',
                      color: 'rgba(245,220,180,0.9)',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-white/45">
                Seeded for testing search behaviour and badge logic.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Build
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-white/70">
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1.5">
                  <p className="text-white/45">Java</p>
                  <p className="font-mono">17</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1.5">
                  <p className="text-white/45">Gradle</p>
                  <p className="font-mono">build · ok</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1.5">
                  <p className="text-white/45">Spring</p>
                  <p className="font-mono">Boot 3.x</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1.5">
                  <p className="text-white/45">Run</p>
                  <p className="font-mono">localhost</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer log strip */}
        <div className="m-3 mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11px] text-white/65 backdrop-blur">
          <span className="font-mono">
            [INFO] CourseService :: search("software") → 3 results
          </span>
          <span className="hidden font-mono text-white/40 sm:inline">
            85 ms
          </span>
        </div>
      </div>

      {/* Notes strip */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
        {[
          { l: 'Stack', v: 'Spring Boot · MySQL · Gradle' },
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

function Pill({ children, tone }) {
  const styles = {
    accent: {
      background: 'rgba(245,184,75,0.12)',
      borderColor: 'rgba(245,184,75,0.30)',
      color: '#F5B84B',
    },
    accent2: {
      background: 'rgba(90,200,255,0.10)',
      borderColor: 'rgba(90,200,255,0.28)',
      color: '#5AC8FF',
    },
    default: {
      background: 'rgba(255,255,255,0.04)',
      borderColor: 'rgba(255,255,255,0.10)',
      color: 'rgba(255,255,255,0.75)',
    },
  }
  const s = styles[tone] || styles.default
  return (
    <span
      className="rounded-full border px-2.5 py-1 text-[10px] font-mono"
      style={s}
    >
      {children}
    </span>
  )
}

function StatusRow({ label, value, good }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-white/65">{label}</span>
      <span className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: good ? '#34D399' : '#F5B84B' }}
        />
        <span className="font-mono text-white/80">{value}</span>
      </span>
    </div>
  )
}
