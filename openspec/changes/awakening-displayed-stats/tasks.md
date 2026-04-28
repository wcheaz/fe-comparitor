## 1. Helper Functions

- [x] 1.1 Add `getEffectiveBaseStats(unit, classData)` and `getEffectiveGrowths(unit, classData)` to `lib/stats.ts`. For Awakening units, return `unit.stats + class.baseStats` and `unit.growths + class.growths`. For non-Awakening units or when `classData` is undefined, return `unit.stats` and `unit.growths` unchanged. Export both functions.
  - **Done when:** Both functions exist, exported from `lib/stats.ts`. `getEffectiveBaseStats(awakeningUnit, tacticianClass).str` equals `unit.stats.str + class.baseStats.str`. `getEffectiveBaseStats(nonAwakeningUnit, anyClass).str` equals `unit.stats.str`.
  - **Verify by:** `npx tsc --noEmit` passes. Write a quick inline test or console assertion with Chrom + Tactician class data: personal str=1, class str=4 → combined str=5.

## 2. Uncapped Stat Accumulation in generateProgressionArray

- [x] 2.1 Modify `generateProgressionArray` in `lib/stats.ts` to track uncapped internal stats for Awakening units. Initialize `uncappedBaseStats` to `unit.stats + class.baseStats` for Awakening. The `calculateCurrentStats` helper must return both uncapped and capped values for Awakening (uncapped = base + growth with no cap; capped = min(uncapped, class.maxStats)). Use uncapped values as the carry-forward base on promotion/reclass. Display stats remain capped + statModifiers. Non-Awakening behavior unchanged.
  - **Done when:** An Awakening unit whose stat exceeds its class cap shows the capped value in the progression row, but after reclassing to a class with a higher cap, the full uncapped value becomes visible.
  - **Verify by:** `npm test` — existing non-Awakening tests still pass. Existing Awakening test at line 444 of `stats.test.ts` may need updated expected values (acceptable per design risk section). `npx tsc --noEmit` passes.
  - **Stop and hand off if:** A non-Awakening test fails after this change — the Awakening guard is leaking.

## 3. calculateAverageStats Awakening Awareness

- [x] 3.1 Add optional `classes?: any[]` parameter to `calculateAverageStats` and `calculateAverageStatsAtLevel` in `lib/stats.ts`. When provided for an Awakening unit, look up the unit's starting class, use combined bases and growths, and apply class stat caps. Non-Awakening path and callers omitting `classes` are unchanged.
  - **Done when:** `calculateAverageStats(awakeningUnit, 10, classes)` uses `unit.stats + class.baseStats` as base and `unit.growths + class.growths` as growth. `calculateAverageStats(awakeningUnit, 10)` (no classes) returns same value as before. `calculateAverageStats(nonAwakeningUnit, 10, classes)` returns same value as without classes.
  - **Verify by:** `npx tsc --noEmit` passes. `npm test` passes.

## 4. ComparisonGrid Combined Display

- [x] 4.1 Update base stats section in `components/features/ComparisonGrid.tsx` (~line 800) to use `getEffectiveBaseStats(unit, unitClass)` instead of `unit.stats[statKey]`. Look up each unit's starting class from the existing `classes` state via `classes.find(c => c.id === unit.class && c.game === unit.game)`.
  - **Done when:** ComparisonGrid shows Chrom's Str as 5 (1 personal + 4 class) instead of 1. Non-Awakening units show unchanged values.
  - **Verify by:** Load `/comparator?units=chrom` in browser, verify base stats match in-game values. `npx tsc --noEmit` passes.

- [ ] 4.2 Update growth rates section in `components/features/ComparisonGrid.tsx` (~line 862) to use `getEffectiveGrowths(unit, unitClass)` instead of `unit.growths[statKey]`. Same class lookup as 4.1.
  - **Done when:** ComparisonGrid shows Chrom's Str growth as 75% (40 personal + 35 class) instead of 40%. Non-Awakening units show unchanged values.
  - **Verify by:** Load `/comparator?units=chrom` in browser, verify growth rates match expected combined values. `npx tsc --noEmit` passes.

## 5. StatTable and Unit Detail Page

- [ ] 5.1 Add optional `classData?: Class` prop to `StatTable` component (`components/features/StatTable.tsx`). When provided for an Awakening unit, display combined bases and growths using `getEffectiveBaseStats` and `getEffectiveGrowths`. When omitted or non-Awakening, behavior unchanged.
  - **Done when:** `<StatTable unit={chromUnit} classData={tacticianClass} />` shows combined bases and growths. `<StatTable unit={nonAwakeningUnit} />` shows unchanged values.
  - **Verify by:** `npx tsc --noEmit` passes.

- [ ] 5.2 Update `app/units/[id]/page.tsx` to look up the unit's starting class via `getAllClasses()` and pass it as `classData` to all `StatTable` renders. Also pass `classes` array to `calculateAverageStats` call at line 27.
  - **Done when:** The unit detail page for an Awakening unit shows combined bases in the "Base Stats" card, combined growths in the "Growth Rates" card, and class-aware calculated stats in the "Average Stats at Level X" card.
  - **Verify by:** Navigate to `/units/chrom` in browser, verify base stats show in-game values. `npx tsc --noEmit` passes. `npm test` passes.

## 6. Test Coverage

- [ ] 6.1 Add tests to `__tests__/lib/stats.test.ts` for: (a) `getEffectiveBaseStats` returns combined values for Awakening, passthrough for non-Awakening; (b) `getEffectiveGrowths` same; (c) `calculateAverageStats` with `classes` uses combined bases/growths/caps for Awakening; (d) uncapped stat accumulation — Awakening unit exceeds cap, reclasses to higher-cap class, full uncapped value appears. Update the existing Awakening statModifiers reclass test (line 444) expected values if they shift due to uncapped tracking.
  - **Done when:** All new tests pass. All existing non-Awakening tests pass. `npm test` exits 0.
  - **Verify by:** `npm test`
  - **Stop and hand off if:** An existing FE6/FE7/FE8/FE3H/Engage test fails — the Awakening guard is leaking into non-Awakening paths.
