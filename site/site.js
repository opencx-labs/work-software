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

const film = document.querySelector("#desktop-film");
const filmToggle = document.querySelector(".film-toggle");
if (film && filmToggle) {
	filmToggle.hidden = false;
	const syncPlayback = () => {
		const playing = !film.paused && !film.ended;
		filmToggle.querySelector("[data-film-icon]").textContent = playing
			? "Ⅱ"
			: "▶";
		filmToggle.querySelector("[data-film-label]").textContent = playing
			? "Pause film"
			: film.ended
				? "Replay film"
				: "Watch the film";
	};
	filmToggle.addEventListener("click", async () => {
		if (!film.paused) {
			film.pause();
			return;
		}
		if (film.ended) film.currentTime = 0;
		try {
			await film.play();
		} catch {
			film.focus();
		}
		syncPlayback();
	});
	for (const event of ["play", "pause", "ended"]) {
		film.addEventListener(event, syncPlayback);
	}
	// Motion is opt-in for everyone, including reduced-motion and data-saving users.
	// Preserve that choice when the page is backgrounded; never restart automatically.
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) film.pause();
	});
}
