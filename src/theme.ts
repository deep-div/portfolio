/**
 * ─── THEME SWITCH ──────────────────────────────────────────────
 * Change this one line to switch the whole site's colour theme:
 *
 *   'cream-editorial'  warm paper background, ink text, terracotta accent
 *   'minimal-light'    clean white background, black text, no colour
 *   'wine-rose'        soft blush background, deep wine accent
 *   'sage'             calm green-gray background, forest green accent
 *   'midnight'         the original dark theme with indigo/cyan glow
 *
 * Colours for each theme are defined in src/index.css under [data-theme="…"].
 */
export const THEME: ThemeName = 'sage'

export type ThemeName = 'cream-editorial' | 'minimal-light' | 'wine-rose' | 'sage' | 'midnight'

/** Browser UI colour (mobile address bar) for each theme. */
export const themeColor: Record<ThemeName, string> = {
  'cream-editorial': '#f5f1ea',
  'minimal-light': '#fafafa',
  'wine-rose': '#faf5f3',
  sage: '#f3f4ef',
  midnight: '#07070a',
}
