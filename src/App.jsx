import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

import ThemeBackground from './components/ThemeBackground'
import ScrollProgress from './components/ScrollProgress'
import IntroOverlay from './components/IntroOverlay'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import ProjectIndex from './components/ProjectIndex'
import ProjectSection from './components/ProjectSection'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Writing from './components/Writing'
import Contact from './components/Contact'

import { mockups } from './components/mockups'

import { projects } from './data/content'
import { themes } from './data/themes'

// The shared map holds components; the detail sections want an element.
function renderMockup(id) {
  const Mock = mockups[id]
  return Mock ? <Mock /> : null
}

export default function App() {
  const [themeKey, setThemeKey] = useState('base')

  // Project sections push their theme up when scrolled into view; base
  // sections reset it back to the neutral software-artifact palette.
  const activate = useCallback((key) => setThemeKey(key), [])

  // The palette has to live on the common ancestor of the background AND
  // the content. It used to sit on ThemeBackground, which is a *sibling*
  // of <main>, so every accent on the page silently fell back to the
  // :root red and the project palettes only ever tinted the backdrop.
  const theme = themes[themeKey] || themes.base

  // Arriving on a link to a section (/#skills, or the 404 page's project
  // links). The browser tries to scroll to the fragment while it parses the
  // page, before React has rendered anything with that id, so it found
  // nothing and left the reader at the top. Once the fonts have settled the
  // layout, go there.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return undefined
    let cancelled = false
    const go = () => {
      const el = document.getElementById(id)
      if (cancelled || !el) return
      // scrollIntoView, not scrollTo, so the section's scroll-margin keeps
      // its heading clear of the fixed header.
      el.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    ;(document.fonts?.ready ?? Promise.resolve()).then(() => setTimeout(go, 0))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className="relative min-h-screen"
      style={{
        '--accent': theme.accent,
        '--accent-2': theme.accent2,
        '--muted': theme.muted,
        transition: 'color 0.8s ease',
      }}
    >
      <IntroOverlay />
      <ThemeBackground themeKey={themeKey} />
      <ScrollProgress />
      <Nav />

      <main className="relative z-10">
        <SectionTrigger onEnter={() => activate('base')}>
          <Hero />
        </SectionTrigger>

        <SectionTrigger onEnter={() => activate('base')}>
          <About />
        </SectionTrigger>

        <SectionTrigger onEnter={() => activate('base')}>
          <ProjectIndex />
        </SectionTrigger>

        <SectionTrigger onEnter={() => activate('base')}>
          <Experience />
        </SectionTrigger>

        {projects
          .filter((p) => !p.comingSoon)
          .map((p) => (
            <ProjectSection
              key={p.id}
              project={p}
              onActivate={activate}
              mockup={renderMockup(p.id)}
            />
          ))}

        <SectionTrigger onEnter={() => activate('base')}>
          <Skills />
        </SectionTrigger>

        <SectionTrigger onEnter={() => activate('base')}>
          <Writing />
        </SectionTrigger>

        <SectionTrigger onEnter={() => activate('base')}>
          <Contact />
        </SectionTrigger>
      </main>
    </div>
  )
}

// Resets the page theme back to `base` whenever a non-project section is in view.
function SectionTrigger({ children, onEnter }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.35, margin: '-15% 0px -15% 0px' })
  useEffect(() => {
    if (inView) onEnter?.()
  }, [inView, onEnter])
  return <div ref={ref}>{children}</div>
}
