import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cleanups = []

function restoreParagraph(paragraph) {
  if (!paragraph?.dataset.originalHtml) return
  paragraph.innerHTML = paragraph.dataset.originalHtml
}

function collectWordLines(paragraph) {
  if (!paragraph) return []

  restoreParagraph(paragraph)
  if (!paragraph.dataset.originalHtml) {
    paragraph.dataset.originalHtml = paragraph.innerHTML
  }

  paragraph.querySelectorAll('br').forEach((br) => {
    br.replaceWith(document.createTextNode(' '))
  })

  const text = paragraph.textContent || ''
  paragraph.innerHTML = ''
  const tokenSpans = []
  text.split(/(\s+)/).forEach((tok) => {
    if (!tok) return
    const span = document.createElement('span')
    span.textContent = tok
    span.style.display = 'inline'
    span.style.whiteSpace = 'pre-wrap'
    paragraph.appendChild(span)
    tokenSpans.push(span)
  })

  const groups = []
  let current = []
  let lastTop = null
  tokenSpans.forEach((el) => {
    const top = Math.round(el.getBoundingClientRect().top)
    if (lastTop === null) lastTop = top
    if (Math.abs(top - lastTop) > 1) {
      if (current.length) groups.push(current)
      current = []
      lastTop = top
    }
    current.push(el)
  })
  if (current.length) groups.push(current)

  const lines = []
  groups.forEach((grp) => {
    const words = grp.filter((node) => (node.textContent || '').trim())
    if (!words.length) return

    const lineWrap = document.createElement('span')
    lineWrap.className = 'sticky-line-wrap'
    grp[0].parentNode.insertBefore(lineWrap, grp[0])
    grp.forEach((node) => lineWrap.appendChild(node))
    lineWrap.style.whiteSpace = 'nowrap'

    const left = words[0].getBoundingClientRect().left
    const right = words[words.length - 1].getBoundingClientRect().right
    const width = Math.max(Math.ceil(right - left), 1)
    lineWrap.style.width = `${width}px`

    lines.push({
      wrap: lineWrap,
      wordCount: words.length,
      width,
    })
  })

  return lines
}

function createMask() {
  const mask = document.createElement('div')
  mask.className = 'sticky-mask'
  const grad = document.createElement('div')
  grad.className = 'sticky_gradient'
  const fill = document.createElement('div')
  fill.className = 'sticky_fill'
  mask.appendChild(grad)
  mask.appendChild(fill)
  return mask
}

function syncMasksToLines(sticky, lines) {
  const maskWrap = sticky.querySelector('.sticky-mask-wrap')
  if (!maskWrap) return []

  Array.from(sticky.querySelectorAll('.sticky-line-wrap .sticky-mask')).forEach(
    (mask) => maskWrap.appendChild(mask)
  )

  while (maskWrap.children.length > lines.length) {
    maskWrap.removeChild(maskWrap.lastElementChild)
  }
  while (maskWrap.children.length < lines.length) {
    maskWrap.appendChild(createMask())
  }

  const masks = Array.from(maskWrap.children)
  return lines
    .map((line, index) => {
      const mask = masks[index]
      if (mask) line.wrap.appendChild(mask)
      return mask
    })
    .filter(Boolean)
}

function setupStickyParagraph(sticky) {
  const paragraph = sticky.querySelector('.sticky_inner p')
  const container =
    sticky.closest('.certification-content') || sticky.parentElement || sticky
  if (!paragraph || !container) return () => {}

  const getStickyEnd = () => {
    const containerHeight = container.offsetHeight || 0
    const stickyHeight = sticky.offsetHeight || 0
    const distance = containerHeight - stickyHeight
    return distance > 0 ? `+=${distance}` : 'bottom 48%'
  }

  const lines = collectWordLines(paragraph)
  const masks = syncMasksToLines(sticky, lines)
  const maskWrap = sticky.querySelector('.sticky-mask-wrap')
  if (maskWrap) {
    maskWrap.style.display = lines.length ? 'none' : ''
  }

  if (!lines.length || !masks.length) {
    return () => restoreParagraph(paragraph)
  }

  const totalWords = lines.reduce((sum, line) => sum + line.wordCount, 0)
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

  let time = 0
  masks.forEach((mask, index) => {
    const line = lines[index]
    const duration = line.wordCount / totalWords
    const fromWidth = line.width * 1.1
    gsap.set(mask, { width: fromWidth })
    tl.fromTo(
      mask,
      { width: fromWidth },
      { width: 0, duration, immediateRender: index === 0 },
      time
    )
    time += duration
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    if (maskWrap) {
      Array.from(
        sticky.querySelectorAll('.sticky-line-wrap .sticky-mask')
      ).forEach((mask) => maskWrap.appendChild(mask))
      maskWrap.style.display = ''
    }
    restoreParagraph(paragraph)
  }
}

export function initStickyParagraph() {
  cleanups.forEach((cleanup) => cleanup())
  cleanups.length = 0

  document
    .querySelectorAll('.section_certification .sticky-paragraph')
    .forEach((sticky) => {
      const cleanup = setupStickyParagraph(sticky)
      if (cleanup) cleanups.push(cleanup)
    })
}
