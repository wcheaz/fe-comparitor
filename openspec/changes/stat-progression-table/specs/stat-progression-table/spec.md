## ADDED Requirements

### Requirement: Stat Progression Table Exists
The system SHALL provide a table visualizing stat progression across levels for the compared units.

#### Scenario: User navigates to comparator with units selected
- **WHEN** the user has selected at least one unit in the comparator
- **THEN** a Stat Progression Table is rendered showing each stat as a column and increasing levels as rows.

### Requirement: Table Range and Base Level Padding
The table SHALL span from the lowest base level of the selected units up to level 40 by default, padding higher-level units with `-`.

#### Scenario: Units with mismatched base levels
- **WHEN** Unit A has base level 1 and Unit B has base level 5
- **THEN** the table begins at level 1, and rows 1-4 display `-` for Unit B's stats.
- **THEN** at level 5, Unit B's stats begin to display.

### Requirement: Table Range Expansion
The table SHALL provide a toggle to expand the displayed levels up to level 100.

#### Scenario: User wants to see extended levels
- **WHEN** the user clicks the "Expand to Level 100" toggle
- **THEN** the table generates and displays rows up to effective level 100.

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions by resetting the displayed level counter to 1 while maintaining internal cumulative progression.

#### Scenario: Unit crosses level 20 unpromoted
- **WHEN** a row is generated for a standard unit passing unpromoted level 20
- **THEN** the row label indicates "Level 1 (Promoted)" instead of "Level 21".

#### Scenario: Pre-promoted units
- **WHEN** a pre-promoted unit (e.g., Marcus) is displayed in the table
- **THEN** their starting level is correctly offset (e.g., base level 1 promoted is treated as effective level 21 for calculation but labeled as Level 1 Promoted).
