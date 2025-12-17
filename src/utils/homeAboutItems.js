const BASE_ITEMS_CONFIG = [
  {
    id: 1,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 2,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 3,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 4,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 5,
    stop1: { transformX: -450, transformY: 30 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 6,
    stop1: { transformX: -450, transformY: -30 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 7,
    stop1: { transformX: -450, transformY: 30 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 8,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 9,
    stop1: { transformX: -450, transformY: -30 },
    stop2: { transformX: -900, transformY: 40 },
  },
  {
    id: 10,
    stop1: { transformX: -450, transformY: 30 },
    stop2: { transformX: -900, transformY: -40 },
  },
  {
    id: 11,
    stop1: { transformX: -450, transformY: -30 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 12,
    stop1: { transformX: -450, transformY: 30 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 13,
    stop1: { transformX: -450, transformY: -30 },
    stop2: { transformX: -900, transformY: 0, centerX: true },
  },
  {
    id: 14,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: -40 },
  },
  {
    id: 15,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 16,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: -40 },
  },
  {
    id: 17,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: 0 },
  },
  {
    id: 18,
    stop1: { transformX: -450, transformY: 0 },
    stop2: { transformX: -900, transformY: 0 },
  },
]

// Variantes spécifiques pour pouvoir ajuster indépendamment tablette et mobile
const TABLET_ITEMS_CONFIG = [
  {
    id: 1,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 2,
    stop1: { transformX: 292.5, transformY: 0 },
    stop2: { transformX: -85, transformY: 0 },
  },
  {
    id: 3,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: 8185, transformY: 0 },
  },
  {
    id: 4,
    stop1: { transformX: -122.5, transformY: 0 },
    stop2: { transformX: -85, transformY: 0 },
  },
  {
    id: 5,
    stop1: { transformX: -292.5, transformY: 22.5 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 6,
    stop1: { transformX: -292.5, transformY: -22.5 },
    stop2: { transformX: -435, transformY: -180 },
  },
  {
    id: 7,
    stop1: { transformX: -292.5, transformY: 22.5 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 8,
    stop1: { transformX: 100, transformY: 0 },
    stop2: { transformX: -85, transformY: 0 },
  },
  {
    id: 9,
    stop1: { transformX: -192.5, transformY: -22.5 },
    stop2: { transformX: -585, transformY: 30 },
  },
  {
    id: 10,
    stop1: { transformX: -292.5, transformY: -2.5 },
    stop2: { transformX: -55, transformY: -30 },
  },
  {
    id: 11,
    stop1: { transformX: -292.5, transformY: -22.5 },
    stop2: { transformX: -5, transformY: -100 },
  },
  {
    id: 12,
    stop1: { transformX: -292.5, transformY: 22.5 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 13,
    stop1: { transformX: -292.5, transformY: -22.5 },
    stop2: { transformX: -585, transformY: 0, centerX: true },
  },
  {
    id: 14,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: -30 },
  },
  {
    id: 15,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 16,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: -30 },
  },
  {
    id: 17,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 18,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: 0 },
  },
]

const MOBILE_ITEMS_CONFIG = [
  {
    id: 1,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 2,
    stop1: { transformX: 292.5, transformY: 0 },
    stop2: { transformX: -85, transformY: 0 },
  },
  {
    id: 3,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: 8185, transformY: 0 },
  },
  {
    id: 4,
    stop1: { transformX: -122.5, transformY: 0 },
    stop2: { transformX: -85, transformY: 0 },
  },
  {
    id: 5,
    stop1: { transformX: -292.5, transformY: 22.5 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 6,
    stop1: { transformX: -292.5, transformY: -22.5 },
    stop2: { transformX: -225, transformY: -180 },
  },
  {
    id: 7,
    stop1: { transformX: -292.5, transformY: 22.5 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 8,
    stop1: { transformX: 100, transformY: 0 },
    stop2: { transformX: -85, transformY: 0 },
  },
  {
    id: 9,
    stop1: { transformX: -192.5, transformY: -22.5 },
    stop2: { transformX: -585, transformY: 30 },
  },
  {
    id: 10,
    stop1: { transformX: -292.5, transformY: -2.5 },
    stop2: { transformX: -55, transformY: -30 },
  },
  {
    id: 11,
    stop1: { transformX: -292.5, transformY: -22.5 },
    stop2: { transformX: -155, transformY: -100 },
  },
  {
    id: 12,
    stop1: { transformX: -292.5, transformY: 22.5 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 13,
    stop1: { transformX: -292.5, transformY: -22.5 },
    stop2: { transformX: -585, transformY: 0, centerX: true },
  },
  {
    id: 14,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: -30 },
  },
  {
    id: 15,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 16,
    stop1: { transformX: -452.5, transformY: 0 },
    stop2: { transformX: -585, transformY: -30 },
  },
  {
    id: 17,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: 0 },
  },
  {
    id: 18,
    stop1: { transformX: -292.5, transformY: 0 },
    stop2: { transformX: -585, transformY: 0 },
  },
]

function getBreakpoint() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'desktop'
  }

  if (window.matchMedia('(max-width: 767px)').matches) {
    return 'mobile'
  }

  if (window.matchMedia('(max-width: 991px)').matches) {
    return 'tablet'
  }

  return 'desktop'
}

function getItemsConfigForBreakpoint(breakpoint) {
  if (breakpoint === 'mobile') return MOBILE_ITEMS_CONFIG
  if (breakpoint === 'tablet') return TABLET_ITEMS_CONFIG
  return BASE_ITEMS_CONFIG
}

function ensureBadge(element, id) {
  if (!element) return
  const existing = element.querySelector('.about-item_badge')
  if (existing) {
    existing.textContent = id
    return
  }
  const badge = document.createElement('div')
  badge.className = 'about-item_badge'
  badge.textContent = id
  element.appendChild(badge)
}

export function initAboutItemsData() {
  const breakpoint = getBreakpoint()
  const itemsConfig = getItemsConfigForBreakpoint(breakpoint)
  const itemClass =
    breakpoint === 'desktop' ? 'about-item' : 'about-item_mobile'
  const isMobileLayout = breakpoint !== 'desktop'

  // Configuration des sliders (desktop horizontal, mobile/tablette vertical)
  const sliderConfig =
    breakpoint === 'desktop'
      ? {
          stop1: { transformX: -7.938, transformY: 0 },
          stop2: { transformX: -15.876, transformY: 0 },
        }
      : {
          stop1: { transformY: -7.75 },
          stop2: { transformY: -15.5 },
        }

  // Générer les items avec leur configuration
  const items = itemsConfig.map((config) => {
    const selector = `.${itemClass}.is-${config.id}`
    const element = document.querySelector(selector)
    if (isMobileLayout && element) {
      ensureBadge(element, config.id)
    }
    return {
      id: config.id,
      element,
      slider: document.querySelector(`${selector} .about-item_slider`),
      itemStop1: config.stop1,
      itemStop2: config.stop2,
      sliderStop1: sliderConfig.stop1,
      sliderStop2: sliderConfig.stop2,
    }
  })

  return items
}
