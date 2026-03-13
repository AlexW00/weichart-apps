# Phase 6 — Fake Captcha + Launch Sequence

## Overview

Build the interactive finale of the newsletter scene: clicking `Subscribe` opens a fake captcha modal, the cat wakes up, and pressing the forbidden red button triggers the launch countdown and rocket liftoff. This phase covers the entire behavior chain from modal open to the finished post-launch state.

This is not a real captcha and not a real form submission flow. It is a theatrical interaction layered on top of Level 3. The goal is to make the user feel like they have triggered a tiny absurd ceremony before the rocket leaves.

**Prerequisites:** Phase 5 must be complete. The Level 3 scene already exists with the black background, vertically repeated star strips, full-width cropped planet, centered rocket, left-side gantry, sleeping cat, and email form.

---

## Interaction Sequence

The complete flow has four states:

1. Default Level 3 scene
2. Captcha modal open
3. Forbidden-button success path: loading text, countdown, launch
4. Post-launch finished state

The `Cancel` path returns from state 2 back to state 1 without changing anything else.

---

## State 1: Default Level 3 Scene

This is the untouched newsletter scene from Phase 5:

- black background
- stacked full-width star strips
- blinking star in the upper-right
- full-width planet with only its upper portion visible
- centered rocket
- launch gantry to the left with the baked-in vertical `NEWSLETTER` lettering
- sleeping cat to the right
- email field and `Subscribe` button near the bottom

The rocket is idle. The cat is sleeping. The form is interactive.

Clicking `Subscribe` opens the fake captcha modal centered over the scene.

---

## State 2: Captcha Modal Open

### Modal placement and backdrop

A centered overlay appears above the Level 3 scene. The background scene remains visible around it; the modal does not replace the space scene. The popup sits roughly in the center of the viewport and is large enough to dominate the scene without filling the whole screen.

Use `capcha.png` (959×974px) as the visual frame of the popup. This asset already provides the overall window styling: blue header band, white body, and the general old-desktop-dialog look. The popup should preserve that look rather than recreating it with custom layout.

The rocket, gantry, cat, and form remain visible behind the modal where they are not covered.

### Header and message

The modal header reads as part of the asset: `Prove you're human:` followed by the larger message `Do NOT press this button!` The tone is mock-serious and slightly playful.

No extra heading needs to be built outside the frame image unless required for accessibility.

### Forbidden red button

At the center of the popup body sits the red forbidden button. This button is image-based and has three visual states:

- `button.png` — default state
- `button-hovered.png` — hover state
- `button-pressed.png` — pressed state

The button is horizontally centered inside the modal. It should feel visually prominent and slightly absurd: a large red rectangle sitting alone in a mostly empty dialog body.

Because the three button assets have different heights, they must all share the same bottom alignment when swapped. The bottom edge should stay fixed in place so the button appears grounded on the same baseline and does not visibly jump up and down between default, hover, and pressed states.

The state changes should exactly follow pointer interaction:

- default when idle
- hovered when the pointer is over it
- pressed during the active click/press moment

### Cancel button

A `Cancel` control appears in the lower-right area of the popup, matching the visual style shown in the design reference. It should read like a small secondary action attached to the dialog chrome rather than a strong call to action.

Clicking `Cancel` closes the popup immediately and returns the entire scene to the default Level 3 state.

### Cat reaction while modal is open

The cat **remains sleeping** while the popup is first opened. The sleeping cat is what is visible in the modal design reference.

The cat wakes up (swaps from `cat-sleeping.svg` to `cat-wake.svg`) when the user **hovers** the forbidden red button. The hover is enough — the cat reacts to the threat. The cat stays awake from that moment onward: through the press, loading state, countdown, and rocket launch.

If the popup closes via `Cancel` (and the user never hovered the button), the cat remains sleeping — no state change. If the cat already woke due to hover, it returns to sleeping when Cancel is clicked.

---

## State 3: Forbidden Button Path

### Press moment

When the user presses the forbidden red button, its pressed-state asset appears momentarily to confirm the click.

Immediately after that, the modal enters a short loading state.

### Loading state

The large red button disappears or is visually replaced by centered loading text inside the dialog body:

`Sigh... I knew it...`

This text remains on screen for about 3 seconds. The scene behind the modal does not yet launch during this pause. The cat remains awake.

The tone here should feel resigned and comedic, as if the page expected the user to do exactly the forbidden thing.

### Modal closes and countdown begins

After the loading pause, the popup disappears. The space scene is fully visible again.

A countdown begins around the rocket using large standalone numbers:

- `3`
- `2`
- `1`

These numbers appear one after another at different positions around the rocket rather than in one fixed label. They should feel slightly chaotic and theatrical, like improvised mission-control graphics floating over the scene. Keep them large and clearly legible against the black background.

The cat remains awake throughout the countdown.

### Scroll lock

From the moment the countdown starts until the rocket has fully exited the screen, scrolling is locked. The user should not be able to scrub away or interrupt the launch sequence with wheel, trackpad, touch scroll, or keyboard scrolling.

This lock is temporary and only exists during the launch ceremony.

### Rocket launch

At the end of the countdown, the rocket launches straight upward from its centered position.

The launch should visually match the post-subscribe design state:

- `rocket-thrust.svg` appears tightly beneath the rocket body
- the flame matches the rocket body's width rather than spreading wider than the rocket
- the flame starts relatively short at the first ignition beat, then stretches taller as the rocket rises until it reaches its maximum height during ascent
- because it is an SVG, this height growth should read as a clean scale-up rather than a swap to a different flame asset
- the flame remains aligned to the rocket centerline throughout
- the rocket rises straight up rather than drifting diagonally
- the gantry stays behind on the planet surface
- the cat remains awake during liftoff
- the stars and blinking star stay in place as background ambience

The rocket should leave the viewport through the top. The thrust rises with it and disappears with it.

### Screen shake

At liftoff, the scene shakes briefly. This is the same tight, energetic launch shake used in the transition section: a short left-right rumble that adds physical impact to the launch moment.

The shake happens once per successful forbidden-button flow.

---

## State 4: Post-Launch Finished State

After the rocket has fully exited the viewport, the scene settles into its final version.

### What remains visible

- black space background
- vertically repeated star strips
- blinking star in the upper-right
- full-width cropped planet
- launch gantry still standing on the planet surface
- cat returned to the sleeping variant
- email input and `Subscribe` button still visible near the bottom

### What is gone

- the rocket
- the launch thrust
- the countdown numbers
- the modal

### Form state after launch

The email field and `Subscribe` button stay visible, but both are disabled. They should read as spent, completed, or unavailable after the ceremony has already happened. The user can no longer trigger the popup a second time from this page state.

The disabled appearance should be visibly distinct from the normal active form, while still preserving the minimalist white-on-black look.

---

## Behavioral Rules

### Subscribe button

- In the default state, clicking `Subscribe` opens the modal
- After the successful launch flow has completed, `Subscribe` is disabled permanently for the current page session

### Cancel path

If the user clicks `Cancel` while the modal is open:

- the modal closes immediately
- the cat returns to sleeping
- the rocket stays on the planet
- the form remains enabled
- no countdown starts
- no launch occurs

### Successful forbidden-button path

If the user presses the red button:

- modal shows pressed state
- modal shows `Sigh... I knew it...` for about 3 seconds
- modal disappears
- countdown runs
- scroll locks during countdown and launch
- rocket launches upward with thrust
- screen shake plays at liftoff
- rocket leaves the scene
- cat eventually returns to sleeping
- form becomes disabled

This path should only be allowed once per page session unless the page is reloaded.

---

## Layering During Modal State

1. Existing Level 3 scene
2. Modal backdrop/overlay layer
3. `capcha.png` frame
4. Forbidden red button or loading text inside the popup
5. `Cancel` control

## Layering During Countdown / Launch

1. Existing Level 3 background and stars
2. Planet
3. Gantry
4. Rocket thrust
5. Rocket
6. Awake cat
7. Countdown numbers
8. Form
9. Blinking star

---

## Mobile Behavior (viewport ≤ 768px)

- The popup scales down to fit comfortably inside the viewport with visible margins on all sides
- The forbidden button remains large enough to tap easily
- The `Cancel` control remains clearly accessible in the lower-right area of the popup
- The countdown numbers remain large and readable without covering the rocket entirely
- Scroll lock must also block touch scrolling during countdown and launch
- The rocket still launches straight up from the centered position on the planet
- Post-launch disabled form remains legible and aligned within the narrow screen layout

---

## Assets Used

| Asset                | Dimensions | Role in Flow                                                |
| -------------------- | ---------- | ----------------------------------------------------------- |
| `capcha.png`         | 959×974 px | Popup frame for the fake captcha dialog                     |
| `button.png`         | 558×245 px | Default state of the forbidden red button                   |
| `button-hovered.png` | 549×165 px | Hover state of the forbidden red button                     |
| `button-pressed.png` | 549×93 px  | Pressed state of the forbidden red button                   |
| `cat-wake.svg`       | 78×27 px   | Cat awake from forbidden-button press through end of launch  |
| `cat-sleeping.svg`   | 85×27 px   | Cat sleeping in default and finished states                 |
| `rocket.svg`         | 64×196 px  | Rocket launching upward during the sequence                 |
| `rocket-thrust.svg`  | 472×900 px | Narrow thrust flame aligned under the rocket during liftoff |

---

## Module Structure

Implement in `src/captcha.ts`:

- expose an `openCaptcha()` entry point that Phase 5 can call from the `Subscribe` button
- render and manage the popup, red button states, and cancel behavior
- coordinate cat sleeping/awake swaps with Level 3
- run the loading pause, countdown, scroll lock, launch animation, and post-launch state
- mark the newsletter form as disabled after a successful launch

If needed, keep the visual scene elements in `src/levels/level3.ts` and let `captcha.ts` orchestrate their state changes rather than duplicating DOM.

Add modal and launch-specific styles to `src/style.css`, appended after the Level 3 rules.

---

## Verification Checklist

After implementation, verify in the browser:

1. Clicking `Subscribe` opens a centered popup matching the design, using `capcha.png` as the frame
2. The popup appears above the existing space scene rather than replacing it
3. The cat remains sleeping when the popup first opens
4. The red button shows its default, hover, and pressed image states correctly; **hovering the button wakes the cat** (swaps to `cat-wake.svg`)
5. The three red button assets stay bottom-aligned when switching states, with no vertical jump
6. Clicking `Cancel` closes the popup and returns the cat to sleeping (whether or not hover triggered the wake)
7. Clicking the red button shows `Sigh... I knew it...` for about 3 seconds
8. After the loading text, the popup disappears and a visible `3`, `2`, `1` countdown appears at changing positions around the rocket
9. During countdown and launch, scrolling is locked and cannot interrupt the sequence
10. At liftoff, a brief screen shake plays and the rocket launches straight upward with thrust directly beneath it
11. The thrust begins short, stays the same width as the rocket body, and grows taller as the rocket climbs
12. The gantry remains in place while the rocket leaves the viewport
13. The cat stays awake during countdown and launch, then returns to sleeping once the rocket is gone
14. After launch, the rocket and thrust are no longer visible, the popup is gone, and the final scene matches the finished design state
15. After launch, the email input and `Subscribe` button are still visible but disabled
16. The popup scales correctly on mobile and remains usable with touch input
17. Build check: `npx tsc --noEmit` passes with zero errors

---

## Files Modified

| File                   | Action                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `src/style.css`        | Append captcha modal, countdown, launch, and disabled-form styles after Level 3 rules |
| `src/captcha.ts`       | Implement modal orchestration, launch sequence, and post-launch state management      |
| `src/levels/level3.ts` | Expose the scene elements/hooks needed by the captcha and launch flow                 |

No new dependencies added.
