/** Scene: Rocket transition — tree becomes rocket, garden → space */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Scene } from "../story-controller";

export const transitionScene: Scene = {
	id: "transition",
	route: "", // no direct route
	weight: 3,

	setup() {
		// All DOM elements (tree, thrust, stars, alex) already created by layers.ts
	},

	register(container, spacer) {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const bgLayer = document.getElementById("bg-layer")!;
		const treeLayer = document.getElementById("shared-tree")!;
		const starsLayer = document.getElementById("shared-stars")!;
		const alexLayer = document.getElementById("alex-layer")!;

		// Pin the spacer so viewport stays during the full cinematic sequence
		ScrollTrigger.create({
			trigger: spacer,
			scroller: container,
			pin: true,
			start: "top top",
			end: "bottom bottom",
		});

		// === BACKGROUND: cream → black ===
		gsap
			.timeline({
				scrollTrigger: {
					trigger: spacer,
					scroller: container,
					start: "top top",
					end: "bottom bottom",
					scrub: true,
				},
			})
			.to(bgLayer, { backgroundColor: "#000000", ease: "none" });

		// === TREE: rises upward (rocket launch) ===
		gsap
			.timeline({
				scrollTrigger: {
					trigger: spacer,
					scroller: container,
					start: "top top",
					end: "70% top",
					scrub: true,
				},
			})
			.to(treeLayer, {
				y: "-150vh",
				ease: "none",
			});

		// Hide tree after it's risen off-screen
		ScrollTrigger.create({
			trigger: spacer,
			scroller: container,
			start: "70% top",
			onEnter: () => {
				treeLayer.style.visibility = "hidden";
			},
			onLeaveBack: () => {
				treeLayer.style.visibility = "visible";
			},
		});

		// === THRUST: appears at start ===
		const thrustWrap = document.getElementById("shared-thrust");
		if (thrustWrap) {
			gsap
				.timeline({
					scrollTrigger: {
						trigger: spacer,
						scroller: container,
						start: "top top",
						end: "5% top",
						scrub: true,
					},
				})
				.to(thrustWrap, { opacity: 1, ease: "none" });
		}

		// === STARS: fade in ===
		gsap.set(starsLayer, { opacity: 0 });

		gsap
			.timeline({
				scrollTrigger: {
					trigger: spacer,
					scroller: container,
					start: "30% top",
					end: "80% top",
					scrub: true,
				},
			})
			.to(starsLayer, { opacity: 1, ease: "none" });

		// Star drift (ambient)
		if (!prefersReducedMotion) {
			const starRows = document.querySelectorAll(
				"#shared-stars .shared-star-row",
			);
			const drifts = [
				{ x: 12, y: 3, duration: 40 },
				{ x: -8, y: -2, duration: 35 },
				{ x: 10, y: -4, duration: 45 },
				{ x: -14, y: 2, duration: 38 },
				{ x: 6, y: -3, duration: 42 },
				{ x: -10, y: 5, duration: 50 },
			];
			starRows.forEach((row, i) => {
				const d = drifts[i % drifts.length];
				gsap.to(row, {
					x: d.x,
					y: d.y,
					duration: d.duration,
					ease: "sine.inOut",
					yoyo: true,
					repeat: -1,
				});
			});

			const blink = document.getElementById("shared-star-blink");
			if (blink) {
				gsap.to(blink, {
					opacity: 0.3,
					duration: 2,
					ease: "sine.inOut",
					yoyo: true,
					repeat: -1,
				});
			}
		}

		// === ALEX: arrow/bubble fade out + figure fly away ===
		const arrowEl = alexLayer.querySelector(".l2-arrow-wrap");
		const bubbleEl = alexLayer.querySelector(".l2-bubble-wrap");
		const alexFigure = alexLayer.querySelector(".l2-alex");

		const alexFlyTl = gsap.timeline({
			scrollTrigger: {
				trigger: spacer,
				scroller: container,
				start: "top top",
				end: "60% top",
				scrub: true,
			},
		});

		if (arrowEl) alexFlyTl.to(arrowEl, { autoAlpha: 0, duration: 0.05 }, 0);
		if (bubbleEl)
			alexFlyTl.to(bubbleEl, { autoAlpha: 0, duration: 0.05 }, 0);

		if (alexFigure) {
			alexFlyTl.to(
				alexFigure,
				{
					x: "40vw",
					y: "-60vh",
					scale: 0.2,
					rotation: 45,
					ease: "power1.in",
					duration: 0.55,
				},
				0.05,
			);
		}

		// Hide alex layer after fly-away
		ScrollTrigger.create({
			trigger: spacer,
			scroller: container,
			start: "60% top",
			onEnter: () => {
				alexLayer.style.visibility = "hidden";
			},
			onLeaveBack: () => {
				alexLayer.style.visibility = "visible";
			},
		});

		// === SCREEN SHAKE ===
		if (!prefersReducedMotion) {
			ScrollTrigger.create({
				trigger: spacer,
				scroller: container,
				start: "top+=5% top",
				onEnter: () => {
					gsap
						.timeline()
						.to(document.body, { x: 3, duration: 0.05 })
						.to(document.body, { x: -3, duration: 0.05 })
						.to(document.body, { x: 3, duration: 0.05 })
						.to(document.body, { x: -2, duration: 0.05 })
						.to(document.body, { x: 2, duration: 0.05 })
						.to(document.body, { x: -1, duration: 0.05 })
						.to(document.body, { x: 0, duration: 0.05 });
					if (navigator.vibrate) navigator.vibrate(100);
				},
			});
		}
	},
};
