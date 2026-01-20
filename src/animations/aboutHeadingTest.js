import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(SplitText)

const HEADING_EFFECTS = {
  blur: 'blur',
  scale: 'scale',
}

function initAboutHeadingSection({ sectionSelector, effect }) {
  const section = document.querySelector(sectionSelector)
  if (!section) return

  const headings = Array.from(section.querySelectorAll('.about-heading'))
  if (!headings.length) return

  const headingData = []

  headings.forEach((heading) => {
    if (!heading || heading.dataset.aboutHeadingTest === 'true') return
    heading.dataset.aboutHeadingTest = 'true'

    let chars = []
    if (heading.getAttribute('data-split') !== 'chars') {
      try {
        const split = new SplitText(heading, {
          type: 'chars',
          charsClass: 'about-heading-char',
        })
        heading.setAttribute('data-split', 'chars')
        chars = split?.chars || []
      } catch (e) {
        console.warn('SplitText indisponible pour about-heading.', e)
        return
      }
    } else {
      chars = Array.from(heading.querySelectorAll('.about-heading-char'))
    }

    if (!chars.length) return

    const blurValue = '6px'
    const blurPx = parseFloat(blurValue)

    gsap.set(heading, { whiteSpace: 'nowrap' })

    if (effect === HEADING_EFFECTS.scale) {
      gsap.set(chars, {
        scale: 0,
        opacity: 1,
        display: 'inline-block',
        transformOrigin: '50% 50%',
        willChange: 'transform',
      })
    } else {
      gsap.set(chars, {
        opacity: 0,
        filter: `blur(${blurValue})`,
        display: 'inline-block',
        willChange: 'opacity, filter',
      })
    }

    headingData.push({ heading, chars, blurPx })
  })

  if (!headingData.length) return

  const updateAll = () => {
    const viewportCenter = window.innerHeight / 2
    const edgeRange = window.innerHeight * 0.22
    const staggerStep = 0.06

    const dataWithCenters = headingData
      .map((item) => {
        const rect = item.heading.getBoundingClientRect()
        return {
          ...item,
          centerY: rect.top + rect.height / 2,
        }
      })
      .sort((a, b) => a.centerY - b.centerY)

    if (!dataWithCenters.length) return

    const lastIndex = dataWithCenters.length - 1
    let lowerIndex = 0

    while (
      lowerIndex < lastIndex &&
      dataWithCenters[lowerIndex + 1].centerY < viewportCenter
    ) {
      lowerIndex += 1
    }

    let upperIndex = Math.min(lowerIndex + 1, lastIndex)
    if (viewportCenter <= dataWithCenters[0].centerY) {
      lowerIndex = 0
      upperIndex = 0
    } else if (viewportCenter >= dataWithCenters[lastIndex].centerY) {
      lowerIndex = lastIndex
      upperIndex = lastIndex
    }

    let tBetween = 0
    if (lowerIndex !== upperIndex) {
      const lowerY = dataWithCenters[lowerIndex].centerY
      const upperY = dataWithCenters[upperIndex].centerY
      const span = upperY - lowerY || 1
      tBetween = gsap.utils.clamp(0, 1, (viewportCenter - lowerY) / span)
    }

    dataWithCenters.forEach((item, index) => {
      const { chars, blurPx, centerY } = item
      let baseT = 0

      if (lowerIndex === upperIndex) {
        const distance = Math.abs(centerY - viewportCenter)
        baseT = 1 - Math.min(distance / edgeRange, 1)
      } else if (index === lowerIndex) {
        baseT = 1 - tBetween
      } else if (index === upperIndex) {
        baseT = tBetween
      }

      const maxStep = chars.length > 1 ? 0.9 / (chars.length - 1) : staggerStep
      const effectiveStep = Math.min(staggerStep, maxStep)

      if (effect === HEADING_EFFECTS.scale) {
        gsap.set(chars, {
          scale: (i) => {
            const offset = i * effectiveStep
            const denom = 1 - offset || 1
            return gsap.utils.clamp(0, 1, (baseT - offset) / denom)
          },
        })
        return
      }

      gsap.set(chars, {
        opacity: (i) => {
          const offset = i * effectiveStep
          const denom = 1 - offset || 1
          return gsap.utils.clamp(0, 1, (baseT - offset) / denom)
        },
        filter: (i) => {
          const offset = i * effectiveStep
          const denom = 1 - offset || 1
          const t = gsap.utils.clamp(0, 1, (baseT - offset) / denom)
          const blurAmount = (1 - t) * blurPx
          return `blur(${blurAmount}px)`
        },
      })
    })
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: updateAll,
    onEnter: updateAll,
    onEnterBack: updateAll,
    onRefresh: updateAll,
  })

  requestAnimationFrame(updateAll)
}

export function initAboutHeadingTest() {
  initAboutHeadingSection({
    sectionSelector: '.section_about-test',
    effect: HEADING_EFFECTS.blur,
  })
  initAboutHeadingSection({
    sectionSelector: '.section_about-test-2',
    effect: HEADING_EFFECTS.scale,
  })
}
