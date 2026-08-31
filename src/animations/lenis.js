import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export function initLenis(options = {}) {
  if (typeof window === 'undefined' || lenisInstance) return lenisInstance

  // syncTouch: false = scroll natif au touch, pour que la barre du browser
  // (Safari / Chrome mobile) puisse se cacher au scroll.
  const lenis = new Lenis({
    wrapper: window,
    content: document.documentElement,
    lerp: 0.12,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.51,
    touchMultiplier: 1,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    autoRaf: false,
    overscroll: true,
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
