## ADDED Requirements

### Requirement: Render Movement Type Pill
The system SHALL provide a reusable UI component to display a unit's or class's movement type.

#### Scenario: Displaying movement type
- **WHEN** the movement type pill component is rendered with a valid movement type
- **THEN** it displays the corresponding movement type icon and name within a formatted pill container

### Requirement: Interactive Movement Type Information
The movement type pill SHALL provide additional information upon user interaction.

#### Scenario: Viewing movement type details
- **WHEN** a user hovers over or clicks the movement type pill
- **THEN** a tooltip or modal appears, describing the movement type and its terrain interactions/costs
