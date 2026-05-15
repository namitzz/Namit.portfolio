# Namit Singh Sarna — Portfolio

Premium scroll-based portfolio. Each project section takes over the page
theme (background, accents, mockups) as you scroll through it.

## Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion (only animation dep)

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

## Editing copy

All site copy lives in `src/data/content.js`. Theme palettes are in
`src/data/themes.js`. Mockups are pure JSX under `src/components/mockups/`
— swap them freely without breaking the section layout.

## Notes

- CV file expected at `public/Namit_Singh_Sarna_CV.pdf` (drop yours in).
- Replace placeholder GitHub / LinkedIn / demo links in
  `src/data/content.js`.
