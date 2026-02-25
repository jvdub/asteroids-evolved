# TASK-16: Dependency and Supply-Chain Hygiene

## Objective
Establish dependency hygiene for a public-facing static game project.

## Why This Task Exists
Modernization introduces new dependencies; unmanaged updates can create security and stability risk.

## Scope
- Remove obsolete dependencies no longer used at runtime.
- Add dependency audit/update workflow.
- Pin/package-lock strategy appropriate for reproducible builds.

## Inputs / Context
- Legacy dependencies include Express 3 and jQuery bundle in repo.

## Implementation Steps
1. Remove unused legacy deps from `package.json` after migration.
2. Ensure lockfile is present and committed.
3. Add npm scripts/docs for `npm audit` and dependency update cadence.
4. Document policy for introducing new runtime deps (must justify size/need).

## Deliverables
- Cleaned dependency graph.
- Documented dependency maintenance policy.

## Acceptance Criteria
- No unused legacy runtime dependencies remain.
- Reproducible installs are possible from lockfile.
- Basic vulnerability audit workflow is documented.

## Out of Scope
- Enterprise-grade SBOM/signing workflows.
