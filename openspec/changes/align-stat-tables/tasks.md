## 1. Coordination State in ComparatorPage

- [x] 1.1 Add coordination state and props wiring in `app/comparator/page.tsx`
  Add a `promoSectionHeights` state (`Record<string, number>`) to `ComparatorPage`. Add a `handlePromoHeightChange(unitId: string, height: number)` callback that updates this state and also cleans up entries for units no longer in `selectedUnits`. Compute `minPromoSectionHeight` as `Math.max(...Object.values(promoSectionHeights))` when two units are selected, or `undefined` otherwise. Pass `minPromoSectionHeight` and `onPromoHeightChange` (bound to each unit's id) as new props to each `StatProgressionTable` in the `.map()` loop (lines 89–121).
  **Verify by**: Rendering two units in the browser, confirming the component mounts without console errors. The new props are passed (inspect via React DevTools) but have no visible effect yet since `StatProgressionTable` does not consume them until task 2.1.
  **Stop and hand off if**: The existing stat progression table rendering breaks after adding the new props — likely a TypeScript error from missing prop types on `StatProgressionTable`.

## 2. ResizeObserver Measurement and Min-Height Alignment in StatProgressionTable

- [x] 2.1 Add new props, ResizeObserver, and min-height application in `components/features/StatProgressionTable.tsx`
  Extend the `StatProgressionTableProps` interface (around line 25) to accept optional `minPromoSectionHeight: number | undefined` and `onPromoHeightChange: (height: number) => void`. Destructure them from props. Add a `useRef` for the promotion/reclass section div (the `<div>` at line 309 — `className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded border border-gray-200"`). Add a `useEffect` that creates a `ResizeObserver` on that ref, observing the section's height and calling `onPromoHeightChange` on each resize entry (use `entry.contentRect.height`). The effect's cleanup function SHALL call `observer.disconnect()`. Apply `style={{ minHeight: minPromoSectionHeight != null ? minPromoSectionHeight : undefined }}` to the same promotion/reclass section div. Attach the ref to that div.
  **Verify by**:
  - `npm run build` passes with no type errors.
  - Open the comparator with two units where one can promote and one cannot (e.g., Roy and Perceval from FE6). Confirm both data table headers appear at the same Y position. Use browser DevTools to inspect the shorter card's promotion section and confirm it has a `min-height` inline style matching the taller card's section height.
  - Add a class-change event to one unit via the "+" button. Confirm the other card's `min-height` updates in real time.
  - Remove one unit from selection. Confirm the remaining card's promotion section loses its `min-height` override.
  - View on a narrow viewport (below `md` breakpoint). Confirm both cards stack vertically and `min-height` has no visual effect.
  **Stop and hand off if**: The `ResizeObserver` callback causes an infinite loop (observation triggers resize which triggers observation). The design doc notes this should not happen because `min-height` only expands the element without reflowing children — if it does happen, debounce the callback.

## 3. Alignment Tuning

- [x] 3.1 Reevaluate and fix remaining vertical misalignment between tables
  If the two data tables are still slightly offset after tasks 1.1 and 2.1, investigate and fix the root cause. Possible issues include: the stat toggle header section (lines 262–307) differing in height between the two tables (e.g., different numbers of stat toggle buttons wrapping to multiple lines), or the `min-height` measurement not accounting for margins/padding/borders on the promotion section. Measure the full distance from the top of `CardContent` to the top of the data table in both cards using DevTools, identify which element introduces the mismatch, and apply the same ResizeObserver + min-height coordination pattern to that element as well (or extend the existing measurement to cover the full pre-table region).
  **Verify by**:
  - Select two units with different stat key counts (e.g., a GBA unit with 7 stats and a Three Houses unit with 10 stats). Confirm the data table headers are at the same Y position.
  - Select two units where one has promotion/reclass options and the other does not. Confirm alignment holds.
  - Add/remove class-change events and confirm alignment holds after each change.
  - Compare screenshots of both cards at the same viewport — the `<thead>` rows should overlap perfectly when placed side-by-side.
  **Stop and hand off if**: The misalignment is caused by something outside the `StatProgressionTable` component (e.g., `CardHeader` height differences due to unit name length). In that case, document the finding and hand off for a design decision on whether to also synchronize `CardHeader` heights.

- [x] 3.2 Fix ResizeObserver measurement inflation when min-height is applied
  The current implementation observes the same div that receives the `min-height` inline style. This means `entry.contentRect.height` reports the inflated `min-height` value rather than the natural content height. When unit A has a taller promotion section, unit B's reported height inflates to match, so both report the same value and `Math.max` can never correctly track the true maximum as content changes.
  
  **Fix**: Move the `ref` and `ResizeObserver` to an inner wrapper div (with no `min-height`) that wraps only the natural content — both the stat toggle header and the promotion/reclass section. The outer div keeps the `style={{ minHeight }}` and the `ref` moves to the inner div. Alternatively, observe a child element whose height is not affected by `min-height` — such as the promotion/reclass section's content container directly. The `min-height` must remain on the outermost measured div to push the data table down.
  
  **Verify by**:
  - Select two units where one can promote and one cannot. Confirm both data table headers align.
  - Add multiple class-change events to one unit via the "+" button. Confirm the other unit's `min-height` increases to match and alignment holds.
  - Remove class-change events from the unit that had more. Confirm the `min-height` shrinks to the new max and alignment holds.
  - Swap units (remove one, select a different one). Confirm alignment re-establishes correctly.
  - `npm run build` passes with no type errors.
  **Stop and hand off if**: Moving the ref to an inner wrapper breaks the measurement because the inner wrapper's height does not include elements outside it. In that case, consider using `scrollHeight` or `offsetHeight` of the outer div instead of `contentRect.height`, which report natural content height regardless of `min-height`.

## 4. Two-Row Grid Layout (replaces ResizeObserver approach)

The ResizeObserver + min-height approach (tasks 1–3) has proven fragile — measurement inflation and varying content heights cause persistent misalignment. Replace it with a two-row CSS grid layout at the page level that guarantees alignment by construction, with zero JS coordination needed.

- [x] 4.1 Remove ResizeObserver and coordination state
  Revert all code added in tasks 1.1–3.2: remove `promoSectionHeights` state, `handlePromoHeightChange`, `minPromoSectionHeight` computation, and `onPromoHeightChange` prop passing from `app/comparator/page.tsx`. Remove `minPromoSectionHeight`, `onPromoHeightChange`, `promoSectionRef`, the ResizeObserver `useEffect`, and the `min-height` inline style from `components/features/StatProgressionTable.tsx`. Restore the component's props interface and JSX to its original structure (single root div with the stat toggle header, promo section, and data table all in one flow).
  **Verify by**: `npm run build` passes. The stat progression tables render identically to before this change (no alignment, no console errors).

- [ ] 4.2 Split StatProgressionTable into PromoSection and DataTable sub-components
  Extract two new components from `StatProgressionTable.tsx`:
  - `StatPromoSection` — renders the stat toggle header (Average Stats title, visible stat buttons, "Expand to Level 100" checkbox) and the promotion/reclass configuration section (class-change dropdowns, add/remove buttons). Accepts all relevant props: `unit`, `promotionEvents`, `reclassEvents`, `onPromotionEventsChange`, `onReclassEventsChange`, `selectedDifficulty`, `visibleStats`, `toggleStatVisibility`, `expandToLevel100`, `setExpandToLevel100`, `progressionData`, `classes`, and any other state the promo section needs.
  - `StatDataTable` — renders the scrollable data table (`<table>` with `<thead>` and `<tbody>`) and the legend. Accepts: `unit`, `progressionData`, `filteredRows`, `activeStatKeys`, `visibleStats`, `otherUnit`, `otherUnitProgressionMap`, `hidePreJoinRows`, and any other state the data table needs.
  
  The parent `StatProgressionTable` component remains as a wrapper that manages shared state (e.g., `expandToLevel100`, `visibleStats`, `classes`, `progressionData`) and renders both sub-components. This preserves the single-component abstraction for callers while enabling the page to render the two sections in separate grid rows if desired.
  
  Alternatively, if extracting sub-components is too invasive, the parent can accept a `mode` prop (`'full'` | `'promo'` | `'table'`) and conditionally render only the relevant section, with shared state managed via the existing component internals.
  
  **Verify by**: `npm run build` passes. Rendering two units produces the same visual output as before — the promo section and data table still appear in the same order within each card. No behavior changes.
  **Stop and hand off if**: The state dependencies between the promo section and data table are too tightly coupled to split cleanly (e.g., the data table re-renders when promo events change and needs access to computed progression data). In that case, use the `mode` prop approach instead of full extraction.

- [ ] 4.3 Restructure page layout into two-row grid
  In `app/comparator/page.tsx`, replace the current single `grid grid-cols-1 md:grid-cols-2 gap-6` that wraps both cards with a two-row layout:
  
  **Row 1** — A `grid grid-cols-1 md:grid-cols-2 gap-6` containing one `Card` per unit. Each card has the `CardHeader` (unit name) and `CardContent` containing only the `StatPromoSection` (or `StatProgressionTable` with `mode='promo'`).
  
  **Row 2** — A `grid grid-cols-1 md:grid-cols-2 gap-6` containing one container per unit. Each container renders only the `StatDataTable` (or `StatProgressionTable` with `mode='table'`). These containers do NOT need cards — they render the data table directly so the table headers are at the exact same Y position.
  
  The two grids use the same `gap-6` and column structure so the columns align vertically. The data table row starts at a uniform Y position regardless of how tall each unit's promo section is.
  
  On mobile (`grid-cols-1`), each unit's promo section and data table stack naturally — no visual change from current behavior.
  
  **Verify by**:
  - Select two units where one can promote and one cannot (e.g., Roy and Perceval from FE6). Confirm both data table headers are at the same Y position.
  - Add multiple class-change events to one unit. Confirm the data tables remain aligned regardless of promo section height differences.
  - Remove class-change events. Confirm alignment holds.
  - Swap units. Confirm alignment re-establishes.
  - Select two units with different stat key counts (e.g., 7 vs 10 stats). Confirm the stat toggle buttons wrapping to different lines does NOT break alignment (the stat toggle is in row 1 with the promo section, so its variable height is absorbed there).
  - View on a narrow viewport. Confirm cards stack vertically as before.
  - `npm run build` passes with no type errors.
  **Stop and hand off if**: The shared state between the promo section and data table (e.g., `progressionData` computed from promo events) cannot be passed between the two separate grid rows without lifting significant state to the page level. In that case, keep `StatProgressionTable` as a single wrapper component that renders both sub-components internally, and use the two-row grid at the page level with the wrapper component split across both rows via CSS (e.g., the wrapper renders both sections but is placed in a single grid cell spanning both rows, or the page passes refs to position the table section).
