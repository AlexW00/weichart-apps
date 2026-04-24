import './style.css'

// ── Typing animation for "Humans" ──
const words = ['Humans', 'Menschen', '人間', 'Humanos', 'Humans']
let wordIndex = 0
let charIndex = 0
let isDeleting = false
const typingEl = document.getElementById('typing-word')!

function typeLoop() {
  const current = words[wordIndex]

  if (!isDeleting) {
    typingEl.textContent = current.slice(0, charIndex + 1)
    charIndex++

    if (charIndex === current.length) {
      setTimeout(() => {
        isDeleting = true
        typeLoop()
      }, 2500)
      return
    }
    setTimeout(typeLoop, 100 + Math.random() * 60)
  } else {
    typingEl.textContent = current.slice(0, charIndex)
    charIndex--

    if (charIndex < 0) {
      isDeleting = false
      charIndex = 0
      wordIndex = (wordIndex + 1) % words.length
      setTimeout(typeLoop, 400)
      return
    }
    setTimeout(typeLoop, 50 + Math.random() * 30)
  }
}

// Start typing after initial pause
setTimeout(() => {
  typingEl.textContent = words[0]
  charIndex = words[0].length
  setTimeout(() => {
    isDeleting = true
    typeLoop()
  }, 3000)
}, 2000)

// ── Scroll-driven animation ──
const treeContainer = document.getElementById('tree-container')!
const titleEl = document.getElementById('title')!
const cloudsEl = document.getElementById('clouds')!
const skyGradient = document.getElementById('sky-gradient')!
const appIcons = document.querySelectorAll<HTMLElement>('.app-icon')
const appInfo = document.getElementById('app-info')!
const appNameEl = document.getElementById('app-name')!
const appSubtitleEl = document.getElementById('app-subtitle')!

// Tree sizing (vh units)
const TREE_MIN = 75
const TREE_MAX = 105 // slightly over viewport so trunk base is below fold

// Tree starts pushed down so trunk is cut off at bottom
const TREE_OFFSET_START = 20 // vh below viewport bottom
const TREE_OFFSET_END = 0   // fully in frame at end of growth

// Phase split: 0→0.55 = tree growth, 0.55→1.0 = app highlights
const GROWTH_END = 0.55

let currentHighlight = -1
let isHovering = false

function showAppInfo(index: number) {
  if (index < 0 || index >= appIcons.length) {
    appInfo.classList.remove('visible')
    appIcons.forEach(icon => icon.classList.remove('highlighted'))
    currentHighlight = -1
    return
  }

  const icon = appIcons[index]
  appNameEl.textContent = icon.dataset.name ?? ''
  appSubtitleEl.textContent = icon.dataset.subtitle ?? ''
  appInfo.classList.add('visible')

  appIcons.forEach((ic, i) => {
    ic.classList.toggle('highlighted', i === index)
  })
  currentHighlight = index
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function onScroll() {
  const maxScroll = document.body.scrollHeight - window.innerHeight
  const progress = Math.min(window.scrollY / maxScroll, 1)

  // ── Phase 1: Tree growth + title/cloud fade ──
  const growthT = Math.min(progress / GROWTH_END, 1)
  const eased = easeOutCubic(growthT)

  // Tree height + vertical offset (starts pushed down, scrolls into frame)
  const treeVh = TREE_MIN + (TREE_MAX - TREE_MIN) * eased
  const treeOffset = TREE_OFFSET_START + (TREE_OFFSET_END - TREE_OFFSET_START) * eased
  treeContainer.style.height = `${treeVh}vh`
  treeContainer.style.bottom = `${-treeOffset}vh`

  // Title: shrinks and rises, fading into the distance (uses eased timing to stay ahead of tree)
  const titleFade = Math.max(1 - eased * 2.5, 0)
  const titleScale = Math.max(1 - eased * 0.7, 0.3)
  const titleShift = -eased * 280
  titleEl.style.opacity = String(titleFade)
  titleEl.style.transform = `translateX(-50%) translateY(${titleShift}px) scale(${titleScale})`

  // Clouds: fade and rise with tree
  const cloudFade = Math.max(0.55 - eased * 1.0, 0)
  const cloudShift = -eased * 200
  cloudsEl.style.opacity = String(cloudFade)
  cloudsEl.style.transform = `translateY(${cloudShift}px)`

  // Sky gradient: fades out and rises, fully gone when tree is full size
  const gradientFade = Math.max(1 - eased, 0)
  const gradientShift = -eased * 160
  skyGradient.style.opacity = String(gradientFade)
  skyGradient.style.transform = `translateY(${gradientShift}px)`

  // App icons: fade in with tree growth, no interaction until fully grown
  const iconsInteractable = growthT >= 1
  appIcons.forEach(icon => {
    icon.style.opacity = String(eased)
    icon.style.pointerEvents = iconsInteractable ? 'auto' : 'none'
  })

  // ── Phase 2: Highlight apps sequentially via scroll ──
  if (!isHovering) {
    if (progress > GROWTH_END) {
      const hlT = (progress - GROWTH_END) / (1 - GROWTH_END)
      const count = appIcons.length
      const idx = Math.min(Math.floor(hlT * count), count - 1)
      if (idx !== currentHighlight) showAppInfo(idx)
    } else if (currentHighlight >= 0) {
      showAppInfo(-1)
    }
  }
}

// ── Hover interactions ──
appIcons.forEach((icon) => {
  icon.addEventListener('mouseenter', () => {
    isHovering = true
    showAppInfo(parseInt(icon.dataset.index ?? '-1', 10))
  })
  icon.addEventListener('mouseleave', () => {
    isHovering = false
    onScroll() // restore scroll-driven state
  })
})

// ── Init ──
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()
