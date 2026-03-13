# Weichart Apps Landing Page — Implementation Plan

## Architecture

- **Vite + TypeScript** (already scaffolded) — no framework, vanilla TS modules
- **GSAP + ScrollTrigger** — the one library addition. Handles scroll-linked animation, section pinning, timeline scrubbing, and cross-device scroll normalization. This is the hardest thing to get right by hand, and it's the backbone of the entire experience.
- **Routing** — ~30 lines of custom `history.pushState` / `popstate` code to sync URL with active level. No router library.
- **Styling** — single CSS file, custom properties, `@font-face` for Instrument Serif. No CSS framework.

### Module Structure

```
src/
  main.ts              — entry: boots layout, scroll engine, router
  scroll.ts            — GSAP ScrollTrigger setup, level registration, nav sync
  router.ts            — URL ↔ level sync
  levels/
    level0.ts          — Intro / Sky
    level1.ts          — App Tree
    level2.ts          — Alex Watering
    transition23.ts    — Level 2→3 cinematic transition
    level3.ts          — Space / Newsletter
  captcha.ts           — Fake captcha modal + rocket launch sequence
  style.css            — All styles
```

Each level module exports:

- `create(): HTMLElement` — builds and returns its DOM subtree
- `register(scrollEngine): void` — hooks its animations into the scroll timeline

---

## Phases

### [Phase 0 — Project Setup](tasks/phase-0-setup.md)

Strip Vite boilerplate. Install GSAP. Set up fonts, CSS custom properties, scroll container, module stubs.

### [Phase 1 — Level 0: Intro / Sky](tasks/phase-1-level0.md)

Sky background, cloud marquee, tree, "Weichart" wordmark, "Apps for Humans" typing animation with translated variants and blinking cursor.

### [Phase 2 — Level 1: App Tree](tasks/phase-2-level1.md)

Scroll-zoom into canopy. App icons with hover → label area showing app name and description. Touch-friendly fallback.

### [Phase 3 — Level 2: Alex Watering](tasks/phase-3-level2.md)

Stickman + face, watering can animation, water drops, speech bubble (random quote, typed letter-by-letter), arrow + "This is Alex" label, signpost interaction (hover underline, click → external link).

### [Phase 4 — Level 2→3 Transition](tasks/phase-4-transition.md)

The cinematic core: tree rises and becomes the rocket, thrust appears, background shifts garden→space, screen shake + haptic feedback, Alex flies away (hands-up, shrinking, rotating to top-right), stars fade in.

### [Phase 5 — Level 3: Space / Newsletter](tasks/phase-5-level3.md)

Planet, rocket, sleeping cat, star field, Alex as blinking star, email input + subscribe button with hover state.

### [Phase 6 — Fake Captcha + Launch Sequence](tasks/phase-6-captcha.md)

Modal with forbidden button (3 visual states), cancel path, loading state/"Sigh... I knew it...", countdown numbers at random positions, rocket launch animation, scroll lock, post-launch disabled state.

### [Phase 7 — Scroll Engine, Routing & Navigation](tasks/phase-7-scroll-nav.md)

Wire all levels into one ScrollTrigger timeline. Level nav buttons (bottom-right circles, up/down). URL sync on scroll + direct-route jump on load. Scroll lock/unlock during launch sequence.

### [Phase 8 — Polish & Responsive](tasks/phase-8-polish.md)

Mobile layout adjustments, touch interaction fallbacks, reduced-motion media query, keyboard accessibility, performance pass, cross-browser testing. Deploy to GitHub Pages.

---

## Library Justification

| Library                           | Why                                                                                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **gsap** (+ ScrollTrigger plugin) | Scroll-linked pinning, scrubbing, and cross-device normalization is the single hardest part of this project. GSAP is the industry standard and handles mobile momentum, resize, nested timelines — things that take weeks to hand-roll reliably. |

No other libraries. No React, no CSS framework, no router library.

---

## Key Architectural Decisions

- **No framework** — single narrative scene, not a component-driven app. Vanilla TS gives full DOM control needed for scroll-linked positioning.
- **One scroll timeline** — all levels are sections in one tall document. ScrollTrigger pins each section and scrubs its animations as the user scrolls through.
- **Self-contained level modules** — each level owns its DOM creation and animation registration. This keeps the codebase navigable as complexity grows.
- **Assets served from `/public/`** — Vite serves these statically with no import/bundling needed for images.
