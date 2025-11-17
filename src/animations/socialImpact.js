import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const parseValueWithUnit = (rawValue = '0') => {
  const match = `${rawValue}`.trim().match(/([-+]?\d*\.?\d+)([a-z%]*)/i)
  return {
    value: match ? parseFloat(match[1]) : 0,
    unit: match && match[2] ? match[2] : '',
  }
}

export function initSocialImpact() {
  const section = document.querySelector('.social-impact')
  const maskRect = document.querySelector('.svg-mask mask rect:nth-of-type(2)')

  if (!section || !maskRect) return

  const { unit: widthUnit } = parseValueWithUnit(maskRect.getAttribute('width'))
  const { value: startX, unit: xUnit } = parseValueWithUnit(
    maskRect.getAttribute('x')
  )

  const collapsedWidth = 28
  const expandedWidth = 57
  const fixedRightEdge = startX + collapsedWidth

  const phaseOne = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top 40%',
      end: 'top top',
      scrub: true,
    },
  })

  phaseOne.to(maskRect, {
    attr: { width: `${collapsedWidth}${widthUnit || 'em'}` },
  })

  const phaseTwo = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom 60%',
      scrub: true,
    },
  })

  phaseTwo.to(maskRect, {
    attr: {
      width: `${expandedWidth}${widthUnit || 'em'}`,
      x: `${fixedRightEdge - expandedWidth}${xUnit || 'em'}`,
    },
  })
}
