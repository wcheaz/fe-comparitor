# Quality Gate Baselines — fix-level-cap-overflow

## Gates

| Gate | Status | Notes |
|------|--------|-------|
| `npx tsc --noEmit` | PASS | Exits 0, no type errors |
| `npm run lint` | PASS | Only a pre-existing warning in StatProgressionTable.tsx (missing dep in useMemo) |
| `npm test` | 1 PRE-EXISTING FAILURE | See below |

## Failing Tests

1. **`__tests__/lib/data.test.ts > Data Service > getAllUnits > should return all units from the data`**
   - **Cause**: Pre-existing — test expects exactly 2 units (Marth, Ike) but the data source now returns 67 units.
   - **Related to fix-level-cap-overflow?**: No. This change only modified `lib/stats.ts`, `components/features/StatProgressionTable.tsx`, and `__tests__/lib/stats.test.ts`. The data.test.ts failure is in a completely unrelated module (`lib/data.ts` / data loading).
   - **Action**: Not in scope for this change. Should be addressed separately.

## Passing Tests (relevant to this change)

- `__tests__/lib/stats.test.ts` — 28/28 tests pass (including restored expectations and new ghost-row regression test)
- `__tests__/components/features/ClassAbilitiesRow.test.tsx` — all pass
