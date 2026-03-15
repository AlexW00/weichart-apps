/** Shared visual layers: DOM creation only (no animations) */

const STAR_ROWS = 6;
const DROP_COUNT = 3;

export const QUOTES = [
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

/** Create and append shared fixed layers to body, BEFORE #app */
export function createLayers(): void {
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

	// --- Alex layer (visible during alex & transition scenes) ---
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
