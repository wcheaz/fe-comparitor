## MODIFIED Requirements

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions across an arbitrary number of branching promotion tiers by resetting the displayed level counter to 1 for each new tier, while maintaining internal cumulative progression.

#### Scenario: Unit crosses level 20 unpromoted
- **WHEN** a row is generated for a standard unit passing unpromoted level 20
- **THEN** the row label indicates "Level 1 (Promoted)" instead of "Level 21".

#### Scenario: Unit crosses into a subsequent promotion tier
- **WHEN** a unit promotes from one tier to the next (e.g., Trainee -> Tier 1, or Tier 1 -> Tier 2)
- **THEN** the row label resets to 1 to reflect the new class tier instead of continuing the previous tier's level mapping.

### Requirement: Accurate Promotion Stat Adjustments
The system SHALL apply appropriate statistical bonuses when a unit promotes, according to their new class data defined in the game's class data file, accumulating stat adjustments accurately across all traversed promotion tiers.

#### Scenario: Unit receives promotion bonuses
- **WHEN** a unit's progression crosses their promotion level
- **THEN** their stats are increased by the class's specified promotion bonuses.

#### Scenario: Unit stats are floored by class bases
- **WHEN** a unit's stats upon promotion are lower than the new class's base stats
- **THEN** their stats are raised exactly to match the class base stats.

#### Scenario: Unit benefits from hidden class modifiers
- **WHEN** a unit promotes into a class with hidden bonuses (e.g., Swordmaster +30 Crit, Flying)
- **THEN** the system accounts for and displays these modifiers in their progression or detailed breakdown.

#### Scenario: Unit receives multiple distinct promotion bonuses
- **WHEN** a unit traverses multiple independent promotion tiers (e.g., Trainee -> Tier 1 -> Tier 2)
- **THEN** the system correctly applies and accumulates the promotion bonuses for each distinct transition independently.
