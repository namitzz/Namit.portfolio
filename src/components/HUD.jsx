import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Fixed corner HUD. Shows current section + scroll %. Reads like the
 * status line of a debugger. Hidden on very small screens so it does
 * not eat mobile viewport.
 */
const sections = [
  { id: 'top', label: 'identity' },
  { id: 'work', label: 'work' },
  { id: 'about', label: 'about' },
  { id: 'skills', label: 'skills' },
  { id: 'experience', label: 'experience' },
  { id: 'contact', label: 'contact' },
]

export default function HUD() {
  const [pct, setPct] = useState(0)
  const [active, setActive] = useState('identity')

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      const p = total > 0 ? window.scrollY / total : 0
      setPct(Math.min(1, Math.max(0, p)))

      // Which section is closest to top?
      let current = sections[0].label
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top - 120 <= 0) current = s.label
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.aside
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      aria-hidden="true"
      className="fixed bottom-4 right-4 z-40 hidden select-none border border-white/10 bg-black/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 backdrop-blur-sm sm:block"
    >
      <div className="flex items-center gap-3">
        <span>§ {active}</span>
        <span className="text-white/20">|</span>
        <span>{String(Math.round(pct * 100)).padStart(3, '0')}%</span>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 0 6px var(--accent)',
          }}
        />
      </div>
    </motion.aside>
  )
}
