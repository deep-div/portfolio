import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { ease } from './Reveal'

interface Props {
  index: string
  label: string
  title: ReactNode
  description?: string
}

export function SectionHeading({ index, label, title, description }: Props) {
  return (
    <div className="mb-14 sm:mb-20">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.7, ease }}
        className="mb-5 flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-muted uppercase"
      >
        <span className="text-gradient font-semibold">{index}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="h-px w-10 origin-left bg-line-strong"
        />
        {label}
      </motion.div>
      <div className="overflow-hidden pb-2">
        <motion.h2
          initial={{ y: '110%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1, ease }}
          className="text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h2>
      </div>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

/** Serif italic accent used inside headings. */
export const Accent = ({ children }: { children: ReactNode }) => (
  <span className="text-gradient pr-1 font-serif font-normal italic tracking-normal">{children}</span>
)
