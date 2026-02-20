## 1. Utility helpers

- [x] 1.1 Create inline logic or a helper function to determine the highest numeric value among a set of stat values for a given row.

## 2. Base and Growth Stats UI Updates

- [x] 2.1 In `ComparisonGrid.tsx`, update the Base Stats table's `<td>` cells to apply a highlight class (e.g., `bg-green-500/20`) if the unit's stat is the highest in that row.
- [x] 2.2 Replicate this highlight logic for the Growth Rates table in `ComparisonGrid.tsx`.

## 3. Equal Stats UI Updates

- [ ] 3.1 In `ComparisonGrid.tsx`, update the Base Stats table's `<td>` cells to apply a neutral highlight class (e.g., `bg-yellow-500/20` or `bg-slate-500/20`) if the units' stats are identical and non-zero.
- [ ] 3.2 Replicate this neutral highlight logic for the Growth Rates table in `ComparisonGrid.tsx` for identical stats.

## 4. Filter Empty Stats

- [ ] 4.1 Update the `getCommonStats` helper function in `ComparisonGrid.tsx` to handle base stats: filter out a stat key from the visible list if *both* units have a missing (`undefined`/`null`) value for that base stat.
- [ ] 4.2 Update the same helper (or create a new one specifically for growths) to filter out a stat key from the growths table if *both* units have a missing or `0` value for that growth rate (e.g., filtering out movement growths).

## 5. Remove Combined Average Stats Table

- [ ] 5.1 In `ComparisonGrid.tsx`, remove the rendering of the `CombinedAverageStatsTable` component and the `showAverage` prop logic.
- [ ] 5.2 Delete the `components/features/CombinedAverageStatsTable.tsx` file entirely.
