## Purpose

Per-unit difficulty selector in the comparison grid and threading of selected difficulty through stat calculation functions. Covers the UI selector, integration with `ComparisonGrid`, `StatProgressionTable`, and `StatDifferenceHelper`, and the difficulty parameter on stat functions in `lib/stats.ts`.

## ADDED Requirements

### Requirement: Helper function selects personal bases by difficulty
The system SHALL provide a function `getPersonalBasesForDifficulty(unit: Unit, difficulty?: string): UnitStats` in `lib/stats.ts` that returns the appropriate personal bases for a given difficulty.

#### Scenario: No difficulty specified returns Normal-mode stats
- **WHEN** `getPersonalBasesForDifficulty(unit)` is called without a difficulty argument
- **THEN** it SHALL return `unit.stats` (Normal-mode personal bases)

#### Scenario: Difficulty specified and unit has variant bases for that difficulty
- **WHEN** `getPersonalBasesForDifficulty(unit, "hard")` is called on a unit with `baseStatsByDifficulty.hard`
- **THEN** it SHALL return `unit.baseStatsByDifficulty.hard`

#### Scenario: Difficulty specified but unit has no variant bases
- **WHEN** `getPersonalBasesForDifficulty(unit, "hard")` is called on a unit without `baseStatsByDifficulty`
- **THEN** it SHALL return `unit.stats` (Normal-mode personal bases)

#### Scenario: Difficulty specified but specific difficulty key is absent
- **WHEN** `getPersonalBasesForDifficulty(unit, "lunatic")` is called on a unit with `baseStatsByDifficulty` that only has a `"hard"` key
- **THEN** it SHALL return `unit.stats` (Normal-mode personal bases)

### Requirement: getEffectiveBaseStats accepts optional difficulty parameter
The `getEffectiveBaseStats(unit, classData, difficulty?)` function in `lib/stats.ts` SHALL accept an optional third parameter `difficulty`. When provided, it SHALL use `getPersonalBasesForDifficulty(unit, difficulty)` instead of `unit.stats` for the personal bases computation.

#### Scenario: getEffectiveBaseStats with difficulty uses variant personal bases
- **WHEN** `getEffectiveBaseStats(unit, classData, "hard")` is called on an Awakening unit with Hard variant bases
- **THEN** the effective bases SHALL be computed as `variant_personal_bases + classData.baseStats`
- **AND** the result SHALL differ from the Normal-mode effective bases

#### Scenario: getEffectiveBaseStats without difficulty preserves existing behavior
- **WHEN** `getEffectiveBaseStats(unit, classData)` is called without a difficulty argument
- **THEN** the result SHALL be identical to the current behavior (`unit.stats + classData.baseStats`)

### Requirement: calculateAverageStats accepts optional difficulty parameter
The `calculateAverageStats(unit, targetLevel, classes?, difficulty?)` function SHALL accept an optional `difficulty` parameter and pass it through to `getEffectiveBaseStats` when computing the seed stats for progression.

#### Scenario: calculateAverageStats with difficulty uses variant bases
- **WHEN** `calculateAverageStats(unit, 20, classes, "lunatic")` is called on a unit with Lunatic variant bases
- **THEN** the average stats at level 20 SHALL be seeded from Lunatic personal bases + class bases
- **AND** the result SHALL differ from Normal-mode average stats at level 20

#### Scenario: calculateAverageStats without difficulty preserves existing behavior
- **WHEN** `calculateAverageStats(unit, targetLevel, classes)` is called without a difficulty argument
- **THEN** the result SHALL be identical to the current behavior

### Requirement: generateProgressionArray accepts optional difficulty parameter
The `generateProgressionArray(unit, startLevel?, endLevel?, classes?, promotionEvents?, reclassEvents?, difficulty?)` function SHALL accept an optional `difficulty` parameter and pass it through to stat computation.

#### Scenario: generateProgressionArray with difficulty uses variant bases throughout
- **WHEN** `generateProgressionArray(unit, 1, 20, classes, [], [], "hard")` is called on a unit with Hard variant bases
- **THEN** every level in the progression array SHALL be computed using Hard personal bases as the seed
- **AND** the base level stats SHALL reflect Hard personal bases + class bases

#### Scenario: generateProgressionArray without difficulty preserves existing behavior
- **WHEN** `generateProgressionArray(unit, 1, 20, classes)` is called without a difficulty argument
- **THEN** the result SHALL be identical to the current behavior

### Requirement: compareUnits accepts optional per-unit difficulty parameters
The `compareUnits(unitA, unitB, level, difficultyA?, difficultyB?)` function SHALL accept optional difficulty parameters for each unit independently.

#### Scenario: compareUnits with different difficulties per unit
- **WHEN** `compareUnits(unitA, unitB, 20, "hard", "lunatic")` is called
- **THEN** unitA SHALL be computed using Hard personal bases
- **AND** unitB SHALL be computed using Lunatic personal bases
- **AND** the differences SHALL reflect the stat gap between the two difficulties

#### Scenario: compareUnits without difficulties preserves existing behavior
- **WHEN** `compareUnits(unitA, unitB, level)` is called without difficulty arguments
- **THEN** the result SHALL be identical to the current behavior

### Requirement: Per-unit difficulty selector in ComparisonGrid
The `ComparisonGrid` component SHALL render a difficulty selector for each unit that has a `baseStatsByDifficulty` field. The selector SHALL be a pill-style button group with options matching the available difficulties on that unit plus Normal as the default.

#### Scenario: Difficulty selector appears for unit with variant bases
- **WHEN** a unit with `baseStatsByDifficulty: { hard: {...}, lunatic: {...} }` is displayed in the comparison grid
- **THEN** a three-button pill (Normal / Hard / Lunatic) SHALL appear in that unit's column header area
- **AND** "Normal" SHALL be selected by default

#### Scenario: Difficulty selector appears for unit with Lunatic-only variant
- **WHEN** a unit with `baseStatsByDifficulty: { lunatic: {...} }` is displayed (e.g., Gregor, Nowi, Tharja)
- **THEN** a two-button pill (Normal / Lunatic) SHALL appear in that unit's column header area
- **AND** "Normal" SHALL be selected by default

#### Scenario: Difficulty selector does not appear for unit without variant bases
- **WHEN** a unit without `baseStatsByDifficulty` is displayed (e.g., Chrom, Lissa)
- **THEN** no difficulty selector SHALL appear for that unit's column

#### Scenario: Selecting a difficulty updates displayed stats
- **WHEN** the user clicks "Hard" on a unit's difficulty selector
- **THEN** the Base Stats card SHALL show Hard personal bases (or Hard effective bases if Effective mode is active)
- **AND** the Stat Progression Table SHALL recompute using Hard personal bases
- **AND** the Stat Difference Helper SHALL recompute using Hard personal bases

#### Scenario: Each unit's difficulty selector is independent
- **WHEN** two units are displayed and both have difficulty variants
- **THEN** each unit SHALL have its own independent difficulty selector
- **AND** changing one unit's difficulty SHALL NOT affect the other unit's displayed stats

### Requirement: Per-unit difficulty state in comparator page
The `app/comparator/page.tsx` component SHALL hold a `selectedDifficulties` state (`Record<string, string>`) mapping unit IDs to their selected difficulty. This state SHALL be passed to `ComparisonGrid` and `StatProgressionTable` as props.

#### Scenario: Default difficulty state is empty
- **WHEN** the comparator page loads with two selected units
- **THEN** `selectedDifficulties` SHALL be an empty object (or contain no entries for the selected units)
- **AND** all stat displays SHALL use Normal-mode personal bases

#### Scenario: Difficulty state is preserved when switching units
- **WHEN** the user selects Hard for unit A, then replaces unit A with a different unit
- **THEN** the new unit A SHALL display Normal-mode stats (no inherited difficulty)
- **AND** if the original unit A is re-selected, its Hard difficulty setting does NOT need to be preserved

### Requirement: StatProgressionTable accepts and uses difficulty prop
The `StatProgressionTable` component SHALL accept a `selectedDifficulties` prop and pass the appropriate difficulty to `generateProgressionArray` for each unit.

#### Scenario: StatProgressionTable with difficulty renders correct progression
- **WHEN** `StatProgressionTable` receives `selectedDifficulties: { flavia: "hard" }` and renders Flavia's progression
- **THEN** `generateProgressionArray` SHALL be called with `difficulty="hard"` for Flavia
- **AND** the displayed level-by-level stats SHALL reflect Hard personal bases

#### Scenario: StatProgressionTable without difficulty preserves existing behavior
- **WHEN** `StatProgressionTable` receives `selectedDifficulties: {}` or no selected difficulty for a unit
- **THEN** the progression SHALL use Normal-mode personal bases (existing behavior)

### Requirement: StatDifferenceHelper accepts and uses difficulty
The `StatDifferenceHelper` component SHALL use the selected difficulties for each unit when calling `compareUnits`.

#### Scenario: StatDifferenceHelper with difficulty computes correct differences
- **WHEN** unit A has difficulty "hard" and unit B has difficulty "lunatic" selected
- **THEN** `compareUnits(unitA, unitB, level, "hard", "lunatic")` SHALL be called
- **AND** the displayed differences SHALL reflect the cross-difficulty comparison
