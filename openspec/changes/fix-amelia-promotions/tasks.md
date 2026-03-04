## 1. UI State & Rendering (`StatProgressionTable.tsx`)

- [ ] 1.1 Fix the `getFinalTierClass` utility inside the unit mapping loop to correctly identify the latest selected class even for trainee units that have already undergone a promotion.
- [ ] 1.2 Verify that `canAddPromotionTier` properly evaluates to `true` when the current final tier class has valid entries in its `promotesTo` array.

## 2. Stat Progression Algorithm (`lib/stats.ts`)

- [ ] 2.1 Modify `generateProgressionArray` in the Tier 0 block to ensure `isPromotionLevel` correctly flags the forced promotion level (Level 10).
- [ ] 2.2 Fix the Tier 1 calculation logic for Trainees so that the internal level delta correctly bases itself off the stats acquired at Level 10 (Tier 0) plus the class promotion bonuses, preventing math resets or duplicated rows.
- [ ] 2.3 Ensure Trainee units properly transition to Tier 2 calculations without skipping or overlapping levels.
