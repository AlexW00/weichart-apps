/** Scene: Space / Newsletter — planet, rocket, cat, email form */

import { gsap } from "gsap";
import { openCaptcha } from "../captcha";
import type { Scene } from "../story-controller";

let spaceLayer: HTMLElement;

export const spaceScene: Scene = {
	id: "space",
	route: "/newsletter",
	weight: 1,

	setup() {
		const app = document.getElementById("app")!;

		spaceLayer = document.createElement("div");
		spaceLayer.id = "space-layer";

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

		// --- Rocket ---
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

		spaceLayer.appendChild(planetWrap);

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
		spaceLayer.appendChild(form);

		document.body.insertBefore(spaceLayer, app);
	},

	register(container, spacer) {
		// Show space layer when entering this scene
		gsap.set(spaceLayer, { autoAlpha: 0 });
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
			.to(spaceLayer, { autoAlpha: 1, ease: "none" });

		// Subscribe click → open captcha
		const btn = spaceLayer.querySelector(".l3-subscribe");
		if (btn) {
			btn.addEventListener("click", () => {
				openCaptcha();
			});
		}
	},
};
