/** Scene: Intro / Sky — cloud marquee, branding, typing animation */

import { gsap } from "gsap";
import type { Scene } from "../story-controller";

const WORDS = ["Humans", "Menschen", "人間"];
const DELETE_SPEED = 40;
const TYPE_SPEED = 60;
const HOLD_DURATION = 4000;
const PAUSE_DURATION = 300;
const CLOUDS_PER_SET = 16;

let introLayer: HTMLElement;

export const introScene: Scene = {
	id: "intro",
	route: "/",
	weight: 1,

	setup() {
		const app = document.getElementById("app")!;

		introLayer = document.createElement("div");
		introLayer.id = "intro-layer";

		// Cloud band with two staggered rows
		const cloudBand = document.createElement("div");
		cloudBand.className = "cloud-band";
		cloudBand.appendChild(createCloudRow("cloud-row cloud-row-1"));
		cloudBand.appendChild(createCloudRow("cloud-row cloud-row-2"));

		// Branding text
		const branding = document.createElement("div");
		branding.className = "branding";

		const wordmark = document.createElement("div");
		wordmark.className = "wordmark";
		wordmark.textContent = "Weichart";

		const subtitle = document.createElement("div");
		subtitle.className = "subtitle";

		const prefix = document.createElement("span");
		prefix.textContent = "Apps for ";

		const typedWord = document.createElement("span");
		typedWord.className = "typed-word";
		typedWord.textContent = "Humans";

		const cursor = document.createElement("span");
		cursor.className = "cursor";
		cursor.textContent = "|";

		subtitle.append(prefix, typedWord, cursor);
		branding.append(wordmark, subtitle);

		introLayer.append(cloudBand, branding);
		document.body.insertBefore(introLayer, app);
	},

	register(_container, _spacer) {
		// Set initial background color
		const bgLayer = document.getElementById("bg-layer")!;
		bgLayer.style.backgroundColor = "#e1f7ff";

		// Set initial tree position (small at bottom)
		const treeLayer = document.getElementById("shared-tree")!;
		gsap.set(treeLayer, {
			top: "100%",
			width: "48vw",
			xPercent: -50,
			yPercent: -60,
		});

		// Start typing cycle
		const el = introLayer.querySelector<HTMLElement>(".typed-word");
		if (el) startTypingCycle(el);
	},
};

function createCloudRow(className: string): HTMLElement {
	const row = document.createElement("div");
	row.className = className;
	for (let i = 0; i < CLOUDS_PER_SET * 2; i++) {
		const cloud = document.createElement("img");
		cloud.src = "/cloud-colored.png";
		cloud.alt = "";
		cloud.className = "cloud-img";
		cloud.draggable = false;
		row.appendChild(cloud);
	}
	return row;
}

function startTypingCycle(el: HTMLElement): void {
	let wordIndex = 0;

	function cycle(): void {
		deleteText(el, () => {
			setTimeout(() => {
				wordIndex = (wordIndex + 1) % WORDS.length;
				typeText(el, WORDS[wordIndex], () => {
					setTimeout(cycle, HOLD_DURATION);
				});
			}, PAUSE_DURATION);
		});
	}

	setTimeout(cycle, HOLD_DURATION);
}

function deleteText(el: HTMLElement, onDone: () => void): void {
	const chars = Array.from(el.textContent ?? "");
	if (chars.length === 0) {
		onDone();
		return;
	}
	chars.pop();
	el.textContent = chars.join("");
	setTimeout(() => deleteText(el, onDone), DELETE_SPEED);
}

function typeText(el: HTMLElement, word: string, onDone: () => void): void {
	const chars = Array.from(word);
	let i = 0;
	function next(): void {
		if (i >= chars.length) {
			onDone();
			return;
		}
		i++;
		el.textContent = chars.slice(0, i).join("");
		setTimeout(next, TYPE_SPEED);
	}
	next();
}
