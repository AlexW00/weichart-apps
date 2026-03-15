import "./style.css";

import { createLayers } from "./layers";
import {
	addScene,
	init,
	jumpToIndex,
	getActiveIndex,
	getSceneCount,
	onSceneChange,
} from "./story-controller";
import { introScene } from "./scenes/intro";
import { appsScene } from "./scenes/apps";
import { alexScene } from "./scenes/alex";
import { transitionScene } from "./scenes/transition";
import { spaceScene } from "./scenes/space";
import * as captcha from "./captcha";
import { initRouter } from "./router";

const app = document.querySelector<HTMLDivElement>("#app")!;

// Create shared fixed layers (bg, tree, stars, alex) — BEFORE #app
createLayers();

// Register scenes in narrative order
addScene(introScene);
addScene(appsScene);
addScene(alexScene);
addScene(transitionScene);
addScene(spaceScene);

// Captcha overlay appended to body
document.body.appendChild(captcha.create());

// Initialize controller: creates spacers, setups, registers animations
init(app);

// Router: URL ↔ scene sync
initRouter();

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

	const lastIdx = getSceneCount() - 1;

	function updateDisabled(index: number): void {
		upBtn.classList.toggle("disabled", index === 0);
		downBtn.classList.toggle("disabled", index === lastIdx);
	}

	updateDisabled(getActiveIndex());
	onSceneChange(updateDisabled);

	upBtn.addEventListener("click", () => {
		const cur = getActiveIndex();
		if (cur > 0) jumpToIndex(cur - 1);
	});

	downBtn.addEventListener("click", () => {
		const cur = getActiveIndex();
		if (cur < lastIdx) jumpToIndex(cur + 1);
	});
}
