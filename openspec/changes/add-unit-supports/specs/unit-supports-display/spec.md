## ADDED Requirements

### Requirement: Unit Support Partners List
The system SHALL display a list of all potential support partners for a given unit when that unit is selected in the comparator.

#### Scenario: Viewing a unit's details
- **WHEN** a unit is displayed in the Unit Details table
- **THEN** a new row labeled "Supports" is visible.
- **AND** this row contains a visual element (like a pill) for each character the unit can build a support with.

### Requirement: Interactive Support Elements
The system SHALL make the supporting unit elements interactive to allow users to view detailed information about the support relationship.

#### Scenario: Clicking on a support partner
- **WHEN** the user clicks on a supporting unit's pill
- **THEN** the system registers the interaction and triggers the display of the support bonuses modal.
