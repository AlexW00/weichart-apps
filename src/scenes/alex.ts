/** Scene: Alex watering the tree — figure, arrow, speech bubble */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QUOTES } from "../layers";
import type { Scene } from "../story-controller";

export const alexScene: Scene = {
	id: "alex",
	route: "/about",
	weight: 1.5,

	setup() {
		// Alex layer DOM is created by layers.ts — nothing to add
	},

	register(container, spacer) {
		const treeLayer = document.getElementById("shared-tree")!;
		const alexLayer = document.getElementById("alex-layer")!;

		// Tree: keep 130vw, slide to trunk view (bottom-aligned)
		gsap
			.timeline({
				scrollTrigger: {
					trigger: spacer,
					scroller: container,
					start: "top bottom",
					end: "top top",
					scrub: true,
				},
			})
			.to(treeLayer, {
				top: "100%",
				yPercent: -100,
				ease: "none",
			});

		// Alex layer: initially hidden
		gsap.set(alexLayer, { autoAlpha: 0 });

		// Fade in as this scene enters
		gsap
			.timeline({
				scrollTrigger: {
					trigger: spacer,
					scroller: container,
					start: "top bottom",
					end: "top 60%",
					scrub: true,
				},
			})
			.to(alexLayer, { autoAlpha: 1, ease: "none" });

		// Trigger typing and arrow appear once
		ScrollTrigger.create({
			trigger: spacer,
			scroller: container,
			start: "top 60%",
			once: true,
			onEnter: () => {
				const bt = alexLayer.querySelector<HTMLElement>(".l2-bubble-text");
				if (bt) {
					const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
					typeQuote(bt, quote);
				}
				const aw =
					alexLayer.querySelector<HTMLElement>(".l2-arrow-wrap");
				if (aw)
					setTimeout(() => aw.classList.add("l2-arrow-wrap--visible"), 300);
			},
		});
	},
};

function typeQuote(el: HTMLElement, text: string): void {
	const chars = Array.from(text);
	let i = 0;
	function next(): void {
		if (i >= chars.length) return;
		i++;
		el.textContent = chars.slice(0, i).join("");
		setTimeout(next, 45);
	}
	setTimeout(next, 800);
}
