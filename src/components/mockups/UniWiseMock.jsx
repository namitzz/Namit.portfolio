import { motion } from 'framer-motion'

/**
 * UniWise UI — faithful preview of the live Streamlit interface.
 * Mirrors the real app's design system: animated gradient title,
 * step breadcrumb, scaffold blocks (concept / keypoints / example /
 * self-check / misconception), glassy answer card with citations,
 * and blue-bordered evidence rows.
 *
 * Source palette pulled directly from the app's `inject_ui()` CSS.
 */
export default function UniWiseMock() {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span>UniWise · Dissertation prototype</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-emerald-400" />
          grounded · lecture-only
        </span>
      </div>

      {/* App shell — uses UniWise's own deep navy radial-gradient background */}
      <div
        className="overflow-hidden rounded-2xl border border-white/10 shadow-card"
        style={{
          background:
            'radial-gradient(circle at 12% 8%, rgba(120,95,255,0.20) 0%, transparent 32%), radial-gradient(circle at 85% 88%, rgba(45,184,232,0.14) 0%, transparent 30%), radial-gradient(circle at 52% 20%, rgba(52,211,153,0.08) 0%, transparent 22%), linear-gradient(160deg,#070b18 0%,#0a1022 45%,#060915 100%)',
        }}
      >
        {/* Top bar */}
        <div className="m-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur">
          <div className="min-w-0">
            <h3 className="uniwise-title font-display text-[18px] font-extrabold leading-tight tracking-tight">
              UniWise
            </h3>
            <p className="mt-0.5 text-[10px] text-[rgba(191,201,255,0.66)]">
              Source-grounded study assistant · CO2017 Software Engineering
            </p>
          </div>
          <div className="hidden gap-1.5 sm:flex">
            <Chip>RAG</Chip>
            <Chip>Cited</Chip>
            <Chip>Refusal · 0.40</Chip>
          </div>
        </div>

        {/* Step breadcrumb */}
        <div className="mx-3 flex flex-wrap items-center gap-1.5">
          <Step state="done">Question</Step>
          <Arrow />
          <Step state="done">Prereq</Step>
          <Arrow />
          <Step state="active">Concept</Step>
          <Arrow />
          <Step>Key points</Step>
          <Arrow />
          <Step>Example</Step>
          <Arrow />
          <Step>Self-check</Step>
        </div>

        {/* Main grid — answer (left) + scaffold (right) */}
        <div className="m-3 grid grid-cols-12 gap-3">
          {/* LEFT — Answer card */}
          <div
            className="col-span-12 rounded-2xl border border-white/10 p-4 backdrop-blur md:col-span-7"
            style={{
              background: 'rgba(30,58,90,0.12)',
              borderLeft: '3px solid rgba(99,179,237,0.55)',
            }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[13px] font-semibold text-[#93c5fd]">
                Grounded answer
              </h4>
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-2 py-0.5 text-[10px] text-white/65">
                3 sources · conf 0.87
              </span>
            </div>

            <p className="mt-3 text-[12.5px] leading-relaxed text-[rgba(235,240,255,0.94)]">
              A microservice architecture decomposes a system into independently
              deployable services that communicate over a network
              <Cite n={1} />. Compared to a monolith, this improves fault
              isolation and lets teams scale services individually
              <Cite n={2} />, but introduces operational overhead in
              observability and inter-service contracts
              <Cite n={3} />.
            </p>

            <div className="mt-3 h-px bg-white/10" />

            {/* Evidence rows */}
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.06em] text-[rgba(162,180,255,0.72)]">
              Evidence
            </p>
            <div className="mt-2 space-y-2">
              {[
                {
                  n: 1,
                  meta: 'Lecture 04 · Slide 12',
                  text: 'Microservices: independently deployable units communicating over the network…',
                },
                {
                  n: 2,
                  meta: 'Lecture 05 · Slide 03',
                  text: 'Fault isolation arises because failures stay scoped to a single service…',
                },
                {
                  n: 3,
                  meta: 'Reading: Newman ch. 1',
                  text: 'Operational overhead includes tracing, service contracts and orchestration…',
                },
              ].map((e, i) => (
                <motion.div
                  key={e.n}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="rounded-xl p-3 text-[11.5px] leading-snug"
                  style={{
                    background: 'rgba(4,8,20,0.40)',
                    border: '1px solid rgba(102,168,255,0.16)',
                    borderLeft: '3px solid #6aa8ff',
                    color: 'rgba(225,233,255,0.92)',
                  }}
                >
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-[rgba(162,180,255,0.66)]">
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold"
                      style={{ background: '#6aa8ff', color: '#06101F' }}
                    >
                      {e.n}
                    </span>
                    <span>{e.meta}</span>
                  </div>
                  <p>{e.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT — Scaffold blocks */}
          <div className="col-span-12 space-y-2 md:col-span-5">
            <ScaffoldBlock
              label="Concept"
              accent="rgba(139,92,246,0.75)"
              body="A microservice = an independently deployable service exposing a network API. Decomposition is by business capability, not by layer."
            />
            <ScaffoldBlock
              label="Key points"
              accent="rgba(59,130,246,0.75)"
              body={
                <ul className="ml-4 list-disc space-y-1">
                  <li>Independently deployable</li>
                  <li>Owned by a single small team</li>
                  <li>Communicates over the network (HTTP, gRPC, queue)</li>
                  <li>Has its own data store where possible</li>
                </ul>
              }
            />
            <ScaffoldBlock
              label="Example"
              accent="rgba(16,185,129,0.75)"
              body="An e-commerce platform splits into Catalog, Cart, Checkout, Payments and Notifications — each deployed, scaled and on-called independently."
            />
            <ScaffoldBlock
              label="Self-check"
              accent="rgba(245,158,11,0.75)"
              body="In one sentence: what does microservice ownership imply for the team’s on-call rota?"
            />

            <Misconception />
          </div>
        </div>

        {/* Hint callout */}
        <div className="m-3 mt-2">
          <div
            className="rounded-2xl p-3.5 text-[12px] leading-relaxed"
            style={{
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.22)',
              borderLeft: '3px solid rgba(74,222,128,0.60)',
              color: 'rgba(223,255,235,0.95)',
            }}
          >
            <span className="font-semibold text-[#a8f0c2]">Hint · </span>
            Trace one of these services from request to response. Where does the
            cost actually live — in the model, the network, or the contract?
          </div>
        </div>

        {/* Footer toolbar */}
        <div className="m-3 mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[11px] text-[rgba(186,198,255,0.68)] backdrop-blur">
          <span className="flex items-center gap-2">
            <span className="font-mono">↳ ask follow-up</span>
            <span className="text-white/25">·</span>
            <span>cite again</span>
            <span className="text-white/25">·</span>
            <span>explain like I’m new</span>
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <span
              className="rounded-md px-2 py-1 text-[10px] font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg,#6b5cff,#2db8e8)',
                boxShadow: '0 8px 20px rgba(64,102,255,0.28)',
              }}
            >
              Ask UniWise
            </span>
          </span>
        </div>
      </div>

      {/* Inline animation for the gradient title (avoids polluting global CSS) */}
      <style>{`
        .uniwise-title {
          background: linear-gradient(90deg,#c4b5fd,#7dd3fc,#6ee7b7,#c4b5fd);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: uniwiseGradient 5s linear infinite;
        }
        @keyframes uniwiseGradient {
          0% { background-position: 0% }
          100% { background-position: 200% }
        }
      `}</style>
    </div>
  )
}

/* ---------- small building blocks ---------- */

function Chip({ children }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 text-[10px] backdrop-blur"
      style={{
        background: 'rgba(124,140,255,0.10)',
        borderColor: 'rgba(156,172,255,0.18)',
        color: 'rgba(221,229,255,0.88)',
      }}
    >
      {children}
    </span>
  )
}

function Step({ state, children }) {
  const styles = {
    done: {
      color: 'rgba(110,231,183,0.85)',
      background: 'rgba(255,255,255,0.04)',
      borderColor: 'rgba(110,231,183,0.30)',
    },
    active: {
      color: '#eef2ff',
      background: 'rgba(107,92,255,0.22)',
      borderColor: 'rgba(107,92,255,0.50)',
    },
    default: {
      color: 'rgba(162,180,255,0.55)',
      background: 'rgba(255,255,255,0.04)',
      borderColor: 'rgba(255,255,255,0.08)',
    },
  }
  const s = styles[state] || styles.default
  return (
    <span
      className="rounded-full border px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.06em]"
      style={s}
    >
      {children}
    </span>
  )
}

function Arrow() {
  return <span className="text-[10px] text-white/25">›</span>
}

function ScaffoldBlock({ label, body, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl px-4 py-3"
      style={{
        background: 'rgba(255,255,255,0.045)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: `3px solid ${accent}`,
        boxShadow: '0 10px 24px rgba(0,0,0,0.16)',
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.06em]"
        style={{ color: 'rgba(162,180,255,0.72)' }}
      >
        {label}
      </p>
      <div
        className="mt-1.5 text-[12.5px] leading-relaxed"
        style={{ color: 'rgba(235,240,255,0.94)' }}
      >
        {body}
      </div>
    </motion.div>
  )
}

function Misconception() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl px-4 py-3"
      style={{
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.18)',
        borderLeft: '3px solid rgba(239,68,68,0.60)',
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.06em]"
        style={{ color: 'rgba(255,180,180,0.80)' }}
      >
        Common misconception
      </p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[rgba(255,228,228,0.92)]">
        “Microservices automatically scale better.” They don’t — they shift the
        scaling problem from process boundaries to the network.
      </p>
    </motion.div>
  )
}

function Cite({ n }) {
  return (
    <sup
      className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold"
      style={{ background: '#6aa8ff', color: '#06101F' }}
    >
      {n}
    </sup>
  )
}
