import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { experience } from '../data/content'
import { ease } from './ui/Reveal'
import { Accent, SectionHeading } from './ui/SectionHeading'
import { SpotlightCard } from './ui/SpotlightCard'

export function Experience() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.55'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="experience" className="relative pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="Experience"
          title={
            <>
              Where I&apos;ve <Accent>worked</Accent>
            </>
          }
        />

        <ol ref={ref} className="relative max-w-4xl">
          {/* Track + scroll-driven fill */}
          <span aria-hidden className="absolute top-3 bottom-3 left-[11px] w-px bg-line" />
          <motion.span
            aria-hidden
            style={{ scaleY }}
            className="absolute top-3 bottom-3 left-[11px] w-px origin-top bg-accent-gradient"
          />

          {experience.map((job, i) => (
            <li key={`${job.company}-${i}`} className="relative pb-6 pl-10 last:pb-0 sm:pl-14">
              <motion.span
                aria-hidden
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '0px 0px -30% 0px' }}
                transition={{ duration: 0.6, ease }}
                className="absolute top-7 left-0 grid size-[23px] place-items-center rounded-full border border-line-strong bg-bg"
              >
                <span className="size-2 rounded-full bg-accent-gradient shadow-[0_0_12px_2px_var(--color-glow-1)]" />
              </motion.span>

              <motion.div
                initial={{ opacity: 0, x: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ duration: 0.8, ease, delay: 0.05 }}
              >
                <SpotlightCard className="p-5 sm:p-7">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h3 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                      {job.role}
                      <span className="text-faint"> · </span>
                      <span className="text-gradient">{job.company}</span>
                    </h3>
                    <span className="shrink-0 text-sm text-muted tabular-nums">{job.period}</span>
                  </div>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{job.summary}</p>
                  {job.tags && job.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.tags.map((t) => (
                        <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </SpotlightCard>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
