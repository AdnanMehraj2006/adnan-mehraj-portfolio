import { useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useNarrowDevice } from './hooks/useNarrowDevice'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { ProblemSolving } from './components/ProblemSolving'
import { Achievements } from './components/Achievements'
import { EngineeringJourney } from './components/EngineeringJourney'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ScrollProgress } from './components/ScrollProgress'
import { CustomCursor } from './components/CustomCursor'
import { EasterEgg } from './components/EasterEgg'

const JOURNEY_SECTION = {
  id: 'journey',
  component: <EngineeringJourney />,
}

export default function App() {
  const [focusedProjects, setFocusedProjects] = useState<string[]>([])
  useNarrowDevice()

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Skills onFocusProjects={setFocusedProjects} />
        <Projects focusedProjects={focusedProjects} />
        <ProblemSolving />
        <Achievements />
        {JOURNEY_SECTION.component}
        <Contact />
      </main>

      <Footer />
      <EasterEgg />
    </MotionConfig>
  )
}
