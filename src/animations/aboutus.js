import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initScrollCounter } from '../utils/scrollCounter.js'

gsap.registerPlugin(ScrollTrigger)

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

  const totalCards = cards.length

  // Nombre de cartes à animer (toutes sauf la première)
  const cardsToAnimate = totalCards > 0 ? totalCards - 1 : 0

  const getStickyTravelDistance = () => {
    if (typeof window === 'undefined') {
      return 1
    }

    const sectionHeight =
      corporateSection.scrollHeight ||
      corporateSection.getBoundingClientRect().height ||
      0

    const stickyHeight =
      corporateStickyWrap.getBoundingClientRect().height ||
      corporateStickyWrap.offsetHeight ||
      window.innerHeight ||
      0

    const travel = sectionHeight - stickyHeight
    return travel > 0 ? travel : 1
  }

  const stickyDuration = getStickyTravelDistance()
  const movingCards = cardsToAnimate > 0 ? cardsToAnimate : 1
  const cardDuration = stickyDuration / movingCards

  // Animation timeline pour les cartes
  const corporateTimeline = gsap.timeline({
    defaults: {
      ease: 'none',
      overwrite: 'auto',
    },
    scrollTrigger: {
      trigger: corporateSection,
      start: 'top top', // Début de la section
      end: 'bottom bottom', // Durée déterminée par la section elle-même
      scrub: true, // Lier l'animation au scroll
      markers: false, // À mettre à true pour debug
      invalidateOnRefresh: true,
    },
  })

  // Animer chaque carte pour qu'elles se superposent une par une
  cards.forEach((card, index) => {
    if (index === 0) {
      // La première carte reste en place
      return
    }

    // Position finale : chaque carte à 2em des autres
    const finalTop = index * 2

    // Temps d'arrivée de cette carte dans la timeline
    const startTime = (index - 1) * cardDuration

    corporateTimeline.fromTo(
      card,
      {
        top: () => getOffscreenCardTop(), // Position initiale
      },
      {
        top: `${finalTop}em`, // Position finale (2em, 4em, 6em, 8em, etc.)
        immediateRender: false,
        duration: cardDuration,
      },
      startTime // Temps d'arrivée dans la timeline
    )
  })

  cardHeadings.forEach((heading, index) => {
    if (!heading) {
      return
    }

    const isLastCard = index === cards.length - 1
    let fadeTime = null

    if (cardsToAnimate > 0) {
      if (!isLastCard) {
        // Attendre que la carte suivante termine son animation
        fadeTime = (index + 1) * cardDuration
      }
    }

    if (fadeTime !== null) {
      corporateTimeline.set(heading, { opacity: 0.2 }, fadeTime)
    }
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

  // Initialiser le scroll counter pour la section "Our Story"
  initScrollCounter('.section.section_our-story')

  const missionSection = document.querySelector('.section.section_our-mission')
  if (!missionSection) {
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
    return
  }

  const { leftImg, top2, top, topImg } = missionElements

  // Assurer l'état initial des éléments de la section Our Mission
  gsap.set(leftImg, { x: 0 })
  gsap.set(top2, { x: 0 })
  gsap.set(top, { x: 0, zIndex: 1 })
  gsap.set(topImg, { xPercent: 0 })

  // Animation GSAP pour la section Our Mission
  gsap.to(leftImg, {
    x: '-10%',
    scrollTrigger: {
      trigger: missionSection,
      start: 'top bottom', // Quand le top de la section arrive au bottom du viewport
      end: 'top top', // Quand le top de la section arrive au top du viewport
      scrub: true, // Lier l'animation au scroll
      markers: false, // À mettre à true pour debug
    },
  })

  // Phase 2 : du top du viewport jusqu'à +100vh
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
    {
      x: '-10%',
    },
    {
      x: '-20%',
      immediateRender: false,
    },
    0
  )

  missionPhase2.fromTo(
    top2,
    {
      x: 0,
    },
    {
      x: '-50vw',
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
      const xPercent = gsap.utils.interpolate(0, -10, progress)
      gsap.set(topImg, { xPercent })
    },
  })

  // Phase 3 : poursuivre le mouvement avec .our-mission_top
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
    {
      x: 0,
    },
    {
      x: '-50vw',
      immediateRender: false,
    }
  )

  missionPhase3.fromTo(
    topImg,
    {
      xPercent: -10,
    },
    {
      xPercent: -20,
      immediateRender: false,
    },
    0
  )
}
