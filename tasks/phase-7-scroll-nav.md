# Phase 7 — Scroll Engine, Routing & Navigation

## Overview

Wire the finished scenes into one coherent storytelling machine. This phase does not introduce a new visual level; it makes the existing levels behave like a single guided journey with scroll progression, URL synchronization, and persistent level navigation controls.

By the end of this phase, the page should feel like one continuous narrative that can be explored in three equivalent ways:

- natural scrolling
- bottom-right up/down navigation buttons
- loading a direct URL for a specific major level

**Prerequisites:** Phases 0 through 6 must be complete. All level scenes, the Level 2→3 transition, and the newsletter launch sequence already exist.

---

## Story Map

There are four major resting states and one in-between cinematic transition:

1. `/` — Level 0: Intro / Sky
2. `/apps` — Level 1: App Tree
3. `/about` — Level 2: Alex Watering
4. Transition between Level 2 and Level 3 — cinematic rocket-launch bridge, not its own route
5. `/newsletter` — Level 3: Space / Newsletter

The transition is part of the journey between `/about` and `/newsletter`, but it is not a standalone destination URL.

---

## Scroll Model

The page behaves as one vertical story inside the dedicated scroll container established earlier.

Each major level occupies its own scroll stage. Moving through the page should feel authored rather than like free-form document scrolling:

- Level 0 settles into its intro composition
- scrolling advances into Level 1
- scrolling continues into Level 2
- scrolling then enters the pinned Level 2→3 transition
- the transition releases into Level 3

The user should feel the page moving between intentional scenes, not between unrelated blocks of content.

### Active level logic

At any given moment, exactly one major level is considered active for navigation and routing purposes:

- Level 0 when the intro scene is dominant
- Level 1 when the tree-canopy app scene is dominant
- Level 2 when the Alex watering scene is dominant
- Level 3 when the user has arrived in the newsletter space scene

The in-between rocket transition does not become its own route. While the transition is in progress, the URL should remain associated with the nearest meaningful story level according to the chosen implementation, but the final result must still be clear and stable: entering the completed space scene lands on `/newsletter`.

---

## Direct Route Behavior

Loading one of the four supported routes should place the user directly into the corresponding major story state without requiring manual scrolling first.

### Route expectations

- `/` opens at the intro sky scene
- `/apps` opens at the app-tree scene
- `/about` opens at the Alex watering scene
- `/newsletter` opens at the pre-launch newsletter scene in space

Important: `/newsletter` should open the normal Level 3 state, not the captcha popup, not the countdown, and not the post-launch rocket-gone state. The modal and launch are interaction states inside Level 3, not distinct routes.

### Popstate behavior

Using browser back/forward should move the story to the correct major level state. The page should not visually glitch, reload, or briefly jump through intermediate scenes before settling.

---

## URL Synchronization During Scrolling

As the user scrolls naturally through the story, the URL should update to reflect the currently active major level.

The URL updates should feel stable rather than noisy:

- do not change the route constantly for tiny scroll movements
- only update once a new major scene is clearly the active state
- avoid flickering between two routes when the user is near a boundary

This route sync should work the same whether the user moves with a wheel, trackpad, touch scroll, keyboard scroll, or the bottom-right navigation buttons.

---

## Bottom-Right Level Navigation

Provide a persistent two-button navigation control in the bottom-right corner of the viewport.

### Visual description

The control consists of two circular buttons stacked vertically or otherwise grouped tightly as a small control cluster.

- one button moves upward through the story
- one button moves downward through the story
- each button contains a simple arrow or chevron shape pointing up or down respectively, drawn with CSS borders (no image assets)
- the control is CSS-only; no image assets are used

**Specific style guidance** (these buttons do not appear in any design file — implement as follows):

- Each button: `36px` diameter circle
- Background: `rgba(255, 255, 255, 0.15)` (subtly visible across all level backgrounds)
- Border: `1.5px solid rgba(255, 255, 255, 0.6)`
- Arrow/chevron: CSS border trick, white, about `8px` wide
- Gap between buttons: `8px`
- Position: `fixed`, `bottom: 24px`, `right: 20px`
- On Level 0 (sky blue) and Level 1/2 (cream), the white border may be subtle — acceptable; the cursor change still signals interactivity
- Disabled state: `opacity: 0.25`, `pointer-events: none`

The buttons should feel understated but always available. They are a utility layer, not a hero visual element.

### Behavior

Pressing the navigation buttons should move to the previous or next major level at a controlled, authored speed rather than snapping instantly.

The movement should feel equivalent to a well-paced scroll progression:

- Up from Level 1 goes to Level 0
- Down from Level 1 goes to Level 2
- Up from Level 3 goes back toward Level 2 through the transition
- Down from Level 2 proceeds toward Level 3 through the transition

The navigation should respect the same story transitions already built. It must not bypass the cinematic Level 2→3 section.

### Edge states

At the first level, the up button should be disabled or visibly inactive.

At the last level, the down button should be disabled or visibly inactive.

The disabled state should be obvious while still matching the minimalist visual language.

---

## Launch-Sequence Coordination

Phase 6 introduced a temporary lock during the captcha countdown and rocket liftoff. This phase must integrate that lock with the global scroll and navigation systems.

### While countdown / launch is active

- manual scrolling is blocked
- bottom-right nav buttons are blocked or disabled
- route changes triggered by story movement are suspended until the sequence settles
- the page should not allow the user to escape the launch by navigating away through scroll gestures alone

### After launch completes

- normal scrolling is restored
- bottom-right navigation becomes usable again
- the route remains `/newsletter`
- the final Level 3 post-launch state remains intact

---

## Scroll-to-Level Behavior

Whenever the system moves to a major level programmatically — whether from a nav button press, direct route load, or browser history event — it should travel to that level cleanly and predictably.

### Expectations

- movement is smooth rather than instant where appropriate
- the landing position matches the intended designed state of that level
- the scroll engine and GSAP state stay in sync
- the page does not overshoot, bounce, or stop at partial intermediate offsets

This is especially important for the `/about` ↔ `/newsletter` pair because their relationship includes the pinned transition section.

---

## Resize and Refresh Robustness

The scroll engine must remain stable if the viewport size changes.

### On resize

- section measurements recalculate correctly
- route-to-position mapping remains accurate
- pinned transition timing still lines up with the visual scenes
- the bottom-right navigation stays anchored to the viewport corner

### On refresh

Refreshing while on `/apps`, `/about`, or `/newsletter` should reopen the page in the matching story state rather than sending the user back to the top.

---

## Accessibility Expectations

The navigation controls should remain usable without fine-grained scrolling.

Requirements:

- buttons are keyboard focusable
- buttons have meaningful accessible labels such as moving up or down a level
- focus styling is visible against every background state
- disabled states are conveyed both visually and semantically

If keyboard scrolling is used, route synchronization should still behave correctly.

---

## Module Structure

Implement the global orchestration described in the implementation plan:

- `src/scroll.ts` manages the story-level scroll positions, active-level detection, and programmatic movement between levels
- `src/router.ts` maps between routes and major level ids, handles `pushState`, and responds to `popstate`
- `src/main.ts` boots the levels, scroll engine, router, and bottom-right navigation control

If a small dedicated navigation helper is useful, keep it lightweight and consistent with the existing module structure.

Add the persistent navigation control styles to `src/style.css` after the Phase 6 rules.

---

## Verification Checklist

After implementation, verify in the browser:

1. Natural scrolling progresses through the story in order: Level 0 → Level 1 → Level 2 → transition → Level 3
2. The page feels like one authored narrative rather than unrelated stacked sections
3. Visiting `/` opens Level 0 directly
4. Visiting `/apps` opens Level 1 directly
5. Visiting `/about` opens Level 2 directly
6. Visiting `/newsletter` opens the normal pre-launch Level 3 scene directly
7. Browser back/forward moves to the correct major level without reload glitches
8. The URL updates as the user moves between major levels, but does not flicker excessively near boundaries
9. The bottom-right up/down controls remain visible across the whole story
10. Clicking the nav buttons moves between levels at a controlled speed and follows the same transitions as normal scrolling
11. Moving between `/about` and `/newsletter` still passes through the cinematic transition rather than jumping past it
12. At the first level, the up control is visibly disabled; at the last level, the down control is visibly disabled
13. During the captcha countdown and rocket launch, scrolling and nav buttons are temporarily blocked
14. After the launch settles, scrolling and nav controls work again while staying on `/newsletter`
15. Refreshing the page on any supported route returns to that same major level
16. Resizing the viewport does not break scene alignment or route mapping
17. Nav controls are keyboard reachable, labeled, and visibly focusable
18. Build check: `npx tsc --noEmit` passes with zero errors

---

## Files Modified

| File            | Action                                                                                 |
| --------------- | -------------------------------------------------------------------------------------- |
| `src/main.ts`   | Boot the scroll engine, router sync, and persistent navigation controls                |
| `src/scroll.ts` | Implement level mapping, active-level tracking, and smooth programmatic level movement |
| `src/router.ts` | Implement route-to-level sync and browser history handling                             |
| `src/style.css` | Append bottom-right navigation control styles after the Phase 6 rules                  |

No new dependencies added.
