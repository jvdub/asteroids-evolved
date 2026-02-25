# TASK-08: Refactor Gameplay Mode to Shared Core

## Objective
Migrate `scripts/gameplay.js` to use the shared game session core module.

## Why This Task Exists
Gameplay mode should consume the common loop primitives and only own gameplay-specific rules/UI.

## Scope
- Replace duplicated update/render/collision orchestration with core APIs.
- Preserve gameplay-specific flows (lives, score, game-over, respawn, shield/recharge display).

## Inputs / Context
- Shared core exists from TASK-07.

## Implementation Steps
1. Integrate core in `scripts/gameplay.js`.
2. Keep keyboard bindings and game-over handling in gameplay file.
3. Ensure score/lives/level tracking remains unchanged.
4. Verify visual parity during normal play.

## Deliverables
- Updated `scripts/gameplay.js` with reduced complexity and clearer ownership boundaries.

## Acceptance Criteria
- Gameplay mode runs end-to-end without regressions.
- File size/duplication is reduced compared to baseline.

## Out of Scope
- Attract mode refactor.
