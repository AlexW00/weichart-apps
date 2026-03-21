# Phase 8 — Polish & Responsive

## Overview

This is the final pass before shipping. No new features are introduced. Instead, every scene, animation, and interaction is audited against the design references and spec, then tuned for mobile, accessibility, reduced motion, performance, and deployment.

Architecture rule for this phase: preserve shared-scene continuity. Polish work must not regress the implementation back toward duplicated per-level DOM or page-like section swaps.

**Prerequisites:** Phases 0 through 7 must be complete. The full storytelling flow, all interactions, routing, and navigation should be functional before this phase begins.

---

## Mobile Layout Audit

Walk through every scene on a narrow viewport (375px wide, standard phone) and verify the layout holds.

### Level 0 — Intro / Sky

- Cloud marquee remains visible and loops without gaps
- "Weichart" wordmark scales down but stays legible and centered
- "Apps for Humans" subtitle stays aligned to the right edge of the wordmark
- Tree remains centered at the bottom, sized proportionally to the viewport
- App icons on the tree remain visible and do not overlap each other

### Level 1 — App Tree

- Canopy fills most of the viewport without overflowing horizontally
- App icons remain tappable with comfortable spacing
- Hover label area (app name and description) appears on tap and is fully readable without being clipped

### Level 2 — Alex Watering

- Tree trunk, Alex, watering can, and signpost all fit within the viewport
- Speech bubble does not overflow the right edge
- Arrow and "This is Alex" label remain visible
- Flowers and signpost remain visible on the left without being clipped
- Tapping the signpost is easy and the link works

### Level 2→3 Transition

- Tree rises smoothly; thrust does not overflow viewport width
- Alex and watering can fly-away path stays within view until they shrink away
- Background color transition and star fade-in read correctly at narrower widths
- Screen shake is present but not jarring on a small screen

### Level 3 — Space / Newsletter

- Planet fills the viewport width with its upper portion visible
- Rocket and gantry scale proportionally and stay on the planet surface
- Cat remains visible and correctly positioned
- Email input and Subscribe button stack vertically on very narrow screens
- Both remain usable as tap targets (at least 44px tall)
- Star strips cover the full screen edge to edge

### Captcha Modal

- Popup scales to fit with visible margins on all sides
- Red button is large enough to tap
- Cancel control is accessible
- Countdown numbers are readable

### Post-Launch

- Disabled form remains visible and legible
- Gantry and sleeping cat remain positioned on the planet surface

---

## Touch Interaction Fallbacks

Hover-dependent behaviors need touch equivalents:

- **App icons (Level 1):** Tap to toggle the label area instead of hover
- **Signpost (Level 2):** Tap to follow the link; hover underline is not required on touch devices
- **Subscribe button (Level 3):** Tap works without hover state being prerequisite
- **Red captcha button:** Tap triggers the pressed state correctly

Ensure no interactions are gated behind hover-only states on touch devices.

---

## Reduced Motion

When the user has enabled `prefers-reduced-motion: reduce`, the page should remain fully functional but suppress or simplify motion:

- Cloud marquee: stop or significantly slow the loop
- Typing animation: show the final text immediately or with a simple fade
- Floating/bobbing of speech bubble and arrow: freeze in their resting position
- Star field drift: stop the ambient movement; stars remain static
- Star-blink pulse: freeze at full brightness
- Launch transition: the tree, thrust, and Alex should still move to their end positions, but at a simpler linear pace rather than being scrubbed frame-by-frame
- Screen shake: skip entirely
- Haptic vibration: skip entirely
- Countdown numbers: show them sequentially without random positioning animation
- Watering can rocking: freeze
- Water drops: hide or freeze

The story must still be navigable from Level 0 through Level 3. The reduced-motion version is a simplified but complete experience, not a broken one.

---

## Keyboard Accessibility

### Focus management

- All interactive elements must be reachable by keyboard tabbing: app icons, signpost link, email input, Subscribe button, captcha red button, Cancel button, bottom-right nav controls
- Focus order should follow the visual reading order within each scene
- Focus styling must be visible against every background: sky blue, cream, black

### Screen reader considerations

- Images should have meaningful alt text describing their role in the scene rather than their filename
- The bottom-right nav buttons should have accessible labels indicating direction and purpose
- Disabled states (post-launch form) should be conveyed semantically
- The captcha modal should trap focus while open and return focus to the Subscribe button when closed

---

## Deployment

### GitHub Pages setup

- Configure Vite to build with the correct base path for the deployment target
- Ensure the SPA routing works: all four routes (`/`, `/apps`, `/about`, `/newsletter`) must resolve correctly rather than returning 404 from the static host
- This typically requires a 404.html fallback or equivalent mechanism for GitHub Pages
- Verify `favicon.svg` is served correctly from the build output

### Build verification

- `npm run build` completes without errors or warnings
- The `dist/` output contains all required assets
- Serving the built output locally produces the same experience as the dev server

---

## Verification Checklist

After completing all polish work:

1. Every scene matches its design reference at desktop viewport width
2. Every scene remains usable and visually coherent at 375px viewport width
3. Touch interactions work on a real phone or accurate device emulation
4. With `prefers-reduced-motion: reduce` enabled, the page loads and the full story is navigable without motion sickness triggers
5. Repeated story objects still exist as single persistent scene elements rather than duplicated responsive variants
6. All interactive elements are keyboard reachable with visible focus rings
7. The captcha modal traps and restores focus correctly
8. Images below the fold do not block initial paint
9. Ambient animations maintain smooth frame rate on a mid-range device
10. The production build is clean and reasonably sized
11. The deployed GitHub Pages site loads all four routes without 404 errors
12. `favicon.svg` appears in the browser tab
13. Chrome, Safari, and Firefox all present the experience without critical visual or interaction differences
14. `npx tsc --noEmit` passes with zero errors
15. `npm run build` completes with zero errors

---

## Files Modified

| File              | Action                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `src/style.css`   | Add reduced-motion media query overrides, focus styling adjustments, mobile breakpoint refinements |
| `src/levels/*.ts` | Add alt text, aria attributes, touch fallbacks, lazy loading where needed                          |
| `src/captcha.ts`  | Focus trap, reduced-motion simplifications for countdown and shake                                 |
| `src/scroll.ts`   | Reduced-motion scroll behavior adjustments if needed                                               |
| `src/main.ts`     | Any top-level accessibility or loading orchestration                                               |
| `vite.config.ts`  | Base path configuration for GitHub Pages deployment                                                |
| `index.html`      | Favicon link, any meta tags for deployment                                                         |

No new dependencies added.
