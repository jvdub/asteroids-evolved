# TASK-12: Asset Optimization and Selective SVG Conversion

## Objective
Reduce payload size while preserving visual quality and gameplay readability.

## Why This Task Exists
Current asset bundle contains many heavy raster backgrounds/audio files.

## Scope
- Identify largest image/audio assets.
- Optimize raster assets (WebP/AVIF where safe).
- Convert only suitable vector-like assets to SVG (do not force sprite sheets into SVG).

## Inputs / Context
- Largest files are primarily space backgrounds and long audio tracks.

## Implementation Steps
1. Audit and rank assets by transfer size.
2. Optimize large images using repeatable scripts/tooling.
3. Evaluate candidate assets for SVG redraw/conversion.
4. Update asset references in code/CSS/HTML.
5. Capture before/after size report in docs.

## Deliverables
- Optimized assets and updated references.
- Script or documented process for repeatable optimization.

## Acceptance Criteria
- Measurable reduction in total asset weight.
- No obvious degradation in gameplay-critical visuals.
- SVG introduced only where it is technically appropriate.

## Out of Scope
- Art direction overhaul.
