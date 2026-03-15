/** Weight-based scroll story controller */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface Scene {
	id: string;
	route: string;
	weight: number;
	/** Create any fixed-position DOM elements for this scene */
	setup(): void;
	/** Register GSAP/ScrollTrigger animations using the spacer as trigger */
	register(container: HTMLElement, spacer: HTMLElement): void;
}

interface SceneEntry {
	scene: Scene;
	spacer: HTMLElement;
}

let container: HTMLElement;
const entries: SceneEntry[] = [];
let activeIndex = 0;
const changeCallbacks: Array<(index: number) => void> = [];
let scrollLocked = false;

/** Register a scene (call before init) */
export function addScene(scene: Scene): void {
	entries.push({ scene, spacer: null! });
}

/** Initialize: create spacers, setup scenes, register animations */
export function init(scrollContainer: HTMLElement): void {
	container = scrollContainer;

	ScrollTrigger.defaults({ scroller: container });

	// Create spacer divs inside the scroll container
	for (const entry of entries) {
		const spacer = document.createElement("div");
		spacer.className = "scene-spacer";
		spacer.dataset.scene = entry.scene.id;
		spacer.style.height = `${entry.scene.weight * 100}vh`;
		container.appendChild(spacer);
		entry.spacer = spacer;
	}

	// Setup: let each scene create its fixed-position DOM
	for (const entry of entries) {
		entry.scene.setup();
	}

	// Register: wire scroll-driven animations
	for (const entry of entries) {
		entry.scene.register(container, entry.spacer);
	}

	// Active scene detection on scroll
	let rafId = 0;
	container.addEventListener("scroll", () => {
		cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(updateActiveScene);
	});

	updateActiveScene();
}

function updateActiveScene(): void {
	const mid = container.scrollTop + container.clientHeight / 2;

	for (let i = entries.length - 1; i >= 0; i--) {
		const entry = entries[i];
		// Account for pin-spacer wrappers
		const ref =
			entry.spacer.parentElement?.classList.contains("pin-spacer")
				? entry.spacer.parentElement
				: entry.spacer;
		if (mid >= ref.offsetTop) {
			setActiveScene(i);
			return;
		}
	}

	setActiveScene(0);
}

function setActiveScene(index: number): void {
	if (index === activeIndex) return;
	activeIndex = index;
	for (const cb of changeCallbacks) cb(index);
}

/** Get index of the active scene */
export function getActiveIndex(): number {
	return activeIndex;
}

/** Get the active scene's ID */
export function getActiveSceneId(): string {
	return entries[activeIndex]?.scene.id ?? "";
}

/** Listen for active scene changes */
export function onSceneChange(callback: (index: number) => void): void {
	changeCallbacks.push(callback);
}

/** Jump to a scene by index. animate=false for deep links. */
export function jumpToIndex(index: number, animate = true): void {
	if (index < 0 || index >= entries.length) return;
	const entry = entries[index];
	const ref =
		entry.spacer.parentElement?.classList.contains("pin-spacer")
			? entry.spacer.parentElement
			: entry.spacer;
	const targetTop = ref.offsetTop;

	if (animate) {
		gsap.to(container, {
			scrollTop: targetTop,
			duration: 0.8,
			ease: "power2.inOut",
			onComplete: () => {
				updateActiveScene();
				ScrollTrigger.refresh();
			},
		});
	} else {
		container.scrollTop = targetTop;
		updateActiveScene();
		// Let ScrollTrigger resolve scrub positions
		requestAnimationFrame(() => ScrollTrigger.refresh());
	}
}

/** Jump to a scene by ID */
export function jumpToScene(sceneId: string, animate = true): void {
	const idx = entries.findIndex((e) => e.scene.id === sceneId);
	if (idx >= 0) jumpToIndex(idx, animate);
}

/** Find scene index by ID */
export function sceneIndexById(sceneId: string): number {
	return entries.findIndex((e) => e.scene.id === sceneId);
}

/** Get total number of scenes */
export function getSceneCount(): number {
	return entries.length;
}

export function lockScroll(): void {
	if (scrollLocked) return;
	scrollLocked = true;
	container.style.overflow = "hidden";
}

export function unlockScroll(): void {
	if (!scrollLocked) return;
	scrollLocked = false;
	container.style.overflow = "";
}
