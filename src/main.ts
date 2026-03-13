import "./style.css";

import * as level0 from "./levels/level0";
import * as level1 from "./levels/level1";
import * as level2 from "./levels/level2";
import * as transition23 from "./levels/transition23";
import * as level3 from "./levels/level3";
import * as captcha from "./captcha";
import { createSharedLayers, registerSharedLayers } from "./shared-layers";
import { initScroll, scrollToLevel, getActiveLevel, onLevelChange } from "./scroll";
import { initRouter } from "./router";

const app = document.querySelector<HTMLDivElement>("#app")!;

// Create shared visual layers (bg, tree, stars) — BEFORE sections
createSharedLayers();

// Build DOM: append each level section in narrative order
const levels = [level0, level1, level2, transition23, level3];
for (const level of levels) {
	app.appendChild(level.create());
}

// Captcha overlay is appended to body, not the scroll container
document.body.appendChild(captcha.create());

// Initialize scroll engine and router
initScroll(app);
initRouter();

// Register shared layer animations
registerSharedLayers(app);

// Register each level's animations with the scroll container
for (const level of levels) {
	level.register(app);
}

// --- Nav Controls ---
createNavControls();

function createNavControls(): void {
	const nav = document.createElement("div");
	nav.className = "nav-controls";

	const upBtn = document.createElement("button");
	upBtn.className = "nav-btn";
	upBtn.setAttribute("aria-label", "Scroll up");
	upBtn.innerHTML = '<span class="chevron up"></span>';

	const downBtn = document.createElement("button");
	downBtn.className = "nav-btn";
	downBtn.setAttribute("aria-label", "Scroll down");
	downBtn.innerHTML = '<span class="chevron down"></span>';

	nav.append(upBtn, downBtn);
	document.body.appendChild(nav);

	function updateDisabled(level: number): void {
		upBtn.classList.toggle("disabled", level === 0);
		downBtn.classList.toggle("disabled", level === 3);
	}

	updateDisabled(getActiveLevel());
	onLevelChange(updateDisabled);

	upBtn.addEventListener("click", () => {
		const cur = getActiveLevel();
		if (cur > 0) scrollToLevel(cur - 1);
	});

	downBtn.addEventListener("click", () => {
		const cur = getActiveLevel();
		if (cur < 3) scrollToLevel(cur + 1);
	});
}
captcha.register(app);
