## ADDED Requirements

### Requirement: Class Growths and Stat Modifiers tracking
The `Class` model SHALL include optional `growths` and `statModifiers` objects to represent class-specific growth rates and base stat modifiers. For Awakening classes, the `growths` object SHALL contain non-zero class-only growth rates sourced from Serenes Forest for all playable and special classes, not placeholder zero values.

#### Scenario: Awakening class loaded
- **WHEN** an Awakening class is loaded
- **THEN** it SHALL possess `growths` and `statModifiers` separate from its `baseStats`
- **AND** for the 17 classes previously set to all-zero growths, `growths` SHALL contain the correct Serenes Forest class growth rates (non-zero for at least `hp`, one physical stat, and `def` or `res`)

#### Scenario: Awakening class with previously-zero growths now contributes to stat progression
- **WHEN** a unit in a previously-zero-growth class (e.g., Archer, Thief, Mage) is displayed in the stat progression table
- **THEN** the effective growth rate SHALL equal `unit.growths[stat] + class.growths[stat]`
- **AND** `class.growths[stat]` SHALL be greater than 0 for at least `hp`

### Requirement: Combined Stat calculation for Awakening
When calculating average stats for an Awakening unit, the system SHALL sum the unit's personal bases with the class's `baseStats` (not `statModifiers`) to form the displayed base, and the unit's personal growths with the class's `growths` to form the effective growth rate. Stat modifiers from `class.statModifiers` are a separate additive layer applied on top of capped computed stats for display only.

#### Scenario: Calculating Awakening unit stats
- **WHEN** generating the stat progression array for an Awakening unit at their base level
- **THEN** the starting uncapped internal stats SHALL equal `unit.stats[stat] + class.baseStats[stat]`
- **AND** the growth rates used for level-ups SHALL equal `unit.growths[stat] + class.growths[stat]`
- **AND** the displayed stats SHALL be computed as `min(uncapped_internal_stat, class.maxStats[stat]) + class.statModifiers[stat]`

#### Scenario: Awakening class stat modifiers are display-only
- **WHEN** an Awakening unit's class has non-zero `statModifiers`
- **THEN** the modifiers SHALL be added to the capped stat for display purposes only
- **AND** the modifiers SHALL NOT be included in the uncapped internal stat accumulator
- **AND** the modifiers SHALL NOT affect growth accumulation
