## ADDED Requirements

### Requirement: All Awakening classes have accurate classAbilities populated
Every Awakening class in `data/awakening/classes.json` SHALL have a `classAbilities` array populated with game-accurate skill data from the Serenes Forest Awakening skills page. The format for each entry SHALL be `"Skill Name (Lv. N)"` where Skill Name matches the key in `lib/abilities.ts` `abilityDefinitions` and N is the level at which the class learns the skill.

#### Scenario: Lord class has Dual Strike+ and Charm
- **WHEN** the Lord class entry is loaded from `data/awakening/classes.json`
- **THEN** `classAbilities` SHALL equal `["Dual Strike+ (Lv. 1)", "Charm (Lv. 10)"]`

#### Scenario: Great Lord class has Aether and Rightful King
- **WHEN** the Great Lord class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Aether (Lv. 5)", "Rightful King (Lv. 15)"]`

#### Scenario: Fighter class has HP +5 and Zeal
- **WHEN** the Fighter class entry is loaded
- **THEN** `classAbilities` SHALL equal `["HP +5 (Lv. 1)", "Zeal (Lv. 10)"]`

#### Scenario: Barbarian class has Despoil and Gamble
- **WHEN** the Barbarian class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Despoil (Lv. 1)", "Gamble (Lv. 10)"]`

#### Scenario: Archer class has Skill +2 and Prescience
- **WHEN** the Archer class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Skill +2 (Lv. 1)", "Prescience (Lv. 10)"]`

#### Scenario: Thief class has Locktouch and Movement +1
- **WHEN** the Thief class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Locktouch (Lv. 1)", "Movement +1 (Lv. 10)"]`

#### Scenario: Pegasus Knight has Speed +2 and Relief
- **WHEN** the Pegasus Knight class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Speed +2 (Lv. 1)", "Relief (Lv. 10)"]`

#### Scenario: Wyvern Rider has Strength +2 and Tantivy
- **WHEN** the Wyvern Rider class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Strength +2 (Lv. 1)", "Tantivy (Lv. 10)"]`

#### Scenario: Mage has Magic +2 and Focus
- **WHEN** the Mage class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Magic +2 (Lv. 1)", "Focus (Lv. 10)"]`

#### Scenario: Dark Mage has Hex and Anathema
- **WHEN** the Dark Mage class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Hex (Lv. 1)", "Anathema (Lv. 10)"]`

#### Scenario: Priest has Miracle and Healtouch
- **WHEN** the Priest class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Miracle (Lv. 1)", "Healtouch (Lv. 10)"]`

#### Scenario: Cleric has Miracle and Healtouch
- **WHEN** the Cleric class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Miracle (Lv. 1)", "Healtouch (Lv. 10)"]`

#### Scenario: Troubadour has Resistance +2 and Demoiselle
- **WHEN** the Troubadour class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Resistance +2 (Lv. 1)", "Demoiselle (Lv. 10)"]`

#### Scenario: Villager has Aptitude and Underdog
- **WHEN** the Villager class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Aptitude (Lv. 1)", "Underdog (Lv. 15)"]`

#### Scenario: Dancer has Luck +4 and Special Dance
- **WHEN** the Dancer class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Luck +4 (Lv. 1)", "Special Dance (Lv. 15)"]`

#### Scenario: Taguel has Even Rhythm and Beastbane
- **WHEN** the Taguel class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Even Rhythm (Lv. 1)", "Beastbane (Lv. 15)"]`

#### Scenario: Manakete has Odd Rhythm and Wyrmsbane
- **WHEN** the Manakete class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Odd Rhythm (Lv. 1)", "Wyrmsbane (Lv. 15)"]`

#### Scenario: Sniper has Hit Rate +20 and Bowfaire
- **WHEN** the Sniper class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Hit Rate +20 (Lv. 5)", "Bowfaire (Lv. 15)"]`

#### Scenario: Bow Knight has Rally Skill and Bowbreaker
- **WHEN** the Bow Knight class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Skill (Lv. 5)", "Bowbreaker (Lv. 15)"]`

#### Scenario: Assassin has Lethality and Pass
- **WHEN** the Assassin class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Lethality (Lv. 5)", "Pass (Lv. 15)"]`

#### Scenario: Trickster has Lucky Seven and Acrobat
- **WHEN** the Trickster class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Lucky Seven (Lv. 5)", "Acrobat (Lv. 15)"]`

#### Scenario: Warrior has Rally Strength and Counter
- **WHEN** the Warrior class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Strength (Lv. 5)", "Counter (Lv. 15)"]`

#### Scenario: Berserker has Wrath and Axefaire
- **WHEN** the Berserker class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Wrath (Lv. 5)", "Axefaire (Lv. 15)"]`

#### Scenario: Falcon Knight has Rally Speed and Lancefaire
- **WHEN** the Falcon Knight class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Speed (Lv. 5)", "Lancefaire (Lv. 15)"]`

#### Scenario: Dark Flier has Rally Movement and Galeforce
- **WHEN** the Dark Flier class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Movement (Lv. 5)", "Galeforce (Lv. 15)"]`

#### Scenario: Wyvern Lord has Quick Burn and Swordbreaker
- **WHEN** the Wyvern Lord class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Quick Burn (Lv. 5)", "Swordbreaker (Lv. 15)"]`

#### Scenario: Griffon Rider has Deliverer and Lancebreaker
- **WHEN** the Griffon Rider class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Deliverer (Lv. 5)", "Lancebreaker (Lv. 15)"]`

#### Scenario: Sage has Rally Magic and Tomefaire
- **WHEN** the Sage class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Magic (Lv. 5)", "Tomefaire (Lv. 15)"]`

#### Scenario: Sorcerer has Vengeance and Tomebreaker
- **WHEN** the Sorcerer class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Vengeance (Lv. 5)", "Tomebreaker (Lv. 15)"]`

#### Scenario: Dark Knight has Slow Burn and Lifetaker
- **WHEN** the Dark Knight class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Slow Burn (Lv. 5)", "Lifetaker (Lv. 15)"]`

#### Scenario: War Monk has Rally Luck and Renewal
- **WHEN** the War Monk class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Luck (Lv. 5)", "Renewal (Lv. 15)"]`

#### Scenario: War Cleric has Rally Luck and Renewal
- **WHEN** the War Cleric class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Luck (Lv. 5)", "Renewal (Lv. 15)"]`

#### Scenario: Valkyrie has Rally Resistance and Dual Support+
- **WHEN** the Valkyrie class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Resistance (Lv. 5)", "Dual Support+ (Lv. 15)"]`

#### Scenario: General has Rally Defense and Pavise
- **WHEN** the General class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Defense (Lv. 5)", "Pavise (Lv. 15)"]`

#### Scenario: Dread Fighter DLC class has Resistance +10 and Aggressor
- **WHEN** the Dread Fighter class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Resistance +10 (Lv. 1)", "Aggressor (Lv. 15)"]`

#### Scenario: Bride DLC class has Rally Heart and Bond
- **WHEN** the Bride class entry is loaded
- **THEN** `classAbilities` SHALL equal `["Rally Heart (Lv. 1)", "Bond (Lv. 15)"]`

#### Scenario: Enemy-only and special classes remain with empty classAbilities
- **WHEN** any of the following classes are loaded: Soldier, Merchant, Revenant, Entombed, Conqueror, Lodestar, Grima, Mirage
- **THEN** `classAbilities` SHALL equal `[]`

---

### Requirement: Every skill in classAbilities has a matching abilityDefinitions entry
For every skill name referenced in any Awakening class's `classAbilities` array (with the `(Lv. N)` suffix stripped), there SHALL exist a corresponding entry in `lib/abilities.ts` `abilityDefinitions` with a non-empty `description` and an `Awakening` key in `gameSpecificDetails`.

#### Scenario: Stripped skill name resolves in abilityDefinitions
- **WHEN** `"Galeforce (Lv. 15)"` is stripped to `"Galeforce"` via `getAbilityByName`
- **THEN** `abilityDefinitions["Galeforce"]` SHALL exist
- **AND** its `description` SHALL be non-empty
- **AND** its `gameSpecificDetails.Awakening` SHALL be non-empty

#### Scenario: All 44 newly-populated class skills resolve in abilityDefinitions
- **WHEN** all entries in all Awakening `classAbilities` arrays are stripped of their `(Lv. N)` suffix
- **THEN** every unique skill name SHALL have a matching key in `abilityDefinitions`

---

### Requirement: Scraping script produces verifiable raw data
`dev/scrape_awakening_skills.py` SHALL fetch the Serenes Forest Awakening skills table, extract the "Obtainable Skills" table rows, and save them to `dev/awakening_skills_raw.json`. The raw JSON SHALL contain at minimum the fields: Skill, Effect, Activation, Class, Level for each row.

#### Scenario: Scrape script produces valid JSON with correct row count
- **WHEN** `dev/scrape_awakening_skills.py` is executed
- **THEN** `dev/awakening_skills_raw.json` SHALL be a valid JSON file
- **AND** it SHALL contain at least 50 skill entries (covering all playable classes)

---

### Requirement: Parsing script updates classes.json with skill data
`dev/parse_awakening_skills.py` SHALL read `dev/awakening_skills_raw.json` (or use the frozen mapping from design.md), match skill rows to class IDs in `data/awakening/classes.json`, and update each class's `classAbilities` field. The script SHALL validate that every class ID in the mapping exists in the JSON and SHALL error if any mapping target is missing.

#### Scenario: Parse script updates all 44 missing classes
- **WHEN** `dev/parse_awakening_skills.py` is executed
- **THEN** all 44 previously-empty Awakening classes in `data/awakening/classes.json` SHALL have non-empty `classAbilities` arrays
- **AND** the 10 already-populated classes SHALL remain unchanged
- **AND** the 8 enemy/special classes SHALL remain with empty arrays

#### Scenario: Parse script validates class IDs
- **WHEN** the parse script encounters a class ID in the mapping that does not exist in `classes.json`
- **THEN** the script SHALL exit with a non-zero exit code and print the offending class ID
