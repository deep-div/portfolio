import { profile } from '../data/content'
import { useScrollTo } from '../lib/smooth-scroll'
import { ArrowUp } from './ui/Icons'

export function Footer() {
  const scrollTo = useScrollTo()
  return (
    <footer className="relative border-t border-line">
      <div className="container-x flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. Designed &amp; built with care.
        </p>
        <button
          onClick={() => scrollTo(0)}
          className="group inline-flex cursor-pointer items-center gap-2 transition-colors hover:text-fg"
        >
          Back to top
          <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-transform duration-300 group-hover:-translate-y-0.5">
            <ArrowUp width={14} height={14} />
          </span>
        </button>
      </div>
    </footer>
  )
}
