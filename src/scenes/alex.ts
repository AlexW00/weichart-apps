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
		const bubbleText = alexLayer.querySelector<HTMLElement>(".l2-bubble-text");
		const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
		const quoteChars = Array.from(quote);

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

		gsap.set(alexLayer, { autoAlpha: 0 });

		if (bubbleText) {
			bubbleText.textContent = "";
		}

		ScrollTrigger.create({
			trigger: spacer,
			scroller: container,
			start: "top bottom",
			end: "bottom top",
			onEnter: () => {
				gsap.set(alexLayer, { autoAlpha: 1 });
			},
			onEnterBack: () => {
				gsap.set(alexLayer, { autoAlpha: 1 });
			},
			onLeaveBack: () => {
				gsap.set(alexLayer, { autoAlpha: 0 });
				if (bubbleText) bubbleText.textContent = "";
			},
		});

		if (bubbleText) {
			ScrollTrigger.create({
				trigger: spacer,
				scroller: container,
				start: "top top",
				end: "bottom 28%",
				scrub: true,
				onUpdate: ({ progress }) => {
					const visibleChars = Math.round(progress * quoteChars.length);
					bubbleText.textContent = quoteChars.slice(0, visibleChars).join("");
				},
				onLeave: () => {
					bubbleText.textContent = quote;
				},
				onLeaveBack: () => {
					bubbleText.textContent = "";
				},
			});
		}
	},
};
