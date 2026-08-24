import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let missionMatchMedia

function initCorporateCardsAnimation() {
  const corporateSection = document.querySelector('.section.section_corporate')
  const corporateStickyWrap = document.querySelector('.corporate-sticky-wrap')
  if (!corporateSection || !corporateStickyWrap) {
    return
  }

  const cards = document.querySelectorAll('.corporate-cards_card')
  if (cards.length === 0) {
    return
  }

  const cardHeadings = Array.from(cards).map((card) => card.querySelector('h3'))

  cardHeadings.forEach((heading) => {
    if (heading) {
      gsap.set(heading, { opacity: 1 })
    }
  })

  // Positionner les cartes avant l'animation
  const getOffscreenCardTop = () => {
    if (typeof window === 'undefined') {
      return '110vh'
    }
    return `${window.innerHeight + 50}px`
  }

  cards.forEach((card, index) => {
    if (index === 0) {
      gsap.set(card, { top: '0em' })
    } else {
      gsap.set(card, { top: getOffscreenCardTop() })
    }
  })

  const getStackStep = () =>
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 767px)').matches
      ? 1.3
      : 2

  const getStickyTravelDistance = () => {
    if (typeof window === 'undefined') {
      return 1
    }

    const paddingBottom =
      parseFloat(getComputedStyle(corporateSection).paddingBottom) || 0
    const travel =
      corporateSection.offsetHeight -
      corporateStickyWrap.offsetTop -
      corporateStickyWrap.offsetHeight -
      paddingBottom

    return travel > 0 ? travel : 1
  }

  const corporateTimeline = gsap.timeline({
    defaults: {
      ease: 'none',
      overwrite: 'auto',
    },
    scrollTrigger: {
      trigger: corporateStickyWrap,
      start: 'top top',
      end: () => `+=${getStickyTravelDistance()}`,
      scrub: true,
      markers: false,
      invalidateOnRefresh: true,
    },
  })

  cards.forEach((card, index) => {
    if (index === 0) {
      return
    }

    corporateTimeline.fromTo(
      card,
      {
        top: () => getOffscreenCardTop(),
      },
      {
        top: () => `${index * getStackStep()}em`,
        immediateRender: false,
        duration: 1,
      }
    )
  })

  cardHeadings.forEach((heading, index) => {
    if (!heading || index === cards.length - 1) {
      return
    }

    corporateTimeline.set(heading, { opacity: 0.2 }, index + 1)
  })
}

export function initAboutUs() {
  const hasDOM =
    typeof window !== 'undefined' && typeof document !== 'undefined'
  if (!hasDOM) {
    return
  }

  // Animation des cartes corporatives qui se superposent
  initCorporateCardsAnimation()

  const missionSection = document.querySelector('.section.section_our-mission')
  if (!missionSection) {
    if (missionMatchMedia) {
      missionMatchMedia.revert()
      missionMatchMedia = null
    }
    return
  }

  const missionElements = {
    leftImg: missionSection.querySelector('.our-mission_left_img'),
    top2: missionSection.querySelector('.our-mission_top-2'),
    top: missionSection.querySelector('.our-mission_top'),
    topImg: missionSection.querySelector('.our-mission_top_img'),
  }

  if (
    !missionElements.leftImg ||
    !missionElements.top2 ||
    !missionElements.top ||
    !missionElements.topImg
  ) {
    if (missionMatchMedia) {
      missionMatchMedia.revert()
      missionMatchMedia = null
    }
    return
  }

  const { leftImg, top2, top, topImg } = missionElements

  if (missionMatchMedia) {
    missionMatchMedia.revert()
  }

  missionMatchMedia = gsap.matchMedia()
  missionMatchMedia.add(
    {
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
    },
    (context) => {
      const isVertical = Boolean(context.conditions?.isMobile)
      setupMissionScroll({
        missionSection,
        leftImg,
        top2,
        top,
        topImg,
        isVertical,
      })
    }
  )
}

function setupMissionScroll({
  missionSection,
  leftImg,
  top2,
  top,
  topImg,
  isVertical,
}) {
  const panelProp = isVertical ? 'y' : 'x'
  const imgShift = isVertical ? { y: '-10%' } : { x: '-10%' }
  const imgShiftEnd = isVertical ? { y: '-20%' } : { x: '-20%' }
  const panelTravel = isVertical ? '-50vh' : '-50vw'
  const imgPercentProp = isVertical ? 'yPercent' : 'xPercent'

  gsap.set(leftImg, { x: 0, y: 0 })
  gsap.set(top2, { x: 0, y: 0 })
  gsap.set(top, { x: 0, y: 0, zIndex: 1 })
  gsap.set(topImg, {
    xPercent: 0,
    yPercent: 0,
    ...(isVertical ? { height: '125%', minHeight: '125%', flexShrink: 0 } : {}),
  })

  gsap.to(leftImg, {
    ...imgShift,
    scrollTrigger: {
      trigger: missionSection,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      markers: false,
    },
  })

  const missionPhase2 = gsap.timeline({
    defaults: {
      ease: 'none',
      overwrite: 'auto',
    },
    scrollTrigger: {
      trigger: missionSection,
      start: 'top top',
      end: () => `+=${window.innerHeight}`,
      scrub: true,
      markers: false,
      invalidateOnRefresh: true,
    },
  })

  missionPhase2.fromTo(
    leftImg,
    { ...imgShift },
    {
      ...imgShiftEnd,
      immediateRender: false,
    },
    0
  )

  missionPhase2.fromTo(
    top2,
    { [panelProp]: 0 },
    {
      [panelProp]: panelTravel,
      immediateRender: false,
    },
    0
  )

  const missionPhase2Trigger = missionPhase2.scrollTrigger

  const topImgPhase2Trigger = ScrollTrigger.create({
    trigger: missionSection,
    start: 'top top',
    end: () => `+=${window.innerHeight}`,
    scrub: true,
    markers: false,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const progress = gsap.utils.clamp(0, 1, self.progress)
      const percent = gsap.utils.interpolate(0, -10, progress)
      gsap.set(topImg, { [imgPercentProp]: percent })
    },
  })

  const missionPhase3 = gsap.timeline({
    defaults: {
      ease: 'none',
      overwrite: 'auto',
    },
    scrollTrigger: {
      trigger: missionSection,
      start: () => missionPhase2Trigger.end,
      end: () => missionPhase2Trigger.end + window.innerHeight,
      scrub: true,
      markers: false,
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.set(top, { zIndex: 3 })
        topImgPhase2Trigger.disable()
      },
      onEnterBack: () => {
        gsap.set(top, { zIndex: 3 })
        topImgPhase2Trigger.disable()
      },
      onLeave: () => {
        topImgPhase2Trigger.disable()
      },
      onLeaveBack: () => {
        gsap.set(top, { zIndex: 1 })
        topImgPhase2Trigger.enable()
      },
    },
  })

  missionPhase3.fromTo(
    top,
    { [panelProp]: 0 },
    {
      [panelProp]: panelTravel,
      immediateRender: false,
    }
  )

  missionPhase3.fromTo(
    topImg,
    { [imgPercentProp]: -10 },
    {
      [imgPercentProp]: -20,
      immediateRender: false,
    },
    0
  )
}
