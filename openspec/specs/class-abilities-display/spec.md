## ADDED Requirements

### Requirement: Class abilities are stored per class in JSON data files
Each class entry in `data/<game>/classes.json` SHALL have a `classAbilities` field containing an array of strings. Each string represents an innate ability, special attribute, or passive bonus belonging to that class.

The field SHALL be populated according to game-accurate data. Implementers MUST consult the following reference pages when populating class abilities:
- **FE6 (Binding Blade)**: https://serenesforest.net/binding-blade/classes/introduction/
- **FE7 (Blazing Sword)**: https://serenesforest.net/blazing-sword/classes/introduction/
- **FE8 (Sacred Stones) Skills**: https://serenesforest.net/the-sacred-stones/miscellaneous/skills/
- **FE8 Class List**: https://fireemblemwiki.org/wiki/List_of_classes_in_Fire_Emblem:_The_Sacred_Stones

> **Important game context**: FE6 and FE7 do **not** have a formal "skills" system — abilities in these games are flat stat bonuses or innate movement/utility traits. FE8 introduces a proper skills system where specific classes gain activation-based skills (Great Shield, Pierce, Silencer, Slayer, Sure Strike). All are stored uniformly as strings in `classAbilities`.
>
> **FE6 vs FE7 differ**: The same class archetype (e.g., Swordmaster) has different bonus values between the two games. Always use the game-specific source.

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

> **Note on Canto**: In FE8, cavalry and flying classes have Canto. Wyvern Knight is listed separately above since it also gains Pierce. Do NOT add Canto to Infantry classes.

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
- **WHEN** a class has no special innate abilities (e.g., Cavalier, Mage)
- **THEN** `classAbilities` SHALL be an empty array `[]`

---

### Requirement: Class field is renamed from hiddenModifiers to classAbilities
The `Class` TypeScript interface in `types/unit.ts` SHALL rename the field `hiddenModifiers: string[]` to `classAbilities: string[]`. All consuming code SHALL be updated accordingly.

The data transformer in `lib/data.ts` (`transformJsonToClass`) SHALL read `rawClass.classAbilities` with a backward-compatible fallback: `rawClass.classAbilities || rawClass.hiddenModifiers || []`.

#### Scenario: TypeScript interface uses classAbilities
- **WHEN** a `Class` object is constructed
- **THEN** it SHALL have a `classAbilities` field, not `hiddenModifiers`

#### Scenario: Data transformer reads classAbilities with fallback
- **WHEN** a JSON class entry has `hiddenModifiers` (old format) but no `classAbilities`
- **THEN** the transformer SHALL still populate `classAbilities` correctly from the fallback

#### Scenario: lib/stats.ts promotion info uses classAbilities
- **WHEN** `generateProgressionArray` emits promotion info for a level
- **THEN** the promotion info object SHALL use `classAbilities` (not `hiddenModifiers`)

---

### Requirement: Class Abilities are shown in the promotion details modal
When a user clicks the ℹ️ icon next to a promotion option in the Unit Details table, the resulting modal SHALL display a "Class Abilities" section if the promoted class has a non-empty `classAbilities` array.

The section SHALL render after the "Weapons" section and before the "Description" section. Each ability SHALL be displayed as a pill/badge styled consistently with the existing weapon pills (`bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`).

#### Scenario: Promotion modal shows abilities for FE8 Bishop
- **WHEN** a unit's promotion option is Bishop in Sacred Stones
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL display a "Class Abilities" section containing a `Slayer` badge

#### Scenario: Promotion modal suppresses abilities section when empty
- **WHEN** a unit's promotion option has no class abilities (e.g., Paladin in FE6)
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL NOT render a "Class Abilities" section

#### Scenario: Promotion modal shows multiple abilities as separate pills
- **WHEN** a promoted class has multiple abilities (e.g., Assassin: Silencer, Locktouch, Steal)
- **THEN** each ability SHALL be rendered as a separate pill badge

### Requirement: Starting Skills tracking and display
The `Unit` model SHALL include an optional `startingSkills` string array. These skills SHALL be rendered in the UI using the `AbilityPill` component, similarly to `classAbilities`.

#### Scenario: Unit with starting skills
- **WHEN** an Awakening unit with starting skills (e.g. Chrom with Dual Strike) is loaded
- **THEN** `startingSkills` SHALL contain `"Dual Strike"`
- **AND** the UI components SHALL render this skill as an `AbilityPill`

### Requirement: Starting Skills tracking and display
The `Unit` model SHALL include an optional `startingSkills` string array. These skills SHALL be rendered in the UI using the `AbilityPill` component, similarly to `classAbilities`.

#### Scenario: Unit with starting skills
- **WHEN** an Awakening unit with starting skills (e.g. Chrom with Dual Strike) is loaded
- **THEN** `startingSkills` SHALL contain `"Dual Strike"`
- **AND** the UI components SHALL render this skill as an `AbilityPill`
