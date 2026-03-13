# Weichart Apps Landing Page Specification

## 1. Purpose

Create a public landing page for the Weichart app studio at `apps.weichart.de`.

The page must:

- present the Weichart brand and its apps
- communicate the emotional tone and vision behind the brand
- function as a scroll-driven storytelling experience
- work well on both mobile and desktop
- support direct linking to major story states during development

This document defines the product and interaction requirements. It should be treated as the source of truth for implementation behavior, together with the design exports in `designs/` and the provided assets in `public/`.

## 2. Experience Summary

The landing page is a single narrative scene that progresses through four story levels:

1. Intro in the sky with the Weichart brand and tree
2. App showcase within the tree canopy
3. Alex watering the tree at the base
4. Space / newsletter scene where the tree has transformed into a rocket

The page should feel handcrafted, playful, lightly surreal, and personal rather than corporate. Motion is a core part of the experience, not a decorative extra.

## 3. Primary Goals

- Showcase Weichart as an app studio with a distinct personality
- Introduce current apps through a memorable visual metaphor: apps growing on a tree
- Present Alex as the human behind the studio
- End with a playful newsletter call to action
- Make the story smooth and understandable whether the user scrolls or uses navigation controls

## 4. Platforms and Environment

- Deployment target: `apps.weichart.de` via GitHub Pages
- Development target: localhost
- Layout requirement: responsive on mobile and desktop
- Input methods to support: mouse, touch, trackpad, keyboard

## 5. Source Material

### 5.1 Design Reference Screens

The implementation should follow these design exports as the visual reference:

- `designs/level-0.png`
- `designs/level-1.png`
- `designs/level-1-hover-app.png`
- `designs/level-2.png`
- `designs/level-2-to-3_1.png`
- `designs/level-2-to-3_2.png`
- `designs/level-3.png`
- `designs/level-3-click-subscribe-popup.png`
- `designs/level-3-post-subscribe.png`
- `designs/level-3-finished.png`

### 5.2 Provided Assets

The page should use the provided assets from `public/` where applicable. Each asset is listed below with its file path, format, dimensions, and the level(s) where it is used.

If any required asset is missing, the gap should be flagged explicitly rather than filled with improvised artwork.

### 5.3 Asset Inventory and Level Mapping

#### Fonts

| File                                 | Format | Size | Used In                                                            |
| ------------------------------------ | ------ | ---- | ------------------------------------------------------------------ |
| `public/InstrumentSerif-Regular.ttf` | TTF    | 68K  | All levels — "Weichart" wordmark, app labels, general display text |
| `public/InstrumentSerif-Italic.ttf`  | TTF    | 69K  | Level 0 — "Apps for Humans" subtitle; Level 1 — app descriptions   |

#### Level 0: Intro / Sky

| File                        | Format | Dimensions | Purpose                                                                              |
| --------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------ |
| `public/cloud-colored.png`  | PNG    | 390×274    | A single cloud image; the marquee strip is built dynamically by repeating this asset |
| `public/tree-colored.png`   | PNG    | 793×827    | The entire tree — trunk, branches, and green canopy — positioned bottom-center       |
| `public/zettel-icon.png`    | PNG    | 441×438    | Zettel app icon displayed inside the tree canopy                                     |
| `public/zeitgeist-icon.png` | PNG    | 441×438    | Zeitgeist app icon displayed inside the tree canopy                                  |
| `public/next-icon.png`      | PNG    | 441×438    | "?" placeholder app icon for the upcoming/unknown app slot in the tree canopy        |

Additional elements drawn with CSS/SVG (no dedicated asset file):

- Tree canopy shape: green radial gradient fill, dashed border, squiggly line decorations (drawn over the tree asset)
- "Weichart" wordmark: rendered in Instrument Serif Regular
- "Apps for Humans" subtitle: rendered in Instrument Serif Italic, with blinking cursor and typing animation; the word "Humans" is colored `#808C27`
- Sky background: solid `#E1F7FF`; page light background: `#FEFEF4`; space/dark background: `#000000`

#### Level 1: App Tree

| File                        | Format | Dimensions | Purpose                                                   |
| --------------------------- | ------ | ---------- | --------------------------------------------------------- |
| `public/zettel-icon.png`    | PNG    | 441×438    | Zettel app icon (interactive, responds to hover)          |
| `public/zeitgeist-icon.png` | PNG    | 441×438    | Zeitgeist app icon (interactive, responds to hover)       |
| `public/next-icon.png`      | PNG    | 441×438    | "?" placeholder app icon (interactive, responds to hover) |

Additional elements drawn with CSS/SVG (no dedicated asset file):

- Tree canopy shape: same as Level 0, zoomed-in view
- App label area: app name and description text near the top of canopy (shown on hover)

#### Level 2: Alex Watering the Tree

| File                              | Format | Dimensions | Purpose                                                                                |
| --------------------------------- | ------ | ---------- | -------------------------------------------------------------------------------------- |
| `public/tree-colored.png`         | PNG    | 793×827    | Full tree visible in the upper portion of the scene — only the lower trunk is in frame |
| `public/face.png`                 | PNG    | 900×1682   | Alex's head photo with transparent background, placed on top of the headless stickman  |
| `public/human-base.svg`           | SVG    | 22×53      | Headless stickman body only (no head, no watering can); head is supplied by face.png   |
| `public/watering-can-colored.png` | PNG    | 390×274    | Watering can placed beside Alex; tilt is applied via CSS transform, not baked in       |
| `public/arrow.svg`                | SVG    | 104×116    | Arrow pointing downward toward Alex, labeled "This is Alex" via CSS text overlay       |
| `public/speechbubble.png`         | PNG    | 554×225    | Speech bubble next to Alex showing a random quote (text typed in letter by letter)     |
| `public/signpost.svg`             | SVG    | 92×157     | Bare signpost shape on the left; "Garden" label text is a CSS overlay on the sign face |
| `public/flower.svg`               | SVG    | 22×53      | Decorative flowers at the bottom-left near the signpost                                |

Additional elements drawn with CSS/SVG (no dedicated asset file):

- Water droplets/stream animation: procedural CSS animation (no asset)
- Speech bubble text: typed letter-by-letter, randomly selected from a pool
- Floating/bobbing motion on speech bubble and label cluster

#### Level 2 → 3 Transition

| File                              | Format | Dimensions | Purpose                                                                                                                        |
| --------------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `public/tree-colored.png`         | PNG    | 793×827    | Tree trunk moving upward, transforming into the rocket launch moment                                                           |
| `public/rocket-thrust.svg`        | SVG    | 472×900    | Rocket thrust/flame effect appearing below the tree during launch                                                              |
| `public/face.png`                 | PNG    | 900×1682   | Alex's face as he flies away toward the top-right corner                                                                       |
| `public/human-base-handsup.svg`   | SVG    | 22×53      | Alex's stickman body in hands-up pose during the fly-away animation                                                            |
| `public/watering-can-colored.png` | PNG    | 390×274    | Watering can flying with Alex during the transition                                                                            |
| `public/stars.svg`                | SVG    | 442×79     | Star strip (~half HD screen width, ~1/5 screen height) tiled/repeated to fill the scene as the background transitions to space |

Additional elements drawn with CSS/SVG (no dedicated asset file):

- Background color transition: `#FEFEF4` garden → `#000000` black space (CSS animated)
- Screen shake: CSS animation triggered during the launch moment
- Haptic feedback: browser Vibration API if supported
- Alex (hands-up pose) flies off toward the top-right corner, shrinking and rotating as he goes (no face in this state)

#### Level 3: Space / Newsletter

| File                       | Format | Dimensions | Purpose                                                                                     |
| -------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------- |
| `public/rocket.svg`        | SVG    | 64×196     | Rocket sitting on the launch platform on the planet                                         |
| `public/rocket-stand.svg`  | SVG    | 50×144     | Launch stand/gantry structure beside the rocket                                             |
| `public/rocket-planet.svg` | SVG    | 484×196    | Planet surface at the bottom of the scene where the rocket sits                             |
| `public/cat-sleeping.svg`  | SVG    | 85×27      | Sleeping cat on the planet surface (default state)                                          |
| `public/cat-wake.svg`      | SVG    | 78×27      | Awake cat on the planet surface (shown when captcha modal opens)                            |
| `public/stars.svg`         | SVG    | 442×79     | Star strip tiled repeatedly to fill the space background (same strip as used in transition) |
| `public/star-blink.svg`    | SVG    | 92×40      | Alex represented as a blinking star in the top-right area — no face photo, star only        |

Additional elements drawn with CSS/SVG (no dedicated asset file):

- "NEWSLETTER" vertical ASCII art label: baked into the `rocket-stand.svg` asset, not a CSS overlay
- Email input field and "Subscribe" button: CSS-styled HTML elements
- Star ambient motion/hover effect
- Black (`#000000`) space background

#### Fake Captcha Modal

| File                        | Format | Dimensions | Purpose                                                                                |
| --------------------------- | ------ | ---------- | -------------------------------------------------------------------------------------- |
| `public/capcha.png`         | PNG    | 959×974    | Captcha modal frame with blue header ("Prove you're human: Do NOT press this button!") |
| `public/button.png`         | PNG    | 558×245    | The forbidden red button — default/normal state                                        |
| `public/button-hovered.png` | PNG    | 549×165    | The forbidden red button — hovered state                                               |
| `public/button-pressed.png` | PNG    | 549×93     | The forbidden red button — pressed state                                               |

Additional elements drawn with CSS/SVG (no dedicated asset file):

- "Cancel" button: CSS-styled
- Loading text "Sigh... I knew it...": CSS-styled
- Modal overlay/backdrop

#### Rocket Launch Sequence & Post-Launch

| File                       | Format | Dimensions | Purpose                                           |
| -------------------------- | ------ | ---------- | ------------------------------------------------- |
| `public/rocket.svg`        | SVG    | 64×196     | Rocket flying away during the launch animation    |
| `public/rocket-thrust.svg` | SVG    | 472×900    | Thrust flames during rocket liftoff               |
| `public/cat-wake.svg`      | SVG    | 78×27      | Cat awake during countdown and launch             |
| `public/cat-sleeping.svg`  | SVG    | 85×27      | Cat returns to sleeping after the rocket has gone |

Additional elements drawn with CSS/SVG (no dedicated asset file):

- Countdown numbers ("3", "2", "1"): large text appearing at random positions around the rocket
- Screen shake during liftoff: CSS animation
- Scroll lock during the launch sequence
- Post-launch: email input and subscribe button become disabled

#### Navigation (Global)

The up/down level navigation buttons in the bottom-right corner are CSS-only (circular buttons with CSS arrow/chevron shapes). No dedicated image asset is used.

#### Unused Assets

| File                 | Format | Dimensions     | Notes                                                                             |
| -------------------- | ------ | -------------- | --------------------------------------------------------------------------------- |
| `public/favicon.svg` | SVG    | 48×46          | Browser tab favicon — not part of the page content                                |
| `public/icons.svg`   | SVG    | (sprite sheet) | Social media icons (Bluesky, Discord, GitHub, X) — not used in the current design |
| `public/vite.svg`    | SVG    | 32×32          | Vite default logo — development artifact, not used in the page                    |

## 6. Information Architecture and Routing

The page is conceptually one storytelling page, but each major level must also be directly reachable by URL path.

### 6.1 Route Mapping

- Level 0: `/`
- Level 1: `/apps`
- Level 2: `/about`
- Level 3: `/newsletter`

### 6.2 Route Behavior

- Visiting a route directly should open the page at the corresponding story state.
- Switching levels via scrolling or level navigation should keep the URL in sync with the active level.
- These routes are primarily a development and shareability feature; they do not change the overall single-page storytelling concept.

## 7. Navigation Requirements

Provide a persistent up/down level navigation control in the bottom-right corner.

Requirements:

- render as circular buttons containing small arrow icons
- allow users to move between levels without manual scrolling
- trigger the same story transitions and animations as scroll progression
- move at a default, controlled animation speed rather than jumping instantly
- remain usable for accessibility and on devices where scrolling precision is poor

## 8. Story Flow

### 8.1 Overall Narrative

The intended narrative is:

1. Start in the sky with branding and the tree
2. Move into the app-showcase tree canopy
3. Continue down to Alex watering the tree
4. Transition from garden to space as the tree becomes a rocket
5. Arrive at the planet/newsletter scene
6. Open a fake captcha when the user clicks subscribe
7. Launch the rocket after the user presses the forbidden button
8. End in the final state with the rocket gone

### 8.2 Scroll Behavior

- The story should progress through designed scroll stages rather than feeling like arbitrary page sections.
- Scroll-linked animation must feel smooth and continuous.
- Transitions between levels should preserve narrative continuity.
- Motion timing should be tuned so the user can understand what is happening while scrolling.

## 9. Level Specifications

### 9.1 Level 0: Intro / Sky

Route: `/`

Visual intent:

- bright sky at the top of the page
- tree positioned bottom-center
- the Weichart wordmark prominently displayed
- subtitle reads `Apps for humans`

Required behaviors:

- the word `humans` has a blinking cursor behind it
- the cursor animation occasionally deletes `humans` and replaces it with translated versions of the word
- at minimum, German and Japanese variants should be included
- the typing/deleting effect should loop or recur occasionally without feeling distracting
- clouds at the top move slightly to the right in an infinite ambient animation
- a marquee-style cloud strip should be present at the top

Purpose of this level:

- introduce the brand
- establish the handcrafted / playful tone
- set up the tree as the central visual metaphor

### 9.2 Level 1: App Tree

Route: `/apps`

Visual intent:

- focus on the tree canopy
- small app icons appear attached to the tree

Required behaviors:

- app icons should respond to hover with a subtle indication state
- hovering an app should reveal or update a label area near the top of the tree
- the label area should show app name and short description
- placeholder descriptions are acceptable for now

Content status:

- app metadata may use placeholders in the initial version
- at least the provided app assets should be represented

### 9.3 Level 2: Alex Watering the Tree

Route: `/about`

Visual intent:

- show the lower trunk area of the tree
- Alex appears as a stick figure beside the tree
- Alex is watering the tree
- a sign and flowers appear on the left side

Required behaviors:

- the stickman body remains mostly static
- the watering can should animate subtly
- a small water animation should indicate watering activity
- on level entry, a speech bubble appears with a short line of text
- the speech bubble text is chosen randomly from a pool of 10 placeholder lines
- the text animates in letter by letter
- an arrow labeling Alex as `This is Alex` should appear and animate in
- the arrow is an SVG and should remain animatable
- the speech bubble / label cluster should float slightly
- the left-side sign text should read `Garden`
- hovering the sign should underline the text
- clicking the sign should open `https://alexanderweichart.de`

### 9.4 Transition From Level 2 to Level 3

This is the most important cinematic transition in the experience.

Required behaviors:

- the tree moves upward and transforms into a rocket takeoff moment
- rocket thrust appears below the tree during launch
- the screen shakes during the launch moment
- if supported by the device/browser, slight haptic feedback should be triggered to match the motion
- Alex flies away separately with rotation, becoming smaller toward the top-right corner
- Alex should use the hands-up base pose during this transition
- the background transitions from the garden palette to black space
- stars fade in as the scene moves into space
- stars should have a subtle ambient motion or hovering effect

### 9.5 Level 3: Space / Newsletter

Route: `/newsletter`

Visual intent:

- black space background
- a planet with a rocket on it
- Alex represented as a blinking star in the top-right area
- star field concentrated or visibly active in the top portion of the scene

Required behaviors:

- user can enter an email address in the field below the rocket
- the field should show placeholder text
- clicking `Subscribe` opens a fake captcha modal
- when the subscribe trigger is hovered, the button asset changes to its hovered variant
- when the fake captcha modal opens, the cat on the planet changes from sleeping to awake
- clicking `Cancel` closes the modal and does nothing else
- the newsletter does not actually subscribe anyone in this version
- on submit intent, the entered email should only be logged to the console

## 10. Fake Captcha Flow

The fake captcha is intentionally playful and should behave like a small interactive scene.

### 10.1 Modal Open State

- modal opens after the user presses `Subscribe`
- modal visually follows the provided design assets
- primary prompt indicates that the user should not press the large red button

### 10.2 Cancel Behavior

- clicking `Cancel` closes the modal
- no countdown, launch, or state change should occur
- scrolling remains enabled

### 10.3 Forbidden Button Behavior

When the user presses the big red button:

1. show a loading state for 3 seconds
2. during loading, display the text `Sigh... I knew it...`
3. after 3 seconds, close the modal
4. start the rocket launch sequence

### 10.4 Rocket Launch Sequence

During launch:

- display `3`, `2`, `1` as large countdown numbers
- countdown numbers should appear around the rocket at random positions
- at `0`, the rocket begins flying away
- the screen shakes again during liftoff
- scrolling must be disabled from the moment the forbidden button is pressed until the rocket has fully flown away
- after launch completes, scrolling becomes available again

### 10.5 Post-Launch State

After the rocket is gone:

- the cat returns to the sleeping state
- the email input is disabled
- the subscribe button is disabled
- the final scene remains visible without the rocket

## 11. Animation Requirements

Animation is a core product requirement.

### 11.1 Quality Bar

- motion must feel smooth and intentional
- transitions should read clearly on both trackpad scrolling and touch scrolling
- ambient animations should be subtle and continuous
- large scene transitions should feel cinematic rather than abrupt

### 11.2 Animation Types Required

- scroll-linked level progression
- ambient looping motion for clouds, stars, and floating UI elements
- typing/deleting text animation
- hover feedback for app icons, sign text, stars, and subscribe button states where applicable
- cinematic launch and transformation sequences
- screen shake during major launch moments

### 11.3 Motion Constraints

- motion should not block understanding of content
- level navigation buttons must use the same narrative transitions as scrolling
- disabling scroll during the final launch sequence is required

## 12. Accessibility and Usability Requirements

- the experience must remain understandable on both desktop and mobile
- direct level navigation via buttons is required for accessibility and usability
- interactions should not depend on hover alone; touch users must still be able to access all essential content
- keyboard focus and activation should work for interactive elements
- direct routes should provide an alternative to manual scrolling through the full story
- if reduced-motion handling is implemented, it should preserve the story while minimizing aggressive motion such as shake

## 13. Content Requirements

### 13.1 Brand Copy

- primary brand text: `Weichart`
- subtitle base text: `Apps for humans`

### 13.2 Placeholder Content Allowed

The following may use placeholder content for now:

- app descriptions
- app names for unreleased apps
- the 10 rotating Alex speech bubble lines
- email input placeholder copy if not finalized elsewhere

## 14. Technical Constraints and Guidance

- external libraries may be used if they materially improve the implementation, especially for smooth scroll orchestration and animation
- implementation should prefer stable approaches that work on GitHub Pages
- missing assets should be reported instead of mocked up
- there is no backend subscription flow in this version

## 15. Out of Scope for This Version

- real newsletter subscription or backend integration
- real captcha validation
- content management system integration
- fully finalized production copy for app descriptions and speech bubble text

## 16. Open Questions / Items To Confirm

These items are not fully specified and should be confirmed before final implementation details are locked:

- exact translated replacements for `humans` beyond German and Japanese
- final list of current apps and their descriptions
- final set of 10 Alex speech bubble lines
- exact placeholder text for the email input
- whether a dedicated loading-spinner asset is expected or should be built procedurally from the existing style system

## 17. Acceptance Criteria

The feature is complete when:

- the landing page matches the supplied visual references closely enough to preserve the intended tone and composition
- all four story levels exist and are reachable by scroll and by direct route
- the bottom-right level navigation works and plays the same transitions as scrolling
- the level 2 to level 3 transformation reads clearly as a tree-to-rocket launch
- the fake captcha flow behaves exactly as specified, including cancel, loading, countdown, scroll lock, launch, and post-launch final state
- mobile and desktop layouts are both usable and visually coherent
- newsletter submission only logs the value and does not call a backend
