# Quality Gate Baselines for fix-level-cap-overflow

## Gates

| Gate | Status | Notes |
|------|--------|-------|
| `npx tsc --noEmit` | PASS | Exits 0, no errors |
| `npm run lint` | PASS (1 warning) | Warning: `StatProgressionTable.tsx:255` missing dep `hasInitializedStats` in `useMemo` |
| `npm test` | FAIL (6 tests) | See failing test details below |

## Failing Tests (all pre-existing, unrelated to this change)

### `__tests__/lib/data.test.ts` (1 failure)
1. `Data Service › getAllUnits › should return all units from the data` — expects 2 units, got 67 (pre-existing, unrelated)

### `__tests__/lib/stats.test.ts` (5 failures — all pre-existing)
1. `generateProgressionArray › should generate correct progression for a standard unpromoted unit` — expects length 25, got 20 (pre-existing: game string mismatch)
2. `generateProgressionArray › should apply correct promotion bonuses and class base flooring` — expects `Level 20` at index 0, got `Level 1` (pre-existing)
3. `generateProgressionArray › should handle units with missing class data gracefully` — expects length 25, got 20 (pre-existing)
4. `generateProgressionArray › should calculate growth rates correctly across promotion boundary` — expects HP >= 30, got 19.8 (pre-existing)
5. `generateProgressionArray › should handle 1-tier promoted units correctly (Seth - Paladin)` — has "Tier" indicators (pre-existing)

## Passing Tests
- 22 tests pass across 3 suites (up from 20 baseline — 2 new tests added by this change)
- `__tests__/components/features/ClassAbilitiesRow.test.tsx` — all tests pass

## Post-Implementation Quality Gate Summary

- `npx tsc --noEmit`: PASS (exits 0)
- `npm run lint`: PASS (1 pre-existing warning, unchanged)
- `npm test`: 6 failures (all pre-existing; 1 fewer than baseline of 7, because the old incorrect "expand to level 100" test was replaced with a correct passing test)
