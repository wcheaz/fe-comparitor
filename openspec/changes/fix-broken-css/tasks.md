## 1. Global CSS Fixes

- [x] 1.1 Review `app/globals.css` and fix `text-*` and `bg-*` classes to ensure readability across the `fe-blue` and `fe-gold` theme. Make sure `--foreground` contrasts well with `--background`.
- [x] 1.2 Modify `Card` component's default text coloring inside `app/globals.css` or the related tailwind classes to fix unreadable contrast issues in `UnitCard` and `StatTable`.
- [x] 1.3 Update the standard table header and row CSS inside `globals.css` (e.g., `thead`, `tr`, `th`, `td`) to improve the contrast and visibility of tabular data.

## 2. Refactoring the Page Layout (Horizontal View)

- [x] 2.1 Refactor `app/comparator/page.tsx`'s layout container (`<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">`) and main content area to handle the new horizontal layout.
- [x] 2.2 Update `components/features/ComparisonGrid.tsx` to display specific statistics (like join chapter, growths, bases) aligned horizontally. 
- [x] 2.3 Move unit-specific details (like `JoinChapter`, `Class`, etc.) from individual vertical `UnitCard` components into horizontal side-by-side rows matching the `ComparisonGrid` style.
- [x] 2.4 Re-style `components/features/UnitCard.tsx` to just act as a headers for the units (Name, Portrait) rather than housing all details vertically.

## 3. Formatting Growths and Bases

- [x] 3.1 Refactor the `StatTable` component in `components/features/StatTable.tsx` to exclusively render base stats and growths. It should no longer handle the `averageStats` or `showAverage` prop.
- [x] 3.2 Ensure `StatTable.tsx` outputs a strictly horizontal table per unit or integrates into the main `ComparisonGrid` table loop to ensure perfect horizontal alignment.

## 4. Combined Average Stats Table

- [x] 4.1 In `lib/stats.ts` (or equivalent utility), create a new helper function `calculateAverageStatsAtLevel(unit, level)` if it doesn't already exist, and calculate the maximum potential level across all compared units.
- [x] 4.2 In `components/features/ComparisonGrid.tsx`, determine the lowest base level (`unit.level`) among all selected units (`Math.min(...units.map(u => u.level))`).
- [x] 4.3 Create a new component `<CombinedAverageStatsTable units={units} maxLevel={maxLevel} />`.
- [x] 4.4 In `<CombinedAverageStatsTable>`, render a table row for *every level* from the lowest base level up to the `maxLevel` (typically 20 or 40).
- [x] 4.5 In the rendering loop for each level row, check if `rowLevel < unit.level`. If true, render `-` for that unit's stats in that row.
- [x] 4.6 If `rowLevel >= unit.level`, use `calculateAverageStats(unit, rowLevel)` to populate that unit's cell for that specific level.
- [x] 4.7 Integrate the `<CombinedAverageStatsTable>` at the bottom of the `<ComparisonGrid>`, completely replacing the existing target level average display mechanism and the `LevelSlider.tsx` control.

## 5. CSS Misalignment Diagnosis & Layout Fixes

- [ ] 5.1 **Analyze Current Implementation**: In `ComparisonGrid.tsx` and `app/units/[id]/page.tsx`, the layout relies on a `<div className="space-y-6">` wrapper to stack major unit detail sections (Basic Information, Base Stats, Growth Rates, etc.) vertically. While the data inside the tables correctly compares units horizontally, the parent structural containers are stacked block-level elements, creating a single "long list".
- [ ] 5.2 **Diagnose Why It's Not Working**: The CSS meant to output a "2 column grid" is missing at the container level. The `space-y-6` class inherently applies vertical block flow. The tables themselves rely on `overflow-x-auto` which requires specific handling in grid systems. The user expects the *stat tables themselves* (Base Stats vs Growth Rates) or the *unit details cards* to sit perfectly adjacent to each other on wider screens.
- [ ] 5.3 **Steps to Fix the CSS Styling**:
  - Open `ComparisonGrid.tsx` and wrap the "Base Stats" and "Growth Rates" `<Card>` components in a `<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">` container, allowing them to flow into a two-column layout.
  - In `app/units/[id]/page.tsx`, move the "Base Stats" and "Growth Rates" Cards into a side-by-side grid wrapper (`<div className="grid grid-cols-1 md:grid-cols-2 gap-6">`).
  - Apply `min-w-0` to the grid items or adjust the layout logic so the `overflow-x-auto` table containers can trigger horizontal scrolling without blowing out the grid's bounding boxes.
