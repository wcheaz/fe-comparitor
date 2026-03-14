## MODIFIED Requirements

### Requirement: Accurate Promotion Stat Adjustments
The system SHALL apply appropriate statistical bonuses when a unit promotes, according to their new class data defined in the game's class data file. The new class data used MUST correspond to the promotion path selected by the user, or the default first class if no selection is made. For games that use personal vs class bases/growths (e.g. Awakening), the system SHALL instead recalculate stats based on the new class's stat modifiers and growths rather than applying flat promotion bonuses.

#### Scenario: Unit receives promotion bonuses
- **WHEN** a legacy unit's progression crosses their promotion level
- **THEN** their stats are increased by the class's specified promotion bonuses.

#### Scenario: Awakening unit promotes/reclasses
- **WHEN** an Awakening unit's progression crosses their promotion/reclass level
- **THEN** their base stats are recalculated using their personal bases + the new class's stat modifiers.

#### Scenario: Unit stats are floored by class bases
- **WHEN** a unit's stats upon promotion are lower than the new class's base stats
- **THEN** their stats are raised exactly to match the class base stats.

#### Scenario: Unit benefits from hidden class modifiers
- **WHEN** a unit promotes into a class with hidden bonuses (e.g., Swordmaster +30 Crit, Flying)
- **THEN** the system accounts for and displays these modifiers in their progression or detailed breakdown.
