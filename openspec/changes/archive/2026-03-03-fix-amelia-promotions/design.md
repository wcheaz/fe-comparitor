## Context

The Fire Emblem Unit Comparator currently supports branching and multi-tier promotions via a user-defined `promotionEvents` array. However, FE8 "Trainee" units (like Amelia, Ross, Ewan) have a 3-tier promotion structure (Tier 0 -> Tier 1 -> Tier 2) that diverges from the standard unpromoted -> promoted sequence.

Currently, `StatProgressionTable.tsx` and `generateProgressionArray` in `lib/stats.ts` mishandle these unique conditions:
1. The UI incorrectly hides the `+` and `-` tier management buttons for Amelia after her first promotion is added.
2. The UI table fails to visually indicate the Tier 0 -> Tier 1 promotion with the `✨` icon.
3. The stat engine (`generateProgressionArray`) calculates incorrect internal leveling offsets for trainees, causing an overlapping stat anomaly where Tier 1 (Base classes) and Tier 2 (Promoted classes) generate identical or doubled row outputs and inaccurate level scaling.

## Goals / Non-Goals

**Goals:**
- Correct the button visibility logic in `StatProgressionTable.tsx` so users can add both Tier 1 and Tier 2 promotions for trainees.
- Ensure the visual `✨` icon is displayed for all trainee promotion levels.
- Fix the array index mapping in `generateProgressionArray` so that trainees correctly jump from Tier 0 (Level 10) to Tier 1 (Level 1) without duplicated math frames or massive incorrect level gaps.

**Non-Goals:**
- Adding additional trainee units outside the scope of what is already modeled.
- Overhauling the generic class system schema in `classes.json`.

## Decisions

1. **Button Visibility Logic Fix**
   - *Decision:* Refactor the specific `canAddPromotionTier` boolean check in `StatProgressionTable.tsx` to properly identify when the *most recently added* promotion class has its own `promotesTo` references. Currently, it seems to be failing on retrieving the correct `finalTierClass` for trainees.
   
2. **Icon Rendering (`✨`) Fix**
   - *Decision:* Ensure `isPromotionLevel` in `generateProgressionArray` accurately triggers to `true` at the end of Tier 0. We will adjust the logic inside `if (tier === 0)` so that when `displayLevelNum === promoLevels[0]` (usually 10 for trainees), it accurately flags that row.

3. **Leveling Index Math Restructure**
   - *Decision:* Fix the `generateProgressionArray` internal loop that governs Tier 1 for trainees. Currently, there is an issue where the math "skips to level 1 base class but assumes she's promoting at level 20". We will ensure that the transition math resets its delta correctly, computing `Tier 1, Level 1` base stats off of the exact stats achieved at `Tier 0, Level 10` plus the explicit class promotion bonuses.

## Risks / Trade-offs

- **Risk:** Altering `generateProgressionArray` might break standard 2-tier unit progressions (like FE7 characters).
  - *Mitigation:* We will isolate the changes inside the `if (isTrainee)` logical blocks as much as possible, leaving standard unit code paths untouched. We will also test the changes by viewing both a normal unit (e.g., Marcus or Roy) and a trainee (Amelia) simultaneously.
