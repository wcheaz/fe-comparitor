## Context

The comparator page currently renders a single `StatProgressionTable` component that accepts `Unit[]` (up to 4 units) and produces an aligned multi-column table. The component is 1155 lines and contains: multi-unit row alignment logic (lines 167–257), cross-unit stat key resolution with `skl`/`dex` collapsing (lines 142–165), per-unit promotion/reclass configuration UI, stat visibility toggles, and a "Group By Stat" / "Group By Unit" toggle.

The core stat engine (`lib/stats.ts`) already operates on a single unit — `generateProgressionArray(unit, ...)` takes one `Unit` and returns that unit's progression rows. No changes are needed there.

The refactored design splits the single multi-unit table into two independent per-unit table instances, each rendered in its own `Card`. The parent page manages the two instances and passes each its own unit + events.

## Goals / Non-Goals

**Goals:**
- Refactor `StatProgressionTable` to accept a single `Unit` instead of `Unit[]`
- Render two independent table instances on the comparator page, one per selected unit
- Remove all cross-unit stat reconciliation (`getCommonStats`, `skl`/`dex` collapse, `str`/`mag` merge)
- Remove multi-unit row alignment (the `maxProgressionLength` / `allUnitsShowDash` loop)
- Remove the "Group By Stat" / "Group By Unit" toggle (no longer meaningful with one unit per table)
- Enforce max 2 units in the comparator page and `UnitSelector`
- Keep existing promotion/reclass configuration UI per table instance
- Keep stat cap display, promotion row highlighting, and expand-to-100 toggle within each table

**Non-Goals:**
- "Sync Tables" toggle for cross-table row coordination (deferred — see `hidden/TODO.md`)
- Changes to `ComparisonGrid` (base stats / growth rates tables remain side-by-side)
- Changes to `lib/stats.ts` calculation functions
- Changes to data types in `types/unit.ts`
- Stat highlighting across per-unit tables

## Decisions

### Decision 1: Refactor in-place vs. new component

**Choice:** Refactor `StatProgressionTable.tsx` in-place.

**Rationale:** The promotion/reclass config UI, stat visibility toggles, expand-to-100 toggle, class loading, and modal logic are all reusable as-is. Only the props interface and row-generation `useMemo` need to change. Creating a new component would duplicate ~800 lines of UI code.

**Alternative considered:** Create a new `IndividualProgressionTable` component alongside the old one. Rejected because the old component would be deleted anyway, and the diff is cleaner as an in-place refactor.

### Decision 2: New props interface shape

**Choice:** Replace the current multi-unit props:
```ts
interface StatProgressionTableProps {
  units: Unit[];
  promotionEvents: Record<string, PromotionEvent[]>;
  reclassEvents: Record<string, ReclassEvent[]>;
  onPromotionEventsChange: (events: Record<string, PromotionEvent[]>) => void;
  onReclassEventsChange: (events: Record<string, ReclassEvent[]>) => void;
  onAddPromotionEvent?: (unitId: string, event: PromotionEvent) => void;
  onRemovePromotionEvent?: (unitId: string) => void;
}
```
With single-unit props:
```ts
interface StatProgressionTableProps {
  unit: Unit | null;
  promotionEvents: PromotionEvent[];
  reclassEvents: ReclassEvent[];
  onPromotionEventsChange: (events: PromotionEvent[]) => void;
  onReclassEventsChange: (events: ReclassEvent[]) => void;
}
```

**Rationale:** The component no longer needs `Record<string, ...>` maps or `unitId`-keyed callbacks because it owns exactly one unit. The parent page looks up events by unit ID and passes the unwrapped arrays. `unit: Unit | null` allows rendering an empty state when no unit is selected for that slot.

**Alternative considered:** Keep `Record<string, ...>` and have the component look up its own key. Rejected because it leaks multi-unit concern into a single-unit component.

### Decision 3: Stat key resolution per table

**Choice:** Each table derives its stat columns solely from `Object.keys(unit.stats)`, filtered through the canonical `statOrder` array, excluding `mov`, `con`, `bld`, `aid`. No cross-unit union, no `skl`/`dex` collapse, no `str`/`mag` merge.

**Rationale:** This is the core simplification. Since each table has one unit, the stat columns are just that unit's own stats. The `skl`/`dex` and `str`/`mag` collapse logic existed only to merge columns across units from different games — unnecessary when each table is game-specific.

### Decision 4: Pre-join level display

**Choice:** Each table always renders from level 1 (or the trainee start level) to max. Rows before the unit's join level show "-" for all stat cells.

**Rationale:** This matches the current `generateProgressionArray` behavior where `isSkipped` is true for pre-join levels. The table simply renders all rows without filtering. No cross-table coordination.

### Decision 5: Removal of "Group By" toggle

**Choice:** Remove the "Group By Stat" / "Group By Unit" toggle from the per-unit table.

**Rationale:** The toggle controlled how multiple units' columns were grouped in the shared table. With a single unit, there is only one column per stat — grouping is meaningless. The table always renders in stat-row order (one row per level, columns per stat).

### Decision 6: Parent page layout for two tables

**Choice:** Render two `Card` components in a `grid grid-cols-1 md:grid-cols-2 gap-6` layout. Each `Card` contains the unit's name as the `CardTitle` and the `StatProgressionTable` as `CardContent`.

**Rationale:** Side-by-side layout lets the user scroll both tables visually in parallel. Single-column on mobile stacks them vertically. The grid is already used elsewhere in the comparator page (e.g., `PromotionOptionsDisplay`).

### Decision 7: Event management ownership

**Choice:** The comparator page (`app/comparator/page.tsx`) continues to own the `promotionEvents` and `reclassEvents` state as `Record<string, PromotionEvent[]>` / `Record<string, ReclassEvent[]>`. It extracts the relevant array for each unit and passes it as a flat prop. Callbacks from each table update the parent's record by unit ID.

**Rationale:** Keeps event state centralized and avoids duplicating the add/remove logic. The parent already manages this pattern for the shared table — the only change is passing unwrapped arrays instead of the full record.

## Risks / Trade-offs

- **[Risk: Two large tables on one page may have performance impact]** → Mitigation: `generateProgressionArray` is already memoized per unit via `useMemo`. Each table computes independently. The expand-to-100 toggle is per-table, so users can limit rows.
- **[Risk: Removing "Group By" toggle changes user experience]** → Mitigation: With independent per-unit tables, the grouping is implicit (each table is its own group). No user workflow is lost.
- **[Risk: Users accustomed to 3-4 unit comparison lose that ability]** → Mitigation: This is an explicit product decision documented in the proposal. The 2-unit limit simplifies the codebase and eliminates edge cases. The `ComparisonGrid` still shows side-by-side base/growth comparison.
- **[Risk: Refactoring the 1155-line component may break existing promotion/reclass UI]** → Mitigation: The promotion/reclass config section (roughly lines 400–830) is largely unit-scoped already and needs minimal changes. The row rendering section (lines 830+) simplifies since it no longer iterates over `units[]`.
