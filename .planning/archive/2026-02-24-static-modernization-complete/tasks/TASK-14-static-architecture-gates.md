# TASK-14: Static Architecture Compliance Gates

## Objective
Add explicit checks to ensure the app remains a static-site architecture over time.

## Why This Task Exists
Refactors can accidentally reintroduce backend assumptions or runtime API dependencies.

## Scope
- Add lightweight architecture checks (script or documented checklist) for:
  - no runtime `/v1/*` usage
  - no required Node server process for game features
  - static-only build artifacts

## Inputs / Context
- Earlier tasks remove Express and API-backed state.

## Implementation Steps
1. Add a script/checklist to detect forbidden runtime endpoints (`/v1/high-scores`, `/v1/controls`).
2. Add a check that build output references only static assets.
3. Add a CI-friendly command (or npm script) to run architecture checks.
4. Document pass/fail criteria in README.

## Deliverables
- Architecture compliance script/checklist.
- New npm script entry (e.g., `npm run check:static-arch`).

## Acceptance Criteria
- Checks fail if server-state endpoints are reintroduced.
- Checks pass on current static architecture implementation.

## Out of Scope
- Full automated browser E2E testing.
