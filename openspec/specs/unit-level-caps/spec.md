## MODIFIED Requirements

### Requirement: Infinite Leveling Flag
The system SHALL support dynamic progression bounds where the table visually generates up to a reasonable cap (e.g., 40 rows per class cycle), but does not strictly cut off cumulative growth. It SHALL respect internal class max levels (e.g., 20 or 30) for individual cycles, terminating table generation only when the final class cycle reaches its cap. The termination condition SHALL be evaluated both before pushing a row (to prevent overflow rows) AND after incrementing the display level at the end of each loop iteration (to prevent the outer loop from continuing unnecessarily when the `endLevel` parameter exceeds the unit's natural progression length).

#### Scenario: Game with infinite leveling via reclassing
- **WHEN** a unit from a game with infinite reclassing (e.g., Awakening) is processed
- **THEN** the system enforces the current class's level cap (e.g., 20) to stop row generation for that specific sequence.
- **AND** if another reclass event is appended, row generation resumes from level 1 up to the new class's level cap.

#### Scenario: Unit with fewer events compared alongside unit with more events
- **WHEN** two units are compared and unit A has 3 class-change events while unit B has 1 promotion event
- **THEN** the `generateProgressionArray` function receives the same inflated `endLevel` for both units (derived from unit A's longer progression)
- **AND** unit B's progression array SHALL terminate exactly at its final class's level cap (e.g., Level 20 Tier 2)
- **AND** no rows SHALL be generated for unit B beyond its final class level cap.
- **AND** unit B's progression array length SHALL equal only the rows needed for its own class cycles plus padding, independent of the `endLevel` parameter.

### Requirement: Maximum Level Tracking
The system SHALL support tracking and utilizing a unit-specific and class-specific maximum level cap derived from game data to dictate when to halt stat row generation. The `generateProgressionArray` function SHALL be self-contained in its termination: it MUST stop generating rows when `displayLevelNum` exceeds the current class's level cap and no further events remain, regardless of the `endLevel` value passed by the caller.

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

#### Scenario: Caller passes inflated endLevel
- **WHEN** `generateProgressionArray` is called with an `endLevel` value larger than needed (e.g., 130 when only 40 internal levels are required)
- **THEN** the function SHALL terminate at the correct point determined by the unit's class cap and event list, not at `endLevel`.
- **AND** the returned array length SHALL reflect only the rows generated up to the cap, not up to `endLevel`.
