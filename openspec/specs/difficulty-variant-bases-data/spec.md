## Purpose

Data schema, scraper pipeline, and data loading for per-difficulty personal base stats. Covers the `baseStatsByDifficulty` field on the `Unit` type, scraper/parser scripts to capture Hard and Lunatic rows from Serenes Forest, and the data transformation in `lib/data.ts`.

## ADDED Requirements

### Requirement: Unit type supports optional difficulty-variant personal bases
The `Unit` interface in `types/unit.ts` SHALL include an optional field `baseStatsByDifficulty?: Record<string, UnitStats>`. When present, keys SHALL be lowercase difficulty identifiers (`"hard"`, `"lunatic"`) and values SHALL be personal base stats (`UnitStats`) for that difficulty. The existing `stats` field SHALL remain the Normal-mode personal bases and SHALL NOT change.

#### Scenario: Unit with difficulty variants loads correctly
- **WHEN** a unit with a `baseStatsByDifficulty` field is loaded from JSON via `lib/data.ts`
- **THEN** the `Unit` object SHALL contain `baseStatsByDifficulty` with the correct keys and stat values
- **AND** `unit.stats` SHALL remain the Normal-mode personal bases

#### Scenario: Unit without difficulty variants loads correctly
- **WHEN** a unit without a `baseStatsByDifficulty` field is loaded from JSON
- **THEN** the `Unit` object SHALL NOT have a `baseStatsByDifficulty` field
- **AND** `unit.stats` SHALL be the Normal-mode personal bases (existing behavior unchanged)

#### Scenario: Difficulty key format is consistent
- **WHEN** `baseStatsByDifficulty` is present on a unit
- **THEN** every key SHALL be a lowercase string matching a known difficulty identifier (`"hard"`, `"lunatic"`)
- **AND** every value SHALL be a `UnitStats` object with the same stat keys as `unit.stats`

### Requirement: Scrape Awakening difficulty-variant visible bases from Serenes Forest
The system SHALL provide a script `dev/scrape_awakening_difficulty_bases.py` that fetches the visible base stats table from `https://serenesforest.net/awakening/characters/base-stats/main-story/` using `pandas.read_html`, extracts only rows with `(H)` or `(L)` in the Name field, and saves raw data to `dev/awakening_difficulty_bases_raw.json`.

#### Scenario: Difficulty bases scraper runs successfully
- **WHEN** `python dev/scrape_awakening_difficulty_bases.py` is executed
- **THEN** the file `dev/awakening_difficulty_bases_raw.json` SHALL exist
- **AND** it SHALL contain entries for all 17 units with difficulty variants (14 with both H and L rows, 3 with L-only rows)
- **AND** each entry SHALL contain fields for Name, Class, Lv, HP, Str, Mag, Skl, Spd, Lck, Def, Res
- **AND** each entry's Name SHALL include the `(H)` or `(L)` suffix indicating the difficulty

#### Scenario: Normal-mode rows are excluded from difficulty scraper
- **WHEN** the raw HTML table contains rows without `(H)` or `(L)` in the Name
- **THEN** those rows SHALL NOT appear in `dev/awakening_difficulty_bases_raw.json`
- **AND** only rows with difficulty suffixes SHALL be included

#### Scenario: Skill bonuses are preserved as-is in raw output
- **WHEN** a difficulty-row stat value contains a skill bonus (e.g., `14+2`)
- **THEN** the raw JSON SHALL preserve the original string value including the `+` suffix
- **AND** parsing of skill bonuses SHALL be handled in the parser script, not the scraper

### Requirement: Compute difficulty-variant personal bases by subtracting class bases
The system SHALL provide a script `dev/parse_awakening_difficulty_bases.py` that reads `dev/awakening_difficulty_bases_raw.json` and `dev/awakening_class_bases_raw.json`, strips skill bonuses, subtracts class bases from visible bases for each difficulty, and writes results to `dev/awakening_difficulty_personal_bases.json`.

#### Scenario: Difficulty personal bases are computed for all variant units
- **WHEN** `python dev/parse_awakening_difficulty_bases.py` is executed
- **THEN** the file `dev/awakening_difficulty_personal_bases.json` SHALL exist
- **AND** it SHALL contain entries for all 17 units with difficulty variants
- **AND** each entry SHALL include the unit name, unit id, difficulty identifier, visible bases, class bases, and computed personal bases for HP, Str, Mag, Skl, Spd, Lck, Def, Res

#### Scenario: Difficulty suffix is stripped from unit name
- **WHEN** a raw entry has Name `"Flavia (H)"`
- **THEN** the parser SHALL produce a canonical name `"Flavia"` and a difficulty key `"hard"`
- **AND** the parser SHALL map the unit to its `id` in `data/awakening/units.json`

#### Scenario: Skill bonuses are stripped before subtraction
- **WHEN** a difficulty-row visible base stat contains a `+` suffix (e.g., `14+2`)
- **THEN** the parser SHALL use only the integer portion before the `+` as the visible base
- **AND** the skill bonus portion SHALL be ignored for personal base calculation

#### Scenario: Parser validates against expected unit list
- **WHEN** the parser encounters a unit name not in the known list of 17 variant units
- **THEN** it SHALL print a warning with the unexpected name
- **AND** it SHALL skip that entry

#### Scenario: Difficulty personal bases are validated
- **WHEN** difficulty personal bases have been computed
- **THEN** for every unit, every difficulty, and every stat, `personal_base` SHALL be ≤ `visible_base`
- **AND** the script SHALL exit with code 0 on success
- **AND** the script SHALL exit non-zero and print the offending unit, stat, and values on failure

### Requirement: Update units.json with difficulty-variant personal bases
After manual review of `dev/awakening_difficulty_personal_bases.json`, the 17 affected units in `data/awakening/units.json` SHALL gain a `baseStatsByDifficulty` field. No other fields on any unit SHALL change.

#### Scenario: Units.json gains baseStatsByDifficulty for variant units
- **WHEN** the difficulty personal bases have been computed and manually reviewed
- **THEN** each of the 17 variant units SHALL have a `baseStatsByDifficulty` field
- **AND** the field SHALL contain keys matching the difficulties available for that unit (`"hard"` and/or `"lunatic"`)
- **AND** the values SHALL match the computed personal bases from the intermediary file
- **AND** `stats`, `growths`, `statModifiers`, `skills`, and all other fields SHALL remain unchanged

#### Scenario: Non-variant units are unchanged
- **WHEN** units.json is updated
- **THEN** units without difficulty variants SHALL NOT have a `baseStatsByDifficulty` field added
- **AND** all their existing fields SHALL remain unchanged

### Requirement: transformJsonToUnit populates baseStatsByDifficulty
The `transformJsonToUnit` function in `lib/data.ts` SHALL read the `baseStatsByDifficulty` field from raw JSON and populate it on the `Unit` object.

#### Scenario: Raw unit with baseStatsByDifficulty is transformed
- **WHEN** a raw unit object contains a `baseStatsByDifficulty` field
- **THEN** the resulting `Unit` object SHALL include `baseStatsByDifficulty` with all keys and stat values preserved

#### Scenario: Raw unit without baseStatsByDifficulty is transformed
- **WHEN** a raw unit object does not contain a `baseStatsByDifficulty` field
- **THEN** the resulting `Unit` object SHALL NOT have a `baseStatsByDifficulty` field
- **AND** existing behavior SHALL be unchanged
