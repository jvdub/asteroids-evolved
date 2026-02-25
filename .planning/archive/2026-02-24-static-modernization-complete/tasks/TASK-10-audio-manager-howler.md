# TASK-10: Introduce Audio Manager (Howler)

## Objective
Replace scattered `new Audio(...)` calls with a centralized, reusable audio manager.

## Why This Task Exists
Current ad hoc audio allocation can cause latency and inconsistent playback behavior.

## Scope
- Add `howler` package.
- Create `scripts/services/audio.js` (or similar) with preloaded sound instances.
- Replace direct `Audio` construction in gameplay/graphics/spaceship/attract modules.

## Inputs / Context
- Sounds currently used include laser, blast, and ship explosion.

## Implementation Steps
1. Add and configure `howler`.
2. Implement named sound registry and playback helpers (`play`, `stop`, `setVolume`).
3. Replace direct usage at callsites.
4. Verify no duplicated per-frame object creation for sound effects.

## Deliverables
- Central audio service.
- Updated modules using service APIs.

## Acceptance Criteria
- Sound effects still trigger in all expected events.
- No direct `new Audio(...)` remains in gameplay paths.

## Out of Scope
- Music mixing and advanced audio UX controls.
