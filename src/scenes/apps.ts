/** Scene: App Tree — zoomed canopy with interactive app icons */

import { gsap } from "gsap";
import type { Scene } from "../story-controller";

interface AppInfo {
	icon: string;
	name: string;
	description: string;
}

const APPS: AppInfo[] = [
	{
		icon: "zettel-icon.png",
		name: "Zettel",
		description: "Minimalist Quick Notes",
	},
	{
		icon: "zeitgeist-icon.png",
		name: "Zeitgeist",
		description: "Screen Time, Reimagined",
	},
	{ icon: "next-icon.png", name: "?", description: "Coming Soon" },
];

let appsLayer: HTMLElement;

export const appsScene: Scene = {
	id: "apps",
	route: "/apps",
	weight: 2,

	setup() {
		const app = document.getElementById("app")!;

		appsLayer = document.createElement("div");
		appsLayer.id = "apps-layer";

		// Label area (hidden by default)
		const label = document.createElement("div");
		label.className = "l1-label";
		label.setAttribute("aria-live", "polite");

		const labelName = document.createElement("div");
		labelName.className = "l1-label-name";

		const labelDesc = document.createElement("div");
		labelDesc.className = "l1-label-desc";

		label.append(labelName, labelDesc);

		// App icons row
		const iconsRow = document.createElement("div");
		iconsRow.className = "l1-icons-row";

		for (const app of APPS) {
			const icon = document.createElement("img");
			icon.src = `/${app.icon}`;
			icon.alt = app.name;
			icon.className = "l1-app-icon";
			icon.draggable = false;
			icon.dataset.appName = app.name;
			icon.dataset.appDesc = app.description;
			iconsRow.appendChild(icon);
		}

		appsLayer.append(label, iconsRow);
		document.body.insertBefore(appsLayer, app);
	},

	register(container, spacer) {
		const bgLayer = document.getElementById("bg-layer")!;
		const treeLayer = document.getElementById("shared-tree")!;

		// Show apps layer when entering this scene, hide when leaving
		gsap.set(appsLayer, { autoAlpha: 0 });
		gsap
			.timeline({
				scrollTrigger: {
					trigger: spacer,
					scroller: container,
					start: "top 80%",
					end: "top 40%",
					scrub: true,
				},
			})
			.to(appsLayer, { autoAlpha: 1, ease: "none" });

		// Hide intro layer as we zoom into tree
		const introLayer = document.getElementById("intro-layer");
		if (introLayer) {
			gsap
				.timeline({
					scrollTrigger: {
						trigger: spacer,
						scroller: container,
						start: "top 80%",
						end: "top 40%",
						scrub: true,
					},
				})
				.to(introLayer, { autoAlpha: 0, ease: "none" });
		}

		// Background: sky → cream (scrubbed over this spacer)
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
			.fromTo(
				bgLayer,
				{ backgroundColor: "#e1f7ff" },
				{ backgroundColor: "#fefef4", ease: "none" },
			);

		// Tree: zoom into canopy (48vw → 130vw, bottom → top)
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
				top: "-15%",
				width: "130vw",
				yPercent: 0,
				ease: "none",
			});

		// Hide apps layer when leaving (entering alex scene)
		gsap
			.timeline({
				scrollTrigger: {
					trigger: spacer,
					scroller: container,
					start: "bottom 60%",
					end: "bottom top",
					scrub: true,
				},
			})
			.to(appsLayer, { autoAlpha: 0, ease: "none" });

		// Wire icon interactions
		wireIconInteractions();
	},
};

function wireIconInteractions(): void {
	const label = appsLayer.querySelector<HTMLElement>(".l1-label");
	const labelName = appsLayer.querySelector<HTMLElement>(".l1-label-name");
	const labelDesc = appsLayer.querySelector<HTMLElement>(".l1-label-desc");
	const icons = appsLayer.querySelectorAll<HTMLElement>(".l1-app-icon");

	if (!label || !labelName || !labelDesc) return;

	let activeIcon: HTMLElement | null = null;

	function showLabel(icon: HTMLElement): void {
		if (!label || !labelName || !labelDesc) return;
		labelName.textContent = icon.dataset.appName ?? "";
		labelDesc.textContent = icon.dataset.appDesc ?? "";
		label.classList.add("l1-label--visible");
		activeIcon = icon;
	}

	function hideLabel(): void {
		if (!label) return;
		label.classList.remove("l1-label--visible");
		activeIcon = null;
	}

	const supportsHover = window.matchMedia("(hover: hover)").matches;

	icons.forEach((icon) => {
		if (supportsHover) {
			icon.addEventListener("pointerenter", () => showLabel(icon));
			icon.addEventListener("pointerleave", () => hideLabel());
		} else {
			icon.addEventListener("click", (e) => {
				e.stopPropagation();
				if (activeIcon === icon) {
					hideLabel();
				} else {
					showLabel(icon);
				}
			});
		}
	});

	if (!supportsHover) {
		document.addEventListener("click", () => {
			if (activeIcon) hideLabel();
		});
	}
}
