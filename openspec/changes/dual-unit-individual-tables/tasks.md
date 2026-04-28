## 1. Props Interface & Type Definitions

Update the `StatProgressionTableProps` interface and `ProgressionRow` type in `components/features/StatProgressionTable.tsx` to reflect single-unit usage. This is a type-only change — update the interface, the type, and the component function signature. The body will produce type errors until subsequent tasks fix the implementation; this is expected.

**Scope:**
- Change `StatProgressionTableProps`: `units: Unit[]` → `unit: Unit | null`; `promotionEvents: Record<string, PromotionEvent[]>` → `promotionEvents: PromotionEvent[]`; `reclassEvents: Record<string, ReclassEvent[]>` → `reclassEvents: ReclassEvent[]`; callbacks from `Record<string, ...>` to flat array versions; remove `onAddPromotionEvent` and `onRemovePromotionEvent` (design Decision 2).
- Simplify `ProgressionRow`: replace array fields (`stats: UnitStats[]`, `cappedStats: Record<string, boolean>[]`, `unitSkipped: boolean[]`, `unitIsPromotionLevel: boolean[]`, `unitPromotionInfo: (...) []`, `unitDisplayLevels: string[]`) with single-value equivalents (`stats: UnitStats`, `cappedStats: Record<string, boolean>`, `isSkipped: boolean`, `isPromotionLevel: boolean`, `promotionInfo: ...`, `displayLevel: string`).
- Update the component function signature to destructure the new props.

**Done when:**
- `StatProgressionTableProps` and `ProgressionRow` reflect single-unit shapes
- Component function signature matches the new interface

**Stop and hand off if:** The existing interface has hidden consumers outside the known files — search for imports of `StatProgressionTable` or `ProgressionRow` before proceeding.

- [x] 1.1 Change `StatProgressionTableProps` to accept `unit: Unit | null` and flat event array props
- [x] 1.2 Simplify `ProgressionRow` type from array fields to single-value fields

## 2. Row Generation (useMemo)

Rewrite the `useMemo` block (lines ~114–266) to generate progression data for a single unit instead of aligning across multiple units.

**Scope:**
- Replace `units.map(unit => generateProgressionArray(...))` with a single `generateProgressionArray(unit, minLevel, maxLevel, classes, promotionEvents, reclassEvents)` call.
- Derive stat columns from `Object.keys(unit.stats)` filtered by canonical `statOrder`, excluding `mov`, `con`, `bld`, `aid`. No cross-unit union, no `skl`/`dex` collapse, no `str`/`mag` merge (design Decision 3).
- Replace the multi-unit row alignment loop (iterating `maxProgressionLength`, building per-unit arrays, checking `allUnitsShowDash`) with a simple loop over the single progression array, building `ProgressionRow` objects with single-value fields.
- Guard the entire useMemo on `unit !== null` — return empty `{ rows: [], statKeys: [] }` when null.
- Update `minLevel` and `maxLevel` calculations to work from the single unit's data instead of `Math.min/max` across `units.map()`.
- Remove `allProgressions` from the return value (no longer needed).

**Done when:**
- useMemo produces `ProgressionRow[]` with single-value fields for one unit
- No `units.forEach`, `units.map`, or multi-unit iteration remains in the useMemo
- Stat keys are derived solely from the single unit's stats
- `npx tsc --noEmit` shows no errors originating in the useMemo block

**Stop and hand off if:** `generateProgressionArray` returns an unexpected shape for any unit — do not modify `lib/stats.ts`, report the discrepancy.

- [x] 2.1 Rewrite useMemo to call `generateProgressionArray` once for the single unit and build single-value `ProgressionRow` objects
- [x] 2.2 Replace cross-unit stat key resolution with single-unit derivation from `Object.keys(unit.stats)`

## 3. Component State & Toggles

Remove the `groupBy` state variable and the "Group By Stat" / "Group By Unit" toggle UI. With a single unit per table, grouping is meaningless (design Decision 5).

**Scope:**
- Remove `const [groupBy, setGroupBy] = useState<'stat' | 'unit'>('stat')`.
- Remove the toggle buttons/radio UI that switches between "Group By Stat" and "Group By Unit".
- Remove any conditional rendering that branches on `groupBy`. The table always renders in the same layout: one row per level, one column per stat.

**Done when:**
- No `groupBy` state, `setGroupBy` call, or group-by toggle UI exists in the component
- No conditional rendering branches on a group-by value

- [x] 3.1 Remove `groupBy` state and "Group By" toggle UI

## 4. Table Rendering

Update the table rendering JSX (lines ~830–1155) to work with single-value `ProgressionRow` fields instead of per-unit arrays. Remove cross-unit stat highlighting.

**Scope:**
- Replace all `row.stats.map(...)` / `row.stats[unitIndex]` patterns with direct `row.stats` access.
- Replace all `row.cappedStats[unitIndex]` with `row.cappedStats`.
- Replace `row.unitSkipped[unitIndex]` with `row.isSkipped`.
- Replace `row.unitIsPromotionLevel[unitIndex]` with `row.isPromotionLevel`.
- Replace `row.unitDisplayLevels[unitIndex]` with `row.displayLevel`.
- Replace `row.unitPromotionInfo[unitIndex]` with `row.promotionInfo`.
- Remove the outer `units.map()` loop in the table header (single unit = single set of columns).
- Remove the inner `units.map()` or `unitIndex` iteration in table body cells.
- Remove cross-unit stat highlighting logic (green = strictly highest, yellow = equal). Each cell shows its value with no color comparison to another unit.
- Keep promotion row highlighting (blue background, sparkle icon) — this is intra-unit.
- Keep capped stat styling (green bold) — this is intra-unit.

**Done when:**
- Table renders single-value cells with no array indexing
- No `unitIndex`, `units.map()`, or multi-unit iteration in the rendering JSX
- No green/yellow cross-unit highlighting in cells
- Promotion rows still highlight blue with sparkle icon
- Capped stats still display in green bold

**Stop and hand off if:** The rendering JSX has deeply nested conditional logic per unit that cannot be simplified mechanically — document the specific patterns and hand off.

- [x] 4.1 Update table header and body rendering to use single-value `ProgressionRow` fields (no array indexing, no `units.map()`)
- [x] 4.2 Remove cross-unit stat highlighting (green/yellow per cell) from the table body

## 5. Promotion/Reclass Config UI

Update the promotion and reclass event configuration section (lines ~400–830) to reference `unit` directly instead of `units[unitIndex]`.

**Scope:**
- Replace all `units[unitIndex]` references with `unit`.
- Replace all `unit.id` lookups into `promotionEvents[unit.id]` / `reclassEvents[unit.id]` with the flat `promotionEvents` / `reclassEvents` props directly.
- Simplify event change handlers to call `onPromotionEventsChange(newEvents)` and `onReclassEventsChange(newEvents)` with flat arrays instead of `Record<string, ...>` objects.
- Remove `onAddPromotionEvent` / `onRemovePromotionEvent` prop usage — the component can manage add/remove internally using the flat callback.
- Guard the entire config section on `unit !== null`.

**Done when:**
- Config UI references `unit` directly with no `units[]` array access
- Event handlers use flat array callbacks, not record-keyed callbacks
- Add/remove promotion event buttons still work
- Level and class dropdowns still render and update correctly

**Stop and hand off if:** The config UI has deeply coupled multi-unit logic (e.g., cross-unit event validation) that cannot be simplified — document and hand off.

- [x] 5.1 Update promotion/reclass config section to reference `unit` directly and use flat event array props

## 6. Empty State & Null Guard

Render an appropriate empty state when `unit` is `null` (no unit selected for this table slot).

**Scope:**
- Add an early return at the top of the component render: if `unit` is `null`, return a centered "Select a unit to view stat progression" message (matching the existing empty-state style).
- Ensure the `useMemo` and all hooks are still called unconditionally (React rules of hooks) — the guard should be in the render output, not wrapping hooks.

**Done when:**
- Component renders a friendly empty state when `unit` is `null`
- No runtime errors when `unit` is `null`
- Hooks are called unconditionally

- [x] 6.1 Render empty state when `unit` is `null`

## 7. Comparator Page Integration

Update `app/comparator/page.tsx` to render two independent `StatProgressionTable` instances and enforce a maximum of 2 selected units.

**Scope:**
- Change `maxUnits` from 4 to 2.
- Remove the single shared `StatProgressionTable` rendering inside the existing `Card`.
- Add a `grid grid-cols-1 md:grid-cols-2 gap-6` layout rendering one `Card` per selected unit (up to 2). Each `Card` has the unit's name as `CardTitle` and the `StatProgressionTable` as `CardContent`.
- For each table, extract the unit's events from the parent's `Record<string, ...>` state and pass flat arrays. Wrap callbacks so each table's `onPromotionEventsChange` / `onReclassEventsChange` updates the parent record by that unit's ID.
- Remove `handleUnit1PromotionChange` and `handleUnit2PromotionChange` — replace with a single generic handler `(unitId: string) => (events: PromotionEvent[]) => void` pattern.
- Remove `addPromotionEvent`, `removePromotionEvent`, `addReclassEvent`, `removeReclassEvent` handlers that took `unitId` as a record key — these are no longer needed since the table manages add/remove internally via the flat callbacks.
- Keep `PromotionOptionsDisplay` rendering as-is.
- Keep `ComparisonGrid` rendering as-is.

**Done when:**
- Two independent `Card`-wrapped tables render side-by-side in a 2-column grid
- Each table receives its own unit and flat event arrays
- Changing promotion/reclass events in one table does not affect the other
- Selecting a third unit is prevented by `UnitSelector` with `maxUnits={2}`
- Removing a unit and adding a new one works correctly
- `npx tsc --noEmit` passes with no errors in `comparator/page.tsx`

**Stop and hand off if:** `ComparisonGrid` breaks with only 2 units — it should not, but document the issue if it occurs.

- [x] 7.1 Change `maxUnits` from 4 to 2 in comparator page state and `UnitSelector` prop
- [x] 7.2 Replace single shared `StatProgressionTable` with dual independent `Card`-wrapped tables in a `grid grid-cols-2` layout
- [x] 7.3 Wire up event management — extract flat arrays per unit, wrap callbacks to update parent `Record<string, ...>` state

## 8. Text Updates & Cleanup

Update user-facing text and clean up dead code across all touched files.

**Scope:**
- Update comparator page description from "Compare up to 4 units" to "Compare 2 units".
- Update "How to Use" section from "up to 4 units" to "2 units".
- Check home page (`app/page.tsx`) for any "4 units" references and update.
- Remove any dead imports or unused variables left from the refactor.
- Do NOT delete `StatDifferenceHelper.tsx` — it may be reused for the sync toggle feature (see `hidden/TODO.md`).

**Done when:**
- No user-facing text references "4 units" or "up to 4 units"
- No unused imports or variables in `StatProgressionTable.tsx` or `comparator/page.tsx`

- [x] 8.1 Update all user-facing description text from "4 units" to "2 units"
- [x] 8.2 Remove dead imports and unused variables from refactored files

## 9. Verification

Run the full verification suite to confirm the refactor is complete.

**Scope:**
- Run `npx tsc --noEmit` — must pass with zero errors.
- Run `npm run lint` — must pass with zero errors.
- Run `npm run build` — must succeed.
- Visual check: the comparator page loads, two units can be selected, each shows its own independent progression table with its own stat keys and levels.

**Done when:**
- `npx tsc --noEmit` passes
- `npm run lint` passes
- `npm run build` succeeds
- Two independent tables render correctly for two selected units with different stat sets

**Stop and hand off if:** Build errors persist after two fix attempts — document the errors and hand off.

- [ ] 9.1 Run typecheck, lint, and build — confirm all pass with zero errors
