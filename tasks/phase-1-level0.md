# Phase 1 — Level 0: Intro / Sky

## Overview

Build the opening screen of the landing page: a bright sky scene that introduces the Weichart brand. This is the very first thing visitors see — it should feel cheerful, hand-crafted, and inviting.

The level fills exactly one viewport height. It contains a scrolling cloud strip across the top edge, the "Weichart" wordmark and "Apps for Humans" tagline in the upper-middle area, and a large watercolor tree filling the bottom half with app icons nestled in its canopy.

After this phase, `npm run dev` should show a complete, visually correct Level 0 matching `designs/level-0.png`. No scroll interactions yet — those are wired in Phase 7.

**Prerequisites:** Phase 0 must be complete (GSAP installed, module stubs exist, CSS tokens defined, fonts loaded).

---

## Scene Description

### Background

The Level 0 section itself has a **solid cream background** (`#FEFEF4`) — the same color as the rest of the page. The sky-blue color (`#E1F7FF`) only appears in the **cloud band area at the top**, not across the whole viewport.

Implement this by giving the cloud band container its own background gradient rather than the whole section: the cloud band div has a `linear-gradient` from `#E1F7FF` at 0% to `#FEFEF4` at 100% (or transparent), covering roughly the top 130–160px of the viewport. This way the blue fades into cream right at the bottom of the cloud zone, and the rest of the page below is solid cream. There is no full-page gradient.

### Cloud band (top edge)

At the very top edge of the viewport, spanning the full width, is a **staggered two-row cloud pattern** using `cloud-colored.png` (390×274px) — a hand-drawn, ASCII-art-style cloud rendering (not photorealistic).

The design shows two offset rows of clouds rather than a single flat strip: the first row sits at the top edge, and the second row is vertically offset downward by roughly half a cloud height and horizontally offset so the clouds fall in the gaps of the first row, creating a staggered, more natural-looking cloud cover.

Both rows animate slowly and continuously from right to left (or left to right — consistent with the design) creating an infinite scrolling loop. One full cycle takes about 35 seconds. The loop must be seamless — no visible jump or gap when it wraps. The two rows may animate at very slightly different speeds to reinforce depth.

Each cloud is rendered at roughly 1/3 of its original height, so about 130px tall on desktop. The gradient background shows through between the cloud shapes (they have transparent backgrounds). The band is purely decorative and does not respond to clicks.

When the user scrolls down to later levels, this cloud band scrolls out of view along with the rest of Level 0 — it is not pinned or sticky.

### Branding text (upper-middle)

Centered horizontally in the scene, positioned about one-third of the way down from the top of the viewport (between the cloud strip and the tree), are two text elements stacked vertically:

**Wordmark:** The word "Weichart" in large serif text (Instrument Serif Regular, black). It is very prominent — about 120px font size on desktop, roughly 8–10% of viewport height. Just the word, no decoration or underline.

**Subtitle:** Directly below the wordmark, with only a small gap (about 4px), is "Apps for Humans" in smaller italic serif text (Instrument Serif Italic, about 28px on desktop). "Apps for " is black. The word "Humans" is olive-green (`#808C27`) with a text underline (`text-decoration: underline`). After "Humans" there is a blinking text cursor character (`|`), also in olive-green (no underline on the cursor).

The subtitle is right-aligned to the wordmark — meaning the right edge of the subtitle text aligns with the right edge of "Weichart" above it. Both are horizontally centered as a group within the viewport. To achieve this, wrap the wordmark and subtitle in a shared container that is centered, with children right-aligned within it.

The branding text sits above all other elements (above the clouds if they overlap, above the tree).

### Typing animation (subtitle)

The cursor blinks steadily at about 530ms intervals (on for half a second, off for half a second) using a step animation.

Periodically, a typing animation cycles through translations of "Humans":

1. The page loads showing "Humans" with the blinking cursor
2. After about 4 seconds, "Humans" deletes letter by letter (fast — about 40ms per character)
3. Brief pause (about 300ms) with just the cursor blinking
4. "Menschen" (German) types in letter by letter (slightly slower — about 60ms per character)
5. Holds for about 4 seconds
6. Deletes, pauses, then types "人間" (Japanese)
7. Holds, deletes, then types "Humans" again
8. Cycle repeats endlessly: Humans → Menschen → 人間 → Humans → ...

The cursor continues blinking throughout, including during typing and deletion. The typed word always appears in olive-green (`#808C27`).

Start this animation when `register()` is called. The initial word "Humans" should already be present in the DOM from `create()`.

### The tree (bottom-center)

Horizontally centered, the tree image (`tree-colored.png`, 793×827px) dominates the bottom portion of the scene.

**Important:** The tree asset already contains everything visual about the tree — the pinkish/salmon watercolor trunk, the green canopy blob background, the dashed elliptical border, and the ASCII art decorations (tildes, braces, slashes, underscores arranged around the canopy). All of this is baked into the PNG image. There is NO CSS-drawn canopy overlay, no CSS gradient, no CSS dashed border, and no CSS-positioned ASCII text. The only things positioned on top of the tree image are the app icons and the branding text.

About 3/5 of the tree is visible — the full canopy and upper trunk. The bottom 2/5 of the trunk extends below the viewport edge (clipped by overflow). The tip of the canopy (top of the tree image) sits at roughly the vertical center of the viewport or slightly above.

On desktop, the tree is about 48% of the viewport width. Its height scales naturally from the image's aspect ratio (roughly square). The tree is a background element — it sits behind the icons, clouds, and text.

### App icons (inside canopy)

Inside the canopy area, three small square app icons are arranged in a horizontal row with even spacing (about 24px gaps between them):

- `zettel-icon.png` (Zettel app)
- `zeitgeist-icon.png` (Zeitgeist app)
- `next-icon.png` ("?" placeholder for upcoming app)

Each icon is rendered small — about 65px square on desktop (roughly 1/20 of viewport width). They have a white background, rounded corners (about 12px radius), and a subtle drop shadow. The row of icons is horizontally centered within the canopy, positioned vertically at about the center of the canopy overlay.

At this level the icons are just static previews — they are not interactive. They become clickable in Level 1.

### Layering (back to front)

1. Sky-to-cream gradient background
2. Tree image (contains the canopy shape, dashed border, and ASCII art decorations — all baked into the PNG)
3. App icons row (positioned on top of the tree's canopy area)
4. Cloud band — two staggered rows at the top of the viewport
5. Branding text — wordmark and subtitle (always readable, in front of everything)

---

## Mobile Behavior (viewport ≤ 768px)

- Wordmark shrinks to about 70px font size (roughly 60% of desktop)
- Subtitle shrinks proportionally to about 20px
- Tree widens to about 75% of viewport width instead of 48%
- App icons scale with the tree — shrink to about 50px square, gaps reduce to about 16px
- Cloud strip reduces in height to about 90px (clouds rendered smaller)
- Nothing should overlap unexpectedly or clip in a broken way

---

## Assets Used

| Asset          | File                 | Original Dimensions | Approximate Rendered Size (Desktop)  |
| -------------- | -------------------- | ------------------- | ------------------------------------ |
| Cloud          | `cloud-colored.png`  | 390×274 px          | ~185×130 px each instance            |
| Tree           | `tree-colored.png`   | 793×827 px          | ~48vw wide (height scales naturally) |
| Zettel icon    | `zettel-icon.png`    | 441×438 px          | ~65×65 px                            |
| Zeitgeist icon | `zeitgeist-icon.png` | 441×438 px          | ~65×65 px                            |
| Next icon      | `next-icon.png`      | 441×438 px          | ~65×65 px                            |

## Fonts Used

- **Instrument Serif Regular** — "Weichart" wordmark
- **Instrument Serif Italic** — "Apps for Humans" subtitle

## Colors

- Background: `#E1F7FF` (sky blue)
- Wordmark text: black
- Subtitle prefix ("Apps for "): black
- Typed word ("Humans" etc.) and cursor: `#808C27` (olive green); typed word has `text-decoration: underline`; cursor does not
- Icon background: white

---

## Module Structure

Implement in `src/levels/level0.ts` following the architecture from Phase 0:

- `create()` — builds and returns the entire Level 0 DOM subtree (section element with all children)
- `register(scrollContainer)` — starts the typing animation

Add Level 0 styles to `src/style.css`, appended after the existing rules.

---

## Verification Checklist

After implementation, visually confirm in the browser:

1. Entire viewport is sky-blue (`#E1F7FF`)
2. Cloud strip scrolls slowly and seamlessly at the top edge
3. "Weichart" is large, centered, serif, black, about one-third down
4. "Apps for Humans" sits directly below, right-aligned to wordmark, with olive-green underlined "Humans" and blinking cursor (cursor is not underlined)
5. Typing animation cycles correctly: Humans → Menschen → 人間 → Humans → ...
6. Tree is centered, canopy visible from mid-viewport up, trunk clipped below viewport — the canopy's green blob, dashed border, and ASCII art decorations are all visible as part of the tree image
7. Three small icons visible inside the canopy in a row, positioned on top of the tree image
8. Layer order correct: text readable above clouds, clouds above tree
9. On mobile (≤768px): everything scales down proportionally, nothing breaks

Build check: `npx tsc --noEmit` must pass with zero errors.

---

## Files Modified

| File                   | Action                                     |
| ---------------------- | ------------------------------------------ |
| `src/style.css`        | Append Level 0 styles after existing rules |
| `src/levels/level0.ts` | Replace stub with full implementation      |

No new files are created. No dependencies are added.
