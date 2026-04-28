# Tasks: fix-level-cap-overflow

## Pre-flight

- [x] **Task 1 — Record quality gate baselines**
  - Scope: no code edits
  - Change: Capture current state of `npm test`, `npx tsc --noEmit`, and `npm run lint` output.
  - Done when:
    - `.ralph/baselines/fix-level-cap-overflow-test.txt` exists with full `npm test` output
    - `.ralph/baselines/fix-level-cap-overflow-tsc.txt` exists with full `npx tsc --noEmit` output
    - `.ralph/baselines/fix-level-cap-overflow-lint.txt` exists with full `npm run lint` output
    - `.ralph/baselines/fix-level-cap-overflow-readme.md` lists passing/failing gates and exact failing test identifiers
  - Stop and hand off if: any gate is nondeterministic across two runs.

---

## Implementation

### Part A — Remove harmful break guards from `generateProgressionArray`

- [x] **Task 2 — Remove redundant post-increment break guard at line 639 of `generateProgressionArray`**
  - Scope: `lib/stats.ts` (lines 639–641)
  - Change: Delete the `if (displayLevelNum > getLevelCap(currentClass) && nextEventIndex >= allEvents.length && unit.maxLevel !== "infinite") { break; }` block and any comment directly above it that was added by the prior fix attempt. This guard is the direct cause of the 5 test failures — it truncates `generateProgressionArray` output at the class cap (20) even when the caller passes a higher `endLevel` and the unit has a valid reason to produce more rows (e.g., promotion events that reset `displayLevelNum` to 1).
  - Done when:
    - Lines 639–641 (the `if/break` block) are removed
    - Any comment introduced alongside the guard (e.g., "redundant break guard") is also removed
    - No other code in `generateProgressionArray` is changed
    - `npx tsc --noEmit` exits 0
    - `npm run lint` exits 0
  - Stop and hand off if: the line numbers have shifted since the proposal was written and the guard cannot be located — in that case, search for the second `if (displayLevelNum > getLevelCap` occurrence in the function and remove that one.

- [ ] **Task 3 — Verify the primary break at line 554 is unchanged and correct**
  - Scope: `lib/stats.ts` (lines 554–556)
  - Change: Confirm that the original break condition `if (displayLevelNum > cap && !hasMoreEvents && unit.maxLevel !== "infinite") { break; }` is still present and has not been modified by the prior fix. This break is a valid safety net — it prevents the loop from iterating past a unit's natural end when `endLevel` is inflated. No code change is required; this is a verification-only task. If the break HAS been altered, restore its original form.
  - Done when:
    - The break at ~line 554 reads exactly: `if (displayLevelNum > cap && !hasMoreEvents && unit.maxLevel !== "infinite") { break; }`
    - The `cap` variable is derived from `getLevelCap(currentClass)` and `hasMoreEvents` from `nextEventIndex < allEvents.length`
    - No additional conditions have been added to this break
    - `npx tsc --noEmit` exits 0
  - Stop and hand off if: the break has been removed or fundamentally restructured — document the current state and hand off.

### Part B — Fix `StatProgressionTable.tsx` to accommodate non-first units

- [ ] **Task 4 — Replace unit-0-only display level selection with per-unit display levels**
  - Scope: `components/features/StatProgressionTable.tsx` (lines 210–213, `ProgressionRow` type at ~line 62)
  - Change: Line 211 currently reads `if (unitIndex === 0 && levelData.displayLevel) { rowDisplayLevel = levelData.displayLevel; }`, which takes the row label from unit 0 only. When non-first units promote later than unit 0, the row label does not reflect their actual level, and rows past unit 0's progression end show incorrect default labels ("Level 37", "Level 38", etc.). Fix this by storing each unit's display level in the row data (add a `unitDisplayLevels: string[]` field to `ProgressionRow`) and populating it for every unit that has non-undefined `levelData`. The row-level `displayLevel` field should prefer unit 0's level when available but fall back to the first unit that has data for that row. Update the `ProgressionRow` type definition to include the new field.
  - Done when:
    - `ProgressionRow` type includes a `unitDisplayLevels: string[]` field
    - The row construction loop populates `unitDisplayLevels[unitIndex]` with `levelData.displayLevel` for every unit that has data at that row index
    - The row-level `displayLevel` is set from unit 0 when available, otherwise from the first unit with data
    - Line 211 no longer contains the `unitIndex === 0` gate as the sole source of `rowDisplayLevel`
    - `npx tsc --noEmit` exits 0
    - `npm run lint` exits 0
  - Stop and hand off if: adding `unitDisplayLevels` to `ProgressionRow` causes type errors in other consumers of the type — document which consumers are affected and hand off.

- [ ] **Task 5 — Mark non-first unit cells as ended when progression data is undefined**
  - Scope: `components/features/StatProgressionTable.tsx` (lines 194–237)
  - Change: Currently, when `unitProgression[i]` is `undefined` (the unit's progression array is shorter than `maxProgressionLength`), the fallback at lines 231–236 pushes empty stats `{}` and sets `isUnitSkipped` to `false` (via `levelData?.isSkipped ?? false`). This means `shouldShowDash` is `false` and the cell tries to render a stat value that is `undefined`, showing "-" via the `statValue !== undefined` check — but the comparison/highlight logic at lines 947–972 still runs on the empty stats, which can produce incorrect "highest" highlights for ghost data. Fix: when `levelData` is `undefined` for a unit at a given row, set `isUnitSkipped = true` explicitly so that `shouldShowDash = true` and the comparison logic is bypassed entirely via the `!shouldShowDash` guard at line 947.
  - Done when:
    - The fallback branch at lines 231–236 sets `rowData.unitSkipped.push(true)` instead of relying on `levelData?.isSkipped ?? false`
    - For rows where a unit has `undefined` progression data, that unit's cells render as dashes and are excluded from highest/equal comparison logic
    - Existing behavior for units with `isSkipped: true` padding rows (late-join units) is unchanged
    - `npx tsc --noEmit` exits 0
    - `npm run lint` exits 0
  - Stop and hand off if: changing `unitSkipped` to `true` for undefined-progression rows causes existing rows to disappear (the `allUnitsShowDash` filter at line 243 excludes the row) — in that case, ensure the `allUnitsShowDash` logic only considers the `isSkipped` flag from `levelData?.isSkipped`, not from the undefined-progression fallback.

### Part C — Fix tests and add regression coverage

- [ ] **Task 6 — Restore original expectations for the 5 failing stats tests**
  - Scope: `__tests__/lib/stats.test.ts`
  - Change: The prior break-guard changes caused 5 test failures by truncating `generateProgressionArray` output at the class cap (20) when `endLevel` was set higher. Now that the redundant guard is removed (Task 2), restore the original expectations: (1) "should generate correct progression for a standard unpromoted unit" — revert to expecting 25 rows with `endLevel=25`; (2) "should apply correct promotion bonuses and class base flooring" — revert to expecting first row at Level 20; (3) "should handle units with missing class data gracefully" — revert to expecting 25 rows; (4) "should calculate growth rates correctly across promotion boundary" — revert to expecting HP ≥ 30 at level 22; (5) "should handle 1-tier promoted units correctly (Seth - Paladin)" — revert to expecting no "Tier" indicators. Also update the "cap progression at class level cap" test (added by the prior fix) if its expectations now conflict with the restored `generateProgressionArray` behavior — that test may need to be removed or rewritten to reflect that termination is now the table's responsibility, not the generator's.
  - Done when:
    - All 5 previously failing test names pass
    - `npm test -- --testPathPattern="stats.test" 2>&1` shows 0 failures
    - The "cap progression at class level cap" test either passes with updated expectations or has been removed with a comment explaining termination moved to the table
  - Stop and hand off if: restoring original expectations reveals that `generateProgressionArray` output has changed in a way that contradicts both old and new expectations — document the exact mismatch (expected vs actual array length and last-row displayLevel) and hand off.

- [ ] **Task 7 — Add multi-unit ghost-row regression test**
  - Scope: `__tests__/lib/stats.test.ts`
  - Change: Add a new test `it('should not produce ghost rows past class cap for non-first unit when compared with earlier-promoting unit')` that reproduces the Cherche-at-16 / Kellam-at-20 scenario. Construct a Kellam-like unit (starts at level 5, single promotion event at level 20, non-infinite `maxLevel`) and call `generateProgressionArray` with `endLevel = 130` (simulating the inflated `maxLevelFromUnits` from a Cherche-like peer with 3 events). Assert: (1) the returned array has exactly 40 rows (4 padding + 16 unpromoted levels 5–20 + 20 promoted levels 1–20); (2) the last row's `displayLevel` contains "Level 20"; (3) no two consecutive rows in the promoted segment share the same `displayLevelNum` (no ghost or duplicate levels).
  - Done when:
    - New test exists in the `generateProgressionArray` describe block
    - Test passes: `npm test -- --testPathPattern="stats.test" 2>&1` shows the new test name with a passing status
    - Test asserts array length === 40
    - Test asserts last row `displayLevel` contains "Level 20"
    - Test asserts no consecutive rows in the promoted segment have the same `displayLevelNum`
  - Stop and hand off if: the test fixture requires game data (classes, promotion chains) that does not exist in `mockClasses` — in that case, create inline fixtures within the test that are self-contained.

---

## Quality gate

- [ ] **Task 8 — Run full test suite, type checks, and lint**
  - Scope: no code edits
  - Change: Verify that all gates pass after Tasks 2–7.
  - Done when:
    - `npm test` exits 0 with all tests passing
    - `npx tsc --noEmit` exits 0
    - `npm run lint` exits 0
    - Output of each command matches or improves upon pre-flight baselines recorded in `.ralph/baselines/fix-level-cap-overflow-readme.md`
  - Stop and hand off if: a test failure is caused by a pre-existing issue not related to this change (document in `.ralph/baselines/` and hand off).
