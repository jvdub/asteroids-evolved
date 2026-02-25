# TASK-11: Add PWA + Offline Support

## Objective
Enable installable/offline gameplay after first load.

## Why This Task Exists
Offline play is an explicit project goal for web deployment.

## Scope
- Add `vite-plugin-pwa`.
- Configure manifest metadata/icons.
- Precache critical app shell/game assets.
- Add runtime caching for remaining static assets.
- Define cache expiration/versioning rules to prevent unbounded storage.

## Inputs / Context
- App is a static client game after earlier tasks.
- Asset set includes images, sounds, scripts, and CSS.

## Implementation Steps
1. Install and configure PWA plugin in Vite config.
2. Define web app manifest (`name`, `short_name`, colors, display mode).
3. Configure Workbox caching strategy for static resources (`precache` for game-critical files, runtime caching for optional/large files).
4. Ensure update behavior is sane (prompt or auto-update strategy documented).
5. Add cache expiration/maxEntries controls for runtime caches.
6. Validate offline launch via browser devtools.
7. Validate first load online, second load offline full gameplay path.

## Deliverables
- PWA manifest and generated service worker.
- Documented offline behavior.

## Acceptance Criteria
- App can be loaded and played offline after initial online visit.
- No blocking runtime fetches for core gameplay path while offline.
- Service worker cache does not grow indefinitely during repeated sessions.
- Update behavior (new build available) is documented and testable.

## Out of Scope
- Server-side sync or cloud saves.
