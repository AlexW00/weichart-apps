/** Fake captcha modal + rocket launch sequence */

import { gsap } from "gsap";
import { lockScroll, unlockScroll } from "./story-controller";

let overlay: HTMLElement;
let launched = false;
let previouslyFocused: HTMLElement | null = null;

export function create(): HTMLElement {
	overlay = document.createElement("div");
	overlay.id = "captcha-overlay";

	const modal = document.createElement("div");
	modal.className = "captcha-modal";

	// Button area — bottom-aligned container
	const btnWrap = document.createElement("div");
	btnWrap.className = "captcha-btn-wrap";

	const btnImg = document.createElement("img");
	btnImg.src = "/button.png";
	btnImg.alt = "Do NOT press this button";
	btnImg.className = "captcha-btn-img";
	btnImg.draggable = false;
	btnImg.tabIndex = 0;
	btnImg.setAttribute("role", "button");
	btnWrap.appendChild(btnImg);

	// Loading text (hidden initially)
	const loadingText = document.createElement("div");
	loadingText.className = "captcha-loading";
	loadingText.textContent = "Sigh... I knew it...";
	loadingText.style.display = "none";
	btnWrap.appendChild(loadingText);

	modal.appendChild(btnWrap);

	// Cancel button
	const cancel = document.createElement("button");
	cancel.className = "captcha-cancel";
	cancel.textContent = "Cancel";
	cancel.type = "button";
	modal.appendChild(cancel);

	overlay.appendChild(modal);

	// --- Event handlers ---
	const cat = () =>
		document.getElementById("l3-cat") as HTMLImageElement | null;

	btnImg.addEventListener("mouseenter", () => {
		btnImg.src = "/button-hovered.png";
		const c = cat();
		if (c) c.src = "/cat-wake.svg";
	});

	btnImg.addEventListener("mouseleave", () => {
		btnImg.src = "/button.png";
		const c = cat();
		if (c) c.src = "/cat-sleeping.svg";
	});

	btnImg.addEventListener("mousedown", () => {
		btnImg.src = "/button-pressed.png";
	});

	btnImg.addEventListener("mouseup", () => {
		btnImg.src = "/button-hovered.png";
	});

	btnImg.addEventListener("click", () => {
		handleForbiddenPress(btnImg, loadingText);
	});

	cancel.addEventListener("click", () => {
		closeCaptcha();
	});

	// Close on overlay background click
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) closeCaptcha();
	});

	// Close on Escape
	overlay.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeCaptcha();
	});

	// Focus trap: Tab/Shift+Tab cycle within modal
	modal.addEventListener("keydown", (e) => {
		if (e.key !== "Tab") return;
		const focusable = modal.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (e.shiftKey) {
			if (document.activeElement === first) {
				e.preventDefault();
				last.focus();
			}
		} else {
			if (document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	});

	return overlay;
}

export function register(_scrollContainer: HTMLElement): void {
	// No-op — interactions wired in create()
}

export function openCaptcha(): void {
	if (launched) return;
	previouslyFocused = document.activeElement as HTMLElement | null;
	overlay.classList.add("open");
	// Move focus into modal
	const firstFocusable = overlay.querySelector<HTMLElement>(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
	);
	if (firstFocusable) {
		requestAnimationFrame(() => firstFocusable.focus());
	}
}

function closeCaptcha(): void {
	overlay.classList.remove("open");
	// Reset cat to sleeping if it was woken by hover
	const cat = document.getElementById("l3-cat") as HTMLImageElement | null;
	if (cat) cat.src = "/cat-sleeping.svg";
	// Restore focus
	if (previouslyFocused) {
		previouslyFocused.focus();
		previouslyFocused = null;
	}
}

function handleForbiddenPress(
	btnImg: HTMLImageElement,
	loadingText: HTMLElement,
): void {
	// Show pressed briefly, then swap to loading text
	btnImg.src = "/button-pressed.png";
	setTimeout(() => {
		btnImg.style.display = "none";
		loadingText.style.display = "flex";

		// Wake cat during sequence
		const cat = document.getElementById("l3-cat") as HTMLImageElement | null;
		if (cat) cat.src = "/cat-wake.svg";

		// After 3s, close modal and start countdown
		setTimeout(() => {
			closeCaptcha();
			// Keep cat awake for launch
			if (cat) cat.src = "/cat-wake.svg";
			runCountdownAndLaunch();
		}, 3000);
	}, 300);
}

function runCountdownAndLaunch(): void {
	lockScroll();

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const section = document.getElementById("space-layer");
	if (!section) return;

	const positions = prefersReducedMotion
		? [
				{ x: "50%", y: "50%" },
				{ x: "50%", y: "50%" },
				{ x: "50%", y: "50%" },
			]
		: [
				{ x: "30%", y: "25%" },
				{ x: "60%", y: "40%" },
				{ x: "45%", y: "15%" },
			];

	const tl = gsap.timeline({
		onComplete: () => {
			launchRocket();
		},
	});

	[3, 2, 1].forEach((num, i) => {
		const el = document.createElement("div");
		el.className = "l3-countdown";
		el.textContent = String(num);
		el.style.left = positions[i].x;
		el.style.top = positions[i].y;
		section.appendChild(el);

		tl.fromTo(
			el,
			{ opacity: 0, scale: 0.3 },
			{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" },
			i * 0.9,
		);
		tl.to(
			el,
			{ opacity: 0, scale: 1.5, duration: 0.4, ease: "power2.in" },
			i * 0.9 + 0.5,
		);
		tl.call(() => el.remove(), [], i * 0.9 + 0.9);
	});
}

function launchRocket(): void {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const section = document.getElementById("space-layer");
	const rocket = section?.querySelector<HTMLElement>(".l3-rocket");
	const planetWrap = section?.querySelector<HTMLElement>(".l3-planet-wrap");
	if (!section || !rocket || !planetWrap) return;

	// Create thrust element
	const thrust = document.createElement("img");
	thrust.src = "/rocket-thrust.svg";
	thrust.alt = "";
	thrust.className = "l3-thrust";
	thrust.draggable = false;

	// Position thrust relative to planet-wrap, same positioning context as rocket
	planetWrap.appendChild(thrust);

	// Match thrust horizontal center to rocket
	const rocketStyle = getComputedStyle(rocket);
	thrust.style.left = rocketStyle.left;
	thrust.style.bottom = rocketStyle.bottom;

	const launchTl = gsap.timeline({
		onComplete: () => {
			postLaunch(rocket, thrust);
		},
	});

	// Screen shake at liftoff
	if (!prefersReducedMotion) {
		launchTl.to(section, { x: 3, duration: 0.05 });
		launchTl.to(section, { x: -3, duration: 0.05 });
		launchTl.to(section, { x: 3, duration: 0.05 });
		launchTl.to(section, { x: -2, duration: 0.05 });
		launchTl.to(section, { x: 2, duration: 0.05 });
		launchTl.to(section, { x: -1, duration: 0.05 });
		launchTl.to(section, { x: 0, duration: 0.05 });
	}

	// Grow thrust
	launchTl.fromTo(
		thrust,
		{ scaleY: 0.2, opacity: 0 },
		{ scaleY: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
		0.2,
	);

	// Vibrate
	if (!prefersReducedMotion && navigator.vibrate) navigator.vibrate(100);

	// Rocket + thrust fly up together
	launchTl.to(
		[rocket, thrust],
		{
			y: -window.innerHeight * 2,
			duration: 2.5,
			ease: "power2.in",
		},
		0.6,
	);

	// Grow thrust more during flight
	launchTl.to(thrust, { scaleY: 1.8, duration: 2.5, ease: "power1.in" }, 0.6);
}

function postLaunch(rocket: HTMLElement, thrust: HTMLElement): void {
	launched = true;

	// Remove rocket and thrust from DOM
	rocket.style.display = "none";
	thrust.remove();

	// Cat back to sleeping
	const cat = document.getElementById("l3-cat") as HTMLImageElement | null;
	if (cat) cat.src = "/cat-sleeping.svg";

	// Disable form
	const form = document.querySelector<HTMLElement>("#space-layer .l3-form");
	if (form) form.classList.add("disabled");

	const input = document.querySelector<HTMLInputElement>(
		"#space-layer .l3-input",
	);
	if (input) input.disabled = true;

	const btn = document.querySelector<HTMLButtonElement>(
		"#space-layer .l3-subscribe",
	);
	if (btn) btn.disabled = true;

	// Reset captcha modal for next open (won't happen since launched=true)
	const btnImg = overlay.querySelector<HTMLImageElement>(".captcha-btn-img");
	const loadingText = overlay.querySelector<HTMLElement>(".captcha-loading");
	if (btnImg) {
		btnImg.style.display = "";
		btnImg.src = "/button.png";
	}
	if (loadingText) loadingText.style.display = "none";

	unlockScroll();
}
