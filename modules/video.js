export default function initCreateDialog() {
	const body = document.body;
	const grid = document.querySelector(".grid");
	const videos = document.querySelectorAll(".article");
	if (!videos[0]) return;

	videos.forEach((video) => {
		const button = video.querySelector(".play_video");
		const title = video.querySelector(".video_title");

		button.addEventListener("click", () => {
			const dialog = document.createElement("dialog");
			dialog.classList.add("dialog_modal");

			const closeButton = document.createElement("button");
			closeButton.classList.add("close_dialog");
			closeButton.setAttribute("aria-label", "Close Video");
			closeButton.innerHTML = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>';

			const container = document.createElement("div");
			container.classList.add("dialog_frame");

			const id = button.dataset.attribute;
			const type = button.dataset.type;

			const iframe = document.createElement("iframe");
			iframe.title = title.textContent;
			iframe.referrerPolicy = "strict-origin-when-cross-origin";
			iframe.allowFullscreen = "";
			iframe.frameBorder = "0";
			if (type === "youtube") {
				iframe.src = `https://www.youtube.com/embed/${id}`;
				iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
			} else if (type === "vimeo") {
				iframe.src = `https://player.vimeo.com/video/${id}`;
				iframe.allow = "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share";
			}

			container.append(iframe);
			dialog.append(closeButton, container);
			grid.append(dialog);

			dialog.showModal();
			body.classList.add("dialog");

			closeButton.addEventListener("click", () => {
				dialog.remove();
				body.classList.remove("dialog");
			});

			dialog.addEventListener("click", (event) => {
				if (event.target === dialog) {
					dialog.remove();
					body.classList.remove("dialog");
				}
			});
		});
	});
}
