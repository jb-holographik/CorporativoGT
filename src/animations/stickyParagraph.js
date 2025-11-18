import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(SplitText)

export function initStickyParagraph() {
  const sticky = document.querySelector('.sticky-paragraph')
  if (!sticky) return

  // Split le paragraphe en lignes une seule fois
  const p = sticky.querySelector('.sticky_inner p')
  let lineCount = 0
  if (p && p.getAttribute('data-split') !== 'lines') {
    try {
      const split = new SplitText(p, {
        type: 'lines',
        linesClass: 'sticky-line',
      })
      p.setAttribute('data-split', 'lines')
      lineCount = split?.lines?.length || 0
    } catch (e) {
      console.warn('SplitText indisponible, paragraphe non splitté.', e)
    }
  } else if (p) {
    // Si déjà splitté, compter les lignes existantes
    const existingLines = sticky.querySelectorAll('.sticky-line')
    lineCount = existingLines.length
  }

  // Le sticky se termine lorsque le conteneur a défilé de (hauteur conteneur - hauteur sticky)
  const container =
    sticky.closest('.certification-content') || sticky.parentElement || sticky

  const getStickyEnd = () => {
    const containerHeight = container?.offsetHeight || 0
    const stickyHeight = sticky?.offsetHeight || 0
    const distance = containerHeight - stickyHeight
    return distance > 0 ? `+=${distance}` : 'bottom 48%'
  }

  ScrollTrigger.create({
    trigger: sticky,
    start: 'top 48%',
    endTrigger: container,
    end: getStickyEnd,
    invalidateOnRefresh: true,
  })

  // Assurer le même nombre de .sticky-mask que de lignes
  try {
    const maskWrap = sticky.querySelector('.sticky-mask-wrap')
    if (maskWrap && lineCount > 0) {
      const masks = Array.from(maskWrap.querySelectorAll('.sticky-mask'))
      // Ajuster le nombre
      if (masks.length !== lineCount) {
        // Réduire l'existant
        while (maskWrap.children.length > lineCount) {
          maskWrap.removeChild(maskWrap.lastElementChild)
        }
        // Compléter si nécessaire
        while (maskWrap.children.length < lineCount) {
          const mask = document.createElement('div')
          mask.className = 'sticky-mask'
          const grad = document.createElement('div')
          grad.className = 'sticky_gradient'
          const fill = document.createElement('div')
          fill.className = 'sticky_fill'
          mask.appendChild(grad)
          mask.appendChild(fill)
          maskWrap.appendChild(mask)
        }
      }
    }
  } catch (e) {
    console.warn('Impossible de synchroniser sticky-mask avec les lignes.', e)
  }

  // Timeline: animer la width des .sticky-mask de 110% à 0 séquentiellement
  try {
    const maskWrap = sticky.querySelector('.sticky-mask-wrap')
    const masks = maskWrap
      ? Array.from(maskWrap.querySelectorAll('.sticky-mask'))
      : []
    if (masks.length > 0) {
      // États initiaux
      gsap.set(masks, { width: '110%' })
      const step = 1 / masks.length
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sticky,
          start: 'top 48%',
          endTrigger: container,
          end: getStickyEnd,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      masks.forEach((m, i) => {
        tl.to(
          m,
          { width: '0%', duration: step },
          i * step // séquentiel, sans chevauchement
        )
      })
    }
  } catch (e) {
    console.warn('Impossible de créer la timeline des sticky-mask.', e)
  }
}
