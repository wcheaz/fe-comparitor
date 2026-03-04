# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why
The UI and stat calculation logic for units with multi-tier branching promotions (like FE8 Trainees such as Amelia) is currently bugged. When adding another promotion for Amelia, the options to add/remove promotions disappear, and the automatic unpromoted-to-base class promotion is missing the visual "✨" indicator. Furthermore, the stat progression calculations for these units are incorrect, applying the wrong leveling offsets and skipping tiers which results in massive, incorrect stat jumps. Fixing this is necessary to ensure the comparator accurately reflects trainee growth paths.

## What Changes
- Fix the logic that hides the `+` and `-` buttons for adding/removing promotion tiers so it correctly recognizes when a trainee can promote further.
- Ensure the "✨" promotion icon correctly renders for forced trainee-to-base class promotions.
- Correct the `generateProgressionArray` math to properly apply trainee leveling offsets (from virtual Level 1 to 10) and transition cleanly into Tier 1 computations without duplicating levels or incorrectly assuming a level 20 class promotion.

## Capabilities

### New Capabilities
- `trainee-promotions`: Define the specific requirements for how trainee units bridge the gap between Tier 0 (Trainee), Tier 1 (Base), and Tier 2 (Promoted), including UI requirements and stat calculation constraints.

### Modified Capabilities
- `branching-promotions`: Update existing promotion handling requirements to properly support variable-level forced early promotions (e.g., locking to level 10 for trainees instead of 20).

## Impact
- `components/features/StatProgressionTable.tsx`: UI rendering logic for the `+`/`-` tier buttons and table row promotion indicators.
- `lib/stats.ts`: Mathematical algorithms in `generateProgressionArray` for calculating stat growths across non-standard tier boundaries.

## Specifications

branching-promotions/spec.md
## MODIFIED Requirements

### Requirement: Multi-Tier Promotion Support
The system SHALL support and track sequential promotion events for units that can promote multiple times or reclass linearly.

#### Scenario: Unit promotes through multiple tiers
- **WHEN** a unit promotes from a base class to an advanced class, and then to a third-tier class
- **THEN** the system tracks the selected class for each level threshold and applies the appropriate sequence of class bases and promotion bonuses.

#### Scenario: System provides UI to append multi-tier promotions
- **WHEN** the user is viewing the "Promotion Levels" section for a unit
- **AND** the currently selected class for their latest promotion event has valid entries in its `promotesTo` array (including resolving the target class of trainee promotions)
- **THEN** the system renders a "+" button that, when clicked, adds a new sequential promotion event to the unit's timeline.

#### Scenario: System provides UI to remove multi-tier promotions
- **WHEN** a unit has more than one promotion event configured
- **THEN** the system renders a "-" button next to the "+" button that, when clicked, removes the most recently added promotion event from the unit's timeline.

trainee-promotions/spec.md
## ADDED Requirements

### Requirement: Trainee Tier Promotion Offset
The system SHALL apply negative offset levels (virtual mapping) for Trainee units (e.g. FE8 Recruits) to ensure their stat progressions calculate pre-Tier 1 bases without inflating tier scales or duplicating rows.

#### Scenario: Trainee unit progression maps to Tier 0
- **WHEN** a trainee unit's progression is generated 
- **THEN** their internal level is virtually mapped between -9 and 0, rendering visually as `Level 1 (Trainee)` through `Level 10 (Trainee)`.

### Requirement: Trainee Promotion Level Cap
The system SHALL lock a Trainee's initial promotion dropdown explicitly to Level 10, preventing promotion selection at standard levels (10-20).

#### Scenario: User attempts to change Trainee promotion level
- **WHEN** a user views the promotion configuration for a Trainee unit's first tier
- **THEN** the promotion level dropdown is locked to `10`.

### Requirement: Visual Indicator for Trainee Promotion
The system SHALL render the `✨` promotion icon at the Trainee's forced promotion level threshold.

#### Scenario: Trainee transitions to Tier 1
- **WHEN** a Trainee unit hits Level 10 and promotes to a Base class
- **THEN** the stats table renders a `✨` icon next to the stat values for that row.



## Design

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

## Current Task Context

## Current Task
- - [ ] 1.1 Fix the `getFinalTierClass` utility inside the unit mapping loop to correctly identify the latest selected class even for trainee units that have already undergone a promotion.
