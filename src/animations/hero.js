import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initHero() {
  const heroImgWrapper = document.querySelector('.hero-img')
  const heroImg = document.querySelector('.hero-img_img')
  const heading = document.querySelector('.section_hero h1')
  if (!heroImgWrapper || !heroImg || !heading) return

  // Capture initial positions on load
  const startScrollY = window.scrollY || window.pageYOffset || 0
  const rect = heroImgWrapper.getBoundingClientRect()
  const distanceToTop = rect.top // distance from viewport top at load
  const distanceToBottom = rect.bottom // distance from viewport top to element bottom at load

  // If already past the point (e.g., reloaded mid-page), guard against negative
  const startPx = startScrollY
  const endPxTop = startScrollY + Math.max(0, distanceToTop)
  const endPxBottom = startScrollY + Math.max(0, distanceToBottom)

  // Opacity: from initial point until the element's TOP reaches viewport TOP
  const opacityTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      start: startPx,
      end: endPxTop,
      scrub: true,
    },
  })
  opacityTl.to(heading, { opacity: 0 })

  // TranslateX: from initial point until the element's BOTTOM reaches viewport TOP
  const translateTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      start: startPx,
      end: endPxBottom,
      scrub: true,
    },
  })
  translateTl.to(heroImg, { x: '-5em' })
}
