import { MotionConfig } from 'motion/react'
import { SmoothScroll } from './lib/smooth-scroll'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { Experience } from './components/Experience'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
        <div aria-hidden className="noise pointer-events-none fixed inset-0 z-[60] mix-blend-overlay" />
      </SmoothScroll>
    </MotionConfig>
  )
}
