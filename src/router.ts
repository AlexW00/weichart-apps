/** URL ↔ level sync */

import { scrollToLevel, getActiveLevel, onLevelChange } from "./scroll";

const ROUTES = ["/", "/apps", "/about", "/newsletter"];

function levelForPath(path: string): number {
	const idx = ROUTES.indexOf(path);
	return idx >= 0 ? idx : 0;
}

export function initRouter(): void {
	// Check for GitHub Pages SPA redirect
	const searchParams = new URLSearchParams(window.location.search);
	const redirectPath = searchParams.get("p");
	if (redirectPath) {
		history.replaceState(null, "", redirectPath);
	}

	const initialLevel = levelForPath(window.location.pathname);

	// Replace current history entry so we don't create a duplicate
	history.replaceState({ level: initialLevel }, "", ROUTES[initialLevel]);

	// On initial load, jump to the matching level after layout settles
	if (initialLevel !== 0) {
		requestAnimationFrame(() => {
			scrollToLevel(initialLevel);
		});
	}

	// Update URL when active level changes via scrolling
	onLevelChange((index) => {
		const route = ROUTES[index];
		if (route && window.location.pathname !== route) {
			history.pushState({ level: index }, "", route);
		}
	});

	// Respond to browser back/forward
	window.addEventListener("popstate", (e) => {
		const state = e.state as { level?: number } | null;
		const level = state?.level ?? levelForPath(window.location.pathname);
		if (level !== getActiveLevel()) {
			scrollToLevel(level);
			// Update URL after programmatic scroll completes
			setTimeout(() => {
				const route = ROUTES[level];
				if (route && window.location.pathname !== route) {
					history.replaceState({ level }, "", route);
				}
			}, 900);
		}
	});
}
