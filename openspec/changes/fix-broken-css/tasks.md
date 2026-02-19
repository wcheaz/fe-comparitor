## 1. Global CSS Fixes

- [x] 1.1 Review `app/globals.css` and fix `text-*` and `bg-*` classes to ensure readability across the `fe-blue` and `fe-gold` theme. Make sure `--foreground` contrasts well with `--background`.
- [x] 1.2 Modify `Card` component's default text coloring inside `app/globals.css` or the related tailwind classes to fix unreadable contrast issues in `UnitCard` and `StatTable`.
- [x] 1.3 Update the standard table header and row CSS inside `globals.css` (e.g., `thead`, `tr`, `th`, `td`) to improve the contrast and visibility of tabular data.

## 2. Refactoring the Page Layout (Horizontal View)

- [x] 2.1 Refactor `app/comparator/page.tsx`'s layout container (`<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">`) and main content area to handle the new horizontal layout.
- [ ] 2.2 Update `components/features/ComparisonGrid.tsx` to display specific statistics (like join chapter, growths, bases) aligned horizontally. 
- [ ] 2.3 Move unit-specific details (like `JoinChapter`, `Class`, etc.) from individual vertical `UnitCard` components into horizontal side-by-side rows matching the `ComparisonGrid` style.
- [ ] 2.4 Re-style `components/features/UnitCard.tsx` to just act as a headers for the units (Name, Portrait) rather than housing all details vertically.

## 3. Formatting Growths and Bases

- [ ] 3.1 Refactor the `StatTable` component in `components/features/StatTable.tsx` to exclusively render base stats and growths. It should no longer handle the `averageStats` or `showAverage` prop.
- [ ] 3.2 Ensure `StatTable.tsx` outputs a strictly horizontal table per unit or integrates into the main `ComparisonGrid` table loop to ensure perfect horizontal alignment.

## 4. Combined Average Stats Table

- [ ] 4.1 In `lib/stats.ts` (or equivalent utility), create a new helper function `calculateAverageStatsAtLevel(unit, level)` if it doesn't already exist, and calculate the maximum potential level across all compared units.
- [ ] 4.2 In `components/features/ComparisonGrid.tsx`, determine the lowest base level (`unit.level`) among all selected units (`Math.min(...units.map(u => u.level))`).
- [ ] 4.3 Create a new component `<CombinedAverageStatsTable units={units} maxLevel={maxLevel} />`.
- [ ] 4.4 In `<CombinedAverageStatsTable>`, render a table row for *every level* from the lowest base level up to the `maxLevel` (typically 20 or 40).
- [ ] 4.5 In the rendering loop for each level row, check if `rowLevel < unit.level`. If true, render `-` for that unit's stats in that row.
- [ ] 4.6 If `rowLevel >= unit.level`, use `calculateAverageStats(unit, rowLevel)` to populate that unit's cell for that specific level.
- [ ] 4.7 Integrate the `<CombinedAverageStatsTable>` at the bottom of the `<ComparisonGrid>`, completely replacing the existing target level average display mechanism and the `LevelSlider.tsx` control.
