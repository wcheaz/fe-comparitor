## MODIFIED Requirements

### Requirement: User Selects Promotion Path
The system SHALL provide a dedicated, extracted UI mechanism allowing the user to select a specific promotion path when a unit has multiple valid promotion options defined in the game data.

#### Scenario: Unit with branching promotions
- **WHEN** the user selects a unit with branching promotions (e.g. from Sacred Stones or Awakening)
- **THEN** an independent UI outside the standard comparison grid allows the user to individually select which class each promotion tier resolves to.

### Requirement: Multi-Tier Promotion Support
The system SHALL support and track sequential promotion events for units that can promote multiple times or reclass linearly within a dedicated section.

#### Scenario: Unit promotes through multiple tiers
- **WHEN** a unit promotes from a base class to an advanced class, and then to a third-tier class
- **THEN** the system tracks the selected class for each level threshold and applies the appropriate sequence of class bases and promotion bonuses.

#### Scenario: System provides UI to append multi-tier promotions
- **WHEN** the user is viewing the dedicated "Promotion Planner" section for a unit
- **AND** the currently selected class for their latest promotion event has valid entries in its `promotesTo` array (including resolving the target class of trainee promotions)
- **THEN** the system renders a "+" button that, when clicked, adds a new sequential promotion event to the unit's timeline.

#### Scenario: System provides UI to remove multi-tier promotions
- **WHEN** a unit has more than one promotion event configured
- **THEN** the system renders a "-" button next to the "+" button in the dedicated promotion planner that, when clicked, removes the most recently added promotion event from the unit's timeline.
