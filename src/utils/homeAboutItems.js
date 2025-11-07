export function initAboutItemsData() {
  // Configuration individuelle pour chaque about-item
  // Chaque item a ses propres valeurs de déplacement pour stop1 et stop2
  const itemsConfig = [
    {
      id: 1,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 2,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 3,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 4,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 5,
      stop1: { transformX: -450, transformY: 30 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 6,
      stop1: { transformX: -450, transformY: -30 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 7,
      stop1: { transformX: -450, transformY: 30 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 8,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 9,
      stop1: { transformX: -450, transformY: -30 },
      stop2: { transformX: -900, transformY: 40 },
    },
    {
      id: 10,
      stop1: { transformX: -450, transformY: 30 },
      stop2: { transformX: -900, transformY: -40 },
    },
    {
      id: 11,
      stop1: { transformX: -450, transformY: -30 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 12,
      stop1: { transformX: -450, transformY: 30 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 13,
      stop1: { transformX: -450, transformY: -30 },
      stop2: { transformX: -900, transformY: 0, centerX: true },
    },
    {
      id: 14,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: -40 },
    },
    {
      id: 15,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 16,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: -40 },
    },
    {
      id: 17,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: 0 },
    },
    {
      id: 18,
      stop1: { transformX: -450, transformY: 0 },
      stop2: { transformX: -900, transformY: 0 },
    },
  ]

  // Configuration des sliders (inchangée)
  // transformX: -7.938em au stop1, -15.876em au stop2
  // transformY: 0 (pas de mouvement vertical)
  const sliderConfig = {
    stop1: { transformX: -7.938, transformY: 0 },
    stop2: { transformX: -15.876, transformY: 0 },
  }

  // Générer les items avec leur configuration
  const items = itemsConfig.map((config) => {
    return {
      id: config.id,
      element: document.querySelector(`.about-item.is-${config.id}`),
      slider: document.querySelector(
        `.about-item.is-${config.id} .about-item_slider`
      ),
      itemStop1: config.stop1,
      itemStop2: config.stop2,
      sliderStop1: sliderConfig.stop1,
      sliderStop2: sliderConfig.stop2,
    }
  })

  return items
}
