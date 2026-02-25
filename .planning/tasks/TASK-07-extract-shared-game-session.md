# TASK-07: Extract Shared Game Session Core

## Objective
Create a shared game session module to remove duplicated logic between gameplay and attract mode.

## Why This Task Exists
`scripts/gameplay.js` and `scripts/attract.js` duplicate most update/draw/collision lifecycle behavior.

## Scope
- Extract reusable functions/classes for:
  - object array updates
  - collision checks
  - saucer spawn/fire lifecycle
  - particle updates/renders
  - object cleanup and level progression hooks

## Inputs / Context
- Current loop files: `scripts/gameplay.js`, `scripts/attract.js`.

## Implementation Steps
1. Create `scripts/session/game-session-core.js` (or similar).
2. Move generic per-frame logic into this core, using explicit dependency injection.
3. Keep mode-specific behavior configurable via callbacks/hooks.
4. Add clear interface docs at top of module.

## Deliverables
- New shared session core module with stable API.

## Acceptance Criteria
- Core module can support both gameplay and attract mode without behavior loss.
- Duplicate code in mode files is materially reduced.

## Out of Scope
- Fully refactoring both mode files in this task (done in next tasks).
