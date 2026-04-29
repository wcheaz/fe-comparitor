# Capability: awakening-class-skills-data

## Purpose

Defines the authoritative skill data for all Awakening classes, ensuring every playable class has accurate `classSkills` populated with game-accurate data from Serenes Forest.

## Requirements

### Requirement: All Awakening classes have accurate classSkills populated
Every Awakening class in `data/awakening/classes.json` SHALL have a `classSkills` array populated with game-accurate skill data from the Serenes Forest Awakening skills page. The format for each entry SHALL be `"Skill Name (Lv. N)"` where Skill Name matches the key in the skills data and N is the level at which the class learns the skill.

#### Scenario: Lord class has Dual Strike+ and Charm
- **WHEN** the Lord class entry is loaded from `data/awakening/classes.json`
- **THEN** `classSkills` SHALL equal `["Dual Strike+ (Lv. 1)", "Charm (Lv. 10)"]`

#### Scenario: Great Lord class has Aether and Rightful King
- **WHEN** the Great Lord class entry is loaded
- **THEN** `classSkills` SHALL equal `["Aether (Lv. 5)", "Rightful King (Lv. 15)"]`

#### Scenario: Fighter class has HP +5 and Zeal
- **WHEN** the Fighter class entry is loaded
- **THEN** `classSkills` SHALL equal `["HP +5 (Lv. 1)", "Zeal (Lv. 10)"]`

#### Scenario: Barbarian class has Despoil and Gamble
- **WHEN** the Barbarian class entry is loaded
- **THEN** `classSkills` SHALL equal `["Despoil (Lv. 1)", "Gamble (Lv. 10)"]`

#### Scenario: Archer class has Skill +2 and Prescience
- **WHEN** the Archer class entry is loaded
- **THEN** `classSkills` SHALL equal `["Skill +2 (Lv. 1)", "Prescience (Lv. 10)"]`

#### Scenario: Thief class has Locktouch and Movement +1
- **WHEN** the Thief class entry is loaded
- **THEN** `classSkills` SHALL equal `["Locktouch (Lv. 1)", "Movement +1 (Lv. 10)"]`

#### Scenario: Pegasus Knight has Speed +2 and Relief
- **WHEN** the Pegasus Knight class entry is loaded
- **THEN** `classSkills` SHALL equal `["Speed +2 (Lv. 1)", "Relief (Lv. 10)"]`

#### Scenario: Wyvern Rider has Strength +2 and Tantivy
- **WHEN** the Wyvern Rider class entry is loaded
- **THEN** `classSkills` SHALL equal `["Strength +2 (Lv. 1)", "Tantivy (Lv. 10)"]`

#### Scenario: Mage has Magic +2 and Focus
- **WHEN** the Mage class entry is loaded
- **THEN** `classSkills` SHALL equal `["Magic +2 (Lv. 1)", "Focus (Lv. 10)"]`

#### Scenario: Dark Mage has Hex and Anathema
- **WHEN** the Dark Mage class entry is loaded
- **THEN** `classSkills` SHALL equal `["Hex (Lv. 1)", "Anathema (Lv. 10)"]`

#### Scenario: Priest has Miracle and Healtouch
- **WHEN** the Priest class entry is loaded
- **THEN** `classSkills` SHALL equal `["Miracle (Lv. 1)", "Healtouch (Lv. 10)"]`

#### Scenario: Cleric has Miracle and Healtouch
- **WHEN** the Cleric class entry is loaded
- **THEN** `classSkills` SHALL equal `["Miracle (Lv. 1)", "Healtouch (Lv. 10)"]`

#### Scenario: Troubadour has Resistance +2 and Demoiselle
- **WHEN** the Troubadour class entry is loaded
- **THEN** `classSkills` SHALL equal `["Resistance +2 (Lv. 1)", "Demoiselle (Lv. 10)"]`

#### Scenario: Villager has Aptitude and Underdog
- **WHEN** the Villager class entry is loaded
- **THEN** `classSkills` SHALL equal `["Aptitude (Lv. 1)", "Underdog (Lv. 15)"]`

#### Scenario: Dancer has Luck +4 and Special Dance
- **WHEN** the Dancer class entry is loaded
- **THEN** `classSkills` SHALL equal `["Luck +4 (Lv. 1)", "Special Dance (Lv. 15)"]`

#### Scenario: Taguel has Even Rhythm and Beastbane
- **WHEN** the Taguel class entry is loaded
- **THEN** `classSkills` SHALL equal `["Even Rhythm (Lv. 1)", "Beastbane (Lv. 15)"]`

#### Scenario: Manakete has Odd Rhythm and Wyrmsbane
- **WHEN** the Manakete class entry is loaded
- **THEN** `classSkills` SHALL equal `["Odd Rhythm (Lv. 1)", "Wyrmsbane (Lv. 15)"]`

#### Scenario: Sniper has Hit Rate +20 and Bowfaire
- **WHEN** the Sniper class entry is loaded
- **THEN** `classSkills` SHALL equal `["Hit Rate +20 (Lv. 5)", "Bowfaire (Lv. 15)"]`

#### Scenario: Bow Knight has Rally Skill and Bowbreaker
- **WHEN** the Bow Knight class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Skill (Lv. 5)", "Bowbreaker (Lv. 15)"]`

#### Scenario: Assassin has Lethality and Pass
- **WHEN** the Assassin class entry is loaded
- **THEN** `classSkills` SHALL equal `["Lethality (Lv. 5)", "Pass (Lv. 15)"]`

#### Scenario: Trickster has Lucky Seven and Acrobat
- **WHEN** the Trickster class entry is loaded
- **THEN** `classSkills` SHALL equal `["Lucky Seven (Lv. 5)", "Acrobat (Lv. 15)"]`

#### Scenario: Warrior has Rally Strength and Counter
- **WHEN** the Warrior class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Strength (Lv. 5)", "Counter (Lv. 15)"]`

#### Scenario: Berserker has Wrath and Axefaire
- **WHEN** the Berserker class entry is loaded
- **THEN** `classSkills` SHALL equal `["Wrath (Lv. 5)", "Axefaire (Lv. 15)"]`

#### Scenario: Falcon Knight has Rally Speed and Lancefaire
- **WHEN** the Falcon Knight class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Speed (Lv. 5)", "Lancefaire (Lv. 15)"]`

#### Scenario: Dark Flier has Rally Movement and Galeforce
- **WHEN** the Dark Flier class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Movement (Lv. 5)", "Galeforce (Lv. 15)"]`

#### Scenario: Wyvern Lord has Quick Burn and Swordbreaker
- **WHEN** the Wyvern Lord class entry is loaded
- **THEN** `classSkills` SHALL equal `["Quick Burn (Lv. 5)", "Swordbreaker (Lv. 15)"]`

#### Scenario: Griffon Rider has Deliverer and Lancebreaker
- **WHEN** the Griffon Rider class entry is loaded
- **THEN** `classSkills` SHALL equal `["Deliverer (Lv. 5)", "Lancebreaker (Lv. 15)"]`

#### Scenario: Sage has Rally Magic and Tomefaire
- **WHEN** the Sage class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Magic (Lv. 5)", "Tomefaire (Lv. 15)"]`

#### Scenario: Sorcerer has Vengeance and Tomebreaker
- **WHEN** the Sorcerer class entry is loaded
- **THEN** `classSkills` SHALL equal `["Vengeance (Lv. 5)", "Tomebreaker (Lv. 15)"]`

#### Scenario: Dark Knight has Slow Burn and Lifetaker
- **WHEN** the Dark Knight class entry is loaded
- **THEN** `classSkills` SHALL equal `["Slow Burn (Lv. 5)", "Lifetaker (Lv. 15)"]`

#### Scenario: War Monk has Rally Luck and Renewal
- **WHEN** the War Monk class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Luck (Lv. 5)", "Renewal (Lv. 15)"]`

#### Scenario: War Cleric has Rally Luck and Renewal
- **WHEN** the War Cleric class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Luck (Lv. 5)", "Renewal (Lv. 15)"]`

#### Scenario: Valkyrie has Rally Resistance and Dual Support+
- **WHEN** the Valkyrie class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Resistance (Lv. 5)", "Dual Support+ (Lv. 15)"]`

#### Scenario: General has Rally Defense and Pavise
- **WHEN** the General class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Defense (Lv. 5)", "Pavise (Lv. 15)"]`

#### Scenario: Dread Fighter DLC class has Resistance +10 and Aggressor
- **WHEN** the Dread Fighter class entry is loaded
- **THEN** `classSkills` SHALL equal `["Resistance +10 (Lv. 1)", "Aggressor (Lv. 15)"]`

#### Scenario: Bride DLC class has Rally Heart and Bond
- **WHEN** the Bride class entry is loaded
- **THEN** `classSkills` SHALL equal `["Rally Heart (Lv. 1)", "Bond (Lv. 15)"]`

#### Scenario: Enemy-only and special classes remain with empty classSkills
- **WHEN** any of the following classes are loaded: Soldier, Merchant, Revenant, Entombed, Conqueror, Lodestar, Grima, Mirage
- **THEN** `classSkills` SHALL equal `[]`

---

### Requirement: Every skill in classSkills has a matching entry in skills data
For every skill name referenced in any Awakening class's `classSkills` array (with the `(Lv. N)` suffix stripped), there SHALL exist a corresponding entry in `data/awakening/skills.json` with a non-empty `description`.

#### Scenario: Stripped skill name resolves in skills data
- **WHEN** `"Galeforce (Lv. 15)"` is stripped to `"Galeforce"` via `getSkillByName`
- **THEN** the skill SHALL exist in `data/awakening/skills.json`
- **AND** its `description` SHALL be non-empty

#### Scenario: All class skills resolve in skills data
- **WHEN** all entries in all Awakening `classSkills` arrays are stripped of their `(Lv. N)` suffix
- **THEN** every unique skill name SHALL have a matching entry in `data/awakening/skills.json`
