# Tashara Trade Visualizer

Static React + TypeScript + Vite web app for exploring the Tashara system map, location trade profiles, and comparative cargo profitability.

## What This Project Does

- Shows the Tashara system as an interactive map.
- Lets you inspect each major world, Bral, the binary stars, and the two gates.
- Seeds editable GP prices for the lore goods named in the project documents.
- Calculates distance, travel time, net profit, profit per day, and profit per AU for selected routes.
- Ranks the best trade options under the current snapshot day.

## Project Structure

- `src/App.tsx`: Main app layout and shared state.
- `src/components/`: UI panels and the SVG system map.
- `src/data/settings.ts`: Global settings such as ship speed, Bral speed, day snapshot, orbits, and gate positions.
- `src/data/goods.ts`: Baseline goods list and editable GP prices.
- `src/data/locations.ts`: Lore-based location profiles, supply/demand data, and local market modifiers.
- `src/data/routes.ts`: Route notes, risks, and major-lane metadata.
- `src/utils/`: Distance, orbit, and trade math helpers.
- `docs/ASSUMPTIONS.md`: Clearly labeled lore-gap assumptions for phase 1.
- `docs/DEVELOPER_NOTES.md`: Recommended next iteration targets.

## Run Locally

1. Open a terminal in this project folder.
2. Run `npm install`.
   This downloads the frontend packages listed in `package.json`.
   Risk: it needs internet access and writes a `node_modules` folder plus `package-lock.json`.
3. Run `npm run dev`.
   This starts Vite, a local development server for the app.
4. Open the local URL Vite prints in the terminal, usually `http://localhost:5173`.

## Build for Deployment

1. Run `npm run build`.
   This type-checks the app and builds a static production site.
2. Upload the generated `dist/` folder to a static host such as Netlify, Vercel static hosting, GitHub Pages, Cloudflare Pages, or any normal web server.

## Publish To GitHub Pages

This project now includes a GitHub Pages workflow at:

- `.github/workflows/deploy-pages.yml`

It publishes the built `dist/` folder whenever you push to the `main` branch.

### Step-by-step

1. Create or connect the GitHub repository.
2. Push the `main` branch.
3. In the GitHub repository, open:
   - `Settings` -> `Pages`
4. Set the build and deployment source to:
   - `GitHub Actions`
5. Push again if needed, or open the `Actions` tab and run:
   - `Deploy To GitHub Pages`

### Important config note

- `vite.config.ts` now uses `base: "./"`.
- This makes the built asset paths work on GitHub Pages project sites, which are usually served from a repo subpath instead of the domain root.

## Git Setup

This project is not yet a git repository. If you want to track changes locally and publish it to GitHub, use the setup guide here:

- `docs/GIT_SETUP.md`

That guide covers:

- creating the local git repository
- making the first commit
- adding a GitHub `origin` remote
- pushing the `main` branch
- what the new `.gitignore` file excludes

## Where To Edit The Data

- Edit `src/data/settings.ts` when you want to change:
  - ship speed in AU/day
  - Bral speed in AU/week
  - current day snapshot
  - gate angles
  - orbital display assumptions
- Edit `src/data/goods.ts` when you want to change:
  - baseline prices
  - units
  - tags
  - cargo notes
- Edit `src/data/locations.ts` when you want to change:
  - location descriptions
  - who wants what
  - what each place produces
  - buy/sell modifiers
  - factions, rules, and bonuses
- Edit `src/data/routes.ts` when you want to change:
  - route notes
  - risk tags
  - major-lane metadata shown in the calculator

## Pricing Model Notes

- Prices are expressed in GP and intentionally live in data files instead of UI logic.
- The seeded prices are fantasy trade-lot estimates based on the lore's rarity, scarcity, and clear export/import patterns.
- Local prices are derived from per-location buy and sell modifiers against each good's baseline price.

## Deployment Notes

- This is a frontend-only static site.
- No backend is required for phase 1.
- If you want GM-only controls later, the cleanest static-friendly next step is probably a small saved state layer using local storage or a separate editable JSON snapshot file.

## Lore Sources Used

- `Tashara Lore/TASHARA SPHERE LONG-RANGE SURVEY REPORT 2d6a4a25176980129e3dcca74525d03e.md`
- `Tashara Lore/Trade Web of the Tashara Sphere 2d3a4a251769802a8eeefae423b2e847.md`
- `Tashara Lore/Trade Prospectus The Tashara Sphere 2d6a4a251769808893f4c983d08c6cad.md`
- `Tashara Lore/The Tashara Sphere Gateway of Forgotten Empires 289a4a25176980c3976bd0ce76ce1e70.md`
- `Tashara Lore/Tashara System.png`

See `docs/ASSUMPTIONS.md` for the places where the lore did not give exact numeric values.
