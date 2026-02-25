# PLAN: Cinematic UI Modernization (Option 4 + Option 2/3 blend)

## Goal

Redesign the app shell and menus to feel premium, cinematic, and modern while keeping gameplay mechanics, static-site architecture, offline behavior, and local-only state unchanged.

## Design Direction

- Cinematic Space UI foundation (depth, atmosphere, polished shell)
- Neon arcade accents for interactivity and personality
- Professional dashboard-grade spacing/typography/readability

## Constraints

- Preserve static-only architecture (no runtime server-state dependencies)
- Preserve CSP-safe implementation (no unsafe inline scripts)
- Keep controls/high scores local-only state
- Do not alter gameplay mechanics or canvas simulation logic
- Prefer CSS/DOM structure changes over broad JS rewrites

## Delivery Phases

1. Define visual tokens and global shell style primitives
2. Redesign main menu and shared screen framing
3. Unify non-gameplay screens into a coherent card/panel system
4. Polish options UX and binding affordances
5. Add tasteful motion/ambient effects with accessibility fallbacks
6. Run QA regression and document the new UI system

## Quality Gates

- `npm run build` passes
- `npm run check:static-arch` passes
- Controls/high scores still persist locally
- No obvious readability regressions on primary screens

## Definition of Done

- New UI language is consistently applied across menu/options/high-scores/instructions/about
- Visual quality is clearly improved from baseline
- Architecture/security/offline constraints remain intact
- Docs reflect new UI implementation and verification steps
