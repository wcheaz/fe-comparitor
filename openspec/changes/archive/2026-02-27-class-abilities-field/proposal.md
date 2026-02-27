## Why

The existing `hiddenModifiers` field on the `Class` interface is a poorly named catch-all that conflates two different concepts: flat stat bonuses (like `+30 Crit`) and named class abilities or skills (like `Slayer`, `Canto`, `Locktouch`). As we add FE8 support — where classes have meaningful innate abilities (e.g., Bishops get `Slayer`, Berserkers get `+15 Crit`) — the current field name is misleading and the UI doesn't surface this information anywhere meaningful.

## What Changes

- **BREAKING: Rename `hiddenModifiers` → `classAbilities`** across the entire codebase: the `Class` TypeScript interface, `lib/data.ts` (class transformer), `lib/stats.ts` (progression output), all JSON class data files (`binding_blade`, `three_houses`, `engage`, `blazing_blade`), and `__tests__/lib/stats.test.ts`.
- Add a **"Class Abilities" row** to the Unit Details comparison table in `ComparisonGrid.tsx`, conditionally rendered only when at least one selected unit's class has a non-empty `classAbilities` array. Each ability is displayed as a pill/badge.
- Display **class abilities in the promotion details modal** (`renderPromotionDetails` in `ComparisonGrid.tsx`), so when a user clicks the ℹ️ icon next to a promotion option, the modal shows a "Class Abilities" section alongside existing promotion bonuses, movement type, and weapons.

## Capabilities

### New Capabilities

- `class-abilities-display`: Surfaces class abilities (formerly `hiddenModifiers`) in the Unit Details table as a new "Class Abilities" row, and within the promotion info modal for each promotion option.

### Modified Capabilities

- `horizontal-comparison`: The Unit Details table gains a new conditionally-rendered "Class Abilities" row that reads `classAbilities` from the unit's resolved class data.

## Impact

- **`types/unit.ts`**: `Class` interface field rename (`hiddenModifiers` → `classAbilities`)
- **`lib/data.ts`**: `transformJsonToClass` function — update field mapping from `rawClass.hiddenModifiers` → `rawClass.classAbilities` (with backward-compat fallback: `rawClass.classAbilities || rawClass.hiddenModifiers || []`)
- **`lib/stats.ts`**: `ProgressionRow` type and internal promotion info shape — rename field reference
- **`data/binding_blade/classes.json`**: Rename key in all class entries
- **`data/three_houses/classes.json`**: Rename key in all class entries
- **`data/engage/classes.json`**: Rename key in all class entries
- **`data/blazing_blade/classes.json`**: Rename key in all class entries (if applicable)
- **`components/features/ComparisonGrid.tsx`**: Add "Class Abilities" row to Unit Details table; add abilities section to `renderPromotionDetails`
- **`__tests__/lib/stats.test.ts`**: Update all `hiddenModifiers` references in mock class data and assertions to `classAbilities`
- **`dev/build_fe7_classes.py`**: Update the builder script key from `hiddenModifiers` → `classAbilities`
