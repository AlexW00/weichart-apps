/** Level 1: App Tree (zoomed-in canopy) */

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

export function create(): HTMLElement {
	const section = document.createElement("section");
	section.id = "level-1";
	section.className = "level";

	// Label area (above icons, hidden by default)
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

	section.append(label, iconsRow);

	return section;
}

export function register(_scrollContainer: HTMLElement): void {
	const section = document.getElementById("level-1");
	if (!section) return;

	const label = section.querySelector<HTMLElement>(".l1-label");
	const labelName = section.querySelector<HTMLElement>(".l1-label-name");
	const labelDesc = section.querySelector<HTMLElement>(".l1-label-desc");
	const icons = section.querySelectorAll<HTMLElement>(".l1-app-icon");

	if (!label || !labelName || !labelDesc) return;

	let activeIcon: HTMLElement | null = null;

	function showLabel(icon: HTMLElement): void {
		if (!label || !labelName || !labelDesc) return;
		const name = icon.dataset.appName ?? "";
		const desc = icon.dataset.appDesc ?? "";
		labelName.textContent = name;
		labelDesc.textContent = desc;
		label.classList.add("l1-label--visible");
		activeIcon = icon;
	}

	function hideLabel(): void {
		if (!label) return;
		label.classList.remove("l1-label--visible");
		activeIcon = null;
	}

	// Pointer-based hover for devices that support it
	const supportsHover = window.matchMedia("(hover: hover)").matches;

	icons.forEach((icon) => {
		if (supportsHover) {
			icon.addEventListener("pointerenter", () => showLabel(icon));
			icon.addEventListener("pointerleave", () => hideLabel());
		} else {
			// Touch: tap toggles
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

	// Touch: tap outside hides label
	if (!supportsHover) {
		section.addEventListener("click", () => {
			if (activeIcon) hideLabel();
		});
	}
}
