## ADDED Requirements

### Requirement: Class Growths and Stat Modifiers tracking
The `Class` model SHALL include optional `growths` and `statModifiers` objects to represent class-specific growth rates and base stat modifiers.

#### Scenario: Awakening class loaded
- **WHEN** an Awakening class is loaded
- **THEN** it SHALL possess `growths` and `statModifiers` separate from its `baseStats`

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
