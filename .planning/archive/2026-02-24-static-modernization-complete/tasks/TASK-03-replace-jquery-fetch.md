# TASK-03: Replace jQuery AJAX with Fetch API

## Objective
Remove jQuery network dependency by replacing AJAX usage with modern `fetch` wrappers.

## Why This Task Exists
Only a small subset of jQuery is being used for AJAX; native APIs are sufficient.

## Scope
- Replace all `$.ajax` usage in `scripts/game.js`, `scripts/screens.js`, `scripts/gameplay.js`.
- Provide lightweight request helpers to keep callsites clean.

## Inputs / Context
- Existing API endpoints are `/v1/high-scores` and `/v1/controls`.
- Endpoint implementation will be removed later in favor of local persistence.

## Implementation Steps
1. Add `scripts/services/http.js` or equivalent helper.
2. Convert each AJAX call to `fetch` with JSON handling and error paths.
3. Remove jQuery script include from HTML when no longer required.
4. Verify screens still load controls and scores via the new interface layer.

## Deliverables
- Fetch-based request module.
- Updated callsites with equivalent behavior.

## Acceptance Criteria
- No runtime `$.ajax` references remain.
- App works without `jquery-2.1.4.js` included.
- Control/scores flows remain functional against current backing implementation.

## Out of Scope
- Storage backend migration itself.
