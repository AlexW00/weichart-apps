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

appIcons.forEach((icon) => {
  const tip = icon.querySelector('.app-tooltip')
  if (!tip) return
  const nameEl = tip.querySelector('.app-tooltip__name')
  const subEl = tip.querySelector('.app-tooltip__subtitle')
  if (nameEl) nameEl.textContent = icon.dataset.name ?? ''
  if (subEl) subEl.textContent = icon.dataset.subtitle ?? ''
})

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

function setAppHighlight(index: number) {
  if (index < 0 || index >= appIcons.length) {
    appIcons.forEach(icon => icon.classList.remove('highlighted'))
    currentHighlight = -1
    return
  }

  appIcons.forEach((ic, i) => {
    ic.classList.toggle('highlighted', i === index)
  })
  currentHighlight = index
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

const cloudStrip = document.querySelector<HTMLElement>('.cloud-strip')!

/** Snapshot of the 12-image row from HTML; extra copies are appended until the strip fills wide viewports. */
let cloudStripUnitHtml: string | null = null

/** Wide windows are wider than one 12-cloud row, leaving empty sky on the right; tile until ~1.25× viewport. */
function tileCloudStrip() {
  if (cloudStripUnitHtml === null) {
    cloudStripUnitHtml = cloudStrip.innerHTML.trim()
  }
  const minWidth = Math.ceil(window.innerWidth * 1.25)
  cloudStrip.innerHTML = cloudStripUnitHtml
  // Before images have dimensions, scrollWidth can be 0 — add one duplicate and retry on load/resize.
  if (cloudStrip.scrollWidth < 1) {
    cloudStrip.insertAdjacentHTML('beforeend', cloudStripUnitHtml)
    cloudStrip.style.setProperty('--marquee-copies', '2')
    kickCloudMarquee()
    return
  }
  let copies = 1
  while (cloudStrip.scrollWidth < minWidth && copies < 32) {
    cloudStrip.insertAdjacentHTML('beforeend', cloudStripUnitHtml)
    copies++
  }
  if (copies < 2) {
    cloudStrip.insertAdjacentHTML('beforeend', cloudStripUnitHtml)
    copies = 2
  }
  cloudStrip.style.setProperty('--marquee-copies', String(copies))
  kickCloudMarquee()
}

/** Reattach the CSS marquee: fixes paused/stale animations after a long open tab, backgrounding, or bfcache. */
function kickCloudMarquee() {
  if (!cloudStrip) return
  for (const anim of cloudStrip.getAnimations()) {
    if (anim.playState !== 'running') {
      void anim.play()
    }
  }
  const prev = cloudStrip.style.animation
  cloudStrip.style.animation = 'none'
  void cloudStrip.offsetWidth
  cloudStrip.style.animation = prev
  for (const anim of cloudStrip.getAnimations()) {
    if (anim.playState !== 'running') {
      void anim.play()
    }
  }
}

// True while scroll has fully faded the cloud layer (enables one restart when they reappear)
let cloudLayerFullyFaded = false

function onScroll() {
  const maxScroll = document.body.scrollHeight - window.innerHeight
  const progress =
    maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0

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

  // Clouds: fade and rise with tree (0.55 → 0 across full growth phase, not by eased≈0.55)
  const cloudFade = Math.max(0.55 * (1 - eased), 0)
  const cloudShift = -eased * 200
  cloudsEl.style.opacity = String(cloudFade)
  cloudsEl.style.transform = `translateY(${cloudShift}px)`

  if (cloudFade < 0.01) {
    cloudLayerFullyFaded = true
  } else if (cloudLayerFullyFaded) {
    cloudLayerFullyFaded = false
    kickCloudMarquee()
  }

  // Sky gradient: fades out and rises, fully gone when tree is full size
  const gradientFade = Math.max(1 - eased, 0)
  const gradientShift = -eased * 160
  skyGradient.style.opacity = String(gradientFade)
  skyGradient.style.transform = `translateY(${gradientShift}px)`

  // App icons: visible and interactive from the first paint
  appIcons.forEach(icon => {
    icon.style.opacity = '1'
    icon.style.pointerEvents = 'auto'
  })

  // ── Phase 2: Highlight apps sequentially via scroll ──
  if (!isHovering) {
    if (progress > GROWTH_END) {
      const hlT = (progress - GROWTH_END) / (1 - GROWTH_END)
      const count = appIcons.length
      const idx = Math.min(Math.floor(hlT * count), count - 1)
      if (idx !== currentHighlight) setAppHighlight(idx)
    } else {
      setAppHighlight(-1)
    }
  }
}

// ── Hover / keyboard focus (pause scroll-driven highlight) ──
appIcons.forEach((icon) => {
  const index = parseInt(icon.dataset.index ?? '-1', 10)

  icon.addEventListener('mouseenter', () => {
    isHovering = true
    setAppHighlight(index)
  })
  icon.addEventListener('mouseleave', () => {
    isHovering = false
    onScroll()
  })
  icon.addEventListener('focus', () => {
    isHovering = true
    setAppHighlight(index)
  })
  icon.addEventListener('blur', () => {
    isHovering = false
    onScroll()
  })
})

// ── Init ──
window.addEventListener('scroll', onScroll, { passive: true })
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    kickCloudMarquee()
  }
})
window.addEventListener('pageshow', (e: PageTransitionEvent) => {
  if (e.persisted) {
    kickCloudMarquee()
  }
})

let resizeDebounce: number | null = null
window.addEventListener('resize', () => {
  if (resizeDebounce !== null) {
    window.clearTimeout(resizeDebounce)
  }
  resizeDebounce = window.setTimeout(() => {
    resizeDebounce = null
    tileCloudStrip()
  }, 150)
})

tileCloudStrip()
window.addEventListener('load', () => {
  tileCloudStrip()
})
onScroll()
