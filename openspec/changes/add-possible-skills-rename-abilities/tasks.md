## 1. Rename Types and Data Layer

Rename all "ability"/"abilities" identifiers to "skill"/"skills" in the type definitions, data loader, data files, and data transformer. This is the foundation — all downstream component renames depend on this.

- [x] 1.1 Rename `AbilityData` to `SkillData`, `abilitiesCache` to `skillsCache`, `getAbilitiesByGame` to `getSkillsByGame`, `getAbilityByName` to `getSkillByName` in `lib/abilities.ts`. Update the dynamic import path from `abilities.json` to `skills.json`. Then rename the file itself from `lib/abilities.ts` to `lib/skills.ts`. Update all imports across the codebase that reference `@/lib/abilities`.
  - Done when: `npx tsc --noEmit` passes with no errors referencing old names. `grep -ri "getAbilitiesByGame\|getAbilityByName\|AbilityData\|abilitiesCache" --include="*.ts" --include="*.tsx"` returns zero results.
  - Stop and hand off if: TypeScript reports errors that cannot be resolved by updating imports alone.

- [x] 1.2 Rename all 6 data files `data/*/abilities.json` to `data/*/skills.json` (awakening, binding_blade, blazing_blade, sacred_stones, three_houses, engage). No content changes — only file names.
  - Done when: `ls data/*/skills.json` lists 6 files. `ls data/*/abilities.json` returns nothing. `npm test` passes.

- [x] 1.3 Rename `classAbilities` to `classSkills` in `types/unit.ts` Class interface. Update `lib/data.ts` transformer to read `rawClass.classSkills` with fallback: `rawClass.classSkills || rawClass.classAbilities || rawClass.hiddenModifiers || []`. Update all references to `classAbilities` in `lib/stats.ts` (progression info, promotion info).
  - Done when: `npx tsc --noEmit` passes. `grep -ri "classAbilities" --include="*.ts" --include="*.tsx"` returns zero results (except the fallback in the transformer).

## 2. Rename UI Components

Rename the pill component and the class skills row component, including all internal identifiers, CSS classes, and display text.

- [x] 2.1 Rename `components/ui/AbilityPill.tsx` to `components/ui/SkillPill.tsx`. Inside: rename `AbilityPillProps` to `SkillPillProps`, `abilityPillVariants` to `skillPillVariants`, `ability` prop to `skill`, all internal state variables from `abilityData`/`ability` to `skillData`/`skill`. Change CVA variant names from `pill-variant-ability-*` to `pill-variant-skill-*`. Change modal subtitle from `"Ability"` to `"Skill"`. Update all imports across the codebase from `AbilityPill` to `SkillPill`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "AbilityPill\|abilityPill\|AbilityPillProps" --include="*.ts" --include="*.tsx"` returns zero results.

- [x] 2.2 Rename `components/features/ClassAbilitiesRow.tsx` to `components/features/ClassSkillsRow.tsx`. Inside: rename `ClassAbilitiesRowProps` to `ClassSkillsRowProps`, the component function from `ClassAbilitiesRow` to `ClassSkillsRow`, display text from `"Class Abilities"` to `"Class Skills"`, key from `ability-${index}` to `skill-${index}`, and update the `SkillPill` prop from `ability={ability}` to `skill={skill}`. Update all imports.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "ClassAbilitiesRow\|ClassAbilitiesRowProps" --include="*.ts" --include="*.tsx"` returns zero results.

- [x] 2.3 Update CSS classes in `app/globals.css`: rename `pill-variant-ability-default` to `pill-variant-skill-default`, `pill-variant-ability-stat` to `pill-variant-skill-stat`, `pill-variant-ability-weapon` to `pill-variant-skill-weapon`. Update the section comment from `/* Ability Variants */` to `/* Skill Variants */`.
  - Done when: `grep -ri "ability" app/globals.css` returns zero results. App renders without visual regression on skill pills.

## 3. Update Display Text in All Components

Update all remaining "abilities"/"ability" display text and variable references in components that consume the renamed types but were not fully renamed themselves.

- [x] 3.1 Update `components/features/ComparisonGrid.tsx`: change all references from `AbilityPill` to `SkillPill`, `ClassAbilitiesRow` to `ClassSkillsRow`, `classAbilities` to `classSkills`, display text `"Class Abilities"` to `"Class Skills"`, key names from `abilities-` to `skills-`, and the `ability={skill}` prop on SkillPill to `skill={skill}` in the Starting Skills row. Update movement modal label from `"Abilities"` to `"Skills"`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "classAbilities\|ClassAbilitiesRow\|AbilityPill\|\"Class Abilities\"" --include="ComparisonGrid.tsx"` returns zero results.

- [x] 3.2 Update `components/ui/ClassPill.tsx`: change references from `AbilityPill` to `SkillPill`, `classAbilities` to `classSkills`, display text `"Class Abilities"` to `"Class Skills"`, and prop from `ability={ability}` to `skill={skill}`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "ability\|AbilityPill\|classAbilities" --include="ClassPill.tsx"` returns zero results.

- [x] 3.3 Update `components/features/StatProgressionTable.tsx`: change `classAbilities` to `classSkills` in progression row types, state types, and modal rendering. Change display text `"Class Abilities"` to `"Class Skills"` and update `AbilityPill` imports to `SkillPill`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "classAbilities\|AbilityPill\|\"Class Abilities\"" --include="StatProgressionTable.tsx"` returns zero results.

- [x] 3.4 Update `components/ui/MovementTypePill.tsx`: change display label from `"Abilities"` to `"Skills"` for the movement abilities section.
  - Done when: `grep -ri "\"Abilities\"" --include="MovementTypePill.tsx"` returns zero results.

- [x] 3.5 Update `components/features/PromotionOptionsDisplay.tsx`: change any references to `classAbilities` to `classSkills` and `AbilityPill` to `SkillPill`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "classAbilities\|AbilityPill" --include="PromotionOptionsDisplay.tsx"` returns zero results.

- [x] 3.6 Update `lib/movements.ts`: rename the `abilities` field to `skills` on the `MovementData` interface and update all references to `movementData.abilities` to `movementData.skills` in consuming components.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "abilities" --include="movements.ts"` returns zero results.

## 4. Update Tests

Update all test files to use the renamed identifiers.

- [x] 4.1 Rename `__tests__/components/features/ClassAbilitiesRow.test.tsx` to `__tests__/components/features/ClassSkillsRow.test.tsx`. Update all internal references: `ClassAbilitiesRow` → `ClassSkillsRow`, `classAbilities` → `classSkills`, `AbilityPill` → `SkillPill`, `ability` → `skill`. Update `__tests__/lib/stats.test.ts`: rename all `classAbilities` references to `classSkills`. Update any other test files that import or reference old names.
  - Done when: `npm test` passes with zero failures. `grep -ri "classAbilities\|AbilityPill\|ClassAbilitiesRow\|getAbilitiesByGame\|getAbilityByName\|AbilityData" --include="*.test.ts" --include="*.test.tsx"` returns zero results.
  - Stop and hand off if: Tests fail due to data structure issues not related to the rename.

## 5. Verify Rename Completeness

Final sweep to confirm no "ability" references remain in source or test code.

- [x] 5.1 Run `grep -ri "abilit" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json" .` (excluding `node_modules`, `openspec/`, and `.next/`) and verify zero hits in application code. The only allowed exceptions are: the fallback read `rawClass.classAbilities` in `lib/data.ts`. Run `npx tsc --noEmit` and `npm test` and confirm both pass cleanly.
  - Done when: `npx tsc --noEmit` passes, `npm test` passes, and grep confirms no stale "ability" references.
  - Stop and hand off if: grep finds unexpected "ability" references that cannot be safely renamed without domain knowledge.

## 6. Add Possible Skills Row

Add the "Possible Skills" row to the ComparisonGrid Unit Details table, rendered after "Starting Skills" and before "Supports". This includes traversing the full reclass + promotion chain and annotating skills with their originating class.

- [x] 6.1 Create `components/features/PossibleSkillsRow.tsx` — a new component that accepts `unit` (Unit), `classes` (Class[]), and optional `className` props. The component SHALL:
  (a) Build a `Map<string, string[]>` mapping each skill name to its originating class name(s);
  (b) Iterate `unit.reclassOptions`, for each class ID look up the `Class`, read its `classSkills`, add each skill to the map keyed by this class's `.name`;
  (c) For each reclass class, also iterate its `promotesTo` array, look up each promoted class, read its `classSkills`, add each skill to the map keyed by the promoted class's `.name`;
  (d) Build a `Set<string>` from the unit's current class's `classSkills` (found by matching `unit.class` against `classes`);
  (e) Remove any map entry whose skill key is in the current class set;
  (f) If the map is empty, return null;
  (g) Otherwise render each skill as a `SkillPill` with a small label showing the originating class name(s). When a skill maps to multiple classes, show all class names.
  - Done when: `npx tsc --noEmit` passes. Component renders correctly when given Awakening unit data with reclass options.
  - Stop and hand off if: The `promotesTo` chain contains cycles or references non-existent class IDs.

- [x] 6.2 Integrate `PossibleSkillsRow` into `components/features/ComparisonGrid.tsx`. Add the row after the "Starting Skills" row (before "Supports"). The row SHALL only render when `units.some(u => u.reclassOptions && u.reclassOptions.length > 0)`. Each unit cell passes `unit` and `classes` to `PossibleSkillsRow`. Units with no possible skills after deduplication render "None" (muted text).
  - Done when: Opening the comparator with Awakening units shows a "Possible Skills" row. GBA units without reclass options do not show the row. `npx tsc --noEmit` and `npm test` pass.
  - Stop and hand off if: Integration causes layout or rendering issues with the existing table structure.

- [x] 6.3 Verify Possible Skills feature end-to-end in the browser. Load the comparator page with Awakening units (e.g., Chrom). Confirm:
  (a) "Possible Skills" row appears after "Starting Skills";
  (b) skills shown include both direct reclass skills AND skills from promoted classes of those reclasses;
  (c) each skill pill shows the originating class name(s) as a label;
  (d) no duplicate pills — skills shared across multiple classes appear once with all class names listed;
  (e) no skills from the unit's current class appear;
  (f) clicking a SkillPill opens the tooltip modal;
  (g) GBA game units do not show the row.
  - Done when: Visual inspection confirms all behaviors match the spec scenarios in `specs/possible-skills-display/spec.md`.
  - Stop and hand off if: Browser rendering errors or missing data prevent verification.

## 7. Tier/Level-Based Pill Coloring

Add color differentiation to SkillPills in the Possible Skills row based on the originating class's tier (unpromoted/promoted) and the skill's level requirement (parsed from the skill name).

- [x] 7.1 Extend `SkillPill` CVA variants in `components/ui/SkillPill.tsx` and `app/globals.css` with new tier/level variants: `unpromoted-lv1`, `unpromoted-lv5`, `unpromoted-lv10`, `promoted-lv1`, `promoted-lv5`, `promoted-lv10`. Each variant SHALL have a visually distinct background/text color defined in `globals.css`. The implementer chooses the exact colors — the requirement is that each combination is distinguishable at a glance. Existing variants (`default`, `stat`, `weapon`) SHALL remain unchanged.
  - Done when: `npx tsc --noEmit` passes. All 6 new CSS classes exist in `globals.css` with distinct colors. Existing pill styles are unaffected.
  - Stop and hand off if: The CVA variant system does not support the number of new variants needed.

- [x] 7.2 Update `PossibleSkillsRow` to pass tier/level-based variant props to each `SkillPill`. For each skill in the map:
  (a) Parse the level from the skill name using regex `/\(Lv\.\s*(\d+)\)/` — default to 1 if no match;
  (b) Determine the originating class's tier from its `type` field (`"unpromoted"` | `"promoted"` | `"trainee"`);
  (c) Map to the appropriate CVA variant: `${type}-lv${level}` (bucket to nearest defined level: 1, 5, or 10);
  (d) If the skill appears in multiple classes with different tiers, use the tier from the first class encountered;
  (e) Pass the resolved variant as the `variant` prop to `SkillPill`.
  - Done when: `npx tsc --noEmit` passes. Skills from unpromoted classes render in one set of colors, skills from promoted classes render in another, and level-10 skills are visually distinct from level-1 skills.
  - Stop and hand off if: Skill names use a level format other than `(Lv. X)` for some games.
