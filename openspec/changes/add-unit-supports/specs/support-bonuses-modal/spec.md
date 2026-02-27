## ADDED Requirements

### Requirement: Support Bonuses Modal Display
The system SHALL display a modal detailing the specific stat bonuses provided by a support relationship between two units.

#### Scenario: Opening the support bonuses modal
- **WHEN** the user clicks on a support partner pill in the Unit Details table
- **THEN** a modal opens.
- **AND** the modal displays the specific bonuses (e.g., Attack, Defense, Hit, Avoid, Crit, Dodge) gained at each support level (C, B, A, S).

### Requirement: Accurate Support Calculations
The system SHALL accurately calculate the displayed support bonuses based on the specific game's mechanics and the affinities or specific paired bonuses of the units involved.

#### Scenario: Calculating bonuses for a specific pair
- **WHEN** the support bonuses modal is populated
- **THEN** the required math (combining affinities and multiplying by support level) is accurately performed using `lib/affinities.ts` or equivalent logic.
