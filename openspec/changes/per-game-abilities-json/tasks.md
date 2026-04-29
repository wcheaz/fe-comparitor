## 1. Create per-game abilities JSON data files

Extract all abilities from the current `lib/abilities.ts` `abilityDefinitions` into per-game `data/{game}/abilities.json` files. Distribution follows design decision D4: abilities with `gameSpecificDetails` are split into each game's file using the game-specific text as the canonical `description`; abilities without `gameSpecificDetails` use the base description and appear in every game where they are relevant.

Each file is a JSON array of objects with `name`, `description`, and optional `procCondition`/`procChance`. No `gameSpecificDetails` field. `procCondition` and `procChance` are omitted when null/absent.

Games to create: `awakening`, `sacred_stones`, `binding_blade`, `blazing_blade`, `three_houses`, `engage`.

- [ ] 1.1 Create all six `data/{game}/abilities.json` files with correctly distributed ability data extracted from the current `lib/abilities.ts`
  - Done when: each file is valid JSON (array of objects), every ability in the current `abilityDefinitions` appears in at least one game's file, no `gameSpecificDetails` field exists in any entry, `procCondition`/`procChance` are omitted when absent
  - Verify by: comparing ability counts — all 60+ Awakening abilities in `awakening/abilities.json`, GBA-era shared abilities (Canto, etc.) in each relevant game's file with game-specific descriptions, game-neutral abilities (Dance, Steal, Lockpick) in each game that uses them
  - Stop and hand off if: an ability in the current file cannot be attributed to any specific game (no `gameSpecificDetails` and no clear game association from classes/units data)

## 2. Rewrite lib/abilities.ts as async loader module

Replace the current synchronous `abilityDefinitions` export and `getAbilityByName` function with an async loader module mirroring the pattern in `lib/data.ts`. Export new `AbilityData` interface (no `gameSpecificDetails`), `getAbilitiesByGame(game)`, and `getAbilityByName(name, game)`. Include in-memory cache (`Map<string, Record<string, AbilityData>>`), game-to-directory mapping, dynamic imports, and level-suffix stripping.

- [ ] 2.1 Rewrite `lib/abilities.ts` with the new async loader API, removing all old synchronous exports
  - Done when: `getAbilitiesByGame` and `getAbilityByName` are exported as async functions, `AbilityData` has `name`/`description`/optional `procCondition`/optional `procChance` (no `gameSpecificDetails`), game-to-dir mapping covers all 6 games, cache prevents re-imports, `getAbilityByName` strips `(Lv. X)` suffixes, missing game files return empty record
  - Verify by: `npx tsc --noEmit` passes with no errors referencing old exports or `gameSpecificDetails`
  - Stop and hand off if: TypeScript compilation reveals consumers of the old synchronous API that cannot be trivially updated (i.e., callers outside the known components)

## 3. Update AbilityPill to use async loader

Convert `AbilityPill` from synchronous `getAbilityByName(ability)` to async lookup via `useState` + `useEffect` calling the new `getAbilityByName(ability, game)`. While loading, render the ability name as a non-clickable span. Once loaded with data, render as clickable with info icon and modal. If data is `undefined`, remain non-clickable. Remove the `gameSpecificDetails` rendering from the modal — the modal now shows only `description`, `procCondition`, and `procChance` from the game-scoped data.

- [ ] 3.1 Update `components/ui/AbilityPill.tsx` to fetch ability data asynchronously using the new loader
  - Done when: AbilityPill calls `getAbilityByName(ability, game)` in a `useEffect`, renders non-clickable while loading, renders clickable with info icon and modal when data is found, renders non-clickable when data is `undefined`, modal shows only `description`/`procCondition`/`procChance` (no `gameSpecificDetails` block), TypeScript compiles cleanly
  - Verify by: `npx tsc --noEmit` passes, `npm run build` succeeds, and no import of `gameSpecificDetails` exists in the file
  - Stop and hand off if: the async loading causes visible rendering issues (flicker, layout shift) that cannot be resolved within this task

## 4. Build and verify

Run the full build to confirm no regressions across the data layer, loader, and UI components. Verify that the old `abilityDefinitions` export and `gameSpecificDetails` field are fully removed from the codebase.

- [ ] 4.1 Run build and lint, confirm no references to removed exports remain
  - Done when: `npm run build` succeeds with no errors, `npm run lint` passes, `grep -r "gameSpecificDetails" --include="*.ts" --include="*.tsx"` returns zero results, `grep -r "abilityDefinitions" --include="*.ts" --include="*.tsx"` returns zero results
  - Verify by: running `npm run build && npm run lint && grep -r "gameSpecificDetails\|abilityDefinitions" --include="*.ts" --include="*.tsx"` and confirming clean output
  - Stop and hand off if: build errors reveal consumers of the old API not identified in the proposal
