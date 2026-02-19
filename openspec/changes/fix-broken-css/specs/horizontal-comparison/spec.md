## ADDED Requirements

### Requirement: Horizontal Unit Details Layout
The system SHALL display unit details (join chapter, supports) side-by-side horizontally so that compared units align vertically.

#### Scenario: Comparing two units
- **WHEN** two units are selected for comparison
- **THEN** their details (like join chapter and supports) appear side-by-side at the same vertical position on the page

### Requirement: Stats Displayed as Tabular Format
The system SHALL format unit stats (growths, bases) as horizontal tables for easier parsing.

#### Scenario: Viewing unit growths
- **WHEN** viewing the unit growths section
- **THEN** the growths are displayed in a clean horizontal table format

### Requirement: Combined Average Stats Table
The system SHALL combine the average stats for compared units into a single table across all levels. The table SHALL start at the lowest base level among the compared units. If a unit's base level is higher than the table's starting level, its stats for the earlier levels SHALL be displayed as "-".

#### Scenario: Comparing units with different base levels
- **WHEN** comparing a level 5 unit and a level 10 unit
- **THEN** a combined average stats table is displayed starting at level 5
- **AND** the level 10 unit's stats from level 5 to 9 are displayed as "-"
