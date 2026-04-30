## Context

The comparator page renders two independent `StatProgressionTable` instances side-by-side (`app/comparator/page.tsx` lines 79–101). Each table receives a single `Unit` and generates its own full progression array via `generateProgressionArray` internally (inside a `useMemo` at line 68). The two tables currently share no state.

The `ComparisonGrid` component already implements cross-unit stat highlighting via a `getHighlightStats` function (line 1226) that computes `{ isHighest, isEqual }` per stat cell. The progression tables currently have no cross-unit comparison at all — the spec explicitly states "No stat highlighting in per-unit tables."

Pre-join rows (where `internalLevel < unit.level` for non-promoted, non-trainee units) are marked `isSkipped: true` and render as `"-"`. These rows produce no meaningful comparison data.

## Goals / Non-Goals

**Goals:**
- Apply the same green/yellow highlighting used in `ComparisonGrid` to the per-unit stat progression tables when two units are selected.
- `bg-green-500/20` for the cell whose stat is strictly highest across both units at that level.
- `bg-yellow-500/20` for cells where both units have equal non-zero values at that level.
- No highlight when values are missing, skipped, or zero for both.
- Only compare rows that exist at matching `internalLevel` in both tables. Rows with `isSkipped: true` receive no highlight and produce no highlight on the other table.
- Hide `isSkipped` rows from both tables when two units are selected (valid-level filtering), since pre-join levels with dashes are not meaningful for comparison.
- Single-unit mode remains unchanged: no highlighting, no filtering.

**Non-Goals:**
- Changes to `ComparisonGrid` or its `getHighlightStats` function.
- Changes to `generateProgressionArray` — the full array is still generated; filtering and highlighting are rendering concerns.
- Shared scroll synchronization between tables.
- Cross-table stat key reconciliation (each table still shows only its own unit's stat keys).

## Decisions

### Decision 1: Pass `otherUnit` + its events as props

**Choice**: Extend `StatProgressionTableProps` with:
```typescript
otherUnit?: Unit | null;
otherUnitPromotionEvents?: PromotionEvent[];
otherUnitReclassEvents?: ReclassEvent[];
```

Each table computes the other unit's progression internally (calling `generateProgressionArray` with the other unit's data) and builds a `Map<number, ProgressionRow>` keyed by `internalLevel` for O(1) lookup during rendering.

**Rationale**: Keeps all progression logic inside `StatProgressionTable`. No page-level refactoring beyond passing three additional props. The `generateProgressionArray` function is pure and cheap — computing it twice per unit (once as primary, once as comparison) is negligible for a client-side app.

**Alternatives considered**:
- Lift progression generation to the page level — would require extracting class loading, min/max level computation, and the `expandToLevel100` state out of the component. High refactoring cost for marginal benefit.
- Expose progression via callback/ref and coordinate at the page level — creates timing and state synchronization issues between two independent components.

### Decision 2: Highlighting algorithm

For each rendered row in the primary table, if `otherUnitProgressionMap` has an entry at the same `internalLevel`:

1. For each stat key in the primary table's `activeStatKeys`:
   - Get `primaryValue` from the row's stats (with `skl`/`dex` fallback).
   - Get `otherValue` from the other unit's row at the same `internalLevel`, looking up the same stat key.
   - If either value is undefined/null or either row has `isSkipped: true`: no highlight.
   - If `primaryValue > otherValue`: `isHighest = true` → `bg-green-500/20`.
   - If `primaryValue === otherValue` and both are non-zero: `isEqual = true` → `bg-yellow-500/20`.
   - Otherwise: no highlight.

This mirrors the `getHighlightStats` function from `ComparisonGrid.tsx` (line 1226) but adapted for per-row lookup instead of per-unit array iteration.

**Fallback for stat key mismatches**: If the primary table has a stat key (e.g., `skl`) that the other unit doesn't have, look up the fallback key (`dex`) on the other unit. If still missing, no highlight. This matches the existing `skl`/`dex` fallback pattern in both `ComparisonGrid` and `StatProgressionTable`.

### Decision 3: Valid-level filtering

When `otherUnit` is provided (two units selected), compute `minVisibleLevel = Math.max(effectiveStartLevel(thisUnit), effectiveStartLevel(otherUnit))` where:
- `effectiveStartLevel` returns `1` for pre-promoted units (`isPromoted === true`) or units with `level < 1`.
- Otherwise returns `unit.level`.

Filter `progressionData.rows` to exclude rows where `internalLevel < minVisibleLevel`. This removes all `isSkipped` rows from both tables.

When `otherUnit` is not provided (single unit), no filtering — all rows render as before.

### Decision 4: Highlight vs. promotion-level background

Promotion levels currently use `bg-blue-100`. When a cell has both a promotion highlight and a comparison highlight, the comparison highlight (`bg-green-500/20` or `bg-yellow-500/20`) SHALL take precedence. The promotion sparkle icon (`✨`) remains visible regardless of highlight class.

### Decision 5: Legend update

Add two entries to the legend when highlighting is active:
- Green swatch + "Higher stat" (matching the green highlight)
- Yellow swatch + "Equal stats" (matching the yellow highlight)

These only appear when `otherUnit` is provided. The existing "Unit not yet available at this level" legend entry only appears when visible `isSkipped` rows exist (which won't happen when filtering is active, so it effectively disappears in two-unit mode).

## Risks / Trade-offs

**[Duplicate progression computation]** → Each unit's progression is computed twice (once as primary, once as comparison in the other table). Mitigation: `generateProgressionArray` is a pure function operating on small arrays (< 100 rows). The cost is negligible in a browser.

**[Stat key mismatch between games]** → A GBA unit has `skl` while an Awakening unit has `dex`. The `skl`/`dex` fallback handles this for the two most common cases. Mitigation: if both units lack overlapping stat keys, cells simply get no highlight — no crash, no wrong data.

**[Pre-promoted + normal unit pairing]** → A pre-promoted unit's real data rows at levels 1–14 may be hidden when paired with a level 15 unit. Mitigation: this is intended — those levels can't be meaningfully compared since the other unit doesn't exist yet.
