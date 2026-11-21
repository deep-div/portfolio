import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { Project } from '../../data/content'
import { ExpandIcon, PlayIcon } from '../ui/Icons'
import { ease } from '../ui/Reveal'
import { Lightbox } from './Lightbox'

/** Browser-framed media player: autoplays the walkthrough in view, with a thumbnail strip and fullscreen gallery. */
export function MediaShowcase({ project }: { project: Project }) {
  const { media, slug, domain, title } = project
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(frameRef, { amount: 0.35 })
  const reduceMotion = useReducedMotion()
  const progress = useMotionValue(0)
  const item = media[active]

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView && lightbox === null && !reduceMotion) v.play().catch(() => {})
    else v.pause()
  }, [inView, active, lightbox, reduceMotion])

  return (
    <div>
      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-xl border border-line-strong bg-surface-2 shadow-frame"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-wash px-3 py-2.5 sm:px-4">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="size-2.5 rounded-full bg-[#28c840]/80" />
          </div>
          <div className="mx-auto flex max-w-[60%] min-w-0 items-center gap-1.5 rounded-md bg-wash px-3 py-1 text-[11px] text-muted">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <span className="truncate">{domain}</span>
          </div>
          <button
            onClick={() => setLightbox(active)}
            aria-label={`Open ${title} gallery fullscreen`}
            className="grid size-7 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-wash-strong hover:text-fg"
          >
            <ExpandIcon width={14} height={14} />
          </button>
        </div>

        {/* Stage */}
        <button
          onClick={() => setLightbox(active)}
          aria-label={`View ${item.label} larger`}
          className="group/stage relative block aspect-[1920/900] w-full cursor-zoom-in overflow-hidden bg-surface-2"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={item.src}
              initial={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              className="absolute inset-0"
            >
              {item.type === 'video' ? (
                <video
                  ref={videoRef}
                  src={item.src}
                  poster={item.poster}
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
              ) : (
                <img
                  src={item.src}
                  alt={`${title} — ${item.label}`}
                  loading="lazy"
                  className="size-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover/stage:scale-[1.02]"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
            {item.label}
          </span>

          {item.type === 'video' && (
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
              style={{ scaleX: progress, background: 'var(--pa)' }}
            />
          )}
        </button>
      </div>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label={`${title} media`}>
        {media.map((m, i) => (
          <button
            key={m.src}
            role="tab"
            aria-selected={i === active}
            aria-label={m.label}
            onClick={() => setActive(i)}
            className={`relative aspect-[16/9] w-[4.5rem] shrink-0 cursor-pointer overflow-hidden rounded-md transition-opacity duration-300 sm:w-20 ${
              i === active ? 'opacity-100' : 'opacity-45 hover:opacity-85'
            }`}
          >
            <img src={m.type === 'video' ? m.poster : m.src} alt="" loading="lazy" className="size-full object-cover object-top" />
            {m.type === 'video' && (
              <span className="absolute inset-0 grid place-items-center bg-black/35 text-white">
                <PlayIcon width={12} height={12} />
              </span>
            )}
            {i === active ? (
              <motion.span
                layoutId={`thumb-${slug}`}
                className="absolute inset-0 rounded-md ring-2 ring-inset"
                style={{ ['--tw-ring-color' as string]: 'var(--pa)' }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            ) : (
              <span className="absolute inset-0 rounded-md ring-1 ring-line ring-inset" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox title={title} items={media} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
