import { gsap } from 'gsap'

import { customEase } from '../utils/animationUtils.js'

let navElementRef = null
let navListRef = null
let navIndicatorRef = null
let navItemsRef = []
let currentItemRef = null
let lockedItemRef = null
let navInitialized = false

export function initNavIndicator() {
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
