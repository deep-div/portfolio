/**
 * ─── THEMES ────────────────────────────────────────────────────
 * Visitors can pick a theme from the palette button next to the navbar;
 * their choice is remembered in localStorage.
 *
 * THEME below is the default for first-time visitors:
 *
 *   'cream-editorial'  warm paper background, ink text, terracotta accent
 *   'minimal-light'    clean white background, black text, no colour
 *   'wine-rose'        soft blush background, deep wine accent
 *   'sage'             calm green-gray background, forest green accent
 *   'mocha'            beige background, espresso text, coffee-brown accent
 *   'midnight'         the original dark theme with indigo/cyan glow
 *
 * Colours for each theme are defined in src/index.css under [data-theme="…"].
 */
export const THEME: ThemeName = 'mocha'

export type ThemeName = 'cream-editorial' | 'minimal-light' | 'wine-rose' | 'sage' | 'mocha' | 'midnight'

/** Browser UI colour (mobile address bar) for each theme. */
export const themeColor: Record<ThemeName, string> = {
  'cream-editorial': '#f5f1ea',
  'minimal-light': '#f4f4f2',
  'wine-rose': '#faf5f3',
  sage: '#f3f4ef',
  mocha: '#ede4d3',
  midnight: '#07070a',
}

/** Themes as shown in the picker: name, label and the two swatch colours (background, accent). */
export const themes: { name: ThemeName; label: string; bg: string; accent: string }[] = [
  { name: 'cream-editorial', label: 'Cream', bg: '#f5f1ea', accent: '#c2410c' },
  { name: 'minimal-light', label: 'Minimal', bg: '#fafafa', accent: '#0a0a0a' },
  { name: 'wine-rose', label: 'Wine Rose', bg: '#faf5f3', accent: '#9f1239' },
  { name: 'sage', label: 'Sage', bg: '#f3f4ef', accent: '#3f6b4f' },
  { name: 'mocha', label: 'Mocha', bg: '#ede4d3', accent: '#7a4a2a' },
  { name: 'midnight', label: 'Midnight', bg: '#07070a', accent: '#818cf8' },
]

export const THEME_STORAGE_KEY = 'portfolio-theme'

const isTheme = (v: unknown): v is ThemeName => themes.some((t) => t.name === v)

/** The visitor's saved theme, or the default. */
export function getInitialTheme(): ThemeName {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (isTheme(saved)) return saved
  } catch {
    /* storage blocked — fall back to the default */
  }
  return THEME
}

/** Applies a theme to the page and remembers it. */
export function applyTheme(name: ThemeName) {
  document.documentElement.dataset.theme = name
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor[name])
  try {
    localStorage.setItem(THEME_STORAGE_KEY, name)
  } catch {
    /* storage blocked — the theme still applies for this visit */
  }
}
