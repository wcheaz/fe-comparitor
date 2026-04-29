## Context

This project is a Fire Emblem unit comparator built with Next.js + TypeScript. Awakening units have a three-layer stat system:

- `unit.stats` = personal bases (computed as `visible_base - class_base` during scraping)
- `class.baseStats` = class bases
- `class.growths` = class growth rates
- `class.statModifiers` = display-only modifiers added on top of capped stats
- `class.maxStats` = class stat caps

The current codebase has two independent stat calculation paths:

1. `calculateAverageStats(unit, targetLevel)` — simple formula, used by `app/units/[id]/page.tsx`. No class awareness at all.
2. `generateProgressionArray(unit, start, end, classes, ...)` — full progression, used by `StatProgressionTable`. Already handles Awakening class growths and stat modifiers, but caps internal stats destructively (capped values become the base for subsequent growth, so growth past a cap is lost on reclass).

The UI display components (`ComparisonGrid`, `StatTable`) read directly from `unit.stats` and `unit.growths` and show only personal values.

## Goals / Non-Goals

**Goals:**
- Display combined `personal_base + class_base` and `personal_growth + class_growth` for Awakening units in all stat tables
- Preserve uncapped internal stat accumulation in `generateProgressionArray` so Awakening units retain growth past class caps
- Make `calculateAverageStats` class-aware for Awakening units
- Keep non-Awakening unit behavior completely unchanged

**Non-Goals:**
- Changing data files (`units.json`, `classes.json`) — all needed fields already exist
- Modifying the scraping pipeline
- Adding new UI components or pages
- Changing the `statModifiers` application logic (already correct as display-only additive layer)

## Decisions

### Decision 1: Helper function for combined Awakening display values

Create a utility function (or functions) in `lib/stats.ts` that computes combined bases and combined growths for Awakening units. Components call this to get display values rather than reading `unit.stats`/`unit.growths` directly.

**Signature:**
```typescript
function getEffectiveBaseStats(unit: Unit, classData: Class | undefined): UnitStats
function getEffectiveGrowths(unit: Unit, classData: Class | undefined): UnitStats
```

For non-Awakening units, these return `unit.stats` and `unit.growths` unchanged. For Awakening units, they add `class.baseStats` and `class.growths` respectively.

**Rationale:** Avoids scattering `unit.game === "Awakening"` conditionals across every display component. Each component already has access to `classes` state or can look up the class.

**Alternative considered:** Inline the addition at each display site. Rejected because it duplicates logic in 4+ locations (ComparisonGrid bases, ComparisonGrid growths, StatTable bases, StatTable growths, StatProgressionTable).

### Decision 2: Uncapped vs capped stat tracking in generateProgressionArray

Introduce a separate `uncappedBaseStats` variable alongside `baseStatsForCurrentClass`. The `calculateCurrentStats` helper returns both uncapped and capped values. Only the capped value is used for display rows. Only the uncapped value is carried forward on class changes.

**For Awakening units:**
- `uncappedBaseStats` is initialized to `unit.stats + class.baseStats` (combined bases)
- Growth is added to `uncappedBaseStats` each level with no cap
- Display stats = `min(uncapped, class.maxStats) + class.statModifiers`
- On promotion: `uncappedBaseStats = finalizedUncappedStats + promotionBonus`, floored by `newClass.baseStats` only on the uncapped layer
- On reclass: `uncappedBaseStats = finalizedUncappedStats` (no floor, no reset)

**For non-Awakening units:**
- `uncappedBaseStats` is not used; existing behavior unchanged (destructive capping remains)

**Rationale:** This matches Awakening's actual game mechanic — the game tracks an internal "real" stat that grows indefinitely, and caps only affect the displayed value.

**Alternative considered:** Track only uncapped stats for all games and apply caps purely at display time. Rejected because non-Awakening games use destructive capping (a stat that hits the cap stays at the cap), and changing this for all games risks regressions in existing test fixtures for FE6/FE7/FE8/FE3H/Engage.

### Decision 3: calculateAverageStats signature change

Add an optional `classes?: any[]` parameter to `calculateAverageStats` and `calculateAverageStatsAtLevel`. When provided for an Awakening unit, look up the unit's starting class and use combined bases, combined growths, and class caps.

**Callers affected:**
- `app/units/[id]/page.tsx` line 27 — needs to import and pass `getAllClasses` result
- `lib/stats.ts` internal uses in `compareUnits` — no change needed (compares two units at personal level, callers can provide classes if needed)

**Rationale:** Backward-compatible optional parameter. Existing callers that don't pass `classes` get identical behavior.

**Alternative considered:** Create a new `calculateAwakeningAverageStats` function. Rejected because it duplicates the entire formula and forces callers to branch on game type.

### Decision 4: StatTable and ComparisonGrid class data access

Both components need to look up the unit's starting class to compute combined values.

- `ComparisonGrid`: already has `classes` state (line 49). Look up each unit's class via `classes.find(c => c.id === unit.class && c.game === unit.game)`.
- `StatTable`: currently receives only `unit`. Add an optional `classData?: Class` prop. The parent (`app/units/[id]/page.tsx`) looks up the class and passes it.

**Rationale:** Minimal prop changes. StatTable doesn't need the full class list — just its one class.

## Risks / Trade-offs

**[Risk] Existing progression table tests break for Awakening** → The `generateProgressionArray` Awakening test at line 444 of `stats.test.ts` asserts specific stat values. The uncapped tracking change will shift those values. The test must be updated to reflect the corrected (uncapped) behavior. This is expected — the old values were incorrect per Awakening mechanics.

**[Risk] Regression in non-Awakening games** → Non-Awakening code paths are completely unchanged in `generateProgressionArray` (the uncapped branch is gated on `unit.game === "Awakening"`). The existing FE6/FE7/FE8/Engage tests serve as regression guards. No risk as long as the Awakening guard is correct.

**[Trade-off] Two stat layers add complexity to generateProgressionArray** → The function is already 300+ lines. Adding an uncapped layer increases cognitive load. Mitigated by keeping the uncapped logic gated behind `unit.game === "Awakening"` and adding clear comments.

**[Trade-off] calculateAverageStats becomes class-aware but only for Awakening** → Other games don't have separate class growths in their data, so the parameter is effectively Awakening-only. This is acceptable — if other games add class growths later, the same parameter serves them.
