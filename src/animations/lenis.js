import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export function initLenis(options = {}) {
  if (typeof window === 'undefined' || lenisInstance) return lenisInstance

  const lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.51,
    touchMultiplier: 1.5,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    // allow user overrides
    ...options,
  })

  lenis.on('scroll', () => {
    ScrollTrigger.update()
  })

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000) // Convert time from seconds to milliseconds
  })

  gsap.ticker.lagSmoothing(0)

  lenisInstance = lenis
  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}
