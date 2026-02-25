# Asteroids Evolved Modernization Plan

## Goals

1. Modernize the 2014-era project without changing core gameplay feel.
2. Remove server-side state dependencies and keep all state on the client.
3. Make the game deployable as a static site.
4. Support offline play via PWA/service worker caching.
5. Improve maintainability by reducing duplicate gameplay logic.
6. Reduce asset weight and improve load performance.
7. Keep architecture static-host compatible (no runtime server dependencies).
8. Apply baseline client-side security hardening appropriate for public hosting.

## Keep vs Refactor Summary

### Keep (with minimal API-level changes)
- Core game math and utilities in `scripts/game.js`, `scripts/loopFunctions.js`, `scripts/random.js`.
- Core entity logic in `scripts/spaceship.js`, `scripts/saucer.js`, `scripts/particles.js`, `scripts/graphics.js`.
- Existing game screens and UX flow in `views/index.html` + `scripts/screens.js`.

### Refactor/Replace
- Replace legacy loader stack (`modernizr.js`, yepnope usage in `scripts/loader.js`) with modern ES module startup.
- Replace jQuery AJAX calls with `fetch`-based APIs.
- Replace server-backed controls/scores APIs with client storage (IndexedDB/localStorage fallback).
- Replace Express 3 boot path with Vite static build + preview workflow.
- Add service worker + manifest to support offline play.
- Reduce duplication between `scripts/gameplay.js` and `scripts/attract.js` by extracting shared loop/session logic.

## Proposed Package Choices

- `vite` for build/dev server and static output.
- `vite-plugin-pwa` for offline support and precaching.
- `idb-keyval` for simple IndexedDB persistence.
- `howler` for robust audio playback (optional but recommended).
- Optional asset pipeline tools as needed (`sharp`, `svgo`, `imagemin` variants).

## Architecture Guardrails

### Offline-first requirements
- No gameplay-critical runtime network calls after first successful install/load.
- Service worker must precache all assets required to launch and play a full session.
- Runtime cache rules must avoid unbounded growth and include cache versioning.
- Service worker update behavior must be documented (when updates apply, how to bust cache).

### Static-site requirements
- Build output must be pure static files (`dist/`) compatible with Netlify, Vercel static, GitHub Pages, Cloudflare Pages.
- No dependency on Node/Express routes for controls, scores, or content.
- Asset paths must work under non-root base paths (e.g., GitHub Pages project site).

### Local state requirements
- Controls and high scores stored locally with schema versioning.
- Corrupt data recovery path must reset to defaults safely.
- High score storage must be bounded (max entries retained) to avoid uncontrolled growth.

### Security requirements
- Eliminate DOM injection risks in score/name rendering by using safe DOM APIs (no unsanitized `innerHTML`).
- Validate and constrain user-provided name input (length/character policy) before persistence.
- Set security headers for static host behavior via HTML meta / host config guidance (CSP, Referrer-Policy, X-Content-Type-Options equivalent where supported).
- Keep dependency footprint minimal and remove obsolete libraries not needed at runtime.

## Execution Order

1. Set up modern build/runtime scaffolding (Vite + ES module entry).
2. Decouple from backend API by moving controls/scores to client storage.
3. Add offline support and static deployment documentation.
4. Refactor shared gameplay/attract loop internals.
5. Add security hardening pass for input handling and rendering.
6. Optimize assets and selectively introduce SVGs where appropriate.

## Definition of Done

- Game runs via Vite in dev and builds to static output.
- No runtime dependency on Express APIs for game state.
- Controls and high scores persist locally across reloads.
- App is installable/runnable offline after first load.
- All score/name rendering paths are safe from script/HTML injection.
- Local persistence is versioned, bounded, and recoverable.
- Core gameplay behavior remains intact.
- Planning tasks completed and documented.
