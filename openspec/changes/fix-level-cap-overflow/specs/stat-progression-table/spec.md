## MODIFIED Requirements

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions and reclass events. For standard games, it may increment indefinitely or within standard tiers. For games with reclassing (e.g., Awakening), it SHALL reset the displayed level counter to 1 while maintaining internal cumulative stat progression upon every promotion or reclass event. When multiple units are compared, each unit's progression array SHALL be computed independently and SHALL NOT produce ghost rows (rows with repeated level numbers in the same class) due to differing progression lengths between units.

#### Scenario: Unit crosses level 20 unpromoted without events
- **WHEN** a row is generated for a standard unit passing unpromoted level 20 without explicit promotion events
- **THEN** the row label indicates "Level 1 (Promoted)" instead of "Level 21".

#### Scenario: Unit has infinite sequential leveling
- **WHEN** a row is generated for a unit from a game that does not reset levels on promotion/reclass (e.g., infinite growth mechanics)
- **THEN** the row label continues sequentially (e.g., "Level 21") without appending "(Promoted)".

#### Scenario: Unit formally reclasses or promotes via event
- **WHEN** a reclass or promotion event is explicitly triggered at level X
- **THEN** the subsequent row immediately resets to "Level 1" under the new class's banner, regardless of if X was 10, 20, or another valid level.

#### Scenario: Multi-unit comparison with unequal progression lengths
- **WHEN** unit A has 3 class-change events and unit B has 1 class-change event
- **THEN** the table SHALL render rows up to the length of the longest progression array.
- **AND** for indices beyond unit B's progression array length, unit B's cells SHALL show empty/dash values.
- **AND** unit B SHALL NOT produce duplicate level rows (e.g., "Level 1-4 Tier 2" repeated after "Level 20 Tier 2").

## ADDED Requirements

### Requirement: Deterministic Progression Termination
The `generateProgressionArray` function SHALL guarantee that no unit's progression array contains a row where the `displayLevelNum` exceeds the current class's level cap when no further class-change events remain. This invariant SHALL hold regardless of the `endLevel` parameter value passed by any caller.

#### Scenario: Standard unit with single promotion and inflated endLevel
- **WHEN** a unit with a single promotion event at level 20 is processed with `endLevel = 130`
- **THEN** the progression array SHALL contain exactly (base class levels 1-20) + (promoted class levels 1-20) rows.
- **AND** no row SHALL have a display level exceeding 20 in any class.
- **AND** the array SHALL NOT contain any duplicated level sequence in the same class.

#### Scenario: Late-joining unit with single promotion
- **WHEN** a unit joining at level 5 with a single promotion event at level 20 is processed alongside a unit with 3 events
- **THEN** the late-joining unit's progression SHALL contain padding rows for levels 1-4, real rows for levels 5-20 in the base class, and real rows for levels 1-20 in the promoted class.
- **AND** the progression SHALL terminate at Level 20 of the promoted class with no additional rows.
