## ADDED Requirements

### Requirement: Scrape Awakening difficulty-variant visible bases from Serenes Forest
The system SHALL provide a script `dev/scrape_awakening_difficulty_bases.py` that fetches the visible base stats table from `https://serenesforest.net/awakening/characters/base-stats/main-story/` using `pandas.read_html`, extracts only rows with `(H)` or `(L)` in the Name field, and saves raw data to `dev/awakening_difficulty_bases_raw.json`. This script is separate from the existing Normal-only scraper and does not modify its output.

#### Scenario: Difficulty bases scraper runs successfully
- **WHEN** `python dev/scrape_awakening_difficulty_bases.py` is executed
- **THEN** the file `dev/awakening_difficulty_bases_raw.json` SHALL exist
- **AND** it SHALL contain entries for all 17 units with difficulty variants
- **AND** each entry's Name SHALL include the `(H)` or `(L)` suffix

#### Scenario: Normal-mode rows are excluded
- **WHEN** the raw HTML table contains rows without `(H)` or `(L)` in the Name
- **THEN** those rows SHALL NOT appear in `dev/awakening_difficulty_bases_raw.json`

### Requirement: Compute difficulty-variant personal bases
The system SHALL provide a script `dev/parse_awakening_difficulty_bases.py` that reads `dev/awakening_difficulty_bases_raw.json` and `dev/awakening_class_bases_raw.json`, strips skill bonuses, subtracts class bases, and writes results to `dev/awakening_difficulty_personal_bases.json`. This script is separate from the existing Normal-only parser and does not modify its output.

#### Scenario: Difficulty personal bases are computed for all variant units
- **WHEN** `python dev/parse_awakening_difficulty_bases.py` is executed
- **THEN** `dev/awakening_difficulty_personal_bases.json` SHALL contain entries for all 17 variant units
- **AND** each entry SHALL include unit name, unit id, difficulty, visible bases, class bases, and computed personal bases

#### Scenario: Skill bonuses are stripped before subtraction
- **WHEN** a difficulty-row visible base stat contains a `+` suffix
- **THEN** the parser SHALL use only the integer portion before the `+` as the visible base

#### Scenario: Difficulty personal bases are validated
- **WHEN** difficulty personal bases have been computed
- **THEN** for every unit, difficulty, and stat, `personal_base` SHALL be ≤ `visible_base`
- **AND** the script SHALL exit code 0 on success, non-zero with error details on failure
