## Why

Currently, there is no table that the user can view to see stat progression as levels increase. Adding a stat progression table to the unit comparator view will provide users with a significantly better understanding of how units grow over time, enabling deeper analytical comparisons.

## What Changes

- Add a new stat progression table to the unit comparator view.
- Support displaying different stats as columns and unit levels as rows.
- The table will span from the lowest base level of the compared units up to level 40 by default.
- Integrate promotion logic: Once a unit hits level 20, they transition to level 1 promoted, and units promoted by default (like Marcus) start at level 20 promoted.
- Handle mismatched starting levels by displaying a "-" for higher-level units until the table reaches their base level.
- Support varying level caps across different Fire Emblem games (e.g., *Shadows of Valentia* allowing multiple promotions for an effective cap of 60).
- Add a toggleable option to expand the table up to level 100.

## Capabilities

### New Capabilities
- `stat-progression-table`: A dynamic table component that predicts and displays unit stats across all levels from base to level cap, accounting for multi-game promotion rules and varying base levels.

### Modified Capabilities

## Impact

- `app/comparator/page.tsx`: Will need to incorporate the new table component.
- `components/features/`: Will house the new progression table component and its subcomponents.
- Unit leveling and promotion logic may need extensions to properly abstract the "effective level" and multi-promotion paths for varying game systems.
