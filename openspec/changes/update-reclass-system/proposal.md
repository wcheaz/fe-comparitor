## Why

Currently, the unit comparator only supports standard class promotions. However, many newer Fire Emblem games (like Awakening and Fates) feature robust reclassing systems where units can switch to entirely different class trees horizontally or vertically based on their level and current class tier. We need to implement this system to accurately model the progression of characters from these games.

## What Changes

- Add a generic mechanism to handle `reclassOptions` for units, similar to how promotions are handled.
- Implement tier-based requirement checks:
  - Can reclass to a Tier 1 class if the unit is currently in a Tier 2 class, or is in an Tier 1 class and at least level 10.
  - Can reclass to a Tier 2 class if the unit is currently in a Tier 2 class and at least level 10.
- Implement promotion restrictions for Tier 2 classes: a unit can only promote into a Tier 2 class if they are in a Tier 1 class that explicitly allows promoting into that specific Tier 2 class.
- Update `components/features/StatProgressionTable.tsx` to handle these dynamic options.
- Update `components/features/PromotionOptionsDisplay.tsx` to reflect both promotion and reclass options properly.

## Capabilities

### New Capabilities
- `unit-reclassing`: Supports adding reclass options that depend on the unit's current level, class tier, and past promotions/reclasses, allowing horizontal class movement.

### Modified Capabilities
- `stat-progression-table`: Integrating reclass options alongside standard promotions in the progression array.

## Impact

- `components/features/StatProgressionTable.tsx`
- `components/features/PromotionOptionsDisplay.tsx`
- Relevant types (`types/unit.ts`) and statistical generation logic (`lib/stats.ts`) that will need to apply the conditional rules for reclassing and promotion options.
