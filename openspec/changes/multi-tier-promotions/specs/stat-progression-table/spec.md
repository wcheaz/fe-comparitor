## MODIFIED Requirements

### Requirement: Table Range and Base Level Padding
The table SHALL span from the lowest base level or trainee offset of the selected units up to the highest calculated `maxLevel` across all selected units (or level 40 by default if no `maxLevel` caps are found), padding out-of-bounds units with `-`.

#### Scenario: Units with mismatched base levels
- **WHEN** Unit A has base level 1 and Unit B has base level 5
- **THEN** the table begins at level 1, and rows 1-4 display `-` for Unit B's stats.
- **THEN** at level 5, Unit B's stats begin to display.

#### Scenario: Unit with Trainee negative offset levels
- **WHEN** Unit A is a Trainee with 10 offset levels (conceptually -10 to 0) and Unit B is a standard unit with base level 1
- **THEN** the table begins at the offset equivalent of -10.
- **AND** rows -10 through 0 display `-` for Unit B's stats while Unit A's trainee stats are calculated.

#### Scenario: Unit exceeds their max level
- **WHEN** the current table row level exceeds the specific `maxLevel` defined for a unit
- **THEN** that unit's stat cells render as `-` for all subsequent rows, indicating they cannot grow further.

### Requirement: Table Range Expansion
The table SHALL provide a toggle to expand the displayed levels up to level 100, or adapt to infinite scrolling if an infinite `maxLevel` flag is present.

#### Scenario: User wants to see extended levels
- **WHEN** the user clicks the "Expand to Level 100" toggle
- **THEN** the table generates and displays rows up to effective level 100.

#### Scenario: Unit has infinite level cap
- **WHEN** a selected unit has a `maxLevel` set to "infinite"
- **THEN** the table's upper bound is uncapped or set to a high visual limit (e.g., 100) regardless of the standard default.

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions by resetting the displayed level counter to 1 while maintaining internal cumulative progression, unless the unit's game mechanics dictate continuous leveling.

#### Scenario: Unit crosses level 20 unpromoted
- **WHEN** a row is generated for a standard unit passing unpromoted level 20
- **THEN** the row label indicates "Level 1 (Promoted)" instead of "Level 21".

#### Scenario: Unit has infinite sequential leveling
- **WHEN** a row is generated for a unit from a game that does not reset levels on promotion/reclass (e.g., infinite growth mechanics)
- **THEN** the row label continues sequentially (e.g., "Level 21") without appending "(Promoted)".
