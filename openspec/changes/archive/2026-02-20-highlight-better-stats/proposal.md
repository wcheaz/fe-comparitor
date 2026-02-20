## Why

When comparing two units, it is not immediately obvious at a glance which unit has the superior stat (e.g., higher growth rate or base stat). Highlighting the better value makes the comparison grid much easier to read and allows users to quickly identify a unit's strengths over another without having to mentally compare the numbers.

## What Changes

- The comparison grid cells for stats (bases, growths, averages) will be updated to visually indicate the superior value.
- If Unit A has a higher value than Unit B for a specific stat, Unit A's cell will have a green background.
- If Unit B has the higher value, Unit B's cell will be green.
- If the values are equal, neither cell is highlighted.

## Capabilities

### New Capabilities
- `stat-highlighting`: Adds visual highlighting to the higher of two compared stats in the comparison grid.
- `promoted-status`: Distinguishes between base and promoted classes in the unit details view.

### Modified Capabilities


## Impact

- `components/features/CombinedAverageStatsTable.tsx` and potentially other stat tables if they compare units side-by-side.
- Utility functions may need to be added to easily compare the stats.
- CSS/Tailwind styling for the grid cells to apply the green highlight.
