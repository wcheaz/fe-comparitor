## Why

Awakening has a formal class-skill system where every class learns exactly 2 skills at specific levels — but only 10 of 54 Awakening classes have populated `classAbilities` in `data/awakening/classes.json`. The remaining 44 classes (including Lord, Archer, Fighter, Mage, Thief, and all promoted classes) have empty arrays, making the Class Abilities row and Ability Pill click-to-detail modals non-functional for the majority of the Awakening roster. Additionally, the Serenes Forest skills page provides the canonical skill names, descriptions, and proc rates for all classes including DLC (Dread Fighter, Bride) and special classes (Taguel, Manakete, Dancer, Villager).

## What Changes

- Populate `classAbilities` for all 44 Awakening classes currently missing skill data, using the format `"Skill Name (Lv. N)"` consistent with the 10 already-populated classes.
- Add missing ability definitions to `lib/abilities.ts` for any Awakening skills not already present in `abilityDefinitions` (primarily: ensuring descriptions and proc rates from Serenes Forest are captured).
- The skill-to-class mapping is fully deterministic from the Serenes Forest skills table — no design ambiguity exists.

## Capabilities

### New Capabilities

- `awakening-class-skills-data`: Populate `classAbilities` for all 54 Awakening classes in `data/awakening/classes.json` with game-accurate skill data from Serenes Forest, and ensure every referenced skill has a complete entry in `lib/abilities.ts` including proc condition and proc chance.

### Modified Capabilities

- `class-abilities-display`: Extend the existing spec to include Awakening-specific scenarios verifying that all 54 classes render their correct skills, and that DLC/special class skills (Dread Fighter, Bride, Taguel, Manakete, Dancer, Villager) display correctly.

## Impact

- **Data files**: `data/awakening/classes.json` — 44 class entries gain non-empty `classAbilities` arrays.
- **TypeScript**: `lib/abilities.ts` — additions to `abilityDefinitions` for any missing skill entries.
- **UI components**: `AbilityPill`, `ClassAbilitiesRow`, `ComparisonGrid` — no code changes needed; they already render `classAbilities` when populated and look up definitions via `getAbilityByName`.
- **No breaking changes**: The `classAbilities` field already exists on all classes. Empty arrays become populated arrays. The UI already handles non-empty arrays.

## Scope boundaries

### In scope (first rollout)
- Populating `classAbilities` for all 54 standard, promoted, DLC, and special Awakening classes.
- Adding or updating ability definitions in `lib/abilities.ts` for every Awakening class skill.
- Scraping script (`dev/scrape_awakening_skills.py` and `dev/parse_awakening_skills.py`) to produce the data, following the project's established scraping pattern.

### Out of scope
- Enemy-only skills (Dragonskin, Vantage+, Luna+, Hawkeye, Pavise+, Aegis+, Rightful God, Hit Rate +10). These are not learnable by player classes and do not belong in `classAbilities`.
- Character-exclusive skills that are not tied to a class (Shadowgift, Conquest, All Stats +2, Paragon, Iote's Shield, Limit Breaker, Outrealm Skill). These are learned via items or are character-locked.
- Changes to `startingSkills` on units — already populated.
- UI component changes — existing components already handle populated `classAbilities`.

### Deferred
- None. This change is self-contained.
