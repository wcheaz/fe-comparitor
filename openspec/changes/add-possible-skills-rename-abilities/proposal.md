## Why

The project uses "abilities" throughout the codebase (component names, function names, data files, CSS classes, display labels), but the Fire Emblem series officially calls these "skills." This is a naming inconsistency that should be corrected for accuracy. Additionally, the Unit Details card only shows a unit's current class skills and starting skills — it does not show skills the unit could potentially learn by reclassing, which is valuable information for planning character builds, especially in games like Awakening with extensive reclassing systems.

## What Changes

- **BREAKING**: Rename all instances of "ability"/"abilities" to "skill"/"skills" across the entire codebase:
  - `AbilityData` → `SkillData` (interface)
  - `AbilityPill` → `SkillPill` (component + file rename)
  - `AbilityPillProps` → `SkillPillProps` (interface)
  - `abilityPillVariants` → `skillPillVariants` (CVA variants)
  - `ClassAbilitiesRow` → `ClassSkillsRow` (component + file rename)
  - `getAbilitiesByGame()` → `getSkillsByGame()` (function)
  - `getAbilityByName()` → `getSkillByName()` (function)
  - `abilitiesCache` → `skillsCache` (variable)
  - `abilities.json` → `skills.json` (data files, x6 games)
  - `classAbilities` → `classSkills` (field on Class interface, progression info, data transformer)
  - `pill-variant-ability-*` → `pill-variant-skill-*` (CSS classes)
  - `"Class Abilities"` → `"Class Skills"` (all display text)
  - `"Abilities"` → `"Skills"` (movement type modal label)
  - `"Ability"` → `"Skill"` (modal subtitle in SkillPill)
  - All test files updated accordingly
- Add a "Possible Skills" row to the Unit Details table in ComparisonGrid that displays all skills a unit could obtain by reclassing into any of their available `reclassOptions` classes. Skills the unit already possesses from their current class shall not be duplicated.

## Capabilities

### New Capabilities
- `possible-skills-display`: A new "Possible Skills" section in the Unit Details card that compiles and displays all skills obtainable through reclassing. For each of a unit's `reclassOptions`, the system reads that class's `classSkills` array and presents them as skill pills. Skills already present on the unit's current class are excluded to avoid duplication. Only shown for games that support reclassing (i.e., where `hasReclassing` is true or `reclassOptions` is non-empty).

### Modified Capabilities
- `per-game-abilities-data`: Renaming the entire ability data layer to skill terminology — interface names (`AbilityData` → `SkillData`), function names (`getAbilitiesByGame` → `getSkillsByGame`, `getAbilityByName` → `getSkillByName`), file names (`abilities.json` → `skills.json`), and the `AbilityPill` component (`SkillPill`). Behavior unchanged; only naming.
- `class-abilities-display`: Renaming `classAbilities` → `classSkills` in the Class interface, `ClassAbilitiesRow` → `ClassSkillsRow`, display text `"Class Abilities"` → `"Class Skills"`, and all references in ComparisonGrid, ClassPill, StatProgressionTable modals. Behavior unchanged; only naming.
- `comparison-grid`: Adding the new "Possible Skills" row to the Unit Details table, rendered after the "Starting Skills" row. This row reads `reclassOptions` from each unit and compiles skills from those classes.
- `unit-reclassing`: No spec-level behavior changes, but the data model field `reclassOptions` is consumed by the new possible-skills feature. Listed here because the possible-skills display depends on reclassing data being populated.

## Impact

- **Components**: `AbilityPill.tsx` (rename to `SkillPill.tsx`), `ClassAbilitiesRow.tsx` (rename to `ClassSkillsRow.tsx`), `ComparisonGrid.tsx`, `ClassPill.tsx`, `StatProgressionTable.tsx`, `MovementTypePill.tsx`, `PromotionOptionsDisplay.tsx`
- **Data layer**: `lib/abilities.ts` (rename to `lib/skills.ts`), `lib/data.ts`, `lib/stats.ts`, `lib/movements.ts`
- **Types**: `types/unit.ts` — `classAbilities` field rename
- **Data files**: All 6 `data/*/abilities.json` files renamed to `skills.json`
- **CSS**: `app/globals.css` — 3 CSS class name changes
- **Tests**: `__tests__/components/features/ClassAbilitiesRow.test.tsx` (rename), `__tests__/lib/stats.test.ts`, plus any other test files referencing ability-named imports
- **Specs**: `openspec/specs/per-game-abilities-data/`, `openspec/specs/class-abilities-display/`, `openspec/specs/comparison-grid/` will need delta specs
- **No external dependencies affected** — all changes are internal naming and one new UI feature
