## Context

The project stores per-game data under `data/{game}/` directories. Classes and units already follow this pattern: `data/awakening/classes.json`, `data/three_houses/units.json`, etc. The loader in `lib/data.ts` uses dynamic `import()` calls with a cache layer (`unitsCache`, `classesCache`) and exposes `getAllX()` / `getXByGame()` / `getXById()` async functions.

Abilities currently live in a single synchronous file (`lib/abilities.ts`) exporting a flat `Record<string, AbilityData>` with 80+ entries. Most entries duplicate the base `description` into `gameSpecificDetails` for the only game they appear in (Awakening). A handful of GBA-era abilities genuinely differ between games (Canto, Silencer) and use `gameSpecificDetails` correctly.

All four UI consumers of ability data already pass a `game` string prop through to `AbilityPill`:
- `ClassPill` → `<AbilityPill ability={...} game={cls.game} />`
- `ClassAbilitiesRow` → `<AbilityPill ability={...} game={unit.game} />`
- `ComparisonGrid` → `<AbilityPill ability={...} game={unit.game} />`
- `StatProgressionTable` → `<AbilityPill ability={...} game={gameId} />`

## Goals / Non-Goals

**Goals:**
- One `abilities.json` per game directory, holding only abilities that appear in that game
- Eliminate the `gameSpecificDetails` map entirely — each game's file has the correct description as its canonical `description` field
- Async loader in `lib/abilities.ts` that mirrors the existing `lib/data.ts` pattern (dynamic imports, cache, `getAbilityByName(name, game)`)
- AbilityPill resolves ability data using the new per-game loader
- All existing behavior preserved: pill renders name, info icon, modal shows description/procCondition/procChance

**Non-Goals:**
- Cross-game ability comparison UI (loading multiple game files on demand)
- Changing the string format of abilities in `classAbilities[]` or `startingSkills[]` arrays
- Changing any other centralized lib files (movements, affinities, weapons)
- Deduplication or normalization of shared ability names across games (Dance, Steal, etc. may appear identically in multiple files — this is acceptable)

## Decisions

### D1: Ability JSON file shape

Each `data/{game}/abilities.json` is an array of objects:

```json
[
  {
    "name": "Canto",
    "description": "After performing an action, the unit can use any remaining movement.",
    "procCondition": null,
    "procChance": null
  },
  {
    "name": "Silencer",
    "description": "An instant-kill attack that activates when landing a critical hit. Activation rate is halved against bosses, and 0% against the final boss.",
    "procCondition": "Critical hit must land.",
    "procChance": "Skill / 2 %"
  }
]
```

`procCondition` and `procChance` are included only when non-null — omitted keys are treated as absent by the loader.

**Rationale**: Mirrors how `classes.json` and `units.json` are structured (arrays of objects). No `game` field needed since directory position implies it.

**Alternative considered**: A `Record<string, AbilityData>` keyed by name. Rejected because arrays match the existing pattern and make it trivial to add future fields (e.g., `obtainedAt`, `skillPoints`) without key management.

### D2: Loader module (`lib/abilities.ts`)

The file is rewritten as an async loader module. Public API:

```typescript
export interface AbilityData {
  name: string;
  description: string;
  procCondition?: string;
  procChance?: string;
}

export async function getAbilitiesByGame(game: string): Promise<Record<string, AbilityData>>
export async function getAbilityByName(name: string, game: string): Promise<AbilityData | undefined>
```

Internal behavior:
- Game directory names are derived from the game display name using a mapping identical to the one used for classes/units in `lib/data.ts` (e.g., `"Awakening"` → `"awakening"`, `"The Sacred Stones"` → `"sacred_stones"`).
- Dynamic imports per game directory: `import('@/data/${dir}/abilities.json')`.
- An in-memory `Map<string, Record<string, AbilityData>>` caches loaded game ability maps.
- `getAbilityByName` strips level suffixes like `(Lv. 1)` before lookup (preserved from current `getAbilityByName`).
- If a game directory has no `abilities.json`, the loader returns an empty record (uses `.catch(() => [])` like the existing unit/class loaders).

**Rationale**: Directly mirrors the caching + dynamic-import pattern in `lib/data.ts`. The `getAbilityByName` function signature gains a `game` parameter to scope the lookup.

### D3: AbilityPill becomes async-aware

`AbilityPill` currently calls `getAbilityByName(ability)` synchronously. The new loader is async. Two options considered:

**Chosen: Parent-fetches pattern.** The parent component (ComparisonGrid, ClassPill, etc.) fetches the abilities map once via `getAbilitiesByGame(game)` and passes it down. AbilityPill receives a new optional prop `abilityMap?: Record<string, AbilityData>` and uses it for lookup. If no map is provided, it falls back to a local synchronous lookup (empty — no data).

Actually, the simplest approach that avoids restructuring every parent: **AbilityPill uses React `use` / `useState` + `useEffect` to load the ability asynchronously.**

Final decision: **AbilityPill fetches via `useEffect` + `useState`**. When `ability` and `game` are both provided, it calls `getAbilityByName(ability, game)` in a `useEffect` and stores the result in state. While loading, the pill renders without the info icon (non-clickable). Once loaded, it renders with the info icon and modal.

**Rationale**: Minimal changes to parent components. They already pass `game`. No need to thread a new `abilityMap` prop through every consumer. The load is fast (dynamic import, cached after first call).

**Alternative considered**: Parent-fetches with a shared context/provider. Rejected because ability data is lightweight and the cache in the loader module makes repeated calls essentially free. A context would add indirection without measurable benefit.

### D4: How abilities are distributed across game files

The current `abilityDefinitions` in `lib/abilities.ts` contains abilities for multiple games. Distribution rules:

- An ability that appears only in one game's classes/units → goes into that game's `abilities.json` only.
- An ability shared across games (e.g., Dance, Steal) → goes into each game's `abilities.json` with that game's specific description (which may be identical).
- The `gameSpecificDetails` values become the canonical `description` for that game's entry.
- For abilities with no `gameSpecificDetails`, the base `description` is used.

This means:
- Silencer → appears in `sacred_stones/abilities.json` with the boss-halving detail baked into description.
- Canto → appears in `binding_blade`, `blazing_blade`, `sacred_stones`, `three_houses` each with game-specific wording.
- Dance → appears in every game that has it, with the same (or game-specific) description.
- All 60+ Awakening-only abilities → appear only in `awakening/abilities.json`, with their `gameSpecificDetails["Awakening"]` value as the canonical description (eliminating the redundancy).

### D5: Removal of old code

`lib/abilities.ts` is fully rewritten. The old synchronous `abilityDefinitions` export and `AbilityData` with `gameSpecificDetails` are removed. The new file exports only the async loader functions and the new `AbilityData` interface.

## Risks / Trade-offs

- **Shared abilities are duplicated across game files** → Acceptable. Descriptions already differ in some cases (Canto, Silencer). The duplication cost is small (~60 entries for Awakening, a few dozen shared across GBA games). The benefit is clean ownership and no cross-game merge conflicts.

- **AbilityPill flicker on first render** → The pill renders non-clickable for one frame until the async data loads. Mitigated by the loader's in-memory cache — after the first load for a game, subsequent calls resolve synchronously from cache. In practice, abilities for the active game are loaded once on first pill render and cached for all subsequent pills.

- **Missing abilities.json for a game** → Loader returns empty record. Pills for that game render as non-clickable (no info icon), matching current behavior for abilities not found in the lookup. This is graceful degradation, not an error.

- **Ability name string mismatch** → The existing `getAbilityByName` strips `(Lv. X)` suffixes. This behavior is preserved. Any other mismatch (e.g., "Locktouch" vs "Lock Touch") would cause a lookup miss, which is the same behavior as today. No new risk introduced.
