# Phase 4 — Level 2→3 Transition: Rocket Launch

## Overview

Build the most visually dramatic moment on the entire page: a cinematic scroll-driven sequence where the garden tree transforms into a rocket and launches into space. This transition bridges Level 2 (the warm, earthy garden scene) and Level 3 (the cold, dark cosmos). It is its own scroll section — roughly two to three viewport heights tall — giving the animation enough room to play out at a measured pace tied to scroll position.

This phase constructs the DOM for the transition section and wires all scroll-driven animation via GSAP ScrollTrigger, following the same `create()` / `register()` module pattern used in previous levels.

**Prerequisites:** Phase 3 must be complete (Level 2 fully implemented).

---

## Scene Description

When the user scrolls past the bottom of Level 2, they enter this transition section. The viewport is pinned — the view does not scroll away — and instead the scroll position drives a GSAP timeline that plays the launch sequence forward as the user scrolls down, and backward if they scroll back up.

The transition begins with the same garden scene the user just left: the tree trunk centered, Alex standing to its right, the warm cream background. As the user continues scrolling, two major parallel story threads unfold simultaneously.

---

### Thread 1: The Tree Becomes a Rocket

The tree lifts off. The entire `tree-colored.png` image — trunk, canopy, ASCII decorations and all — begins rising smoothly upward from the center of the viewport. It moves steadily upward as the user scrolls, traveling all the way off the top edge of the viewport by the end of the transition.

Because the tree is tall and narrow in its trunk section, and because the canopy disappears above the viewport edge early in the animation, what the viewer sees for most of the transition is just the trunk: a tall pinkish-salmon column shooting upward. This is the visual metaphor — a rocket body ascending.

**Rocket thrust:** At the moment the tree begins moving — the very first beat of the launch — `rocket-thrust.svg` materializes below the tree. The thrust asset is a tall, narrow flame shape — its width matches the trunk of the tree, which occupies roughly the center fifth of the tree image (approximately 1/5 of the 793px asset width, so around 160px). It is not wide or spreading; it is a tight, focused column of exhaust aligned directly under the trunk. Despite its narrow width, it is roughly a full viewport height tall. It depicts colorful rocket exhaust: cool blue at the very top (where it meets the base of the trunk), blending down through purple and orange into yellow and red at the pointed bottom tip. Visually it reads unmistakably as rocket exhaust fire.

The thrust appears centered horizontally directly beneath the trunk, almost kissing the base of the tree. As the tree rises, the thrust rises with it, always below the trunk base — as though attached to the bottom of the rocket. The thrust does not appear before the launch moment; before that point it is absent entirely.

By the midpoint of the transition the tree's entire vertical reach has moved above the viewport, and only the thrust flame is still partially visible, shooting upward out of frame. By the end, the tree and its thrust have both disappeared above the top edge of the screen.

---

### Thread 2: Alex Flies Away

The moment the launch begins, Alex detaches from the scene.

For this transition, Alex appears in a different pose: `human-base-handsup.svg` — the same small black line-drawn stickman, but with arms raised overhead in a surprised or exhilarated gesture. `face.png` is still attached at the top of the stickman body, exactly as in Level 2 — a small circular face photo sitting atop the hands-up silhouette.

Alex rockets toward the upper-right corner of the viewport. As he travels, three things happen simultaneously:

- **He moves:** His position traces a path toward the top-right quadrant of the viewport, exiting through the upper-right area by the end of the transition.
- **He shrinks:** He scales down as he moves, becoming progressively smaller as if receding into the distance — by the time he exits the scene he is quite small.
- **He rotates:** He spins slightly as he tumbles through the air, adding to the chaotic, thrown-upward feeling.

The `watering-can-colored.png` accompanies Alex on this journey. It stays near him — offset by a short distance in a slightly different direction — and undergoes the same shrinking and rotating motion. The watering can and the stickman appear to tumble through the air together, flung off by the force of the launch.

In the mid-transition design reference, Alex has already shrunk noticeably and is visible in the upper-right quadrant of the viewport, hands raised, watering can tumbling alongside him.

---

### Background Color Transition

Throughout the transition, the viewport background smoothly fades from the warm cream of the garden to the pure black of deep space.

- At the very start of the transition section: the background is fully cream (`#FEFEF4`).
- At the very end: the background is fully black (`#000000`).

The change is continuous and linear across the scroll distance — no sudden jump, no step. As the user scrolls, the background darkens progressively. By the halfway point the background is a neutral warm gray; by the end it is completely black.

---

### Stars Fading In

As the background darkens, stars emerge. `stars.svg` is a single horizontal strip — a band of varied star marks (dots, plus signs, asterisks, small star shapes) arranged in a row against a transparent background.

This strip runs the full width of the viewport and repeats vertically — stacking multiple copies of the strip on top of each other until the full viewport height is covered. On a standard HD monitor (~1080px tall), about five repetitions of the strip fill the screen. On taller or shorter viewports the count scales accordingly. The strip does not tile horizontally; it is one strip wide, scaled to span the viewport width.

The stars are white on transparent, which means they only become visible against the darkening background. They fade in progressively, in sync with the background darkening — invisible at the cream start, faintly visible in the mid-dark gray phase, fully brilliant white against full black at the end.

Once fully in space (background fully black), the star rows drift very slowly. Each row of the tiled star strip moves at a slightly different speed and direction — some drift gently upward, some sideways, some slower, some a touch faster. This creates a subtle parallax depth, as though the viewer is floating in a star field. The motion is barely perceptible — just enough to feel alive, not enough to feel busy. Each complete drift cycle takes many seconds.

---

### Screen Shake

At the precise moment the thrust ignites — the very start of the launch beat — the entire viewport shakes. This is a rapid, tight left-right jitter: the whole scene snaps a few pixels left, then right, then left, several times in rapid succession, lasting roughly half a second to one second. The effect evokes the ground-shaking rumble of a real rocket launch. After the shake, the scene is still and the smooth upward animation continues.

The shake fires exactly once per scroll-through of this section. If the user scrolls back above the launch point and then down again, it fires again.

---

### Haptic Feedback

At the same moment as the screen shake, if the user's device supports the Vibration API (`navigator.vibrate()`), a short vibration pattern is triggered — something in the range of 100 milliseconds. This tactile pulse reinforces the launch rumble on mobile devices. If the API is not supported (most desktop browsers), nothing happens — this is purely a progressive enhancement.

---

### Scroll Control

The entire transition is scroll-driven and pinned:

- The viewport is pinned at the top of the transition section while the user scrolls through it.
- The scroll distance through this section (two to three viewport heights of scrollable distance) maps directly to the timeline's progress — scrolling down advances the animation; scrolling back up reverses it.
- When the user has scrolled fully through the section, the pin releases and Level 3 begins.

The screen shake and haptic are one-time events triggered at a specific scroll progress point (the launch moment) — they are not scrubbed or reversed with scroll direction.

---

## Layering (back to front)

1. Black/cream background (transitions between the two)
2. Star strip tiles (fill the full background, multiple rows, fading in)
3. Rocket thrust flame (beneath the tree, rising with it)
4. Tree (rising upward through the scene)
5. Watering can (tumbling to upper-right, shrinking)
6. Alex stickman (hands-up pose, tumbling to upper-right, shrinking)

---

## Mobile Behavior (viewport ≤ 768px)

- The tree rises at the same relative rate; visual impact is similar at smaller sizes
- Alex and the watering can still fly toward the upper-right corner, scaling down appropriately
- The thrust flame is narrower on small screens — it should still feel centered and prominent, but scale to fit without overflowing the viewport width
- Star tiling covers the full screen regardless of device width
- Screen shake magnitude may be reduced slightly on mobile to avoid disorienting the user; haptic feedback is most useful on mobile and remains active
- All elements remain within viewport bounds at their starting positions; nothing overflows before launch

---

## Assets Used

| Asset                      | Dimensions | Role in Transition                                                             |
| -------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `tree-colored.png`         | 793×827 px | The rising rocket body — entire tree image moves upward and off screen         |
| `rocket-thrust.svg`        | 472×900 px | Rocket exhaust flames, appearing beneath the tree at launch and rising with it |
| `human-base-handsup.svg`   | 22×53 px   | Alex's silhouette with arms raised — flies to upper-right, shrinks and rotates |
| `watering-can-colored.png` | 390×274 px | Flies with Alex, tumbling toward upper-right                                   |
| `stars.svg`                | 442×79 px  | Star strip, tiled across the full viewport, fading in as background darkens    |

`face.png` **is used** — attached to the top of `human-base-handsup.svg` as in Level 2.

---

## Module Structure

Implement in `src/levels/transition23.ts`:

- `create()` — builds and returns the transition section's DOM subtree: the section container (sized to the full scroll height of the transition), the tree image at its Level 2 starting position, the thrust asset hidden at its starting position beneath the tree, the hands-up stickman and watering can at their Level 2 starting positions, and the star tile layer covering the full section.
- `register(scrollContainer)` — wires all animations to a GSAP ScrollTrigger: tree rise, thrust appearance, Alex's fly-away path (position + scale + rotation), background color interpolation, star fade-in. Separately sets up the one-time screen shake (and haptic call) triggered at the launch scroll progress point. Sets up the star drift ambient loop once the background is fully black.

Add transition styles to `src/style.css`, appended after the Level 2 rules.

---

## Verification Checklist

After implementation, verify in the browser by scrolling slowly through the transition section:

1. At the very start of the section, the scene looks like Level 2 end-state — tree trunk centered, cream background, Alex to the right in hands-up pose with watering can (no face photo)
2. The first scroll movement causes the tree to begin rising upward smoothly
3. At the launch beat, the rocket thrust appears beneath the tree — a tall colorful flame centered under the trunk
4. Alex and watering can simultaneously begin moving toward the upper-right, shrinking and rotating as they go
5. The background begins darkening progressively from cream toward black
6. Stars are invisible against the cream/light background; they become faintly visible as the background darkens, and fully bright white once the background is near-black
7. The screen shakes briefly and sharply at the launch moment — a left-right jitter lasting about half a second
8. On a supported mobile device, a short haptic vibration fires at the same moment as the shake
9. Scrolling back upward reverses the tree descent, thrust disappearance, Alex return, and background re-brightening — the shake does not re-fire on reverse scroll, only on forward scroll past the launch point
10. By the end of the transition, the scene is fully black, the tree and thrust are gone above the viewport, Alex is tiny or just-exited in the upper-right, and the star field is fully visible with a gentle ambient drift
11. The pin releases at the end of the transition section and the Level 3 scene begins
12. Star drift motion is barely perceptible — floating and calm, not distracting
13. On mobile (≤768px): all elements scale appropriately, star tiles fill the screen edge to edge, thrust does not overflow viewport width, shake is present but not jarring
14. Build check: `npx tsc --noEmit` passes with zero errors

---

## Files Modified

| File                         | Action                                               |
| ---------------------------- | ---------------------------------------------------- |
| `src/style.css`              | Append transition section styles after Level 2 rules |
| `src/levels/transition23.ts` | Replace stub with full implementation                |

No new files created. No new dependencies added.
