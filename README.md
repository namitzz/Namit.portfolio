# Namit Singh Sarna — Portfolio

Scroll-based personal portfolio where each project changes the visual theme
as it enters view. Background, accent colours, and mockup UIs transition
smoothly between projects so each one briefly takes over the page.

## Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion (only animation dependency)

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Editing content

All copy lives in [`src/data/content.js`](src/data/content.js) — profile,
projects, skills, timeline. Theme palettes live in
[`src/data/themes.js`](src/data/themes.js). Project mockups are pure JSX
under `src/components/mockups/` and can be edited freely without breaking
the section layout.

## CV button

The CV button is **disabled by default**. To enable it:

1. Drop your CV PDF into `public/` (e.g. `public/Namit_Singh_Sarna_CV.pdf`).
2. In `src/data/content.js`, set `profile.links.cv` to the file path
   (e.g. `'/Namit_Singh_Sarna_CV.pdf'`).

The Hero only renders the "Download CV" button when `cv` is truthy, so
leaving it as `null` keeps the layout clean.

## Project case-study links

Project sections only render "View Case Study" / "GitHub" / "Live Demo"
buttons when the corresponding URL is set in `content.js`. `null` values
hide the button entirely — there are no dead `#` links.

## Links

- GitHub: <https://github.com/namitzz>
- LinkedIn: <https://www.linkedin.com/in/namit-singh-sarna-55a021323>
- Portfolio repo: <https://github.com/namitzz/Namit.portfolio>
