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
const screenshotBg = document.getElementById('screenshot-bg')!
const appIcons = document.querySelectorAll<HTMLElement>('.app-icon')

appIcons.forEach((icon) => {
  const tip = icon.querySelector('.app-tooltip')
  if (!tip) return
  const nameEl = tip.querySelector('.app-tooltip__name')
  const subEl = tip.querySelector('.app-tooltip__subtitle')
  if (nameEl) nameEl.textContent = icon.dataset.name ?? ''
  if (subEl) subEl.textContent = icon.dataset.subtitle ?? ''
})

// Tree sizing (vh units) — must match #tree-container aspect-ratio in CSS
const TREE_MIN = 75
const TREE_MAX = 105 // slightly over viewport so trunk base is below fold
const TREE_W = 793
const TREE_H = 827

// Tree starts pushed down so trunk is cut off at bottom
const TREE_OFFSET_START = 20 // vh below viewport bottom
const TREE_OFFSET_END = 5   // trunk base below viewport at end of growth

/** Matches @media (max-width) for #title in style.css (centered block + stacked subtitle). */
const MOBILE_TITLE_LAYOUT_MAX_WIDTH = 600

/** Same breakpoint as @media (max-width: 768px) for #screenshot-bg. Extra tree scale-from-scroll only here. */
const NARROW_NO_LANES_MAX_WIDTH = 768

/** At full scroll, tree scale is 1 + this (narrow). Wide layouts stay at 1.0 for the screenshot strips. */
const TREE_GROW_EASED_MAX = 0.14

/** Mobile tree constants — smaller start, width-capped growth, no extra scale. */
const TREE_MIN_MOBILE = 35
const TREE_MAX_MOBILE = 55  // usually capped by viewport-width constraint
const TREE_OFFSET_START_MOBILE = 6
const TREE_OFFSET_END_MOBILE = 1  // trunk base just below viewport

/** Max tree height (px) so width = height * (W/H) does not exceed viewport with margins on each side. */
function maxTreeHeightPx(): number {
  const isMobile = window.innerWidth <= NARROW_NO_LANES_MAX_WIDTH
  const horizontalMargin = isMobile ? 40 : 24
  const maxW = Math.max(0, window.innerWidth - horizontalMargin)
  return (maxW * TREE_H) / TREE_W
}

const screenshotGroups = document.querySelectorAll<HTMLElement>('.screenshot-group')

function setAppHighlight(index: number) {
  if (index < 0 || index >= appIcons.length) {
    appIcons.forEach(icon => icon.classList.remove('highlighted'))
    screenshotGroups.forEach(g => g.classList.remove('active'))
    return
  }

  appIcons.forEach((ic, i) => {
    ic.classList.toggle('highlighted', i === index)
  })
  screenshotGroups.forEach(g => {
    g.classList.toggle('active', g.dataset.app === String(index))
  })
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

  // Scroll 0→1 = tree grows to full size (page height matches this range only)
  const eased = easeOutCubic(progress)

  const capPx = maxTreeHeightPx()
  const capVh = (capPx / window.innerHeight) * 100
  const narrow = window.innerWidth <= NARROW_NO_LANES_MAX_WIDTH

  let treeVh: number
  let treeOffset: number

  if (narrow) {
    // Mobile: tree, screenshots, and focus effects all use progress 0.1→0.9 so they end together
    const treeT = easeOutCubic(Math.min(Math.max((progress - 0.1) / 0.8, 0), 1))
    const unboundedVh = TREE_MIN_MOBILE + (TREE_MAX_MOBILE - TREE_MIN_MOBILE) * treeT
    treeVh = Math.min(unboundedVh, capVh)
    treeOffset = TREE_OFFSET_START_MOBILE + (TREE_OFFSET_END_MOBILE - TREE_OFFSET_START_MOBILE) * treeT
  } else {
    // Desktop: existing growth behavior
    const unboundedVh = TREE_MIN + (TREE_MAX - TREE_MIN) * eased
    treeVh = Math.min(unboundedVh, capVh)
    treeOffset = TREE_OFFSET_START + (TREE_OFFSET_END - TREE_OFFSET_START) * eased
  }

  treeContainer.style.height = `${treeVh}vh`
  treeContainer.style.bottom = `${-treeOffset}vh`
  treeContainer.style.transform = 'translateX(-50%)'
  if (narrow) {
    treeContainer.style.removeProperty('transform-origin')
  }

  // Title: same motion + fade on every layout (driven by scroll, not by sky)
  const parallaxMult = window.innerWidth < 640 ? 0.45 : 1
  const titleFade = Math.max(1 - eased * 2.5, 0)
  const titleScale = Math.max(1 - eased * 0.7, 0.3)
  const titleShift = -eased * 280 * parallaxMult
  titleEl.style.opacity = String(titleFade)
  const titleMobile = window.innerWidth <= MOBILE_TITLE_LAYOUT_MAX_WIDTH
  const titleTranslateY = titleMobile
    ? `calc(-50% + ${titleShift}px)`
    : `${titleShift}px`
  titleEl.style.transform = `translateX(-50%) translateY(${titleTranslateY}) scale(${titleScale})`

  // Focus intensity: drives tooltip, icon rotation, and screenshot visibility
  // Aligned with tree growth so everything settles together (not before the tree stops)
  const focusIntensity = narrow
    ? (progress >= 0.9 ? 1 : progress > 0.1 ? (progress - 0.1) / 0.8 : 0)
    : (eased >= 0.7 ? 1 : eased > 0.15 ? (eased - 0.15) / 0.55 : 0)
  document.documentElement.style.setProperty('--focus-intensity', String(focusIntensity))
  screenshotBg.style.opacity = String(focusIntensity)

  if (narrow) {
    // Mobile: sticky sky — no animation, clouds and gradient stay in place
    cloudsEl.style.opacity = '0.55'
    cloudsEl.style.transform = 'translateY(0)'
    skyGradient.style.opacity = '1'
    skyGradient.style.transform = 'translateY(0)'

    // Position screenshot lanes in the gap between sky and tree
    const treeTopVh = 100 + treeOffset - treeVh
    const skyBottomVh = 28
    const gapVh = treeTopVh - skyBottomVh
    screenshotBg.style.top = `${skyBottomVh}vh`
    screenshotBg.style.height = `${gapVh}vh`
    screenshotBg.style.removeProperty('--ss-top-fade')
    screenshotBg.style.removeProperty('--ss-top-solid')

    // Dismiss tooltips when scrolled back (selection + screenshots stay via opacity)
    if (focusIntensity < 0.05) {
      appIcons.forEach(i => i.classList.remove('is-touch-open'))
    }
  } else {
    // Desktop: clean up mobile inline styles
    screenshotBg.style.removeProperty('top')
    screenshotBg.style.removeProperty('height')

    // Desktop: sky/clouds parallax + fade out as tree grows
    const cloudFade = Math.max(0.55 * (1 - eased), 0)
    const cloudShift = -eased * 200
    const gradientFade = Math.max(1 - eased, 0)
    const gradientShift = -eased * 160

    cloudsEl.style.opacity = String(cloudFade)
    cloudsEl.style.transform = `translateY(${cloudShift}px)`

    if (cloudFade < 0.01) {
      cloudLayerFullyFaded = true
    } else if (cloudLayerFullyFaded) {
      cloudLayerFullyFaded = false
      kickCloudMarquee()
    }

    skyGradient.style.opacity = String(gradientFade)
    skyGradient.style.transform = `translateY(${gradientShift}px)`

    const topFade = 50 - 40 * eased
    const topSolid = topFade + 10
    screenshotBg.style.setProperty('--ss-top-fade', `${topFade}%`)
    screenshotBg.style.setProperty('--ss-top-solid', `${topSolid}%`)
  }

  // App icons: visible and interactive from the first paint
  appIcons.forEach(icon => {
    icon.style.opacity = '1'
    icon.style.pointerEvents = 'auto'
  })
}

// ── Always-selected app: one app is always highlighted, can switch but not deselect ──
const touchToggle =
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

let selectedAppIndex = 0

appIcons.forEach((icon) => {
  const index = parseInt(icon.dataset.index ?? '-1', 10)

  if (!touchToggle) {
    // Desktop: hover/click selects app permanently (no revert on leave)
    icon.addEventListener('mouseenter', () => {
      selectedAppIndex = index
      setAppHighlight(index)
    })
    icon.addEventListener('focus', () => {
      selectedAppIndex = index
      setAppHighlight(index)
    })
  } else {
    // Mobile: tap switches permanent selection + shows tooltip
    icon.addEventListener('click', (e) => {
      e.stopPropagation()
      selectedAppIndex = index
      setAppHighlight(index)
      appIcons.forEach(i => i.classList.remove('is-touch-open'))
      icon.classList.add('is-touch-open')
    })
  }
})

// Mobile: background tap dismisses tooltip but keeps selection
if (touchToggle) {
  document.addEventListener('click', () => {
    appIcons.forEach(i => i.classList.remove('is-touch-open'))
  })
}

// Default: first app selected from page load
setAppHighlight(selectedAppIndex)

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
    onScroll()
  }, 150)
})

tileCloudStrip()
window.addEventListener('load', () => {
  tileCloudStrip()
})
onScroll()
