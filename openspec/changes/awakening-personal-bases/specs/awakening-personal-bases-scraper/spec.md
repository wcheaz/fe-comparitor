## ADDED Requirements

### Requirement: Scrape Awakening unit visible base stats from Serenes Forest
The system SHALL provide a script `dev/scrape_awakening_unit_bases.py` that fetches the visible (final) base stats table for all Awakening main-story, child, and SpotPass characters from `https://serenesforest.net/awakening/characters/base-stats/main-story/` using `pandas.read_html`. The raw scraped data SHALL be saved to `dev/awakening_unit_bases_raw.json`.

#### Scenario: Unit bases scraper runs successfully
- **WHEN** `python dev/scrape_awakening_unit_bases.py` is executed
- **THEN** the file `dev/awakening_unit_bases_raw.json` SHALL exist
- **AND** it SHALL contain at least 20 unit entries (main-story characters)
- **AND** each entry SHALL contain fields for Name, Class, Lv, HP, Str, Mag, Skl, Spd, Lck, Def, Res

#### Scenario: Skill bonuses are preserved as-is in raw output
- **WHEN** a stat value contains a skill bonus (e.g., `14+2`)
- **THEN** the raw JSON SHALL preserve the original string value including the `+` suffix
- **AND** parsing of skill bonuses SHALL be handled in the parser script, not the scraper

### Requirement: Scrape Awakening class base stats from Serenes Forest
The system SHALL provide a script `dev/scrape_awakening_class_bases.py` that fetches the class base stats table for all Awakening classes from `https://serenesforest.net/awakening/classes/base-stats/` using `pandas.read_html`. The raw scraped data SHALL be saved to `dev/awakening_class_bases_raw.json`.

#### Scenario: Class bases scraper runs successfully
- **WHEN** `python dev/scrape_awakening_class_bases.py` is executed
- **THEN** the file `dev/awakening_class_bases_raw.json` SHALL exist
- **AND** it SHALL contain entries for all base and promoted classes (Lord, Tactician, Cavalier, Knight, Myrmidon, Mercenary, Fighter, Barbarian, Archer, Thief, Pegasus Knight, Wyvern Rider, Mage, Dark Mage, Priest/Cleric, Troubadour, Taguel, Manakete, Villager, Dancer, and their promotions)
- **AND** each entry SHALL contain fields for Class, HP, Str, Mag, Skl, Spd, Def, Res, Mov

### Requirement: Compute personal base stats by subtracting class bases from visible bases
The system SHALL provide a script `dev/parse_awakening_personal_bases.py` that reads `dev/awakening_unit_bases_raw.json` and `dev/awakening_class_bases_raw.json`, subtracts each unit's class base stats from their visible base stats, and writes the computed personal bases to `dev/awakening_personal_bases.json`.

#### Scenario: Personal bases are computed for all main-story units
- **WHEN** `python dev/parse_awakening_personal_bases.py` is executed
- **THEN** the file `dev/awakening_personal_bases.json` SHALL exist
- **AND** it SHALL contain an entry for every unit currently in `data/awakening/units.json`
- **AND** each entry SHALL include the unit name, class, visible bases, class bases, and computed personal bases for HP, Str, Mag, Skl, Spd, Lck, Def, Res

#### Scenario: Skill bonuses are stripped before subtraction
- **WHEN** a visible base stat contains a `+` suffix (e.g., `14+2`)
- **THEN** the parser SHALL use only the integer portion before the `+` as the visible base (e.g., `14`)
- **AND** the skill bonus portion SHALL be ignored for personal base calculation

#### Scenario: Only Normal mode stats are used
- **WHEN** the raw data contains rows with `(H)` or `(L)` suffixes on the name
- **THEN** those rows SHALL be skipped
- **AND** only the base Normal-mode row for each character SHALL be used

#### Scenario: Taguel and Manakete use unshifted class bases
- **WHEN** a unit's class is Taguel or Manakete
- **THEN** the parser SHALL use the unshifted (starred `*`) class base row, NOT the shifted row

### Requirement: Validate personal bases do not exceed visible bases
The parser script SHALL include a validation step that confirms every computed personal base value is less than or equal to the corresponding visible base value for that stat. This invariant MUST hold because class bases are always non-negative.

#### Scenario: Validation passes for all units
- **WHEN** personal bases have been computed for all units
- **THEN** for every unit and every stat (HP, Str, Mag, Skl, Spd, Lck, Def, Res), `personal_base` SHALL be ≤ `visible_base`
- **AND** the script SHALL exit with code 0

#### Scenario: Validation detects an error
- **WHEN** any computed personal base exceeds the visible base for the same stat
- **THEN** the script SHALL print the unit name, stat, personal base, and visible base
- **AND** the script SHALL exit with a non-zero code

### Requirement: Update units.json with corrected personal base stats
After manual review of `dev/awakening_personal_bases.json`, the `stats` field of each unit in `data/awakening/units.json` SHALL be updated with the verified personal base stats.

#### Scenario: Units.json stats are updated
- **WHEN** the parser has produced `dev/awakening_personal_bases.json` and manual review is complete
- **THEN** each unit's `stats` object in `data/awakening/units.json` SHALL match the computed personal bases from the intermediary file
- **AND** the stat keys (hp, str, mag, skl, spd, lck, def, res) SHALL remain unchanged
