## Context

The comparator page renders two independent `StatProgressionTable` instances side-by-side (`app/comparator/page.tsx` lines 79–101). Each table receives a single `Unit` and generates its own full progression array via `generateProgressionArray` in `lib/stats.ts`.

Pre-join rows (where `internalLevel < unit.level` for non-promoted, non-trainee units) are marked `isSkipped: true` and render as `"-"` in the UI. The two tables currently share no state and perform no cross-unit coordination.

## Goals / Non-Goals

**Goals:**
- Hide level rows from both tables when at least one unit does not exist at that level (i.e., has `isSkipped: true`).
- The visible floor becomes `Math.max(unitA.effectiveStartLevel, unitB.effectiveStartLevel)`.
- Pre-promoted and trainee units count as "existing from level 1" — they do not push the floor up.
- Single-unit mode is unaffected: when only one unit is selected, all levels render as before.

**Non-Goals:**
- Cross-table stat highlighting or alignment (already handled by `ComparisonGrid`).
- Changes to `generateProgressionArray` — the full array is still generated; filtering is a rendering concern only.
- Shared scroll synchronization between tables.

## Decisions

### Decision 1: Filter at the comparator page level

**Choice**: Compute `minVisibleLevel` in `app/comparator/page.tsx` and pass it as an optional prop to `StatProgressionTable`.

**Rationale**: The page already owns the `selectedUnits` array and knows whether one or two units are selected. Keeping coordination logic in the page preserves `StatProgressionTable` as a standalone component that still works without any coordination prop.

**Alternatives considered**:
- Pass the "other unit" into each table and let each table compute the floor — couples tables together and breaks the independent design.
- Filter rows inside each table by simply removing all `isSkipped` rows — this would produce different starting levels for each table (unit A might start at level 5, unit B at level 10), which doesn't satisfy the requirement that levels 5–9 are hidden from both.

### Decision 2: `effectiveStartLevel` algorithm

```typescript
function effectiveStartLevel(unit: Unit): number {
  if (unit.isPromoted) return 1;
  // Trainee units join at negative levels or level 1 — treat as 1
  if (unit.level < 1) return 1;
  return unit.level;
}
```

When two units are selected: `minVisibleLevel = Math.max(effectiveStartLevel(unitA), effectiveStartLevel(unitB))`.

When one unit is selected: `minVisibleLevel` is not passed (or `undefined`), and the table renders all rows unfiltered.

### Decision 3: Filtering mechanism inside StatProgressionTable

Add an optional `minVisibleLevel?: number` prop to `StatProgressionTableProps`. When provided, filter the `rows` array in the existing `useMemo`:

```typescript
const filteredRows = minVisibleLevel != null
  ? rows.filter(row => row.internalLevel >= minVisibleLevel)
  : rows;
```

This removes `isSkipped` rows and any normal rows below the floor. Since `isSkipped` rows are the only rows below a unit's join level (for non-promoted, non-trainee units), the filter is equivalent to "remove all skipped rows" when the floor is set correctly.

### Decision 4: Legend update

When rows are filtered, the legend entry `"Unit not yet available at this level"` becomes less relevant because skipped rows are hidden. Keep the legend entry but only render it when at least one `isSkipped` row is visible (i.e., when `filteredRows.some(r => r.isSkipped)` is true). This handles the single-unit case where skipped rows are still shown.

## Risks / Trade-offs

**[Pre-promoted + normal unit mismatch]** → A pre-promoted unit (e.g., level 1 promoted) paired with a level 15 normal unit: `minVisibleLevel = 15`. The pre-promoted table hides its real rows for levels 1–14, which contain valid data. Mitigation: this is the intended behavior per the requirement — if one unit doesn't exist at those levels, comparisons are meaningless.

**[Trainee units with negative levels]** → Trainee units can have negative internal levels (−9 to 0). `effectiveStartLevel` returns 1 for these units, so they never push the floor below 1. No mitigation needed — trainee units effectively always "exist."

**[Single unit UX regression]** → If a user adds a unit, sees full levels, then adds a second unit, rows disappear. This is expected but could be surprising. Mitigation: documented in the proposal as intended behavior.
