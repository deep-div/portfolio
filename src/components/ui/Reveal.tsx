import { motion, type HTMLMotionProps } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1] as const

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
}

/** Fades, lifts and un-blurs its children the first time they scroll into view. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
