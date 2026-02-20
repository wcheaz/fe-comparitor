## Why

Currently, there is no table that the user can view to see stat progression as levels increase. Adding a stat progression table to the unit comparator view will provide users with a significantly better understanding of how units grow over time, enabling deeper analytical comparisons. Furthermore, a unit's raw growth isn't the whole story—promotions play a massive role by providing flat stat bonuses and raising minimum base stats.

## What Changes

- Add a new stat progression table to the unit comparator view.
- Introduce `<game>_classes.json` data files to define class base stats, promotion bonuses, and hidden/innate class abilities (e.g., Flying, +30 Crit).
- Update stat calculation to accurately apply class promotion bonuses and floor stats to the new class's base stats upon promotion.
- Support displaying different stats as columns and unit levels as rows.
- The table will span from the lowest base level of the compared units up to level 40 by default.
- Integrate promotion logic: Once a unit hits level 20, they transition to level 1 promoted, and units promoted by default (like Marcus) start at level 20 promoted.
- Handle mismatched starting levels by displaying a "-" for higher-level units until the table reaches their base level.
- Support varying level caps across different Fire Emblem games.
- Add a toggleable option to expand the table up to level 100.

## Capabilities

### New Capabilities
- `stat-progression-table`: A dynamic table component that predicts and displays unit stats across all levels from base to level cap, accounting for multi-game promotion rules, varying base levels, and class specific base stats/bonuses.

### Modified Capabilities

## Impact

- `data/`: Will contain new `<game>_classes.json` files for the supported games.
- `lib/calculations.ts`: Logic will be expanded to support adding flat promotion bonuses and flooring units to class bases upon reaching promotion levels.
- `app/comparator/page.tsx`: Will need to incorporate the new table component.
- `components/features/`: Will house the new progression table component and its subcomponents.
