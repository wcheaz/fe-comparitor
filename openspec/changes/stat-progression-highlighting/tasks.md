## 1. Comparator Page — Pass Other Unit Props

- [x] 1.1 In `app/comparator/page.tsx`, update each `StatProgressionTable` instance to pass `otherUnit`, `otherUnitPromotionEvents`, and `otherUnitReclassEvents` props. When two units are selected, table A receives unit B's data and vice versa. When one unit is selected, omit the props. The page already has access to both units via `selectedUnits` and both event maps via `promotionEvents`/`reclassEvents`.
  - Done when: Both tables receive the other unit and its events when two units are selected, and receive nothing when one unit is selected.
  - Verify by: `npm run build` passes. In the browser, select two units — React DevTools shows each table has `otherUnit` pointing to the other unit. Select one unit — `otherUnit` is absent.
  - Stop and hand off if: The `StatProgressionTableProps` interface cannot be extended (e.g., if it's shared with other consumers that break).

## 2. StatProgressionTable — Extend Props and Compute Other Unit's Progression

- [x] 2.1 Add `otherUnit?: Unit | null`, `otherUnitPromotionEvents?: PromotionEvent[]`, and `otherUnitReclassEvents?: ReclassEvent[]` to `StatProgressionTableProps` in `components/features/StatProgressionTable.tsx`. Add a new `useMemo` that computes the other unit's progression array (calling `generateProgressionArray` with the same `minLevel`/`maxLevel`/`classes` logic) and returns a `Map<number, ProgressionRow>` keyed by `internalLevel`. When `otherUnit` is null/undefined, return an empty map.
  - Done when: The component compiles with the new props and builds the lookup map without errors.
  - Verify by: `npm run build` passes with no type errors. The map is populated with correct rows when `otherUnit` is provided.
  - Stop and hand off if: `generateProgressionArray` has side effects or performance issues that prevent it from being called for a second unit within the same component.

## 3. StatProgressionTable — Toggle for Skipping Pre-Join Rows

- [x] 3.1 Convert the valid-level filtering into a user-controlled toggle. Refactor the existing `effectiveStartLevel` helper and `minVisibleLevel` filtering logic to be conditional on a new boolean state (e.g., `hidePreJoinRows` or `skipUnavailableLevels`), defaulting to `false` (show all rows). When the toggle is ON, rows where either unit has `isSkipped: true` are hidden from both tables (current filtering behavior). When the toggle is OFF, both tables render all rows from level 1 to max, with `"-"` for pre-join levels. Add a small toggle control (button or switch) near the table header or above the tables in the comparator page, labeled something like "Hide unavailable levels". Pass the toggle state down to each `StatProgressionTable` as a prop. The highlight computation in task 4 must respect whichever mode is active — `isSkipped` rows never receive highlights regardless of toggle state.
  - Done when: Comparing Chrom (level 1) and Cherche (level 12) — toggle OFF shows both tables from level 1 with `"-"` for Cherche levels 1–11; toggle ON hides rows below level 12 from both tables. Toggle state defaults to OFF. Toggle only appears when two units are selected.
  - Verify by: `npm run build` passes. In the browser, confirm toggle appears with two units, defaults to showing all rows, and correctly hides pre-join rows when toggled ON. Confirm single-unit mode shows no toggle and all rows.
  - Stop and hand off if: The toggle placement conflicts with existing table controls (expand to level 100, stat visibility toggles).

## 4. StatProgressionTable — Per-Cell Highlight Computation

- [x] 4.1 Implement per-cell highlight logic in the table body render (around line 633). For each row, look up the other unit's row at the same `internalLevel` in the lookup map. For each `activeStatKey`, get both stat values (with `skl`/`dex` fallback). Apply the comparison rules: if either row is `isSkipped` or either value is undefined → no highlight (this covers levels where only one unit has joined); if `primary > other` → `bg-green-500/20`; if `primary === other` and both non-zero → `bg-yellow-500/20`; else → no highlight. The comparison highlight class replaces the promotion `bg-blue-100` when both apply. The promotion sparkle icon remains visible.
  - Done when: Cells render `bg-green-500/20` for the higher stat, `bg-yellow-500/20` for equal non-zero stats, and no highlight otherwise. Pre-join rows (where one unit has `isSkipped`) show `"-"` with no comparison highlight. Promotion rows with highlights show the comparison color instead of blue but still show the sparkle.
  - Verify by: `npm run build` passes. In the browser, select Chrom (level 1) and Cherche (level 12) — confirm levels 1–11 show `"-"` for Cherche with no highlights on either table. Confirm levels 12+ show green/yellow highlights where stats differ or match. Confirm no highlights appear in single-unit mode.
  - Stop and hand off if: The `skl`/`dex` fallback logic produces incorrect comparisons for edge-case games.

## 5. StatProgressionTable — Legend Updates

- [x] 5.1 Update the legend section (around line 680). Add two conditional entries that render only when `otherUnit` is provided: a green swatch (`bg-green-500/20`) labeled "Higher stat" and a yellow swatch (`bg-yellow-500/20`) labeled "Equal stats". The existing "Unit not yet available at this level" legend entry remains always visible (since `isSkipped` rows are no longer filtered out).
  - Done when: Two-unit mode shows "Higher stat", "Equal stats", and "Unit not yet available at this level" legend entries. Single-unit mode shows only the original legend entries.
  - Verify by: `npm run build` passes. In the browser, confirm legend adapts correctly for one-unit and two-unit modes.
  - Stop and hand off if: The legend is rendered by a shared component that cannot be conditionally modified.
