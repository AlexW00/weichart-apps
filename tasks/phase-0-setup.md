# Phase 0 — Project Setup

## Overview

Strip all Vite starter boilerplate. Install GSAP. Establish the foundational file structure, fonts, CSS tokens, scroll container, and module stubs for the scroll-driven storytelling landing page.

After this phase, the project should compile cleanly with `npm run dev`, show an empty page with the correct background color, and have all module files in place with stub exports.

---

## Step 1: Install GSAP

```bash
npm install gsap
```

This single package includes the ScrollTrigger plugin (imported as `gsap/ScrollTrigger`).

---

## Step 2: Delete Boilerplate Files

Delete the following files entirely:

- `src/counter.ts`
- `src/assets/hero.png`
- `src/assets/typescript.svg`
- `src/assets/vite.svg`

After deletion, the `src/assets/` directory should be empty and can be removed.

---

## Step 3: Update `index.html`

Replace the entire contents of `index.html` with:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Weichart — Apps for Humans</title>
	</head>
	<body>
		<div id="app"></div>
		<script type="module" src="/src/main.ts"></script>
	</body>
</html>
```

Changes from the original:

- Title changed from `app` to `Weichart — Apps for Humans`
- Favicon link, viewport meta, charset, and script tag are preserved as-is
- No other elements in `<body>` besides `#app` and the script

---

## Step 4: Replace `src/style.css`

Replace the entire contents of `src/style.css` with the following. Every value is specified — do not improvise.

```css
/* ===========================
   Fonts
   =========================== */

@font-face {
	font-family: "Instrument Serif";
	font-style: normal;
	font-weight: 400;
	font-display: swap;
	src: url("/InstrumentSerif-Regular.ttf") format("truetype");
}

@font-face {
	font-family: "Instrument Serif";
	font-style: italic;
	font-weight: 400;
	font-display: swap;
	src: url("/InstrumentSerif-Italic.ttf") format("truetype");
}

/* ===========================
   Custom Properties
   =========================== */

:root {
	/* Colors */
	--color-sky: #e1f7ff;
	--color-page: #fefef4;
	--color-space: #000000;
	--color-accent: #808c27;
	--color-text-light: #000000;
	--color-text-dark: #ffffff;

	/* Fonts */
	--font-display: "Instrument Serif", Georgia, serif;
	--font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

/* ===========================
   Reset & Base
   =========================== */

*,
*::before,
*::after {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

html,
body {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: var(--color-sky);
	color: var(--color-text-light);
	font-family: var(--font-body);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

/* ===========================
   Scroll Container
   =========================== */

#app {
	width: 100%;
	height: 100vh;
	overflow-y: auto;
	overflow-x: hidden;
}

/* ===========================
   Level Sections
   =========================== */

.level {
	position: relative;
	width: 100%;
	min-height: 100vh;
	overflow: hidden;
}
```

### Design notes on the CSS

- `html, body` have `overflow: hidden` — all scrolling happens inside `#app`. This is required so GSAP ScrollTrigger can use `#app` as the scroll container (the `scroller` option).
- `#app` is the sole scrollable element: `100vh` tall, `overflow-y: auto`.
- Each level section uses class `level` and is at least `100vh` tall. Individual level modules may add their own class (e.g., `level-0`, `level-1`) for scoped styling.
- No dark mode support — the page has its own deliberate color scheme per level.

---

## Step 5: Create Module Stubs

Create the following files. Each must compile without errors under the existing `tsconfig.json` (strict mode, `noUnusedLocals`, `noUnusedParameters`).

### `src/levels/level0.ts`

```typescript
/** Level 0: Intro / Sky */

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "level-0";
	section.className = "level";
	return section;
}

export function register(_scrollContainer: HTMLElement): void {
	// Phase 1: hook GSAP animations
}
```

### `src/levels/level1.ts`

```typescript
/** Level 1: App Tree */

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "level-1";
	section.className = "level";
	return section;
}

export function register(_scrollContainer: HTMLElement): void {
	// Phase 2: hook GSAP animations
}
```

### `src/levels/level2.ts`

```typescript
/** Level 2: Alex Watering */

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "level-2";
	section.className = "level";
	return section;
}

export function register(_scrollContainer: HTMLElement): void {
	// Phase 3: hook GSAP animations
}
```

### `src/levels/transition23.ts`

```typescript
/** Level 2→3 Cinematic Transition */

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "transition-2-3";
	section.className = "level";
	return section;
}

export function register(_scrollContainer: HTMLElement): void {
	// Phase 4: hook GSAP animations
}
```

### `src/levels/level3.ts`

```typescript
/** Level 3: Space / Newsletter */

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "level-3";
	section.className = "level";
	return section;
}

export function register(_scrollContainer: HTMLElement): void {
	// Phase 5: hook GSAP animations
}
```

### `src/captcha.ts`

```typescript
/** Fake captcha modal + rocket launch sequence */

export function create(): HTMLElement {
	const overlay = document.createElement("div");
	overlay.id = "captcha-overlay";
	return overlay;
}

export function register(_scrollContainer: HTMLElement): void {
	// Phase 6: hook captcha interactions
}
```

### `src/scroll.ts`

```typescript
/** GSAP ScrollTrigger setup, level registration, nav sync */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScroll(_scrollContainer: HTMLElement): void {
	// Phase 7: configure ScrollTrigger with scroller, register all levels
}
```

### `src/router.ts`

```typescript
/** URL ↔ level sync */

export function initRouter(): void {
	// Phase 7: pushState on scroll, popstate listener, direct-route jump on load
}
```

---

## Step 6: Rewrite `src/main.ts`

Replace the entire contents of `src/main.ts` with:

```typescript
import "./style.css";

import * as level0 from "./levels/level0";
import * as level1 from "./levels/level1";
import * as level2 from "./levels/level2";
import * as transition23 from "./levels/transition23";
import * as level3 from "./levels/level3";
import * as captcha from "./captcha";
import { initScroll } from "./scroll";
import { initRouter } from "./router";

const app = document.querySelector<HTMLDivElement>("#app")!;

// Build DOM: append each level section in narrative order
const levels = [level0, level1, level2, transition23, level3];
for (const level of levels) {
	app.appendChild(level.create());
}

// Captcha overlay is appended to body, not the scroll container
document.body.appendChild(captcha.create());

// Initialize scroll engine and router
initScroll(app);
initRouter();

// Register each level's animations with the scroll container
for (const level of levels) {
	level.register(app);
}
captcha.register(app);
```

### Why this order matters

1. **DOM first** — all level sections must exist before ScrollTrigger measures them.
2. **Captcha overlay on `<body>`** — it's a fixed modal that must sit outside the scroll container so it renders above everything.
3. **`initScroll` before `register`** — ScrollTrigger must be configured with the scroller element before individual levels add their triggers.
4. **`initRouter` before `register`** — the router must be listening before triggers fire, so a direct-load URL can jump to the right level.

---

## Step 7: Verify

After completing all steps, run:

```bash
npm run dev
```

Expected result:

- Page loads with no console errors
- Title reads "Weichart — Apps for Humans"
- Favicon appears
- Background is `#E1F7FF` (sky blue)
- Page is blank (no visible content — the level sections are empty)
- `npm run build` completes with no TypeScript errors

Also run:

```bash
npx tsc --noEmit
```

Confirm zero errors.

---

## File Checklist

After Phase 0, the `src/` directory should contain exactly:

```
src/
  main.ts
  scroll.ts
  router.ts
  captcha.ts
  style.css
  levels/
    level0.ts
    level1.ts
    level2.ts
    transition23.ts
    level3.ts
```

Deleted files:

- `src/counter.ts`
- `src/assets/` (entire directory)

Modified files:

- `index.html`
- `src/main.ts`
- `src/style.css`

New files:

- `src/scroll.ts`
- `src/router.ts`
- `src/captcha.ts`
- `src/levels/level0.ts`
- `src/levels/level1.ts`
- `src/levels/level2.ts`
- `src/levels/transition23.ts`
- `src/levels/level3.ts`
