import barba from '@barba/core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { listEasing } from '../utils/animationUtils.js'
import { initAboutUs } from './aboutus.js'
import { initCareers } from './careers.js'
import { initCompanies } from './companies.js'
import { initHero } from './hero.js'
import { initHomeAbout } from './homeAbout.js'
import { initLenis, getLenis } from './lenis.js'
import {
  initNavIndicator,
  setNavIndicatorTransitionState,
  unlockNavIndicator,
} from './nav.js'
import { initSocialImpact } from './socialImpact.js'
import { initStickyParagraph } from './stickyParagraph.js'

gsap.registerPlugin(ScrollTrigger)

const animationModules = [
  initNavIndicator,
  initHero,
  initHomeAbout,
  initStickyParagraph,
  initCareers,
  initAboutUs,
  initCompanies,
  initSocialImpact,
]

const hasBrowserEnv =
  typeof window !== 'undefined' && typeof document !== 'undefined'

let hasBootstrapped = false
let listenersAttached = false
let transitionsReady = false
let skipNextAfterEnterHydration = false
let transitionElementsCache = null
let transitionIntroPromise = null

export function initPageTransitions() {
  if (!hasBrowserEnv || hasBootstrapped) return

  const start = () => {
    hasBootstrapped = true
    ensureManualScrollRestoration()
    attachLoadListener()
    hydratePage({ reason: 'initial' })
    initBarbaRouter()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  } else {
    start()
  }
}
function ensureManualScrollRestoration() {
  if (typeof window === 'undefined') return
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}
function attachLoadListener() {
  if (listenersAttached || typeof window === 'undefined') return
  listenersAttached = true
  window.addEventListener('load', () => {
    requestAnimationFrame(() => forceScrollTopNow())
  })
}

function hydratePage({ reason, next } = {}) {
  setNavIndicatorTransitionState(false)
  syncCurrentNavLink(next)
  unlockNavIndicator()
  resumeSmoothScroll()
  forceScrollTopNow()
  requestAnimationFrame(() => forceScrollTopNow())
  runAnimationModules(reason)
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
    deactivateTransitionOverlay()
  })
}

function resumeSmoothScroll() {
  const lenis = initLenis()
  if (lenis && typeof lenis.start === 'function') {
    lenis.start()
  }
  return lenis
}

function pauseSmoothScroll() {
  const lenis = getLenis()
  if (lenis && typeof lenis.stop === 'function') {
    lenis.stop()
  }
}

function runAnimationModules(reason) {
  animationModules.forEach((initFn) => {
    try {
      initFn()
    } catch (error) {
      console.error(
        `[pageTransitions] Échec de ${initFn.name} pendant ${reason || 'init'}`,
        error
      )
    }
  })
}

function initBarbaRouter() {
  if (transitionsReady) return

  if (!hasBarbaMarkup()) {
    console.warn(
      'BarbaJS: aucun attribut data-barba détecté. Ajoutez-les dans Webflow pour activer les transitions.'
    )
    return
  }

  skipNextAfterEnterHydration = true
  registerBarbaHooks()

  barba.init({
    preventRunning: true,
    timeout: 7000,
    transitions: [createHeroImageTransition()],
  })

  transitionsReady = true
}

function hasBarbaMarkup() {
  if (!hasBrowserEnv) return false
  const wrapper = document.querySelector('[data-barba="wrapper"]')
  const container = document.querySelector('[data-barba="container"]')
  return Boolean(wrapper && container)
}

function registerBarbaHooks() {
  barba.hooks.beforeLeave((data) => {
    setNavIndicatorTransitionState(true)
    pauseSmoothScroll()
    killScrollTriggers()
    transitionIntroPromise = playTransitionIntro(data)
  })

  barba.hooks.afterLeave(() => {
    forceScrollTopNow()
  })

  barba.hooks.beforeEnter(({ next }) => {
    updateBodyNamespace(next)
  })

  barba.hooks.afterEnter((data) => {
    const finishHydration = () =>
      hydratePage({ reason: 'barba', next: data?.next })

    if (skipNextAfterEnterHydration) {
      skipNextAfterEnterHydration = false
      transitionIntroPromise = null
      deactivateTransitionOverlay()
      finishHydration()
      return
    }

    const waitForIntro = transitionIntroPromise
      ? transitionIntroPromise.catch((error) => {
          console.warn('Transition intro interrompue.', error)
        })
      : Promise.resolve()

    waitForIntro
      .then(() => playTransitionOutro(data?.next))
      .catch((error) => {
        console.warn('Transition outro interrompue.', error)
      })
      .finally(() => {
        transitionIntroPromise = null
        finishHydration()
      })
  })
}

function killScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}

function updateBodyNamespace(next) {
  if (!next || !next.namespace || !hasBrowserEnv) return
  document.body.setAttribute('data-barba-namespace', next.namespace)
}

function syncCurrentNavLink(next) {
  if (!hasBrowserEnv) return
  const navLinks = document.querySelectorAll('.navlink')
  if (navLinks.length === 0) return

  const targetPath = resolveTargetPath(next)
  let activeApplied = false

  navLinks.forEach((link) => {
    link.classList.remove('w--current')
    if (activeApplied) return

    const hrefPath = resolvePathname(link.getAttribute('href'))
    if (hrefPath === targetPath) {
      link.classList.add('w--current')
      activeApplied = true
    }
  })
}

function resolveTargetPath(next) {
  if (next?.url?.path) return normalizePath(next.url.path)
  if (next?.url?.href) return resolvePathname(next.url.href)
  if (hasBrowserEnv) {
    return normalizePath(window.location.pathname || '/')
  }
  return '/'
}

function resolvePathname(href) {
  if (!href) return '/'
  try {
    const base = hasBrowserEnv
      ? window.location.origin
      : 'https://placeholder.local'
    const url = new URL(href, base)
    return normalizePath(url.pathname)
  } catch (error) {
    if (href.startsWith('/')) {
      return normalizePath(href)
    }
    return normalizePath(`/${href}`)
  }
}

function normalizePath(path) {
  if (!path) return '/'
  const clean = path.split('?')[0].split('#')[0] || '/'
  const withLeadingSlash = clean.startsWith('/') ? clean : `/${clean}`
  const trimmed = withLeadingSlash.replace(/\/+$/, '')
  return trimmed || '/'
}

function forceScrollTopNow() {
  if (!hasBrowserEnv) return
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  const lenis = getLenis()
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(0, { duration: 0 })
  }
}

function getTransitionElements() {
  if (!hasBrowserEnv) return null
  if (
    transitionElementsCache &&
    document.contains(transitionElementsCache.overlay)
  ) {
    return transitionElementsCache
  }

  const overlay = document.querySelector('.transition')
  const inner = overlay?.querySelector('.transition__inner') || null
  const images = overlay
    ? Array.from(overlay.querySelectorAll('.transition__inner__img'))
    : []

  if (!overlay || !inner || images.length === 0) {
    transitionElementsCache = null
    return null
  }

  transitionElementsCache = { overlay, inner, images }
  return transitionElementsCache
}

function activateTransitionOverlay(pageId) {
  const refs = getTransitionElements()
  if (!refs) return null

  const { overlay, inner, images } = refs

  console.log('[activateTransitionOverlay] Début activation, pageId:', pageId)
  console.log(
    '[activateTransitionOverlay] Inner style AVANT tout:',
    inner.getAttribute('style')
  )

  overlay.style.display = 'flex'

  let imageMatched = false
  let activeImage = null
  images.forEach((img, index) => {
    const shouldShow =
      (!!pageId && img.dataset.page === pageId) || (!pageId && index === 0)
    if (shouldShow) {
      img.style.display = 'block'
      imageMatched = true
      activeImage = img
    } else {
      img.style.display = 'none'
    }
  })

  if (!imageMatched && images.length > 0) {
    images[0].style.display = 'block'
    activeImage = images[0]
  }

  refs.activeImage = activeImage

  console.log('[activateTransitionOverlay] Avant clearProps')
  gsap.set(inner, { clearProps: 'all' })
  console.log(
    '[activateTransitionOverlay] Après clearProps, style:',
    inner.getAttribute('style')
  )

  gsap.set(inner, {
    width: '22.75em',
    height: 0,
  })

  console.log(
    '[activateTransitionOverlay] Après set width/height, avant centerInnerForOverlay'
  )
  centerInnerForOverlay(inner)

  if (activeImage) {
    gsap.set(activeImage, { width: '22.75em', height: 0 })
  }
  return refs
}

function deactivateTransitionOverlay() {
  const refs = getTransitionElements()
  if (!refs) return
  const { overlay, inner, images } = refs
  refs.activeImage = null
  overlay.style.display = 'none'
  images.forEach((img) => {
    img.style.display = 'none'
    gsap.set(img, { width: '', height: '' })
  })
  gsap.set(inner, { width: '22.75em', height: 0 })
  centerInnerForOverlay(inner)
}

function centerInnerForOverlay(inner) {
  if (!inner || !hasBrowserEnv) return

  const beforeClear = {
    position: window.getComputedStyle(inner).position,
    margin: window.getComputedStyle(inner).margin,
    width: window.getComputedStyle(inner).width,
    inlineStyle: inner.getAttribute('style'),
  }

  console.log('[centerInnerForOverlay] AVANT clearProps:', beforeClear)

  gsap.set(inner, {
    clearProps: 'all',
  })

  const afterClear = {
    position: window.getComputedStyle(inner).position,
    margin: window.getComputedStyle(inner).margin,
    width: window.getComputedStyle(inner).width,
    inlineStyle: inner.getAttribute('style'),
  }

  console.log('[centerInnerForOverlay] APRÈS clearProps:', afterClear)

  gsap.set(inner, {
    position: 'relative',
    margin: '0 auto',
    top: 'auto',
    left: 'auto',
    xPercent: 0,
    yPercent: 0,
  })

  const rectAfterCenter = inner.getBoundingClientRect()
  const finalComputed = {
    position: window.getComputedStyle(inner).position,
    margin: window.getComputedStyle(inner).margin,
    width: window.getComputedStyle(inner).width,
    inlineStyle: inner.getAttribute('style'),
  }

  console.log('[centerInnerForOverlay] APRÈS gsap.set final:', finalComputed)
  console.log('[centerInnerForOverlay] Rect final:', {
    rectLeft: rectAfterCenter.left,
    rectWidth: rectAfterCenter.width,
    viewportWidth: window.innerWidth,
    expectedCenter: window.innerWidth / 2,
    actualCenter: rectAfterCenter.left + rectAfterCenter.width / 2,
  })
}

function convertInnerToFixed(inner) {
  if (!inner || !hasBrowserEnv) return
  const rect = inner.getBoundingClientRect()
  const computedStyle = window.getComputedStyle(inner)

  console.log('[convertInnerToFixed] État AVANT conversion:', {
    position: computedStyle.position,
    margin: computedStyle.margin,
    left: computedStyle.left,
    top: computedStyle.top,
    xPercent: computedStyle.transform,
    rectLeft: rect.left,
    rectTop: rect.top,
    rectWidth: rect.width,
    rectHeight: rect.height,
    calculatedCenterX: rect.left + rect.width / 2,
    viewportWidth: window.innerWidth,
  })

  gsap.set(inner, {
    position: 'fixed',
    top: rect.top,
    left: rect.left + rect.width / 2,
    xPercent: -50,
    yPercent: 0,
    margin: 0,
  })

  const rectAfter = inner.getBoundingClientRect()
  console.log('[convertInnerToFixed] État APRÈS conversion:', {
    position: window.getComputedStyle(inner).position,
    rectLeft: rectAfter.left,
    rectTop: rectAfter.top,
    rectWidth: rectAfter.width,
    rectHeight: rectAfter.height,
  })
}

function getHeroViewportOffset(next) {
  if (!hasBrowserEnv || !next || !next.container) return null
  const measurement = ensureContainerMeasurable(next.container)
  if (!measurement) return null

  const hero = measurement.element.querySelector('.hero-img')
  if (!hero) {
    measurement.cleanup?.()
    return null
  }

  const rect = hero.getBoundingClientRect()
  measurement.cleanup?.()

  if (!rect || Number.isNaN(rect.top)) return null
  return rect.top
}

function ensureContainerMeasurable(container) {
  if (!container || !hasBrowserEnv) return null

  const wrapper =
    document.querySelector('[data-barba="wrapper"]') || document.body

  let element = container
  let appendedClone = null
  let restores = null

  if (!element.isConnected) {
    const clone = container.cloneNode(true)
    clone.style.visibility = 'hidden'
    clone.style.pointerEvents = 'none'
    clone.style.position = 'absolute'
    clone.style.top = '0'
    clone.style.left = '0'
    clone.style.right = '0'
    clone.style.width = '100%'
    wrapper.appendChild(clone)
    appendedClone = clone
    element = clone
  }

  const computed = window.getComputedStyle(element)
  const hidden =
    computed.display === 'none' ||
    computed.visibility === 'hidden' ||
    computed.opacity === '0'

  if (hidden) {
    const previous = {
      visibility: element.style.visibility,
      display: element.style.display,
      position: element.style.position,
      pointerEvents: element.style.pointerEvents,
      top: element.style.top,
      left: element.style.left,
      right: element.style.right,
      bottom: element.style.bottom,
      width: element.style.width,
    }

    element.style.visibility = 'hidden'
    element.style.display = 'block'
    element.style.position = 'absolute'
    element.style.pointerEvents = 'none'
    element.style.top = '0'
    element.style.left = '0'
    element.style.right = '0'
    element.style.bottom = 'auto'
    element.style.width = '100%'

    restores = () => {
      Object.entries(previous).forEach(([prop, value]) => {
        element.style[prop] = value || ''
      })
    }
  }

  return {
    element,
    cleanup: () => {
      restores?.()
      if (appendedClone) {
        appendedClone.remove()
      }
    },
  }
}

function resolveTargetNamespace(data) {
  const namespace = data?.next?.namespace
  if (namespace) return namespace

  const fromUrl =
    inferNamespaceFromPath(data?.next?.url?.path) ||
    inferNamespaceFromHref(data?.next?.url?.href)
  if (fromUrl) return fromUrl

  if (data?.trigger) {
    const triggerHref =
      data.trigger.getAttribute('href') ||
      data.trigger.getAttribute('data-href') ||
      data.trigger.dataset.href
    const triggerNs = inferNamespaceFromHref(triggerHref)
    if (triggerNs) return triggerNs
  }

  return null
}

function inferNamespaceFromPath(path) {
  if (!path) return null
  try {
    const url = new URL(
      path,
      hasBrowserEnv ? window.location.origin : 'https://placeholder.local'
    )
    return formatNamespaceString(url.pathname)
  } catch (error) {
    return formatNamespaceString(path)
  }
}

function inferNamespaceFromHref(href) {
  if (!href) return null
  try {
    const url = new URL(
      href,
      hasBrowserEnv ? window.location.origin : 'https://placeholder.local'
    )
    return formatNamespaceString(url.pathname)
  } catch (error) {
    return formatNamespaceString(href)
  }
}

function formatNamespaceString(value) {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  const withoutHash = trimmed.split('#')[0]
  const withoutQuery = withoutHash.split('?')[0]
  const noLeadingSlash = withoutQuery.replace(/^\//, '')
  const noExtension = noLeadingSlash.replace(/\.html?$/i, '')
  if (!noExtension || noExtension === 'index') return 'home'
  return noExtension
}

function playTransitionIntro(data) {
  const pageId = resolveTargetNamespace(data)

  console.log('[playTransitionIntro] Début phase 1, pageId:', pageId)

  const refs = activateTransitionOverlay(pageId)
  const currentContainer = data?.current?.container || null

  if (!refs) {
    console.log('[playTransitionIntro] Pas de refs overlay, fallback fade')
    if (!currentContainer) return Promise.resolve()
    return gsap
      .to(currentContainer, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
      .then(() => {})
  }

  const { inner, activeImage } = refs

  console.log('[playTransitionIntro] Overlay activé, centrage...')
  centerInnerForOverlay(inner)

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      defaults: { ease: listEasing },
      onComplete: () => {
        console.log('[playTransitionIntro] Phase 1 terminée')
        resolve()
      },
    })

    tl.set(inner, { width: '22.75em', height: 0 })

    tl.to(inner, {
      width: '39.75em',
      height: '15em',
      duration: 0.8,
    })

    if (activeImage) {
      tl.to(
        activeImage,
        {
          width: '39.75em',
          height: '24.875em',
          duration: 0.8,
        },
        '<'
      )
    }
  })
}

async function playTransitionOutro(next) {
  const refs = getTransitionElements()
  if (!refs) {
    return
  }

  console.log('[playTransitionOutro] Début phase 2, next:', !!next)

  const { inner, activeImage } = refs

  console.log('[playTransitionOutro] Avant convertInnerToFixed')
  convertInnerToFixed(inner)
  console.log('[playTransitionOutro] Après convertInnerToFixed')

  await waitForNextFrame()

  const heroTop = getHeroViewportOffset(next)
  const finalTop =
    typeof heroTop === 'number' && Number.isFinite(heroTop) ? heroTop : 0

  console.log('[playTransitionOutro] Hero offset calculé:', {
    heroTop,
    finalTop,
    hasNext: !!next,
    hasContainer: !!next?.container,
  })

  await new Promise((resolve) => {
    const tl = gsap.timeline({
      defaults: { ease: listEasing },
      onComplete: () => {
        console.log('[playTransitionOutro] Animation phase 2 terminée')
        deactivateTransitionOverlay()
        resolve()
      },
    })

    tl.to(inner, {
      width: '100%',
      height: '100%',
      duration: 0.8,
      top: finalTop,
      left: '50%',
      xPercent: -50,
      yPercent: 0,
    })

    if (activeImage) {
      tl.to(
        activeImage,
        {
          width: 'calc(100% + 5em)',
          height: '100%',
          left: 0,
          xPercent: 0,
          duration: 0.8,
        },
        '<'
      )
    }
  })
}

function waitForNextFrame() {
  if (!hasBrowserEnv) return Promise.resolve()
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

function createHeroImageTransition() {
  return {
    name: 'hero-image-transition',
    async leave() {
      if (transitionIntroPromise) {
        try {
          await transitionIntroPromise
        } catch (error) {
          console.warn('Transition intro interrompue.', error)
        }
      }
    },
    enter: () => Promise.resolve(),
  }
}
