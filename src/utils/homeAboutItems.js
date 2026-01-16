const BASE_ITEMS_CONFIG = [
  {
    id: 1,
    stop1: { transformX: -225, transformY: 0 },
    stop2: { transformX: -450, transformY: 0 },
    stop3: { transformX: -675, transformY: 0 },
    stop4: { transformX: -900, transformY: 0 },
  },
  {
    id: 2,
    stop1: { transformX: -225, transformY: 0 },
    stop2: { transformX: -450, transformY: 0 },
    stop3: { transformX: -675, transformY: 0 },
    stop4: { transformX: -900, transformY: 0 },
  },
  {
    id: 3,
    stop1: { transformX: -225, transformY: 0 },
    stop2: { transformX: -450, transformY: 0 },
    stop3: { transformX: -675, transformY: 0 },
    stop4: { transformX: -900, transformY: 0 },
  },
  {
    id: 4,
    stop1: { transformX: -225, transformY: 30 },
    stop2: { transformX: -450, transformY: 0 },
    stop3: { transformX: -675, transformY: 0 },
    stop4: { transformX: -900, transformY: 0 },
  },
  {
    id: 5,
    stop1: { transformX: -225, transformY: 15 },
    stop2: { transformX: -450, transformY: 30 },
    stop3: { transformX: -675, transformY: 15 },
    stop4: { transformX: -900, transformY: 0 },
  },
  {
    id: 6,
    stop1: { transformX: -225, transformY: -15 },
    stop2: { transformX: -450, transformY: -30 },
    stop3: { transformX: -675, transformY: -15 },
    stop4: { transformX: -900, transformY: 0 },
  },
  {
    id: 7,
    stop1: { transformX: -225, transformY: 15 },
    stop2: { transformX: -450, transformY: 30 },
    stop3: { transformX: -675, transformY: 15 },
    stop4: { transformX: -900, transformY: 0 },
  },
  {
    id: 8,
    stop1: { transformX: -225, transformY: -30 },
    stop2: { transformX: -450, transformY: 0 },
    stop3: { transformX: -780, transformY: -40 },
    stop4: { transformX: -950, transformY: 0 },
  },
  {
    id: 9,
    stop1: { transformX: -225, transformY: -15 },
    stop2: { transformX: -450, transformY: -30 },
    stop3: { transformX: -795, transformY: -30 },
    stop4: { transformX: -980, transformY: 20 },
  },
  {
    id: 10,
    stop1: { transformX: -225, transformY: 15 },
    stop2: { transformX: -450, transformY: 30 },
    stop3: { transformX: -735, transformY: 20 },
    stop4: { transformX: -940, transformY: -40 },
  },
  {
    id: 11,
    stop1: { transformX: -225, transformY: -15 },
    stop2: { transformX: -450, transformY: -30 },
    stop3: { transformX: -785, transformY: -15 },
    stop4: { transformX: -950, transformY: 0 },
  },
  {
    id: 12,
    stop1: { transformX: -225, transformY: 15 },
    stop2: { transformX: -450, transformY: 30 },
    stop3: { transformX: -800, transformY: 15 },
    stop4: { transformX: -940, transformY: 0 },
  },
  {
    id: 13,
    stop1: { transformX: -225, transformY: -15 },
    stop2: { transformX: -450, transformY: -30 },
    stop3: { transformX: -780, transformY: -15 },
    stop4: { transformX: -90, transformY: 0, centerX: true },
  },
  {
    id: 14,
    stop1: { transformX: -225, transformY: 0 },
    stop2: { transformX: -450, transformY: -20 },
    stop3: { transformX: -735, transformY: -30 },
    stop4: { transformX: -940, transformY: 20 },
  },
  {
    id: 15,
    stop1: { transformX: -225, transformY: 0 },
    stop2: { transformX: -450, transformY: 0 },
    stop3: { transformX: -675, transformY: 0 },
    stop4: { transformX: -910, transformY: -20 },
  },
  {
    id: 16,
    stop1: { transformX: -225, transformY: 0 },
    stop2: { transformX: -450, transformY: -20 },
    stop3: { transformX: -675, transformY: -30 },
    stop4: { transformX: -920, transformY: -40 },
  },
  {
    id: 17,
    stop1: { transformX: -225, transformY: 0 },
    stop2: { transformX: -450, transformY: 0 },
    stop3: { transformX: -675, transformY: 0 },
    stop4: { transformX: -900, transformY: 0 },
  },
  {
    id: 18,
    stop1: { transformX: -225, transformY: 0 },
    stop2: { transformX: -450, transformY: 0 },
    stop3: { transformX: -675, transformY: 0 },
    stop4: { transformX: -900, transformY: 0 },
  },
]

// Variantes spécifiques pour pouvoir ajuster indépendamment tablette et mobile
const TABLET_ITEMS_CONFIG = [
  {
    id: 1,
    stop1: { transformX: -146.25, transformY: 0 },
    stop2: { transformX: -292.5, transformY: 0 },
    stop3: { transformX: -438.75, transformY: 0 },
    stop4: { transformX: -585, transformY: 0 },
  },
  {
    id: 2,
    stop1: { transformX: 146.25, transformY: 0 },
    stop2: { transformX: 292.5, transformY: 0 },
    stop3: { transformX: 103.75, transformY: 0 },
    stop4: { transformX: -85, transformY: 0 },
  },
  {
    id: 3,
    stop1: { transformX: -146.25, transformY: 0 },
    stop2: { transformX: -292.5, transformY: 0 },
    stop3: { transformX: 3946.25, transformY: 0 },
    stop4: { transformX: 8185, transformY: 0 },
  },
  {
    id: 4,
    stop1: { transformX: -61.25, transformY: 0 },
    stop2: { transformX: -122.5, transformY: 0 },
    stop3: { transformX: -103.75, transformY: 0 },
    stop4: { transformX: -85, transformY: 0 },
  },
  {
    id: 5,
    stop1: { transformX: -146.25, transformY: 11.25 },
    stop2: { transformX: -292.5, transformY: 22.5 },
    stop3: { transformX: -438.75, transformY: 11.25 },
    stop4: { transformX: -585, transformY: 0 },
  },
  {
    id: 6,
    stop1: { transformX: -146.25, transformY: -11.25 },
    stop2: { transformX: -292.5, transformY: -22.5 },
    stop3: { transformX: -363.75, transformY: -101.25 },
    stop4: { transformX: -435, transformY: -180 },
  },
  {
    id: 7,
    stop1: { transformX: -146.25, transformY: 11.25 },
    stop2: { transformX: -292.5, transformY: 22.5 },
    stop3: { transformX: -438.75, transformY: 11.25 },
    stop4: { transformX: -585, transformY: 0 },
  },
  {
    id: 8,
    stop1: { transformX: 50, transformY: 0 },
    stop2: { transformX: 100, transformY: 0 },
    stop3: { transformX: 27.5, transformY: 0 },
    stop4: { transformX: -85, transformY: 0 },
  },
  {
    id: 9,
    stop1: { transformX: -96.25, transformY: -11.25 },
    stop2: { transformX: -192.5, transformY: -22.5 },
    stop3: { transformX: -388.75, transformY: 3.75 },
    stop4: { transformX: -585, transformY: 30 },
  },
  {
    id: 10,
    stop1: { transformX: -146.25, transformY: -1.25 },
    stop2: { transformX: -292.5, transformY: -2.5 },
    stop3: { transformX: -173.75, transformY: -16.25 },
    stop4: { transformX: -55, transformY: -30 },
  },
  {
    id: 11,
    stop1: { transformX: -146.25, transformY: -11.25 },
    stop2: { transformX: -292.5, transformY: -22.5 },
    stop3: { transformX: -148.75, transformY: -61.25 },
    stop4: { transformX: -5, transformY: -100 },
  },
  {
    id: 12,
    stop1: { transformX: -146.25, transformY: 11.25 },
    stop2: { transformX: -292.5, transformY: 22.5 },
    stop3: { transformX: -438.75, transformY: 11.25 },
    stop4: { transformX: -585, transformY: 0 },
  },
  {
    id: 13,
    stop1: { transformX: -146.25, transformY: -11.25 },
    stop2: { transformX: -292.5, transformY: -22.5 },
    stop3: { transformX: -438.75, transformY: -11.25 },
    stop4: { transformX: -585, transformY: 0, centerX: true },
  },
  {
    id: 14,
    stop1: { transformX: -146.25, transformY: 0 },
    stop2: { transformX: -292.5, transformY: -15 },
    stop3: { transformX: -438.75, transformY: -22.5 },
    stop4: { transformX: -585, transformY: -30 },
  },
  {
    id: 15,
    stop1: { transformX: -146.25, transformY: 0 },
    stop2: { transformX: -292.5, transformY: 0 },
    stop3: { transformX: -438.75, transformY: 0 },
    stop4: { transformX: -585, transformY: 0 },
  },
  {
    id: 16,
    stop1: { transformX: -146.25, transformY: 0 },
    stop2: { transformX: -292.5, transformY: -15 },
    stop3: { transformX: -438.75, transformY: -22.5 },
    stop4: { transformX: -585, transformY: -30 },
  },
  {
    id: 17,
    stop1: { transformX: -146.25, transformY: 0 },
    stop2: { transformX: -292.5, transformY: 0 },
    stop3: { transformX: -438.75, transformY: 0 },
    stop4: { transformX: -585, transformY: 0 },
  },
  {
    id: 18,
    stop1: { transformX: -146.25, transformY: 0 },
    stop2: { transformX: -292.5, transformY: 0 },
    stop3: { transformX: -438.75, transformY: 0 },
    stop4: { transformX: -585, transformY: 0 },
  },
]

const MOBILE_ITEMS_CONFIG = [
  {
    id: 1,
    stop1: { transformX: 0, transformY: 25 },
    stop2: { transformX: 0, transformY: 50 },
    stop3: { transformX: 0, transformY: -30 },
    stop4: { transformX: 0, transformY: -60 },
  },
  {
    id: 2,
    stop1: { transformX: 0, transformY: -20 },
    stop2: { transformX: 0, transformY: -40 },
    stop3: { transformX: 0, transformY: 20 },
    stop4: { transformX: 0, transformY: 50 },
  },
  {
    id: 3,
    stop1: { transformX: 0, transformY: 30 },
    stop2: { transformX: 0, transformY: 60 },
    stop3: { transformX: 0, transformY: -25 },
    stop4: { transformX: 0, transformY: -50 },
  },
  {
    id: 4,
    stop1: { transformX: 0, transformY: -25 },
    stop2: { transformX: 0, transformY: -50 },
    stop3: { transformX: 0, transformY: 30 },
    stop4: { transformX: 0, transformY: 60 },
  },
  {
    id: 5,
    stop1: { transformX: 0, transformY: -20 },
    stop2: { transformX: 0, transformY: -45 },
    stop3: { transformX: 0, transformY: 35 },
    stop4: { transformX: 0, transformY: 70 },
  },
  {
    id: 6,
    stop1: { transformX: 0, transformY: -30 },
    stop2: { transformX: 0, transformY: -60 },
    stop3: { transformX: 0, transformY: -120 },
    stop4: { transformX: 0, transformY: -180 },
  },
  {
    id: 7,
    stop1: { transformX: 0, transformY: 25 },
    stop2: { transformX: 0, transformY: 55 },
    stop3: { transformX: 0, transformY: -20 },
    stop4: { transformX: 0, transformY: -45 },
  },
  {
    id: 8,
    stop1: { transformX: 0, transformY: -20 },
    stop2: { transformX: 0, transformY: -45 },
    stop3: { transformX: 0, transformY: 25 },
    stop4: { transformX: 0, transformY: 55 },
  },
  {
    id: 9,
    stop1: { transformX: 0, transformY: -11.25 },
    stop2: { transformX: 0, transformY: -22.5 },
    stop3: { transformX: 0, transformY: 3.75 },
    stop4: { transformX: 0, transformY: 30 },
  },
  {
    id: 10,
    stop1: { transformX: 0, transformY: -1.25 },
    stop2: { transformX: 0, transformY: -2.5 },
    stop3: { transformX: 0, transformY: -16.25 },
    stop4: { transformX: 0, transformY: -30 },
  },
  {
    id: 11,
    stop1: { transformX: 0, transformY: -11.25 },
    stop2: { transformX: 0, transformY: -22.5 },
    stop3: { transformX: 0, transformY: -61.25 },
    stop4: { transformX: 0, transformY: -100 },
  },
  {
    id: 12,
    stop1: { transformX: 0, transformY: 11.25 },
    stop2: { transformX: 0, transformY: 22.5 },
    stop3: { transformX: 0, transformY: 11.25 },
    stop4: { transformX: 0, transformY: 0 },
  },
  {
    id: 13,
    stop1: { transformX: 0, transformY: -11.25 },
    stop2: { transformX: 0, transformY: -22.5 },
    stop3: { transformX: 0, transformY: -11.25 },
    stop4: { transformX: 0, transformY: 0, centerX: true },
  },
  {
    id: 14,
    stop1: { transformX: 0, transformY: 0 },
    stop2: { transformX: 0, transformY: -15 },
    stop3: { transformX: 0, transformY: -22.5 },
    stop4: { transformX: 0, transformY: -30 },
  },
  {
    id: 15,
    stop1: { transformX: 0, transformY: 0 },
    stop2: { transformX: 0, transformY: 0 },
    stop3: { transformX: 0, transformY: 0 },
    stop4: { transformX: 0, transformY: 0 },
  },
  {
    id: 16,
    stop1: { transformX: 0, transformY: 0 },
    stop2: { transformX: 0, transformY: -15 },
    stop3: { transformX: 0, transformY: -22.5 },
    stop4: { transformX: 0, transformY: -30 },
  },
  {
    id: 17,
    stop1: { transformX: 0, transformY: 0 },
    stop2: { transformX: 0, transformY: 0 },
    stop3: { transformX: 0, transformY: 0 },
    stop4: { transformX: 0, transformY: 0 },
  },
  {
    id: 18,
    stop1: { transformX: 0, transformY: 0 },
    stop2: { transformX: 0, transformY: 0 },
    stop3: { transformX: 0, transformY: 0 },
    stop4: { transformX: 0, transformY: 0 },
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
  // Chaque stop = 1 image entière (~8em desktop, ~7.75em mobile)
  const sliderConfig =
    breakpoint === 'desktop'
      ? {
          stop1: { transformX: -7.938, transformY: 0 },
          stop2: { transformX: -15.876, transformY: 0 },
          stop3: { transformX: -23.814, transformY: 0 },
          stop4: { transformX: -31.752, transformY: 0 },
        }
      : {
          stop1: { transformY: -7.75 },
          stop2: { transformY: -15.5 },
          stop3: { transformY: -23.25 },
          stop4: { transformY: -31 },
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
      itemStop3: config.stop3,
      itemStop4: config.stop4,
      sliderStop1: sliderConfig.stop1,
      sliderStop2: sliderConfig.stop2,
      sliderStop3: sliderConfig.stop3,
      sliderStop4: sliderConfig.stop4,
    }
  })

  return items
}
