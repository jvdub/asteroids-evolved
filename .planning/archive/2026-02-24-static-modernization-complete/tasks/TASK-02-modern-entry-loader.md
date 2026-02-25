# TASK-02: Replace Legacy Loader with Modern Entry

## Objective
Remove `Modernizr`/yepnope preload bootstrapping and implement a modern startup sequence.

## Why This Task Exists
Legacy loader patterns in `scripts/loader.js` are obsolete and increase complexity.

## Scope
- Create a single app entry module.
- Load game scripts in deterministic order.
- Preserve image preloading behavior required by `game.images`.

## Inputs / Context
- Current startup is initiated from `scripts/loader.js` and `modernizr.js`.
- Many scripts depend on globals and execution order.

## Implementation Steps
1. Add `src/main.js` (or similar) as boot entry.
2. Replace `window.Modernizr.load([...])` with explicit module/script imports.
3. Reimplement asset preload as a Promise-based utility that populates `game.images`.
4. Start game only after all required scripts and assets are ready.
5. Update HTML script tags to use modern entry.

## Deliverables
- New entrypoint and preload utility.
- Removal of runtime dependency on `scripts/modernizr.js` and yepnope prefixes.

## Acceptance Criteria
- Game initializes successfully with no references to `Modernizr.load` or `yepnope`.
- `game.images[...]` is populated for required sprites/backgrounds.
- No regressions in first-screen startup behavior.

## Out of Scope
- Full ES module rewrite of all gameplay files.
