/** Level 3: Space / Newsletter */

import { openCaptcha } from "../captcha";

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "level-3";
	section.className = "level";

	// --- Planet ---
	const planetWrap = document.createElement("div");
	planetWrap.className = "l3-planet-wrap";
	const planetImg = document.createElement("img");
	planetImg.src = "/rocket-planet.svg";
	planetImg.alt = "";
	planetImg.className = "l3-planet-img";
	planetImg.draggable = false;
	planetWrap.appendChild(planetImg);

	// --- Gantry (left of rocket) ---
	const gantry = document.createElement("img");
	gantry.src = "/rocket-stand.svg";
	gantry.alt = "Newsletter";
	gantry.className = "l3-gantry";
	gantry.draggable = false;
	planetWrap.appendChild(gantry);

	// --- Rocket (centered) ---
	const rocket = document.createElement("img");
	rocket.src = "/rocket.svg";
	rocket.alt = "Rocket";
	rocket.className = "l3-rocket";
	rocket.draggable = false;
	planetWrap.appendChild(rocket);

	// --- Sleeping cat ---
	const cat = document.createElement("img");
	cat.src = "/cat-sleeping.svg";
	cat.alt = "Sleeping cat";
	cat.id = "l3-cat";
	cat.className = "l3-cat";
	cat.draggable = false;
	planetWrap.appendChild(cat);

	section.appendChild(planetWrap);

	// --- Email form ---
	const form = document.createElement("form");
	form.className = "l3-form";
	form.addEventListener("submit", (e) => e.preventDefault());

	const input = document.createElement("input");
	input.type = "email";
	input.placeholder = "your@email.com";
	input.className = "l3-input";
	input.autocomplete = "email";

	const btn = document.createElement("button");
	btn.type = "button";
	btn.className = "l3-subscribe";
	btn.textContent = "Subscribe";

	form.appendChild(input);
	form.appendChild(btn);
	section.appendChild(form);

	return section;
}

export function register(_scrollContainer: HTMLElement): void {
	// --- Subscribe click ---
	const btn = document.querySelector("#level-3 .l3-subscribe");
	const input = document.querySelector<HTMLInputElement>("#level-3 .l3-input");
	if (btn && input) {
		btn.addEventListener("click", () => {
			openCaptcha();
		});
	}
}
