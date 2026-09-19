document.documentElement.classList.add("js");

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
	const close = ({ refocus = false } = {}) => {
		if (!isOpen()) return;
		trigger.setAttribute("aria-expanded", "false");
		const finish = () => {
			menu.hidden = true;
			delete menu.dataset.state;
		};
		if (reduce.matches) finish();
		else {
			menu.dataset.state = "closing";
			menu.addEventListener("animationend", finish, { once: true });
		}
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
			const label = copy.textContent;
			navigator.clipboard?.writeText(message).then(() => {
				copy.dataset.copied = "true";
				copy.textContent = "Copied. Paste it into your agent.";
				setTimeout(() => {
					delete copy.dataset.copied;
					copy.textContent = label;
					close();
				}, 1400);
			});
			return;
		}
		if (event.target.closest("a")) close();
	});
}
