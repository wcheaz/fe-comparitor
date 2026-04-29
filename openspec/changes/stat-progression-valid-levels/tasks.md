## 1. Comparator Page — Compute and Pass minVisibleLevel

- [ ] 1.1 Add `effectiveStartLevel` helper and `minVisibleLevel` computation in `app/comparator/page.tsx`. Compute `minVisibleLevel` only when `selectedUnits.length === 2`: `Math.max(effectiveStartLevel(unitA), effectiveStartLevel(unitB))` where `effectiveStartLevel` returns `1` for pre-promoted units (`isPromoted`) or units with `level < 1`, otherwise returns `unit.level`. Pass `minVisibleLevel` as a prop to both `StatProgressionTable` instances. When one unit is selected, do not pass the prop.
  - Done when: Comparator page computes and passes `minVisibleLevel` to both tables when two units are selected, and passes nothing when one unit is selected.
  - Verify by: Select two units with different base levels in the browser and confirm via React DevTools that both tables receive the correct `minVisibleLevel` prop. Select one unit and confirm the prop is absent.
  - Stop and hand off if: The `StatProgressionTable` props interface cannot be extended without breaking other consumers.

## 2. StatProgressionTable — Accept and Apply minVisibleLevel Filter

- [ ] 2.1 Add `minVisibleLevel?: number` to `StatProgressionTableProps` in `components/features/StatProgressionTable.tsx`. In the `progressionData` useMemo (or immediately after), apply a filter: when `minVisibleLevel != null`, exclude rows where `row.internalLevel < minVisibleLevel`. Use the filtered rows for all downstream rendering (table body, legend visibility check). When `minVisibleLevel` is null/undefined, render all rows as before.
  - Done when: Passing `minVisibleLevel={10}` to the component hides rows with `internalLevel < 10`. Passing no prop renders all rows including `isSkipped`.
  - Verify by: Run `npm run build` (or `npm run lint` / typecheck) with no errors. In the browser, select a level 1 unit and a level 10 unit — both tables should start at level 10. Remove one unit and the remaining table should show all levels from 1.
  - Stop and hand off if: The `internalLevel` field is not a reliable comparison key across all unit types (e.g., if display levels and internal levels diverge in unexpected ways for promoted units).

## 3. Legend — Conditionally Render Skipped-Row Entry

- [ ] 3.1 Update the legend in `components/features/StatProgressionTable.tsx` (around line 690) so the `"Unit not yet available at this level"` entry only renders when `filteredRows.some(r => r.isSkipped)` is true. When all `isSkipped` rows have been filtered out by `minVisibleLevel`, the entry must not appear.
  - Done when: The legend entry is absent when `minVisibleLevel` filters out all skipped rows. The legend entry is present when skipped rows are visible (single-unit mode with a late-joining unit).
  - Verify by: In the browser, select two units — the "Unit not yet available" legend entry should not appear. Select one late-joining unit — the entry should appear.
  - Stop and hand off if: The legend rendering logic is shared with other components or has side effects.
