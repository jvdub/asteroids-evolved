# TASK-17: Local State Resilience and Failure Handling

## Objective
Ensure game remains playable when browser storage is limited, denied, or partially corrupted.

## Why This Task Exists
Offline/client-only apps must degrade gracefully when persistence APIs fail.

## Scope
- Add explicit fallback behavior for IndexedDB/localStorage failures.
- Add user-visible non-blocking behavior when save fails.
- Document expected behavior in private/incognito contexts.

## Inputs / Context
- Storage layer introduced in TASK-04.

## Implementation Steps
1. Define storage failure contract (`read`: defaults, `write`: soft-fail).
2. Add fallback from IndexedDB to localStorage, then in-memory fallback if both fail.
3. Add lightweight UX messaging/logging for failed persistence attempts.
4. Add manual test checklist for quota exceeded, blocked storage, and corrupted entries.

## Deliverables
- Resilient storage behavior and docs.

## Acceptance Criteria
- Gameplay is not blocked if persistence cannot be written.
- Controls/scores features fail gracefully with clear fallback behavior.
- Documented test scenarios for storage edge cases.

## Out of Scope
- Cloud backup/sync of local state.
