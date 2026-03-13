# Phase 2 — Level 1: App Tree

## Overview

Build the second screen of the landing page: a zoomed-in view of the tree canopy where the three app icons are large, prominent, and interactive. This level fills exactly one viewport height. The visitor has conceptually "moved closer" to the canopy — everything about the tree and its decorations is now much bigger and more detailed.

After this phase, `npm run dev` should show a complete, visually correct Level 1 matching `designs/level-1.png` (default state) and `designs/level-1-hover-app.png` (hover state). No scroll transitions between Level 0 and Level 1 yet — those are wired in Phase 7.

**Prerequisites:** Phase 1 must be complete (Level 0 fully implemented, canopy shape and app icons exist in Level 0).

---

## Scene Description

### Background

The entire viewport is filled with the warm cream color (`#FEFEF4`). This is a different feel from Level 0's sky-blue — we are now "inside" the canopy world, surrounded by a softer, earthier tone.

### The canopy (zoomed in)

The same tree image (`tree-colored.png`) from Level 0 is now rendered much larger, filling most of the viewport. Imagine the camera has pushed forward into the tree's canopy until it fills your entire field of vision.

**Important:** The tree asset already contains everything visual about the canopy — the green canopy blob background, the dashed elliptical border, and the ASCII art decorations (tildes, braces, slashes, underscores). All of this is baked into the PNG. There is NO CSS-drawn canopy overlay, no CSS gradient, no CSS dashed border, and no CSS-positioned ASCII text. The zoomed-in view simply shows the tree image at a much larger scale.

What's visible at this scale:

- The green canopy fill is now large and dominant, stretching across most of the viewport
- The dashed border is clearly visible with thick dashes at this scale
- The ASCII art decorations (`/ ~~ ~~\` at top, tildes, braces on sides, `\ _ _ /` at bottom) are now large and clearly readable

### Trunk (bottom peek)

Below the canopy ellipse, the very top of the trunk is visible. The pinkish/salmon-colored trunk widens as it descends and disappears below the bottom edge of the viewport. Only the topmost portion — where the trunk meets the canopy — is visible, roughly the bottom 15–20% of the viewport. This grounds the scene and reminds the viewer they are still looking at the tree.

### Important implementation note

This level reuses the **same tree image** from Level 0. In the final product, the scroll transition from Level 0 to Level 1 will scale and translate the tree upward so it appears to zoom in (Phase 7 handles this). For now, build Level 1 as an independent, static section that visually shows the zoomed-in view of `tree-colored.png` — simply display the same tree image at a much larger scale, centered so the canopy portion fills the viewport. Phase 7 will later unify these into a single scrolling transition.

---

## App Icons (large, interactive)

The three app icons are now much larger than in Level 0 — about 130px square on desktop (roughly double their Level 0 size). They are arranged in a horizontal row, centered both horizontally and vertically within the canopy ellipse, with approximately 40–50px gaps between each icon.

Each icon has:

- A **white background** filling the square
- **Rounded corners** with about 16px border radius
- A **subtle box shadow** — a soft, diffused shadow that lifts the icon slightly off the canopy background
- The icon image rendered to fill the square, maintaining its aspect ratio

The icons from left to right:

1. **Zettel** (leftmost) — `zettel-icon.png`. A colorful icon on a light/white background.
2. **Zeitgeist** (center) — `zeitgeist-icon.png`. This icon has a distinctive dark/black background within the square, making it visually contrast with the other two.
3. **?** (rightmost) — `next-icon.png`. A question mark placeholder icon for the upcoming app.

All three icons are interactive — they respond to hover and touch as described below.

---

## Hover Interaction

When the user moves their cursor over an app icon, two things happen simultaneously:

### 1. Icon emphasis

The hovered icon scales up slightly — about 1.05× its normal size — gains a small tilt/rotation (about 3–5°, direction can vary per icon) — and its box shadow becomes slightly stronger/deeper. This gives tactile feedback that the icon is interactive. The scale, rotation, and shadow changes should animate smoothly (about 200–300ms ease).

### 2. Label area appears

A **label area** fades in near the top of the canopy, inside the upper portion of the dashed ellipse, above the row of icons. This label area is horizontally centered within the canopy and contains two lines of text stacked vertically:

- **App name:** Large serif text in Instrument Serif Regular, about 48–56px on desktop, black. This is the name of the hovered app.
- **App description:** Smaller italic serif text in Instrument Serif Italic, about 18–20px on desktop, dark gray or black. This sits directly below the app name with a small gap (about 4–8px).

The label area sits roughly in the upper third of the canopy ellipse — well above the icon row, but inside the visible canopy area.

### App data

| App       | Name      | Description             |
| --------- | --------- | ----------------------- |
| Zettel    | Zettel    | Minimalist Quick Notes  |
| Zeitgeist | Zeitgeist | Screen Time, Reimagined |
| ?         | ?         | Coming Soon             |

### Default state (no hover)

When no icon is hovered, the label area is either hidden (invisible) or shows an empty/neutral state. It should not display stale data from a previous hover. The transition between different app labels (hovering from one icon to another) should feel smooth — not a harsh jump. A short crossfade or quick fade-out/fade-in (about 150–200ms) works well.

### Leaving hover

When the cursor leaves an icon without entering another icon, the label area fades out smoothly (about 200ms).

---

## Touch-Friendly Fallback

On devices without hover capability (phones, tablets), the hover interaction cannot work. Instead:

- **Tapping** an icon toggles the label display for that app — a single tap shows that app's name and description in the label area.
- Tapping a **different icon** switches the label to the newly tapped app.
- Tapping the **same icon again** or tapping **outside** the icons hides the label.

This ensures mobile users can discover app names and descriptions. Use the `hover` media query (`@media (hover: hover)`) to distinguish between hover-capable and touch-only devices, or detect `pointerenter`/`pointerleave` support.

---

## Layering (back to front)

1. Cream background (`#FEFEF4`)
2. Tree image (contains trunk, canopy background, dashed border, and ASCII art — all baked into the PNG) — scaled large so canopy fills viewport
3. App icons — the three interactive squares, sitting on top of the tree image
4. Label area — app name and description text, floating above the icons in the upper canopy

---

## Mobile Behavior (viewport ≤ 768px)

- App icons shrink to about 90–100px square
- Gaps between icons reduce to about 24px
- Label text scales down: app name to about 36px, description to about 16px
- ASCII decorations scale naturally as part of the tree image
- Trunk peek remains proportional at the bottom
- Touch interactions work for label display (tap to toggle)
- All elements remain centered and nothing overflows the viewport

---

## Assets Used

| Asset          | File                 | Original Dimensions | Approximate Rendered Size (Desktop)                     |
| -------------- | -------------------- | ------------------- | ------------------------------------------------------- |
| Tree           | `tree-colored.png`   | 793×827 px          | Trunk visible at bottom; canopy fills most of the scene |
| Zettel icon    | `zettel-icon.png`    | 441×438 px          | ~130×130 px                                             |
| Zeitgeist icon | `zeitgeist-icon.png` | 441×438 px          | ~130×130 px                                             |
| Next icon      | `next-icon.png`      | 441×438 px          | ~130×130 px                                             |

## Fonts Used

- **Instrument Serif Regular** — App name text in the label area
- **Instrument Serif Italic** — App description text in the label area

## Colors

- Background: `#FEFEF4` (cream)
- App name text: black
- App description text: dark gray or black
- Icon backgrounds: white
- Icon box shadow: soft black/gray, subtle

---

## Module Structure

Implement in `src/levels/level1.ts` following the architecture from Phase 0:

- `create()` — builds and returns the entire Level 1 DOM subtree (section element with all children: tree image scaled large, icons, label area)
- `register(scrollContainer)` — sets up hover/touch event listeners on the app icons, wires up label display logic

Add Level 1 styles to `src/style.css`, appended after the Level 0 rules.

---

## Verification Checklist

After implementation, visually confirm in the browser:

1. Entire viewport is cream (`#FEFEF4`)
2. Tree image scaled large so canopy fills most of the viewport — the green blob, dashed border, and ASCII decorations are all visible as part of the image
3. Top of the pinkish trunk is visible at the bottom of the viewport (part of the same tree image)
4. Three app icons are large (~130px), horizontally centered, with gaps between them
5. Icons have white backgrounds, rounded corners, and subtle shadows
6. Zeitgeist icon (center) is visually distinct with its dark background
7. Hovering an icon: icon scales up slightly, tilts slightly, shadow deepens
8. Hovering an icon: label area appears in the upper canopy with correct app name and description
9. Moving hover between icons: label transitions smoothly between app data
10. Leaving hover: label fades out
11. On mobile (≤768px): icons shrink, text scales down, touch-tap toggles label display
12. Layer order correct: label text above icons, icons above tree image

Build check: `npx tsc --noEmit` must pass with zero errors.

---

## Files Modified

| File                   | Action                                    |
| ---------------------- | ----------------------------------------- |
| `src/style.css`        | Append Level 1 styles after Level 0 rules |
| `src/levels/level1.ts` | Replace stub with full implementation     |

No new files are created. No dependencies are added.
