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
if (film) {
	// Playback stays user-initiated through the video's own controls.
	// Never resume automatically after the page returns to the foreground.
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) film.pause();
	});
}
