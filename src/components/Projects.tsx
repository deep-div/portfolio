import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { projects, type Project } from '../data/content'
import { Lightbox } from './projects/Lightbox'
import { ArrowUpRight, ExpandIcon, GithubIcon } from './ui/Icons'
import { ease } from './ui/Reveal'
import { Accent, SectionHeading } from './ui/SectionHeading'

/* ─── Text reveal choreography ───────────────────────────────── */

const column: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
}
const titleWords: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const titleWord: Variants = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.9, ease } },
}
const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease } },
}
const tagList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const tagPop: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 24 } },
}

/* ─── Video ──────────────────────────────────────────────────── */

interface VideoProps {
  project: Project
  /** Video sits on the right on large screens. */
  flip: boolean
  paused: boolean
  onOpen: () => void
}

/**
 * Looping walkthrough. Wipes in from its own side and plays only while on screen.
 * The frame keeps the video's own shape, so the whole screen is always visible.
 * A fullscreen button appears in the top-right corner on hover (always shown on touch).
 */
function ProjectVideo({ project, flip, paused, onOpen }: VideoProps) {
  const video = project.media.find((m) => m.type === 'video')
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(frameRef, { amount: 0.4 })
  const reduce = useReducedMotion()
  const progress = useMotionValue(0)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView && !paused && !reduce) v.play().catch(() => {})
    else v.pause()
  }, [inView, paused, reduce])

  const hidden = flip ? 'inset(0% 0% 0% 100% round 20px)' : 'inset(0% 100% 0% 0% round 20px)'
  const shown = 'inset(0% 0% 0% 0% round 20px)'

  return (
    <div>
      <motion.div
        ref={frameRef}
        initial={{ clipPath: hidden }}
        whileInView={{ clipPath: shown }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.4, ease }}
        className="group relative w-full overflow-hidden rounded-[20px] bg-surface-2"
        style={{ aspectRatio: video?.type === 'video' && video.aspect ? video.aspect : '16/9' }}
      >
        <motion.div
          initial={{ scale: 1.25 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1.8, ease }}
          className="absolute inset-0"
        >
          {video?.type === 'video' && (
            <video
              ref={videoRef}
              src={video.src}
              poster={video.poster}
              muted
              loop
              playsInline
              preload="metadata"
              onTimeUpdate={(e) => {
                const v = e.currentTarget
                if (v.duration) progress.set(v.currentTime / v.duration)
              }}
              className="size-full object-contain"
            />
          )}
        </motion.div>

        {/* Hairline edge, drawn on top so the video doesn't cover it. */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-line ring-inset" />

        {/* Loop progress */}
        <motion.span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
          style={{ scaleX: progress, background: 'var(--pa)' }}
        />

        {/* Fullscreen: fades in on hover with a mouse, always visible on touch screens. */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open ${project.title} fullscreen`}
          title="Fullscreen"
          className="absolute top-3 right-3 grid size-9 cursor-pointer place-items-center rounded-full bg-black/55 text-white backdrop-blur-md transition-all duration-300 ease-out hover:scale-110 hover:bg-black/75 focus-visible:opacity-100 [@media(hover:hover)]:-translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:translate-y-0"
        >
          <ExpandIcon width={15} height={15} />
        </button>
      </motion.div>
    </div>
  )
}

/* ─── One featured project ───────────────────────────────────── */

function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const flip = index % 2 === 1

  return (
    <article
      className="project-card relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20"
      style={{ ['--project-color' as string]: project.accent }}
    >
      <div className={`min-w-0 lg:col-span-8 ${flip ? 'lg:order-last' : ''}`}>
        <ProjectVideo project={project} flip={flip} paused={lightbox !== null} onOpen={() => setLightbox(0)} />
      </div>

      <motion.div
        variants={column}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        className="min-w-0 lg:col-span-4"
      >
        <motion.span variants={rule} aria-hidden className="mb-6 block h-px w-12 origin-left bg-line-strong" />

        <motion.h3
          variants={titleWords}
          aria-label={project.title}
          className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
        >
          {project.title.split(' ').map((w, i) => (
            <span key={i} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0">
              <motion.span variants={titleWord} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h3>

        <motion.p variants={rise} className="mt-3 text-lg leading-snug text-muted">
          {project.tagline}
        </motion.p>

        <motion.ul variants={tagList} className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.tags.map((t) => (
            <motion.li
              key={t}
              variants={tagPop}
              className="rounded-full border border-line bg-wash px-3 py-1 text-xs font-medium text-muted"
            >
              {t}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex h-10 items-center gap-1.5 rounded-full bg-fg px-5 text-sm font-semibold text-bg transition-transform active:scale-[0.97]"
            >
              Live site
              <ArrowUpRight
                width={16}
                height={16}
                className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
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
          <button
            type="button"
            onClick={() => setLightbox(0)}
            className="group/screens relative inline-flex h-10 cursor-pointer items-center gap-2 px-1 text-sm font-semibold text-fg"
          >
            <ExpandIcon width={14} height={14} />
            View all screens
            <span className="absolute inset-x-1 bottom-1.5 h-px origin-left scale-x-0 bg-fg transition-transform duration-500 ease-out group-hover/screens:scale-x-100" />
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            title={project.title}
            items={project.media}
            index={lightbox}
            onIndex={setLightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </article>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export function Projects() {
  return (
    <section id="projects" className="relative pt-28 sm:pt-40">
      <div className="container-x">
        <SectionHeading
          title={
            <>
              Things I&apos;ve <Accent>built</Accent>
            </>
          }
          description="Products I designed and developed end to end. Each walkthrough plays on its own — open any one fullscreen to explore every screen."
        />
        <div className="-mt-10 sm:-mt-16">
          {projects.map((p, i) => (
            <FeaturedProject key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
