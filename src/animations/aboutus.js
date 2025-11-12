import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initAboutUs() {
  const section = document.querySelector('.section.section_our-story')
  const sticky = document.querySelector('.our-story')
  const slider = document.querySelector('.counter-right_slider')
  const container = document.querySelector('.counter-right')
  const leftSlider = document.querySelector('.counter-left_slider')
  const leftParagraph = document.querySelector(
    '.our-story_content_left .p-small'
  )
  const rightParagraph = document.querySelector(
    '.our-story_content_right .p-small'
  )
  if (!section || !sticky || !slider || !container) return
  if (!leftSlider) return

  // Reset any previous transforms
  gsap.set(slider, { x: 0, y: 0 })
  gsap.set(leftSlider, { x: 0, y: 0 })

  const getTargetY = () => {
    const containerH = container.clientHeight || 0
    // Trouver le dernier chiffre du ruban et mesurer son bottom relatif au haut du slider
    const nums = slider.querySelectorAll('.counter-number')
    const last = nums[nums.length - 1]
    if (last) {
      const sliderRect = slider.getBoundingClientRect()
      const lastRect = last.getBoundingClientRect()
      const lastBottomInSlider = lastRect.bottom - sliderRect.top
      // Objectif: le bas du dernier chiffre touche le bas du conteneur
      // => y = containerH - lastBottomInSlider (clampé pour éviter de dépasser)
      const y = containerH - lastBottomInSlider
      return Math.min(0, y)
    }
    // Fallback: aligner le bas du contenu avec le bas du conteneur
    const sliderH = slider.scrollHeight || slider.clientHeight || 0
    return Math.min(0, containerH - sliderH)
  }

  // Prépare les bornes de fenêtrage (entre 8e et 9e élément du ruban droit)
  let pStart = 0.6
  let pEnd = 1
  let leftTargetY = 0
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
      tl.fromTo(
        cv,
        { width: '110%' },
        { width: 0, duration: 1 } // 1 unité de durée par ligne, le scrub répartit
      )
    })
    linesTween = tl
    linesTrigger = tl.scrollTrigger
  }
  const computeWindow = () => {
    const containerH = container.clientHeight || 0
    const rightNums = slider.querySelectorAll('.counter-number')
    if (rightNums.length >= 9) {
      const sliderRect = slider.getBoundingClientRect()
      const lastRight = rightNums[rightNums.length - 1]
      const lastBottom =
        lastRight.getBoundingClientRect().bottom - sliderRect.top
      const yTotalRight = Math.min(0, containerH - lastBottom) || 0
      const idx8 = rightNums[7]
      const y8 = Math.min(
        0,
        containerH - (idx8.getBoundingClientRect().bottom - sliderRect.top)
      )
      if (yTotalRight !== 0) {
        pStart = y8 / yTotalRight
        // Finir au même moment que le ruban droit: fin de la section (progress 1)
        pEnd = 1
      }
    }
    // Calcul de la course cible pour le ruban gauche (jusqu'au bas de son dernier élément)
    const leftNums = leftSlider.querySelectorAll('.counter-number')
    if (leftNums.length > 0) {
      const leftRect = leftSlider.getBoundingClientRect()
      const leftLast = leftNums[leftNums.length - 1]
      const leftLastBottom =
        leftLast.getBoundingClientRect().bottom - leftRect.top
      leftTargetY = Math.min(0, containerH - leftLastBottom)
    } else {
      leftTargetY = 0
    }
  }
  computeWindow()

  gsap.to(slider, {
    y: getTargetY,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top', // quand .our-story devient sticky (la section atteint le haut)
      end: 'bottom bottom', // quand la section termine (fin du sticky)
      scrub: true,
      invalidateOnRefresh: true,
      onRefreshInit: () => {
        // reset avant mesure
        gsap.set(slider, { y: 0 })
        gsap.set(leftSlider, { y: 0 })
        buildLinesAnimation()
      },
      onRefresh: () => {
        // Recalcule les bornes et cibles à chaque refresh (resize / orientation change)
        computeWindow()
      },
      onUpdate: (self) => {
        const p = self.progress || 0
        const denom = Math.max(1e-6, pEnd - pStart)
        const t = (p - pStart) / denom
        const n = Math.max(0, Math.min(1, t))
        const yLeft = n * leftTargetY
        gsap.set(leftSlider, { y: yLeft })
      },
    },
  })

  // Image 2: scale 0 -> 1 sur toute la durée du sticky
  const image2 = document.querySelector('.our-story_image-2')
  if (image2) {
    gsap.fromTo(
      image2,
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
        },
      }
    )
  }
}
