import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import { useScrollTo } from '../lib/smooth-scroll'
import { ease } from './ui/Reveal'

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const visible = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting))
        setActive(ids.find((id) => visible.get(id)) ?? null)
      },
      // A thin band across the middle of the viewport decides which section is "current".
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

const ids = navLinks.map((l) => l.id)

export function Navbar() {
  const active = useActiveSection(ids)
  const scrollTo = useScrollTo()
  const [hovered, setHovered] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 480)
    setScrolled(y > 24)
  })

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: hidden ? -90 : 0, opacity: 1 }}
      transition={{ duration: 0.6, ease, delay: hidden ? 0 : 0.1 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav
        aria-label="Primary"
        onMouseLeave={() => setHovered(null)}
        className={`flex items-center gap-0.5 rounded-full border p-1.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled
            ? 'border-line-strong bg-nav shadow-[0_10px_40px_-14px_rgb(0_0_0/0.25)]'
            : 'border-line bg-wash'
        }`}
      >
        {navLinks.map((link) => {
          const isActive = active === link.id
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(link.id)
              }}
              onMouseEnter={() => setHovered(link.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-300 sm:px-4 sm:text-sm ${
                isActive ? 'text-fg' : 'text-muted hover:text-fg'
              }`}
            >
              {hovered === link.id && !isActive && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 rounded-full bg-wash"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-wash-strong ring-1 ring-line ring-inset"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </a>
          )
        })}
      </nav>
    </motion.header>
  )
}
