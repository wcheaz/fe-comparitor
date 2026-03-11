## MODIFIED Requirements

### Requirement: Infinite Leveling Flag
The system SHALL support dynamic progression bounds where the table visually generates up to a reasonable cap (e.g., 40 rows per class cycle), but does not strictly cut off cumulative growth. It SHALL respect internal class max levels (e.g., 20 or 30) for individual cycles, terminating table generation only when the final class cycle reaches its cap.

#### Scenario: Game with infinite leveling via reclassing
- **WHEN** a unit from a game with infinite reclassing (e.g., Awakening) is processed
- **THEN** the system enforces the current class's level cap (e.g., 20) to stop row generation for that specific sequence.
- **AND** if another reclass event is appended, row generation resumes from level 1 up to the new class's level cap.

### Requirement: Maximum Level Tracking
The system SHALL support tracking and utilizing a unit-specific and class-specific maximum level cap derived from game data to dictate when to halt stat row generation.

#### Scenario: Unit with standard level cap
- **WHEN** a standard unpromoted unit (e.g., Roy) is loaded
- **THEN** their `maxLevel` is implicitly or explicitly set to 20.
- **AND** row generation ceases after 20 unless a promotion event exists.

#### Scenario: Unit with extended level cap
- **WHEN** a special unit (e.g., FE10 unit with 3 tiers) is loaded
- **THEN** their cumulative `maxLevel` represents their absolute maximum achievable level across all tiers (e.g., 60).

#### Scenario: Special class with level 30 cap
- **WHEN** a unit enters a special class (e.g., Manakete, Taguel, Villager, Dancer)
- **THEN** the table generates rows up to level 30 for that class cycle instead of the standard 20.
