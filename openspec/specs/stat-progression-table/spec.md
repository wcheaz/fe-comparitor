## MODIFIED Requirements

### Requirement: Accurate Promotion Stat Adjustments
The system SHALL apply appropriate statistical bonuses when a unit promotes, according to their new class data defined in the game's class data file. The new class data used MUST correspond to the promotion path selected by the user, or the default first class if no selection is made. For games that use personal vs class bases/growths (e.g. Awakening), the system SHALL instead recalculate stats based on the new class's stat modifiers and growths rather than applying flat promotion bonuses. These calculations operate on a single unit passed to the component — no cross-unit stat reconciliation is performed.

#### Scenario: Unit receives promotion bonuses
- **WHEN** a legacy unit's progression crosses their promotion level
- **THEN** their stats are increased by the class's specified promotion bonuses.

#### Scenario: Awakening unit promotes/reclasses
- **WHEN** an Awakening unit's progression crosses their promotion/reclass level
- **THEN** their uncapped internal stats SHALL carry forward as the new base for growth accumulation in the new class.
- **AND** the uncapped internal stats SHALL be adjusted by the difference between the new class's `baseStats` and the old class's `baseStats` (i.e., `uncapped_stat += new_class.baseStats[stat] - old_class.baseStats[stat]` for each stat).
- **AND** the displayed stats SHALL be capped at the new class's `maxStats`.
- **AND** the starting displayed stats for the new class SHALL equal `adjusted_uncapped_stats + promotion_bonus` (if promotion), capped by `new_class.maxStats`.

#### Scenario: Awakening unit promotes to class with higher class base
- **WHEN** Cherche (Wyvern Rider, class base HP 19) promotes to Griffon Lord (class base HP 22)
- **AND** her uncapped internal HP at Wyvern Rider level 20 is 34.4
- **THEN** her uncapped internal HP after promotion SHALL be 34.4 + (22 - 19) = 37.4
- **AND** the 3 HP gain reflects the new class's higher base stat

#### Scenario: Unit stats are floored by class bases
- **WHEN** a unit's stats upon promotion are lower than the new class's base stats
- **THEN** their stats are raised exactly to match the class base stats.

#### Scenario: Unit benefits from hidden class modifiers
- **WHEN** a unit promotes into a class with hidden bonuses (e.g., Swordmaster +30 Crit, Flying)
- **THEN** the system accounts for and displays these modifiers in their progression or detailed breakdown.

### Requirement: Uncapped internal stat accumulation
The `generateProgressionArray` function SHALL track two layers of stat values for Awakening units: uncapped internal stats and capped display stats. Uncapped internal stats accumulate growth without any cap and persist across class changes. Display stats are computed by applying the current class's `maxStats` cap to the uncapped internal stats, then adding `class.statModifiers`.

#### Scenario: Awakening unit growth exceeds class cap
- **WHEN** an Awakening unit's uncapped internal stat in a class exceeds that class's `maxStats[stat]`
- **THEN** the displayed stat SHALL be capped at `maxStats[stat]`
- **AND** the uncapped internal stat SHALL continue to accumulate growth on subsequent levels

#### Scenario: Awakening unit reclasses to class with higher cap
- **WHEN** an Awakening unit reclasses from a class with a low stat cap to a class with a higher stat cap
- **AND** the unit's uncapped internal stat exceeds the old cap but is below or equal to the new cap
- **THEN** the displayed stat in the new class SHALL reflect the full uncapped internal value
- **AND** the displayed stat SHALL NOT be limited by the old class's cap

#### Scenario: Awakening unit reclasses and carries uncapped stats
- **WHEN** an Awakening unit reclasses to a new class
- **THEN** the uncapped internal stats from the previous class SHALL become the base for growth accumulation in the new class
- **AND** the uncapped internal stats SHALL be adjusted by the difference between the new class's `baseStats` and the old class's `baseStats` (i.e., `uncapped_stat += new_class.baseStats[stat] - old_class.baseStats[stat]` for each stat)
- **AND** the new class's growths SHALL be added to the unit's personal growths going forward
- **AND** the displayed stats SHALL be capped at the new class's `maxStats`

#### Scenario: Non-Awakening unit caps remain destructive
- **WHEN** a non-Awakening unit's stat hits a class cap
- **THEN** the capped stat SHALL be used as the base for subsequent level calculations (existing behavior unchanged)

### Requirement: Reclassing UI Integration
The UI must render available "Reclass" options in the "Promotion Levels" configuration alongside or in place of "Promote" options when the unit hits the appropriate level threshold. The `generateProgressionArray` function in `lib/stats.ts` must accurately map class transitions, applying the new class's `statModifiers` to reset the unit's caps and factoring in the new class's `baseStats`. Reclassing drops the unit back to Level 1 of the selected class, but keeps their accumulated generic stats intact. The average stat differences between the old class's growths and the newly reclassed growths must smoothly propagate downwards for levels mapped *after* a Reclass Event. Prevent infinitely large stat tables by enforcing a cap on the number of stacked reclass events a user can click (or ensuring "maxLevel" continues to bound the table height effectively). These controls are scoped to the individual unit's table instance — no cross-unit coordination.

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions and reclass events. For standard games, it may increment indefinitely or within standard tiers. For games with reclassing (e.g., Awakening), it SHALL reset the displayed level counter to 1 while maintaining internal cumulative stat progression upon every promotion or reclass event. The component accepts a single unit — row alignment across multiple units is not performed. When multiple units are compared, each unit's progression array SHALL be computed independently and SHALL NOT produce ghost rows (rows with repeated level numbers in the same class) due to differing progression lengths between units.

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
