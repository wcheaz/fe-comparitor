## 1. Utility helpers

- [x] 1.1 Create inline logic or a helper function to determine the highest numeric value among a set of stat values for a given row.

## 2. Base and Growth Stats UI Updates

- [x] 2.1 In `ComparisonGrid.tsx`, update the Base Stats table's `<td>` cells to apply a highlight class (e.g., `bg-green-500/20`) if the unit's stat is the highest in that row.
- [x] 2.2 Replicate this highlight logic for the Growth Rates table in `ComparisonGrid.tsx`.

## 3. Equal Stats UI Updates

- [x] 3.1 In `ComparisonGrid.tsx`, update the Base Stats table's `<td>` cells to apply a neutral highlight class (e.g., `bg-yellow-500/20` or `bg-slate-500/20`) if the units' stats are identical and non-zero.
- [x] 3.2 Replicate this neutral highlight logic for the Growth Rates table in `ComparisonGrid.tsx` for identical stats.

## 4. Filter Empty Stats

- [x] 4.1 Update the `getCommonStats` helper function in `ComparisonGrid.tsx` to handle base stats: filter out a stat key from the visible list if *both* units have a missing (`undefined`/`null`) value for that base stat.
- [x] 4.2 Update the same helper (or create a new one specifically for growths) to filter out a stat key from the growths table if *both* units have a missing or `0` value for that growth rate (e.g., filtering out movement growths).

## 5. Remove Combined Average Stats Table

- [x] 5.1 In `ComparisonGrid.tsx`, remove the rendering of the `CombinedAverageStatsTable` component and the `showAverage` prop logic.
- [x] 5.2 Delete the `components/features/CombinedAverageStatsTable.tsx` file entirely.

## 6. Promoted Status Distinctions

- [x] 6.1 Update the `Unit` interface in `types/unit.ts` to include an optional boolean field `isPromoted?: boolean;`.
- [x] 6.2 Audit data files (`binding_blade_units.json`, `engage_units.json`, `three_houses_units.json`) and add `"isPromoted": true` to units that start in a promoted class (e.g., Marcus).
- [x] 6.3 In `ComparisonGrid.tsx`, under the "Unit Details" table, update the Level row to conditionally append `(Promoted)` if `unit.isPromoted` is true.

## 7. Bug Fixes for Empty Growths and Promoted Status

- [x] 7.1 **Growth Rates Table Fix:** In `ComparisonGrid.tsx` (around line 205), change `{getCommonBaseStats(units).map((statKey) => {` to use `{getCommonGrowthStats(units).map((statKey) => {` for the Growth Rates table rendering. This will fix stats with 0% growths (like Move and Con) showing up.
- [x] 7.2 **Promoted Status Fix:** Investigate and fix why `isPromoted` is not displaying. Check if `isPromoted` was successfully added to `types/unit.ts`, and ensure that data fetching functions (like in `lib/data.ts`) or normalization logic are properly passing the `isPromoted` flag from the JSON to the frontend components.
