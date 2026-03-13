# Phase 3 — Level 2: Alex Watering the Tree

## Overview

Build the third screen of the landing page: the base of the tree where a stick-figure character named Alex stands watering the trunk. This level fills exactly one viewport height. The visitor has scrolled down from the canopy into a warm, personal garden scene — it introduces the creator behind the apps.

The scene contains the tree trunk dominating the center, Alex (a stick figure with a real photo head) to the right holding an animated watering can, a speech bubble with a randomly chosen typed-out quote, a hand-drawn arrow labeling "This is Alex," a clickable signpost on the left, and decorative flowers.

After this phase, `npm run dev` should show a complete, visually correct Level 2 matching `designs/level-2.png`. No scroll transitions between levels yet — those are wired in Phase 7.

**Prerequisites:** Phase 2 must be complete (Level 1 fully implemented).

---

## Scene Description

### Background

The entire viewport is filled with the warm cream color (`#FEFEF4`) — the same background as Level 1. This is the "garden" area below the canopy.

### The tree (trunk view)

The tree image (`tree-colored.png`, 793×827px) is still centered horizontally. In this level, the perspective has shifted downward — the viewer is now looking at the base of the tree rather than the canopy.

What's visible:

- **Trunk:** The wide, pinkish/salmon trunk dominates the center of the viewport. It takes up roughly the middle third of the viewport width. The trunk broadens slightly as it descends, giving a natural tapering feel.
- **Canopy peek:** The very bottom edge of the canopy is visible at the top of the viewport, or partially clipped above it. The canopy's green blob, dashed border, and ASCII decorations are all part of the `tree-colored.png` image — they peek into view at the top naturally as part of the tree asset.

The tree is the same image as Levels 0 and 1 — just positioned so the trunk portion is in view. Phase 7 will unify the scroll positioning; for now, render the trunk-focused view directly.

### Alex (stick figure, right side of trunk)

On the right side of the trunk, slightly below the vertical center of the viewport, stands Alex — a composite stick-figure character built from two image assets plus a CSS-animated accessory.

Alex is positioned at roughly 55–65% from the left edge of the viewport — clearly to the right of the tree trunk but not pushed to the far edge.

#### Head

Alex's head is `face.png` (900×1682px), displayed as-is at about 60–70px wide. The image shows a man's face with a transparent background. It sits directly on top of the stickman body, aligned to the neck area.

#### Body

The body is `human-base.svg` (22×53px), rendered at about 80–100px tall. This is a simple black line-drawn stickman — just straight lines for the torso, arms, and legs. The SVG has no head — the head is supplied by the face photo positioned directly above it.

The head and body together form one character. The head's bottom edge should sit flush against or just overlapping the top of the body SVG to look like a single figure.

#### Watering can

`watering-can-colored.png` (390×274px) is rendered at about 60–70px wide. The watering can is positioned at Alex's hand area — to the left of the stickman body (toward the tree trunk), roughly at arm level.

The can is tilted slightly as if pouring water onto the tree. A gentle rocking animation plays continuously — the can rotates back and forth by a few degrees (roughly ±3–5°) over about 2 seconds per cycle. This creates the impression that Alex is actively watering.

#### Water drops

Small procedural droplets fall from the spout of the watering can toward the tree trunk. These are purely decorative — no image asset is used. They are small colored dots or short dashes (about 4–6px) that animate downward, appearing near the spout and fading out as they fall. Two or three drops are visible at any moment, staggered in timing so they cascade naturally. The animation loops continuously.

### "This is Alex" arrow label

Above and to the right of Alex's head, a hand-drawn arrow points downward toward him with explanatory text.

The arrow is `arrow.svg` (104×116px), rendered at about 80–90px. It's a hand-drawn downward-curving line that aims toward Alex. The arrow is positioned so its point is near Alex's head and its tail curves upward and to the right.

Near the top of the arrow, a text overlay reads **"This is Alex"** in italic serif font (Instrument Serif Italic, about 20px). The text is a CSS element positioned relative to the arrow — it is not drawn into the SVG itself.

**Entry animation:** When this level becomes active (when `register()` is called), the arrow and "This is Alex" text animate in together — they fade in and slide down from slightly above their final position, over about 0.5 seconds. Before this animation fires, the arrow and text are invisible.

### Speech bubble (right of Alex)

To the right of Alex, slightly above the vertical center of the viewport, is a speech bubble. `speechbubble.png` (554×225px) is rendered at about 250–280px wide. The image has a hand-drawn dashed border style, giving it the same playful, sketched aesthetic as the rest of the page.

#### Typing animation

Inside the speech bubble, a randomly selected quote types in letter by letter after the user arrives at this level. The typing cadence is about 40–50ms per character — similar to the Level 0 subtitle typing.

**Quote pool (10 lines):**

1. "I make apps because sticky notes kept falling off my monitor."
2. "Currently powered by mass amounts of coffee and mass amounts of mass."
3. "The tree is a metaphor. Don't overthink it."
4. "Fun fact: I once debugged a CSS issue for 6 hours. It was a typo."
5. "Apps should be simple. Unlike my Spotify playlists."
6. "I promise the newsletter won't be boring. Probably."
7. "Welcome to my garden. No, you can't pick the apps."
8. "This website was built with love and mild frustration."
9. "If you're reading this, you're already my favorite visitor."
10. "I'm not a robot. But the captcha might disagree."

One quote is chosen randomly each time Level 2 becomes active. The quote text is rendered in italic serif font (Instrument Serif Italic, about 16–18px) inside the speech bubble, with enough padding to sit comfortably within the bubble's drawn border.

#### Floating animation

The speech bubble and the "This is Alex" arrow label share a gentle floating animation — a subtle vertical bobbing motion. They drift up and down by about 3–5px over a 3–4 second cycle. This runs continuously and gives the scene a playful, breathing quality. The bobbing of the speech bubble and the arrow should feel coordinated (moving together or in near-sync) so the right side of the scene feels cohesive.

### Signpost (left side)

On the far left side of the viewport, in the lower portion of the scene, stands a signpost. `signpost.svg` (92×157px) is rendered at about 70–90px wide. It's a simple line-drawn post with a rectangular sign face at the top.

The sign face contains a `<` symbol baked into the SVG — no CSS text overlay is needed.

**Interactions:**

- The signpost has `cursor: pointer` to indicate it's clickable.
- **Hover:** The signpost image gains a slight brightness increase (e.g., `filter: brightness(1.4)`) to signal interactivity.
- **Click/tap:** Opens `https://alexanderweichart.de` in a new tab (`target="_blank"`, with `rel="noopener noreferrer"`).

### Flowers (bottom-left, near signpost)

Near the base of the signpost, in the bottom-left area of the viewport, are two or three small decorative flowers. Each is an instance of `flower.svg` (22×53px), rendered at about 30–40px tall. They are placed at slightly varied positions around the signpost's base — not perfectly aligned, giving a natural garden feel.

The flowers are static — no animation, no interaction. They are purely decorative filler to complete the garden composition in the bottom-left corner.

---

## Layering (back to front)

1. Cream background (`#FEFEF4`)
2. Tree trunk (center of viewport)
3. Canopy peeking from the top edge
4. Flowers (bottom-left, near signpost base)
5. Signpost (left side, above flowers)
6. Alex's body (stickman SVG, right of trunk)
7. Alex's head (face photo, as-is, on top of body)
8. Watering can (at Alex's hand level, tilted, animated)
9. Water drops (falling from the can's spout)
10. Arrow + "This is Alex" text label (above Alex)
11. Speech bubble with typed quote (right of Alex, frontmost)

---

## Mobile Behavior (viewport ≤ 768px)

- Alex, the watering can, and the arrow label scale down proportionally — the stick figure remains recognizable but smaller
- The speech bubble shrinks in width (about 180–200px) and may shift to sit closer to Alex or slightly below him on very narrow screens, so it doesn't overflow the viewport
- The signpost moves with the left edge of the viewport, remaining anchored to the far left
- The arrow label and "This is Alex" text reduce in size (arrow about 60px, text about 16px)
- Flowers scale proportionally with the signpost
- The signpost is tap-friendly — tapping navigates to the external link
- All elements remain within the viewport bounds; nothing overflows horizontally

---

## Assets Used

| Asset         | File                       | Original Dimensions | Approximate Rendered Size (Desktop)                        |
| ------------- | -------------------------- | ------------------- | ---------------------------------------------------------- |
| Tree          | `tree-colored.png`         | 793×827 px          | Trunk visible center; canopy peeking at top                |
| Face          | `face.png`                 | 900×1682 px         | ~60–70px wide, displayed as-is with transparent background |
| Stickman body | `human-base.svg`           | 22×53 px            | ~90px tall                                                 |
| Watering can  | `watering-can-colored.png` | 390×274 px          | ~65px wide                                                 |
| Arrow         | `arrow.svg`                | 104×116 px          | ~85px                                                      |
| Speech bubble | `speechbubble.png`         | 554×225 px          | ~260px wide                                                |
| Signpost      | `signpost.svg`             | 92×157 px           | ~80px wide                                                 |
| Flower        | `flower.svg`               | 22×53 px            | ~35px tall (2–3 instances)                                 |

## Fonts Used

- **Instrument Serif Italic** — "This is Alex" label text, speech bubble quote text

## Colors

- Background: `#FEFEF4` (cream)
- Text: black or dark gray
- Stickman lines: black (from the SVG)
- Watering can: blue/colored (from the asset)
- Water drops: blue or light blue
- Signpost and flowers: black line-drawn (from the SVGs)

---

## Module Structure

Implement in `src/levels/level2.ts` following the architecture from Phase 0:

- `create()` — builds and returns the entire Level 2 DOM subtree (section element with all children: tree trunk, canopy peek, Alex figure composed of head + body + watering can, water drops container, arrow with label text, speech bubble with text area, signpost (clickable, `<` baked into SVG), flowers)
- `register(scrollContainer)` — starts the entry animations (arrow + label fade-in/slide), begins the speech bubble typing animation with a randomly chosen quote, starts the continuous floating motion on the speech bubble and arrow, starts the watering can rocking animation and water drop cascade, sets up click/hover listeners on the signpost

Add Level 2 styles to `src/style.css`, appended after the Level 1 rules.

---

## Verification Checklist

After implementation, visually confirm in the browser:

1. Entire viewport is cream (`#FEFEF4`)
2. Tree trunk is visible and centered, filling the middle area of the viewport
3. Bottom edge of the canopy (with dashed border and decorations) peeks from the top
4. Alex stands to the right of the trunk — face photo head on top of stickman body, visually one figure
5. Watering can is at Alex's hand level, tilted toward the trunk, rocking gently
6. Small water drops cascade from the watering can spout downward
7. Hand-drawn arrow above Alex points down toward him, with "This is Alex" text in italic serif
8. Arrow and label animate in on level activation (fade + slide down)
9. Speech bubble is visible to the right of Alex with a randomly selected quote typing in letter-by-letter
10. Speech bubble and arrow label float gently up and down in a continuous bobbing motion
11. Signpost is visible on the far left with the `<` symbol on its sign face (baked into the SVG — no text overlay)
12. Hovering the signpost brightens the image; clicking opens `https://alexanderweichart.de` in a new tab
13. Two or three small flowers sit near the base of the signpost
14. Layer order correct: speech bubble and arrow in front, Alex in front of trunk, signpost and flowers in front of background
15. On mobile (≤768px): all elements scale down, speech bubble repositions for narrow screens, signpost stays left-anchored, nothing overflows

Build check: `npx tsc --noEmit` must pass with zero errors.

---

## Files Modified

| File                   | Action                                    |
| ---------------------- | ----------------------------------------- |
| `src/style.css`        | Append Level 2 styles after Level 1 rules |
| `src/levels/level2.ts` | Replace stub with full implementation     |

No new files are created. No dependencies are added.
