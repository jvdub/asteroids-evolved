# TASK-06: Remove Express Runtime Dependency

## Objective
Eliminate Express 3 runtime as a requirement for running and deploying the game.

## Why This Task Exists
The game should be a static client app with no server state.

## Scope
- Retire `app.js` from primary run path.
- Update npm scripts/documentation to Vite/static workflow.
- Keep legacy server files only if explicitly desired for archival reasons.

## Inputs / Context
- Existing `app.js` uses deprecated middleware and route handlers.

## Implementation Steps
1. Update `README` with modern setup and run instructions.
2. Remove old `start` script or repoint it to Vite preview/dev as appropriate.
3. Confirm app has no runtime dependency on `game/scores.js` or `game/controls.js`.
4. Optionally move legacy server files to an `/archive` folder.

## Deliverables
- Updated run/deploy docs.
- Package scripts aligned with static hosting path.

## Acceptance Criteria
- A new contributor can run the game with `npm install` + `npm run dev`.
- No Express process is needed for normal usage.

## Out of Scope
- PWA/offline features.
