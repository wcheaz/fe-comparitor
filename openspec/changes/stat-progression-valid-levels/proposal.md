## Why

The dual-render refactor split the stat progression into two independent per-unit tables, which removed the previous behavior of hiding level rows where at least one compared unit does not yet exist. This creates noise: comparing a base level 5 unit against a base level 10 unit shows rows for levels 1–9 on one or both tables filled with dashes (`"-"`), even though only levels 10+ are meaningful for comparison. Users expect the table to start at the earliest level where both units have real stats.

## What Changes

- Both per-unit `StatProgressionTable` instances will coordinate to hide level rows where either unit has `isSkipped: true` (i.e., the unit hasn't joined yet at that level).
- The effective comparison start level becomes `Math.max(unitA.level, unitB.level)` for non-promoted, non-trainee units.
- Pre-promoted and trainee units are exempt — they always show from level 1.
- When only one unit is selected, no filtering is applied (all levels shown as-is).

## Capabilities

### New Capabilities
- `valid-level-filtering`: Coordinates the visible level range across two side-by-side stat progression tables so that rows where either unit has `isSkipped: true` are hidden. Covers the computation of the shared valid level floor and the rendering behavior when rows are filtered.

### Modified Capabilities
- `individual-progression-tables`: The "Two units with different level ranges" scenario currently states that each table independently shows all levels from 1 to max with dashes for pre-join levels. This requirement changes to: when two units are selected, both tables hide rows below the later unit's join level (i.e., rows where either unit would show `"-"`).

## Impact

- `StatProgressionTable` component (`components/features/StatProgressionTable.tsx`): needs a new optional prop (e.g., `minVisibleLevel`) or an alternative coordination mechanism to suppress rows below the shared floor.
- `app/comparator/page.tsx`: needs to compute `Math.max(unitA.level, unitB.level)` and pass it to both tables.
- `lib/stats.ts`: no changes expected — `generateProgressionArray` still generates full arrays; filtering is a rendering concern.
- Existing specs for `individual-progression-tables` need a delta spec capturing the modified requirement.
