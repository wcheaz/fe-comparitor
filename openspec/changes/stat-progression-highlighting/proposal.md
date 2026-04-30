## Why

The stat progression tables currently render as isolated per-unit views with no cross-unit visual comparison. The `ComparisonGrid` already highlights stats where one unit is superior (green for highest, yellow for equal), making it easy to spot advantages at a glance. The progression tables should use the same visual language so users can quickly identify which unit leads at each level without mentally comparing numbers row by row.

## What Changes

- Each per-unit `StatProgressionTable` will receive the other unit's progression data (or the other unit itself) so it can compute per-row, per-stat highlights.
- Highlighting follows the same rules as `ComparisonGrid`: `bg-green-500/20` for the strictly highest stat value, `bg-yellow-500/20` when both units have equal non-zero values, no highlight otherwise.
- Only rows that exist in both tables (matching `internalLevel`) are compared. Rows present in only one table receive no highlight.
- Single-unit mode remains unchanged — no highlighting applied.

## Capabilities

### New Capabilities
- `progression-stat-highlighting`: Cross-unit stat comparison highlighting in the per-unit stat progression tables. Covers the per-cell highlight computation (highest/equal/none), the visual styling matching `ComparisonGrid`, and the coordination mechanism between the two independent tables.

### Modified Capabilities
- `individual-progression-tables`: The "No stat highlighting in per-unit tables" scenario is reversed — when two units are selected, each table SHALL highlight cells based on cross-unit stat comparison at matching levels.
- `stat-highlighting`: The existing spec covers the `ComparisonGrid` only. This change extends the requirement scope to include the stat progression tables using the same visual rules.

## Impact

- `components/features/StatProgressionTable.tsx`: needs a new prop to receive the other unit's progression data (or the other unit + its events) and per-cell highlight computation logic.
- `app/comparator/page.tsx`: needs to pass the other unit's data to each table instance, or lift progression generation to the page level.
- `components/features/ComparisonGrid.tsx`: no changes — the existing highlight logic serves as the reference implementation. Consider extracting a shared utility if duplication is a concern.
