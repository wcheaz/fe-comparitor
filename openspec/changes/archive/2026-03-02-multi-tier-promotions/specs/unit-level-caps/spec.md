## ADDED Requirements

### Requirement: Maximum Level Tracking
The system SHALL support tracking and utilizing a unit-specific maximum level cap derived from game data.
#### Scenario: Unit with standard level cap
- **WHEN** a standard unpromoted unit (e.g., Roy) is loaded
- **THEN** their `maxLevel` is implicitly or explicitly set to 20.
#### Scenario: Unit with extended level cap
- **WHEN** a special unit (e.g., FE10 unit with 3 tiers) is loaded
- **THEN** their cumulative `maxLevel` represents their absolute maximum achievable level across all tiers (e.g., 60).

### Requirement: Trainee Level Representation
The system SHALL support and calculate stats for units starting at "negative" relative levels to represent pre-base classes (Trainees).
#### Scenario: Trainee unit loads
- **WHEN** an FE8 Trainee (e.g., Amelia) is loaded
- **THEN** the system calculates their initial 10 levels as levels -10 to 0 (or equivalent internal offset) before they reach standard level 1.

### Requirement: Infinite Leveling Flag
The system SHALL support a flag indicating a unit or game allows for infinite leveling/reclassing loops.
#### Scenario: Game with infinite leveling
- **WHEN** a unit from a game with infinite reclassing (e.g., FE13/FE14) is processed
- **THEN** the system ignores absolute max level caps and allows the level counter to scale indefinitely up to the table's visual rendering limit.
