## Context

`generateProgressionArray` in `lib/stats.ts` (lines 339-641) iterates from `actualStartLevel` to `actualEndLevel`, tracking an in-class `displayLevelNum` that resets to 1 after each class change. A break condition at line 554 halts row generation when `displayLevelNum` exceeds the current class's level cap AND no further events remain.

The caller in `StatProgressionTable.tsx` (lines 125-134) computes `maxLevelFromUnits` by taking `Math.max` across all compared units, adding `allEvents.length * 30` per unit. A unit with 3 events (e.g., Cherche) inflates this value to ~130, causing units with fewer events (e.g., Kellam with 1 event) to be called with `endLevel = 130` even though they only need ~40 internal levels.

The existing break condition (`displayLevelNum > cap && !hasMoreEvents && unit.maxLevel !== "infinite"`) should theoretically prevent overflow, but the interaction between the inflated `endLevel`, the per-iteration `displayLevelNum++` increment, and the event-processing while loop creates a path where the unit's display level can wrap through an extra partial cycle before the condition triggers.

## Goals / Non-Goals

**Goals:**
- Guarantee that `generateProgressionArray` never produces rows where `displayLevelNum` exceeds the current class's level cap when no events remain.
- Make the termination condition self-contained within `generateProgressionArray` so it is correct regardless of what `endLevel` the caller passes.
- Add regression tests that reproduce the multi-unit comparison overflow and verify the fix.

**Non-Goals:**
- Changing level cap values (20 standard, 30 special).
- Optimizing `maxLevelFromUnits` to compute tighter bounds (optional improvement, not required for correctness).
- Modifying `isValidReclass` or `getValidReclassOptions`.
- Changing how `unit.maxLevel` is loaded from data.

## Decisions

### Decision 1: Harden the break condition in `generateProgressionArray`

**Choice**: Add an explicit clamp-and-break guard immediately after `displayLevelNum` is incremented at the bottom of the main loop (lines 632-637), before the next iteration begins.

**Rationale**: The current break at line 554 fires early in the loop body, but by that point `displayLevelNum` has already been set for the current iteration. If the event-processing while loop at lines 575-630 resets `displayLevelNum` to 1 (via class change), the next iteration starts with `displayLevelNum = 1` and the break won't fire until the unit levels through the entire cap again. The root overflow occurs because after a unit exhausts all events and reaches its final class cap, the outer loop still has a large `actualEndLevel` remaining. The existing break catches this, but only on the NEXT iteration after `displayLevelNum` exceeds `cap`. Adding a redundant guard after the increment ensures termination is airtight.

**Implementation**: After line 637 (`displayLevelNum = 1` or `displayLevelNum++`), add:

```typescript
// Hard cap: if we've exceeded the class level cap and have no pending events, stop.
if (displayLevelNum > getLevelCap(currentClass) && nextEventIndex >= allEvents.length && unit.maxLevel !== "infinite") {
  break;
}
```

This duplicates the existing check but runs at a different control-flow point (end of loop body vs beginning of next iteration). The existing check at line 554 stays in place as a pre-push guard so the overflow row is never pushed.

**Alternative considered**: Clamp `displayLevelNum = Math.min(displayLevelNum, cap)` instead of breaking. Rejected because clamping would suppress the `displayLevelNum > cap` condition that the existing break depends on, and would require restructuring the loop exit logic.

### Decision 2: Keep `maxLevelFromUnits` as-is but document the contract

**Choice**: Do not change the `maxLevelFromUnits` calculation in `StatProgressionTable.tsx`. The overestimation is harmless once `generateProgressionArray` has a hardened termination condition.

**Rationale**: Tightening `maxLevelFromUnits` to be per-unit would require each unit to compute its own `endLevel` independently. This adds complexity to the caller without improving correctness, since the callee now self-terminates reliably. The `Math.max` across units is intentionally conservative to ensure all units have enough room for their full progression.

**Alternative considered**: Compute per-unit `endLevel` values. Rejected because it requires changing the `generateProgressionArray` call signature or calling it multiple times with different bounds, adding complexity for no correctness gain.

### Decision 3: Test strategy

**Choice**: Add a focused test case that constructs two units — one with multiple class-change events and one with a single promotion — and verifies that the shorter-progression unit stops exactly at its final class's level cap (no extra rows).

**Rationale**: This directly reproduces the reported bug (Cherche vs Kellam) with deterministic mock data, making it a reliable regression guard.

## Risks / Trade-offs

- **Risk**: The duplicate break check could mask a logic error in the main break condition. → **Mitigation**: Both checks use the same predicate (`displayLevelNum > cap && no events && not infinite`). They are consistent by construction.
- **Risk**: Existing tests may depend on `generateProgressionArray` producing more rows than the class cap when `endLevel` is large (e.g., the "expand to level 100" test at line 183 expects 100 rows). → **Mitigation**: That test case needs to be updated. A unit with `maxLevel !== "infinite"` should NOT produce 100 rows past its cap. The test expectation is incorrect and should be fixed to assert the correct capped behavior (40 rows for a standard 20+20 unit).
- **Trade-off**: Keeping the inflated `maxLevelFromUnits` means `generateProgressionArray` iterates through unnecessary loop cycles (the loop body is cheap since it breaks early). This is acceptable for the table sizes involved (< 200 rows).
