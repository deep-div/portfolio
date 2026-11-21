import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { THEME, themeColor } from './src/theme'

/** Bakes the chosen theme into index.html so the first paint already has the right colours. */
const themePlugin = (): Plugin => ({
  name: 'portfolio-theme',
  transformIndexHtml: (html) =>
    html
      .replace('<html lang="en">', `<html lang="en" data-theme="${THEME}">`)
      .replace(/<meta name="theme-color" content="[^"]*"/, `<meta name="theme-color" content="${themeColor[THEME]}"`),
})

export default defineConfig({
  plugins: [react(), tailwindcss(), themePlugin()],
})
