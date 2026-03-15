/** URL ↔ scene sync */

import {
	jumpToIndex,
	jumpToScene,
	getActiveIndex,
	onSceneChange,
	sceneIndexById,
} from "./story-controller";

const ROUTE_TO_SCENE: Record<string, string> = {
	"/": "intro",
	"/apps": "apps",
	"/about": "alex",
	"/newsletter": "space",
};

const SCENE_TO_ROUTE: Record<string, string> = {};
for (const [route, scene] of Object.entries(ROUTE_TO_SCENE)) {
	SCENE_TO_ROUTE[scene] = route;
}

function sceneForPath(path: string): string {
	return ROUTE_TO_SCENE[path] ?? "intro";
}

export function initRouter(): void {
	// Check for GitHub Pages SPA redirect
	const searchParams = new URLSearchParams(window.location.search);
	const redirectPath = searchParams.get("p");
	if (redirectPath) {
		history.replaceState(null, "", redirectPath);
	}

	const initialScene = sceneForPath(window.location.pathname);
	const initialRoute = SCENE_TO_ROUTE[initialScene] ?? "/";

	// Replace current history entry
	history.replaceState({ scene: initialScene }, "", initialRoute);

	// On initial load, jump to the matching scene (no animation for deep links)
	if (initialScene !== "intro") {
		requestAnimationFrame(() => {
			jumpToScene(initialScene, false);
		});
	}

	// Update URL when active scene changes via scrolling
	onSceneChange((index) => {
		// Find the nearest scene with a route (skip transition which has no route)
		let sceneId = "";
		// Walk backward from index to find the best routable scene
		for (let i = index; i >= 0; i--) {
			// We need the scene id — use getActiveSceneId for current
			// but for arbitrary index we check known ids
			const ids = ["intro", "apps", "alex", "transition", "space"];
			const id = ids[i];
			if (id && SCENE_TO_ROUTE[id]) {
				sceneId = id;
				break;
			}
		}
		// For transition scene, keep the "about" route (alex)
		// For space scene, show "newsletter"
		if (index === 4) sceneId = "space";
		else if (index === 3) sceneId = "alex"; // transition shows as /about

		const route = SCENE_TO_ROUTE[sceneId] ?? "/";
		if (route && window.location.pathname !== route) {
			history.pushState({ scene: sceneId }, "", route);
		}
	});

	// Respond to browser back/forward
	window.addEventListener("popstate", (e) => {
		const state = e.state as { scene?: string } | null;
		const scene = state?.scene ?? sceneForPath(window.location.pathname);
		const idx = sceneIndexById(scene);
		if (idx >= 0 && idx !== getActiveIndex()) {
			jumpToIndex(idx);
			setTimeout(() => {
				const route = SCENE_TO_ROUTE[scene] ?? "/";
				if (route && window.location.pathname !== route) {
					history.replaceState({ scene }, "", route);
				}
			}, 900);
		}
	});
}
