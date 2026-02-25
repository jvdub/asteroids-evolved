# TASK-05: Wire UI Screens to Local State

## Objective
Refactor menu/options/high-score flows to use client storage service directly.

## Why This Task Exists
The current flow depends on `/v1/controls` and `/v1/high-scores` endpoints.

## Scope
- Update `scripts/game.js`, `scripts/screens.js`, and game-over score submission in `scripts/gameplay.js`.
- Ensure app boot loads controls from local storage before gameplay.
- Ensure score/name rendering uses safe DOM operations (no unsanitized HTML injection).
- Validate user-entered player names before save.

## Inputs / Context
- Storage APIs are provided by TASK-04.
- Existing score rendering logic sorts and shows top 10.

## Implementation Steps
1. Replace controls bootstrap read in `game.game.init()` with storage API call.
2. Update options save/back flow to read/write storage.
3. Update high-score screen `run()` to read local scores.
4. Update score rendering to build list items via `textContent`/DOM nodes, not string-based `innerHTML`.
5. Update gameplay game-over prompt flow to append score locally.
6. Add input validation/sanitization for player name (length + allowed chars + fallback value).
7. Keep user-visible behavior unchanged.

## Deliverables
- Refactored screens/gameplay state flow with no backend API dependency.

## Acceptance Criteria
- Controls edits persist and reload correctly.
- New high scores appear and persist after refresh.
- No network calls are required for these features.
- Injected HTML/script in player name is rendered as plain text and never executed.

## Out of Scope
- Removing backend files from repo.
