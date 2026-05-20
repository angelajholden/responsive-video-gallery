export default function initThemeSwitcher() {
	const body = document.body;
	const savedTheme = localStorage.getItem("theme");
	const toggle = document.querySelector(".dark_mode-container");
	if (!toggle) return;

	if (savedTheme === "dark") {
		body.classList.add("dark");
	}

	toggle.addEventListener("click", () => {
		const isDark = body.classList.toggle("dark");
		if (isDark) {
			localStorage.setItem("theme", "dark");
		} else {
			localStorage.setItem("theme", "light");
		}
	});
}
