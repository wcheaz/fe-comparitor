# Tasks: fix-level-cap-overflow

## Pre-flight

- [x] **Pre-flight: record quality gate baselines**
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

- [x] **Add redundant break guard after displayLevelNum increment in generateProgressionArray**
  - Scope: `lib/stats.ts` (lines 632-638)
  - Change: After the `displayLevelNum++` / `displayLevelNum = 1` block (line 637), add a break guard: `if (displayLevelNum > getLevelCap(currentClass) && nextEventIndex >= allEvents.length && unit.maxLevel !== "infinite") { break; }`. This runs at the end of the loop body, complementing the existing break at line 554 that runs at the top.
  - Done when:
    - New break guard exists after line 637, before the closing brace of the `for` loop
    - Guard uses identical predicate logic to the existing break at line 554: `displayLevelNum > getLevelCap(currentClass) && nextEventIndex >= allEvents.length && unit.maxLevel !== "infinite"`
    - `npx tsc --noEmit` exits 0
    - `npm run lint` exits 0
  - Stop and hand off if: `getLevelCap` is not accessible at the insertion point (it is a closure variable, so it should be), or the loop control flow cannot accommodate a second break without restructuring.

- [x] **Fix the "expand to level 100" test expectation**
  - Scope: `__tests__/lib/stats.test.ts` (lines 183-192)
  - Change: The existing test `it('should handle expand to level 100 correctly')` expects 100 rows and `Level 80 (Promoted)` at row 100 for `unpromotedUnit` (which has `maxLevel !== "infinite"`). After the break guard fix, a non-infinite unit with a single promotion at level 20 will correctly cap at 40 rows (20 unpromoted + 20 promoted). Update the test to assert the correct capped behavior: array length 40, last row displayLevel `Level 20 (Promoted)`, last row internalLevel 40. Rename the test description to reflect the corrected expectation.
  - Done when:
    - Test name describes the corrected behavior (e.g., `'should cap progression at class level cap when endLevel exceeds natural progression'`)
    - Assertion checks `progression.length === 40`
    - Assertion checks `progression[39].displayLevel === 'Level 20 (Promoted)'`
    - Assertion checks `progression[39].internalLevel === 40`
    - `npm test -- --testPathPattern="stats.test"` exits 0
  - Stop and hand off if: the `unpromotedUnit` test fixture has `maxLevel === "infinite"` (it does not — it has no `maxLevel` field), or the mock classes yield a different cap than 20.

- [x] **Add regression test for multi-unit comparison overflow**
  - Scope: `__tests__/lib/stats.test.ts`
  - Change: Add a new test case `it('should not overflow past final class cap when unit has fewer events than comparison peer')` that constructs two calls to `generateProgressionArray`: (1) a unit with a single promotion event at level 20, called with `endLevel = 130` (simulating an inflated `maxLevelFromUnits`), and (2) verifies the returned array terminates exactly at the promoted class's level cap with no ghost rows or duplicated level sequences.
  - Done when:
    - New test exists in the `generateProgressionArray` describe block
    - Test creates a unit with `game: 'Test Game'`, a single promotion event at level 20 (mercenary → hero), and calls `generateProgressionArray` with `endLevel = 130`
    - Test asserts the returned array length is 40 (20 unpromoted + 20 promoted)
    - Test asserts the last row has `displayLevel` matching `Level 20 (Promoted)` or equivalent
    - Test asserts no two consecutive rows in the promoted class segment share the same `displayLevelNum` pattern (no ghost rows)
    - `npm test -- --testPathPattern="stats.test"` exits 0
  - Stop and hand off if: the test fixture `unpromotedUnit` or `mockClasses` cannot be reused for this scenario without modification (if so, create inline fixtures within the test).

---

## Quality gate

- [ ] **Run full test suite and type checks**
  - Scope: no code edits
  - Change: Verify that all gates pass after the implementation tasks.
  - Done when:
    - `npm test` exits 0 with all tests passing
    - `npx tsc --noEmit` exits 0
    - `npm run lint` exits 0
    - Output of each command matches or improves upon pre-flight baselines recorded in `.ralph/baselines/fix-level-cap-overflow-readme.md`
  - Stop and hand off if: a test failure is caused by a pre-existing issue not related to this change (document in `.ralph/baselines/` and hand off).
