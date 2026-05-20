import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

import ThemeBackground from './components/ThemeBackground'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import WorkIntro from './components/WorkIntro'
import ProjectIndex from './components/ProjectIndex'
import ProjectSection from './components/ProjectSection'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Writing from './components/Writing'
import Contact from './components/Contact'

import UniWiseMock from './components/mockups/UniWiseMock'
import VisionMock from './components/mockups/VisionMock'
import CloudSevenMock from './components/mockups/CloudSevenMock'
import CrimeMock from './components/mockups/CrimeMock'
import CourseCompanionMock from './components/mockups/CourseCompanionMock'

import { projects } from './data/content'

// Each project id maps to a JSX mockup. Keeps ProjectSection generic.
const mockups = {
  uniwise: <UniWiseMock />,
  vision: <VisionMock />,
  cloud: <CloudSevenMock />,
  crime: <CrimeMock />,
  course: <CourseCompanionMock />,
}

const accentLabels = {
  uniwise: 'RAG · EdTech',
  vision: 'Computer Vision',
  cloud: 'Brand · Frontend',
  crime: 'Data Science',
  course: 'Spring Boot · MySQL',
}

const marqueeItems = [
  'Python',
  'FastAPI',
  'Java',
  'Spring Boot',
  'MySQL',
  'React',
  'Tailwind',
  'Framer Motion',
  'ChromaDB',
  'sentence-transformers',
  'OpenAI',
  'Ollama',
  'OpenCV',
  'MediaPipe',
  'Pandas',
  'scikit-learn',
  'NumPy',
  'Streamlit',
  'Docker',
  'Git',
]

export default function App() {
  const [themeKey, setThemeKey] = useState('base')

  // Project sections + base wrappers push their theme up when scrolled into view.
  const activate = useCallback((key) => setThemeKey(key), [])

  return (
    <div className="relative min-h-screen">
      <ThemeBackground themeKey={themeKey} />
      <CursorGlow />
      <ScrollProgress />
      <Nav themeKey={themeKey} />

      <main className="relative z-10">
        <SectionTrigger onEnter={() => activate('base')}>
          <Hero />
        </SectionTrigger>

        {/* Tech marquee — sits between Hero and About */}
        <div className="relative z-10 border-y border-white/5 bg-white/[0.015]">
          <Marquee items={marqueeItems} speed={36} />
        </div>

        <SectionTrigger onEnter={() => activate('base')}>
          <About />
        </SectionTrigger>

        <WorkIntro />
        <ProjectIndex />

        {projects.map((p) => (
          <ProjectSection
            key={p.id}
            project={p}
            onActivate={activate}
            mockup={mockups[p.id]}
            accentLabel={accentLabels[p.id]}
          />
        ))}

        <SectionTrigger onEnter={() => activate('base')}>
          <Writing />
        </SectionTrigger>

        <SectionTrigger onEnter={() => activate('base')}>
          <Skills />
        </SectionTrigger>

        <SectionTrigger onEnter={() => activate('base')}>
          <Experience />
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
