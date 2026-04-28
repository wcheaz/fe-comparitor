## MODIFIED Requirements

### Requirement: Awakening Unit and Class Data ingestion
The system SHALL support loading unit and class data specifically for Fire Emblem Awakening from the `data/awakening/` directory.

#### Scenario: Awakening unit is loaded
- **WHEN** a unit from FE Awakening is loaded via `lib/data.ts`
- **THEN** it SHALL contain its **personal** base stats (visible final bases minus class bases) and personal growths
- **AND** it SHALL have `game` equal to `"Awakening"`
- **AND** its `stats` values SHALL be personal bases such that `stats[stat] + class_base[stat]` equals the visible in-game base for the unit's starting class

#### Scenario: Awakening unit personal bases are verifiable
- **WHEN** a unit's personal base stats are compared against their visible in-game bases
- **THEN** every personal base value SHALL be less than or equal to the corresponding visible base
- **AND** the difference SHALL equal the class base for the unit's starting class
