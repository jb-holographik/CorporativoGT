import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { listEasing } from '../utils/animationUtils.js'
import { getLenis } from './lenis.js'

const refreshScrollContext = (() => {
  let rafId = null
  const run = () => {
    const lenis = typeof getLenis === 'function' ? getLenis() : null
    if (lenis && typeof lenis.resize === 'function') {
      lenis.resize()
    }
    if (ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
      ScrollTrigger.refresh()
    }
  }
  return () => {
    if (typeof window === 'undefined') {
      run()
      return
    }
    if (rafId) return
    rafId = window.requestAnimationFrame(() => {
      rafId = null
      run()
    })
  }
})()

export function initCompanies() {
  const items = document.querySelectorAll('.companies_item')
  if (!items || items.length === 0) return
  const isTabletOrMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 991px)').matches
  // Page load: in each .companies_item, set first .item-image-sm to is-active (scoped)
  items.forEach((itm) => {
    const thumbs = itm.querySelectorAll('.item-image-sm')
    if (thumbs.length > 0) {
      thumbs.forEach((t) => t.classList.remove('is-active'))
      thumbs[0].classList.add('is-active')
    }
  })
  // Tag .companies_s-item with sequential data-item per .companies_s-list
  const tagCompaniesSItems = () => {
    const lists = document.querySelectorAll('.companies_s-list')
    lists.forEach((list) => {
      const listItems = list.querySelectorAll(
        '.companies_s-item:not([data-clone="true"])'
      )
      listItems.forEach((el, idx) => {
        el.dataset.item = String(idx + 1)
      })
    })
  }
  tagCompaniesSItems()

  // S'assurer que chaque companies_item a un .companies_s-item actif par défaut
  items.forEach((item) => {
    const companiesList = item.querySelector('.companies_s-list')
    if (!companiesList) return
    const initialCompanyItem = companiesList.querySelector(
      '.companies_s-item:not([data-clone="true"])'
    )
    if (
      initialCompanyItem &&
      !initialCompanyItem.classList.contains('is-active')
    ) {
      initialCompanyItem.classList.add('is-active')
    }
  })

  // Ajouter des listeners de clic sur les .item-image-sm
  const imageSmElements = document.querySelectorAll('.item-image-sm')
  const companySItems = document.querySelectorAll('.companies_s-item')

  imageSmElements.forEach((imgSm, index) => {
    imgSm.addEventListener('click', (e) => {
      // Arrêter la propagation pour ne pas déclencher le clic sur .companies_item
      e.stopPropagation()

      // Sécurité: vérifier que l'index correspond à un item valide
      if (index >= companySItems.length) return

      // Retirer la classe is-active de tous les .item-image-sm
      imageSmElements.forEach((img) => img.classList.remove('is-active'))

      // Ajouter la classe is-active au .item-image-sm cliqué
      imgSm.classList.add('is-active')

      const targetItem = companySItems[index]
      if (!targetItem) return

      // Trouver le conteneur .companies_s-list
      const companiesList = targetItem.closest('.companies_s-list')
      if (!companiesList) return
      // Si une fermeture est en cours, ignorer les changements d'image
      if (companiesList.dataset.closing === '1') return
      // Assurer le clipping et un contexte de positionnement pour le clone
      gsap.set(companiesList, { overflow: 'hidden', position: 'relative' })
      // Maintenir les anciens clones visibles mais dessous (superposition correcte en cas d'interruption)
      const priorClones = companiesList.querySelectorAll('[data-clone="true"]')
      if (priorClones.length) {
        priorClones.forEach((n) => {
          gsap.set(n, { zIndex: 1, pointerEvents: 'none' })
        })
      }
      // Mettre l'ancien actif derrière le nouveau pendant l'animation
      const oldActiveInList = companiesList.querySelector(
        '.companies_s-item.is-active'
      )
      if (oldActiveInList && oldActiveInList !== targetItem) {
        gsap.set(oldActiveInList, { zIndex: 1 })
      }

      // Créer un clone du nouvel item
      const clone = targetItem.cloneNode(true)
      clone.dataset.clone = 'true'
      // Z-index croissant et identification du clone courant
      const baseZ = parseInt(companiesList.dataset.cloneZ || '1000', 10)
      const nextZ = baseZ + 1
      companiesList.dataset.cloneZ = String(nextZ)
      const cloneId = String(Date.now()) + Math.random().toString(36).slice(2)
      clone.dataset.cloneId = cloneId
      companiesList.dataset.latestCloneId = cloneId
      gsap.set(clone, {
        scale: 0,
        position: 'absolute',
        zIndex: nextZ,
        transformOrigin: 'center center',
        pointerEvents: 'none',
      })
      companiesList.appendChild(clone)

      // Positionner le clone pour remplir le conteneur (évite tout débordement visuel)
      gsap.set(clone, {
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      })

      // Animer le clone de scale 0 à 1
      gsap.fromTo(
        clone,
        { scale: 0 },
        {
          scale: 1,
          duration: 1.4,
          ease: listEasing,
          onComplete: () => {
            // Si un clone plus récent a été lancé, laisser ce clone sous-jacent (pas de suppression ici)
            if (companiesList.dataset.latestCloneId !== cloneId) {
              gsap.set(clone, { zIndex: 1, pointerEvents: 'none' })
              return
            }
            // Après l'animation, mettre à jour les classes sur l'original
            const listItems =
              companiesList.querySelectorAll('.companies_s-item')
            listItems.forEach((itemEl) => {
              itemEl.classList.remove('is-active')
              itemEl.classList.remove('active-next')
              gsap.set(itemEl, { zIndex: 0 })
            })
            targetItem.classList.add('is-active')
            gsap.set(targetItem, { zIndex: 4 })

            // Supprimer le clone
            gsap.delayedCall(0, () => {
              clone.remove()
            })
            // Nettoyer les anciens clones obsolètes
            companiesList
              .querySelectorAll(
                '[data-clone="true"]:not([data-clone-id="' + cloneId + '"])'
              )
              .forEach((n) => n.remove())
          },
        }
      )
    })
  })

  items.forEach((item) => {
    const wrapper = item.querySelector('.companies-img-wrapper')
    const description = item.querySelector('.item-description')
    const smallStrip = item.querySelector('.companies_item-images-small')
    if (!wrapper) return

    let isAnimating = false
    let expanded = false
    // Toujours travailler en pixels pour éviter tout mix px/em au premier clic
    const getHeightsPx = () => {
      const em = parseFloat(getComputedStyle(wrapper).fontSize) || 16
      return {
        collapsed: 9.188 * em,
        expanded: 32.125 * em,
      }
    }
    const getItemExpandedPx = () => {
      const em = parseFloat(getComputedStyle(item).fontSize) || 16
      return 34.063 * em
    }

    // MESURER D'ABORD la hauteur "ouverte" AVANT de masquer quoi que ce soit
    // Stocker le scrollHeight de la description avant de la masquer
    const descriptionScrollHeight = description ? description.scrollHeight : 0
    // Mesurer la hauteur de smallStrip avant de la cacher
    const smallStripHeight = smallStrip
      ? smallStrip.getBoundingClientRect().height
      : 0
    // Calculer la hauteur ouverte du wrapper (image + gap + miniatures)
    const em = parseFloat(getComputedStyle(wrapper).fontSize) || 16
    const imageExpandedHeight = 28.125 * em // hauteur cible de l'image is-v
    const wrapperGap = parseFloat(getComputedStyle(wrapper).gap) || em
    const expandedWrapperHeight =
      imageExpandedHeight + wrapperGap + smallStripHeight

    // Simuler l'état ouvert pour mesurer la hauteur totale de l'item
    const prevWrapperH = wrapper.style.height
    const prevDescH = description ? description.style.height : null
    const prevItemH = item.style.height
    if (description) description.style.height = `${descriptionScrollHeight}px`
    wrapper.style.height = `${expandedWrapperHeight}px`
    item.style.height = 'auto'
    const expandedItemHeight = item.getBoundingClientRect().height
    // Restaurer
    if (description) description.style.height = prevDescH || ''
    wrapper.style.height = prevWrapperH || ''
    item.style.height = prevItemH || ''

    // ENSUITE masquer la description
    if (description) {
      description.style.height = '0px'
      description.style.overflow = 'hidden'
    }

    // PUIS mesurer les hauteurs de départ (état fermé, description masquée)
    const collapsedWrapperHeight = wrapper.getBoundingClientRect().height
    const collapsedItemHeight = item.getBoundingClientRect().height

    // Fixer la hauteur de départ pour permettre une animation fluide
    if (!isTabletOrMobile) {
      gsap.set(wrapper, { height: getHeightsPx().collapsed })
      if (description) gsap.set(description, { height: 0 })
    } else {
      // Sur mobile/tablette, fixer les heights inline pour que l'animation ait un point de départ
      gsap.set(wrapper, { height: collapsedWrapperHeight })
      gsap.set(item, { height: collapsedItemHeight })
      if (description) gsap.set(description, { height: 0 })
    }
    if (smallStrip) gsap.set(smallStrip, { yPercent: 103, y: 0, x: 0 })

    // Capturer la largeur et hauteur initiales du .item-image.is-v pour les restaurer à la fermeture
    const largeImageInit = wrapper.querySelector('.item-image.is-v')
    let initialLargeImageWidth = 'auto'
    let initialLargeImageHeight = 'auto'
    if (largeImageInit) {
      initialLargeImageWidth = largeImageInit.offsetWidth
      initialLargeImageHeight = largeImageInit.offsetHeight
      gsap.set(largeImageInit, {
        transformOrigin: 'center center',
        clearProps: 'scale',
      })
    }

    // Assurer que le wrapper a position: relative pour les enfants en absolu
    gsap.set(wrapper, { position: 'relative' })

    const imagesContainer = wrapper.querySelector('.companies_item-images')
    const allImages = wrapper.querySelectorAll('.item-image')

    if (!isTabletOrMobile) {
      // Mettre TOUTES les images en position: absolute à leur position exacte (desktop uniquement)
      // Calculer le left de chaque image en accumulant les largeurs + gaps du flex
      const computedStyle = getComputedStyle(imagesContainer)
      const gap = parseFloat(computedStyle.gap) || 0

      let currentLeft = 0
      allImages.forEach((img) => {
        const rect = img.getBoundingClientRect()
        const wrapperRect = wrapper.getBoundingClientRect()
        const relativeTop = rect.top - wrapperRect.top
        const imgWidth = rect.width
        const isLarge = img === largeImageInit

        gsap.set(img, {
          position: 'absolute',
          top: relativeTop,
          left: currentLeft,
          width: imgWidth,
          height: rect.height,
          margin: 0,
          zIndex: isLarge ? 1 : 0,
        })

        currentLeft += imgWidth + gap
      })
    } else {
      // Mobile/tablette : conserver un layout absolu comme desktop mais ajuster la taille du conteneur
      if (imagesContainer) {
        gsap.set(imagesContainer, {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          height:
            initialLargeImageHeight ||
            imagesContainer.getBoundingClientRect().height ||
            'auto',
        })
      }
      // Recalcule les positions absolues comme sur desktop (gap flex)
      const computedStyle = imagesContainer
        ? getComputedStyle(imagesContainer)
        : null
      const gap = computedStyle ? parseFloat(computedStyle.gap) || 0 : 0
      const baseWidth =
        initialLargeImageWidth ||
        (allImages[0] && allImages[0].getBoundingClientRect().width) ||
        0
      const baseHeight =
        initialLargeImageHeight ||
        (allImages[0] && allImages[0].getBoundingClientRect().height) ||
        0
      let currentLeft = 0
      allImages.forEach((img) => {
        const rect = img.getBoundingClientRect()
        const wrapperRect = wrapper.getBoundingClientRect()
        const relativeTop = rect.top - wrapperRect.top
        const imgWidth = baseWidth || rect.width
        const imgHeight = baseHeight || rect.height
        const isLarge = img === largeImageInit

        gsap.set(img, {
          position: 'absolute',
          top: relativeTop,
          left: currentLeft,
          width: imgWidth,
          height: imgHeight,
          margin: 0,
          zIndex: isLarge ? 2 : 1,
          opacity: 1,
          display: 'block',
          pointerEvents: isLarge ? 'auto' : 'none',
        })

        currentLeft += imgWidth + gap
      })
      if (imagesContainer && currentLeft > 0) {
        gsap.set(imagesContainer, { width: currentLeft })
      }
      // Sur tablette aussi, cacher smallStrip comme sur desktop
      if (smallStrip) {
        gsap.set(smallStrip, { yPercent: 103, y: 0, x: 0 })
      }
    }

    item.addEventListener('click', () => {
      if (isAnimating) return
      isAnimating = true
      const { collapsed, expanded: expandedPx } = getHeightsPx()
      const isExpanding = !expanded
      const getMobileCollapsedHeight = () => {
        return collapsedWrapperHeight
      }
      // Utiliser les valeurs pré-calculées au montage
      const wrapperTarget = isTabletOrMobile
        ? isExpanding
          ? expandedWrapperHeight
          : getMobileCollapsedHeight()
        : isExpanding
        ? expandedPx
        : collapsed
      const itemCurrentH =
        parseFloat(getComputedStyle(item).height) ||
        item.getBoundingClientRect().height
      let itemTargetH = itemCurrentH

      const tl = gsap.timeline({
        defaults: { ease: listEasing },
        onComplete: () => {
          isAnimating = false
          expanded = !expanded
          refreshScrollContext()
        },
      })
      refreshScrollContext()

      // S'assurer que le container ne déborde pas pendant l'animation
      tl.set(item, { overflow: 'hidden' }, 0)

      if (isTabletOrMobile) {
        tl.fromTo(
          wrapper,
          {
            height: isExpanding
              ? collapsedWrapperHeight
              : expandedWrapperHeight,
          },
          {
            height: wrapperTarget,
            duration: 1.4,
            overwrite: 'auto',
          },
          0
        )
        // Pas de gsap.set en auto - on garde la hauteur calculée
      } else {
        tl.to(
          wrapper,
          {
            height: wrapperTarget,
            duration: 1.4,
            overwrite: 'auto',
          },
          0
        )
      }

      // Animation du ruban d'images small (même comportement desktop et tablette)
      if (smallStrip) {
        if (isExpanding) {
          const emStrip =
            parseFloat(getComputedStyle(smallStrip).fontSize) || 16
          const targetY = -5 * emStrip
          tl.fromTo(
            smallStrip,
            { yPercent: 103, y: 0 },
            { yPercent: 0, y: targetY, duration: 1.4, overwrite: 'auto' },
            0
          )
        } else {
          tl.to(
            smallStrip,
            { yPercent: 103, y: 0, duration: 1.4, overwrite: 'auto' },
            0
          )
        }
      }

      // Animation des .item-image avec stagger: immobiles puis transformY -102% + opacity 0, sauf .item-image.is-v
      const imagesWrapper = item.querySelector('.companies-img-wrapper')
      if (imagesWrapper && isExpanding) {
        const images = imagesWrapper.querySelectorAll('.item-image:not(.is-v)')
        const largeImage = imagesWrapper.querySelector('.item-image.is-v')

        if (images.length > 0) {
          // Animer avec stagger: transformY + opacity (images déjà en absolute)
          tl.to(
            images,
            {
              yPercent: -102,
              opacity: 0,
              duration: 1.4,
              ease: listEasing,
              overwrite: 'auto',
              stagger: 0.05,
            },
            0
          )
        }

        // Animer .item-image.is-v : desktop = width/height en em, mobile = width 100%
        if (largeImage) {
          const em = parseFloat(getComputedStyle(largeImage).fontSize) || 16
          const targetWidth = isTabletOrMobile ? '100%' : 42.5 * em
          const targetHeight = 28.125 * em
          tl.fromTo(
            largeImage,
            {
              width: initialLargeImageWidth || largeImage.offsetWidth || '100%',
              height:
                initialLargeImageHeight || largeImage.offsetHeight || 'auto',
              zIndex: 2,
            },
            {
              width: targetWidth,
              height: targetHeight,
              zIndex: 10,
              duration: 1.4,
              ease: listEasing,
              overwrite: 'auto',
            },
            0
          )
          if (isTabletOrMobile && imagesContainer) {
            tl.to(
              imagesContainer,
              {
                height: targetHeight,
                width: '100%',
                duration: 1.4,
                overwrite: 'auto',
              },
              0
            )
          }
        }
      } else if (imagesWrapper && !isExpanding) {
        // À la fermeture, revenir à l'état initial
        const images = imagesWrapper.querySelectorAll('.item-image:not(.is-v)')
        const largeImage = imagesWrapper.querySelector('.item-image.is-v')

        if (images.length > 0) {
          tl.to(
            images,
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.4,
              ease: listEasing,
              overwrite: 'auto',
              stagger: 0.05,
            },
            0
          )
        }

        // Revenir aux dimensions initiales de .item-image.is-v (animation inverse de l'ouverture)
        if (largeImage) {
          const em = parseFloat(getComputedStyle(largeImage).fontSize) || 16
          const fromWidth = isTabletOrMobile ? '100%' : 42.5 * em
          const targetHeight = 28.125 * em
          tl.fromTo(
            largeImage,
            {
              width: fromWidth,
              height: targetHeight,
              zIndex: 10,
            },
            {
              width: initialLargeImageWidth,
              height: initialLargeImageHeight,
              zIndex: 2,
              duration: 1.4,
              ease: listEasing,
              overwrite: 'auto',
            },
            0
          )
          if (imagesContainer) {
            const backHeight =
              initialLargeImageHeight ||
              imagesContainer.getBoundingClientRect().height ||
              'auto'
            tl.to(
              imagesContainer,
              {
                width: '100%',
                height: backHeight,
                duration: 1.4,
                overwrite: 'auto',
              },
              0
            )
          }
        }
      }

      // Animation de la hauteur de .companies_item
      if (isExpanding) {
        itemTargetH = isTabletOrMobile
          ? expandedItemHeight
          : getItemExpandedPx()
        if (isTabletOrMobile) {
          tl.fromTo(
            item,
            { height: collapsedItemHeight },
            {
              height: itemTargetH,
              duration: 1.4,
              immediateRender: false,
              overwrite: 'auto',
            },
            0
          )
          tl.add(() => {
            gsap.set(item, { height: 'auto' })
          }, '>')
        } else {
          tl.fromTo(
            item,
            { height: itemCurrentH },
            {
              height: itemTargetH,
              duration: 1.4,
              immediateRender: false,
              overwrite: 'auto',
            },
            0
          )
        }
      } else {
        // À la fermeture, animer .companies_item vers la hauteur d'origine
        const em = parseFloat(getComputedStyle(item).fontSize) || 16
        const collapsedItemH = 19.375 * em
        const collapsedTarget = isTabletOrMobile
          ? collapsedItemHeight
          : collapsedItemH

        tl.fromTo(
          item,
          { height: itemCurrentH },
          {
            height: collapsedTarget,
            duration: 1.4,
            overwrite: 'auto',
          },
          0
        )
        // NE PAS remettre en auto après fermeture - garder la hauteur fermée fixe

        // À la fermeture, réinitialiser le premier .item-image-sm et le premier .companies_s-item
        // Retirer les classes immédiatement
        const firstImageSm = item.querySelector('.item-image-sm')
        // Cibler explicitement data-item="1" dans la liste correspondante
        const companiesList = item.querySelector('.companies_s-list')
        const firstCompanyItem =
          companiesList &&
          companiesList.querySelector(
            '.companies_s-item[data-item="1"]:not([data-clone="true"])'
          )
        if (firstImageSm) {
          const localThumbs = item.querySelectorAll('.item-image-sm')
          localThumbs.forEach((img) => img.classList.remove('is-active'))
          firstImageSm.classList.add('is-active')
        }

        if (companiesList) {
          // Déterminer la cible: data-item="1" si présent, sinon premier item non-clone
          const fallbackFirst =
            companiesList.querySelector(
              '.companies_s-item:not([data-clone="true"])'
            ) || null
          const targetFirst = firstCompanyItem || fallbackFirst
          if (!targetFirst) return
          // Contexte: clip et positionnement, conserver les clones existants pour la superposition
          gsap.set(companiesList, { overflow: 'hidden', position: 'relative' })
          const priorClonesClose = companiesList.querySelectorAll(
            '[data-clone="true"]'
          )
          if (priorClonesClose.length) {
            priorClonesClose.forEach((n) =>
              gsap.set(n, { zIndex: 1, pointerEvents: 'none' })
            )
          }
          // Trouver l'ancien item actif dans cette liste
          const oldActiveItem = companiesList.querySelector(
            '.companies_s-item.is-active'
          )
          if (oldActiveItem && oldActiveItem !== targetFirst) {
            gsap.set(oldActiveItem, { zIndex: 1 })
          }

          // Si data-item="1" est déjà actif ET qu'aucun clone n'est en cours, on ne lance pas de clone
          const hasInFlightClones =
            companiesList.querySelector('[data-clone="true"]') != null
          const shouldSkipClone =
            oldActiveItem &&
            (oldActiveItem === targetFirst ||
              oldActiveItem.dataset.item === '1') &&
            !hasInFlightClones
          if (!shouldSkipClone) {
            // Assurer le clipping et un contexte de positionnement pour le clone
            gsap.set(companiesList, {
              overflow: 'hidden',
              position: 'relative',
            })
            // Créer un clone du premier item
            const clone = targetFirst.cloneNode(true)
            clone.dataset.clone = 'true'
            // Marquer qu'une fermeture est en cours (donne la priorité au clone de fermeture)
            companiesList.dataset.closing = '1'
            // Z-index: garantir que le clone de fermeture est au-dessus de tout
            const baseZClose = parseInt(
              companiesList.dataset.cloneZ || '1000',
              10
            )
            const existingCloneZ = Array.from(
              companiesList.querySelectorAll('[data-clone="true"]')
            ).map((n) => {
              const z = parseInt(gsap.getProperty(n, 'zIndex')) || 0
              return z
            })
            const maxExistingZ =
              existingCloneZ.length > 0 ? Math.max(...existingCloneZ) : 0
            const computedTopZ = Math.max(baseZClose, maxExistingZ, 1000) + 1
            companiesList.dataset.cloneZ = String(computedTopZ)
            const closeCloneId =
              String(Date.now()) + Math.random().toString(36).slice(2)
            clone.dataset.cloneId = closeCloneId
            companiesList.dataset.latestCloneId = closeCloneId
            gsap.set(clone, {
              scale: 0,
              position: 'absolute',
              zIndex: computedTopZ,
              transformOrigin: 'center center',
              pointerEvents: 'none',
              opacity: 1,
              visibility: 'visible',
              display: 'block',
            })
            companiesList.appendChild(clone)

            // Positionner le clone pour remplir le conteneur (évite tout débordement visuel)
            gsap.set(clone, {
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            })

            // Animer le clone de scale 0 à 1 EN PARALLÈLE avec la fermeture (tween indépendant)
            gsap.fromTo(
              clone,
              {
                scale: 0,
                willChange: 'transform',
                autoAlpha: 1,
                force3D: true,
              },
              {
                scale: 1,
                duration: 1.4,
                ease: listEasing,
                overwrite: 'auto',
                immediateRender: true,
                autoAlpha: 1,
                onComplete: () => {
                  // Après l'animation, mettre à jour les classes sur l'original
                  const listItems =
                    companiesList.querySelectorAll('.companies_s-item')
                  listItems.forEach((itemEl) => {
                    itemEl.classList.remove('is-active')
                    itemEl.classList.remove('active-next')
                    gsap.set(itemEl, { zIndex: 0 })
                  })
                  targetFirst.classList.add('is-active')
                  gsap.set(targetFirst, { zIndex: 4 })

                  // Supprimer le clone
                  gsap.delayedCall(0, () => {
                    clone.remove()
                  })
                  // Nettoyer les anciens clones obsolètes
                  companiesList
                    .querySelectorAll(
                      '[data-clone="true"]:not([data-clone-id="' +
                        closeCloneId +
                        '"])'
                    )
                    .forEach((n) => n.remove())
                  // Fin de fermeture: lever le flag
                  delete companiesList.dataset.closing
                },
              }
            )
          } else {
            // Si on a sauté le clone, s'assurer que data-item=1 reste visible et actif en fin de timeline
            tl.add(() => {
              const listItems =
                companiesList.querySelectorAll('.companies_s-item')
              listItems.forEach((itemEl) => {
                itemEl.classList.remove('active-next')
                gsap.set(itemEl, { zIndex: 0 })
              })
              targetFirst.classList.add('is-active')
              gsap.set(targetFirst, { zIndex: 4, scale: 1, opacity: 1 })
              delete companiesList.dataset.closing
            }, 1.4)
          }
        }
      }

      if (description) {
        if (isExpanding) {
          const openH = description.scrollHeight || description.offsetHeight
          tl.to(
            description,
            {
              height: openH,
              duration: 1.4,
              immediateRender: false,
              overwrite: 'auto',
              onComplete: () => {
                // rester à la hauteur finale sans jumper
              },
            },
            0
          )
        } else {
          // si 'auto', fixer la hauteur courante en px avant d'animer vers 0
          const currentH = description.offsetHeight
          gsap.set(description, { height: currentH })
          tl.to(
            description,
            {
              height: 0,
              duration: 1.4,
              overwrite: 'auto',
            },
            0
          )
        }
      }
    })
  })
}
