/** Level 2→3 Cinematic Transition — pin only (visuals in shared-layers) */

import { ScrollTrigger } from "gsap/ScrollTrigger";

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "transition-2-3";
	section.className = "level";
	return section;
}

export function register(scrollContainer: HTMLElement): void {
	const section = document.getElementById("transition-2-3");
	if (!section) return;

	// Pin the transition section to create the scrollable space.
	// All visual animations (tree, stars, bg, alex, thrust, shake)
	// are registered in shared-layers.ts.
	ScrollTrigger.create({
		trigger: section,
		scroller: scrollContainer,
		pin: true,
		start: "top top",
		end: "bottom bottom",
	});
}
