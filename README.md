# Asteroids Evolved

A modern browser-based take on the Asteroids classic, shipped as a static Vite app.

## Tech Stack

- Vite 5
- vite-plugin-pwa
- Howler (audio)
- idb-keyval (client persistence)

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start local development:

   ```bash
   npm run dev
   ```

3. Open the printed local URL (usually `http://localhost:5173/`).

## Available Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets to `dist/`
- `npm run preview` — preview the production build
- `npm run start` — alias for preview
- `npm run check:static-arch` — verify static-only runtime architecture
- `npm run assets:report` — print dist asset size summary
- `npm run deps:audit` — run security audit on runtime dependencies
- `npm run deps:outdated` — show outdated dependencies

## Current Architecture

- Static-only runtime: no Express/Node backend required for gameplay.
- Core runtime scripts, images, and sounds are copied into `dist/` by Vite config.
- Persistence is client-side via storage adapters (IndexedDB/localStorage with in-memory fallback).
- PWA service worker is generated at build time (`vite-plugin-pwa`, `registerType: autoUpdate`).

## Gameplay + UI Status

- Main menu + screens: `Instructions`, `High Scores`, `Options`, `About`.
- Control remapping is supported in `Options` and auto-saved locally.
- High scores persist locally and degrade gracefully when storage is unavailable.
- UI shell and panel styling are standardized across non-gameplay screens.
- Reduced-motion fallbacks are supported via `prefers-reduced-motion`.

## Security + Hardening

- CSP baseline is set in `index.html` via meta tag.
- High-score names are normalized (allowlist + max length) and rendered safely via text nodes.
- `check:static-arch` guards against runtime server-state endpoint regressions.

## Build & Verification

Run the core quality checks:

```bash
npm run build
npm run check:static-arch
```

Optional:

```bash
npm run assets:report
npm run deps:audit
```

## Offline/PWA Notes

- First visit must be online to cache the app shell/assets.
- Subsequent launches can work offline once cached.
- New deploys are fetched in the background and applied on next reload/open.

## Deployment

### GitHub Pages (repo subpath)

```bash
VITE_BASE_PATH=/asteroids-evolved npm run build
```

Publish `dist/` to your Pages target.

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_BASE_PATH` only if deploying under a subpath.

## Troubleshooting

- If assets seem stale after deploy, close all site tabs and reopen.
- If needed, unregister the service worker and clear site storage in browser devtools, then reload.
- Rebuild before publishing to regenerate service worker assets:

  ```bash
  npm run build
  ```
