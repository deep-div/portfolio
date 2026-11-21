import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { experience, profile, projects } from '../data/content'
import { CountUp } from './ui/CountUp'
import { Reveal } from './ui/Reveal'
import { Accent, SectionHeading } from './ui/SectionHeading'
import { SpotlightCard } from './ui/SpotlightCard'

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const blur = useTransform(progress, range, [4, 0])
  const filter = useTransform(blur, (b) => `blur(${b}px)`)
  return (
    <motion.span style={{ opacity, filter }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  )
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')
  return (
    <p
      ref={ref}
      className="text-[1.65rem] leading-[1.3] font-medium tracking-[-0.025em] text-fg sm:text-4xl lg:text-[2.6rem]"
    >
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

export function About() {
  const stats = [
    { value: profile.yearsOfExperience, suffix: '+', label: 'Years building for the web' },
    { value: projects.length, suffix: '', label: 'Products shipped end to end' },
    { value: experience.length, suffix: '', label: 'Companies worked with' },
  ]

  return (
    <section id="about" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionHeading title={<>Building products that <Accent>feel</Accent> effortless</>} />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <ScrollRevealText text={profile.about} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <SpotlightCard className="p-6">
                  <div className="text-5xl font-semibold tracking-[-0.04em] text-fg">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{s.label}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
