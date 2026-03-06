## ADDED Requirements

### Requirement: Awakening Unit and Class Data ingestion
The system SHALL support loading unit and class data specifically for Fire Emblem Awakening from the `data/awakening/` directory.

#### Scenario: Awakening unit is loaded
- **WHEN** a unit from FE Awakening is loaded via `lib/data.ts`
- **THEN** it SHALL contain its personal base stats and personal growths
- **AND** it SHALL have `game` equal to `"Awakening"`
