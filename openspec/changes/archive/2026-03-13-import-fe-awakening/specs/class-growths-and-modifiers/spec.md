## ADDED Requirements

### Requirement: Class Growths and Stat Modifiers tracking
The `Class` model SHALL include optional `growths` and `statModifiers` objects to represent class-specific growth rates and base stat modifiers.

#### Scenario: Awakening class loaded
- **WHEN** an Awakening class is loaded
- **THEN** it SHALL possess `growths` and `statModifiers` separate from its `baseStats`

### Requirement: Combined Stat calculation for Awakening
When calculating average stats for an Awakening unit, the system SHALL sum the unit's personal bases with the class's `statModifiers`, and the unit's personal growths with the class's `growths`.

#### Scenario: Calculating Awakening unit stats
- **WHEN** generating the stat progression array for an Awakening unit
- **THEN** the starting stats at level 1 SHALL equal `unit.stats` + `currentClass.statModifiers`
- **AND** the growth rates used for level-ups SHALL equal `unit.growths` + `currentClass.growths`
