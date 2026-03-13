/** Level 2: Alex Watering — section trigger only (content in shared alex-layer) */

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "level-2";
	section.className = "level";
	return section;
}

export function register(_scrollContainer: HTMLElement): void {
	// Alex layer animations handled by shared-layers.ts
}
