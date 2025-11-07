import './styles/style.css'

import { initHero } from './animations/hero.js'
import { initHomeAbout } from './animations/homeAbout.js'
import { initLenis, getLenis } from './animations/lenis.js'
import { initNavIndicator } from './animations/nav.js'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

function forceScrollTopNow() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  const lenis = getLenis && getLenis()
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(0, { duration: 0 })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  forceScrollTopNow()
  initLenis()
  requestAnimationFrame(() => forceScrollTopNow())
  initNavIndicator()
  initHero()
  initHomeAbout()
})

window.addEventListener('load', () => {
  requestAnimationFrame(() => forceScrollTopNow())
})
