# TASK-04: Implement Client Storage Abstraction

## Objective
Implement a client-only persistence layer for controls and high scores.

## Why This Task Exists
The target deployment has no server-side game state.

## Scope
- Add storage adapter module using IndexedDB (`idb-keyval`) with localStorage fallback.
- Define read/write APIs for controls and high scores.
- Add schema version metadata and migration path.
- Enforce bounded high score retention.

## Inputs / Context
- Existing data schemas:
  - Controls: `accel`, `right`, `left`, `tele`, `safe`, `fire`, `shield`
  - Scores: array of `{ name, score, date, time }`

## Implementation Steps
1. Add dependency `idb-keyval`.
2. Create `scripts/services/storage.js` with:
   - `getControls`, `saveControls`
   - `getHighScores`, `addHighScore`
3. Include schema defaults and migration-safe guards for old/invalid data.
4. Add storage schema version key and upgrade logic.
5. Cap stored high scores to a fixed max (e.g., top 50) before persistence.
6. Add simple unit-like runtime checks in dev logs for storage read/write success.

## Deliverables
- Storage service module with typed/validated payload handling.

## Acceptance Criteria
- Data persists across page reloads with no backend calls.
- Corrupt/invalid stored data falls back to defaults without crash.
- Schema upgrades do not break existing saved users.
- High-score state remains bounded and deterministic.

## Out of Scope
- Updating all screen callsites (next task).
