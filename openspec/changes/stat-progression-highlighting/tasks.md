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

## 3. StatProgressionTable — Valid-Level Filtering

- [ ] 3.1 Implement `effectiveStartLevel(unit)` helper: returns `1` if `unit.isPromoted === true` or `unit.level < 1`, otherwise returns `unit.level`. When `otherUnit` is provided, compute `minVisibleLevel = Math.max(effectiveStartLevel(unit), effectiveStartLevel(otherUnit))`. Apply the filter to `progressionData.rows` to exclude rows where `internalLevel < minVisibleLevel`. Store the filtered rows and use them for all downstream rendering. When `otherUnit` is absent, use unfiltered rows.
  - Done when: Selecting a level 5 unit and a level 10 unit hides rows 1–9 from both tables. Selecting a single late-join unit still shows all rows with dashes.
  - Verify by: `npm run build` passes. In the browser, confirm two-unit filtering works and single-unit mode is unchanged.
  - Stop and hand off if: The `internalLevel` field is unreliable for comparison (e.g., negative trainee levels or display-level resets after promotion cause misalignment).

## 4. StatProgressionTable — Per-Cell Highlight Computation

- [ ] 4.1 Implement per-cell highlight logic in the table body render (around line 633). For each filtered row, look up the other unit's row at the same `internalLevel` in the lookup map. For each `activeStatKey`, get both stat values (with `skl`/`dex` fallback). Apply the comparison rules: if either row is `isSkipped` or either value is undefined → no highlight; if `primary > other` → `bg-green-500/20`; if `primary === other` and both non-zero → `bg-yellow-500/20`; else → no highlight. The comparison highlight class replaces the promotion `bg-blue-100` when both apply. The promotion sparkle icon remains visible.
  - Done when: Cells render `bg-green-500/20` for the higher stat, `bg-yellow-500/20` for equal non-zero stats, and no highlight otherwise. Promotion rows with highlights show the comparison color instead of blue but still show the sparkle.
  - Verify by: `npm run build` passes. In the browser, select two units with known stat differences — confirm green/yellow highlights appear at matching levels. Confirm no highlights appear in single-unit mode. Confirm promotion rows still show sparkle icons.
  - Stop and hand off if: The `skl`/`dex` fallback logic produces incorrect comparisons for edge-case games.

## 5. StatProgressionTable — Legend Updates

- [ ] 5.1 Update the legend section (around line 680). Add two conditional entries that render only when `otherUnit` is provided: a green swatch (`bg-green-500/20`) labeled "Higher stat" and a yellow swatch (`bg-yellow-500/20`) labeled "Equal stats". Conditionally render the existing "Unit not yet available at this level" entry only when at least one visible row has `isSkipped: true` (i.e., `filteredRows.some(r => r.isSkipped)`). When filtering removes all skipped rows, this entry disappears.
  - Done when: Two-unit mode shows "Higher stat" and "Equal stats" legend entries. The "Unit not yet available" entry is hidden when filtering removes all skipped rows. Single-unit mode shows only the original legend entries.
  - Verify by: `npm run build` passes. In the browser, confirm legend adapts correctly for one-unit and two-unit modes.
  - Stop and hand off if: The legend is rendered by a shared component that cannot be conditionally modified.
