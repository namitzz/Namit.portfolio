import { motion } from 'framer-motion'

/**
 * Course Companion Web App preview.
 *
 * Two panels:
 *  1) Kanban sprint board (matches the repo screenshots: dark charcoal bg,
 *     coloured status tags, weight badges, story cards).
 *  2) Search / results panel using the real feature set from the backlog
 *     (Badges, Leaderboard, Quizzes, Recommendations, Login/Reg, Search &
 *     Filter, Challenges, Course Stats).
 *
 * Style cues come from the GitLab-style board screenshots in the repo,
 * since the Spring Boot backend has no shipped frontend.
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

      {/* === Panel 1: kanban sprint board (matches repo screenshots) === */}
      <div
        className="overflow-hidden rounded-2xl border border-white/10 shadow-card"
        style={{ background: '#1f1f23' }}
      >
        {/* Board top bar */}
        <div
          className="flex items-center justify-between border-b px-4 py-2.5"
          style={{
            background: '#1a1a1e',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[11px]"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              namitzz / Course-Companion-Web-App · Sprint 1
            </span>
          </div>
          <div className="hidden gap-1.5 sm:flex">
            <Pill tone="accent">Spring Boot</Pill>
            <Pill tone="accent2">MySQL</Pill>
            <Pill>Gradle</Pill>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-4 gap-0">
          <Column
            label="Sprint 1 Backlog"
            tone="#60a5fa"
            count={3}
            cards={[
              { id: '#7', title: 'Challenges', weight: 3 },
              { id: '#8', title: 'In-Platform Quizzes', weight: 10 },
              { id: '#9', title: 'Course Recommendations', weight: 8 },
            ]}
          />
          <Column
            label="Started"
            tone="#ef4444"
            count={6}
            cards={[
              { id: '#1', title: 'Earning Badges for Completing Courses', weight: 3, dot: '#a3a04a' },
              { id: '#2', title: 'Viewing a Leaderboard', weight: 5, dot: '#e09a4b' },
              { id: '#6', title: 'Search and Filter Courses', weight: 5, dot: '#5b4ad6' },
              { id: '#4', title: 'Profile Management', weight: 6, dot: '#4a7ad6' },
              { id: '#5', title: 'Login / Reg', weight: 4, dot: '#2d8a4a' },
              { id: '#3', title: 'View Course Stats', weight: 3, dot: '#7d6a3a' },
            ]}
          />
          <Column label="Testing" tone="#facc15" count={0} cards={[]} empty />
          <Column
            label="Wait For Review"
            tone="#10b981"
            count={0}
            cards={[]}
            empty
            last
          />
        </div>
      </div>

      {/* === Panel 2: app preview built from real feature set === */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        {/* Search + course list */}
        <div className="col-span-12 rounded-2xl border border-white/10 bg-white/[0.025] p-3 md:col-span-7">
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
            <span className="text-[12px] text-white/75">
              search courses, badges, quizzes
            </span>
            <span className="ml-auto rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/45">
              /api/courses/search
            </span>
          </div>

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

          <div className="mt-3 space-y-2">
            {[
              {
                code: 'CO2302',
                title: 'Software Engineering Project',
                meta: 'Year 2 · 30 credits',
                badge: 'Group',
                badgeTone: '#5AC8FF',
              },
              {
                code: 'CO2103',
                title: 'Software Architecture & Design',
                meta: 'Year 2 · 15 credits',
                badge: 'Core',
                badgeTone: '#F5B84B',
              },
              {
                code: 'CO3093',
                title: 'Big Data & Predictive Analytics',
                meta: 'Year 3 · 15 credits',
                badge: 'AI',
                badgeTone: '#a78bfa',
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
                        background: `${c.badgeTone}20`,
                        color: c.badgeTone,
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
        </div>

        {/* Right: leaderboard + badges + status */}
        <div className="col-span-12 space-y-2 md:col-span-5">
          {/* Leaderboard */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Leaderboard
              </p>
              <span className="font-mono text-[10px] text-white/40">
                weekly
              </span>
            </div>
            <ol className="mt-2 space-y-1.5 text-[11.5px]">
              {[
                { r: 1, n: 'a.singh', pts: 1240 },
                { r: 2, n: 'm.patel', pts: 1085 },
                { r: 3, n: 'you', pts: 940, me: true },
              ].map((u) => (
                <li
                  key={u.r}
                  className="flex items-center justify-between rounded-md border border-white/10 px-2 py-1.5"
                  style={{
                    background: u.me
                      ? 'rgba(245,184,75,0.08)'
                      : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded-full font-mono text-[9px] font-semibold"
                      style={{
                        background:
                          u.r === 1
                            ? '#F5B84B'
                            : u.r === 2
                              ? '#cbd5e1'
                              : u.r === 3
                                ? '#b45309'
                                : 'rgba(255,255,255,0.15)',
                        color: u.r <= 3 ? '#1a1a1e' : '#fff',
                      }}
                    >
                      {u.r}
                    </span>
                    <span
                      style={{
                        color: u.me ? '#F5B84B' : 'rgba(255,255,255,0.85)',
                      }}
                    >
                      {u.n}
                    </span>
                  </span>
                  <span className="font-mono text-white/65">{u.pts} pts</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              Earned badges
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[
                { c: '#F5B84B', l: 'Starter' },
                { c: '#5AC8FF', l: 'Quiz x5' },
                { c: '#a78bfa', l: 'Streak' },
                { c: '#34D399', l: 'Top 10' },
              ].map((b, i) => (
                <motion.div
                  key={b.l}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] px-2 py-2"
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${b.c}, ${b.c}88 60%, ${b.c}44 100%)`,
                    }}
                  >
                    <span className="font-display text-[10px] font-bold text-[#1a1a1e]">
                      ★
                    </span>
                  </span>
                  <span className="text-[9.5px] text-white/70">{b.l}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Backend status */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              Backend status
            </p>
            <div className="mt-2 space-y-1.5 text-[11px]">
              <StatusRow label="GET /api/courses" value="200 OK" good />
              <StatusRow label="MySQL · courses_db" value="connected" good />
              <StatusRow label="JUnit suite" value="14 / 14" good />
            </div>
          </div>
        </div>
      </div>

      {/* Footer log strip */}
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11px] text-white/65">
        <span className="font-mono">
          [INFO] CourseService :: search("software") → 3 results
        </span>
        <span className="hidden font-mono text-white/40 sm:inline">85 ms</span>
      </div>
    </div>
  )
}

/* ---------- kanban column ---------- */

function Column({ label, tone, count, cards, empty, last }) {
  return (
    <div
      className={`flex flex-col ${last ? '' : 'border-r'} `}
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {/* Column top stripe */}
      <div className="h-[3px] w-full" style={{ background: tone }} />

      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
          style={{ background: `${tone}22`, color: tone }}
        >
          {label}
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] text-white/40">
          <span>≡ {count}</span>
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-1.5 px-2 pb-3">
        {empty && <div className="h-20" />}
        {cards.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="rounded-md border px-2.5 py-2"
            style={{
              background: '#26262b',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <p
              className="text-[11px] font-semibold leading-snug"
              style={{ color: 'rgba(255,255,255,0.88)' }}
            >
              {c.title} <span className="font-normal text-white/45">(Weight = {c.weight})</span>
            </p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono text-[9.5px] text-white/40">
                <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="currentColor">
                  <path d="M3 2h7l3 3v9H3z" opacity="0.65" />
                </svg>
                {c.id}
              </span>
              {c.dot && (
                <span
                  className="h-3 w-3 rounded-full ring-2"
                  style={{
                    background: c.dot,
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ---------- small building blocks ---------- */

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
