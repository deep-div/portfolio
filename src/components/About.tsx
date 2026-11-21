import { motion, useScroll, useTransform, type MotionValue, type Variants } from 'motion/react'
import { Fragment, useRef } from 'react'
import { experience, profile, projects } from '../data/content'
import { CountUp } from './ui/CountUp'
import { ease } from './ui/Reveal'
import { Accent, SectionHeading } from './ui/SectionHeading'

/* ─── Statement ──────────────────────────────────────────────── */

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const filter = useTransform(progress, range, ['blur(4px)', 'blur(0px)'])
  return (
    <motion.span style={{ opacity, filter }} className="inline-block">
      {children}
    </motion.span>
  )
}

/** The About paragraph: words light up one by one as it scrolls through the viewport. */
function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <p
      ref={ref}
      className="max-w-5xl text-[1.45rem] leading-[1.38] font-medium tracking-[-0.025em] text-fg sm:text-3xl lg:text-[2.15rem]"
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>{' '}
        </Fragment>
      ))}
    </p>
  )
}

/* ─── Stats row ──────────────────────────────────────────────── */

const row: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } }
const drawX: Variants = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.3, ease } } }
const drawY: Variants = { hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.9, ease } } }
const lift: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
}

function Stats() {
  const stats = [
    { value: profile.yearsOfExperience, suffix: '+', label: 'Years building software' },
    { value: projects.length, suffix: '', label: 'Live products shipped' },
    { value: experience.length, suffix: '', label: 'Companies worked with' },
  ]

  return (
    <motion.div
      variants={row}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      className="relative grid grid-cols-3 lg:grid-cols-1"
    >
      {/* Top rule draws across first, then each stat rises in. */}
      <motion.span aria-hidden variants={drawX} className="absolute inset-x-0 top-0 h-px origin-left bg-line-strong" />

      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          variants={lift}
          className={`relative pt-7 sm:pt-9 lg:py-6 lg:pl-0 ${i > 0 ? 'pl-4 sm:pl-10' : ''}`}
        >
          {/* Between stats: a vertical line in the row layout, a horizontal one in the stacked (desktop) layout. */}
          {i > 0 && (
            <>
              <motion.span aria-hidden variants={drawY} className="absolute top-0 left-0 h-full w-px origin-top bg-line lg:hidden" />
              <motion.span aria-hidden variants={drawX} className="absolute inset-x-0 top-0 hidden h-px origin-left bg-line lg:block" />
            </>
          )}
          <div className="text-4xl font-semibold tracking-[-0.045em] text-fg tabular-nums sm:text-6xl lg:text-5xl">
            <CountUp to={s.value} suffix={s.suffix} />
          </div>
          <p className="mt-2 max-w-[11rem] text-xs leading-snug text-muted sm:text-sm">{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export function About() {
  return (
    <section id="about" className="relative pt-24 pb-6 sm:pt-32 sm:pb-10">
      <div className="container-x">
        <SectionHeading
          title={
            <>
              A little about <Accent>me</Accent>
            </>
          }
        />
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-8">
            <Statement text={profile.about} />
          </div>
          <div className="lg:col-span-4">
            <Stats />
          </div>
        </div>
      </div>
    </section>
  )
}
