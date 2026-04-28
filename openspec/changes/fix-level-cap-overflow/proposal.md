## Why

When comparing two units with different numbers of class-change events, the unit with fewer events produces extra rows beyond its class level cap. For example, when comparing Cherche (3 reclass/promotion events: level 16 Griffon Rider, level 20 Wyvern Lord, level 7 Troubadour) against Kellam (1 promotion event: level 20 Great Knight), Kellam correctly reaches Level 20 Tier 2 but then generates additional rows showing Level 1-4 Tier 2 again. This happens because `generateProgressionArray` receives an inflated `endLevel` (derived from the unit with the most events) and the current break condition does not account for all edge cases where a unit's in-class display level has exceeded the cap without pending events.

## What Changes

- Fix the level cap enforcement in `generateProgressionArray` (`lib/stats.ts`) so that a unit's `displayLevelNum` is strictly clamped to its current class's level cap (20 standard, 30 for special Awakening classes like Manakete, Taguel, Villager, Dancer, etc.) when there are no remaining events.
- Ensure the `maxLevelFromUnits` calculation in `StatProgressionTable.tsx` does not cause shorter-progression units to iterate unnecessarily far past their natural termination point.
- Add test coverage for the specific scenario: a unit with fewer events compared alongside a unit with more events, verifying the shorter-progression unit stops exactly at its final class's level cap.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `unit-level-caps`: Strengthen the level cap enforcement so that `generateProgressionArray` terminates row generation deterministically when a unit's display level exceeds the current class cap and no further events remain, regardless of the `endLevel` parameter passed from the table component.
- `stat-progression-table`: Ensure the `maxLevelFromUnits` computation does not cause shorter-progression units to iterate past their natural end, and that row alignment handles differing progression lengths without ghost rows.

## Non-Goals

- Changing the level cap values themselves (20 standard, 30 special) — these remain as-is.
- Adding new game support or new class types.
- Modifying the reclass validation logic (`isValidReclass`, `getValidReclassOptions`).
- Changing how `unit.maxLevel` is stored or loaded from data.

## Impact

- `lib/stats.ts`: The break condition and/or display-level clamping logic in `generateProgressionArray` (around line 551-556).
- `components/features/StatProgressionTable.tsx`: The `maxLevelFromUnits` calculation (around lines 125-134) that feeds `endLevel` into `generateProgressionArray`.
- `__tests__/lib/stats.test.ts`: New test cases covering the multi-unit comparison overflow scenario.
