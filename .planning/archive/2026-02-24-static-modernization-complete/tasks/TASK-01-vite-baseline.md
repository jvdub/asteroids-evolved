# TASK-01: Vite Baseline Scaffolding

## Objective
Create a modern Vite-based baseline so the game can run and build as a static web app.

## Why This Task Exists
The current Node/Express 3 setup is legacy and unnecessary for static hosting goals.

## Scope
- Add Vite as dev/build tool.
- Add npm scripts for `dev`, `build`, and `preview`.
- Ensure app entrypoint resolves from project root and serves existing `views/index.html` content.
- Ensure configuration supports static deploy under configurable base path.

## Inputs / Context
- Current project uses `app.js` + Express 3 and static script includes.
- Main page currently at `views/index.html`.

## Implementation Steps
1. Add Vite dependency and scripts in `package.json`.
2. Add `vite.config.*` to map root/build output appropriately.
3. Decide whether to keep `views/index.html` in place or move to root `index.html` (prefer least disruptive option).
4. Verify `npm run dev` launches the game shell and static assets resolve.
5. Verify `npm run build` creates production output folder.
6. Validate built paths with a non-root base (e.g., `/asteroids-evolved/`).

## Deliverables
- Updated `package.json` scripts/deps.
- Vite config file.
- Minimal HTML pathing changes needed to run via Vite.

## Acceptance Criteria
- `npm run dev` starts successfully with no Express runtime.
- `npm run build` and `npm run preview` both work.
- Existing UI screens render (main menu visible).
- Build output works when hosted under both `/` and a project subpath.

## Out of Scope
- Converting all scripts to ES modules (covered later).
- API/storage refactor.
