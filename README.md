# Portfolio

Personal portfolio built with React, TypeScript, Vite, Tailwind CSS v4, Motion and Lenis.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Switch theme

Open [`src/theme.ts`](src/theme.ts) and change one line:

```ts
export const THEME: ThemeName = 'cream-editorial' // or 'minimal-light', 'wine-rose', 'sage', 'midnight'
```

Theme colours live in `src/index.css` under `[data-theme="…"]`.

## Edit content

Everything you'll want to change is in [`src/data/content.ts`](src/data/content.ts):
name, role, about text, email, social links, projects and experience. Items marked `TODO` are placeholders.

## Add a project

1. Create `public/media/<slug>/` with a walkthrough video (`<slug>.mp4`) and screenshots.
2. Generate a poster and optimized images (needs ffmpeg + Python Pillow):

   ```bash
   ffmpeg -ss 2 -i public/media/<slug>/<slug>.mp4 -frames:v 1 -vf scale=1280:-2 public/media/<slug>/poster.webp
   python -c "from PIL import Image;import glob,os;[Image.open(f).convert('RGB').save(os.path.splitext(f)[0]+'.webp',quality=82) for f in glob.glob('public/media/<slug>/image-*.png')]"
   ```

3. Add an entry to `projects` in `content.ts`.

## Structure

```
src/
  data/content.ts          all site content
  components/
    Navbar.tsx             centered pill nav, active-section indicator, hides on scroll down
    Hero.tsx               letter-by-letter name, rotating words, aurora + cursor spotlight
    About.tsx              scroll-linked word reveal, count-up stats
    Projects.tsx           sticky stacking project cards
    projects/              browser-framed media player + fullscreen lightbox
    Experience.tsx         scroll-drawn timeline
    Contact.tsx            marquee, copy-email, links
  lib/                     smooth scrolling (Lenis), media query hook
```
