import { profile } from '../data/content'
import { GithubIcon, LinkedinIcon, MailIcon, SparkIcon } from './ui/Icons'
import { Magnetic } from './ui/Magnetic'
import { Reveal } from './ui/Reveal'
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
  return (
    <section id="contact" className="relative overflow-hidden pt-16 pb-28 sm:pt-24 sm:pb-40">
      <div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[70%] w-[90%] -translate-x-1/2 rounded-[100%] bg-glow-1 blur-[140px]" />

      <Marquee />

      <div className="container-x relative mt-16 flex flex-col items-center text-center sm:mt-24">
        <Reveal>
          <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Have an idea? Let&apos;s make it <Accent>real.</Accent>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-base text-balance text-muted sm:text-lg">
            I&apos;m open to full-time roles, freelance projects and interesting collaborations. Reach out wherever suits you.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex items-center justify-center gap-3 sm:gap-4">
          {[
            { href: profile.socials.github, label: 'GitHub', Icon: GithubIcon },
            { href: profile.socials.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
            { href: `mailto:${profile.email}`, label: 'Email', Icon: MailIcon },
          ].map(({ href, label, Icon }) => (
            <Magnetic key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={label}
                className="group relative grid size-14 place-items-center rounded-full border border-line-strong bg-wash text-muted backdrop-blur transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg sm:size-16"
              >
                <Icon width={22} height={22} />
                <span className="pointer-events-none absolute -bottom-7 text-xs text-muted opacity-0 transition-all duration-300 group-hover:-bottom-8 group-hover:opacity-100">
                  {label}
                </span>
              </a>
            </Magnetic>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
