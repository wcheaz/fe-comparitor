## Why

When multiple units with different promotion timings are compared in the stat progression table, the table's row construction loop (in `StatProgressionTable.tsx`) uses only the first unit's (unit 0) display level as the row label and does not accommodate non-first units whose progressions diverge from unit 0's timeline.

Concretely, when Cherche (unit 0, promotes at level 16) is compared with Kellam (unit 1, promotes at level 20), Kellam's tier-2 progression shows exactly `Kellam_promo − Cherche_promo = 4` extra ghost levels past his class cap. If Kellam promotes at level 19 instead, the ghost count is 3. If Kellam promotes before Cherche (e.g. level 13), no ghost levels appear. This deterministic pattern confirms the root cause is the table's unit-0-biased row alignment, not the `generateProgressionArray` function itself.

A prior fix added break guards inside `generateProgressionArray` (lines 554, 639) to force early termination. Those guards are both insufficient (the ghost-level pattern persists) and harmful (5 pre-existing tests now fail because legitimate rows past level 20 are truncated).

## What Changes

- Remove the redundant break guard at line 639 of `generateProgressionArray` in `lib/stats.ts` and relax the existing break at line 554 so it only fires when `displayLevelNum > cap` AND there are no remaining events AND the unit is not infinite — matching the original intent without truncating rows that the table should handle.
- Fix the row construction loop in `StatProgressionTable.tsx` (lines 166–246) to accommodate non-first units: instead of taking `displayLevel` only from `unitIndex === 0` (line 211), compute a row label that reflects each unit's actual level, or use per-unit level indicators in each column so the user can see each unit's true progression state at every row.
- Detect and suppress ghost rows in the table: when a non-first unit's `displayLevelNum` exceeds its current class cap and no more events remain, mark that unit's cells as ended (dash) rather than continuing to render ghost level data, independent of `unitIndex`.
- Fix the 5 tests that fail due to the break guards: revert test expectation changes that assumed guard-truncated output, and restore the original expected behavior.
- Add a regression test reproducing the Cherche-at-16 / Kellam-at-20 scenario that verifies Kellam's tier-2 progression stops at exactly 20 levels with no ghost levels, regardless of how many events Cherche has.

## Scope

- `components/features/StatProgressionTable.tsx`: Row construction loop (lines 166–246), display level selection (line 211), and per-unit level rendering.
- `lib/stats.ts`: `generateProgressionArray` function (lines 339–645) — remove break guard at line 639; evaluate whether the break at line 554 needs adjustment.
- `__tests__/lib/stats.test.ts`: Fix 5 failing tests; add new multi-unit regression test.

## Non-Goals

- Changing level cap values (20 standard, 30 special).
- Changing how `unit.maxLevel` is loaded from game data.
- Modifying `isValidReclass`, `getValidReclassOptions`, or any reclass UI components.
- Refactoring `maxLevelFromUnits` to compute per-unit bounds (the shared inflated `endLevel` is acceptable as long as the table handles per-unit termination correctly).

## Capabilities

### Modified Capabilities

- `stat-progression-table`: The progression table must correctly display each unit's level progression in a multi-unit comparison, using per-unit display levels and suppressing ghost rows past each unit's final class cap. Row labels must not be biased toward unit 0's progression timeline.
- `unit-level-caps`: Termination at the class cap must be enforced in the table's row construction, not solely in `generateProgressionArray`. Each unit's cells must show dashes once that unit has exhausted its natural progression, independent of other units' progression lengths.

### New Capabilities

None — this is a bug fix with no new user-facing features.

## Impact

- **Impacted Code**: `StatProgressionTable.tsx` (row construction loop and per-unit display logic), `lib/stats.ts` (remove one break guard, possibly adjust another), `__tests__/lib/stats.test.ts` (fix 5 tests, add 1 regression test).
- **System**: No API or contract changes. The `generateProgressionArray` signature and return type are unchanged. The fix shifts the termination responsibility from the data generator to the table consumer, which is the correct architectural boundary for multi-unit alignment.

## First-Rollout Boundaries

- Fix applies to the table's row construction logic and the break guards in `generateProgressionArray`.
- No data schema changes required.
- The existing `expandToLevel100` flag continues to work: when `unit.maxLevel === "infinite"`, neither the table's suppression logic nor any break condition fires, so the table expands to 100 as before.
