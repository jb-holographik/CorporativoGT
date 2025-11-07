import { gsap } from 'gsap'

import { customEase } from '../utils/animationUtils.js'

export function initNavIndicator() {
  const nav = document.querySelector('.nav')
  if (!nav) return

  const navList = nav.querySelector('.nav_list')
  const indicator = nav.querySelector('.nav_indicator')
  if (!navList || !indicator) return

  const navItems = Array.from(navList.querySelectorAll('.nav_list_item'))
  if (navItems.length === 0) return

  const getDefaultItem = () => {
    const currentLink = nav.querySelector('.navlink.w--current')
    if (currentLink) {
      const li = currentLink.closest('.nav_list_item')
      if (li) return li
    }
    return navItems[0] || null
  }

  let defaultItem = getDefaultItem()
  let currentItem = defaultItem

  const moveIndicatorToItem = (targetItem, animate = true) => {
    if (!targetItem) return
    const listRect = navList.getBoundingClientRect()
    const itemRect = targetItem.getBoundingClientRect()
    const translateYPx = itemRect.top - listRect.top
    if (animate) {
      gsap.to(indicator, { y: translateYPx, duration: 0.3, ease: customEase })
    } else {
      gsap.set(indicator, { y: translateYPx })
    }
  }

  const handleEnter = (item) => {
    currentItem = item
    moveIndicatorToItem(item)
  }

  navItems.forEach((item) => {
    item.addEventListener('mouseenter', () => handleEnter(item))
    item.addEventListener('focusin', () => handleEnter(item))
  })

  // Place indicator on the default item initially
  if (currentItem) moveIndicatorToItem(currentItem, false)

  // On leaving the whole nav, return to the current (default) item
  nav.addEventListener('mouseleave', () => {
    defaultItem = getDefaultItem()
    currentItem = defaultItem
    if (currentItem) moveIndicatorToItem(currentItem)
  })

  // When keyboard focus leaves the nav, also reset
  nav.addEventListener('focusout', (e) => {
    if (!nav.contains(e.relatedTarget)) {
      defaultItem = getDefaultItem()
      currentItem = defaultItem
      if (currentItem) moveIndicatorToItem(currentItem)
    }
  })

  window.addEventListener('resize', () => {
    if (currentItem) moveIndicatorToItem(currentItem, false)
  })
}
