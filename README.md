# Responsive Video Gallery

With semantic HTML, CSS Grid and vanilla JavaScript, create a responsive video gallery with videos from YouTube and Vimeo.

## The HTML

Each `<article>` has a `<figure>` with an `<img>` and a `<button>`. The `<iframe>` doesn't load in the grid. On click, a `<dialog>` element loads the video.

The `<img src>` is a YouTube (or Vimeo) thumbnail link. The following are examples of urls with ids, and how to find the `<img src>`.

```html
<!-- YouTube urls with video id -->
https://www.youtube.com/watch?v=szRgEyiX6Sk https://youtu.be/szRgEyiX6Sk

<!-- YouTube thumbnail src -->
https://img.youtube.com/vi/szRgEyiX6Sk/mqdefault.jpg

<!-- Vimeo url with video id -->
https://vimeo.com/7533229

<!--
The Vimeo thumbnail src is embedded in the page source code.
Right click on the Vimeo page and 'View Page Source'.
Search for an og:image meta tag to find the thumbnail.
-->
<meta property="og:image:secure_url" content="https://i.vimeocdn.com/video/632046499-3b7d2a63050fe87a8f3be5f58e4d913a36b3b2c84f9c19c67b055e98e6e4f05b-d?f=webp®ion=us" />

<!-- Vimeo thumbnail url -->
https://i.vimeocdn.com/video/632046499-3b7d2a63050fe87a8f3be5f58e4d913a36b3b2c84f9c19c67b055e98e6e4f05b-d?f=webp®ion=us
```

The HTML is semantic and accessible:

```html
<!-- grid + wrap -->
<div class="grid">
	<!-- video container -->
	<article class="article">
		<!-- image container -->
		<figure class="figure">
			<!-- thumbnail image: update the video id + alt text -->
			<img src="https://img.youtube.com/vi/szRgEyiX6Sk/mqdefault.jpg" alt="Deploy a Website to DigitalOcean 💧 LAMP + SFTP (FileZilla) + DNS Setup" />
			<!-- play button: update the video id + type -->
			<button class="play_video" data-id="szRgEyiX6Sk" data-type="youtube" aria-label="Play Video">
				<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z" /></svg>
			</button>
		</figure>
		<!-- video title: adjust this for the template hierarchy -->
		<h3 class="video_title">Deploy a Website to DigitalOcean 💧 LAMP + SFTP (FileZilla) + DNS Setup</h3>
	</article>
</div>
```

## The CSS

Next use vanilla CSS and CSS Grid to style the grid and the thumbnails.

```css
/* CSS Grid w/four columns */
.grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 2rem;
}

/* image container with 16:9 aspect ratio */
.figure {
	position: relative;
	margin: 0 0 0.5rem;
	width: 100%;
	height: auto;
	aspect-ratio: 16 / 9;
}

/* responsive thumbnail images */
img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* play button to create the iframe */
.play_video {
	position: absolute;
	top: 50%;
	left: 50%;
	padding: 0.5rem 0.333rem 0.5rem 0.666rem;
	border: 2px solid #2d5273;
	border-radius: 50%;
	background-color: #fff;
	transform: translate(-50%, -50%);
	transition: background-color 300ms ease-in-out, border 300ms ease-in-out;
}

svg {
	width: 2rem;
	height: 2rem;
	fill: #2d5273;
	transition: fill 300ms ease-in-out;
}

/* focus + hover states for play button */
.play_video:focus,
.play_video:hover,
.play_video:active {
	border: 2px solid #fff;
	background-color: #2d5273;
}

.play_video:focus svg,
.play_video:hover svg,
.play_video:active svg {
	fill: #fff;
}

.video_title {
	font-size: clamp(1rem, 1.5vw, 1.1rem);
	font-weight: 500;
	letter-spacing: 0;
	text-transform: none;
	line-height: 1.5;
}

/* responsive grid columns */
@media (max-width: 1024px) {
	.wrap {
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
}

@media (max-width: 768px) {
	.wrap {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 600px) {
	.wrap {
		grid-template-columns: 1fr;
	}
}
```

Next are styles for the `<dialog>` that holds the video `<iframe>`. The markup for the `<dialog>` and `<iframe>` are created with vanilla JavaScript (below).

```css
/* body class so page doesn't scroll when dialog is open */
.dialog {
	overflow: hidden;
}

/* dialog element */
.dialog_modal {
	padding: 2rem 2rem 0 0;
	border: 0;
	background-color: transparent;
}

/* iframe container for styling */
.dialog_frame {
	width: 1200px;
	max-width: 100%;
	height: auto;
	aspect-ratio: 16 / 9;
}

/* iframe that contains the video */
.dialog_modal iframe {
	display: block;
	width: 100%;
	height: 100%;
}

/* psuedo element for the dialog element */
.dialog_modal::backdrop {
	background-color: rgba(0, 0, 0, 75%);
}

/* button to close the dialog */
.close_dialog {
	padding: calc(0.5rem - 2px);
	position: absolute;
	top: 0;
	right: 0;
	border: 2px solid var(--white);
	border-radius: 50%;
	background-color: var(--black);
	z-index: 3;
	transition: background-color 300ms ease-in-out;
}

/* focus + hover for the close button */
.close_dialog:focus,
.close_dialog:hover,
.close_dialog:active {
	background-color: var(--white);
}

.close_dialog svg {
	stroke: var(--white);
	transition: stroke 300ms ease-in-out;
}

.close_dialog:focus svg,
.close_dialog:hover svg,
.close_dialog:active svg {
	stroke: var(--black);
}
```

## The JavaScript

```javascript
// wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
	// build an array of all videos
	const videos = document.querySelectorAll(".article");

	// loop through the videos
	videos.forEach((video) => {
		// define play button + video title
		const button = video.querySelector(".play_video");
		const title = video.querySelector(".video_title");

		// click event for the button
		button.addEventListener("click", (e) => {
			// make sure all dialogs are removed
			document.querySelectorAll("dialog.dialog_modal").forEach((d) => d.remove());

			// create dialog element
			const grid = document.querySelector(".grid");
			const dialog = document.createElement("dialog");
			dialog.classList.add("dialog_modal");
			// insert dialog element
			grid.insertAdjacentElement("afterend", dialog);

			// create close button
			const closeButton = document.createElement("button");
			closeButton.classList.add("close_dialog");
			closeButton.setAttribute("aria-label", "Close Video");
			closeButton.innerHTML = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/>';
			// inset close button
			dialog.insertAdjacentElement("afterbegin", closeButton);

			// create iframe container
			const container = document.createElement("div");
			container.classList.add("dialog_frame");
			// insert iframe container
			dialog.insertAdjacentElement("beforeend", container);

			// get data attributes
			const id = e.currentTarget.dataset.attribute;
			const type = e.currentTarget.dataset.type;

			// create iframe element
			const iframe = document.createElement("iframe");
			if (type === "youtube") {
				iframe.setAttribute("src", `https://www.youtube.com/embed/${id}`);
				iframe.setAttribute("title", title.textContent);
				iframe.setAttribute("frameborder", "0");
				iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
				iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
				iframe.setAttribute("allowfullscreen", "");
			} else if (type === "vimeo") {
				// vimeo
			}
			// insert iframe
			container.insertAdjacentElement("beforeend", iframe);

			// show modal dialog + add body class
			dialog.showModal();
			body.classList.add("dialog");

			// remove modal dialog + remove body class
			closeButton.addEventListener("click", () => {
				dialog.remove();
				body.classList.remove("dialog");
			});

			// click backdrop to close dialog
			dialog.addEventListener("click", (event) => {
				if (event.target === dialog) {
					dialog.remove();
					body.classList.remove("dialog");
				}
			});
		});
	});
});
```

This is an example `<dialog>` element that's created and added to the DOM with JavaScript:

```html
<dialog class="dialog_modal" open="">
	<button class="close_dialog" aria-label="Close Video">
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"></path></svg>
	</button>
	<div class="dialog_frame">
		<iframe src="https://www.youtube.com/embed/szRgEyiX6Sk" title="Deploy a Website to DigitalOcean 💧 LAMP + SFTP (FileZilla) + DNS Setup" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>
	</div>
</dialog>
```
