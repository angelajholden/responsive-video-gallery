export default function initCopyright() {
	const dates = document.querySelectorAll("#date");
	const year = new Date().getFullYear();

	if (!dates[0]) return;

	dates.forEach((date) => {
		date.textContent = year;
	});
}
