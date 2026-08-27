# Responsive Video Gallery

Responsive Video Gallery is a vanilla HTML, CSS and JavaScript project to make video galleries with YouTube and Vimeo `<iframe>` embeds. Everything here is static, so you can use it as-is, or modified to fit your project.

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
<meta property="og:image" content="https://i.vimeocdn.com/video/632046499-3b7d2a63050fe87a8f3be5f58e4d913a36b3b2c84f9c19c67b055e98e6e4f05b-d?f=webp®ion=us" />

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
	transition:
		background-color 300ms ease-in-out,
		border 300ms ease-in-out;
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
	max-width: min(100%, 150vh);
	padding: 2rem;
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
```

This is an example `<dialog>` element that's created and added to the DOM with JavaScript:

```html
<dialog class="dialog_modal" open="">
	<button class="close_dialog" aria-label="Close Video">
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"></path></svg>
	</button>
	<div class="dialog_frame">
		<iframe src="https://www.youtube.com/embed/BiKtBiHBQZQ" title="Heidi is Perfect" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>
	</div>
</dialog>
```

## Structured Data Strategy

This site is primarily a technical tutorial with a working video gallery demonstration. Its structured data should describe that main purpose without treating every demonstration video as a separate watch page.

The intended implementation is a small Schema.org `TechArticle` graph containing only information supported by the visible page:

- The canonical production URL and a stable identifier for the tutorial.
- The tutorial headline and description.
- English as the page language.
- Angela J. Holden as the author, supported by the visible “Written by” attribution in the footer.
- A screenshot of the finished project as the article image. The structured-data value should use the screenshot's absolute production URL, not a repository-relative path.

The graph intentionally does not include `VideoObject` entries. The videos are examples inside the tutorial rather than the main content of dedicated watch pages. Their players are created in a dialog after user interaction, and the page does not visibly provide all of the metadata that Google expects for video search features, such as an upload date, unique description, and duration for each video. Adding a `VideoObject` for every example would overstate the purpose of the page and create metadata that could become inaccurate when the project is reused.

The project also intentionally does not add ordinary links to the YouTube and Vimeo watch pages. The video IDs and provider types are used only to create the embedded players when a visitor selects a thumbnail.

Structured data can help search engines understand the tutorial, but a valid `TechArticle` does not guarantee a Google rich result. The markup should remain smaller than the visible content it describes and should not introduce facts that are absent from the page.

### Considerations for Forks

Structured data is site-specific even when the HTML, CSS, and JavaScript are reusable. Anyone publishing a fork should review the complete graph rather than inheriting the original project's identity and URLs unchanged.

Before deploying a fork:

- Replace the canonical URL, `@id`, `url`, and `mainEntityOfPage` values with URLs from the deployed site.
- Replace or remove the author details so they match a visible author attribution on the fork.
- Replace the article image with an absolute URL for a representative image that is visible on, or clearly represents, the forked page.
- Update the headline, description, and language when the visible page content changes.
- Remove `TechArticle` if the page is no longer primarily a technical tutorial.
- Do not add `datePublished`, `dateModified`, publisher details, proficiency levels, or other properties unless those facts are accurate and supported by the published page.
- Consider `VideoObject` only if a video becomes prominent, watchable on the indexed page, and is accompanied by the required visible and accurate metadata. A gallery item alone is not a reason to add video schema.
- Validate the deployed page with Google's Rich Results Test and the Schema.org validator after making changes.

## Design & Assets

The visual design and project assets are my original work unless otherwise noted.

- The code in this repository is 100% original and written by me.
- Images, graphics, mockups, and media assets are provided for demonstration and educational purposes.
- If a third-party font, API, library, or service is used, keep its original license and attribution with the project.
