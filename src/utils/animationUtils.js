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

// Recharge la page si la largeur change (breakpoint / orientation).
// On ignore les variations de hauteur : sur mobile, innerHeight bouge
// quand la barre du browser se cache, et un reload la ferait rester visible.
export const reloadOnViewportChange = () => {
  if (typeof window === 'undefined') return

  window.history.scrollRestoration = 'manual'
  let lastWidth = window.innerWidth

  const handleViewportChange = () => {
    const nextWidth = window.innerWidth
    if (nextWidth === lastWidth) return

    window.removeEventListener('resize', handleViewportChange)
    window.removeEventListener('orientationchange', handleViewportChange)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    window.location.reload()
  }

  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('orientationchange', handleViewportChange)
}
