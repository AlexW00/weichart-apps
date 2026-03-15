/** Scene: App Tree — zoomed canopy with interactive app icons */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

interface AppsInteractionController {
	setScrollFocus(index: number | null): void;
}

export const appsScene: Scene = {
	id: "apps",
	route: "/apps",
	weight: 3,

	setup() {
		const treeLayer = document.getElementById("shared-tree")!;

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
		treeLayer.appendChild(appsLayer);
	},

	register(container, spacer) {
		const bgLayer = document.getElementById("bg-layer")!;
		const treeLayer = document.getElementById("shared-tree")!;
		const interactions = wireIconInteractions();

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

		// Tree: zoom into canopy (42vw → 118vw, bottom → top)
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
				"--tree-width": "118vw",
				yPercent: 0,
				ease: "none",
			});

		ScrollTrigger.create({
			trigger: spacer,
			scroller: container,
			start: "top top",
			end: "bottom top",
			onUpdate: ({ progress }) => {
				const normalized = gsap.utils.normalize(0.15, 0.75, progress);
				if (normalized <= 0) {
					interactions.setScrollFocus(null);
					return;
				}

				const iconIndex = Math.min(
					Math.floor(normalized * APPS.length),
					APPS.length - 1,
				);
				interactions.setScrollFocus(iconIndex);
			},
			onLeaveBack: () => {
				interactions.setScrollFocus(null);
			},
		});
	},
};

function wireIconInteractions(): AppsInteractionController {
	const label = appsLayer.querySelector<HTMLElement>(".l1-label");
	const labelName = appsLayer.querySelector<HTMLElement>(".l1-label-name");
	const labelDesc = appsLayer.querySelector<HTMLElement>(".l1-label-desc");
	const icons = Array.from(
		appsLayer.querySelectorAll<HTMLElement>(".l1-app-icon"),
	);

	if (!label || !labelName || !labelDesc || icons.length === 0) {
		return {
			setScrollFocus() {},
		};
	}

	const labelEl = label;
	const labelNameEl = labelName;
	const labelDescEl = labelDesc;

	let activeIcon: HTMLElement | null = null;
	let manualIcon: HTMLElement | null = null;
	let scrollFocusIndex: number | null = null;

	function setActiveIcon(icon: HTMLElement | null): void {
		if (activeIcon === icon) return;

		activeIcon?.classList.remove("l1-app-icon--active");

		if (!icon) {
			labelEl.classList.remove("l1-label--visible");
			activeIcon = null;
			return;
		}

		labelNameEl.textContent = icon.dataset.appName ?? "";
		labelDescEl.textContent = icon.dataset.appDesc ?? "";
		labelEl.classList.add("l1-label--visible");
		icon.classList.add("l1-app-icon--active");
		activeIcon = icon;
	}

	function syncActiveIcon(): void {
		const nextIcon =
			manualIcon ?? (scrollFocusIndex === null ? null : icons[scrollFocusIndex]);
		setActiveIcon(nextIcon);
	}

	const supportsHover = window.matchMedia("(hover: hover)").matches;

	icons.forEach((icon) => {
		if (supportsHover) {
			icon.addEventListener("pointerenter", () => {
				manualIcon = icon;
				syncActiveIcon();
			});
			icon.addEventListener("pointerleave", () => {
				manualIcon = null;
				syncActiveIcon();
			});
		} else {
			icon.addEventListener("click", (e) => {
				e.stopPropagation();
				manualIcon = manualIcon === icon ? null : icon;
				syncActiveIcon();
			});
		}
	});

	if (!supportsHover) {
		document.addEventListener("click", () => {
			if (!manualIcon) return;
			manualIcon = null;
			syncActiveIcon();
		});
	}

	return {
		setScrollFocus(index) {
			scrollFocusIndex = index;
			syncActiveIcon();
		},
	};
}
