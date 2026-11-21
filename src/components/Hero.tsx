import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { profile } from '../data/content'
import { useScrollTo } from '../lib/smooth-scroll'
import { DotGrid } from './ui/DotGrid'
import { GithubIcon, LinkedinIcon, MailIcon } from './ui/Icons'
import { ease } from './ui/Reveal'

const GRADIENT = 'var(--t-gradient-text)'

function GradientLetters({ text, delay }: { text: string; delay: number }) {
  const letters = [...text]
  return (
    <span className="inline-block whitespace-nowrap" aria-label={text}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: '0.45em', rotate: 8, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease, delay: delay + i * 0.045 }}
          className="inline-block pr-[0.04em]"
          style={{
            backgroundImage: GRADIENT,
            backgroundSize: `${letters.length * 100}% 100%`,
            backgroundPosition: `${letters.length > 1 ? (i / (letters.length - 1)) * 100 : 0}% 0`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2600)
    return () => clearInterval(t)
  }, [words.length])

  return (
    <motion.span layout transition={{ duration: 0.5, ease }} className="relative inline-flex overflow-hidden align-baseline">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.55, ease }}
          // Bottom padding leaves room for descenders (g, p, y) inside the clipping box;
          // the wrapper aligns on the text baseline, so the padding doesn't shift the word.
          className="font-display pb-[0.2em] leading-none font-semibold tracking-[-0.015em] whitespace-nowrap text-fg"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

function HeroBackground({ mx, my }: { mx: MotionValue<number>; my: MotionValue<number> }) {
  const sx = useSpring(mx, { stiffness: 80, damping: 20 })
  const sy = useSpring(my, { stiffness: 80, damping: 20 })
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${sx}px ${sy}px, var(--t-spotlight), transparent 70%)`

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute top-[8%] left-[12%] size-[38vmax] animate-aurora rounded-full bg-glow-1 blur-[110px]" />
      <div className="absolute top-[30%] right-[6%] size-[32vmax] animate-aurora rounded-full bg-glow-2 blur-[120px] [animation-delay:-6s]" />
      <div className="absolute bottom-[-10%] left-[35%] size-[30vmax] animate-aurora rounded-full bg-glow-3 blur-[120px] [animation-delay:-12s]" />
      <DotGrid className="[mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black_35%,transparent_100%)]" />
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()
  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  const item = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.9, ease, delay },
  })

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onMove}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-24 pb-28"
    >
      <HeroBackground mx={mx} my={my} />

      <motion.div style={{ y, opacity, scale }} className="container-x relative z-10 flex flex-col items-center text-center">
        <h1 className="text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
          <motion.span {...item(0.35)} className="block text-[0.42em] font-medium tracking-[-0.02em] text-muted">
            Hi, I&apos;m
          </motion.span>
          <span className="mt-1 block font-serif font-normal tracking-[-0.01em] italic">
            <GradientLetters text={profile.name} delay={0.5} />
          </span>
        </h1>

        <motion.p {...item(0.95)} className="mt-7 max-w-2xl text-lg text-balance text-muted sm:text-2xl">
          {profile.role} crafting <RotatingWord words={profile.rotatingWords} />
        </motion.p>

        <motion.div {...item(1.1)} className="mt-10 flex items-center gap-2">
          {[
            { href: profile.socials.github, label: 'GitHub', Icon: GithubIcon },
            { href: profile.socials.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
            { href: `mailto:${profile.email}`, label: 'Email', Icon: MailIcon },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={label}
              className="group relative grid size-11 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-wash-strong hover:text-fg"
            >
              <Icon width={19} height={19} />
              <span className="pointer-events-none absolute -bottom-7 text-[11px] opacity-0 transition-all duration-300 group-hover:-bottom-8 group-hover:opacity-100">
                {label}
              </span>
            </a>
          ))}
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => scrollTo('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{ opacity }}
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-3 text-[11px] tracking-[0.25em] text-faint uppercase"
      >
        <span className="relative h-10 w-[22px] rounded-full border border-line-strong">
          <motion.span
            animate={{ y: [6, 18, 6], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 h-2 w-[3px] -translate-x-1/2 rounded-full bg-fg/70"
          />
        </span>
        Scroll
      </motion.button>
    </section>
  )
}
