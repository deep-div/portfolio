import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { applyTheme, getInitialTheme, themes, type ThemeName } from '../theme'
import { ease } from './ui/Reveal'

const PaletteIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3.5-3.6 3.5h-2.1a1.8 1.8 0 0 0-1.3 3.1 1.8 1.8 0 0 1-1.3 3.4H12Z" />
    <circle cx="7.5" cy="11" r="1.1" fill="currentColor" />
    <circle cx="10.5" cy="7" r="1.1" fill="currentColor" />
    <circle cx="15.5" cy="7.5" r="1.1" fill="currentColor" />
  </svg>
)

/** A two-tone dot: the theme's background on one half, its accent on the other. */
const Swatch = ({ bg, accent, size = 22 }: { bg: string; accent: string; size?: number }) => (
  <span
    aria-hidden
    className="block shrink-0 rounded-full ring-1 ring-line-strong"
    style={{ width: size, height: size, background: `linear-gradient(135deg, ${bg} 50%, ${accent} 50%)` }}
  />
)

/** Palette button beside the navbar that opens a list of colour themes. */
export function ThemePicker({ scrolled }: { scrolled: boolean }) {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (name: ThemeName) => {
    setTheme(name)
    applyTheme(name)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change colour theme"
        aria-haspopup="true"
        aria-expanded={open}
        className={`grid size-10 place-items-center sm:size-11 rounded-full border text-muted backdrop-blur-xl transition-[background-color,border-color,color,box-shadow] duration-500 hover:text-fg ${
          scrolled || open
            ? 'border-line-strong bg-nav shadow-[0_10px_40px_-14px_rgb(0_0_0/0.25)]'
            : 'border-line bg-wash'
        }`}
      >
        <PaletteIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Colour themes"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.22, ease }}
            className="absolute top-full right-0 mt-2 w-52 origin-top-right rounded-2xl border border-line-strong bg-nav p-1.5 shadow-[0_18px_50px_-18px_rgb(0_0_0/0.35)] backdrop-blur-xl"
          >
            <p className="px-2.5 pt-1.5 pb-2 text-[11px] font-medium tracking-[0.14em] text-faint uppercase">Theme</p>
            {themes.map((t) => {
              const active = t.name === theme
              return (
                <button
                  key={t.name}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => choose(t.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors ${
                    active ? 'bg-wash-strong text-fg' : 'text-muted hover:bg-wash hover:text-fg'
                  }`}
                >
                  <Swatch bg={t.bg} accent={t.accent} />
                  <span className="flex-1">{t.label}</span>
                  {active && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-accent">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
