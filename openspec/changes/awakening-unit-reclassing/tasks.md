## 1. Update Core Progression Logic

- [x] 1.1 In `lib/stats.ts` (`generateProgressionArray`, lines 311-333), ensure `reclassEvents` are properly typed and accepted as an argument alongside `promotionEvents`.
- [x] 1.2 In `lib/stats.ts` (lines 356-379), verify the logic that combines and sorts all `promotionEvents` and `reclassEvents` chronologically by level into the `allEvents` array. 
- [x] 1.3 In `lib/stats.ts` (lines 500-592), refine the `reclassEventAtThisLevel` block. Ensure that when a reclass event fires, the unit's internal level resets to 1 (`displayLevelNum = 1`), and the `baseStatForCalc` accurately captures accumulated stats plus the new class's modifiers/caps.
- [x] 1.4 In `lib/stats.ts` (lines 799+), ensure the bounds checking (`isSkipped` and `maxLevel` logic) accounts for the new class's class tier caps (e.g. 20 or 30), preventing infinite UI loops unless the user explicitly added another event or the unit has `maxLevel === "infinite"`.

## 2. UI Updates for Reclassing

- [x] 2.1 In `components/features/PromotionOptionsDisplay.tsx` (lines 97-141), verify the `reclassOptions` memoized block correctly identifies valid reclass targets for the unit's current level and tier.
- [x] 2.2 In `components/features/PromotionOptionsDisplay.tsx` (lines 162-216), ensure the "Reclass Options Section" correctly dispatches the `onReclassEventsChange` callback when a user clicks "Reclass Here".
- [ ] 2.3 In `components/features/PromoOptionsDisplay.tsx` (lines 106-114), ensure the `getReclassInvalidReason` function strictly enforces Awakening's reclass rules (e.g., Unpromoted units must go to level 10+, special classes to level 30 to reset).
- [ ] 2.4 In `components/features/StatProgressionTable.tsx` (lines 402-622), within the "Per-Unit Promotion Configs" map, ensure the table gracefully handles rendering rows when multiple `reclassEvents` result in overlapping or continuous loops of `displayLevelNum` from 1 to 20/30.
