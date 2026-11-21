/**
 * ─── THEME SWITCH ──────────────────────────────────────────────
 * Change this one line to switch the whole site's colour theme:
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
