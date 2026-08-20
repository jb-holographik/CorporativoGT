const STORAGE_PREFIX = 'corporativo:about-stops'
const EDITOR_STATE_KEY = 'corporativo:about-stops-editor'

function getStorageKey(breakpoint) {
  return `${STORAGE_PREFIX}:${breakpoint}`
}

function readJson(key, fallback = {}) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function reloadFromTop() {
  window.history.scrollRestoration = 'manual'
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.location.reload()
    })
  })
}

export function applyAboutStopsOverrides(itemsConfig, breakpoint) {
  if (typeof window === 'undefined') return itemsConfig

  const overrides = readJson(getStorageKey(breakpoint))

  return mergeOverrides(itemsConfig, overrides)
}

function mergeOverrides(itemsConfig, overrides) {
  return itemsConfig.map((item) => {
    const itemOverrides = overrides[item.id] || {}

    return {
      ...item,
      stop1: { ...item.stop1, ...itemOverrides.stop1 },
      stop2: { ...item.stop2, ...itemOverrides.stop2 },
      stop3: { ...item.stop3, ...itemOverrides.stop3 },
      stop4: { ...item.stop4, ...itemOverrides.stop4 },
    }
  })
}

function createOption(value, label = value) {
  const option = document.createElement('option')
  option.value = value
  option.textContent = label
  return option
}

export function initAboutStopsEditor({ breakpoint, itemsConfig }) {
  if (
    typeof document === 'undefined' ||
    breakpoint !== 'desktop' ||
    document.querySelector('.about-stops-editor')
  ) {
    return
  }

  const savedState = readJson(EDITOR_STATE_KEY, {
    itemId: 1,
    stop: 'stop1',
    collapsed: false,
  })
  const overrides = readJson(getStorageKey(breakpoint))
  let selectedItemId = Number(savedState.itemId) || 1
  let selectedStop = savedState.stop || 'stop1'

  const editor = document.createElement('aside')
  editor.className = 'about-stops-editor'
  editor.dataset.collapsed = savedState.collapsed ? 'true' : 'false'
  editor.innerHTML = `
    <button class="about-stops-editor_toggle" type="button" aria-label="Afficher ou masquer l’éditeur">
      <span>Stops</span>
      <span class="about-stops-editor_toggle-icon">×</span>
    </button>
    <div class="about-stops-editor_panel">
      <div class="about-stops-editor_header">
        <div>
          <p class="about-stops-editor_eyebrow">About / Desktop</p>
          <h2>Positions des images</h2>
        </div>
        <span class="about-stops-editor_status">Synchronisé</span>
      </div>
      <label class="about-stops-editor_field">
        <span>Image</span>
        <select data-editor-item></select>
      </label>
      <div class="about-stops-editor_stops" role="group" aria-label="Choisir un stop">
        <button type="button" data-editor-stop="stop1">01</button>
        <button type="button" data-editor-stop="stop2">02</button>
        <button type="button" data-editor-stop="stop3">03</button>
        <button type="button" data-editor-stop="stop4">04</button>
      </div>
      <div class="about-stops-editor_coordinates">
        <label class="about-stops-editor_field">
          <span>X <small>%</small></span>
          <input data-editor-axis="transformX" type="number" step="1">
        </label>
        <label class="about-stops-editor_field">
          <span>Y <small>%</small></span>
          <input data-editor-axis="transformY" type="number" step="1">
        </label>
      </div>
      <button class="about-stops-editor_apply" type="button" data-editor-apply>
        Appliquer et recharger
      </button>
      <div class="about-stops-editor_actions">
        <button type="button" data-editor-copy>Copier la config</button>
        <button type="button" data-editor-reset>Réinitialiser l’image</button>
      </div>
      <button class="about-stops-editor_reset-all" type="button" data-editor-reset-all>
        Tout réinitialiser
      </button>
    </div>
  `

  const itemSelect = editor.querySelector('[data-editor-item]')
  const status = editor.querySelector('.about-stops-editor_status')
  const xInput = editor.querySelector('[data-editor-axis="transformX"]')
  const yInput = editor.querySelector('[data-editor-axis="transformY"]')
  const stopButtons = Array.from(editor.querySelectorAll('[data-editor-stop]'))

  itemsConfig.forEach((item) => {
    itemSelect.appendChild(createOption(item.id, `Image ${item.id}`))
  })

  function getSelectedItem() {
    return itemsConfig.find((item) => item.id === selectedItemId)
  }

  function getSelectedValues() {
    const item = getSelectedItem()
    const baseValues = item?.[selectedStop] || {
      transformX: 0,
      transformY: 0,
    }
    return {
      ...baseValues,
      ...(overrides[selectedItemId]?.[selectedStop] || {}),
    }
  }

  function persistEditorState() {
    writeJson(EDITOR_STATE_KEY, {
      itemId: selectedItemId,
      stop: selectedStop,
      collapsed: editor.dataset.collapsed === 'true',
    })
  }

  function render() {
    const values = getSelectedValues()
    itemSelect.value = String(selectedItemId)
    xInput.value = values.transformX ?? 0
    yInput.value = values.transformY ?? 0
    stopButtons.forEach((button) => {
      const isActive = button.dataset.editorStop === selectedStop
      button.classList.toggle('is-active', isActive)
      button.setAttribute('aria-pressed', String(isActive))
    })
    status.textContent = 'Synchronisé'
    status.classList.remove('is-dirty')
    persistEditorState()
  }

  function updateDraft(axis, value) {
    const parsedValue = Number(value)
    if (!Number.isFinite(parsedValue)) return

    overrides[selectedItemId] ||= {}
    overrides[selectedItemId][selectedStop] ||= {}
    overrides[selectedItemId][selectedStop][axis] = parsedValue
    status.textContent = 'À appliquer'
    status.classList.add('is-dirty')
  }

  itemSelect.addEventListener('change', () => {
    selectedItemId = Number(itemSelect.value)
    render()
  })

  stopButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedStop = button.dataset.editorStop
      render()
    })
  })

  xInput.addEventListener('input', () =>
    updateDraft('transformX', xInput.value)
  )
  yInput.addEventListener('input', () =>
    updateDraft('transformY', yInput.value)
  )

  editor.querySelector('[data-editor-apply]').addEventListener('click', () => {
    writeJson(getStorageKey(breakpoint), overrides)
    persistEditorState()
    reloadFromTop()
  })

  editor.querySelector('[data-editor-copy]').addEventListener('click', () => {
    const mergedConfig = mergeOverrides(itemsConfig, overrides)
    navigator.clipboard?.writeText(JSON.stringify(mergedConfig, null, 2))
    status.textContent = 'Config copiée'
    status.classList.remove('is-dirty')
  })

  editor.querySelector('[data-editor-reset]').addEventListener('click', () => {
    delete overrides[selectedItemId]
    writeJson(getStorageKey(breakpoint), overrides)
    reloadFromTop()
  })

  editor
    .querySelector('[data-editor-reset-all]')
    .addEventListener('click', () => {
      window.localStorage.removeItem(getStorageKey(breakpoint))
      reloadFromTop()
    })

  editor
    .querySelector('.about-stops-editor_toggle')
    .addEventListener('click', () => {
      editor.dataset.collapsed =
        editor.dataset.collapsed === 'true' ? 'false' : 'true'
      persistEditorState()
    })

  document.body.appendChild(editor)
  render()
}
