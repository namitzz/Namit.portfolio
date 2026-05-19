# Namit Singh Sarna — Portfolio

Scroll-based personal portfolio where each project changes the visual theme
as it enters view. The background, accent colours, and mockup UIs transition
smoothly between projects so each one briefly takes over the page.

Live: <https://namitportfolio-rosy.vercel.app/>

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

## Featured projects

1. UniWise (source-grounded RAG assistant for higher education, dissertation prototype)
2. Posture AI (real-time computer vision for gym posture correction)
3. Cloud Seven Realty (Next.js brand site backed by Google Sheets and Drive)
4. Crime Prediction Dashboard (Met Police LSOA modelling and clustering)
5. Course Companion Web App (Spring Boot and MySQL group coursework, CO2302)

## Editing content

All copy lives in [`src/data/content.js`](src/data/content.js): profile,
projects, skills, timeline. Theme palettes live in
[`src/data/themes.js`](src/data/themes.js). Project mockups are pure JSX
under [`src/components/mockups/`](src/components/mockups/) and can be edited
freely without breaking the section layout.

Scroll-based project theme switching is handled in
[`src/App.jsx`](src/App.jsx) and [`src/components/ProjectSection.jsx`](src/components/ProjectSection.jsx):
each project section pushes its `themeKey` up to the page wrapper when it
enters the viewport, and [`src/components/ThemeBackground.jsx`](src/components/ThemeBackground.jsx)
animates between palettes.

## CV button

The CV button is disabled by default. To enable it:

1. Drop your CV PDF into `public/` (e.g. `public/Namit_Singh_Sarna_CV.pdf`).
2. In `src/data/content.js`, set `profile.links.cv` to the file path
   (e.g. `'/Namit_Singh_Sarna_CV.pdf'`).

The Hero only renders the "Download CV" button when `profile.links.cv` is
truthy, so leaving it as `null` keeps the layout clean.

## Project links

Project sections only render "View Case Study", "GitHub", and "Live Demo"
buttons when the corresponding URL is set in `content.js`. `null` values
are intentionally hidden so there are no dead `#` links.

## Links

- GitHub: <https://github.com/namitzz>
- LinkedIn: <https://www.linkedin.com/in/namit-singh-sarna-55a021323>
- Portfolio repo: <https://github.com/namitzz/Namit.portfolio>
