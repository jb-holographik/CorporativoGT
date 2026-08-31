import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

CustomEase.create('hop', 'M0,0 C0.39,0 0.4,1 1,1')

export const customEase = CustomEase.get('hop')

// CTA hover easing (cubic-bezier(0.37, 0, 0, 1))
CustomEase.create('ctaHover', '0.37, 0, 0, 1')
export const ctaHoverEase = CustomEase.get('ctaHover')

// List transitions easing (cubic-bezier(0.6, 0, 0, 1))
CustomEase.create('listEasing', '0.6, 0, 0, 1')
export const listEasing = CustomEase.get('listEasing')

const VIEWPORT_BREAKPOINTS = [479, 767, 991]
const RELOAD_COOLDOWN_MS = 2500

function viewportBand(width) {
  for (let i = 0; i < VIEWPORT_BREAKPOINTS.length; i += 1) {
    if (width <= VIEWPORT_BREAKPOINTS[i]) return i
  }
  return VIEWPORT_BREAKPOINTS.length
}

// Recharge seulement si on change de breakpoint (ou d'orientation).
// Un simple écart de largeur (scrollbar Windows ~15px) ne doit pas recharger :
// ça bouclait et Chrome affichait Aw, Snap.
export const reloadOnViewportChange = () => {
  if (typeof window === 'undefined') return

  window.history.scrollRestoration = 'manual'
  let lastBand = viewportBand(window.innerWidth)
  let lastOrientation =
    typeof window.orientation === 'number' ? window.orientation : null

  const handleViewportChange = () => {
    const nextWidth = window.innerWidth
    const nextBand = viewportBand(nextWidth)
    const nextOrientation =
      typeof window.orientation === 'number'
        ? window.orientation
        : lastOrientation
    const bandChanged = nextBand !== lastBand
    const orientationChanged =
      lastOrientation !== null &&
      nextOrientation !== null &&
      nextOrientation !== lastOrientation

    lastBand = nextBand
    lastOrientation = nextOrientation

    if (!bandChanged && !orientationChanged) return

    const now = Date.now()
    const lastReloadAt = Number(
      sessionStorage.getItem('viewport-reload-at') || 0
    )
    if (now - lastReloadAt < RELOAD_COOLDOWN_MS) return

    window.removeEventListener('resize', handleViewportChange)
    window.removeEventListener('orientationchange', handleViewportChange)
    sessionStorage.setItem('viewport-reload-at', String(now))
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    window.location.reload()
  }

  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('orientationchange', handleViewportChange)
}
