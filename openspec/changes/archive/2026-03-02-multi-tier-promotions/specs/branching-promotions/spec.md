## MODIFIED Requirements

### Requirement: Multi-Tier Promotion Support
The system SHALL support and track sequential promotion events for units that can promote multiple times or reclass linearly.

#### Scenario: Unit promotes through multiple tiers
- **WHEN** a unit promotes from a base class to an advanced class, and then to a third-tier class
- **THEN** the system tracks the selected class for each level threshold and applies the appropriate sequence of class bases and promotion bonuses.

#### Scenario: System provides UI to append multi-tier promotions
- **WHEN** the user is viewing the "Promotion Levels" section for a unit
- **AND** the currently selected class for their latest promotion event has valid entries in its `promotesTo` array
- **THEN** the system renders a "+" button that, when clicked, adds a new sequential promotion event to the unit's timeline.

#### Scenario: System provides UI to remove multi-tier promotions
- **WHEN** a unit has more than one promotion event configured
- **THEN** the system renders a "-" button next to the "+" button that, when clicked, removes the most recently added promotion event from the unit's timeline.
