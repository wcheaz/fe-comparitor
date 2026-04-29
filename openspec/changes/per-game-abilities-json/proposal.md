## Why

Abilities currently live in a single monolithic file (`lib/abilities.ts`) that mixes data from multiple games into one `abilityDefinitions` record. Most entries duplicate the base description inside `gameSpecificDetails` for no informational gain, and the few entries that genuinely differ between games (e.g., Canto, Aegis, Silencer) are awkwardly shoehorned into a `gameSpecificDetails` map. This breaks the per-game data architecture pattern already established by `classes.json` and `units.json`, makes adding a new game require editing a growing monolith, and forces cross-game merge conflicts when multiple contributors edit the same file.

## What Changes

- **BREAKING**: Replace `lib/abilities.ts` (`abilityDefinitions` + `AbilityData` with `gameSpecificDetails`) with per-game `data/{game}/abilities.json` files, one per game directory.
- Each game's `abilities.json` holds only abilities relevant to that game. The `gameSpecificDetails` map is eliminated; the `description` field becomes the authoritative game-specific description.
- **BREAKING**: `lib/abilities.ts` becomes a loader module with `getAbilityByName(name, game)` and `getAbilitiesByGame(game)`, following the same pattern as `lib/data.ts` uses for classes and units.
- `AbilityPill` already receives a `game` prop from all callers — it will pass that game to the new loader instead of doing a global lookup.
- The `AbilityData` interface changes: `gameSpecificDetails` is removed; all other fields (`name`, `description`, `procCondition`, `procChance`) remain.
- All consumers of `AbilityPill` (`ClassPill`, `ClassAbilitiesRow`, `ComparisonGrid`, `StatProgressionTable`) already pass `game` and require no prop changes, only an import path update if the interface moves.

## Capabilities

### New Capabilities
- `per-game-abilities-data`: Per-game ability JSON files and a loader layer that loads ability definitions scoped to a single game, matching the existing `classes.json`/`units.json` data architecture.

### Modified Capabilities
_(No existing specs to modify — this is the first spec for ability data.)_

## Impact

### Data Files
- **New**: `data/awakening/abilities.json`, `data/sacred_stones/abilities.json`, `data/binding_blade/abilities.json`, `data/blazing_blade/abilities.json`, `data/three_houses/abilities.json`, `data/engage/abilities.json`
- **Removed**: `lib/abilities.ts` (replaced by loader)

### Code — Loader / Data Layer
- `lib/abilities.ts` — rewritten as async loader with per-game dynamic imports (mirrors `lib/data.ts` pattern)
- `types/unit.ts` — `AbilityData` interface updated (remove `gameSpecificDetails`)

### Code — UI Components
- `components/ui/AbilityPill.tsx` — uses new `getAbilityByName(name, game)` instead of synchronous lookup; becomes async or receives pre-loaded data
- `components/ui/ClassPill.tsx` — no prop changes, already passes `game`
- `components/features/ClassAbilitiesRow.tsx` — no prop changes, already passes `game`
- `components/features/ComparisonGrid.tsx` — no prop changes, already passes `game`
- `components/features/StatProgressionTable.tsx` — no prop changes, already passes `game`

### Downstream
- No API or external dependency changes
- No route or page-level changes required
