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

## ADDED Requirements

### Requirement: Unit Reclassing Event Support
The system SHALL allow users to add "reclass" progression events for units from supported games, effectively returning the unit's level to 1 while retaining accumulated stats.

#### Scenario: Unit reclasses into the same tier
- **WHEN** a unit adds a horizontal reclass event to their progression path
- **THEN** their internal level resets to 1.
- **AND** their accumulated stats carry over to the new class base calculating modifiers.
- **AND** the table rows continue generating from level 1.

#### Scenario: Unit reclasses into a higher tier
- **WHEN** an unpromoted unit reaches level 10 or higher and adds a vertical reclass event (e.g., Master Seal)
- **THEN** their internal level resets to 1, changing their tier to Promoted.
- **AND** the table rows continue generating from level 1.

#### Scenario: Enforcing minimum level for reclassing
- **WHEN** a user attempts to reclass an unpromoted unit before level 10
- **THEN** the system SHALL reject the event or display an invalid state, as Awakening unpromoted units must reach level 10 to reclass.
