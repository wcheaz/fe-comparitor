# Capability: class-abilities-display

## Purpose

Defines how class skills are stored in data files, rendered in UI components, and displayed in modals and the comparison grid.

## Requirements

### Requirement: Class skills are stored per class in JSON data files
Each class entry in `data/<game>/classes.json` SHALL have a `classSkills` field containing an array of strings. Each string represents an innate skill, special attribute, or passive bonus belonging to that class.

The field SHALL be populated according to game-accurate data. Implementers MUST consult the following reference pages when populating class skills:
- **FE6 (Binding Blade)**: https://serenesforest.net/binding-blade/classes/introduction/
- **FE7 (Blazing Sword)**: https://serenesforest.net/blazing-sword/classes/introduction/
- **FE8 (Sacred Stones) Skills**: https://serenesforest.net/the-sacred-stones/miscellaneous/skills/
- **FE8 Class List**: https://fireemblemwiki.org/wiki/List_of_classes_in_Fire_Emblem:_The_Sacred_Stones
- **Awakening Skills**: https://serenesforest.net/awakening/miscellaneous/skills/

> **Important game context**: FE6 and FE7 do **not** have a formal "skills" system — skills in these games are flat stat bonuses or innate movement/utility traits. FE8 introduces a proper skills system where specific classes gain activation-based skills (Great Shield, Pierce, Silencer, Slayer, Sure Strike). Awakening has a comprehensive class-skill system where every playable class learns exactly 2 skills at specific levels, stored as `"Skill Name (Lv. N)"`. All are stored uniformly as strings in `classSkills`.
>
> **FE6 vs FE7 differ**: The same class archetype (e.g., Swordmaster) has different bonus values between the two games. Always use the game-specific source.

**Authoritative `classSkills` values by game:**

**Binding Blade (FE6):**

| Class | `classSkills` |
|-------|----------------|
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

| Class | `classSkills` |
|-------|----------------|
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

| Class | `classSkills` |
|-------|----------------|
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

All 46 playable Awakening classes SHALL have `classSkills` populated with exactly 2 skills in `"Skill Name (Lv. N)"` format. The complete mapping is defined in `openspec/specs/awakening-class-skills-data/spec.md`. Eight enemy/special-only classes (Soldier, Merchant, Revenant, Entombed, Conqueror, Lodestar, Grima, Mirage) SHALL have empty arrays.

> **Note on Canto**: In FE8, cavalry and flying classes have Canto. Wyvern Knight is listed separately above since it also gains Pierce. Do NOT add Canto to Infantry classes.

#### Scenario: FE6 Swordmaster has +30 Crit
- **WHEN** the Binding Blade Swordmaster class is loaded
- **THEN** its `classSkills` SHALL equal `["+30 Crit"]`

#### Scenario: FE7 Swordmaster has only +15 Crit, not +30
- **WHEN** the Blazing Sword Swordmaster class is loaded
- **THEN** its `classSkills` SHALL equal `["+15 Crit"]`

#### Scenario: FE8 Bishop has Slayer
- **WHEN** a Sacred Stones Bishop class is loaded
- **THEN** its `classSkills` SHALL contain `"Slayer"`

#### Scenario: FE8 Thief can Steal and open locks
- **WHEN** the Sacred Stones Thief class is loaded
- **THEN** its `classSkills` SHALL contain `"Locktouch"` and `"Steal"`

#### Scenario: FE8 Rogue can Pick and Steal but does not have Silencer
- **WHEN** the Sacred Stones Rogue class is loaded
- **THEN** its `classSkills` SHALL contain `"Pick"` and `"Steal"`
- **AND** it SHALL NOT contain `"Silencer"`

#### Scenario: FE8 Wyvern Knight has Pierce, not Ranger
- **WHEN** the Sacred Stones Wyvern Knight class is loaded
- **THEN** its `classSkills` SHALL contain `"Pierce"` and `"Canto"`

#### Scenario: FE8 Sniper has Sure Strike
- **WHEN** the Sacred Stones Sniper class is loaded
- **THEN** its `classSkills` SHALL contain `"Sure Strike"`

#### Scenario: FE8 Berserker has +15 Crit and Water Walk
- **WHEN** the Sacred Stones Berserker class is loaded
- **THEN** its `classSkills` SHALL equal `["+15 Crit", "Water Walk"]`

#### Scenario: FE8 Summoner has Summon skill
- **WHEN** the Sacred Stones Summoner class is loaded
- **THEN** its `classSkills` SHALL contain `"Summon"`

#### Scenario: Awakening Lord has Dual Strike+ and Charm
- **WHEN** the Awakening Lord class is loaded
- **THEN** its `classSkills` SHALL equal `["Dual Strike+ (Lv. 1)", "Charm (Lv. 10)"]`

#### Scenario: Awakening Dark Flier has Rally Movement and Galeforce
- **WHEN** the Awakening Dark Flier class is loaded
- **THEN** its `classSkills` SHALL equal `["Rally Movement (Lv. 5)", "Galeforce (Lv. 15)"]`

#### Scenario: Awakening Dread Fighter DLC has Resistance +10 and Aggressor
- **WHEN** the Awakening Dread Fighter class is loaded
- **THEN** its `classSkills` SHALL equal `["Resistance +10 (Lv. 1)", "Aggressor (Lv. 15)"]`

#### Scenario: Awakening enemy-only Soldier has empty classSkills
- **WHEN** the Awakening Soldier class is loaded
- **THEN** its `classSkills` SHALL equal `[]`

#### Scenario: Classes with no innate skills have an empty array
- **WHEN** a class has no special innate skills (e.g., Awakening Soldier, FE6 Cavalier)
- **THEN** `classSkills` SHALL be an empty array `[]`

---

### Requirement: Class field is classSkills
The `Class` TypeScript interface in `types/unit.ts` SHALL have a field `classSkills: string[]`. All consuming code SHALL use `classSkills`.

The data transformer in `lib/data.ts` (`transformJsonToClass`) SHALL read `rawClass.classSkills` with a backward-compatible fallback: `rawClass.classSkills || rawClass.classAbilities || rawClass.hiddenModifiers || []`.

#### Scenario: TypeScript interface uses classSkills
- **WHEN** a `Class` object is constructed
- **THEN** it SHALL have a `classSkills` field, not `classAbilities` or `hiddenModifiers`

#### Scenario: Data transformer reads classSkills with fallback
- **WHEN** a JSON class entry has `classAbilities` (old format) but no `classSkills`
- **THEN** the transformer SHALL still populate `classSkills` correctly from the fallback

#### Scenario: lib/stats.ts promotion info uses classSkills
- **WHEN** `generateProgressionArray` emits promotion info for a level
- **THEN** the promotion info object SHALL use `classSkills` (not `classAbilities` or `hiddenModifiers`)

---

### Requirement: Class Skills are shown in the promotion details modal
When a user clicks the ℹ️ icon next to a promotion option in the Unit Details table, the resulting modal SHALL display a "Class Skills" section if the promoted class has a non-empty `classSkills` array.

The section SHALL render after the "Weapons" section and before the "Description" section. Each skill SHALL be displayed as a `SkillPill` component.

#### Scenario: Promotion modal shows skills for FE8 Bishop
- **WHEN** a unit's promotion option is Bishop in Sacred Stones
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL display a "Class Skills" section containing a `Slayer` SkillPill

#### Scenario: Promotion modal suppresses skills section when empty
- **WHEN** a unit's promotion option has no class skills (e.g., Paladin in FE6)
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL NOT render a "Class Skills" section

#### Scenario: Promotion modal shows multiple skills as separate pills
- **WHEN** a promoted class has multiple skills (e.g., Assassin: Silencer, Locktouch, Steal)
- **THEN** each skill SHALL be rendered as a separate `SkillPill`

### Requirement: Starting Skills tracking and display
The `Unit` model SHALL include an optional `startingSkills` string array. These skills SHALL be rendered in the UI using the `SkillPill` component, similarly to `classSkills`.

#### Scenario: Unit with starting skills
- **WHEN** an Awakening unit with starting skills (e.g. Chrom with Dual Strike) is loaded
- **THEN** `startingSkills` SHALL contain `"Dual Strike"`
- **AND** the UI components SHALL render this skill as a `SkillPill`

### Requirement: ClassSkillsRow component renders current class skills
The `ClassSkillsRow` component SHALL accept `unit` (Unit), `classes` (Class[]), and optional `className` props. It SHALL find the unit's current class in the classes array, read its `classSkills`, and render each as a `SkillPill`. The display text SHALL read "Class Skills". If the class has no skills, the component SHALL render nothing.

#### Scenario: ClassSkillsRow renders skills for unit with class skills
- **WHEN** a unit's class has `classSkills: ["Sol", "Luna"]`
- **THEN** the component renders a "Class Skills" label and two SkillPills for "Sol" and "Luna"

#### Scenario: ClassSkillsRow renders nothing for unit without class skills
- **WHEN** a unit's class has `classSkills: []`
- **THEN** the component renders nothing (returns null)
