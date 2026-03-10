# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

Currently, the unit comparator only supports standard class promotions. However, many newer Fire Emblem games (like Awakening and Fates) feature robust reclassing systems where units can switch to entirely different class trees horizontally or vertically based on their level and current class tier. We need to implement this system to accurately model the progression of characters from these games.

## What Changes

- Add a generic mechanism to handle `reclassOptions` for units, similar to how promotions are handled.
- Implement tier-based requirement checks:
  - Can reclass to a Tier 1 class if the unit is currently in a Tier 2 class, or is in an Tier 1 class and at least level 10.
  - Can reclass to a Tier 2 class if the unit is currently in a Tier 2 class and at least level 10.
- Implement promotion restrictions for Tier 2 classes: a unit can only promote into a Tier 2 class if they are in a Tier 1 class that explicitly allows promoting into that specific Tier 2 class.
- Update `components/features/StatProgressionTable.tsx` to handle these dynamic options.
- Update `components/features/PromotionOptionsDisplay.tsx` to reflect both promotion and reclass options properly.

## Capabilities

### New Capabilities
- `unit-reclassing`: Supports adding reclass options that depend on the unit's current level, class tier, and past promotions/reclasses, allowing horizontal class movement.

### Modified Capabilities
- `stat-progression-table`: Integrating reclass options alongside standard promotions in the progression array.

## Impact

- `components/features/StatProgressionTable.tsx`
- `components/features/PromotionOptionsDisplay.tsx`
- Relevant types (`types/unit.ts`) and statistical generation logic (`lib/stats.ts`) that will need to apply the conditional rules for reclassing and promotion options.

## Specifications

stat-progression-table/spec.md
# Capability: Stat Progression Table (Modified)

## Overview
The `StatProgressionTable` and its underlying `generateProgressionArray` algorithm currently only handle linear and branching promotions. It needs to be modified to calculate, map, and display reclassing options and their resulting paths dynamically.

## Requirements
- The UI must render available "Reclass" options in the "Promotion Levels" configuration alongside or in place of "Promote" options when the unit hits the appropriate level threshold.
- The `generateProgressionArray` function in `lib/stats.ts` must accurately map class transitions, applying the new class's `statModifiers` to reset the unit's caps and factoring in the new class's `baseStats`.
- Reclassing drops the unit back to Level 1 of the selected class, but keeps their accumulated generic stats intact.
- The average stat differences between the old class's growths and the newly reclassed growths must smoothly propagate downwards for levels mapped *after* a Reclass Event.
- Prevent infinitely large stat tables by enforcing a cap on the number of stacked reclass events a user can click (or ensuring "maxLevel" continues to bound the table height effectively).

unit-reclassing/spec.md
# Capability: Unit Reclassing

## Overview
Reclassing allows units to horizontally and vertically change classes independently of the standard "level 10 -> promotion -> level 1" promotion system. Character progression in games like Awakening supports branching into entirely different class trees via items like the Second Seal.

## Requirements
- Introduce a mechanism to define `reclassOptions` for any given unit, similar to the existing `promotions` array.
- Units can reclass to Tier 1 classes under the following conditions:
  - If they are currently in a Tier 2 class (any level).
  - If they are currently in a Tier 1 class and are at least Level 10.
- Units can reclass to Tier 2 classes under the following conditions:
  - If they are currently in a Tier 2 class and are at least Level 10.
- Level resets to 1 upon reclassing, and accumulated stats/growths persist. Max stats are bound by the new class modifiers.

## Constraints
- The reclass logic must be flexible enough to allow characters from Awakening (or Fates in the future) to easily fetch their reclass sets without hardcoding individual classes inside the core logic components.
- Standard "promotion" rules must still apply correctly to games that do not support reclassing (like GBA Fire Emblem).
- Must prevent Infinite loops in the UI when offering reclassing paths.



## Design

# Design: Reclass System

## Architecture

To support the Awakening/Fates reclassing system, we need to extend the core progression logic in `lib/stats.ts` and the UI controls. 

1. **Data Structures**
    - The `Unit` interface in `types/unit.ts` already has a `reclassOptions?: string[]` array.
    - We will define a new `ReclassEvent` interface similar to `PromotionEvent`:
      ```ts
      export interface ReclassEvent {
        level: number;
        selectedClassId: string;
      }
      ```
    - The `Unit` interface will need a `reclassEvents?: ReclassEvent[]` array to track the user's selected reclass history in the UI.

2. **Progression Logic (`lib/stats.ts`)**
    - The `generateProgressionArray` function will need to accept `reclassEvents` alongside `promotionEvents`.
    - When a ReclassEvent occurs at a given level `L`:
      - The unit's internal level resets to 1. 
      - The `currentClass` changes to the `selectedClassId`.
      - The unit's accumulated stats up to level `L` are retained as the new baseline.
      - The unit's stat caps (`maxStats`) immediately change to the new class's caps.
      - The unit's `statModifiers` (for Awakening) swap to the new class's modifiers.

3. **UI Components**
    - `StatProgressionTable.tsx`: Update to watch for and render reclassing milestones similarly to how it handles promotion milestones. It will need new visual indicators that differentiate a "Reclass" (level resets to 1, usually) from a "Promotion".
    - `PromotionOptionsDisplay.tsx` (or a new `ReclassOptionsDisplay.tsx`): Update to provide dropdowns/buttons for the user to select valid reclass options at any given level > 10. Valid options depend on the unit's current tier and the rules defined in `specs/unit-reclassing/spec.md`.

## Implementation Approach

1. **Types**: Add `ReclassEvent` to `types/unit.ts` and add `reclassEvents?: ReclassEvent[]` to the `Unit` type (or manage it purely in UI state and pass it down).
2. **Logic Integration**: Refactor `generateProgressionArray` in `lib/stats.ts` to sequentially process all events (promotions AND reclasses) chronologically by level. Since reclassing resets the display level to 1, we must sort and process these events carefully.
3. **UI State**: In the parent component of the stat table (e.g. `ComparisonGrid`), add state for tracking reclass choices alongside promotion choices.
4. **Validation**: Ensure that a unit cannot reclass into a class they are already in or a class that violates the tier rules (no Tier 1 -> Tier 2 without passing level 10).

## Current Task Context

## Current Task
- 1.1 Update `types/unit.ts` `Unit` interface to add `reclassEvents?: ReclassEvent[]`.
