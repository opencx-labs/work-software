document.documentElement.classList.add("js");

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
if (menu && navigation) {
	menu.addEventListener("click", () => {
		const open = menu.getAttribute("aria-expanded") !== "true";
		menu.setAttribute("aria-expanded", String(open));
		navigation.classList.toggle("is-open", open);
		menu.textContent = open ? "Close" : "Menu";
	});
	document.addEventListener("keydown", (event) => {
		if (
			event.key === "Escape" &&
			menu.getAttribute("aria-expanded") === "true"
		) {
			menu.click();
			menu.focus();
		}
	});
}

// The film plays on its own, silently, and stops when the tab is hidden or
// the person prefers reduced motion. One button pauses and resumes it; it is
// the film's only control, so the frame stays as clean as the app.
const film = document.querySelector("#desktop-film");
const toggle = document.querySelector(".film-toggle");
if (film instanceof HTMLVideoElement && toggle instanceof HTMLButtonElement) {
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
	const reflect = () => {
		const playing = !film.paused && !film.ended;
		toggle.setAttribute("aria-pressed", String(!playing));
		toggle.setAttribute("aria-label", playing ? "Pause film" : "Play film");
		toggle.dataset.state = playing ? "playing" : "paused";
	};
	const play = () => film.play().then(reflect, reflect);
	toggle.hidden = false;
	film.addEventListener("play", reflect);
	film.addEventListener("pause", reflect);
	toggle.addEventListener("click", () => {
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
		else if (!reduce.matches && toggle.dataset.state !== "paused-by-user")
			play();
	});
	toggle.addEventListener("click", () => {
		// Remember an explicit pause so returning to the tab does not resume.
		toggle.dataset.state = film.paused ? "paused-by-user" : "playing";
	});
}

// "Ask your agent about Work": an anchored menu that opens and closes like
// the app's, with Escape, outside clicks and arrow keys.
const askTrigger = document.querySelector(".ask-agent-trigger");
const askMenu = document.querySelector("#ask-agent-menu");
if (askTrigger instanceof HTMLButtonElement && askMenu instanceof HTMLElement) {
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
	const items = () => [...askMenu.querySelectorAll("a[role=menuitem]")];
	const isOpen = () => askTrigger.getAttribute("aria-expanded") === "true";
	const open = () => {
		askMenu.hidden = false;
		askMenu.dataset.state = "open";
		askTrigger.setAttribute("aria-expanded", "true");
		items()[0]?.focus();
	};
	const close = ({ refocus = false } = {}) => {
		if (!isOpen()) return;
		askTrigger.setAttribute("aria-expanded", "false");
		const finish = () => {
			askMenu.hidden = true;
			delete askMenu.dataset.state;
		};
		if (reduce.matches) finish();
		else {
			askMenu.dataset.state = "closing";
			askMenu.addEventListener("animationend", finish, { once: true });
		}
		if (refocus) askTrigger.focus();
	};
	askTrigger.addEventListener("click", () => (isOpen() ? close() : open()));
	document.addEventListener("pointerdown", (event) => {
		if (
			isOpen() &&
			event.target instanceof Node &&
			!askMenu.contains(event.target) &&
			!askTrigger.contains(event.target)
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
	askMenu.addEventListener("click", (event) => {
		if (event.target instanceof Element && event.target.closest("a")) close();
	});
}
