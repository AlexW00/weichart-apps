/** Shared visual layers: background, tree, stars, and alex */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STAR_ROWS = 6;
const DROP_COUNT = 3;

const QUOTES = [
	"I make apps because sticky notes kept falling off my monitor.",
	"Currently powered by mass amounts of coffee and mass amounts of mass.",
	"The tree is a metaphor. Don't overthink it.",
	"Fun fact: I once debugged a CSS issue for 6 hours. It was a typo.",
	"Apps should be simple. Unlike my Spotify playlists.",
	"I promise the newsletter won't be boring. Probably.",
	"Welcome to my garden. No, you can't pick the apps.",
	"This website was built with love and mild frustration.",
	"If you're reading this, you're already my favorite visitor.",
	"I'm not a robot. But the captcha might disagree.",
];

/** Create and append shared layers to body, BEFORE #app */
export function createSharedLayers(): void {
	const app = document.getElementById("app")!;

	// --- Background layer ---
	const bgLayer = document.createElement("div");
	bgLayer.id = "bg-layer";
	document.body.insertBefore(bgLayer, app);

	// --- Stars layer ---
	const starsLayer = document.createElement("div");
	starsLayer.id = "shared-stars";
	for (let i = 0; i < STAR_ROWS; i++) {
		const row = document.createElement("div");
		row.className = "shared-star-row";
		const img = document.createElement("img");
		img.src = "/stars.svg";
		img.alt = "";
		img.draggable = false;
		row.appendChild(img);
		starsLayer.appendChild(row);
	}

	// Star-blink (Alex as star, upper-right)
	const starBlink = document.createElement("img");
	starBlink.src = "/star-blink.svg";
	starBlink.alt = "Alex";
	starBlink.id = "shared-star-blink";
	starBlink.draggable = false;
	starsLayer.appendChild(starBlink);

	document.body.insertBefore(starsLayer, app);

	// --- Tree layer ---
	const treeLayer = document.createElement("div");
	treeLayer.id = "shared-tree";
	const treeImg = document.createElement("img");
	treeImg.src = "/tree-colored.png";
	treeImg.alt = "";
	treeImg.draggable = false;
	treeLayer.appendChild(treeImg);

	// Thrust (appears during transition, moves with tree)
	const thrustWrap = document.createElement("div");
	thrustWrap.id = "shared-thrust";
	const thrustImg = document.createElement("img");
	thrustImg.src = "/rocket-thrust.svg";
	thrustImg.alt = "";
	thrustImg.draggable = false;
	thrustWrap.appendChild(thrustImg);
	treeLayer.appendChild(thrustWrap);

	document.body.insertBefore(treeLayer, app);

	// --- Alex layer (visible during L2 & transition) ---
	const alexLayer = document.createElement("div");
	alexLayer.id = "alex-layer";

	// Alex figure (head + body + watering can with drops)
	const alexFigure = document.createElement("div");
	alexFigure.className = "l2-alex";

	const alexHead = document.createElement("img");
	alexHead.src = "/face.png";
	alexHead.alt = "Alex";
	alexHead.className = "l2-head";
	alexHead.draggable = false;

	const alexBody = document.createElement("img");
	alexBody.src = "/human-base.svg";
	alexBody.alt = "";
	alexBody.className = "l2-body";
	alexBody.draggable = false;

	const canWrap = document.createElement("div");
	canWrap.className = "l2-can-wrap";
	const canImg = document.createElement("img");
	canImg.src = "/watering-can-colored.png";
	canImg.alt = "";
	canImg.className = "l2-can";
	canImg.draggable = false;
	canWrap.appendChild(canImg);

	const drops = document.createElement("div");
	drops.className = "l2-drops";
	for (let i = 0; i < DROP_COUNT; i++) {
		const drop = document.createElement("span");
		drop.className = "l2-drop";
		drop.style.animationDelay = `${i * 0.6}s`;
		drops.appendChild(drop);
	}
	canWrap.appendChild(drops);

	alexFigure.append(alexHead, alexBody, canWrap);

	// Arrow + "This is Alex" label
	const arrowWrap = document.createElement("div");
	arrowWrap.className = "l2-arrow-wrap";
	const arrowText = document.createElement("span");
	arrowText.className = "l2-arrow-text";
	arrowText.textContent = "This is Alex";
	const arrowImg = document.createElement("img");
	arrowImg.src = "/arrow.svg";
	arrowImg.alt = "";
	arrowImg.className = "l2-arrow-img";
	arrowImg.draggable = false;
	arrowWrap.append(arrowText, arrowImg);

	// Speech bubble
	const bubbleWrap = document.createElement("div");
	bubbleWrap.className = "l2-bubble-wrap";
	const bubbleImg = document.createElement("img");
	bubbleImg.src = "/speechbubble.png";
	bubbleImg.alt = "";
	bubbleImg.className = "l2-bubble-img";
	bubbleImg.draggable = false;
	const bubbleText = document.createElement("span");
	bubbleText.className = "l2-bubble-text";
	bubbleWrap.append(bubbleImg, bubbleText);

	alexLayer.append(alexFigure, arrowWrap, bubbleWrap);
	document.body.insertBefore(alexLayer, app);
}

/** Register scroll-driven animations for shared layers */
export function registerSharedLayers(scrollContainer: HTMLElement): void {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const bgLayer = document.getElementById("bg-layer")!;
	const treeLayer = document.getElementById("shared-tree")!;
	const starsLayer = document.getElementById("shared-stars")!;
	const alexLayer = document.getElementById("alex-layer")!;

	// ====== BACKGROUND ======

	// L0 (sky) → L1 (cream)
	gsap.timeline({
		scrollTrigger: {
			trigger: "#level-1",
			scroller: scrollContainer,
			start: "top bottom",
			end: "top top",
			scrub: true,
		},
	}).fromTo(
		bgLayer,
		{ backgroundColor: "#e1f7ff" },
		{ backgroundColor: "#fefef4", ease: "none" },
	);

	// Transition: cream → black
	gsap.timeline({
		scrollTrigger: {
			trigger: "#transition-2-3",
			scroller: scrollContainer,
			start: "top top",
			end: "bottom bottom",
			scrub: true,
		},
	}).to(bgLayer, { backgroundColor: "#000000", ease: "none" });

	bgLayer.style.backgroundColor = "#e1f7ff";

	// ====== TREE ======

	// Initial state (Level 0): small tree at bottom
	gsap.set(treeLayer, {
		top: "100%",
		width: "48vw",
		xPercent: -50,
		yPercent: -60,
	});

	// L0 → L1: zoom into canopy
	gsap.timeline({
		scrollTrigger: {
			trigger: "#level-1",
			scroller: scrollContainer,
			start: "top bottom",
			end: "top top",
			scrub: true,
		},
	}).to(treeLayer, {
		top: "-15%",
		width: "130vw",
		yPercent: 0,
		ease: "none",
	});

	// L1 → L2: keep 130vw, slide up to bottom-aligned (trunk visible)
	gsap.timeline({
		scrollTrigger: {
			trigger: "#level-2",
			scroller: scrollContainer,
			start: "top bottom",
			end: "top top",
			scrub: true,
		},
	}).to(treeLayer, {
		top: "100%",
		yPercent: -100,
		ease: "none",
	});

	// Transition: tree rises upward (rocket launch)
	gsap.timeline({
		scrollTrigger: {
			trigger: "#transition-2-3",
			scroller: scrollContainer,
			start: "top top",
			end: "70% top",
			scrub: true,
		},
	}).to(treeLayer, {
		y: "-150vh",
		ease: "none",
	});

	// Hide tree after it's risen off-screen
	ScrollTrigger.create({
		trigger: "#transition-2-3",
		scroller: scrollContainer,
		start: "70% top",
		onEnter: () => {
			treeLayer.style.visibility = "hidden";
		},
		onLeaveBack: () => {
			treeLayer.style.visibility = "visible";
		},
	});

	// Thrust: appears at start of transition
	const thrustWrap = document.getElementById("shared-thrust");
	if (thrustWrap) {
		gsap.timeline({
			scrollTrigger: {
				trigger: "#transition-2-3",
				scroller: scrollContainer,
				start: "top top",
				end: "5% top",
				scrub: true,
			},
		}).to(thrustWrap, { opacity: 1, ease: "none" });
	}

	// ====== STARS ======

	gsap.set(starsLayer, { opacity: 0 });

	gsap.timeline({
		scrollTrigger: {
			trigger: "#transition-2-3",
			scroller: scrollContainer,
			start: "30% top",
			end: "80% top",
			scrub: true,
		},
	}).to(starsLayer, { opacity: 1, ease: "none" });

	// Star drift (ambient animation)
	if (!prefersReducedMotion) {
		const starRows = document.querySelectorAll(
			"#shared-stars .shared-star-row",
		);
		const drifts = [
			{ x: 12, y: 3, duration: 40 },
			{ x: -8, y: -2, duration: 35 },
			{ x: 10, y: -4, duration: 45 },
			{ x: -14, y: 2, duration: 38 },
			{ x: 6, y: -3, duration: 42 },
			{ x: -10, y: 5, duration: 50 },
		];
		starRows.forEach((row, i) => {
			const d = drifts[i % drifts.length];
			gsap.to(row, {
				x: d.x,
				y: d.y,
				duration: d.duration,
				ease: "sine.inOut",
				yoyo: true,
				repeat: -1,
			});
		});

		const blink = document.getElementById("shared-star-blink");
		if (blink) {
			gsap.to(blink, {
				opacity: 0.3,
				duration: 2,
				ease: "sine.inOut",
				yoyo: true,
				repeat: -1,
			});
		}
	}

	// ====== ALEX LAYER ======

	gsap.set(alexLayer, { autoAlpha: 0 });

	// Fade in as L2 comes into view
	gsap.timeline({
		scrollTrigger: {
			trigger: "#level-2",
			scroller: scrollContainer,
			start: "top bottom",
			end: "top 60%",
			scrub: true,
		},
	}).to(alexLayer, { autoAlpha: 1, ease: "none" });

	// Trigger typing and arrow appear once when L2 enters
	ScrollTrigger.create({
		trigger: "#level-2",
		scroller: scrollContainer,
		start: "top 60%",
		once: true,
		onEnter: () => {
			const bt = alexLayer.querySelector<HTMLElement>(".l2-bubble-text");
			if (bt) {
				const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
				typeQuote(bt, quote);
			}
			const aw = alexLayer.querySelector<HTMLElement>(".l2-arrow-wrap");
			if (aw) setTimeout(() => aw.classList.add("l2-arrow-wrap--visible"), 300);
		},
	});

	// Transition: arrow/bubble fade out + Alex flies away
	const arrowEl = alexLayer.querySelector(".l2-arrow-wrap");
	const bubbleEl = alexLayer.querySelector(".l2-bubble-wrap");
	const alexFigure = alexLayer.querySelector(".l2-alex");

	const alexFlyTl = gsap.timeline({
		scrollTrigger: {
			trigger: "#transition-2-3",
			scroller: scrollContainer,
			start: "top top",
			end: "60% top",
			scrub: true,
		},
	});

	// Arrow/bubble fade out immediately
	if (arrowEl) alexFlyTl.to(arrowEl, { autoAlpha: 0, duration: 0.05 }, 0);
	if (bubbleEl) alexFlyTl.to(bubbleEl, { autoAlpha: 0, duration: 0.05 }, 0);

	// Alex figure fly-away
	if (alexFigure) {
		alexFlyTl.to(
			alexFigure,
			{
				x: "40vw",
				y: "-60vh",
				scale: 0.2,
				rotation: 45,
				ease: "power1.in",
				duration: 0.55,
			},
			0.05,
		);
	}

	// Hide alex layer after fly-away
	ScrollTrigger.create({
		trigger: "#transition-2-3",
		scroller: scrollContainer,
		start: "60% top",
		onEnter: () => {
			alexLayer.style.visibility = "hidden";
		},
		onLeaveBack: () => {
			alexLayer.style.visibility = "visible";
		},
	});

	// ====== SCREEN SHAKE ======

	if (!prefersReducedMotion) {
		ScrollTrigger.create({
			trigger: "#transition-2-3",
			scroller: scrollContainer,
			start: "top+=5% top",
			onEnter: () => {
				gsap.timeline()
					.to(document.body, { x: 3, duration: 0.05 })
					.to(document.body, { x: -3, duration: 0.05 })
					.to(document.body, { x: 3, duration: 0.05 })
					.to(document.body, { x: -2, duration: 0.05 })
					.to(document.body, { x: 2, duration: 0.05 })
					.to(document.body, { x: -1, duration: 0.05 })
					.to(document.body, { x: 0, duration: 0.05 });
				if (navigator.vibrate) navigator.vibrate(100);
			},
		});
	}
}

// --- Typing helper ---

function typeQuote(el: HTMLElement, text: string): void {
	const chars = Array.from(text);
	let i = 0;
	function next(): void {
		if (i >= chars.length) return;
		i++;
		el.textContent = chars.slice(0, i).join("");
		setTimeout(next, 45);
	}
	setTimeout(next, 800);
}
