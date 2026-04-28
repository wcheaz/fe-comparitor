## Why

Awakening units have a three-layer stat system: personal bases, class bases, and stat modifiers. The data pipeline already stores personal bases in `unit.stats` and class bases in `class.baseStats`. However, the UI currently displays only personal bases (e.g., Chrom's Str shows as `1` instead of the in-game `5`) and only personal growths (e.g., `40%` instead of the effective `75%`). Additionally, `generateProgressionArray` caps internal stat accumulation at class stat caps, so accumulated growth past a cap is lost on reclass — contradicting Awakening's mechanic where internal growth continues past the cap and becomes visible in classes with higher caps.

## What Changes

- **ComparisonGrid base stats**: For Awakening units, display `personal_base + class_base` instead of `personal_base` alone.
- **ComparisonGrid growth rates**: For Awakening units, display `personal_growth + class_growth` instead of `personal_growth` alone.
- **StatTable base/growth display**: For Awakening units, display combined bases and combined growths in the individual unit detail page.
- **Preserve internal growth past caps**: `generateProgressionArray` MUST track uncapped internal stats separately from capped display stats. When a unit reclasses, the uncapped internal stats carry over as the new base for growth accumulation, while display stats are capped at the current class's `maxStats`.
- **`calculateAverageStats` Awakening support**: The simple stat calculator used by the unit detail page (`app/units/[id]/page.tsx`) MUST account for combined bases and combined growths for Awakening units.

## Capabilities

### New Capabilities
- `awakening-combined-display`: Display logic for showing combined personal+class bases and combined personal+class growths for Awakening units in all stat tables (ComparisonGrid, StatTable, StatProgressionTable).

### Modified Capabilities
- `stat-progression-table`: Internal stat accumulation MUST continue past class stat caps. Display stats remain capped, but uncapped internal stats carry forward on reclass/promotion. This preserves the Awakening mechanic where accumulated growth is not lost to class caps.
- `class-growths-and-modifiers`: The spec's current statement that "starting stats at level 1 SHALL equal `unit.stats` + `currentClass.statModifiers`" is incorrect. Starting stats for Awakening units SHALL equal `unit.stats` + `currentClass.baseStats`. Stat modifiers are a separate layer applied on top of computed stats for display only.

## Impact

- `lib/stats.ts`: `generateProgressionArray` (uncapped tracking), `calculateAverageStats` (Awakening class-aware), `calculateCurrentStats` helper (split uncapped/capped logic)
- `components/features/ComparisonGrid.tsx`: Base stats and growth rates display for Awakening units (lines ~791-825, ~853-887)
- `components/features/StatTable.tsx`: Base and growth display for Awakening units (lines ~65-96)
- `components/features/StatProgressionTable.tsx`: May need minor adjustments to consume the new capped/uncapped split
- `__tests__/lib/stats.test.ts`: New test cases for Awakening combined bases/growths and uncapped growth accumulation
- No data file changes required; `data/awakening/units.json` and `data/awakening/classes.json` already contain all needed fields
