# Capability: per-game-abilities-data

## Purpose

Provides per-game skill data via individual JSON files, an async loader, and UI components for displaying game-scoped skill information.

## Requirements

### Requirement: Per-game skill JSON files exist for every game
Each game directory under `data/` SHALL contain a `skills.json` file. The file SHALL be a JSON array of skill objects. Each skill object SHALL contain `name` (string) and `description` (string). A skill object MAY contain `procCondition` (string) and `procChance` (string). No skill object SHALL contain a `gameSpecificDetails` field.

#### Scenario: Skills file structure for a game
- **WHEN** `data/awakening/skills.json` is loaded
- **THEN** the file parses as a JSON array where each element has `name` and `description`, and no element has `gameSpecificDetails`

#### Scenario: Game-specific description is canonical
- **WHEN** a skill differs between games (e.g., Canto in Three Houses vs Binding Blade)
- **THEN** each game's `skills.json` contains that skill with the correct game-specific `description` for that game

### Requirement: Loader returns skills scoped to a single game
`lib/skills.ts` SHALL export an async function `getSkillsByGame(game: string)` that returns a `Record<string, SkillData>` for the specified game. The function SHALL use dynamic imports (`import()`) to load `data/{game_dir}/skills.json`. Results SHALL be cached in memory so that repeated calls for the same game return the cached record without re-importing.

#### Scenario: First load for a game
- **WHEN** `getSkillsByGame("Awakening")` is called for the first time
- **THEN** the function dynamically imports `data/awakening/skills.json`, transforms the array into a `Record<string, SkillData>` keyed by `name`, caches it, and returns it

#### Scenario: Subsequent loads use cache
- **WHEN** `getSkillsByGame("Awakening")` is called again after a prior call
- **THEN** the function returns the cached record without performing a new dynamic import

#### Scenario: Game with no skills file
- **WHEN** `getSkillsByGame("SomeGame")` is called but `data/some_game/skills.json` does not exist
- **THEN** the function returns an empty `Record<string, SkillData>` (graceful degradation, no error thrown)

### Requirement: Single skill lookup by name and game
`lib/skills.ts` SHALL export an async function `getSkillByName(name: string, game: string)` that returns `SkillData | undefined`. The function SHALL strip trailing level suffixes matching the pattern `(Lv. X)` from the `name` parameter before lookup. The lookup SHALL be scoped to the specified game's skills only.

#### Scenario: Lookup with exact name
- **WHEN** `getSkillByName("Dance", "Awakening")` is called
- **THEN** the function returns the `SkillData` object for Dance from Awakening's skills

#### Scenario: Lookup with level suffix stripped
- **WHEN** `getSkillByName("Veteran (Lv. 1)", "Awakening")` is called
- **THEN** the function strips the ` (Lv. 1)` suffix, looks up "Veteran" in Awakening's skills, and returns the matching `SkillData`

#### Scenario: Skill not found in game
- **WHEN** `getSkillByName("Lethality", "The Binding Blade")` is called but Lethality is not in Binding Blade's skills
- **THEN** the function returns `undefined`

### Requirement: SkillData interface removes gameSpecificDetails
The `SkillData` TypeScript interface SHALL have fields: `name` (string), `description` (string), `procCondition?` (string), `procChance?` (string). The `gameSpecificDetails` field SHALL NOT exist on the interface.

#### Scenario: Interface shape
- **WHEN** a TypeScript file imports `SkillData` from `lib/skills`
- **THEN** the type has exactly `name`, `description`, and optional `procCondition` and `procChance`, with no `gameSpecificDetails` field

### Requirement: SkillPill resolves data via async loader
`SkillPill` SHALL accept `skill` (string) and `game` (string) props and use `getSkillByName(skill, game)` to fetch skill data asynchronously via `useState` + `useEffect`. While data is loading, the pill SHALL render the skill name as a non-clickable span (no info icon). Once data loads, if data is found, the pill SHALL render as clickable with an info icon and a modal showing `description`, `procCondition`, and `procChance`. If data is not found (`undefined`), the pill SHALL remain non-clickable. The modal subtitle SHALL display "Active" for skills with a `procChance` and "Passive" for skills without.

#### Scenario: Skill found in game
- **WHEN** SkillPill renders with `skill="Sol"` and `game="Awakening"` and the loader returns data
- **THEN** the pill displays "Sol" with an info icon, and clicking it opens a modal showing the Awakening-specific description, procCondition, and procChance

#### Scenario: Skill not found
- **WHEN** SkillPill renders with `skill="UnknownSkill"` and `game="Awakening"` and the loader returns `undefined`
- **THEN** the pill displays "UnknownSkill" as a non-clickable span with no info icon

#### Scenario: Loading state
- **WHEN** SkillPill renders and the async loader has not yet resolved
- **THEN** the pill displays the skill name as a non-clickable span (no info icon, no modal)

### Requirement: Game-to-directory mapping
The loader SHALL map game display names to directory names using the same convention as `lib/data.ts`. The mapping SHALL include at minimum: `"Awakening"` → `"awakening"`, `"The Binding Blade"` → `"binding_blade"`, `"The Blazing Blade"` → `"blazing_blade"`, `"The Sacred Stones"` → `"sacred_stones"`, `"Three Houses"` → `"three_houses"`, `"Engage"` → `"engage"`.

#### Scenario: Correct directory resolved
- **WHEN** `getSkillsByGame("The Sacred Stones")` is called
- **THEN** the loader imports from `data/sacred_stones/skills.json`

### Requirement: All existing skills are preserved with correct data
Every skill present in the current `lib/abilities.ts` `abilityDefinitions` SHALL appear in at least one game's `skills.json`. For skills with `gameSpecificDetails`, each game key in that map SHALL have a corresponding entry in that game's `skills.json` with the game-specific text as `description`. For skills without `gameSpecificDetails`, the base `description` SHALL be used.

#### Scenario: Awakening skills distributed correctly
- **WHEN** a skill in the current file has `gameSpecificDetails: { Awakening: "..." }`
- **THEN** that skill appears in `data/awakening/skills.json` with `"..."` as its `description`

#### Scenario: GBA skills with game differences
- **WHEN** Canto has different `gameSpecificDetails` for Binding Blade, Blazing Blade, Sacred Stones, and Three Houses
- **THEN** each of those games' `skills.json` contains Canto with the correct game-specific description

#### Scenario: Shared skills without game-specific details
- **WHEN** a skill like "Dance" has no `gameSpecificDetails` and appears in multiple games
- **THEN** it appears in each relevant game's `skills.json` with the base description
