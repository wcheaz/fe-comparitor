## 1. Data Schema Updates
- [x] 1.1 Update the `Unit` interface in `types/unit.ts` (around line 44) to include `maxLevel?: number | "infinite"`.
- [x] 1.2 Update the documentation in `hidden/FORMATTING.md` to detail the new `maxLevel` property within the Unit Schema configuration.

## 2. Stat Generation Logic
- [x] 2.1 Refactor `generateProgressionArray` in `lib/stats.ts` (specifically the loop bounds starting passing line 288) to support negative offset numerical levels for Trainees.
- [x] 2.2 Update `generateProgressionArray` in `lib/stats.ts` to respect `unit.maxLevel`, halting stat accumulation or emitting `isSkipped = true` for row bounds that exceed the arbitrary cap.
- [x] 2.3 Refactor the internal `tier` tracking and level capping inside `generateProgressionArray` (lines 288-340) to account for infinite continuous leveling loops if `maxLevel === "infinite"`.
- [x] 2.4 Update the promotion tier evaluation logic in `generateProgressionArray` (lines 234-286 and 300-340) to iterate sequentially through the full `promotionEvents` array for multi-tier promotion stat stacking, rather than exclusively processing index 0.

## 3. Stat Progression Table UI
- [x] 3.1 In `components/features/StatProgressionTable.tsx` (around lines 87-88), replace the hardcoded `const minLevel = 1;` and `const maxLevel = 40;` to dynamically compute boundaries by querying the minimum base level and maximum `maxLevel` values inside the `units` array.
- [x] 3.2 Update the `for (let i = 0; i < totalLevels; i++)` loop in `StatProgressionTable.tsx` (line 124) to properly map rows when traversing from negative trainee bounds upwards.
- [x] 3.3 Ensure the table cell output logic inside `StatProgressionTable.tsx` (lines 452+ inside tbody) outputs `-` for units whose level exceeds their calculated `maxLevel` bound.

## 4. Multi-Tier Promotion UI
- [x] 4.1 In `app/comparator/page.tsx` (line 14), ensure the `promotionEvents` state handler can smoothly process array push/pop operations passed from child components.
- [x] 4.2 In `components/features/StatProgressionTable.tsx` (lines 297-354), modify the UI rendering of the `<select>` level and class inputs to dynamically `.map()` across the `promotionEvents[unit.id]` array instead of hardcoding to index `[0]`.
- [x] 4.3 Implement a `+` `<button>` in `StatProgressionTable.tsx` (within the promotion section mapping) that triggers `onPromotionEventsChange` to append a new sequential `PromotionEvent` if the current final selected class natively supports further `promotesTo` branching.
- [x] 4.4 Implement a `-` `<button>` in `StatProgressionTable.tsx` (within the same promotion mapping block) that triggers `onPromotionEventsChange` to pop the trailing promotion event from `promotionEvents[unit.id]`, disabling the button if the array length is 1 or less.
