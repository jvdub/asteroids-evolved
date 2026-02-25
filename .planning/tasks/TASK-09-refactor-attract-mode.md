# TASK-09: Refactor Attract Mode to Shared Core

## Objective
Migrate `scripts/attract.js` to the shared session core while preserving bot/autoplay logic.

## Why This Task Exists
Attract mode currently duplicates gameplay internals and should only own AI behavior + mode transitions.

## Scope
- Integrate shared session core.
- Keep attract-specific steering/firing heuristics and menu timeout transitions.

## Inputs / Context
- Shared core from TASK-07.
- Current attract behavior includes nearest-target tracking and rotation heuristics.

## Implementation Steps
1. Replace duplicated game-loop internals with core module calls.
2. Isolate AI decision logic into small dedicated functions.
3. Preserve transition back to menu on user input or timeout as currently designed.
4. Validate parity with original visual behavior.

## Deliverables
- Updated `scripts/attract.js` with significantly less duplicated logic.

## Acceptance Criteria
- Attract mode runs and appears functionally equivalent.
- Duplicate logic across gameplay/attract is minimized.

## Out of Scope
- AI algorithm redesign.
