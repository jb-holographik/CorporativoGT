import './styles/style.css'

import { initAboutUs } from './animations/aboutus.js'
import { initCompanies } from './animations/companies.js'
import { initHero } from './animations/hero.js'
import { initHomeAbout } from './animations/homeAbout.js'
import { initLenis, getLenis } from './animations/lenis.js'
import { initNavIndicator } from './animations/nav.js'
import { initSocialImpact } from './animations/socialImpact.js'
import { initStickyParagraph } from './animations/stickyParagraph.js'

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
  initStickyParagraph()
  initAboutUs()
  initCompanies()
  initSocialImpact()
})

window.addEventListener('load', () => {
  requestAnimationFrame(() => forceScrollTopNow())
})
