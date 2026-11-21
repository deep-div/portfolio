import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import type { HTMLAttributes, PointerEvent, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  color?: string
}

/** Card with a soft light that follows the cursor across its surface and border. */
export function SpotlightCard({ children, className = '', color = 'color-mix(in srgb, var(--t-accent) 10%, transparent)', ...rest }: Props) {
  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, ${color}, transparent 70%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(-400)
        my.set(-400)
      }}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-surface/80 ${className}`}
      {...rest}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: bg }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
