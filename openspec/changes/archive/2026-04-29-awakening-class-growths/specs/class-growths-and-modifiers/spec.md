## MODIFIED Requirements

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
