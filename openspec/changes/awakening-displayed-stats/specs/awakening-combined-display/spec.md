## ADDED Requirements

### Requirement: Combined base stat display for Awakening units
For Awakening units, all stat display components (ComparisonGrid, StatTable) SHALL show base stats as the sum of `unit.stats[stat] + class.baseStats[stat]` (personal base + class base). This produces the in-game "displayed base" that a player sees on the unit info screen.

#### Scenario: ComparisonGrid shows combined bases for Awakening unit
- **WHEN** a user views the base stats section of the ComparisonGrid for an Awakening unit
- **THEN** each base stat cell SHALL display `unit.stats[statKey] + class.baseStats[statKey]` for that unit's starting class
- **AND** non-Awakening units SHALL continue to display `unit.stats[statKey]` unchanged

#### Scenario: StatTable shows combined bases for Awakening unit
- **WHEN** a user views the StatTable for an Awakening unit on the unit detail page
- **THEN** each base stat row SHALL display `unit.stats[statKey] + class.baseStats[statKey]` for that unit's starting class
- **AND** non-Awakening units SHALL continue to display `unit.stats[statKey]` unchanged

#### Scenario: Awakening unit missing class base data
- **WHEN** an Awakening unit's class does not have a `baseStats` entry for a given stat key
- **THEN** the combined base SHALL fall back to `unit.stats[statKey] + 0` (personal base only)

### Requirement: Combined growth rate display for Awakening units
For Awakening units, all stat display components (ComparisonGrid, StatTable) SHALL show growth rates as the sum of `unit.growths[stat] + class.growths[stat]` (personal growth + class growth). This produces the effective growth rate used in Awakening's level-up mechanic.

#### Scenario: ComparisonGrid shows combined growths for Awakening unit
- **WHEN** a user views the growth rates section of the ComparisonGrid for an Awakening unit
- **THEN** each growth cell SHALL display `unit.growths[statKey] + class.growths[statKey]` with a `%` suffix
- **AND** non-Awakening units SHALL continue to display `unit.growths[statKey]` unchanged

#### Scenario: StatTable shows combined growths for Awakening unit
- **WHEN** a user views the StatTable for an Awakening unit on the unit detail page
- **THEN** each growth row SHALL display `unit.growths[statKey] + class.growths[statKey]` with a `%` suffix
- **AND** non-Awakening units SHALL continue to display `unit.growths[statKey]` unchanged

#### Scenario: Awakening unit missing class growth data
- **WHEN** an Awakening unit's class does not have a `growths` entry for a given stat key
- **THEN** the combined growth SHALL fall back to `unit.growths[statKey] + 0` (personal growth only)

### Requirement: calculateAverageStats Awakening awareness
The `calculateAverageStats` function in `lib/stats.ts` SHALL accept an optional `classes` parameter. For Awakening units, when `classes` is provided, it SHALL compute stats using combined bases (`unit.stats + class.baseStats`), combined growths (`unit.growths + class.growths`), and class stat caps (`class.maxStats`).

#### Scenario: Awakening unit average stat with class data
- **WHEN** `calculateAverageStats` is called for an Awakening unit with a `classes` array
- **THEN** the base for each stat SHALL be `unit.stats[statKey] + class.baseStats[statKey]`
- **AND** the growth rate SHALL be `unit.growths[statKey] + class.growths[statKey]`
- **AND** the cap SHALL be `class.maxStats[statKey]` (falling back to `unit.maxStats[statKey]`, then to 99 for HP / 40 for other stats)

#### Scenario: Awakening unit average stat without class data
- **WHEN** `calculateAverageStats` is called for an Awakening unit without a `classes` array
- **THEN** the function SHALL use `unit.stats` and `unit.growths` directly (personal only), matching existing behavior

#### Scenario: Non-Awakening unit ignores class data
- **WHEN** `calculateAverageStats` is called for a non-Awakening unit
- **THEN** the function SHALL use `unit.stats` and `unit.growths` directly regardless of whether `classes` is provided
