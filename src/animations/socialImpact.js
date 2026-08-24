import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const COLLAPSED_WIDTH = 28
const EXPANDED_WIDTH = 57

const parseValueWithUnit = (rawValue = '0') => {
  const match = `${rawValue}`.trim().match(/([-+]?\d*\.?\d+)([a-z%]*)/i)
  return {
    value: match ? parseFloat(match[1]) : 0,
    unit: match && match[2] ? match[2] : '',
  }
}

const getFontSize = (element) =>
  parseFloat(getComputedStyle(element).fontSize) || 16

const pxToEm = (px, element) => px / getFontSize(element)

let socialImpactMatchMedia

export function initSocialImpact() {
  if (socialImpactMatchMedia) {
    socialImpactMatchMedia.revert()
    socialImpactMatchMedia = null
  }

  const section = document.querySelector('.social-impact')
  const maskRect = document.querySelector('.svg-mask mask rect:nth-of-type(2)')

  if (!section || !maskRect) return

  socialImpactMatchMedia = gsap.matchMedia()
  socialImpactMatchMedia.add('(min-width: 768px)', () => {
    const maskEl = section.querySelector('.social-impact_mask')
    const topEl = section.querySelector('.social-impact_top')
    const { unit: widthUnit } = parseValueWithUnit(
      maskRect.getAttribute('width')
    )
    const { unit: xUnit } = parseValueWithUnit(maskRect.getAttribute('x'))
    const unit = widthUnit || xUnit || 'em'

    const measure = () => {
      const collapsed = maskEl
        ? pxToEm(maskEl.getBoundingClientRect().width, section)
        : COLLAPSED_WIDTH
      const gapPx = topEl
        ? parseFloat(getComputedStyle(topEl).columnGap) ||
          parseFloat(getComputedStyle(topEl).gap) ||
          getFontSize(section)
        : getFontSize(section)
      const gap = pxToEm(gapPx, section)
      const startX = collapsed + gap
      const topWidth = topEl
        ? pxToEm(topEl.getBoundingClientRect().width, section)
        : EXPANDED_WIDTH
      const expanded = Math.min(
        collapsed * (EXPANDED_WIDTH / COLLAPSED_WIDTH),
        topWidth
      )

      return {
        collapsed,
        expanded,
        startX,
        fixedRightEdge: startX + collapsed,
      }
    }

    const phaseOne = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top 40%',
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    phaseOne.to(maskRect, {
      attr: {
        width: () => `${measure().collapsed}${unit}`,
      },
    })

    const phaseTwo = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom 60%',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    phaseTwo.to(maskRect, {
      attr: {
        width: () => `${measure().expanded}${unit}`,
        x: () => {
          const metrics = measure()
          return `${metrics.fixedRightEdge - metrics.expanded}${unit}`
        },
      },
    })
  })
}
