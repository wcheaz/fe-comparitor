## Context

The project is a Next.js 14 App Router application (React 18, TypeScript, Tailwind CSS) for comparing Fire Emblem units across games. The codebase currently uses "abilities" terminology in ~50+ locations across interfaces, functions, components, CSS classes, data files, and display text. The Fire Emblem series officially calls these "skills."

The Unit Details table in `ComparisonGrid.tsx` renders rows for "Class Abilities" (from the unit's current class's `classAbilities` field) and "Starting Skills" (from `unit.startingSkills`). Units in games with reclassing (Awakening) have a `reclassOptions: string[]` field listing class IDs they can change into. Each class has a `classAbilities: string[]` field listing skills learned at certain levels. Currently there is no UI showing what skills a unit could learn by reclassing.

Key files involved:
- `lib/abilities.ts` — ability data loader, cache, `AbilityData` interface
- `types/unit.ts` — `Class.classAbilities`, `Unit.reclassOptions`, `Unit.startingSkills`
- `components/ui/AbilityPill.tsx` — pill component with async tooltip
- `components/features/ClassAbilitiesRow.tsx` — renders current class skills
- `components/features/ComparisonGrid.tsx` — main comparison table
- `data/*/abilities.json` — 6 per-game data files
- `app/globals.css` — CSS variant classes

## Goals / Non-Goals

**Goals:**
- Rename all "ability"/"abilities" references to "skill"/"skills" across the entire codebase (interfaces, functions, variables, components, CSS classes, data files, display text, tests)
- Add a "Possible Skills" row to the Unit Details table showing skills obtainable via reclassing
- Maintain exact behavioral parity during the rename — no logic changes, only naming
- Ensure all existing tests continue to pass after rename

**Non-Goals:**
- No changes to the reclassing validation logic itself
- No changes to how reclass options are calculated or stored
- No new data fields on the Unit or Class interfaces (possible skills are derived at render time)
- No changes to games that don't support reclassing (GBA games)
- No migration tooling or backward compatibility for old `abilities.json` file names (this is a one-time rename, not a published API)
- No changes to the `unit.skills` field or the unit detail page's plain-text skill display at `app/units/[id]/page.tsx`

## Decisions

### Decision 1: Rename all files in a single pass, not incrementally

**Choice:** Rename all "ability" names to "skill" names in one atomic task covering all files.

**Rationale:** The rename touches interfaces, functions, components, data files, CSS, and tests. Doing it incrementally would leave the codebase in a broken intermediate state where some files import `AbilityPill` and others import `SkillPill`. A single pass avoids broken imports and reduces the chance of partial renames being committed.

**Alternative considered:** Incremental rename with temporary re-export shims (e.g., `export { SkillPill } from './SkillPill'; export default SkillPill;` in `AbilityPill.tsx`). Rejected because it adds complexity and cleanup work for no real benefit in a non-library project.

### Decision 2: Data files renamed from `abilities.json` to `skills.json`

**Choice:** Rename the 6 `data/*/abilities.json` files to `skills.json` and update the dynamic import path in the loader.

**Rationale:** The data files should match the new terminology. The dynamic import `import('@/data/${dir}/abilities.json')` becomes `import('@/data/${dir}/skills.json')`. No backward-compatible fallback is needed since this is not a published package.

### Decision 3: Possible Skills derived at render time, no new data fields

**Choice:** Compute possible skills inline in the ComparisonGrid component by iterating `unit.reclassOptions`, looking up each class and its `promotesTo` chain in the `classes` array, and collecting `classSkills` values from all classes in that chain. Deduplicate against the unit's current class skills.

**Rationale:** The data already exists — `reclassOptions` is on the Unit, `classSkills` and `promotesTo` are on each Class. Adding a precomputed field would create a synchronization burden. Deriving at render time is O(n*m) where n is the number of reclass options (typically 5-15) and m is the average promotesTo length (typically 1-2), which is negligible.

**Algorithm for collecting and deduplicating possible skills:**
1. Get current class's `classSkills` as a `Set<string>` (for exclusion)
2. Build a `Map<string, string[]>` mapping skill name → array of originating class names
3. For each class ID in `unit.reclassOptions`:
   a. Find the class, iterate its `classSkills`, add each to the map with this class's name
   b. For each class ID in this class's `promotesTo` array, find that class, iterate its `classSkills`, add each to the map with the promoted class's name
4. Remove any skill key that exists in the current class's set
5. Render each remaining skill as a `SkillPill` with its originating class name(s) shown as a label

### Decision 4: Possible Skills row shown conditionally

**Choice:** The "Possible Skills" row only renders when at least one displayed unit has non-empty `reclassOptions` AND at least one reclass class has skills not already on the unit's current class. This mirrors the conditional pattern used for all other rows in the table.

**Rationale:** Consistent with existing row visibility logic (e.g., "Starting Skills" only shows if any unit has `startingSkills`).

### Decision 5: Possible Skills row placement

**Choice:** Place the "Possible Skills" row after "Starting Skills" and before "Supports" in the Unit Details table.

**Rationale:** Grouping skill-related rows together (Class Skills → Starting Skills → Possible Skills) makes semantic sense. Supports is a different concern and should come after.

### Decision 6: Extract Possible Skills into its own component

**Choice:** Implement the Possible Skills logic in a dedicated `PossibleSkillsRow` component rather than inline in `ComparisonGrid.tsx`. The component handles the full reclass + promotesTo traversal, deduplication, and class-name annotation.

**Rationale:** The logic has grown beyond a simple inline iteration — it now traverses reclass options AND their promotion chains, builds a skill-to-class map, deduplicates, and renders class-name annotations. This is too much complexity to inline. A dedicated component keeps ComparisonGrid manageable and makes the Possible Skills logic independently testable.

### Decision 7: Tier/level-based pill coloring via new CVA variants on SkillPill

**Choice:** Extend the `SkillPill` CVA variants with tier × level combinations (e.g., `unpromoted-lv1`, `unpromoted-lv5`, `unpromoted-lv10`, `promoted-lv1`, `promoted-lv5`, `promoted-lv10`). The `PossibleSkillsRow` component determines the tier and level for each skill by looking at the originating class's `type` field and parsing the `(Lv. X)` suffix from the skill name, then passes the appropriate variant prop to `SkillPill`.

**Rationale:** The tier and level information is already available at render time — the originating class object has a `type` field (`"unpromoted"` | `"promoted"` | `"trainee"`) and the skill name contains the level suffix. No new data structures needed.

**Algorithm for determining color variant:**
1. Parse the level from the skill name using regex `/\(Lv\.\s*(\d+)\)/` — default to 1 if no match
2. Read the originating class's `type` field
3. Map to a CVA variant string: `${type}-lv${level}` (e.g., `"unpromoted-lv1"`, `"promoted-lv10"`)
4. For levels not in the predefined variant set (e.g., Lv. 5, Lv. 15), use the nearest defined level bucket
5. Pass as the `variant` prop to `SkillPill`

**Alternative considered:** Separate color logic inside `PossibleSkillsRow` with inline styles. Rejected because CVA variants are the existing pattern for pill styling and keep colors in CSS where they can be themed.

## Risks / Trade-offs

- **Risk:** Missed rename instances break imports at runtime → **Mitigation:** The rename task includes running the full test suite (`npm test`) and TypeScript type check (`npx tsc --noEmit`) to catch any missed references. Additionally, `grep -ri "abilit"` across the source after rename serves as a manual verification step.
- **Risk:** CSS class rename breaks styling → **Mitigation:** CSS classes are used only within `AbilityPill` (→ `SkillPill`) via CVA variants. Renaming them in lockstep with the component ensures consistency. A visual check of the app confirms.
- **Risk:** Data file rename breaks production deploys if old cached references exist → **Mitigation:** This is a client-side Next.js app with dynamic imports. The cache is in-memory (`skillsCache`) and clears on redeploy. No persistent cache layer.
- **Trade-off:** Not extracting Possible Skills into its own component means the ComparisonGrid file grows slightly. Acceptable because the logic is ~15 lines and the file already handles similar inline patterns for other rows.
