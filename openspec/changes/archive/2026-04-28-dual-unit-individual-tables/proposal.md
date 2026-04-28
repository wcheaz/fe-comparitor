## Why

The current comparison page renders a single shared `StatProgressionTable` for all selected units (up to 4). This creates recurring development challenges: the table must reconcile stat key differences across games (e.g., `skl` vs `dex`, `str`/`mag` collapse), handle row alignment when one unit promotes and another does not, and conditionally show/hide columns when some units lack certain stats. Each new game or class system adds edge cases to the shared table.

Limiting comparison to exactly 2 units and giving each unit its own independent progression table eliminates these problems at the source. Each table only renders stats that unit has, at that unit's own levels, with that unit's own promotion/reclass events. No cross-unit stat reconciliation is needed.

## What Changes

- **BREAKING**: The `UnitSelector` and comparator page SHALL enforce a maximum of 2 selected units (down from 4).
- The single shared `StatProgressionTable` SHALL be replaced by two independent per-unit tables, each rendered in its own `Card`.
- Each per-unit table SHALL display only the stats that the individual unit possesses (no cross-unit `getCommonStats` / `getCommonGrowthStats` logic).
- Each table SHALL show every level from 1 to max, using "-" for levels before that unit's own join level. No cross-table row coordination or sync toggle in this change (deferred to a follow-up — see `hidden/TODO.md`).
- The `ComparisonGrid` (base stats, growth rates, unit details) SHALL continue to render side-by-side for the 2 selected units, unchanged in layout.
- Stat highlighting (green = highest, yellow = equal) SHALL remain in the `ComparisonGrid` for the 2-unit side-by-side view. Per-unit tables SHALL NOT use cross-unit highlighting.

## Capabilities

### New Capabilities
- `individual-progression-tables`: A per-unit stat progression table component that renders one unit's full level-by-level stats in isolation, using only that unit's own stat keys, levels, and promotion/reclass events. Shows all levels 1 to max with "-" for pre-join levels.

### Modified Capabilities
- `horizontal-comparison`: The "Combined Average Stats Table" requirement changes from a single shared table aligned across units to two independent per-unit tables. Max units changes from 4 to 2.
- `stat-progression-table`: The existing `StatProgressionTable` component is refactored to render per-unit instead of multi-unit. Cross-unit stat reconciliation and row alignment are removed.

## Impact

- `app/comparator/page.tsx` -- Reduce `maxUnits` from 4 to 2; render two `StatProgressionTable` instances instead of one.
- `components/features/StatProgressionTable.tsx` -- Major refactor: accept a single unit instead of `units[]`, remove cross-unit stat resolution and row alignment.
- `components/features/UnitSelector.tsx` -- Enforce `maxUnits={2}` (already accepts a prop, just changing the value).
- `components/features/ComparisonGrid.tsx` -- Minimal or no changes (already renders columns per-unit; just limited to 2).
- `lib/stats.ts` -- No changes to `generateProgressionArray` or calculation functions (they already accept a single unit).
- `components/features/StatDifferenceHelper.tsx` -- May become unused or simplified if the dual-table layout supersedes the difference helper.
- Tests -- Update any tests that assume 3+ unit selection or multi-unit table alignment.
