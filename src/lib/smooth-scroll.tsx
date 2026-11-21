import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const LenisContext = createContext<Lenis | null>(null)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) })
    let raf = 0
    const loop = (time: number) => {
      instance.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    setLenis(instance)
    return () => {
      cancelAnimationFrame(raf)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

/** Smoothly scroll to a section id (or the top), falling back to native scrolling. */
export function useScrollTo() {
  const lenis = useLenis()
  return (target: string | number) => {
    const el = typeof target === 'string' ? document.getElementById(target) : null
    if (lenis) {
      lenis.scrollTo(el ?? (typeof target === 'number' ? target : 0), { offset: el ? -24 : 0 })
    } else if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    } else {
      window.scrollTo({ top: typeof target === 'number' ? target : 0, behavior: 'smooth' })
    }
  }
}
