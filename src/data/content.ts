/**
 * All site content lives here — edit this file to update the portfolio.
 * Anything marked TODO is a placeholder that needs your real details.
 */

export type MediaItem =
  | { type: 'video'; src: string; poster: string; label: string; /** Width / height, e.g. '1440/648', so the frame is sized before the video loads. */ aspect?: string }
  | { type: 'image'; src: string; label: string }

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  highlights: string[]
  tags: string[]
  /** Accent colour for this project (used by the dark theme). */
  accent: string
  /** Domain shown in the fake browser address bar. */
  domain: string
  liveUrl?: string
  repoUrl?: string
  media: MediaItem[]
}

export interface Experience {
  role: string
  company: string
  period: string
  /** One or two lines, no bullets. Start with an action word. */
  summary: string
  tags?: string[]
}

export const profile = {
  name: 'Divyanshu', // TODO: confirm full name
  role: 'Senior AI Engineer',
  rotatingWords: ['LLM-powered products', 'intelligent agents', 'real-time AI systems', 'production ML pipelines'],
  email: '3041div@gmail.com',
  socials: {
    github: 'https://github.com/deep-div',
    linkedin: 'https://www.linkedin.com/in/deep-div/',
  },
  about:
    'I build AI-powered products end to end — from LLM agents and data-heavy tools to real-time apps people actually use. I care about interfaces that feel fast and code that stays simple.', // TODO: personalise
  yearsOfExperience: 3, // TODO
  /** Hero portrait — background removed so it sits on every theme. Original: /media/profile.png */
  photo: '/media/profile.png',
}

const m = (slug: string, file: string) => `/media/${slug}/${file}`

export const projects: Project[] = [
  {
    slug: 'messenger',
    title: 'Messenger',
    tagline: 'Real-time chat with groups, presence and profiles.',
    description:
      'A full messaging app with one-to-one and group conversations, live online status and read receipts — wrapped in a calm, familiar interface.',
    highlights: [
      'Instant 1:1 and group messaging',
      'Online presence and read receipts',
      'Group management — add, remove, leave',
      'Profiles, people search and suggestions',
    ],
    tags: ['React', 'TypeScript', 'WebSockets', 'Node.js'], // TODO: confirm stack
    accent: '#60a5fa',
    domain: 'messenger.imdivyanshu.in',
    liveUrl: 'https://messenger.imdivyanshu.in/',
    repoUrl: undefined, // TODO
    media: [
      { type: 'video', src: m('messenger', 'messenger.mp4'), poster: m('messenger', 'poster.webp'), label: 'Walkthrough', aspect: '1600/776' },
      { type: 'image', src: m('messenger', 'image-2.webp'), label: 'Conversation' },
      { type: 'image', src: m('messenger', 'image-3.webp'), label: 'Group members' },
      { type: 'image', src: m('messenger', 'image-1.webp'), label: 'Inbox' },
      { type: 'image', src: m('messenger', 'image-4.webp'), label: 'Profile' },
    ],
  },
  {
    slug: 'fundscreener',
    title: 'FundScreener',
    tagline: 'Screen, compare and plan mutual fund investments.',
    description:
      'Comparing hundreds of mutual funds across returns and risk is slow and scattered. FundScreener puts it in one fast, filterable place — with curated screens, watchlists and planning calculators.',
    highlights: [
      'Filter 400+ funds by CAGR, drawdown and category',
      'Curated screens and personal watchlists',
      'SIP, Step-Up, SWP, goal and tax calculators with charts',
      'Live fund ticker and an in-app blog',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'Charts'], // TODO: confirm stack
    accent: '#34d399',
    domain: 'fundscreener.imdivyanshu.in',
    liveUrl: 'https://fundscreener.imdivyanshu.in/',
    repoUrl: undefined, // TODO
    media: [
      { type: 'video', src: m('fundscreener', 'fundscreener.mp4'), poster: m('fundscreener', 'poster.webp'), label: 'Walkthrough', aspect: '1440/648' },
      { type: 'image', src: m('fundscreener', 'image-1.webp'), label: 'Fund screener' },
      { type: 'image', src: m('fundscreener', 'image-2.webp'), label: 'Screen categories' },
      { type: 'image', src: m('fundscreener', 'image-3.webp'), label: 'Step-Up SIP calculator' },
      { type: 'image', src: m('fundscreener', 'image-4.webp'), label: 'Insights & articles' },
      { type: 'image', src: m('fundscreener', 'image-5.webp'), label: 'Blog post' },
    ],
  },
  {
    slug: 'url-shortener',
    title: 'snip',
    tagline: 'Short links with powerful click analytics.',
    description:
      'A URL shortener that turns long links into clean ones and shows exactly who clicks them — by day, country, city, device and browser.',
    highlights: [
      'One-click short links with copy and tracking',
      'Total and unique clicks, countries and cities',
      'Device and browser breakdowns',
      'Daily and hourly click charts',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'Analytics'], // TODO: confirm stack
    accent: '#a78bfa',
    domain: 'url-shortener.imdivyanshu.in',
    liveUrl: 'https://url-shortener.imdivyanshu.in/',
    repoUrl: undefined, // TODO
    media: [
      { type: 'video', src: m('url-shortener', 'url-shortener.mp4'), poster: m('url-shortener', 'poster.webp'), label: 'Walkthrough', aspect: '1536/864' },
      { type: 'image', src: m('url-shortener', 'image-1.webp'), label: 'Home' },
      { type: 'image', src: m('url-shortener', 'image-2.webp'), label: 'Link analytics' },
      { type: 'image', src: m('url-shortener', 'image-3.webp'), label: 'Audience breakdown' },
    ],
  },
]

// TODO: replace with your real companies (most recent first).
export const experience: Experience[] = [
  {
    role: 'Software Engineer',
    company: 'Company A',
    period: '2024 — Present',
    summary: 'Built internal tools and data pipelines that cut manual reporting time for analytics teams.',
    tags: ['React', 'Python', 'SQL'],
  },
  {
    role: 'Software Developer',
    company: 'Company B',
    period: '2022 — 2024',
    summary: 'Developed customer-facing web features and improved page performance across the product.',
    tags: ['TypeScript', 'Node.js'],
  },
  {
    role: 'Intern',
    company: 'Company C',
    period: '2022',
    summary: 'Worked on dashboards and APIs for an internal analytics platform.',
  },
]

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const
