# TASK-13: QA Pass and Static Deployment Docs

## Objective
Validate modernized game behavior and document deployment for common static hosts.

## Why This Task Exists
After refactors, the project needs reproducible verification and clear publish instructions.

## Scope
- Functional QA checklist across all screens and gameplay loops.
- Offline verification checklist.
- Deployment docs for at least one static host (preferably two options).

## Inputs / Context
- Prior tasks complete modern build and client-side state.

## Implementation Steps
1. Add manual smoke test checklist (menu/screens/gameplay/options/scores/attract).
2. Validate persistence (controls/scores) across reload and offline mode.
3. Document `npm run build` output and hosting steps.
4. Add troubleshooting notes for cache/service-worker updates.

## Deliverables
- Updated README deployment + QA sections.
- Optional `docs/` page for release checklist.

## Acceptance Criteria
- A contributor can deploy static build by following docs.
- QA checklist can be executed and reproduced by others.

## Out of Scope
- Automated end-to-end browser test suite (optional future work).
