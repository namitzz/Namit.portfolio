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
import Education from './components/Education'
import Skills from './components/Skills'
import Writing from './components/Writing'
import Contact from './components/Contact'

import UniWiseMock from './components/mockups/UniWiseMock'
import VisionMock from './components/mockups/VisionMock'
import CloudSevenMock from './components/mockups/CloudSevenMock'
import CrimeMock from './components/mockups/CrimeMock'
import CourseCompanionMock from './components/mockups/CourseCompanionMock'
import TovoMock from './components/mockups/TovoMock'

import { projects } from './data/content'

// Each project id maps to a JSX mockup. Keeps ProjectSection generic.
const mockups = {
  uniwise: <UniWiseMock />,
  vision: <VisionMock />,
  cloud: <CloudSevenMock />,
  crime: <CrimeMock />,
  course: <CourseCompanionMock />,
  tovo: <TovoMock />,
}

const accentLabels = {
  uniwise: 'RAG · EdTech',
  vision: 'Computer Vision',
  cloud: 'Brand · Frontend',
  crime: 'Data Science',
  course: 'Spring Boot · MySQL',
  tovo: 'React · Supabase',
}

export default function App() {
  const [themeKey, setThemeKey] = useState('base')

  // Project sections push their theme up when scrolled into view; base
  // sections reset it back to the neutral software-artifact palette.
  const activate = useCallback((key) => setThemeKey(key), [])

  return (
    <div className="relative min-h-screen">
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

        {projects
          .filter((p) => !p.comingSoon)
          .map((p) => (
            <ProjectSection
              key={p.id}
              project={p}
              onActivate={activate}
              mockup={mockups[p.id]}
              accentLabel={accentLabels[p.id]}
            />
          ))}

        <SectionTrigger onEnter={() => activate('base')}>
          <Experience />
        </SectionTrigger>

        <SectionTrigger onEnter={() => activate('base')}>
          <Education />
        </SectionTrigger>

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
