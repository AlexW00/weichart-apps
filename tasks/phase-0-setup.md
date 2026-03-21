# Phase 0 — Project Setup

## Overview

Strip the Vite starter boilerplate, install GSAP, and establish the shell for a single scroll-driven scene.

This phase must not set the project up as stacked full-screen level sections. The correct foundation is:

- one scroll container
- one sticky viewport
- one scroll track that provides distance
- one shared scene registry that later phases populate with persistent elements

After this phase, the project should compile cleanly with `npm run dev`, show an empty sticky viewport with the correct background color, and have all module files in place with stub exports that reflect the shared-scene architecture.

---

## Step 1: Install GSAP

```bash
npm install gsap
```

This single package includes the ScrollTrigger plugin.

---

## Step 2: Delete Boilerplate Files

Delete the following files entirely:

- `src/counter.ts`
- `src/assets/hero.png`
- `src/assets/typescript.svg`
- `src/assets/vite.svg`

After deletion, `src/assets/` can be removed if empty.

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

---

## Step 4: Replace `src/style.css`

Replace the entire contents of `src/style.css` with:

```css
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

:root {
	--color-sky: #e1f7ff;
	--color-page: #fefef4;
	--color-space: #000000;
	--color-accent: #808c27;
	--color-text-light: #000000;
	--color-text-dark: #ffffff;

	--font-display: "Instrument Serif", Georgia, serif;
	--font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

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
	background: var(--color-page);
	color: var(--color-text-light);
	font-family: var(--font-body);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

#app {
	width: 100%;
	height: 100vh;
	overflow-y: auto;
	overflow-x: hidden;
}

.scene-root {
	position: relative;
	width: 100%;
}

.scene-viewport {
	position: sticky;
	top: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	isolation: isolate;
	background: var(--color-page);
}

.scene-layer {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.scene-layer > * {
	pointer-events: auto;
}

.scroll-track {
	position: relative;
	width: 100%;
	height: 500vh;
}
```

### Design Notes

- `#app` remains the only scrollable element.
- `.scene-viewport` is the one visible canvas for the whole story.
- `.scroll-track` exists only to provide scroll distance; it does not contain duplicate visual scenes.
- Later phases should mount elements into `.scene-layer` containers and animate those same nodes across checkpoints.

---

## Step 5: Create Shared Scene Infrastructure

Create `src/scene.ts`:

```typescript
export interface Scene {
	root: HTMLDivElement;
	viewport: HTMLDivElement;
	track: HTMLDivElement;
	layers: Record<string, HTMLDivElement>;
	refs: Record<string, HTMLElement>;
}

function createLayer(name: string): HTMLDivElement {
	const layer = document.createElement("div");
	layer.className = `scene-layer scene-layer-${name}`;
	layer.dataset.layer = name;
	return layer;
}

export function createScene(): Scene {
	const root = document.createElement("div");
	root.className = "scene-root";

	const viewport = document.createElement("div");
	viewport.className = "scene-viewport";

	const track = document.createElement("div");
	track.className = "scroll-track";

	const layers = {
		background: createLayer("background"),
		world: createLayer("world"),
		foreground: createLayer("foreground"),
		overlay: createLayer("overlay"),
	};

	for (const layer of Object.values(layers)) {
		viewport.appendChild(layer);
	}

	root.append(viewport, track);

	return {
		root,
		viewport,
		track,
		layers,
		refs: {},
	};
}
```

---

## Step 6: Create Module Stubs

Create the following files. These stubs deliberately work with the shared `Scene` object instead of returning full-screen sections.

### `src/levels/level0.ts`

```typescript
import type { Scene } from "../scene";

/** Level 0: Intro / Sky */

export function setup(_scene: Scene): void {
	// Phase 1: mount persistent intro elements
}

export function register(_scene: Scene): void {
	// Phase 1 / 7: attach intro behaviors and timeline hooks
}
```

### `src/levels/level1.ts`

```typescript
import type { Scene } from "../scene";

/** Level 1: App Tree */

export function setup(_scene: Scene): void {
	// Phase 2: reuse intro tree/icon nodes and add canopy-state UI
}

export function register(_scene: Scene): void {
	// Phase 2 / 7: attach canopy interactions and timeline hooks
}
```

### `src/levels/level2.ts`

```typescript
import type { Scene } from "../scene";

/** Level 2: Alex Watering */

export function setup(_scene: Scene): void {
	// Phase 3: mount Alex/garden elements into the shared scene
}

export function register(_scene: Scene): void {
	// Phase 3 / 7: attach garden behaviors and timeline hooks
}
```

### `src/levels/transition23.ts`

```typescript
import type { Scene } from "../scene";

/** Level 2→3 Cinematic Transition */

export function setup(_scene: Scene): void {
	// Phase 4: mount launch-only shared elements such as thrust/stars
}

export function register(_scene: Scene): void {
	// Phase 4 / 7: attach transition timeline hooks
}
```

### `src/levels/level3.ts`

```typescript
import type { Scene } from "../scene";

/** Level 3: Space / Newsletter */

export function setup(_scene: Scene): void {
	// Phase 5: mount persistent space/newsletter elements
}

export function register(_scene: Scene): void {
	// Phase 5 / 7: attach ambient loops and timeline hooks
}
```

### `src/captcha.ts`

```typescript
import type { Scene } from "./scene";

/** Fake captcha modal + rocket launch sequence */

export function create(): HTMLElement {
	const overlay = document.createElement("div");
	overlay.id = "captcha-overlay";
	return overlay;
}

export function register(_scene: Scene): void {
	// Phase 6: hook captcha interactions against shared Level 3 refs
}
```

### `src/scroll.ts`

```typescript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Scene } from "./scene";

gsap.registerPlugin(ScrollTrigger);

export function initScroll(_scene: Scene): void {
	// Phase 7: configure the master timeline against the shared scroll track
}
```

### `src/router.ts`

```typescript
export function initRouter(): void {
	// Phase 7: map routes to named story checkpoints
}
```

---

## Step 7: Rewrite `src/main.ts`

Replace the entire contents of `src/main.ts` with:

```typescript
import "./style.css";

import * as level0 from "./levels/level0";
import * as level1 from "./levels/level1";
import * as level2 from "./levels/level2";
import * as transition23 from "./levels/transition23";
import * as level3 from "./levels/level3";
import * as captcha from "./captcha";
import { createScene } from "./scene";
import { initScroll } from "./scroll";
import { initRouter } from "./router";

const app = document.querySelector<HTMLDivElement>("#app")!;
const scene = createScene();

app.appendChild(scene.root);

const levels = [level0, level1, level2, transition23, level3];

for (const level of levels) {
	level.setup(scene);
}

document.body.appendChild(captcha.create());

initScroll(scene);
initRouter();

for (const level of levels) {
	level.register(scene);
}

captcha.register(scene);
```

### Why This Order Matters

1. The shared scene shell must exist before story modules mount persistent elements.
2. All persistent elements should exist before the scroll engine measures the scroll track.
3. The captcha overlay stays outside the scroll container so it can sit above the scene.
4. The router and scroll engine are tied to checkpoints in one scene, not to separate section nodes.

---

## Step 8: Verify

Run:

```bash
npm run dev
```

Expected result:

- page loads with no console errors
- title reads `Weichart — Apps for Humans`
- background is `#FEFEF4`
- the viewport is empty, sticky, and ready for mounted scene elements
- the scroll container can scroll because the track exists, even though nothing is visible yet

Also run:

```bash
npx tsc --noEmit
```

Confirm zero errors.

---

## File Checklist

After Phase 0, `src/` should contain:

```text
src/
  main.ts
  scene.ts
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
- `src/assets/` if empty

Modified files:

- `index.html`
- `src/main.ts`
- `src/style.css`

New files:

- `src/scene.ts`
- `src/scroll.ts`
- `src/router.ts`
- `src/captcha.ts`
- `src/levels/level0.ts`
- `src/levels/level1.ts`
- `src/levels/level2.ts`
- `src/levels/transition23.ts`
- `src/levels/level3.ts`
