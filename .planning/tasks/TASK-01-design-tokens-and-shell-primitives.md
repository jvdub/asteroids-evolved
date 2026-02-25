# TASK-01: Design Tokens and Shell Primitives

## Objective
Establish a cohesive visual foundation (color, spacing, typography, panel/button styles) for the cinematic UI redesign.

## Scope
- Define reusable CSS custom properties for palette, spacing, radius, and glow levels.
- Introduce shared shell primitives for panels/cards/buttons/headings.
- Normalize baseline typography and spacing rhythm for readability.

## Deliverables
- Updated `style/main.css` with tokenized visual system.
- Shared class primitives reusable across all non-gameplay screens.

## Acceptance Criteria
- Existing screens render with consistent baseline styling.
- No hardcoded one-off color sprawl for redesigned elements.
- `npm run build` and `npm run check:static-arch` pass.
