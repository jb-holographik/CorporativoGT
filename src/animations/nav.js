import { gsap } from 'gsap'

import { customEase, listEasing } from '../utils/animationUtils.js'

let navElementRef = null
let navListRef = null
let navIndicatorRef = null
let navItemsRef = []
let currentItemRef = null
let lockedItemRef = null
let navInitialized = false
let menuTimelineRef = null
let wasTabletAndBelow = null

const TABLET_MAX_WIDTH = 991

export function initNavIndicator() {
  // Si le DOM a été remplacé (Barba), réinitialiser les références
  if (navElementRef && !document.contains(navElementRef)) {
    navElementRef = null
    navListRef = null
    navIndicatorRef = null
    navItemsRef = []
    currentItemRef = null
    lockedItemRef = null
    navInitialized = false
  }

  navElementRef = document.querySelector('.nav')
  if (!navElementRef) return

  navListRef = navElementRef.querySelector('.nav_list')
  navIndicatorRef = navElementRef.querySelector('.nav_indicator')
  if (!navListRef || !navIndicatorRef) return

  navItemsRef = Array.from(navListRef.querySelectorAll('.nav_list_item'))
  if (navItemsRef.length === 0) return

  if (navInitialized) {
    currentItemRef = lockedItemRef || getDefaultItem()
    if (currentItemRef) moveIndicatorToItem(currentItemRef, false)
    return
  }

  navInitialized = true
  currentItemRef = getDefaultItem()
  if (currentItemRef) moveIndicatorToItem(currentItemRef, false)

  navItemsRef.forEach((item) => {
    item.addEventListener('mouseenter', () => handleEnter(item))
    item.addEventListener('focusin', () => handleEnter(item))

    const link = item.querySelector('.navlink')
    if (link) {
      link.addEventListener('click', () => {
        lockIndicatorOnItem(item)
      })
    }
  })

  navElementRef.addEventListener('mouseleave', () => {
    if (lockedItemRef) return
    currentItemRef = getDefaultItem()
    if (currentItemRef) moveIndicatorToItem(currentItemRef)
  })

  navElementRef.addEventListener('focusout', (e) => {
    if (lockedItemRef) return
    if (!navElementRef.contains(e.relatedTarget)) {
      currentItemRef = getDefaultItem()
      if (currentItemRef) moveIndicatorToItem(currentItemRef)
    }
  })

  window.addEventListener('resize', () => {
    const isTabletNow = isTabletAndBelow()
    if (wasTabletAndBelow === null) {
      wasTabletAndBelow = isTabletNow
    }
    // Si on change de breakpoint et qu'aucun item n'est verrouillé, recalcule le défaut
    if (!lockedItemRef && wasTabletAndBelow !== isTabletNow) {
      currentItemRef = getDefaultItem()
      wasTabletAndBelow = isTabletNow
    }
    const target = lockedItemRef || currentItemRef || getDefaultItem()
    if (target) moveIndicatorToItem(target, false)
  })
}

export function setNavIndicatorTransitionState(isFront) {
  const indicator = resolveNavIndicator()
  if (!indicator) return

  if (isFront) {
    if (!indicator.dataset.prevZindex) {
      indicator.dataset.prevZindex = indicator.style.zIndex || ''
    }
    indicator.style.zIndex = '9999'
    return
  }

  if (indicator.dataset.prevZindex !== undefined) {
    indicator.style.zIndex = indicator.dataset.prevZindex
    delete indicator.dataset.prevZindex
  } else {
    indicator.style.removeProperty('z-index')
  }
}

export function unlockNavIndicator() {
  if (!navElementRef) return
  lockedItemRef = null
  navElementRef.removeAttribute('data-nav-indicator-locked')
  currentItemRef = getDefaultItem()
  if (currentItemRef) moveIndicatorToItem(currentItemRef, false)
}

function handleEnter(item) {
  if (!item || lockedItemRef) return
  currentItemRef = item
  moveIndicatorToItem(item)
}

function lockIndicatorOnItem(item) {
  if (!item) return
  lockedItemRef = item
  currentItemRef = item
  if (navElementRef) {
    navElementRef.setAttribute('data-nav-indicator-locked', 'true')
  }
  moveIndicatorToItem(item, false)
}

function moveIndicatorToItem(targetItem, animate = true) {
  if (!targetItem || !navListRef || !navIndicatorRef) return
  const listRect = navListRef.getBoundingClientRect()
  const itemRect = targetItem.getBoundingClientRect()
  const translateYPx = itemRect.top - listRect.top
  if (animate) {
    gsap.to(navIndicatorRef, {
      y: translateYPx,
      duration: 0.3,
      ease: customEase,
    })
  } else {
    gsap.set(navIndicatorRef, { y: translateYPx })
  }
}

function getDefaultItem() {
  if (!navElementRef) return null

  if (isTabletAndBelow()) {
    const menuButton = document.querySelector('#menu-button')
    if (menuButton) return menuButton
  }

  const currentLink = navElementRef.querySelector('.navlink.w--current')
  if (currentLink) {
    const li = currentLink.closest('.nav_list_item')
    if (li) return li
  }
  return navItemsRef[0] || null
}

function resolveNavIndicator() {
  if (navIndicatorRef && document.contains(navIndicatorRef)) {
    return navIndicatorRef
  }
  navIndicatorRef = document.querySelector('.nav_indicator')
  return navIndicatorRef
}

function isTabletAndBelow() {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH}px)`).matches
  }
  return window.innerWidth <= TABLET_MAX_WIDTH
}

export function initNavMenuToggle() {
  const menuElement = document.querySelector('.menu')
  const openTrigger = document.querySelector('#menu-button')
  const closeTrigger = document.querySelector('.navlink.menu-close')
  if (!menuElement || !openTrigger || !closeTrigger) return

  if (menuTimelineRef) return

  gsap.set(menuElement, { width: '0%', display: 'none' })

  const timeline = gsap.timeline({
    paused: true,
    defaults: { duration: 1.2, ease: listEasing },
  })

  timeline.to(menuElement, {
    width: '100%',
    onStart: () => gsap.set(menuElement, { display: 'block' }),
  })

  timeline.eventCallback('onReverseComplete', () =>
    gsap.set(menuElement, { display: 'none' })
  )

  const handleOpen = (event) => {
    event?.preventDefault()
    timeline.play()
  }

  const handleClose = (event) => {
    event?.preventDefault()
    timeline.reverse()
  }

  openTrigger.addEventListener('click', handleOpen)
  closeTrigger.addEventListener('click', handleClose)

  menuTimelineRef = timeline
}
