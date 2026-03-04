## 1. UI State & Rendering (`StatProgressionTable.tsx`)

- [x] 1.1 Fix the `getFinalTierClass` utility inside the unit mapping loop to correctly identify the latest selected class even for trainee units that have already undergone a promotion.
- [x] 1.2 Verify that `canAddPromotionTier` properly evaluates to `true` when the current final tier class has valid entries in its `promotesTo` array.

## 2. Stat Progression Algorithm (`lib/stats.ts`)

- [x] 2.1 Modify `generateProgressionArray` in the Tier 0 block to ensure `isPromotionLevel` correctly flags the forced promotion level (Level 10).
- [x] 2.2 Fix the Tier 1 calculation logic for Trainees so that the internal level delta correctly bases itself off the stats acquired at Level 10 (Tier 0) plus the class promotion bonuses, preventing math resets or duplicated rows.
- [x] 2.3 Ensure Trainee units properly transition to Tier 2 calculations without skipping or overlapping levels.

## 3. Secondary Bugfixes (Post-Attempt Evaluation)

- [x] 3.1 Diagnose Tier 1 calculation bug: Stats are computed as if gaining levels 11-20 as trainee instead of 1-20 base class. Evaluate `baseStatForCalc` and `levelDiff` used when `tier === 1` and `promotionEvents` only has 1 event.
- [x] 3.2 Diagnose Tier 2 presence: Ensure tier 2 levels are skipped in `generateProgressionArray` until the user explicitly adds a second promotion event.
- [x] 3.3 Diagnose "-" button removal block: Investigate `onRemovePromotionEvent` and the `disabled` logic in `StatProgressionTable.tsx` preventing users from deleting a newly added promotion layer.
- [x] 3.4 Implement fix for Tier 1 stat calculations (`lib/stats.ts`).
- [x] 3.5 Implement fix for unexpected Tier 2 levels (`lib/stats.ts`).
- [x] 3.6 Implement fix for "-" button disable logic (`StatProgressionTable.tsx`).
