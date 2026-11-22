import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App'
import { applyTheme, getInitialTheme } from './theme'

applyTheme(getInitialTheme())

// Always start at the top on load/reload: stop the browser restoring the old
// scroll position, and drop any #section hash that would make it jump down.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (location.hash) history.replaceState(null, '', location.pathname + location.search)
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
