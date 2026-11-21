import { animate, useInView, useMotionValue, useTransform, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const value = useMotionValue(0)
  const rounded = useTransform(value, (v) => `${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (!inView) return
    const controls = animate(value, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [inView, to, value])

  return <motion.span ref={ref}>{rounded}</motion.span>
}
