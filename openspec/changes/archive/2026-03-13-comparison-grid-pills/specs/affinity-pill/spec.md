## ADDED Requirements

### Requirement: Render Affinity Pill
The system SHALL provide a reusable UI component to display a unit's affinity.

#### Scenario: Displaying affinity with text and icon
- **WHEN** the affinity pill component is rendered with a valid affinity
- **THEN** it displays the corresponding affinity icon and name within a pill-shaped container

### Requirement: Interactive Affinity Information
The affinity pill SHALL be interactive, providing more details about the affinity when the user interacts with it.

#### Scenario: Viewing affinity details
- **WHEN** a user hovers over or clicks the affinity pill
- **THEN** a tooltip or popover appears, detailing the stat bonuses granted by that affinity
