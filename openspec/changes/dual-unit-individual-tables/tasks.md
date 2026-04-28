## 1. StatProgressionTable Single-Unit Refactor

Refactor `components/features/StatProgressionTable.tsx` to accept a single `Unit` instead of `Unit[]`. All changes are in the same file and must be done as a coordinated pass — the props interface change cascades through the `ProgressionRow` type, the `useMemo`, the rendering JSX, and the promotion/reclass config UI.

**Scope:**
- Change `StatProgressionTableProps` from `units: Unit[]` + `Record<string, ...>` event maps to `unit: Unit | null` + flat `PromotionEvent[]` / `ReclassEvent[]` arrays (see design Decision 2 for exact interface).
- Simplify `ProgressionRow` — replace array fields (`stats: UnitStats[]`, `cappedStats: Record<string, boolean>[]`, `unitSkipped: boolean[]`, `unitIsPromotionLevel: boolean[]`, `unitPromotionInfo: (...)[]`, `unitDisplayLevels: string[]`) with single-value fields.
- Rewrite the `useMemo` (lines 114–266) to call `generateProgressionArray` once for the single unit. Remove multi-unit iteration, `maxProgressionLength` alignment, `allUnitsShowDash` filtering, cross-unit stat key union, and `skl`/`dex` collapse logic. Derive stat columns from `Object.keys(unit.stats)` filtered by canonical `statOrder`, excluding `mov`, `con`, `bld`, `aid` (design Decision 3).
- Remove the `groupBy` state and "Group By Stat" / "Group By Unit" toggle (design Decision 5). The table always renders rows as one level per row, one column per stat.
- Update table rendering JSX (lines ~830–1155) to render single-value cells instead of iterating over unit arrays. Remove cross-unit stat highlighting (green/yellow per cell).
- Update promotion/reclass config UI (lines ~400–830) to reference `unit` directly instead of `units[unitIndex]`. Simplify event handlers to use the flat callback props.
- Render empty state when `unit` is `null`.

**Done when:**
- `StatProgressionTable` accepts `unit: Unit | null`, `promotionEvents: PromotionEvent[]`, `reclassEvents: ReclassEvent[]`
- Component renders correctly for a single unit with no cross-unit logic
- No `Unit[]`, `getCommonStats`, `skl`/`dex` collapse, or `str`/`mag` merge logic remains
- No "Group By" toggle is present
- Promotion/reclass config UI still works (add/remove events, level/class dropdowns)
- Stat caps, promotion row highlighting, and expand-to-100 toggle still function
- `npx tsc --noEmit` passes with no errors in `StatProgressionTable.tsx`

**Stop and hand off if:**
- `generateProgressionArray` returns unexpected shapes for any unit — do not modify `lib/stats.ts`, report the discrepancy.
- The promotion/reclass config section has deeply coupled multi-unit logic that cannot be simplified without a larger architectural change — document the blocker and hand off.

- [ ] 1.1 Refactor StatProgressionTable to single-unit props interface and coordinate all internal changes (ProgressionRow type, useMemo, rendering JSX, config UI, state cleanup)

## 2. Comparator Page Integration

Update `app/comparator/page.tsx` to render two independent `StatProgressionTable` instances and enforce a maximum of 2 selected units.

**Scope:**
- Change `maxUnits` from 4 to 2 in the comparator page state and the `UnitSelector` `maxUnits` prop.
- Remove the single shared `StatProgressionTable` rendering inside a `Card`.
- Add a `grid grid-cols-1 md:grid-cols-2 gap-6` layout rendering one `Card` per selected unit (up to 2). Each `Card` has the unit's name as `CardTitle` and the `StatProgressionTable` as `CardContent`.
- For each table instance, extract the unit's events from the `Record<string, ...>` state and pass flat arrays. Wrap callbacks to update the parent record by unit ID.
- Remove the `handleUnit1PromotionChange` and `handleUnit2PromotionChange` handlers (they assumed specific indices). Replace with a generic handler that takes a `unitId` parameter.
- Update the "How to Use" section text from "up to 4 units" to "2 units".
- `ComparisonGrid` remains unchanged (it already renders columns per-unit).

**Done when:**
- Two independent tables render side-by-side in a 2-column grid, each showing one unit's progression
- Selecting a third unit is prevented by the `UnitSelector`
- Each table's promotion/reclass events are independent — changing one does not affect the other
- Removing a unit and adding a new one works correctly
- The `ComparisonGrid` still renders base stats and growth rates side-by-side for the 2 selected units
- `npx tsc --noEmit` passes with no errors in `comparator/page.tsx`
- `npm run build` succeeds

**Stop and hand off if:**
- The `ComparisonGrid` component requires changes to work with only 2 units — it should not, but if it does, document what's needed.

- [ ] 2.1 Update comparator page to render dual independent tables with 2-unit max

## 3. Cleanup and Verification

Remove unused code and verify the full application builds and renders correctly.

**Scope:**
- Remove any dead imports or unused variables left from the refactor.
- Check if `components/features/StatDifferenceHelper.tsx` is still imported anywhere. If not, leave it in place (do not delete — it may be used later for the sync toggle feature).
- Update page description text from "Compare up to 4 units" to "Compare 2 units" anywhere it appears in the comparator page or home page.
- Run lint, typecheck, and build.

**Done when:**
- `npx tsc --noEmit` passes with zero errors
- `npm run lint` passes with zero errors
- `npm run build` succeeds
- The comparator page loads in the browser and two independent tables render for two selected units
- Each table shows only its unit's own stat keys and levels
- Pre-join levels show "-" in each table independently

**Stop and hand off if:**
- Build errors persist after two fix attempts — document the errors and hand off.

- [ ] 3.1 Clean up unused code, update description text, and verify build + lint + typecheck pass
