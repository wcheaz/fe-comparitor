## Context

The comparator page renders two `StatProgressionTable` components side-by-side in a `grid grid-cols-1 md:grid-cols-2 gap-6` layout (`app/comparator/page.tsx:88`). Each table is wrapped in a `<Card>`.

Inside each `StatProgressionTable` (`components/features/StatProgressionTable.tsx`), the layout from top to bottom is:

1. **Stat toggle header** (lines 262–307): Constant height, contains "Average Stats" title and visible-stat toggle buttons.
2. **Promotion & Reclass Levels section** (lines 309–656): Variable height. Contains class-change dropdowns and add/remove buttons. Height varies based on number of class-change events and whether the unit can promote or reclass at all.
3. **Data table** (lines 658–757): Scrollable table (`max-h-[70vh]`) with sticky headers.

The problem: section 2's variable height causes the data table (section 3) to start at a different Y position in each card, making visual row-by-row comparison unreliable.

## Goals / Non-Goals

**Goals:**
- The data table headers and all subsequent rows SHALL start at the same vertical position in both side-by-side cards when two units are selected.
- The alignment SHALL adapt dynamically as users add/remove class-change events.
- The solution SHALL be a no-op on mobile (single-column `grid-cols-1`) and when only one unit is selected.

**Non-Goals:**
- Synchronizing scroll position between the two tables.
- Synchronizing promotion/reclass state between the two units.
- Changing how stat highlighting or progression calculation works.
- Refactoring `StatProgressionTable` into sub-components or splitting the card layout into a two-row grid.

## Decisions

### Decision 1: Coordination mechanism — lifted state in `ComparatorPage`

**Choice:** Lift a `promoSectionHeights` map into `ComparatorPage` state. Each `StatProgressionTable` reports its promotion/reclass section height via a callback. The page computes `max(heightA, heightB)` and passes it back to each table as a `minPromoSectionHeight` prop.

**Rationale:** The two tables are siblings rendered in a `.map()` loop. React context adds overhead for a two-consumer problem. Lifted state is the simplest mechanism that keeps the coordination visible and debuggable in the parent component.

**Alternatives rejected:**
- React Context: Overkill for exactly two consumers in the same render. Adds a provider component for no architectural benefit.
- CSS-only solutions (`align-items: start` on grid, CSS subgrid): Cannot coordinate content across separate grid cells. Subgrid requires restructuring card internals into explicit grid rows, violating the non-goal.

### Decision 2: Measurement — `ResizeObserver` via `useRef` + `useEffect`

**Choice:** Each `StatProgressionTable` attaches a `ResizeObserver` to the promotion/reclass section's DOM node (the `<div>` at line 309). On each resize callback, it reports `entry.contentBoxSize[0].blockSize` (or `entry.contentRect.height` as fallback) to the parent via the `onPromoHeightChange` callback.

**Rationale:** `ResizeObserver` is native, performant, and fires on initial render + any subsequent size changes (adding/removing class-change events, window resize affecting wrapping). It avoids manual `getBoundingClientRect` polling.

**Alternatives rejected:**
- `useLayoutEffect` + `getBoundingClientRect`: Only fires once per render, misses mid-render size changes and doesn't observe subsequent DOM mutations.
- Fixed `min-height` values: Fragile and wasteful.

### Decision 3: Alignment enforcement — `min-height` on the promotion/reclass section

**Choice:** The promotion/reclass section div (line 309) receives `style={{ minHeight: minPromoSectionHeight != null ? minPromoSectionHeight : undefined }}`. When two units are selected, both sections get `min-height: max(heightA, heightB)`, pushing their data tables to the same Y offset. When one unit or none, the prop is `undefined` and no override is applied.

**Rationale:** `min-height` is the minimal CSS intervention — it doesn't change the section's content or layout, only pads the shorter one. The taller section is unaffected. No overlap, no positioning hacks.

**Alternatives rejected:**
- Spacer div below the section: Requires measuring after render and inserting a new element — equivalent complexity with more DOM churn.
- Absolute positioning of the promotion section: Creates overlap issues with the table below; breaks the existing collapsible behavior.

### Decision 4: Cleanup — disconnect `ResizeObserver` on unmount

**Choice:** The `useEffect` that creates the `ResizeObserver` returns a cleanup function that calls `observer.disconnect()`. This prevents leaks when units are swapped or removed.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| ResizeObserver callback fires frequently during rapid add/remove of class-change events, causing layout thrash | The `min-height` change is a single CSS property update — no reflow cascade. Browsers batch style recalculations within a single frame. No debounce needed. |
| One-frame flash where heights are not yet synchronized (initial render) | Acceptable: the observer fires synchronously in the same paint frame for initial render in most browsers. If a flash occurs, it is a single frame and identical to the current desync behavior. |
| `ResizeObserver` loop error in edge cases (observation triggers another resize) | `min-height` does not change the observed element's content — it expands the element but doesn't reflow its children. No infinite loop risk. |
| Mobile layout is unaffected but the `min-height` prop is still passed | The prop is passed regardless, but on single-column layout both cards are stacked vertically and the visual alignment is irrelevant. No negative side effect since `min-height` only pads, never shrinks. |
