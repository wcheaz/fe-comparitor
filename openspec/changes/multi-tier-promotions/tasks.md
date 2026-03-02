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

## 5. Bug Fix: Trainee Forced Promotions
- [ ] 5.1 In `StatProgressionTable.tsx`, define a constant list or helper function (e.g., `isTraineeClass`) to identify FE8 trainee class IDs (`recruit`, `recruit_2`, `pupil`, `pupil_2`, `journeyman`, `journeyman_2`).
- [ ] 5.2 Within the `.map()` for `promotionEvents` (around line 323), resolve the `currentTierClass` for the dropdown row. For tier 1 (`eventIndex === 0`), this is the unit's base class. For tier 2+, it's the class from `promotionEvents[unit.id][eventIndex - 1].selectedClassId`.
- [ ] 5.3 Implement conditional logic for the level `<select>` (around line 346): if `isTraineeClass(currentTierClass)`, only render an `<option value={10}>10</option>`. Otherwise, render the standard 10-20 mapped array.
- [ ] 5.4 When adding new promotion tiers to trainees via the `onPromotionEventsChange` handlers, default the new event's `level` property to `10` instead of `20` if the prior class is a trainee class.

## 6. Bug Fix: Unclickable Plus Button
- [ ] 6.1 In `StatProgressionTable.tsx` (around line 390 in the `+` button `onClick` handler), handle the edge case where `promotionEvents[unit.id]` is `undefined` (which occurs before the user has manually changed a dropdown option).
- [ ] 6.2 When undefined, dynamically construct the fallback state of `[ { level: 20, selectedClassId: <firstBaseClassPromotion> } ]` to ensure `currentEvents` is populated.
- [ ] 6.3 Use the last element of this fallback array to identify the `lastSelectedClass`, so the logic correctly evaluates `lastSelectedClass.promotesTo` to permit appending a new tier.

## 7. Bug Fix: Extraneous +/- Buttons
- [ ] 7.1 In `StatProgressionTable.tsx` (around line 384), remove the static `canPromote` boolean that solely checks the unit's base class to determine if the `+` and `-` buttons should render.
- [ ] 7.2 Implement a dynamic check to identify the actual final class in the active promotion sequence (from either the `promotionEvents[unit.id]` array or the base class if no events exist).
- [ ] 7.3 Only render or enable the `+` `<button>` if this currently active *final tier class* has a valid `promotesTo` array with length > 0.
- [ ] 7.4 Maintain the logic that disables the `-` `<button>` if the unit lacks the capability to promote at all, or if `promotionEvents[unit.id]` has a length of 1 or 0.

## 8. Bug Fix: Dynamic Promotion Options per Tier
- [ ] 8.1 In `StatProgressionTable.tsx` (inside the `promotionEvents` `.map()` block around line 323), calculate the starting class for *each specific tier iteration* (`eventIndex`).
- [ ] 8.2 For `eventIndex === 0`, derive the `classOptions` from the unit's base class. For `eventIndex > 0`, derive the `classOptions` using the `selectedClassId` from the *previous* tier's event (`promotionEvents[unit.id][eventIndex - 1]`).
- [ ] 8.3 Calculate `tierPromotionOptions` and `tierHasBranchingOptions` locally within this map loop using the correct tier class, passing it into the `getPromotionOptions` and `hasBranchingPromotions` helper functions.
- [ ] 8.4 Render the class selection `<select>` dropdown using these locally scoped `tierPromotionOptions`, ensuring that Tier 2+ correctly displays branching choices (like Paladin/General for Tier 1 Cavalier/Knight completions) rather than incorrectly displaying Tier 1 options again.
