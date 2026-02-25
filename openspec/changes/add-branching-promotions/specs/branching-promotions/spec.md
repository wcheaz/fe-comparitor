## ADDED Requirements

### Requirement: User Selects Promotion Path
The system SHALL provide a mechanism allowing the user to select a specific promotion path when a unit has multiple valid promotion options defined in the game data.

#### Scenario: Unit with branching promotions
- **WHEN** the user selects a unit with branching promotions (e.g. from Sacred Stones or Awakening)
- **THEN** an interface allows the user to individually select which class each promotion tier resolves to.

### Requirement: Default Promotion Path
The system SHALL automatically default the promotion path to the first available option in the unit's class data if the user has not explicitly made a selection.

#### Scenario: User does not select a promotion
- **WHEN** a unit with branching promotions is added to the comparator
- **AND** the user does not explicitly choose a promotion path
- **THEN** the application calculates stats and progression assuming the unit promotes into the first class listed in their base class's `promotesTo` array.

### Requirement: Multi-Tier Promotion Support
The system SHALL support and track sequential promotion events for units that can promote multiple times or reclass linearly.

#### Scenario: Unit promotes through multiple tiers
- **WHEN** a unit promotes from a base class to an advanced class, and then to a third-tier class
- **THEN** the system tracks the selected class for each level threshold and applies the appropriate sequence of class bases and promotion bonuses.

### Requirement: Stat Calculation Respects Promotion Path
The system SHALL calculate average unit stats (including caps and promotion bonuses) based explicitly on the user-selected promotion path.

#### Scenario: Stats calculated for a promoted level
- **WHEN** the application calculates a unit's stats at a level equal to or higher than their promotion level
- **THEN** the calculation applies the promotion bonuses, base stats, and stat caps of the specific class the user selected for that promotion.
