## ADDED Requirements

### Requirement: Awakening classes have correct Serenes Forest growth rates
All 17 Awakening classes that currently have all-zero `growths` in `data/awakening/classes.json` SHALL have their `growths` object populated with the correct class-only growth rate values from Serenes Forest.

#### Scenario: Archer growths populated
- **WHEN** the `archer` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 45, str: 15, mag: 0, skl: 30, spd: 15, lck: 0, def: 10, res: 5 }`

#### Scenario: Pegasus Knight growths populated
- **WHEN** the `pegasus_knight` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 40, str: 15, mag: 5, skl: 25, spd: 25, lck: 0, def: 5, res: 10 }`

#### Scenario: Warrior growths populated
- **WHEN** the `warrior` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 45, str: 25, mag: 0, skl: 20, spd: 15, lck: 0, def: 10, res: 5 }`

#### Scenario: Lord growths populated
- **WHEN** the `lord` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 40, str: 20, mag: 0, skl: 20, spd: 20, lck: 0, def: 10, res: 5 }`

#### Scenario: Wyvern Rider growths populated
- **WHEN** the `wyvern_rider` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 45, str: 30, mag: 0, skl: 15, spd: 15, lck: 0, def: 10, res: 5 }`

#### Scenario: Cleric growths populated
- **WHEN** the `cleric` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 35, str: 5, mag: 15, skl: 15, spd: 15, lck: 0, def: 5, res: 15 }`

#### Scenario: Troubadour growths populated
- **WHEN** the `troubadour` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 35, str: 0, mag: 20, skl: 10, spd: 20, lck: 0, def: 5, res: 15 }`

#### Scenario: Villager growths populated
- **WHEN** the `villager` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 35, str: 10, mag: 0, skl: 5, spd: 5, lck: 0, def: 10, res: 5 }`

#### Scenario: Dancer growths populated
- **WHEN** the `dancer` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 35, str: 5, mag: 0, skl: 25, spd: 25, lck: 0, def: 5, res: 5 }`

#### Scenario: Dark Mage growths populated
- **WHEN** the `dark_mage` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 50, str: 5, mag: 15, skl: 15, spd: 15, lck: 0, def: 10, res: 10 }`

#### Scenario: Trickster growths populated
- **WHEN** the `trickster` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 35, str: 10, mag: 15, skl: 25, spd: 20, lck: 0, def: 5, res: 10 }`

#### Scenario: Thief growths populated
- **WHEN** the `thief` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 35, str: 15, mag: 5, skl: 25, spd: 25, lck: 0, def: 5, res: 5 }`

#### Scenario: Fighter growths populated
- **WHEN** the `fighter` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 45, str: 25, mag: 0, skl: 20, spd: 15, lck: 0, def: 10, res: 5 }`

#### Scenario: Mage growths populated
- **WHEN** the `mage` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 35, str: 0, mag: 20, skl: 20, spd: 20, lck: 0, def: 5, res: 10 }`

#### Scenario: Taguel growths populated
- **WHEN** the `taguel` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 45, str: 20, mag: 0, skl: 15, spd: 15, lck: 0, def: 15, res: 5 }`

#### Scenario: Manakete growths populated
- **WHEN** the `manakete` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 50, str: 20, mag: 5, skl: 20, spd: 20, lck: 0, def: 15, res: 15 }`

#### Scenario: War Monk growths populated
- **WHEN** the `war_monk` class entry is loaded from `data/awakening/classes.json`
- **THEN** `growths` SHALL equal `{ hp: 45, str: 15, mag: 15, skl: 10, spd: 15, lck: 0, def: 10, res: 10 }`

### Requirement: No other class fields are modified
When populating growths for the 17 target classes, all other fields on each class object (`id`, `name`, `game`, `type`, `tier`, `baseStats`, `statModifiers`, `promotesTo`, `weapons`, `classAbilities`, `maxStats`, `movementType`, `description`) SHALL remain identical to their pre-edit values.

#### Scenario: Non-growth fields preserved after edit
- **WHEN** the `data/awakening/classes.json` file is read after all growth edits
- **THEN** every class entry SHALL have the same `id`, `name`, `baseStats`, `statModifiers`, and `maxStats` values as before the edit
- **AND** no new class entries SHALL exist
- **AND** no class entries SHALL be removed
