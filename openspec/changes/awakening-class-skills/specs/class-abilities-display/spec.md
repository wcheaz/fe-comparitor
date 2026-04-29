## MODIFIED Requirements

### Requirement: Class abilities are stored per class in JSON data files
Each class entry in `data/<game>/classes.json` SHALL have a `classAbilities` field containing an array of strings. Each string represents an innate ability, special attribute, or passive bonus belonging to that class.

The field SHALL be populated according to game-accurate data. Implementers MUST consult the following reference pages when populating class abilities:
- **FE6 (Binding Blade)**: https://serenesforest.net/binding-blade/classes/introduction/
- **FE7 (Blazing Sword)**: https://serenesforest.net/blazing-sword/classes/introduction/
- **FE8 (Sacred Stones) Skills**: https://serenesforest.net/the-sacred-stones/miscellaneous/skills/
- **FE8 Class List**: https://fireemblemwiki.org/wiki/List_of_classes_in_Fire_Emblem:_The_Sacred_Stones
- **Awakening Skills**: https://serenesforest.net/awakening/miscellaneous/skills/

> **Important game context**: FE6 and FE7 do **not** have a formal "skills" system — abilities in these games are flat stat bonuses or innate movement/utility traits. FE8 introduces a proper skills system where specific classes gain activation-based skills (Great Shield, Pierce, Silencer, Slayer, Sure Strike). Awakening has a comprehensive class-skill system where every playable class learns exactly 2 skills at specific levels, stored as `"Skill Name (Lv. N)"`. All are stored uniformly as strings in `classAbilities`.

**Authoritative `classAbilities` values by game:**

**Binding Blade (FE6):**

| Class | `classAbilities` |
|-------|-----------------|
| Swordmaster (M/F) | `["+30 Crit"]` |
| Berserker | `["+30 Crit", "Water Walk"]` |
| Sniper (M/F) | `["+15 Crit"]` |
| Thief (M/F) | `["Locktouch", "Steal"]` |
| Assassin | `["Silencer", "Locktouch", "Steal"]` |
| Pirate | `["Water Walk"]` |
| Brigand | `["Mountain Walk"]` |
| Dancer | `["Dance"]` |
| Bard | `["Play"]` |

**Blazing Sword (FE7):**

| Class | `classAbilities` |
|-------|-----------------|
| Swordmaster (M/F) | `["+15 Crit"]` |
| Berserker | `["+15 Crit", "Water Walk"]` |
| Sniper (M/F) | `["+15 Crit"]` |
| Thief (M/F) | `["Locktouch", "Steal"]` |
| Assassin | `["Silencer", "Locktouch", "Steal"]` |
| Pirate | `["Water Walk"]` |
| Corsair | `["Water Walk"]` |
| Brigand | `["Mountain Walk"]` |
| Dancer | `["Dance"]` |
| Bard | `["Play"]` |

**Sacred Stones (FE8):**

| Class | `classAbilities` |
|-------|-----------------|
| Swordmaster (M/F) | `["+15 Crit"]` |
| Sniper (M/F) | `["Sure Strike"]` |
| Berserker | `["+15 Crit", "Water Walk"]` |
| Assassin (M/F) | `["Silencer", "Locktouch", "Steal"]` |
| Thief | `["Locktouch", "Steal"]` |
| Rogue | `["Pick", "Steal"]` |
| General (M/F) | `["Great Shield"]` |
| Wyvern Knight | `["Pierce", "Canto"]` |
| Bishop (M/F) | `["Slayer"]` |
| Summoner (M/F) | `["Summon"]` |
| Dancer | `["Dance"]` |
| Pirate | `["Water Walk"]` |
| Brigand | `["Mountain Walk"]` |
| Journeyman (tier 2) | `["+15 Crit"]` |
| Recruit (tier 2) | `["+15 Crit"]` |
| Pupil (tier 2) | `["All Magic Types"]` |
| Paladin (M/F) | `["Canto"]` |
| Great Knight (M/F) | `["Canto"]` |
| Mage Knight (M/F) | `["Canto"]` |
| Valkyrie | `["Canto"]` |
| Ranger (M/F) | `["Canto"]` |
| Falcoknight | `["Canto"]` |
| Wyvern Lord | `["Canto"]` |

**Awakening (FE13):**

All 46 playable Awakening classes SHALL have `classAbilities` populated with exactly 2 skills in `"Skill Name (Lv. N)"` format. The complete mapping is frozen in `openspec/changes/awakening-class-skills/design.md`. Eight enemy/special-only classes (Soldier, Merchant, Revenant, Entombed, Conqueror, Lodestar, Grima, Mirage) SHALL have empty arrays.

#### Scenario: Awakening Lord has Dual Strike+ and Charm
- **WHEN** the Awakening Lord class is loaded
- **THEN** its `classAbilities` SHALL equal `["Dual Strike+ (Lv. 1)", "Charm (Lv. 10)"]`

#### Scenario: Awakening Dark Flier has Rally Movement and Galeforce
- **WHEN** the Awakening Dark Flier class is loaded
- **THEN** its `classAbilities` SHALL equal `["Rally Movement (Lv. 5)", "Galeforce (Lv. 15)"]`

#### Scenario: Awakening Dread Fighter DLC has Resistance +10 and Aggressor
- **WHEN** the Awakening Dread Fighter class is loaded
- **THEN** its `classAbilities` SHALL equal `["Resistance +10 (Lv. 1)", "Aggressor (Lv. 15)"]`

#### Scenario: Awakening enemy-only Soldier has empty classAbilities
- **WHEN** the Awakening Soldier class is loaded
- **THEN** its `classAbilities` SHALL equal `[]`

#### Scenario: FE6 Swordmaster has +30 Crit
- **WHEN** the Binding Blade Swordmaster class is loaded
- **THEN** its `classAbilities` SHALL equal `["+30 Crit"]`

#### Scenario: FE7 Swordmaster has only +15 Crit, not +30
- **WHEN** the Blazing Sword Swordmaster class is loaded
- **THEN** its `classAbilities` SHALL equal `["+15 Crit"]`

#### Scenario: FE8 Bishop has Slayer
- **WHEN** a Sacred Stones Bishop class is loaded
- **THEN** its `classAbilities` SHALL contain `"Slayer"`

#### Scenario: FE8 Thief can Steal and open locks
- **WHEN** the Sacred Stones Thief class is loaded
- **THEN** its `classAbilities` SHALL contain `"Locktouch"` and `"Steal"`

#### Scenario: FE8 Rogue can Pick and Steal but does not have Silencer
- **WHEN** the Sacred Stones Rogue class is loaded
- **THEN** its `classAbilities` SHALL contain `"Pick"` and `"Steal"`
- **AND** it SHALL NOT contain `"Silencer"`

#### Scenario: FE8 Wyvern Knight has Pierce, not Ranger
- **WHEN** the Sacred Stones Wyvern Knight class is loaded
- **THEN** its `classAbilities` SHALL contain `"Pierce"` and `"Canto"`

#### Scenario: FE8 Sniper has Sure Strike
- **WHEN** the Sacred Stones Sniper class is loaded
- **THEN** its `classAbilities` SHALL contain `"Sure Strike"`

#### Scenario: FE8 Berserker has +15 Crit and Water Walk
- **WHEN** the Sacred Stones Berserker class is loaded
- **THEN** its `classAbilities` SHALL equal `["+15 Crit", "Water Walk"]`

#### Scenario: FE8 Summoner has Summon ability
- **WHEN** the Sacred Stones Summoner class is loaded
- **THEN** its `classAbilities` SHALL contain `"Summon"`

#### Scenario: Classes with no innate abilities have an empty array
- **WHEN** a class has no special innate abilities (e.g., Awakening Soldier, FE6 Cavalier)
- **THEN** `classAbilities` SHALL be an empty array `[]`
