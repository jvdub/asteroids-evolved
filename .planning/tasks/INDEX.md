# Task Execution Index

## Purpose

This index defines execution order, dependencies, and parallel work lanes for the modernization backlog.

## Dependency Graph (High Level)

1. `TASK-01-vite-baseline`
2. `TASK-02-modern-entry-loader`
3. `TASK-03-replace-jquery-fetch`
4. `TASK-04-client-storage-abstraction`
5. `TASK-05-wire-screens-to-local-state`
6. `TASK-06-remove-express-runtime`
7. `TASK-11-pwa-offline-support`
8. `TASK-07-extract-shared-game-session`
9. `TASK-08-refactor-gameplay-mode`
10. `TASK-09-refactor-attract-mode`
11. `TASK-10-audio-manager-howler`
12. `TASK-12-asset-optimization-and-svg`
13. `TASK-15-security-hardening`
14. `TASK-17-local-state-resilience`
15. `TASK-14-static-architecture-gates`
16. `TASK-16-dependency-and-supply-chain`
17. `TASK-13-qa-and-deploy-docs`

## Recommended Phases

### Phase A: Foundation (must complete first)
- `TASK-01-vite-baseline`
- `TASK-02-modern-entry-loader`

### Phase B: State and API Decoupling
- `TASK-03-replace-jquery-fetch`
- `TASK-04-client-storage-abstraction`
- `TASK-05-wire-screens-to-local-state`
- `TASK-06-remove-express-runtime`

### Phase C: Offline + Security Baseline
- `TASK-11-pwa-offline-support`
- `TASK-15-security-hardening`
- `TASK-17-local-state-resilience`

### Phase D: Gameplay Architecture Refactor
- `TASK-07-extract-shared-game-session`
- `TASK-08-refactor-gameplay-mode`
- `TASK-09-refactor-attract-mode`
- `TASK-10-audio-manager-howler`

### Phase E: Optimization + Governance + Release
- `TASK-12-asset-optimization-and-svg`
- `TASK-14-static-architecture-gates`
- `TASK-16-dependency-and-supply-chain`
- `TASK-13-qa-and-deploy-docs`

## Parallelization Matrix

### Lane 1 (Core runtime)
- `TASK-01` -> `TASK-02` -> `TASK-03` -> `TASK-04` -> `TASK-05` -> `TASK-06`

### Lane 2 (Security + resilience)
- Start after `TASK-05`: `TASK-15` and `TASK-17` can run in parallel.

### Lane 3 (Offline delivery)
- Start after `TASK-06`: `TASK-11`.
- Can run concurrently with Lane 2.

### Lane 4 (Engine refactor)
- `TASK-07` -> (`TASK-08` and `TASK-09` in sequence preferred).
- `TASK-10` can run after `TASK-07`, but best after `TASK-08/09` touchpoints are stable.

### Lane 5 (Release hardening)
- `TASK-12`, `TASK-14`, `TASK-16` can run after B/C are complete.
- `TASK-13` should be last.

## Strict Blockers

- Do not start `TASK-05` before `TASK-04`.
- Do not start `TASK-11` before `TASK-06`.
- Do not start `TASK-08` or `TASK-09` before `TASK-07`.
- Do not finalize `TASK-13` before `TASK-11`, `TASK-15`, `TASK-17`, and at least one of (`TASK-08`, `TASK-09`) are complete.

## Suggested Agent Work Packages

### Package 1: Static Baseline
- `TASK-01`, `TASK-02`, `TASK-03`

### Package 2: Local State
- `TASK-04`, `TASK-05`, `TASK-17`

### Package 3: Security + Offline
- `TASK-15`, `TASK-11`, `TASK-14`

### Package 4: Engine Refactor
- `TASK-07`, `TASK-08`, `TASK-09`, `TASK-10`

### Package 5: Release
- `TASK-12`, `TASK-16`, `TASK-13`

## Definition of Ready (per task)

- Task has explicit file targets.
- Task has measurable acceptance criteria.
- Required predecessor tasks are completed.

## Definition of Complete (per task)

- Code changes implemented.
- Acceptance criteria verified.
- README/docs updated if behavior changed.
- No new unresolved runtime errors introduced.
