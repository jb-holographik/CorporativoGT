import { gsap } from 'gsap'

import { listEasing } from '../utils/animationUtils.js'

export function initCompanies() {
  const items = document.querySelectorAll('.companies_item')
  if (!items || items.length === 0) return
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

  // Chercher les .companies_s-item et .item-image-sm dans le premier .companies_item
  const firstItem = items[0]
  const firstCompanyItem = firstItem.querySelector('.companies_s-item')
  if (firstCompanyItem) {
    firstCompanyItem.classList.add('is-active')
  }
  const firstImageSm = firstItem.querySelector('.item-image-sm')
  if (firstImageSm) {
    firstImageSm.classList.add('is-active')
  }

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
    // Fixer la hauteur de départ en px pour éviter un flash à la première ouverture
    gsap.set(wrapper, { height: getHeightsPx().collapsed })
    if (description) gsap.set(description, { height: 0 })
    if (smallStrip) gsap.set(smallStrip, { yPercent: 103, y: 0, x: 0 })

    // Capturer la largeur et hauteur initiales du .item-image.is-v pour les restaurer à la fermeture
    const largeImageInit = wrapper.querySelector('.item-image.is-v')
    let initialLargeImageWidth = 'auto'
    let initialLargeImageHeight = 'auto'
    if (largeImageInit) {
      initialLargeImageWidth = largeImageInit.offsetWidth
      initialLargeImageHeight = largeImageInit.offsetHeight
    }

    // Assurer que le wrapper a position: relative pour les enfants en absolu
    gsap.set(wrapper, { position: 'relative' })

    // Mettre TOUTES les images en position: absolute à leur position exacte
    // Calculer le left de chaque image en accumulant les largeurs + gaps du flex
    const imagesContainer = wrapper.querySelector('.companies_item-images')
    const allImages = wrapper.querySelectorAll('.item-image')
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

    item.addEventListener('click', () => {
      if (isAnimating) return
      isAnimating = true
      const { collapsed, expanded: expandedPx } = getHeightsPx()
      const isExpanding = !expanded
      const wrapperTarget = isExpanding ? expandedPx : collapsed
      const itemCurrentH =
        parseFloat(getComputedStyle(item).height) ||
        item.getBoundingClientRect().height
      let itemTargetH = itemCurrentH

      const tl = gsap.timeline({
        defaults: { ease: listEasing },
        onComplete: () => {
          isAnimating = false
          expanded = !expanded
        },
      })

      // S'assurer que le container ne déborde pas pendant l'animation
      tl.set(item, { overflow: 'hidden' }, 0)

      tl.to(
        wrapper,
        {
          height: wrapperTarget,
          duration: 1.4,
          overwrite: 'auto',
        },
        0
      )

      // Animation du ruban d'images small: translateY(103%) -> -5em à l'ouverture, puis retour à 103% à la fermeture
      if (smallStrip) {
        if (isExpanding) {
          const em = parseFloat(getComputedStyle(smallStrip).fontSize) || 16
          const targetY = -5 * em
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

        // Animer .item-image.is-v vers width 42.5em et height 28.125em (déjà en absolute)
        if (largeImage) {
          const em = parseFloat(getComputedStyle(largeImage).fontSize) || 16
          const targetWidth = 42.5 * em
          const targetHeight = 28.125 * em
          tl.to(
            largeImage,
            {
              width: targetWidth,
              height: targetHeight,
              zIndex: 4,
              duration: 1.4,
              ease: listEasing,
              overwrite: 'auto',
            },
            0
          )
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
          const targetWidth = 42.5 * em
          const targetHeight = 28.125 * em
          tl.fromTo(
            largeImage,
            {
              width: targetWidth,
              height: targetHeight,
              zIndex: 999,
            },
            {
              width: initialLargeImageWidth,
              height: initialLargeImageHeight,
              zIndex: 1,
              duration: 1.4,
              ease: listEasing,
              overwrite: 'auto',
            },
            0
          )
        }
      }

      // Animation de la hauteur de .companies_item
      if (isExpanding) {
        itemTargetH = getItemExpandedPx()
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
      } else {
        // À la fermeture, animer .companies_item vers 19.375em
        const em = parseFloat(getComputedStyle(item).fontSize) || 16
        const collapsedItemH = 19.375 * em

        tl.fromTo(
          item,
          { height: itemCurrentH },
          {
            height: collapsedItemH,
            duration: 1.4,
            overwrite: 'auto',
          },
          0
        )

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
