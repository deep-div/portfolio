import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { profile } from '../data/content'
import { ArrowUpRight, CheckIcon, CopyIcon, DownloadIcon, GithubIcon, LinkedinIcon, SparkIcon } from './ui/Icons'
import { Magnetic } from './ui/Magnetic'
import { Reveal, ease } from './ui/Reveal'
import { Accent } from './ui/SectionHeading'

function Marquee() {
  const phrase = (
    <span className="flex shrink-0 items-center gap-8 pr-8">
      <span className="text-outline">Let&apos;s work together</span>
      <SparkIcon width={28} height={28} className="text-accent/60" />
      <span className="font-serif font-normal text-fg/90 italic">Let&apos;s build something</span>
      <SparkIcon width={28} height={28} className="text-accent/60" />
    </span>
  )
  return (
    <div
      aria-hidden
      className="relative flex overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee text-5xl font-semibold tracking-[-0.04em] whitespace-nowrap sm:text-7xl lg:text-8xl">
        {phrase}
        {phrase}
        {phrase}
        {phrase}
      </div>
    </div>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden pt-16 pb-28 sm:pt-24 sm:pb-40">
      <div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[70%] w-[90%] -translate-x-1/2 rounded-[100%] bg-glow-1 blur-[140px]" />

      <Marquee />

      <div className="container-x relative mt-16 flex flex-col items-center text-center sm:mt-24">
        <Reveal className="mb-6 flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-muted uppercase">
          <span className="text-gradient font-semibold">04</span>
          <span className="h-px w-10 bg-line-strong" />
          Contact
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Have an idea? Let&apos;s make it <Accent>real.</Accent>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-base text-balance text-muted sm:text-lg">
            I&apos;m open to full-time roles, freelance projects and interesting collaborations. My inbox is always open.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex h-14 items-center gap-2 rounded-full bg-fg px-7 text-base font-semibold text-bg shadow-button transition-shadow duration-300 hover:shadow-button-hover active:scale-[0.97]"
            >
              Say hello
              <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>

          <button
            onClick={copy}
            className="relative inline-flex h-14 cursor-pointer items-center gap-2.5 rounded-full border border-line-strong bg-wash px-6 text-sm font-medium text-fg backdrop-blur transition-colors hover:bg-wash-strong"
            aria-label="Copy email address"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? 'ok' : 'copy'}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2, ease }}
                className={copied ? 'text-emerald-600' : 'text-muted'}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </motion.span>
            </AnimatePresence>
            {profile.email}
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-fg px-2.5 py-1 text-xs font-semibold text-bg"
                >
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </Reveal>

        <Reveal delay={0.28} className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          {[
            { href: profile.socials.github, label: 'GitHub', Icon: GithubIcon, external: true },
            { href: profile.socials.linkedin, label: 'LinkedIn', Icon: LinkedinIcon, external: true },
            { href: profile.resumeUrl, label: 'Resume', Icon: DownloadIcon, external: false },
          ].map(({ href, label, Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel="noreferrer"
              download={external ? undefined : true}
              className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
            >
              <Icon width={16} height={16} />
              <span className="relative">
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-fg transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
