## ADDED Requirements

### Requirement: Promoted Status Display
The system SHALL visually distinguish between base classes and promoted classes when displaying a unit's level.

#### Scenario: Unit is promoted
- **WHEN** a unit is flagged as being in a promoted class (`isPromoted: true` in data)
- **THEN** their level display under "Unit Details" SHALL include an indicator that they are promoted (e.g., appended text or an icon).

#### Scenario: Unit is in base class
- **WHEN** a unit is not flagged as promoted (missing or `isPromoted: false`)
- **THEN** their level display SHALL NOT include the promoted indicator.
