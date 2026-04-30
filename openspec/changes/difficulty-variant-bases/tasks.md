## 1. Freeze shared contracts

- [x] **1.1 Add `baseStatsByDifficulty` to the Unit interface**
  - Scope: `types/unit.ts`
  - Change: The `Unit` interface gains an optional field `baseStatsByDifficulty?: Record<string, UnitStats>`. No other fields change.
  - Done when:
    - `baseStatsByDifficulty` is declared on the `Unit` interface in `types/unit.ts`
    - `npx tsc --noEmit` exits 0
  - Stop and hand off if: `UnitStats` type cannot be used as a `Record` value type.

- [x] **1.2 Populate `baseStatsByDifficulty` in `transformJsonToUnit`**
  - Scope: `lib/data.ts`
  - Change: `transformJsonToUnit()` reads `rawUnit.baseStatsByDifficulty` and assigns it to the `Unit` object when present. When absent, the field is not set.
  - Done when:
    - `transformJsonToUnit` assigns `baseStatsByDifficulty` from raw JSON when the field exists
    - `npx tsc --noEmit` exits 0
    - Existing units without the field load identically to before (no behavior change)
  - Stop and hand off if: The normalization step in `normalizeUnit()` strips or conflicts with the new field.

## 2. Scrape difficulty-variant raw data

- [x] **2.1 Create difficulty-variant unit bases scraper**
  - Scope: `dev/scrape_awakening_difficulty_bases.py`
  - Change: New script fetches the same Serenes Forest table as the existing scraper, but extracts only rows with `(H)` or `(L)` in the Name field, saving to `dev/awakening_difficulty_bases_raw.json`. Skill bonuses (e.g. `14+2`) are preserved as-is in raw output.
  - Done when:
    - `python dev/scrape_awakening_difficulty_bases.py` produces `dev/awakening_difficulty_bases_raw.json`
    - The file contains entries for all 17 variant units (14 with H+L, 3 with L-only)
    - Each entry has Name (with `(H)` or `(L)` suffix), Class, Lv, HP, Str, Mag, Skl, Spd, Lck, Def, Res
    - No Normal-mode rows (without suffix) appear in the output
  - Stop and hand off if: Serenes Forest returns 403/429 or table structure is unrecognizable.

## 3. Parse and compute difficulty-variant personal bases

- [ ] **3.1 Create difficulty-variant personal bases parser**
  - Scope: `dev/parse_awakening_difficulty_bases.py`
  - Change: New script reads `dev/awakening_difficulty_bases_raw.json` and `dev/awakening_class_bases_raw.json`, strips ` (H)`/` (L)` suffixes from names, maps to `hard`/`lunatic` keys, strips skill bonuses (split on `+`), subtracts class bases from visible bases per difficulty, writes to `dev/awakening_difficulty_personal_bases.json`. Validates every personal base ≤ visible base. Warns and skips unexpected unit names.
  - Done when:
    - `python dev/parse_awakening_difficulty_bases.py` produces `dev/awakening_difficulty_personal_bases.json`
    - The file contains entries for all 17 variant units with difficulty keys, unit id, visible bases, class bases, and computed personal bases
    - Script exits code 0
    - Flavia's computed Hard personal bases match: `{ hp: 31, str: 20, mag: 5, skl: 21, spd: 20, lck: 24, def: 17, res: 10 }` (from `hidden/TODO.md`)
  - Stop and hand off if: Validation fails (personal base > visible base), indicating a scraping or mapping error.

## 4. Update units.json with difficulty-variant data

- [ ] **4.1 Add `baseStatsByDifficulty` to the 17 variant Awakening units**
  - Scope: `data/awakening/units.json`
  - Change: Each of the 17 variant units gains a `baseStatsByDifficulty` field with computed personal bases. No other fields on any unit change.
  - Done when:
    - All 17 variant units have a `baseStatsByDifficulty` field with correct difficulty keys (`"hard"` and/or `"lunatic"`)
    - Flavia's entry matches the example from `hidden/TODO.md`: `baseStatsByDifficulty.hard` has `{ hp: 31, str: 20, mag: 5, skl: 21, spd: 20, lck: 24, def: 17, res: 10 }` and `baseStatsByDifficulty.lunatic` has `{ hp: 36, str: 23, mag: 6, skl: 24, spd: 25, lck: 27, def: 19, res: 11 }`
    - Non-variant units (Chrom, Lissa, etc.) do NOT have a `baseStatsByDifficulty` field
    - `npx tsc --noEmit` exits 0 (JSON still conforms to expected shape)
  - Stop and hand off if: Computed personal bases in intermediary file do not match expected values after manual spot-check.

## 5. Thread difficulty through stat calculation functions

- [ ] **5.1 Add `getPersonalBasesForDifficulty` helper and extend stat functions with optional difficulty parameter**
  - Scope: `lib/stats.ts`
  - Change: Add `getPersonalBasesForDifficulty(unit, difficulty?)` that returns `unit.baseStatsByDifficulty[difficulty]` when present, else `unit.stats`. Add optional `difficulty?` parameter to `getEffectiveBaseStats`, `calculateAverageStats`, `calculateAverageStatsAtLevel`, `generateProgressionArray`, and `compareUnits`. Each function passes difficulty through to the helper. When `difficulty` is undefined, behavior is identical to current behavior.
  - Done when:
    - `getPersonalBasesForDifficulty` is exported from `lib/stats.ts`
    - `getEffectiveBaseStats(unit, classData)` without difficulty returns the same result as before
    - `getEffectiveBaseStats(unit, classData, "hard")` returns different values for a unit with `baseStatsByDifficulty.hard`
    - `calculateAverageStats`, `generateProgressionArray`, `compareUnits` all accept and forward the difficulty parameter
    - `npx tsc --noEmit` exits 0
  - Stop and hand off if: Adding the optional parameter to `generateProgressionArray` breaks its existing call sites due to positional argument ambiguity.

## 6. Add difficulty state and UI selector

- [ ] **6.1 Add per-unit difficulty state to comparator page and pass to child components**
  - Scope: `app/comparator/page.tsx`
  - Change: Add `selectedDifficulties` state (`Record<string, string>`) to the comparator page. Pass it as a new prop to `ComparisonGrid` and `StatProgressionTable`. Provide a setter callback so children can update the difficulty for a specific unit.
  - Done when:
    - `selectedDifficulties` state exists in the comparator page
    - It is passed as a prop to `ComparisonGrid` and `StatProgressionTable`
    - A setter function is passed to allow updating difficulty per unit
    - `npx tsc --noEmit` exits 0
  - Stop and hand off if: The component prop threading requires changes to more than the comparator page, `ComparisonGrid`, and `StatProgressionTable`.

- [ ] **6.2 Add per-unit difficulty selector to ComparisonGrid**
  - Scope: `components/features/ComparisonGrid.tsx`
  - Change: In the unit column headers, render a pill-style difficulty selector (following the existing Personal/Effective toggle pattern at lines 828-841) for each unit that has `baseStatsByDifficulty`. The selector shows Normal plus the available difficulty keys. When toggled, it calls the setter from the parent to update `selectedDifficulties`. The Base Stats card uses the selected difficulty when calling `getEffectiveBaseStats` and when reading `unit.stats` directly.
  - Done when:
    - A pill-style selector (Normal / Hard / Lunatic or Normal / Lunatic) appears in column headers for units with `baseStatsByDifficulty`
    - No selector appears for units without `baseStatsByDifficulty`
    - Clicking a difficulty button updates the displayed base stats for that unit only
    - `npx tsc --noEmit` exits 0
  - Stop and hand off if: The column header layout cannot accommodate the selector without breaking the existing table structure.

- [ ] **6.3 Thread difficulty through StatProgressionTable**
  - Scope: `components/features/StatProgressionTable.tsx`
  - Change: Accept `selectedDifficulties` prop. When calling `generateProgressionArray` for each unit, pass the unit's selected difficulty (from `selectedDifficulties[unit.id]`) as the `difficulty` parameter.
  - Done when:
    - `StatProgressionTable` accepts a `selectedDifficulties` prop
    - `generateProgressionArray` is called with the unit's difficulty for units with `baseStatsByDifficulty`
    - Progression table updates when difficulty is changed via the selector
    - `npx tsc --noEmit` exits 0
  - Stop and hand off if: `generateProgressionArray` signature change from task 5.1 is not compatible with the call site here.

- [ ] **6.4 Thread difficulty through StatDifferenceHelper**
  - Scope: `components/features/StatDifferenceHelper.tsx`
  - Change: Accept `selectedDifficulties` prop (or individual difficulty values for unitA and unitB). Pass both difficulties to `compareUnits(unitA, unitB, level, difficultyA, difficultyB)`.
  - Done when:
    - `StatDifferenceHelper` uses selected difficulties when calling `compareUnits`
    - Stat differences update when difficulty is changed
    - `npx tsc --noEmit` exits 0
  - Stop and hand off if: The component does not have access to both units' IDs to look up difficulties.

## 7. Documentation

- [ ] **7.1 Update SCRAPING_SUMMARY.md with new scripts**
  - Scope: `hidden/SCRAPING_SUMMARY.md`
  - Change: Document `dev/scrape_awakening_difficulty_bases.py` and `dev/parse_awakening_difficulty_bases.py` with their purpose, method, input, and output files. Follow the existing format for the Awakening Personal Bases Scripts section.
  - Done when:
    - Both new scripts are listed with descriptions, input URLs/files, and output file paths
    - The document structure is consistent with existing entries
  - Stop and hand off if: N/A (documentation-only task, no external dependencies).

## Human Handoff

The following items require manual human review and are NOT part of the autonomous loop:

- **Manual fact-check of `dev/awakening_difficulty_personal_bases.json`**: Before task 4.1 is executed, a human should spot-check the computed difficulty-specific personal bases against known values (e.g., Flavia's Hard/Lunatic personal bases from `hidden/TODO.md`).
- **Manual browser verification of the difficulty selector UI**: After all tasks are complete, visually confirm the selector appears for the correct 17 units, swaps stats correctly, and does not appear for units without variants.
