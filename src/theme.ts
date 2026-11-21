/**
 * ─── THEME SWITCH ──────────────────────────────────────────────
 * Change this one line to switch the whole site's colour theme:
 *
 *   'cream-editorial'  warm paper background, ink text, terracotta accent
 *   'minimal-light'    clean white background, black text, no colour
 *   'midnight'         the original dark theme with indigo/cyan glow
 *
 * Colours for each theme are defined in src/index.css under [data-theme="…"].
 */
export const THEME: ThemeName = 'cream-editorial'

export type ThemeName = 'cream-editorial' | 'minimal-light' | 'midnight'

/** Browser UI colour (mobile address bar) for each theme. */
export const themeColor: Record<ThemeName, string> = {
  'cream-editorial': '#f5f1ea',
  'minimal-light': '#fafafa',
  midnight: '#07070a',
}
