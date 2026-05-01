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
