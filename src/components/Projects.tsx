import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { projects, type Project } from '../data/content'
import { useMediaQuery } from '../lib/useMediaQuery'
import { MediaShowcase } from './projects/MediaShowcase'
import { ArrowUpRight, CheckIcon, GithubIcon } from './ui/Icons'
import { ease } from './ui/Reveal'
import { Accent, SectionHeading } from './ui/SectionHeading'

const STACK_QUERY = '(min-width: 1024px) and (min-height: 720px)'

interface CardProps {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
  stacked: boolean
}

function ProjectCard({ project, index, total, progress, stacked }: CardProps) {
  const isLast = index === total - 1
  const start = index / total
  // Each card shrinks and dims slightly as the next one slides over it.
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.045])
  const dim = useTransform(progress, [start, 1], [0, isLast ? 0 : 0.5])
  const flip = index % 2 === 1

  return (
    <div className="mb-6 last:mb-0 stack:sticky stack:top-0 stack:mb-0 stack:flex stack:h-svh stack:items-center">
      <motion.article
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1, ease }}
        style={{ ...(stacked ? { scale, top: `calc(${index} * 18px)` } : {}), ["--project-color" as string]: project.accent }}
        className="project-card relative w-full origin-top overflow-hidden rounded-[26px] border border-line-strong bg-surface p-4 shadow-card sm:p-6 lg:p-8"
      >
        {/* Accent glow */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-48 size-[520px] rounded-full opacity-[0.16] blur-[120px] ${flip ? '-left-32' : '-right-32'}`}
          style={{ background: 'var(--pa)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--pa) 40%, transparent), transparent)" }}
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-last' : ''}`}>
            <div className="mb-5 flex items-baseline gap-2">
              <span className="font-serif text-4xl italic" style={{ color: 'var(--pa)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm text-faint">/ {String(total).padStart(2, '0')}</span>
            </div>

            <h3 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{project.title}</h3>
            <p className="mt-2 text-lg text-fg/85">{project.tagline}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.description}</p>

            <ul className="mt-6 space-y-2.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-fg/80">
                  <span
                    className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full"
                    style={{ background: 'color-mix(in srgb, var(--pa) 14%, transparent)', color: 'var(--pa)' }}
                  >
                    <CheckIcon width={11} height={11} strokeWidth={3} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className="rounded-full border border-line bg-wash px-3 py-1 text-xs font-medium text-muted">
                  {t}
                </span>
              ))}
            </div>

            {(project.liveUrl || project.repoUrl) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-fg px-5 text-sm font-semibold text-bg transition-transform active:scale-[0.97]"
                  >
                    Live site
                    <ArrowUpRight width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-5 text-sm font-semibold text-fg transition-colors hover:bg-wash-strong"
                  >
                    <GithubIcon width={16} height={16} />
                    Source
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="min-w-0 lg:col-span-7">
            <MediaShowcase project={project} />
          </div>
        </div>

        {stacked && !isLast && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[26px] bg-bg" style={{ opacity: dim }} />
        )}
      </motion.article>
    </div>
  )
}

export function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const stacked = useMediaQuery(STACK_QUERY)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section id="projects" className="relative pt-28 sm:pt-40">
      <div className="container-x">
        <SectionHeading
          index="02"
          label="Selected work"
          title={
            <>
              Things I&apos;ve <Accent>built</Accent>
            </>
          }
          description="Products I designed and developed end to end. Each one has a real walkthrough — click any screen to explore it fullscreen."
        />
      </div>
      <div ref={ref} className="container-x pb-10 stack:pb-0">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} total={projects.length} progress={scrollYProgress} stacked={stacked} />
        ))}
      </div>
    </section>
  )
}
