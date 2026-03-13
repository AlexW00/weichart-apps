/** GSAP ScrollTrigger setup, level registration, nav sync */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LEVEL_IDS = ["level-0", "level-1", "level-2", "level-3"] as const;
const TRANSITION_ID = "transition-2-3";

let container: HTMLElement;
let levelEls: HTMLElement[] = [];
let transitionEl: HTMLElement | null = null;
let activeLevel = 0;
const changeCallbacks: Array<(index: number) => void> = [];
let scrollLocked = false;
let programmaticScroll = false;

export function initScroll(scrollContainer: HTMLElement): void {
	container = scrollContainer;

	levelEls = LEVEL_IDS.map(
		(id) => document.getElementById(id)!,
	);
	transitionEl = document.getElementById(TRANSITION_ID);

	ScrollTrigger.defaults({ scroller: container });

	// Detect active level on scroll
	let rafId = 0;
	container.addEventListener("scroll", () => {
		cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(updateActiveLevel);
	});

	// Set initial level
	updateActiveLevel();
}

function updateActiveLevel(): void {
	const mid = container.scrollTop + container.clientHeight / 2;

	// Check if we're in the transition zone
	// When pinned by ScrollTrigger, the element is position:fixed and offsetTop=0.
	// Use the pin-spacer wrapper (which stays in flow) for correct offset.
	if (transitionEl) {
		const spacer = transitionEl.parentElement?.classList.contains("pin-spacer")
			? transitionEl.parentElement
			: null;
		const ref = spacer || transitionEl;
		const tTop = ref.offsetTop;
		const tHeight = ref.offsetHeight;
		if (mid >= tTop && mid < tTop + tHeight) {
			const progress = (mid - tTop) / tHeight;
			setActiveLevel(progress > 0.8 ? 3 : 2);
			return;
		}
	}

	// Find which major level contains the midpoint
	for (let i = levelEls.length - 1; i >= 0; i--) {
		if (mid >= levelEls[i].offsetTop) {
			setActiveLevel(i);
			return;
		}
	}

	setActiveLevel(0);
}

function setActiveLevel(index: number): void {
	if (index === activeLevel) return;
	activeLevel = index;
	if (!programmaticScroll) {
		for (const cb of changeCallbacks) cb(index);
	}
}

export function scrollToLevel(index: number): void {
	if (index < 0 || index >= levelEls.length) return;
	const target = levelEls[index];
	programmaticScroll = true;
	gsap.to(container, {
		scrollTop: target.offsetTop,
		duration: 0.8,
		ease: "power2.inOut",
		onComplete: () => {
			programmaticScroll = false;
			updateActiveLevel();
			ScrollTrigger.refresh();
		},
	});
}

export function getActiveLevel(): number {
	return activeLevel;
}

export function onLevelChange(callback: (index: number) => void): void {
	changeCallbacks.push(callback);
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
