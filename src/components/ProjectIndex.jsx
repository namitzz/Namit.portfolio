import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { projects } from '../data/content'
import { mockups } from './mockups'
import Reveal from './Reveal'

/**
 * Work index as an editorial list that opens up under the cursor.
 *
 * Idle it is what it was: number, serif name, mono metadata, hairline
 * rules. The list has to be worth looking at when nothing is happening,
 * so the preview is the reward for pointing at something, never the
 * thing holding the composition together.
 *
 * The previews are the same mockups the detail sections render, drawn at
 * full width and scaled down rather than rebuilt small. Two reasons:
 * these mockups reflow taller as they narrow, so a small box would make
 * them bigger, not smaller; and a second set of miniatures would be a
 * second thing to keep true to each project. They are stylised
 * representations, labelled as such in their own headers.
 *
 * Only the active project's mockup is mounted, so at most one is running
 * at a time no matter how many rows exist.
 *
 * Desktop and touch get different structures rather than one structure
 * with hover bolted on: on a fine pointer the row is a link and the
 * preview floats beside it; on touch the row expands in place, because
 * there is no hover to reward and six inline mockups would be six
 * animations running behind each other.
 */

const PREVIEW_W = 440
const PREVIEW_H = 300
// The width the mockups are drawn at before being scaled into the frame.
const MOCK_W = 1180

export default function ProjectIndex() {
  const fine = useMediaQuery('(min-width: 768px) and (pointer: fine)')

  return (
    <section
      id="work"
      className="relative px-6 py-24 md:px-16 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, rgba(245,180,71,0.075) 0%, rgba(245,180,71,0.010) 26%, rgba(244,244,245,0.038) 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <Reveal
          className="mb-16 flex flex-wrap items-end justify-between gap-4 border-b pb-6"
          style={{ borderColor: 'var(--hairline)' }}
        >
          <div>
            <p className="eyebrow">Selected work</p>
            <h2
              className="serif mt-3 text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ color: 'var(--ink)' }}
            >
              Projects<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <p className="mono-label" style={{ color: 'var(--muted)' }}>
            {projects.length} · 2024–2026
          </p>
        </Reveal>

        {fine ? <PointerIndex /> : <TouchIndex />}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop                                                             */
/* ------------------------------------------------------------------ */

function PointerIndex() {
  const reduce = useReducedMotion()
  const listRef = useRef(null)
  const [activeId, setActiveId] = useState(null)

  // The panel tracks the cursor down the list, clamped so it never
  // escapes the list's own bounds.
  const rawY = useMotionValue(0)
  const y = useSpring(rawY, { stiffness: 220, damping: 30, mass: 0.6 })

  const onMove = (e) => {
    const box = listRef.current?.getBoundingClientRect()
    if (!box) return
    const centred = e.clientY - box.top - PREVIEW_H / 2
    rawY.set(Math.max(0, Math.min(centred, box.height - PREVIEW_H)))
  }

  const active = projects.find((p) => p.id === activeId) || null

  return (
    <div
      ref={listRef}
      className="relative"
      onMouseMove={reduce ? undefined : onMove}
      onMouseLeave={() => setActiveId(null)}
    >
      <ul>
        {projects.map((p, i) => (
          <PointerRow
            key={p.id}
            project={p}
            index={i}
            active={activeId === p.id}
            // Rows step back only once something else is active, so the
            // idle list is never dimmed.
            dimmed={activeId !== null && activeId !== p.id}
            onEnter={() => setActiveId(p.id)}
          />
        ))}
      </ul>

      {/* One panel for the whole list, not one per project.
          Keyed-per-project inside AnimatePresence, the outgoing panel
          stays mounted for the length of its exit, so sweeping the list
          stacked every mockup it passed and left them all animating.
          A single persistent panel that swaps its contents can only ever
          hold one. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-20 overflow-hidden border"
        style={{
          y: reduce ? 0 : y,
          width: PREVIEW_W,
          height: PREVIEW_H,
          borderColor: 'var(--accent)',
          background: '#080706',
          boxShadow: '0 40px 90px -50px rgba(0,0,0,0.9)',
        }}
        animate={
          reduce
            ? { opacity: active ? 1 : 0 }
            : { opacity: active ? 1 : 0, scale: active ? 1 : 0.97 }
        }
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {active && <PreviewFrame project={active} />}
      </motion.div>
    </div>
  )
}

function PointerRow({ project, index, active, dimmed, onEnter }) {
  const isLinked = !project.comingSoon
  const accent = active ? 'var(--accent)' : 'var(--muted)'

  const body = (
    <div
      className="grid grid-cols-[4rem_1fr_10rem_5rem_2.5rem] items-baseline gap-6 py-10 transition-opacity duration-300"
      style={{ opacity: dimmed ? 0.4 : 1 }}
    >
      <span
        className="mono-label transition-colors duration-300"
        style={{ color: accent }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div>
        <h3
          className="serif text-[clamp(1.5rem,3vw,2.4rem)] leading-[1] tracking-[-0.015em] transition-transform duration-500"
          style={{
            color: 'var(--ink)',
            transform: active ? 'translateX(10px)' : 'translateX(0)',
            transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {project.title}
        </h3>
        {project.comingSoon && (
          <p className="mono-label mt-2" style={{ color: 'var(--muted)' }}>
            Coming soon
          </p>
        )}
      </div>

      <span
        className="mono-label transition-colors duration-300"
        style={{ color: active ? 'var(--ink-soft)' : 'var(--muted)' }}
      >
        {project.domain || '—'}
      </span>
      <span
        className="mono-label transition-colors duration-300"
        style={{ color: active ? 'var(--ink-soft)' : 'var(--muted)' }}
      >
        {project.year || '—'}
      </span>

      {/* The arrow hands the affordance over to the panel: there is not
          enough clear width between the longest title and the right
          margin for a preview and a call to action side by side, so the
          call to action lives inside the preview and the arrow steps out
          of its way. */}
      <span
        aria-hidden="true"
        className="serif block text-right text-[1.8rem] leading-none transition-all duration-300"
        style={{
          color: active ? 'var(--accent)' : isLinked ? 'var(--ink)' : 'var(--muted)',
          opacity: active ? 0 : 1,
          transform: active ? 'translateX(14px)' : 'translateX(0)',
        }}
      >
        {isLinked ? '→' : '·'}
      </span>
    </div>
  )

  return (
    <Reveal
      as="li"
      y={16}
      duration={0.45}
      delay={index * 0.04}
      className="border-b"
      style={{ borderColor: active ? 'var(--accent)' : 'var(--hairline)' }}
      onMouseEnter={onEnter}
    >
      {isLinked ? (
        <a href={`#${project.id}`} aria-label={`Jump to ${project.title}`} className="block">
          {body}
        </a>
      ) : (
        <div className="block opacity-70">{body}</div>
      )}
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/* Touch                                                               */
/* ------------------------------------------------------------------ */

function TouchIndex() {
  const [openId, setOpenId] = useState(null)

  return (
    <ul>
      {projects.map((p, i) => (
        <TouchRow
          key={p.id}
          project={p}
          index={i}
          open={openId === p.id}
          onToggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))}
        />
      ))}
    </ul>
  )
}

function TouchRow({ project, index, open, onToggle }) {
  const isLinked = !project.comingSoon

  return (
    <Reveal
      as="li"
      y={16}
      duration={0.45}
      delay={index * 0.04}
      className="border-b"
      style={{ borderColor: open ? 'var(--accent)' : 'var(--hairline)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-4 py-7 text-left"
      >
        <span
          className="mono-label pt-1.5 transition-colors"
          style={{ color: open ? 'var(--accent)' : 'var(--muted)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className="serif block text-[1.6rem] leading-[1.1] tracking-[-0.015em]"
            style={{ color: 'var(--ink)' }}
          >
            {project.title}
          </span>
          <span className="mono-label mt-2 block" style={{ color: 'var(--muted)' }}>
            {[project.domain, project.year].filter(Boolean).join(' · ') || '—'}
          </span>
        </span>

        {/* A plus that becomes a minus: the clearest possible statement
            that the row opens rather than navigates. */}
        <span
          aria-hidden="true"
          className="relative mt-2 block h-3 w-3 shrink-0"
          style={{ color: open ? 'var(--accent)' : 'var(--ink)' }}
        >
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ background: 'currentColor' }} />
          <span
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transition-transform duration-300"
            style={{ background: 'currentColor', transform: open ? 'scaleY(0)' : 'scaleY(1)' }}
          />
        </span>
      </button>

      {/* Plain conditional render. An animated height here would leave the
          panel collapsed whenever the animation did not run. */}
      {open && (
        <div className="pb-9">
          <div
            className="relative overflow-hidden border"
            style={{
              height: 210,
              borderColor: 'var(--hairline)',
              background: '#080706',
            }}
          >
            <PreviewFrame project={project} width={PREVIEW_W} height={210} />
          </div>

          {isLinked && (
            <a
              href={`#${project.id}`}
              className="mt-5 inline-flex items-center gap-2.5 border px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.18em]"
              style={{
                color: 'var(--accent)',
                borderColor: 'var(--accent)',
                background: 'rgba(244,85,42,0.07)',
              }}
            >
              View project
              <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      )}
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */

/**
 * The mockup at full width, scaled into the frame. Scaling rather than
 * resizing is deliberate: these mockups have intrinsic heights and reflow
 * taller as they narrow, so constraining the width would make them taller,
 * not smaller.
 *
 * The frame shows the top of the mockup, which is where each one puts its
 * label and its main panel, and fades out at the bottom edge so the crop
 * reads as a crop.
 */
function PreviewFrame({ project, width = PREVIEW_W, height = PREVIEW_H }) {
  const Mock = mockups[project.id]
  if (!Mock) return null

  const scale = width / MOCK_W

  return (
    <>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: MOCK_W, transform: `scale(${scale})` }}
      >
        <div className="p-5">
          <Mock />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
        style={{
          background: 'linear-gradient(180deg, transparent, #080706)',
        }}
      />
      <span
        className="pointer-events-none absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-[0.2em]"
        style={{ color: 'rgba(244,244,245,0.42)' }}
      >
        {project.domain}
      </span>
      {/* Visual only: the whole row is the link, so this states what a
          click does without becoming a second click target inside it. */}
      <span
        className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em]"
        style={{
          color: 'var(--accent)',
          borderColor: 'var(--accent)',
          background: 'rgba(244,85,42,0.09)',
        }}
      >
        View project
        <span aria-hidden="true">↓</span>
      </span>
    </>
  )
}

/** Matches a media query, and keeps matching when it changes. */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
