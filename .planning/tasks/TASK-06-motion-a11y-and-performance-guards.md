# TASK-06: Motion, Accessibility, and Performance Guards

## Objective
Add subtle atmosphere and motion polish without harming usability or performance.

## Scope
- Add restrained ambient effects (glow/shimmer/gradient movement) to UI shell.
- Respect reduced-motion preference via `prefers-reduced-motion`.
- Verify contrast/focus visibility for keyboard users.

## Deliverables
- CSS motion/accessibility enhancements in `style/main.css`.
- Focus-visible treatment for interactive controls.

## Acceptance Criteria
- Motion is subtle, non-distracting, and disableable via reduced-motion.
- Keyboard focus is clearly visible on interactive controls.
- `npm run build` and `npm run check:static-arch` pass.
