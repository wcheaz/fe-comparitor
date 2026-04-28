## Loop Instructions

This change runs in a Ralph loop. Each iteration:
1. Read `proposal.md`, `design.md`, `specs/**/spec.md`, and this file.
2. Implement one task only.
3. Run the verification commands listed in the task's `Done when:` block.
4. Mark the task complete only after verification passes.
5. Stop and hand off if a test fails for an unexpected reason (e.g., the existing break condition has a different root cause than the design assumes).

## 1. Core Fix

- [ ] 1.1 Add the end-of-loop break guard in `generateProgressionArray`

  **What**: In `lib/stats.ts`, after the `displayLevelNum` increment block at the bottom of the main for-loop body (currently lines 632-637), add a break guard:

  ```typescript
  if (displayLevelNum > getLevelCap(currentClass) && nextEventIndex >= allEvents.length && unit.maxLevel !== "infinite") {
    break;
  }
  ```

  This MUST use the same predicate as the existing pre-push break at line 554. Do NOT remove or weaken the existing pre-push break — both guards are intentional.

  **Done when:**
  - `npx tsc --noEmit` passes with no type errors

  **Stop and hand off if:** the existing pre-push break at line 554 already prevents overflow in all testable cases (the new guard has no effect), since that would indicate a different root cause than the design assumes.

- [ ] 1.2 Fix the existing incorrect test "should handle expand to level 100 correctly"

  **What**: In `__tests__/lib/stats.test.ts`, the test at line 183 expects `toHaveLength(100)` and `Level 80 (Promoted)`. After the fix from task 1.1, a standard unit with one promotion and `maxLevel !== "infinite"` MUST terminate at 40 rows with the last row being Level 20. Update the assertions to:
  - `expect(progression).toHaveLength(40)`
  - Last row `displayLevel` is `'Level 20'`

  **Done when:**
  - `npx jest __tests__/lib/stats.test.ts -t "should handle expand to level 100 correctly"` passes

## 2. Regression Tests

- [ ] 2.1 Add test "should not overflow past class level cap when endLevel is inflated"

  **What**: In `__tests__/lib/stats.test.ts`, add a test that creates a standard unpromoted unit (level 1, game "Test Game") with a single default promotion. Call `generateProgressionArray(unit, 1, 130, mockClasses)`. Assert:
  - `progression.length === 40` (20 unpromoted + 20 promoted)
  - Last row `displayLevel` contains "Level 20"
  - No row has a display level number exceeding 20 in any class cycle

  **Done when:**
  - `npx jest __tests__/lib/stats.test.ts -t "should not overflow past class level cap when endLevel is inflated"` passes

- [ ] 2.2 Add test "should terminate correctly for late-joining unit with fewer events"

  **What**: In `__tests__/lib/stats.test.ts`, add a test that creates a unit joining at level 5 with a single promotion event at level 20. Call `generateProgressionArray(unit, 1, 130, mockClasses)`. Assert:
  - `progression.length === 40` (4 padding + 16 base-class + 20 promoted)
  - First 4 rows have `isSkipped === true`
  - No rows appear after the promoted class reaches Level 20

  **Done when:**
  - `npx jest __tests__/lib/stats.test.ts -t "should terminate correctly for late-joining unit with fewer events"` passes

- [ ] 2.3 Add test "should handle special class level 30 cap with inflated endLevel"

  **What**: In `__tests__/lib/stats.test.ts`, add a test that creates an Awakening unit in a special class (e.g., Manakete, id `'manakete'`). Create a matching class entry with `id: 'manakete', game: 'Awakening'`. Call `generateProgressionArray(unit, 1, 130, awakeningClasses)`. Assert:
  - Progression terminates at level 30
  - No extra rows beyond level 30

  **Done when:**
  - `npx jest __tests__/lib/stats.test.ts -t "should handle special class level 30 cap with inflated endLevel"` passes

## 3. Full Verification

- [ ] 3.1 Run the full test suite and typecheck to confirm everything passes together

  **What**: Run all tests and type checking to confirm the core fix, the corrected existing test, and all three new regression tests pass as a complete set.

  **Done when:**
  - `npx jest __tests__/lib/stats.test.ts` passes with zero failures
  - `npx tsc --noEmit` passes with no type errors
