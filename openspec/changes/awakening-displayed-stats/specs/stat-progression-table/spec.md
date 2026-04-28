## MODIFIED Requirements

### Requirement: Accurate Promotion Stat Adjustments
The system SHALL apply appropriate statistical bonuses when a unit promotes, according to their new class data defined in the game's class data file. The new class data used MUST correspond to the promotion path selected by the user, or the default first class if no selection is made. For games that use personal vs class bases/growths (e.g. Awakening), the system SHALL instead recalculate stats based on the new class's stat modifiers and growths rather than applying flat promotion bonuses. These calculations operate on a single unit passed to the component — no cross-unit stat reconciliation is performed.

#### Scenario: Unit receives promotion bonuses
- **WHEN** a legacy unit's progression crosses their promotion level
- **THEN** their stats are increased by the class's specified promotion bonuses.

#### Scenario: Awakening unit promotes/reclasses
- **WHEN** an Awakening unit's progression crosses their promotion/reclass level
- **THEN** their uncapped internal stats SHALL carry forward as the new base for growth accumulation in the new class.
- **AND** the displayed stats SHALL be capped at the new class's `maxStats`.
- **AND** the starting displayed stats for the new class SHALL equal `uncapped_internal_stats + promotion_bonus` (if promotion), floored by `new_class.baseStats`, then capped by `new_class.maxStats`.

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
- **AND** the new class's growths SHALL be added to the unit's personal growths going forward
- **AND** the displayed stats SHALL be capped at the new class's `maxStats`

#### Scenario: Non-Awakening unit caps remain destructive
- **WHEN** a non-Awakening unit's stat hits a class cap
- **THEN** the capped stat SHALL be used as the base for subsequent level calculations (existing behavior unchanged)
