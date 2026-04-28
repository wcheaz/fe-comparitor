# Quality Gate Baselines for fix-level-cap-overflow

## Gates

| Gate | Status | Notes |
|------|--------|-------|
| `npx tsc --noEmit` | PASS | Exits 0, no errors |
| `npm run lint` | PASS (1 warning) | Warning: `StatProgressionTable.tsx:255` missing dep `hasInitializedStats` in `useMemo` |
| `npm test` | FAIL (7 tests) | See failing test details below |

## Failing Tests

### `__tests__/lib/data.test.ts` (1 failure)
1. `Data Service › getAllUnits › should return all units from the data` — expects 2 units, got 67 (pre-existing, unrelated to this change)

### `__tests__/lib/stats.test.ts` (6 failures)
1. `generateProgressionArray › should generate correct progression for a standard unpromoted unit` — expects length 25, got 20 (capped at level cap)
2. `generateProgressionArray › should apply correct promotion bonuses and class base flooring` — expects `Level 20` displayLevel at index 0, got `Level 1`
3. `generateProgressionArray › should handle expand to level 100 correctly` — expects length 100, got 20 (the test this change will fix)
4. `generateProgressionArray › should handle units with missing class data gracefully` — expects length 25, got 20 (capped at level cap)
5. `generateProgressionArray › should calculate growth rates correctly across promotion boundary` — expects HP >= 30 at level 22, got 19.8
6. `generateProgressionArray › should handle 1-tier promoted units correctly (Seth - Paladin)` — expects no "Tier" indicators, but found some

## Passing Tests
- 20 tests pass across 3 suites
- `__tests__/components/features/ClassAbilitiesRow.test.tsx` — all tests pass
