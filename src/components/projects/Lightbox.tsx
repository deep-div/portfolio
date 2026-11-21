import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { MediaItem } from '../../data/content'
import { useLenis } from '../../lib/smooth-scroll'
import { ChevronLeft, ChevronRight, CloseIcon, PlayIcon } from '../ui/Icons'
import { ease } from '../ui/Reveal'

interface Props {
  title: string
  items: MediaItem[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}

export function Lightbox({ title, items, index, onIndex, onClose }: Props) {
  const lenis = useLenis()
  const [direction, setDirection] = useState(1)
  const item = items[index]

  const go = (step: number) => {
    setDirection(step)
    onIndex((index + step + items.length) % items.length)
  }

  useEffect(() => {
    lenis?.stop()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = prev
    }
  }, [lenis])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex flex-col bg-black/85 backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0 text-sm">
          <span className="font-semibold text-white">{title}</span>
          <span className="mx-2 text-white/40">/</span>
          <span className="text-white/60">{item.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60 tabular-nums">
            {index + 1} / {items.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            autoFocus
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.97 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.97 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full max-w-6xl items-center justify-center"
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                poster={item.poster}
                controls
                autoPlay
                playsInline
                className="max-h-[calc(100svh-12rem)] w-auto max-w-full rounded-xl border border-white/15 shadow-2xl"
              />
            ) : (
              <img
                src={item.src}
                alt={`${title} — ${item.label}`}
                className="max-h-[calc(100svh-12rem)] w-auto max-w-full rounded-xl border border-white/15 object-contain shadow-2xl"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              aria-label="Previous"
              className="absolute left-2 grid size-11 cursor-pointer place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-white/10 sm:left-6"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              aria-label="Next"
              className="absolute right-2 grid size-11 cursor-pointer place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-white/10 sm:right-6"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center gap-2 overflow-x-auto px-4 py-5" onClick={(e) => e.stopPropagation()}>
        {items.map((m, i) => (
          <button
            key={m.src}
            onClick={() => {
              setDirection(i > index ? 1 : -1)
              onIndex(i)
            }}
            aria-label={`Show ${m.label}`}
            className={`relative aspect-video w-16 shrink-0 cursor-pointer overflow-hidden rounded-md border transition-all duration-300 sm:w-20 ${
              i === index ? 'border-white/60 opacity-100' : 'border-white/10 opacity-50 hover:opacity-90'
            }`}
          >
            <img src={m.type === 'video' ? m.poster : m.src} alt="" className="size-full object-cover object-top" />
            {m.type === 'video' && (
              <span className="absolute inset-0 grid place-items-center bg-black/40 text-white">
                <PlayIcon width={12} height={12} />
              </span>
            )}
          </button>
        ))}
      </div>
    </motion.div>,
    document.body,
  )
}
