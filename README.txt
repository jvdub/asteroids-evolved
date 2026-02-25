Asteroids Evolved now runs as a static Vite app.

Quick start:
1. Install dependencies: `npm install`
2. Start local development: `npm run dev`
3. Open the printed localhost URL (default: `http://localhost:5173/`)

Production build + local preview:
1. Build static output: `npm run build`
2. Preview built site: `npm run preview`

Notes:
- No Express process is required for normal usage.
- Controls and high scores persist client-side.

Offline/PWA behavior:
- A service worker is generated at build time via `vite-plugin-pwa`.
- First visit must be online so the app shell and static assets can be cached.
- After the first successful load, subsequent launches work offline (subject to cached asset availability).
- Service worker updates use `autoUpdate`: a new build is fetched in the background and applied on the next reload/open.

Static architecture compliance:
- Build first: `npm run build`
- Run compliance gate: `npm run check:static-arch`
- The gate fails if runtime server-state endpoints (`/v1/high-scores`, `/v1/controls`) or Node/Express runtime assumptions are detected.
- The gate fails if `dist/index.html` references missing or non-static assets.
- Use this check in CI to prevent regressions back to server-dependent architecture.

Dependency and supply-chain hygiene:
- Reproducible installs are lockfile-based: run `npm ci` in CI and commit `package-lock.json` with dependency changes.
- Legacy runtime dependencies are removed from primary runtime path; no Express/Node server dependency is required for gameplay.
- Run dependency security checks with `npm run deps:audit`.
- Run update review checks with `npm run deps:outdated` before planned dependency updates.
- New runtime dependencies should be introduced only with a clear gameplay/runtime need and bundle-size impact considered.

Local state resilience:
- Persistence contract:
	- Reads soft-fail to defaults (`controls`) or empty list (`high scores`) if storage is unavailable/corrupted.
	- Writes soft-fail and degrade to in-memory storage when IndexedDB and localStorage are unavailable.
- Non-blocking UX behavior:
	- When persistent storage is unavailable, a temporary in-game warning appears and gameplay continues.
	- In this degraded mode, controls/scores survive only for the current tab session.
- Private/incognito note:
	- Some browsers clear or restrict storage in private mode; this may trigger temporary session-only persistence.

Manual resilience checklist:
1. Block IndexedDB + localStorage in browser dev tools/site settings, then start a run and finish game-over flow.
2. Confirm gameplay still runs and high-score submission does not crash the app.
3. Confirm warning message appears: `Storage is unavailable. Progress is temporary for this session.`
4. Reload page and verify defaults are restored when persistence is blocked.
5. Re-enable storage, reload, and verify controls/high scores persist normally again.

Security hardening:
- User-provided high-score names are normalized with allowlist characters (`a-z`, `A-Z`, `0-9`, space, `_`, `.`, `-`) and max length 24.
- Empty or invalid names fall back to `Anonymous`.
- Score list rendering uses DOM-safe text nodes (`textContent`) and does not execute HTML/script content from user input.

CSP strategy:
- `index.html` includes a strict baseline CSP via meta tag:
	- `default-src 'self'`
	- `script-src 'self'`
	- `style-src 'self'`
	- `img-src 'self' data:`
	- `media-src 'self'`
	- `connect-src 'self'`
	- `object-src 'none'`
	- `base-uri 'self'`
	- `frame-ancestors 'none'`

Static-host security header guidance:
- Prefer server/host response headers over meta when host supports it.
- Recommended baseline headers:
	- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`
	- `Referrer-Policy: no-referrer`
	- `X-Content-Type-Options: nosniff`
	- `X-Frame-Options: DENY`

Provider notes:
- Netlify: configure headers in `_headers` file at publish root.
- Vercel: configure `headers` in `vercel.json`.
- Cloudflare Pages: configure headers in `_headers` or Pages project settings.
- GitHub Pages: cannot set custom response headers directly; rely on meta CSP and avoid unsafe inline code.

Manual security checklist:
1. Submit high-score name `<script>alert(1)</script>` and verify rendered text is inert.
2. Submit high-score name with only disallowed characters and verify fallback becomes `Anonymous`.
3. Build and load app, then confirm no CSP errors block core gameplay flow (menu, play, score save, options).
4. Verify no runtime `/v1/*` calls are attempted (`npm run check:static-arch`).

Asset optimization and size reporting:
- Build output now copies only runtime-required scripts, images, and sounds into `dist/`.
- Repeatable size report command: `npm run assets:report`.
- Measured dist payload reduction from selective copy:
	- Before: `dist/images` 91,360,781 bytes, `dist/sounds` 30,222,428 bytes, `dist/` total 121,884,907 bytes.
	- After: `dist/images` 2,154,508 bytes, `dist/sounds` 78,885 bytes, `dist/` total 2,409,249 bytes.
- Existing SVG usage remains intentionally selective (`public/pwa-icon.svg` for manifest/app icon); gameplay sprites remain raster where appropriate.

QA smoke checklist:
1. Main menu loads and all menu buttons navigate to expected screens.
2. Start game, rotate/thrust/fire/teleport/shield controls all function.
3. Destroy asteroids and verify score increments + level progression.
4. Verify saucer spawn/combat behavior and collision handling.
5. Trigger game over, submit score, and verify high-score list updates.
6. Open options screen, remap controls, save, and verify changes apply in gameplay.
7. Enter attract mode and verify return to main menu on input.
8. Reload page and verify controls/high-scores persistence behavior.
9. Run architecture and build checks: `npm run build` and `npm run check:static-arch`.

Offline verification checklist:
1. Visit app once online and allow initial asset caching.
2. Switch browser to offline mode and reload.
3. Confirm menu and gameplay still load from cached assets.
4. Confirm high-score write path remains non-blocking; degraded storage warning appears only when storage is unavailable.
5. Return online, reload, and confirm service-worker update behavior remains stable.

Static deployment (GitHub Pages):
1. Build with base path for repo pages:
	 - `VITE_BASE_PATH=/asteroids-evolved npm run build`
2. Publish contents of `dist/` to GitHub Pages branch/folder.
3. Ensure SPA fallback serves `index.html` for navigations (if host supports fallback config).
4. After deploy updates, hard refresh once to activate new service worker assets.

Static deployment (Netlify):
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Optional base path: set `VITE_BASE_PATH` env var if deploying under subpath.
4. Configure security headers via `_headers` file (see Security hardening section).

Service-worker/cache troubleshooting:
- If stale assets appear after deploy, close all tabs for the site and reopen.
- In browser DevTools Application panel, unregister service worker + clear site storage, then reload.
- Re-run `npm run build` before publish to regenerate `sw.js` and cache manifest.