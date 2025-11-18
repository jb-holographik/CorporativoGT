import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function distributeCircleImages(circleWrapper, images) {
  if (!circleWrapper || !images.length) {
    return () => {}
  }

  circleWrapper.classList.add(`count-${images.length}`)

  const getLargestImageSize = () => {
    return images.reduce((max, img) => {
      const rect = img.getBoundingClientRect()
      const width = rect.width || img.naturalWidth || 0
      const height = rect.height || img.naturalHeight || 0
      return Math.max(max, Math.max(width, height))
    }, 0)
  }

  const positionImages = () => {
    const width = circleWrapper.offsetWidth || circleWrapper.clientWidth
    const height = circleWrapper.offsetHeight || circleWrapper.clientHeight
    if (!width || !height) {
      return
    }

    const diameter = Math.min(width, height)
    const maxImg = getLargestImageSize() || diameter * 0.2
    const radius = Math.max(0, diameter / 2 - maxImg / 2 - 8)
    const angleStep = (Math.PI * 2) / images.length

    images.forEach((img, index) => {
      const angle = angleStep * index - Math.PI / 2
      const angleDeg = (angle * 180) / Math.PI
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      gsap.set(img, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        x,
        y,
        rotation: angleDeg + 90,
        transformOrigin: '50% 50%',
        willChange: 'transform',
      })
    })
  }

  gsap.set(circleWrapper, {
    position: 'relative',
    transformOrigin: '50% 50%',
  })

  positionImages()

  let resizeRaf = 0
  const handleResize = () => {
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf)
    }
    resizeRaf = requestAnimationFrame(positionImages)
  }

  window.addEventListener('resize', handleResize)
  ScrollTrigger.addEventListener('refresh', positionImages)

  return () => {
    window.removeEventListener('resize', handleResize)
    ScrollTrigger.removeEventListener('refresh', positionImages)
  }
}

export function initCareers() {
  const hasDOM =
    typeof window !== 'undefined' && typeof document !== 'undefined'
  if (!hasDOM) {
    return
  }

  const circleWrapper = document.querySelector('.careers-circle_circle')
  const careersSection = document.querySelector('.section.section_philosophy')
  if (!circleWrapper || !careersSection) {
    return
  }

  const images = Array.from(circleWrapper.querySelectorAll('.circle-img'))
  if (images.length === 0) {
    return
  }

  const cleanup = distributeCircleImages(circleWrapper, images)

  gsap.to(circleWrapper, {
    rotation: 360,
    ease: 'none',
    scrollTrigger: {
      trigger: careersSection,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  return cleanup
}
