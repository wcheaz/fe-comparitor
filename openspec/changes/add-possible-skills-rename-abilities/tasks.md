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

- [ ] 3.1 Update `components/features/ComparisonGrid.tsx`: change all references from `AbilityPill` to `SkillPill`, `ClassAbilitiesRow` to `ClassSkillsRow`, `classAbilities` to `classSkills`, display text `"Class Abilities"` to `"Class Skills"`, key names from `abilities-` to `skills-`, and the `ability={skill}` prop on SkillPill to `skill={skill}` in the Starting Skills row. Update movement modal label from `"Abilities"` to `"Skills"`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "classAbilities\|ClassAbilitiesRow\|AbilityPill\|\"Class Abilities\"" --include="ComparisonGrid.tsx"` returns zero results.

- [ ] 3.2 Update `components/ui/ClassPill.tsx`: change references from `AbilityPill` to `SkillPill`, `classAbilities` to `classSkills`, display text `"Class Abilities"` to `"Class Skills"`, and prop from `ability={ability}` to `skill={skill}`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "ability\|AbilityPill\|classAbilities" --include="ClassPill.tsx"` returns zero results.

- [ ] 3.3 Update `components/features/StatProgressionTable.tsx`: change `classAbilities` to `classSkills` in progression row types, state types, and modal rendering. Change display text `"Class Abilities"` to `"Class Skills"` and update `AbilityPill` imports to `SkillPill`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "classAbilities\|AbilityPill\|\"Class Abilities\"" --include="StatProgressionTable.tsx"` returns zero results.

- [ ] 3.4 Update `components/ui/MovementTypePill.tsx`: change display label from `"Abilities"` to `"Skills"` for the movement abilities section.
  - Done when: `grep -ri "\"Abilities\"" --include="MovementTypePill.tsx"` returns zero results.

- [ ] 3.5 Update `components/features/PromotionOptionsDisplay.tsx`: change any references to `classAbilities` to `classSkills` and `AbilityPill` to `SkillPill`.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "classAbilities\|AbilityPill" --include="PromotionOptionsDisplay.tsx"` returns zero results.

- [ ] 3.6 Update `lib/movements.ts`: rename the `abilities` field to `skills` on the `MovementData` interface and update all references to `movementData.abilities` to `movementData.skills` in consuming components.
  - Done when: `npx tsc --noEmit` passes. `grep -ri "abilities" --include="movements.ts"` returns zero results.

## 4. Update Tests

Update all test files to use the renamed identifiers.

- [ ] 4.1 Rename `__tests__/components/features/ClassAbilitiesRow.test.tsx` to `__tests__/components/features/ClassSkillsRow.test.tsx`. Update all internal references: `ClassAbilitiesRow` → `ClassSkillsRow`, `classAbilities` → `classSkills`, `AbilityPill` → `SkillPill`, `ability` → `skill`. Update `__tests__/lib/stats.test.ts`: rename all `classAbilities` references to `classSkills`. Update any other test files that import or reference old names.
  - Done when: `npm test` passes with zero failures. `grep -ri "classAbilities\|AbilityPill\|ClassAbilitiesRow\|getAbilitiesByGame\|getAbilityByName\|AbilityData" --include="*.test.ts" --include="*.test.tsx"` returns zero results.
  - Stop and hand off if: Tests fail due to data structure issues not related to the rename.

## 5. Verify Rename Completeness

Final sweep to confirm no "ability" references remain in source or test code.

- [ ] 5.1 Run `grep -ri "abilit" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json" .` (excluding `node_modules`, `openspec/`, and `.next/`) and verify zero hits in application code. The only allowed exceptions are: the fallback read `rawClass.classAbilities` in `lib/data.ts`. Run `npx tsc --noEmit` and `npm test` and confirm both pass cleanly.
  - Done when: `npx tsc --noEmit` passes, `npm test` passes, and grep confirms no stale "ability" references.
  - Stop and hand off if: grep finds unexpected "ability" references that cannot be safely renamed without domain knowledge.

## 6. Add Possible Skills Row

Add the new "Possible Skills" row to the ComparisonGrid Unit Details table, rendered after "Starting Skills" and before "Supports".

- [ ] 6.1 Add a "Possible Skills" row to `components/features/ComparisonGrid.tsx`. Place it after the "Starting Skills" row (after line ~733). The row SHALL: (a) only render when `units.some(u => u.reclassOptions && u.reclassOptions.length > 0)` and at least one unit has possible skills; (b) for each unit, iterate `reclassOptions`, look up each class in `classes`, collect `classSkills`, deduplicate against the unit's current class skills using a `Set`; (c) render each possible skill as a `SkillPill`; (d) render "None" (muted) for units in the grid that have reclass options but no novel skills. Row label: "Possible Skills".
  - Done when: Opening the comparator with Awakening units shows a "Possible Skills" row containing SkillPills for skills from reclass classes, with no duplicates from the current class. GBA units without reclass options do not show the row. `npx tsc --noEmit` and `npm test` pass.
  - Stop and hand off if: The reclass options data is missing or incorrectly structured for Awakening units.

- [ ] 6.2 Verify Possible Skills feature end-to-end in the browser. Load the comparator page with Awakening units (e.g., Chrom). Confirm: (a) "Possible Skills" row appears after "Starting Skills"; (b) skills shown match the union of all reclass class skills minus the current class skills; (c) no duplicate pills; (d) clicking a SkillPill opens the tooltip modal; (e) GBA game units do not show the row.
  - Done when: Visual inspection confirms all behaviors match the spec scenarios in `specs/possible-skills-display/spec.md`.
  - Stop and hand off if: Browser rendering errors or missing data prevent verification.
