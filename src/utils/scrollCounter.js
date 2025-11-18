import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Initialise l'animation complète du scroll counter avec compteur mécanique et animations d'images
 * La section doit contenir:
 * - .our-story (conteneur sticky)
 * - .counter-right_slider, .counter-center_slider, .counter-left_slider (sliders du compteur)
 * - .our-story_image-2, .our-story_image-3, .our-story_image-4 (images à animer)
 *   ou .our-people_image-1 à .our-people_image-4 (nouveau naming)
 * - .our-story_content_left .p-small et .our-story_content_right .p-small (paragraphes texte)
 *
 * @param {string} sectionSelector - Sélecteur CSS de la section principale (ex: '.section.section_our-story')
 */
export function initScrollCounter(sectionSelector) {
  const hasDOM =
    typeof window !== 'undefined' && typeof document !== 'undefined'
  if (!hasDOM) {
    return
  }

  let section = null
  if (typeof sectionSelector === 'string') {
    section = document.querySelector(sectionSelector)
  } else if (sectionSelector instanceof Element) {
    section = sectionSelector
  }

  if (!section) {
    return
  }

  const requiredSelectors = {
    sticky: '.our-story',
    rightSlider: '.counter-right_slider',
    centerSlider: '.counter-center_slider',
    leftSlider: '.counter-left_slider',
    container: '.counter-right',
  }

  const resolved = {}
  const missingSelectors = []

  Object.entries(requiredSelectors).forEach(([key, selector]) => {
    const element = section.querySelector(selector)
    resolved[key] = element
    if (!element) {
      missingSelectors.push(selector)
    }
  })

  if (missingSelectors.length) {
    return
  }

  const { sticky, rightSlider, centerSlider, leftSlider, container } = resolved
  const leftParagraph = section?.querySelector(
    '.our-story_content_left .p-small'
  )
  const rightParagraph = section?.querySelector(
    '.our-story_content_right .p-small'
  )

  if (
    !section ||
    !sticky ||
    !rightSlider ||
    !centerSlider ||
    !leftSlider ||
    !container
  ) {
    return
  }

  // Reset any previous transforms
  gsap.set([rightSlider, centerSlider, leftSlider], { x: 0, y: 0 })

  // Calculer la hauteur d'un chiffre
  let digitHeight = 0
  const getDigitHeight = () => {
    if (digitHeight === 0) {
      const testSpan = rightSlider.querySelector('.counter-number')
      if (testSpan) {
        const rect = testSpan.getBoundingClientRect()
        digitHeight = rect.height || 0
      }
    }
    return digitHeight
  }

  // Prépare les bornes de fenêtrage
  let linesTween = null
  let linesTrigger = null

  // Utilitaire: split un paragraphe en lignes visibles et retourne les covers ajoutés
  const splitIntoLinesWithCovers = (paragraph) => {
    if (!paragraph) return []
    // Restaurer si déjà splitté
    if (paragraph.dataset.originalHtml) {
      paragraph.innerHTML = paragraph.dataset.originalHtml
    } else {
      paragraph.dataset.originalHtml = paragraph.innerHTML
    }
    const text = paragraph.textContent || ''
    // Créer des spans par mot + espace
    paragraph.innerHTML = ''
    const tokens = text.split(/(\s+)/) // conserve espaces
    const tokenSpans = []
    tokens.forEach((tok) => {
      const span = document.createElement('span')
      span.textContent = tok
      span.style.display = 'inline'
      span.style.whiteSpace = 'pre-wrap'
      paragraph.appendChild(span)
      tokenSpans.push(span)
    })
    // Mesurer les lignes par changement de top
    const groups = []
    let current = []
    let lastTop = null
    tokenSpans.forEach((el) => {
      const r = el.getBoundingClientRect()
      const top = Math.round(r.top)
      if (lastTop === null) {
        lastTop = top
      }
      if (Math.abs(top - lastTop) > 1) {
        if (current.length) groups.push(current)
        current = []
        lastTop = top
      }
      current.push(el)
    })
    if (current.length) groups.push(current)

    // Construire des wrappers de lignes + cover
    const covers = []
    const lineHeight = (() => {
      const cs = getComputedStyle(paragraph)
      const lh = parseFloat(cs.lineHeight)
      if (isNaN(lh)) {
        const fs = parseFloat(cs.fontSize) || 16
        const lhFactor = 1.1
        return fs * lhFactor
      }
      return lh
    })()

    groups.forEach((grp) => {
      const lineWrap = document.createElement('span')
      lineWrap.className = 'our-story_line-wrap'
      lineWrap.style.display = 'block'
      lineWrap.style.position = 'relative'
      // Déplacer les tokens dans le wrapper
      grp[0].parentNode.insertBefore(lineWrap, grp[0])
      grp.forEach((n) => lineWrap.appendChild(n))
      // Cover
      const cover = document.createElement('span')
      cover.className = 'our-story_line-cover'
      cover.style.position = 'absolute'
      // Ancrer à droite (réduction vers la gauche)
      cover.style.inset = '0 0 auto auto'
      cover.style.top = '0'
      cover.style.right = '0'
      cover.style.left = 'auto'
      cover.style.height = lineHeight + 'px'
      cover.style.width = '100%'
      // Opacité et dégradé à l'extrémité (de #ECEDEE 100% à 0%)
      cover.style.opacity = '0.9'
      cover.style.background =
        'linear-gradient(90deg, rgba(236,237,238,0) 0%, rgba(236,237,238,1) 10%, rgba(236,237,238,1) 100%)'
      cover.style.pointerEvents = 'none'
      cover.style.willChange = 'width'
      cover.style.zIndex = '2'
      lineWrap.appendChild(cover)
      covers.push(cover)
    })
    return covers
  }

  const buildLinesAnimation = () => {
    if (linesTween) {
      linesTween.kill()
      linesTween = null
    }
    if (linesTrigger) {
      linesTrigger.kill()
      linesTrigger = null
    }
    const coversLeft = splitIntoLinesWithCovers(leftParagraph)
    const coversRight = splitIntoLinesWithCovers(rightParagraph)
    const covers = [...coversLeft, ...coversRight]
    if (covers.length === 0) return
    // Dépassement de 10% vers la gauche pour que le début du dégradé (0-10%) soit hors champ
    gsap.set(covers, { width: '110%' })
    // Timeline séquentielle (l'une après l'autre) sur toute la durée du sticky
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    covers.forEach((cv) => {
      tl.fromTo(cv, { width: '110%' }, { width: 0, duration: 1 })
    })
    linesTween = tl
    linesTrigger = tl.scrollTrigger
  }

  // Animation synchronisée des 3 sliders pour compter de 0 à 100 avec glissement fluide
  // Système mécanique: slider droit glisse continuellement, autres avancent par étapes
  const createCounterAnimation = () => {
    const dh = getDigitHeight()
    if (dh === 0) return // Attendre que la hauteur soit disponible

    // Timeline GSAP avec scrub pour créer un glissement fluide synchronisé au scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          gsap.set([rightSlider, centerSlider, leftSlider], { y: 0 })
          buildLinesAnimation()
        },
      },
    })

    // Animation du slider droit (unités): glisse continuellement de 0 à 100 (101 chiffres)
    tl.to(
      rightSlider,
      {
        y: -100 * dh,
        duration: 1,
        ease: 'none',
      },
      0
    )

    // Animation du slider centre: glisse dès que le 9 commence à sortir
    for (let i = 0; i < 10; i++) {
      const startPosition = (i + 1) * 0.1 - 0.01 // Position: 0.09, 0.19, 0.29, ..., 0.99
      tl.to(
        centerSlider,
        {
          y: -(i + 1) * dh,
          duration: 0.01,
          ease: 'none',
        },
        startPosition
      )
    }

    // Animation du slider gauche: glisse à 99% (quand le 9 du centre commence à sortir)
    tl.to(
      leftSlider,
      {
        y: -1 * dh,
        duration: 0.01,
        ease: 'none',
      },
      0.99
    )
  }

  // S'assurer que la hauteur du digit est calculée quand les éléments sont visibles
  const initCounterAnimation = () => {
    if (getDigitHeight() > 0) {
      createCounterAnimation()
    } else {
      // Réessayer après un court délai
      setTimeout(initCounterAnimation, 100)
    }
  }

  // Initialiser l'animation du compteur
  initCounterAnimation()

  // Fonction réutilisable pour animer les images avec scale 0 -> 1
  // startProgress: moment de départ (0 = début, 1 = fin)
  // endProgress: moment de fin (0 = début, 1 = fin)
  const animateImage = (image, startProgress = 0, endProgress = 1) => {
    if (!image) return

    // Créer une timeline séparée pour cette image
    gsap.fromTo(
      image,
      { scale: 0, transformOrigin: '50% 50%' },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress
            // Calculer si nous sommes dans la plage d'animation pour cette image
            if (progress >= startProgress && progress <= endProgress) {
              const imageProgress =
                (progress - startProgress) / (endProgress - startProgress)
              gsap.set(image, { scale: imageProgress })
            } else if (progress < startProgress) {
              gsap.set(image, { scale: 0 })
            } else {
              gsap.set(image, { scale: 1 })
            }
          },
        },
      }
    )
  }

  const imageSelectorSets = [
    ['.our-story_image-2', '.our-story_image-3', '.our-story_image-4'],
    [
      '.our-people_image-1',
      '.our-people_image-2',
      '.our-people_image-3',
      '.our-people_image-4',
    ],
  ]

  const imagesToAnimate =
    imageSelectorSets
      .map((selectors) =>
        selectors
          .map((sel) => section.querySelector(sel))
          .filter((img) => img instanceof HTMLElement)
      )
      .find((set) => set.length > 0) || []

  if (imagesToAnimate.length) {
    const [staticImage, ...animatedImages] = imagesToAnimate
    if (staticImage) {
      gsap.set(staticImage, { scale: 1 })
    }
    if (!animatedImages.length) {
      return
    }
    const segment = 1 / animatedImages.length
    animatedImages.forEach((image, index) => {
      const start = segment * index
      const end = segment * (index + 1)
      animateImage(image, start, end)
    })
  }
}
