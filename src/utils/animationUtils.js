import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

CustomEase.create('hop', 'M0,0 C0.39,0 0.4,1 1,1')

export const customEase = CustomEase.get('hop')

// CTA hover easing (cubic-bezier(0.37, 0, 0, 1))
CustomEase.create('ctaHover', '0.37, 0, 0, 1')
export const ctaHoverEase = CustomEase.get('ctaHover')
