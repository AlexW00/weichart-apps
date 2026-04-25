import "./style.css";

let rocketLaunched = false;

// ── Typing animation for "Humans" ──
const words = ["Humans", "Menschen", "人間", "Cats?"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById("typing-word")!;

function typeLoop() {
	const current = words[wordIndex];

	if (!isDeleting) {
		typingEl.textContent = current.slice(0, charIndex + 1);
		charIndex++;

		if (charIndex === current.length) {
			setTimeout(() => {
				isDeleting = true;
				typeLoop();
			}, 2500);
			return;
		}
		setTimeout(typeLoop, 100 + Math.random() * 60);
	} else {
		typingEl.textContent = current.slice(0, charIndex);
		charIndex--;

		if (charIndex < 0) {
			isDeleting = false;
			charIndex = 0;
			wordIndex = (wordIndex + 1) % words.length;
			setTimeout(typeLoop, 400);
			return;
		}
		setTimeout(typeLoop, 50 + Math.random() * 30);
	}
}

// Start typing after initial pause
setTimeout(() => {
	typingEl.textContent = words[0];
	charIndex = words[0].length;
	setTimeout(() => {
		isDeleting = true;
		typeLoop();
	}, 3000);
}, 2000);

// ── Scroll-driven animation ──
const treeContainer = document.getElementById("tree-container")!;
const titleEl = document.getElementById("title")!;
const cloudsEl = document.getElementById("clouds")!;
const skyGradient = document.getElementById("sky-gradient")!;
const screenshotBg = document.getElementById("screenshot-bg")!;
const appIcons = document.querySelectorAll<HTMLElement>(".app-icon");

appIcons.forEach((icon) => {
	const tip = icon.querySelector(".app-tooltip");
	if (!tip) return;
	const nameEl = tip.querySelector(".app-tooltip__name");
	const subEl = tip.querySelector(".app-tooltip__subtitle");
	if (nameEl) nameEl.textContent = icon.dataset.name ?? "";
	if (subEl) subEl.textContent = icon.dataset.subtitle ?? "";
});

// Set icon visibility once (these never change — removed from scroll handler)
appIcons.forEach((icon) => {
	icon.style.opacity = "1";
	icon.style.pointerEvents = "auto";
});

// Tree sizing (vh units) — must match #tree-container aspect-ratio in CSS
const TREE_MIN = 60;
const TREE_MAX = 90;
const TREE_W = 513;
const TREE_H = 693;

// Tree starts pushed down so trunk is cut off at bottom
const TREE_OFFSET_START = 20;
const TREE_OFFSET_END = 0;

/** Matches @media (max-width) for #title in style.css (centered block + stacked subtitle). */
const MOBILE_TITLE_LAYOUT_MAX_WIDTH = 600;

/** Same breakpoint as @media (max-width: 768px) for #screenshot-bg. Extra tree scale-from-scroll only here. */
const NARROW_NO_LANES_MAX_WIDTH = 768;

/** Mobile tree constants — smaller start, width-capped growth, no extra scale. */
const TREE_MIN_MOBILE = 35;
const TREE_MAX_MOBILE = 55; // usually capped by viewport-width constraint
const TREE_OFFSET_START_MOBILE = 6;
const TREE_OFFSET_END_MOBILE = 1; // trunk base just below viewport

// ── Cached viewport dimensions (updated on resize only, read in scroll handler) ──
let vw = window.innerWidth;
let vh = window.innerHeight;
let maxScroll = document.body.scrollHeight - vh;
let narrow = vw <= NARROW_NO_LANES_MAX_WIDTH;
let titleMobile = vw <= MOBILE_TITLE_LAYOUT_MAX_WIDTH;

/** Container's CSS-computed max height in vh (mirrors CSS min() for scale math). */
let containerVh = computeContainerVh();

function computeContainerVh(): number {
	const isNarrow = vw <= NARROW_NO_LANES_MAX_WIDTH;
	const maxVh = isNarrow ? TREE_MAX_MOBILE : TREE_MAX;
	const margin = isNarrow ? 40 : 24;
	const maxW = Math.max(0, vw - margin);
	const capPx = (maxW * TREE_H) / TREE_W;
	const capVh = (capPx / vh) * 100;
	return Math.min(maxVh, capVh);
}

function updateCachedDimensions() {
	vw = window.innerWidth;
	vh = window.innerHeight;
	maxScroll = document.body.scrollHeight - vh;
	narrow = vw <= NARROW_NO_LANES_MAX_WIDTH;
	titleMobile = vw <= MOBILE_TITLE_LAYOUT_MAX_WIDTH;
	containerVh = computeContainerVh();
}

const screenshotGroups =
	document.querySelectorAll<HTMLElement>(".screenshot-group");

function setAppHighlight(index: number) {
	if (index < 0 || index >= appIcons.length) {
		appIcons.forEach((icon) => icon.classList.remove("highlighted"));
		screenshotGroups.forEach((g) => g.classList.remove("active"));
		return;
	}

	appIcons.forEach((ic, i) => {
		ic.classList.toggle("highlighted", i === index);
	});
	screenshotGroups.forEach((g) => {
		g.classList.toggle("active", g.dataset.app === String(index));
	});
}

function easeOutCubic(t: number): number {
	return 1 - (1 - t) ** 3;
}

const cloudStrip = document.querySelector<HTMLElement>(".cloud-strip")!;

/** Snapshot of the 12-image row from HTML; extra copies are appended until the strip fills wide viewports. */
let cloudStripUnitHtml: string | null = null;

/** Wide windows are wider than one 12-cloud row, leaving empty sky on the right; tile until ~1.25× viewport. */
function tileCloudStrip() {
	if (cloudStripUnitHtml === null) {
		cloudStripUnitHtml = cloudStrip.innerHTML.trim();
	}
	const minWidth = Math.ceil(vw * 1.25);
	cloudStrip.innerHTML = cloudStripUnitHtml;
	// Before images have dimensions, scrollWidth can be 0 — add one duplicate and retry on load/resize.
	if (cloudStrip.scrollWidth < 1) {
		cloudStrip.insertAdjacentHTML("beforeend", cloudStripUnitHtml);
		cloudStrip.style.setProperty("--marquee-copies", "2");
		kickCloudMarquee();
		return;
	}
	let copies = 1;
	while (cloudStrip.scrollWidth < minWidth && copies < 32) {
		cloudStrip.insertAdjacentHTML("beforeend", cloudStripUnitHtml);
		copies++;
	}
	if (copies < 2) {
		cloudStrip.insertAdjacentHTML("beforeend", cloudStripUnitHtml);
		copies = 2;
	}
	cloudStrip.style.setProperty("--marquee-copies", String(copies));
	kickCloudMarquee();
}

/** Reattach the CSS marquee: fixes paused/stale animations after a long open tab, backgrounding, or bfcache. */
function kickCloudMarquee() {
	if (!cloudStrip) return;
	for (const anim of cloudStrip.getAnimations()) {
		if (anim.playState !== "running") {
			void anim.play();
		}
	}
	const prev = cloudStrip.style.animation;
	cloudStrip.style.animation = "none";
	void cloudStrip.offsetWidth;
	cloudStrip.style.animation = prev;
	for (const anim of cloudStrip.getAnimations()) {
		if (anim.playState !== "running") {
			void anim.play();
		}
	}
}

// True while scroll has fully faded the cloud layer (enables one restart when they reappear)
let cloudLayerFullyFaded = false;

function updateScene() {
	if (rocketLaunched) return;
	const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;

	// Scroll 0→1 = tree grows to full size (page height matches this range only)
	const eased = easeOutCubic(progress);

	let treeVh: number;
	let treeOffset: number;

	if (narrow) {
		// Mobile: tree, screenshots, and focus effects all use progress 0.1→0.5 so they end together
		const treeT = easeOutCubic(
			Math.min(Math.max((progress - 0.1) / 0.4, 0), 1),
		);
		treeVh = Math.min(
			TREE_MIN_MOBILE + (TREE_MAX_MOBILE - TREE_MIN_MOBILE) * treeT,
			containerVh,
		);
		treeOffset =
			TREE_OFFSET_START_MOBILE +
			(TREE_OFFSET_END_MOBILE - TREE_OFFSET_START_MOBILE) * treeT;
	} else {
		// Desktop: existing growth behavior
		treeVh = Math.min(TREE_MIN + (TREE_MAX - TREE_MIN) * eased, containerVh);
		treeOffset =
			TREE_OFFSET_START + (TREE_OFFSET_END - TREE_OFFSET_START) * eased;
	}

	// Tree: compositor-only transform (no layout-triggering height/bottom changes)
	const scale = containerVh > 0 ? treeVh / containerVh : 1;
	treeContainer.style.transform = `translateX(-50%) translateY(${treeOffset}vh) scale(${scale})`;

	// Title: same motion + fade on every layout (driven by scroll, not by sky)
	const parallaxMult = vw < 640 ? 0.45 : 1;
	const titleFade = Math.max(1 - eased * 2.5, 0);
	const titleScale = Math.max(1 - eased * 0.7, 0.3);
	const titleShift = -eased * 280 * parallaxMult;
	titleEl.style.opacity = String(titleFade);
	const titleTranslateY = titleMobile
		? `calc(-50% + ${titleShift}px)`
		: `${titleShift}px`;
	titleEl.style.transform = `translateX(-50%) translateY(${titleTranslateY}) scale(${titleScale})`;

	// Focus intensity: drives tooltip, icon rotation, and screenshot visibility
	// Aligned with tree growth so everything settles together (not before the tree stops)
	const focusIntensity = narrow
		? progress >= 0.5
			? 1
			: progress > 0.1
				? (progress - 0.1) / 0.4
				: 0
		: eased >= 0.7
			? 1
			: eased > 0.15
				? (eased - 0.15) / 0.55
				: 0;
	document.documentElement.style.setProperty(
		"--focus-intensity",
		String(focusIntensity),
	);
	screenshotBg.style.opacity = String(focusIntensity);

	// Alex walks out from behind the tree — starts at eased 0.3, finishes at eased 1.0
	const alexT = eased > 0.3 ? Math.min((eased - 0.3) / 0.7, 1) : 0;
	const alexLeft = 50 + alexT * 20;
	const alexZIndex = alexT >= 1 ? 5 : -1;
	const wobbleRotate = alexT < 1
		? Math.sin(alexT * Math.PI * 10) * 5 * (1 - alexT)
		: 0;
	const wobbleY = alexT < 1
		? Math.abs(Math.sin(alexT * Math.PI * 10)) * 6 * (1 - alexT)
		: 0;
	alexEl.style.left = `${alexLeft}%`;
	alexEl.style.zIndex = String(alexZIndex);
	alexEl.style.transform = `translateY(-${wobbleY}px) rotate(${wobbleRotate}deg)`;

	if (narrow) {
		// Mobile: sticky sky — no animation, clouds and gradient stay in place
		cloudsEl.style.opacity = "0.55";
		cloudsEl.style.transform = "translateY(0)";
		skyGradient.style.opacity = "1";
		skyGradient.style.transform = "translateY(0)";

		// Screenshot gap between sky and tree (top is fixed at 28vh via CSS)
		const treeTopVh = 100 + treeOffset - treeVh;
		const gapVh = treeTopVh - 28;
		screenshotBg.style.height = `${gapVh}vh`;
		screenshotBg.style.removeProperty("--ss-top-fade");
		screenshotBg.style.removeProperty("--ss-top-solid");

		// Dismiss tooltips when scrolled back (selection + screenshots stay via opacity)
		if (focusIntensity < 0.05) {
			appIcons.forEach((i) => i.classList.remove("is-touch-open"));
		}
	} else {
		// Desktop: clean up mobile inline styles
		screenshotBg.style.removeProperty("top");
		screenshotBg.style.removeProperty("height");

		// Desktop: sky/clouds parallax + fade out as tree grows
		const cloudFade = Math.max(0.55 * (1 - eased), 0);
		const cloudShift = -eased * 200;
		const gradientFade = Math.max(1 - eased, 0);
		const gradientShift = -eased * 160;

		cloudsEl.style.opacity = String(cloudFade);
		cloudsEl.style.transform = `translateY(${cloudShift}px)`;

		if (cloudFade < 0.01) {
			cloudLayerFullyFaded = true;
		} else if (cloudLayerFullyFaded) {
			cloudLayerFullyFaded = false;
			kickCloudMarquee();
		}

		skyGradient.style.opacity = String(gradientFade);
		skyGradient.style.transform = `translateY(${gradientShift}px)`;

		const topFade = 50 - 40 * eased;
		const topSolid = topFade + 10;
		screenshotBg.style.setProperty("--ss-top-fade", `${topFade}%`);
		screenshotBg.style.setProperty("--ss-top-solid", `${topSolid}%`);
	}
}

// ── Always-selected app: one app is always highlighted, can switch but not deselect ──
const touchToggle =
	typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

let selectedAppIndex = 0;

/** Whether the scroll animation has fully played (scroll near bottom). */
function isAnimationComplete(): boolean {
	return maxScroll > 0 && window.scrollY / maxScroll > 0.85;
}

/** Animated scroll to a target position over a given duration (ms). */
function animateScroll(target: number, duration: number) {
	const start = window.scrollY;
	const delta = target - start;
	if (delta === 0) return;
	const startTime = performance.now();

	function step(now: number) {
		const t = Math.min((now - startTime) / duration, 1);
		const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; // easeInOutCubic
		window.scrollTo(0, start + delta * eased);
		if (t < 1) requestAnimationFrame(step);
	}
	requestAnimationFrame(step);
}

/** Scroll to the bottom to play the full animation, then highlight the app. */
function scrollAndFocus(index: number) {
	selectedAppIndex = index;
	setAppHighlight(index);
	animateScroll(maxScroll, 1800);
}

appIcons.forEach((icon) => {
	const index = parseInt(icon.dataset.index ?? "-1", 10);

	if (!touchToggle) {
		// Desktop: hover selects app, click opens its URL (or scrolls first if at top)
		icon.addEventListener("mouseenter", () => {
			selectedAppIndex = index;
			setAppHighlight(index);
		});
		icon.addEventListener("focus", () => {
			selectedAppIndex = index;
			setAppHighlight(index);
		});
		icon.addEventListener("click", () => {
			if (!isAnimationComplete()) {
				scrollAndFocus(index);
				return;
			}
			const url = icon.dataset.url;
			if (url) window.open(url, "_blank", "noopener");
		});
	} else {
		// Mobile: first tap selects + shows tooltip, second tap opens URL
		// If animation hasn't played, first tap scrolls down + selects
		icon.addEventListener("click", (e) => {
			e.stopPropagation();
			// Dismiss Alex tooltip when tapping an app
			alexEl.classList.remove("is-touch-open");
			alexTouchOpen = false;
			appIcons.forEach((i) => i.classList.remove("hide-tooltip"));

			if (!isAnimationComplete()) {
				scrollAndFocus(index);
				appIcons.forEach((i) => i.classList.remove("is-touch-open"));
				icon.classList.add("is-touch-open");
				return;
			}
			if (selectedAppIndex === index) {
				const url = icon.dataset.url;
				if (url) window.open(url, "_blank", "noopener");
				return;
			}
			selectedAppIndex = index;
			setAppHighlight(index);
			appIcons.forEach((i) => i.classList.remove("is-touch-open"));
			icon.classList.add("is-touch-open");
		});
	}
});

// ── Alex interaction (tooltip + link, hides app tooltips on hover) ──
const alexEl = document.getElementById("alex")!;
const alexUrl = "https://alexanderweichart.de/1_Home/About--and--Contact";
let alexTouchOpen = false;

// ── Rocket launch sequence ──
function launchSequence() {
	if (rocketLaunched) return;
	rocketLaunched = true;


	const thrustEl = document.getElementById("thrust")!;
	const scene = document.getElementById("scene")!;

	// Snapshot the current tree transform so we can continue from it
	const currentTransform = treeContainer.style.transform;

	// Phase 1 (0ms): Screenshots fade out, tooltip changes to "?!"
	screenshotBg.classList.add("fade-out");
	const alexTooltipName = alexEl.querySelector(".app-tooltip__name") as HTMLElement;
	const alexTooltipSub = alexEl.querySelector(".app-tooltip__subtitle") as HTMLElement;
	if (alexTooltipName) alexTooltipName.textContent = "?!";
	if (alexTooltipSub) alexTooltipSub.textContent = "";
	alexEl.classList.add("alex-surprised");

	// Phase 2 (200ms): Alex runs off-screen + hide all app tooltips
	setTimeout(() => {
		alexEl.classList.add("alex-running");
		alexEl.classList.remove("is-touch-open");
		appIcons.forEach((icon) => {
			icon.classList.remove("highlighted", "is-touch-open");
			icon.classList.add("hide-tooltip");
		});

		// Calculate distance to right edge of screen from Alex's position
		const alexRect = alexEl.getBoundingClientRect();
		const runDistance = window.innerWidth - alexRect.left + alexRect.width;
		const runDuration = 1200; // finish before tree launches
		const runStart = performance.now();

		function alexRunLoop(now: number) {
			const elapsed = now - runStart;
			const t = Math.min(elapsed / runDuration, 1);
			const eased = t * t; // accelerating
			const x = eased * runDistance;
			const wobbleY = Math.sin(t * Math.PI * 6) * 8 * (1 - t);
			const wobbleR = Math.sin(t * Math.PI * 5) * 4 * (1 - t);
			alexEl.style.transform = `translateX(${x}px) translateY(${wobbleY}px) rotate(${wobbleR}deg)`;
			if (t >= 1) {
				alexEl.style.display = "none";
				return;
			}
			requestAnimationFrame(alexRunLoop);
		}
		requestAnimationFrame(alexRunLoop);
	}, 200);

	// Phase 3 (600ms): Screen rumble + thrust fades in during rumble
	setTimeout(() => {
		const rumbleStart = performance.now();
		const rumbleDuration = 900;

		function rumbleLoop(now: number) {
			const elapsed = now - rumbleStart;
			if (elapsed >= rumbleDuration) {
				scene.style.transform = "";
				thrustEl.style.opacity = "1";
				startLaunch();
				return;
			}
			const progress = elapsed / rumbleDuration;
			const amplitude = 1 + progress * 3;
			const rx = (Math.random() - 0.5) * 2 * amplitude;
			const ry = (Math.random() - 0.5) * 2 * amplitude;
			scene.style.transform = `translate(${rx}px, ${ry}px)`;
			// Fade in thrust during rumble
			thrustEl.style.opacity = String(progress);
			requestAnimationFrame(rumbleLoop);
		}
		requestAnimationFrame(rumbleLoop);
	}, 600);

	// Phase 5: Tree launches upward + background fades to black
	function startLaunch() {
		// Fade background to black, hide clouds and sky
		const overlay = document.getElementById("launch-overlay")!;
		let fadeStarted = false;
		const launchStart = performance.now();
		const launchDuration = 1200;

		// Parse current transform values
		const match = currentTransform.match(
			/translateY\(([^)]+)vh\)\s*scale\(([^)]+)\)/,
		);
		const baseOffsetVh = match ? parseFloat(match[1]) : 5;
		const baseScale = match ? parseFloat(match[2]) : 1;
		const scene = document.getElementById("scene")!;

		function launchLoop(now: number) {
			const elapsed = now - launchStart;
			const t = Math.min(elapsed / launchDuration, 1);

			// Fade to black when tree is halfway gone
			if (t >= 0.5 && !fadeStarted) {
				fadeStarted = true;
				overlay.classList.add("active");
				cloudsEl.style.transition = "opacity 0.6s ease";
				cloudsEl.style.opacity = "0";
				skyGradient.style.transition = "opacity 0.6s ease";
				skyGradient.style.opacity = "0";
			}

			// Quadratic easing (accelerating upward)
			const displacement = t * t * 250;

			treeContainer.style.transform =
				`translateX(-50%) translateY(${baseOffsetVh - displacement}vh) scale(${baseScale})`;

			// Diminishing rumble during launch
			const rumbleAmp = (1 - t) * 2;
			const rx = (Math.random() - 0.5) * 2 * rumbleAmp;
			const ry = (Math.random() - 0.5) * 2 * rumbleAmp;
			scene.style.transform = `translate(${rx}px, ${ry}px)`;

			if (t >= 1) {
				scene.style.transform = "";
				// Pause on black, then white circle wipe, then navigate
				setTimeout(() => {
					const wipe = document.getElementById("launch-wipe")!;
					const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2.5;
					const wipeDuration = 600;
					const wipeStart = performance.now();

					function wipeLoop(now: number) {
						const elapsed = now - wipeStart;
						const wt = Math.min(elapsed / wipeDuration, 1);
						const eased = 1 - (1 - wt) ** 3; // easeOutCubic
						const size = eased * maxDim;
						wipe.style.width = `${size}px`;
						wipe.style.height = `${size}px`;
						if (wt >= 1) {
							window.location.href = alexUrl;
							// Fallback link if redirect doesn't work
							setTimeout(() => {
								const fallback = document.getElementById("fallback-link")!;
								const link = fallback.querySelector("a")!;
								link.href = alexUrl;
								fallback.style.display = "block";
							}, 1000);
							return;
						}
						requestAnimationFrame(wipeLoop);
					}
					requestAnimationFrame(wipeLoop);
				}, 500);
				return;
			}
			requestAnimationFrame(launchLoop);
		}
		requestAnimationFrame(launchLoop);
	}
}

// Intercept clicks on Alex's tooltip link — trigger launch instead of navigating
const alexTooltipLink = alexEl.querySelector(".app-tooltip__name");
if (alexTooltipLink) {
	alexTooltipLink.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		launchSequence();
	});
}

if (!touchToggle) {
	alexEl.addEventListener("mouseenter", () => {
		appIcons.forEach((i) => i.classList.add("hide-tooltip"));
	});
	alexEl.addEventListener("mouseleave", () => {
		appIcons.forEach((i) => i.classList.remove("hide-tooltip"));
	});
	alexEl.addEventListener("click", () => {
		launchSequence();
	});
} else {
	alexEl.addEventListener("click", (e) => {
		e.stopPropagation();
		if (alexTouchOpen) {
			launchSequence();
			return;
		}
		alexTouchOpen = true;
		alexEl.classList.add("is-touch-open");
		appIcons.forEach((i) => {
			i.classList.remove("is-touch-open");
			i.classList.add("hide-tooltip");
		});
	});
}

// Mobile: background tap dismisses tooltip but keeps selection
if (touchToggle) {
	document.addEventListener("click", () => {
		appIcons.forEach((i) => {
			i.classList.remove("is-touch-open");
			i.classList.remove("hide-tooltip");
		});
		alexEl.classList.remove("is-touch-open");
		alexTouchOpen = false;
	});
}

// Default: first app selected from page load
setAppHighlight(selectedAppIndex);

// ── Init ──
// rAF-gated scroll: at most one scene update per animation frame
let scrollTicking = false;
window.addEventListener(
	"scroll",
	() => {
		if (!scrollTicking) {
			scrollTicking = true;
			requestAnimationFrame(() => {
				updateScene();
				scrollTicking = false;
			});
		}
	},
	{ passive: true },
);

document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "visible") {
		kickCloudMarquee();
	}
});
window.addEventListener("pageshow", (e: PageTransitionEvent) => {
	if (e.persisted) {
		kickCloudMarquee();
		// Reset page if coming back after rocket launch
		if (rocketLaunched) {
			window.location.reload();
		}
	}
});

let resizeDebounce: number | null = null;
window.addEventListener("resize", () => {
	if (resizeDebounce !== null) {
		window.clearTimeout(resizeDebounce);
	}
	resizeDebounce = window.setTimeout(() => {
		resizeDebounce = null;
		updateCachedDimensions();
		tileCloudStrip();
		updateScene();
	}, 150);
});

tileCloudStrip();
window.addEventListener("load", () => {
	tileCloudStrip();
});
updateScene();
