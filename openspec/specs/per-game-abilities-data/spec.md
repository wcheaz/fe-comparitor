# Capability: per-game-abilities-data

## Purpose

Provides per-game ability data via individual JSON files, an async loader, and UI components for displaying game-scoped ability information.

## Requirements

### Requirement: Per-game ability JSON files exist for every game
Each game directory under `data/` SHALL contain an `abilities.json` file. The file SHALL be a JSON array of ability objects. Each ability object SHALL contain `name` (string) and `description` (string). An ability object MAY contain `procCondition` (string) and `procChance` (string). No ability object SHALL contain a `gameSpecificDetails` field.

#### Scenario: Abilities file structure for a game
- **WHEN** `data/awakening/abilities.json` is loaded
- **THEN** the file parses as a JSON array where each element has `name` and `description`, and no element has `gameSpecificDetails`

#### Scenario: Game-specific description is canonical
- **WHEN** an ability differs between games (e.g., Canto in Three Houses vs Binding Blade)
- **THEN** each game's `abilities.json` contains that ability with the correct game-specific `description` for that game

### Requirement: Loader returns abilities scoped to a single game
`lib/abilities.ts` SHALL export an async function `getAbilitiesByGame(game: string)` that returns a `Record<string, AbilityData>` for the specified game. The function SHALL use dynamic imports (`import()`) to load `data/{game_dir}/abilities.json`. Results SHALL be cached in memory so that repeated calls for the same game return the cached record without re-importing.

#### Scenario: First load for a game
- **WHEN** `getAbilitiesByGame("Awakening")` is called for the first time
- **THEN** the function dynamically imports `data/awakening/abilities.json`, transforms the array into a `Record<string, AbilityData>` keyed by `name`, caches it, and returns it

#### Scenario: Subsequent loads use cache
- **WHEN** `getAbilitiesByGame("Awakening")` is called again after a prior call
- **THEN** the function returns the cached record without performing a new dynamic import

#### Scenario: Game with no abilities file
- **WHEN** `getAbilitiesByGame("SomeGame")` is called but `data/some_game/abilities.json` does not exist
- **THEN** the function returns an empty `Record<string, AbilityData>` (graceful degradation, no error thrown)

### Requirement: Single ability lookup by name and game
`lib/abilities.ts` SHALL export an async function `getAbilityByName(name: string, game: string)` that returns `AbilityData | undefined`. The function SHALL strip trailing level suffixes matching the pattern `(Lv. X)` from the `name` parameter before lookup. The lookup SHALL be scoped to the specified game's abilities only.

#### Scenario: Lookup with exact name
- **WHEN** `getAbilityByName("Dance", "Awakening")` is called
- **THEN** the function returns the `AbilityData` object for Dance from Awakening's abilities

#### Scenario: Lookup with level suffix stripped
- **WHEN** `getAbilityByName("Veteran (Lv. 1)", "Awakening")` is called
- **THEN** the function strips the ` (Lv. 1)` suffix, looks up "Veteran" in Awakening's abilities, and returns the matching `AbilityData`

#### Scenario: Ability not found in game
- **WHEN** `getAbilityByName("Lethality", "The Binding Blade")` is called but Lethality is not in Binding Blade's abilities
- **THEN** the function returns `undefined`

### Requirement: AbilityData interface removes gameSpecificDetails
The `AbilityData` TypeScript interface SHALL have fields: `name` (string), `description` (string), `procCondition?` (string), `procChance?` (string). The `gameSpecificDetails` field SHALL NOT exist on the interface.

#### Scenario: Interface shape
- **WHEN** a TypeScript file imports `AbilityData` from `lib/abilities`
- **THEN** the type has exactly `name`, `description`, and optional `procCondition` and `procChance`, with no `gameSpecificDetails` field

### Requirement: AbilityPill resolves data via async loader
`AbilityPill` SHALL accept `ability` (string) and `game` (string) props and use `getAbilityByName(ability, game)` to fetch ability data asynchronously via `useState` + `useEffect`. While data is loading, the pill SHALL render the ability name as a non-clickable span (no info icon). Once data loads, if data is found, the pill SHALL render as clickable with an info icon and a modal showing `description`, `procCondition`, and `procChance`. If data is not found (`undefined`), the pill SHALL remain non-clickable.

#### Scenario: Ability found in game
- **WHEN** AbilityPill renders with `ability="Sol"` and `game="Awakening"` and the loader returns data
- **THEN** the pill displays "Sol" with an info icon, and clicking it opens a modal showing the Awakening-specific description, procCondition, and procChance

#### Scenario: Ability not found
- **WHEN** AbilityPill renders with `ability="UnknownAbility"` and `game="Awakening"` and the loader returns `undefined`
- **THEN** the pill displays "UnknownAbility" as a non-clickable span with no info icon

#### Scenario: Loading state
- **WHEN** AbilityPill renders and the async loader has not yet resolved
- **THEN** the pill displays the ability name as a non-clickable span (no info icon, no modal)

### Requirement: Game-to-directory mapping
The loader SHALL map game display names to directory names using the same convention as `lib/data.ts`. The mapping SHALL include at minimum: `"Awakening"` → `"awakening"`, `"The Binding Blade"` → `"binding_blade"`, `"The Blazing Blade"` → `"blazing_blade"`, `"The Sacred Stones"` → `"sacred_stones"`, `"Three Houses"` → `"three_houses"`, `"Engage"` → `"engage"`.

#### Scenario: Correct directory resolved
- **WHEN** `getAbilitiesByGame("The Sacred Stones")` is called
- **THEN** the loader imports from `data/sacred_stones/abilities.json`

### Requirement: All existing abilities are preserved with correct data
Every ability present in the current `lib/abilities.ts` `abilityDefinitions` SHALL appear in at least one game's `abilities.json`. For abilities with `gameSpecificDetails`, each game key in that map SHALL have a corresponding entry in that game's `abilities.json` with the game-specific text as `description`. For abilities without `gameSpecificDetails`, the base `description` SHALL be used.

#### Scenario: Awakening abilities distributed correctly
- **WHEN** an ability in the current file has `gameSpecificDetails: { Awakening: "..." }`
- **THEN** that ability appears in `data/awakening/abilities.json` with `"..."` as its `description`

#### Scenario: GBA abilities with game differences
- **WHEN** Canto has different `gameSpecificDetails` for Binding Blade, Blazing Blade, Sacred Stones, and Three Houses
- **THEN** each of those games' `abilities.json` contains Canto with the correct game-specific description

#### Scenario: Shared abilities without game-specific details
- **WHEN** an ability like "Dance" has no `gameSpecificDetails` and appears in multiple games
- **THEN** it appears in each relevant game's `abilities.json` with the base description
