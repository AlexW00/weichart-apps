# Weichart Apps Landing Page — Implementation Plan

## Core Interpretation

The design mockups are not separate pages and not separate DOM sections that swap in and out while scrolling. They are snapshots of a single scene at different scroll positions.

That means the implementation must treat recurring objects as persistent elements in one shared scene:

- the tree exists once and is transformed from intro scale to canopy zoom to trunk focus to rocket launch
- the app icons exist once and scale/reposition with the tree rather than being recreated for each level
- Alex, the watering can, the star field, the rocket, and the newsletter scene elements are introduced into the same scene graph and then shown, hidden, or transformed as the story progresses

The scroll experience should feel like moving a camera through one authored composition, not like passing through stacked full-screen sections.

## Architecture

- **Vite + TypeScript** — already scaffolded, no framework
- **GSAP + ScrollTrigger** — master scroll timeline, scrubbing, and scroll normalization
- **Routing** — lightweight `history.pushState` / `popstate` sync against named story checkpoints
- **Styling** — single CSS file, custom properties, `@font-face` for Instrument Serif

### Scene Model

- **One scroll container** — `#app` remains the only scrollable element
- **One sticky viewport** — a single scene viewport stays fixed while the user scrolls through a dedicated scroll track
- **One shared scene graph** — visual elements are mounted once into layered containers and then transformed over time
- **One master timeline** — the scroll engine maps progress to named story checkpoints: intro, apps, about, launch transition, newsletter

### Module Structure

```text
src/
  main.ts              — boot scene, modules, scroll engine, router
  scene.ts             — create sticky viewport, layers, scroll track, shared refs
  scroll.ts            — master GSAP timeline, checkpoint registration, nav sync
  router.ts            — URL ↔ checkpoint sync
  levels/
    level0.ts          — intro composition + subtitle typing
    level1.ts          — canopy focus interactions
    level2.ts          — Alex / garden interactions
    transition23.ts    — launch segment on the shared scene
    level3.ts          — space scene + newsletter UI
  captcha.ts           — fake captcha modal + launch ceremony
  style.css            — all styles
```

Each story module should work against the shared scene rather than returning its own full-screen section:

- `setup(scene): void` — create any persistent DOM it owns and store refs on the shared scene
- `register(scene): void` — attach local behaviors and expose hooks the master scroll engine will use

If an element appears in more than one story state, it should have one owner and one DOM instance.

## Phases

### [Phase 0 — Project Setup](tasks/phase-0-setup.md)

Strip Vite boilerplate. Install GSAP. Create the sticky viewport + scroll-track shell, shared scene registry, and module stubs.

### [Phase 1 — Level 0: Intro / Sky](tasks/phase-1-level0.md)

Build the opening composition of the shared scene: cloud band, wordmark, subtitle typing, tree, and app icons in their initial positions.

### [Phase 2 — Level 1: App Tree](tasks/phase-2-level1.md)

Reuse the existing tree and icon elements for the canopy-focus state. Add the label area and icon interactions without creating a second tree.

### [Phase 3 — Level 2: Alex Watering](tasks/phase-3-level2.md)

Keep using the same tree, now framed at trunk level. Add Alex, the watering can, speech bubble, signpost, and other garden elements to the shared scene.

### [Phase 4 — Level 2→3 Transition](tasks/phase-4-transition.md)

Implement the scroll-scrubbed launch segment on the shared scene: tree becomes rocket, Alex flies away, stars fade in, and the scene darkens into space.

### [Phase 5 — Level 3: Space / Newsletter](tasks/phase-5-level3.md)

Add the persistent space-state elements that the transition resolves into: planet, rocket, gantry, cat, blinking star, and newsletter form.

### [Phase 6 — Fake Captcha + Launch Sequence](tasks/phase-6-captcha.md)

Layer the modal over the existing space scene and orchestrate the one-time rocket liftoff using the already-mounted Level 3 elements.

### [Phase 7 — Scroll Engine, Routing & Navigation](tasks/phase-7-scroll-nav.md)

Wire every state into one master timeline. Map routes and navigation controls to timeline checkpoints instead of per-section scroll jumps.

### [Phase 8 — Polish & Responsive](tasks/phase-8-polish.md)

Tune responsiveness, motion reduction, accessibility, performance, and deployment without breaking scene continuity.

## Library Justification

| Library                           | Why                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| **gsap** (+ ScrollTrigger plugin) | The project depends on one persistent scene with scroll-scrubbed transforms and precise checkpoints. |

No React, no CSS framework, no router library.

## Key Architectural Decisions

- **No repeated scene DOM** — repeated objects must not be cloned per level
- **Persistent scene graph** — story states are camera/framing changes and visibility changes inside one composed world
- **Scroll track over stacked sections** — scroll distance is provided by a dedicated track, while the viewport stays fixed
- **Named checkpoints, not pages** — routes map to authored resting states on the master timeline
- **Assets served from `/public/`** — static images and SVGs stay outside bundler imports where convenient
