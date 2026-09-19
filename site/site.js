document.documentElement.classList.add("js");

// The film plays on its own, silently, and stops when the tab is hidden or
// the person prefers reduced motion. One button pauses and resumes it; it is
// the film's only control, so the frame stays as clean as the app.
const film = document.querySelector("#desktop-film");
const toggle = document.querySelector(".film-toggle");
if (film instanceof HTMLVideoElement && toggle instanceof HTMLButtonElement) {
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
	// An explicit pause is the person's decision: returning to the tab must
	// not undo it. Kept here, not in the DOM, so the film's own pause event
	// (which follows every pause) cannot overwrite it.
	let pausedByUser = false;
	const reflect = () => {
		const playing = !film.paused && !film.ended;
		toggle.setAttribute("aria-label", playing ? "Pause film" : "Play film");
		toggle.dataset.state = playing ? "playing" : "paused";
	};
	const play = () => film.play().then(reflect, reflect);
	// With scripting, the one button replaces the native controls the
	// markup ships for everyone else.
	film.removeAttribute("controls");
	toggle.hidden = false;
	film.addEventListener("play", reflect);
	film.addEventListener("pause", reflect);
	toggle.addEventListener("click", () => {
		pausedByUser = !film.paused;
		if (film.paused) play();
		else film.pause();
	});
	if (reduce.matches) {
		film.removeAttribute("autoplay");
		film.pause();
	}
	reflect();
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) film.pause();
		else if (!reduce.matches && !pausedByUser) play();
	});
}

// "Ask your agent" menus: anchored menus that open and close like the app's,
// with Escape, outside clicks and arrow keys. One message per menu; the last
// item copies it for agents that run in a terminal or in Work itself.
for (const root of document.querySelectorAll(".ask-agent")) {
	const trigger = root.querySelector(".ask-agent-trigger");
	const menu = root.querySelector(".ask-agent-menu");
	if (!(trigger instanceof HTMLButtonElement) || !(menu instanceof HTMLElement))
		continue;
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
	const items = () => [...menu.querySelectorAll("[role=menuitem]")];
	const isOpen = () => trigger.getAttribute("aria-expanded") === "true";
	const open = () => {
		menu.hidden = false;
		menu.dataset.state = "open";
		trigger.setAttribute("aria-expanded", "true");
		items()[0]?.focus();
	};
	const finish = () => {
		menu.hidden = true;
		delete menu.dataset.state;
	};
	// Only a closing menu finishes on animation end: reopening during the
	// pop-out swaps the animation, and the pop-in's end must not hide it.
	menu.addEventListener("animationend", () => {
		if (menu.dataset.state === "closing") finish();
	});
	const close = ({ refocus = false } = {}) => {
		if (!isOpen()) return;
		trigger.setAttribute("aria-expanded", "false");
		if (reduce.matches) finish();
		else menu.dataset.state = "closing";
		if (refocus) trigger.focus();
	};
	trigger.addEventListener("click", () => (isOpen() ? close() : open()));
	document.addEventListener("pointerdown", (event) => {
		if (
			isOpen() &&
			event.target instanceof Node &&
			!menu.contains(event.target) &&
			!trigger.contains(event.target)
		)
			close();
	});
	document.addEventListener("keydown", (event) => {
		if (!isOpen()) return;
		if (event.key === "Escape") {
			event.preventDefault();
			close({ refocus: true });
			return;
		}
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			const list = items();
			const index = list.indexOf(document.activeElement);
			const next =
				event.key === "ArrowDown"
					? list[(index + 1) % list.length]
					: list[(index - 1 + list.length) % list.length];
			next?.focus();
		}
	});
	menu.addEventListener("click", (event) => {
		if (!(event.target instanceof Element)) return;
		const copy = event.target.closest(".ask-agent-copy");
		if (copy instanceof HTMLButtonElement) {
			const message = copy.dataset.message ?? "";
			// The resting label, captured once: a second click inside the
			// feedback window must not remember the feedback as the label.
			copy.dataset.label ??= copy.textContent ?? "";
			const label = copy.dataset.label;
			clearTimeout(Number(copy.dataset.timer));
			const settle = (text, done) => {
				copy.dataset.copied = "true";
				copy.textContent = text;
				copy.dataset.timer = String(
					setTimeout(() => {
						delete copy.dataset.copied;
						copy.textContent = label;
						if (done) close();
					}, 1400),
				);
			};
			writeClipboard(message).then(
				() => settle("Copied. Paste it into your agent.", true),
				() => settle("Could not copy. The message is written below.", false),
			);
			return;
		}
		if (event.target.closest("a")) close();
	});
}

// The Clipboard API needs a secure context; a temporary selection covers the
// rest (a LAN preview over plain http, older web views).
function writeClipboard(text) {
	if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
	return new Promise((resolve, reject) => {
		const area = document.createElement("textarea");
		area.value = text;
		area.setAttribute("readonly", "");
		area.style.position = "fixed";
		area.style.opacity = "0";
		document.body.append(area);
		area.select();
		const done = document.execCommand("copy");
		area.remove();
		done ? resolve() : reject(new Error("copy failed"));
	});
}
