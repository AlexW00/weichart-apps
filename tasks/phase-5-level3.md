# Phase 5 — Level 3: Space / Newsletter

## Overview

Build the final story destination of the landing page: a deep-space scene where the user arrives after the rocket launch transition. This level fills exactly one viewport height and contains the newsletter subscription form embedded within the scene. The mood is silent and cosmic — vast black emptiness, a star field, and a lone planet at the bottom with a rocket waiting on its launch pad.

This phase constructs the DOM for Level 3 and wires all ambient animations. No scroll driver is needed within this level — it is a static pinned scene. The Subscribe button click handler is set up here but deferred to Phase 6 for the full captcha flow.

**Prerequisites:** Phase 4 must be complete (the Level 2→3 transition fully implemented). Level 3 begins exactly where the transition ends: a fully black viewport covered in stars.

---

## Scene Description

### Background

The entire viewport is pure black (`#000000`). There is no texture, no gradient, no color other than black. The black extends edge to edge in all directions. Everything in the scene is rendered over this void.

### Star field

`stars.svg` — the same 442×79px horizontal strip used in the transition — is treated as one full-width band of stars. It is scaled so a single copy spans the viewport width, then repeated vertically until the full viewport height is covered. On a standard HD-height screen this means roughly five stacked strips. Taller and shorter screens scale the count accordingly. The strip contains a variety of star marks: small filled dots of varying sizes, plus signs (+), and asterisks (\*). All marks are white or very light, rendered over the black background.

These stars are fully visible at full opacity from the moment Level 3 is entered — there is no fade-in to perform here, as the transition already completed that reveal.

Each stacked strip of the star field drifts very slowly and continuously. The strips move at slightly different speeds — some shifting a little left, some right, some upward, some at a diagonal — so that no two bands travel at exactly the same rate. The effect is a barely perceptible parallax: the viewer feels they are floating in a three-dimensional star field, even though the motion is almost imperceptibly slow. No single strip completes a noticeable movement within a few seconds of watching. The drift loops seamlessly — strips that drift off one edge wrap around to the opposite edge so the star field never thins out or gaps. This ambient loop runs indefinitely for as long as Level 3 is visible.

### Alex as a blinking star

In the upper-right area of the viewport — roughly 85–90% of the way across from the left edge and about 5–8% down from the top — sits `star-blink.svg`, a 92×40px SVG. This is Alex's representation in this final scene: not a stickman, not a face, but a pure star shape. The SVG depicts a star or starburst form in the same white line-drawn style as the other assets.

The star-blink animates continuously. It alternates between a brighter, more opaque state and a dimmer, less opaque state on a slow, gentle rhythm — roughly one full cycle every 1.5 to 2.5 seconds. The rhythm feels organic and breathing rather than mechanical. The transition between bright and dim is smooth (a gradual ease rather than a snap). The star does not move position; only its apparent brightness or opacity changes.

The star-blink sits above all star field rows in the layering order — it is never occluded by background stars.

### Planet

`rocket-planet.svg` (484×196px) is a full planet asset, but in the actual scene only its upper portion is visible. The asset is scaled so its width fills the viewport from edge to edge, then positioned low enough that roughly the upper third of the planet remains on-screen while the lower two-thirds are cut off below the bottom edge of the viewport. What the viewer reads is not a small object sitting at the bottom, but a massive planetary surface whose bulk continues below the frame.

The visible top arc of the planet becomes the ground line for the rocket, gantry, and cat. The cut-off is important: the scene should feel like the user is standing on the very top of a large planet, not looking at a complete small planet icon.

### Rocket

`rocket.svg` (64×196px) sits on the planet surface, pointing straight up. It is centered in the viewport. The rocket is tall and narrow: about a quarter of the viewport height tall on desktop. It depicts a simple line-drawn rocket with a pointed nose cone at the top, a cylindrical body, and fins at the base. All white lines on black.

The base of the rocket — its exhaust nozzle and bottom fin area — rests on the planet surface arc. The rocket is perfectly vertical, pointing at the sky. In the default (pre-launch) state, the rocket is static and motionless.

### Launch gantry (rocket stand)

`rocket-stand.svg` (50×144px) is positioned to the left of the centered rocket, flush against it or separated by only a very small gap — it appears to be the launch support structure for the rocket. The gantry is a rectangular lattice-work tower, shorter than the rocket, rendered in the same white line-drawn style.

Critically, the text **NEWSLETTER** is baked into this SVG asset. The letters N, E, W, S, L, E, T, T, E, R are written vertically down the face of the gantry structure in the ASCII art style — part of the image, not a CSS text overlay. This is the label for the subscription form, presented as if the gantry itself is advertising the newsletter. No additional text element is needed from the application side; the SVG supplies the label.

The gantry's base rests on the planet surface at the same level as the rocket's base.

### Sleeping cat

`cat-sleeping.svg` (85×27px) is placed on the planet surface to the right of the rocket. It sits at surface level — its bottom edge aligned with the top arc of the planet, as if the cat is resting on the ground. The cat is small: rendered at or near its natural size, roughly 85px wide, making it quite petite against the rocket and planet. It faces left (toward the rocket). The illustration is a tiny, simple white line-drawn sleeping cat — eyes closed, resting pose.

The cat is static in its default state. It does not animate, move, or blink.

**Cat state change — Phase 6 hook:** When the captcha modal opens (Phase 6), the sleeping cat image is swapped for `cat-wake.svg` (78×27px) — the same position, same alignment to the surface, but the awake variant. When the modal closes without completing the flow (user cancels), the cat swaps back to the sleeping variant. This logic is wired in Phase 6; Level 3's `create()` simply renders `cat-sleeping.svg` and exposes a way for Phase 6 to swap the asset.

### Email subscription form

The email subscription form sits below the visible planet horizon, horizontally centered in the open black space near the bottom of the viewport. Because most of the planet asset is cut off below the frame, the form reads as floating beneath the visible top arc of the planet, not beneath a fully visible planet.

The form consists of two side-by-side elements with no label above them:

**Email input field:** A rectangular text input, approximately 200–250px wide on desktop. It has a white or very light border on all four sides and a transparent interior — no fill color. The placeholder text inside reads `your@email.com`. The font follows the body system font. The input accepts any text; no format validation is required.

**Subscribe button:** Immediately to the right of the input, with a small gap, sits a button labeled `Subscribe`. It has a white border and white text, with a transparent background. Approximately 100–120px wide on desktop.

The two elements are vertically aligned to their midpoints, side by side, centered in the viewport as a unit.

**Subscribe button hover state:** When the cursor enters the button, a subtle visual change signals interactivity — a brightening, border emphasis, or text underline. Consistent with the white-on-black palette.

**Subscribe button click behavior:** Captures the email input value, logs it to the console. No form submission, no network request, no validation. Then invokes the Phase 6 captcha modal opener (stubbed as a no-op at this phase).

---

## Layering (back to front)

1. Pure black background
2. Star field — stacked full-width `stars.svg` strips, drifting slowly, covering every pixel
3. Planet — full-width planet asset cropped by the viewport so only its upper portion is visible
4. Launch gantry with baked-in NEWSLETTER text — left of rocket, base on planet
5. Rocket — centered, base on planet, pointing up
6. Sleeping cat — right of rocket, surface level
7. Email form — horizontally centered, below the planet
8. Alex star-blink — upper-right quadrant, above all other layers

---

## Ambient Animations

Two animations run continuously for as long as Level 3 is the active scene:

**Star field drift:** Each full-width star strip moves independently at a slightly different speed and direction. The combined effect is a slow, living parallax. Individual strip speeds should be slow enough that the average viewer would not consciously notice movement within the first few seconds, but would feel the scene is alive after 5–10 seconds. The repeated strips wrap seamlessly at their edges.

**Star-blink pulse:** The `star-blink.svg` element cycles between bright and dim in a slow, breathing rhythm. The cycle period is approximately 1.5 to 2.5 seconds. The easing is smooth in both directions — a gentle sine-like curve, not a linear ramp or snap. It loops indefinitely.

Both animations start when `register()` is called.

---

## Mobile Behavior (viewport ≤ 768px)

- The planet still fills the full viewport width, with only its upper portion visible; the rest remains cut off below the screen
- The rocket and gantry scale proportionally, remaining anchored to the planet surface
- The sleeping cat scales proportionally and stays on the planet surface to the right of the rocket
- The email form stacks vertically on very narrow screens: input above button, both centered horizontally
- The star-blink remains in the upper-right quadrant at any viewport size
- The star strips repeat vertically to fill the mobile screen fully — no gaps at any edge
- The Subscribe button is at least 44px tall as a tap target

---

## Assets Used

| Asset               | Dimensions | Role in Scene                                                                                         |
| ------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `stars.svg`         | 442×79 px  | One full-width star strip, repeated vertically to fill the black background                           |
| `star-blink.svg`    | 92×40 px   | Alex as a blinking star, upper-right area, pulsing continuously                                       |
| `rocket-planet.svg` | 484×196 px | Full planet asset scaled to viewport width, with only the upper portion visible above the bottom edge |
| `rocket.svg`        | 64×196 px  | Rocket centered on the visible planet surface, pointing up                                            |
| `rocket-stand.svg`  | 50×144 px  | Launch gantry with NEWSLETTER text baked into the SVG, left of rocket                                 |
| `cat-sleeping.svg`  | 85×27 px   | Sleeping cat on planet surface, right of rocket (default state)                                       |
| `cat-wake.svg`      | 78×27 px   | Awake cat variant — swapped in when captcha modal opens (Phase 6)                                     |

---

## Fonts Used

No Instrument Serif in this level. The email input placeholder and the Subscribe button label use the page's body system font stack. The NEWSLETTER text is part of the `rocket-stand.svg` image and requires no font declaration.

---

## Module Structure

Implement in `src/levels/level3.ts`:

- `create()` — builds and returns the Level 3 DOM subtree: the full-black section container; the stacked full-width star strips; the full-width planet positioned low so only its upper portion is visible; the gantry to the left of a centered rocket on the planet surface; the sleeping cat to the right of the rocket; the email form in the black space below the visible horizon; and the star-blink element in the upper-right. The cat image element should be accessible so Phase 6 can swap the `src` attribute to toggle between sleeping and awake.
- `register()` — starts the two ambient animation loops (star field drift and star-blink pulse) and attaches the Subscribe button click handler (log email to console, call Phase 6 opener stub).

Add Level 3 styles to `src/style.css`, appended after the transition styles.

---

## Verification Checklist

After implementation, verify in the browser:

1. The viewport is entirely black — no other background color anywhere
2. The star field covers the entire viewport with no gaps; stars are white dots, plus signs, and asterisks across the full area, arranged as stacked full-width strips
3. The star strips drift slowly and continuously — watching for 10 seconds reveals gentle independent movement; the drift loops without any visible seam or jump
4. The planet fills the viewport width, but only its upper third or so is visible; the bulk of the asset is cut off below the bottom edge
5. The rocket sits centered on the visible planet surface, pointing straight up; about one-quarter of viewport height tall
6. The launch gantry is immediately to the left of the rocket, also resting on the planet surface; the NEWSLETTER lettering is visible running vertically down the gantry as part of the SVG
7. The sleeping cat sits on the planet surface to the right of the rocket — small, white, facing left
8. The email input and Subscribe button are visible below the visible planet horizon, horizontally centered in the black space, with white borders against black; placeholder reads `your@email.com`
9. Hovering the Subscribe button shows a subtle but clear hover state change
10. Clicking Subscribe logs the email input value to the browser console; no other action occurs
11. The star-blink SVG is visible in the upper-right area and pulses slowly between bright and dim states in a smooth, looping rhythm
12. On a narrow mobile viewport: the planet still spans edge to edge with most of it cut off below frame; form stacks vertically; all elements remain within viewport bounds; star strips cover the full screen

Build check: `npx tsc --noEmit` passes with zero errors.

---

## Files Modified

| File                   | Action                                        |
| ---------------------- | --------------------------------------------- |
| `src/style.css`        | Append Level 3 styles after transition styles |
| `src/levels/level3.ts` | Replace stub with full implementation         |

No new files created. No new dependencies added.
