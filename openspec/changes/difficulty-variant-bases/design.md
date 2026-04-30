## Context

This project is a Next.js web app that compares Fire Emblem units. Awakening units store **personal base stats** in `unit.stats` (visible bases minus class bases). The existing scrapers at `dev/scrape_awakening_unit_bases.py` and `dev/parse_awakening_personal_bases.py` fetch Normal-mode stats only, explicitly filtering out rows with `(H)` and `(L)` suffixes.

17 Awakening units have different personal base stats on Hard and/or Lunatic difficulty. The Serenes Forest source page (`https://serenesforest.net/awakening/characters/base-stats/main-story/`) lists these as additional rows with `(H)` and `(L)` name suffixes in the same table.

The current stat calculation pipeline is:
1. `lib/data.ts::transformJsonToUnit()` loads JSON into `Unit` objects
2. `lib/stats.ts::getEffectiveBaseStats(unit, classData)` computes `unit.stats + classData.baseStats` for Awakening
3. `lib/stats.ts::calculateAverageStats()` and `generateProgressionArray()` seed from `getEffectiveBaseStats`
4. `ComparisonGrid.tsx` renders stats with a Personal/Effective toggle pattern (two-button pill UI)

None of these functions accept a difficulty parameter.

### Awakening units with difficulty variants

| Difficulty rows | Units |
|---|---|
| Hard + Lunatic | Libra, Anna, Cherche, Henry, Say'ri, Tiki, Basilio, Flavia, Gangrel, Walhart, Emmeryn, Yen'fay, Aversa, Priam |
| Lunatic only | Gregor, Nowi, Tharja |
| No variants | All initial characters (Chrom, Lissa, Frederick, etc.), Olivia, all 13 child characters |

Serenes Forest notes: "H = Hard mode, L = Lunatic or Lunatic+ mode." Lunatic and Lunatic+ share the same base stats.

### Existing UI toggle pattern

`ComparisonGrid.tsx` already has a Personal/Effective toggle (lines 828-841) — a two-button pill with `bg-primary` for active state. The difficulty selector will follow this same visual pattern but appear per-unit within column headers.

## Goals / Non-Goals

**Goals:**
- Allow users to view and compare Awakening units at Hard or Lunatic personal bases instead of Normal-only
- Thread the selected difficulty through all stat calculations (base stats display, progression table, stat difference helper)
- Scrape and compute per-difficulty personal bases following the established scrape/parse pattern
- Design the data schema to be reusable for future games with difficulty variants

**Non-Goals:**
- Difficulty-variant data for other games (Fates, Three Houses, etc.) — data population deferred, schema supports it
- Difficulty-variant growth rates (Awakening growths do not change by difficulty)
- Lunatic+ as a separate difficulty from Lunatic (Serenes Forest groups them)
- Changing how Normal-mode stats are stored or computed
- Adding difficulty selectors to any page other than the comparator page

## Decisions

### Decision 1: `baseStatsByDifficulty` field on Unit interface

Add an optional field `baseStatsByDifficulty?: Record<string, UnitStats>` to the `Unit` interface in `types/unit.ts`. Keys are lowercase difficulty identifiers: `"hard"`, `"lunatic"`. The existing `stats` field remains Normal-mode personal bases.

**Rationale**: Matches the schema described in `hidden/TODO.md`. Field is absent on units with uniform stats, so no migration needed for existing units. `Record<string, UnitStats>` is generic enough for future games with different difficulty names (e.g., `"maddening"` for Three Houses).

**Alternatives considered**:
- Separate field per difficulty (`hardBases`, `lunaticBases`) — rejected because it hardcodes game-specific difficulties into the type
- Nested `difficulty` object with mode → stats mapping — functionally equivalent to `Record<string, UnitStats>` but more verbose
- Separate JSON files per difficulty — rejected because it fragments the data and complicates loading

### Decision 2: New scraper script, not modification of existing one

Create `dev/scrape_awakening_difficulty_bases.py` as a new script rather than modifying the existing `dev/scrape_awakening_unit_bases.py`.

**Rationale**: The existing scraper outputs `dev/awakening_unit_bases_raw.json` which is consumed by `dev/parse_awakening_personal_bases.py`. Modifying the existing scraper to also capture difficulty rows would change its output format and break the existing parser. A new scraper preserves the existing pipeline.

The new scraper will:
1. Fetch the same Serenes Forest URL
2. Extract only rows with `(H)` or `(L)` in the name (the opposite filter of the existing scraper)
3. Save to `dev/awakening_difficulty_bases_raw.json`

The new parser `dev/parse_awakening_difficulty_bases.py` will:
1. Read both `dev/awakening_difficulty_bases_raw.json` and `dev/awakening_class_bases_raw.json`
2. Strip skill bonuses (split on `+`, same algorithm as existing parser)
3. Subtract class bases to compute per-difficulty personal bases
4. Output to `dev/awakening_difficulty_personal_bases.json`
5. Validate: every difficulty personal base ≤ visible base for that difficulty

### Decision 3: Difficulty selector is per-unit, placed in column headers

Each unit column in the comparison grid gets its own difficulty selector (a three-button pill: Normal / Hard / Lunatic). The selector appears only when `baseStatsByDifficulty` is present on that unit.

**Rationale**: In a two-unit comparison, one unit might have difficulty variants while the other does not (e.g., comparing Chrom vs Flavia). Per-unit selectors handle this naturally. Placing the selector in the column header (inside the `<th>` for each unit) keeps it visually associated with the correct unit.

**Alternatives considered**:
- A single global difficulty selector — rejected because not all units have variants
- A selector per section (one for base stats, one for growths) — rejected because growths don't change by difficulty, and there's only one difficulty concept per unit

### Decision 4: Difficulty threading via a helper function, not modifying Unit.stats

Instead of mutating `unit.stats` when difficulty changes, create a helper `getPersonalBasesForDifficulty(unit, difficulty?)` that returns the appropriate personal bases:

```
if difficulty is provided and unit.baseStatsByDifficulty[difficulty] exists:
  return unit.baseStatsByDifficulty[difficulty]
else:
  return unit.stats  // Normal mode (default)
```

This helper is used by `getEffectiveBaseStats` and all downstream functions.

**Rationale**: Avoids mutating shared state. The `Unit` object remains immutable; only the selected difficulty (a string or null) is passed as a parameter.

### Decision 5: Difficulty parameter added to stats functions as optional

Add an optional `difficulty?: string` parameter to these functions:
- `getPersonalBasesForDifficulty(unit, difficulty?)` — new helper
- `getEffectiveBaseStats(unit, classData, difficulty?)` — add param
- `calculateAverageStats(unit, level, classes?, difficulty?)` — add param
- `calculateAverageStatsAtLevel(unit, level, classes?, difficulty?)` — add param
- `generateProgressionArray(unit, startLevel?, endLevel?, classes?, promotionEvents?, reclassEvents?, difficulty?)` — add param
- `compareUnits(unitA, unitB, level, difficultyA?, difficultyB?)` — add params

All new parameters are optional with no default, so existing callers continue working without changes. When `difficulty` is undefined, behavior is identical to current behavior (uses `unit.stats`).

### Decision 6: Per-unit difficulty state in comparator page

The `app/comparator/page.tsx` component holds a `selectedDifficulties` map: `Record<string, string>` where keys are unit IDs and values are difficulty names (`"normal"`, `"hard"`, `"lunatic"`). Default is empty (meaning Normal).

This map is passed to `ComparisonGrid` and `StatProgressionTable` as a new prop.

**Rationale**: The comparator page already holds per-unit state for promotions and reclasses (`promotionEvents`, `reclassEvents`). Difficulty selection follows the same pattern. Defaulting to empty (no difficulty override = Normal) means no behavior change for units without variants.

### Decision 7: Serenes Forest data notes for difficulty rows

From the existing scraper experience:
- Difficulty rows have names like `"Flavia (H)"` and `"Flavia (L)"`. Parse by stripping ` (H)` or ` (L)` suffix to get the canonical unit name, then extract the difficulty identifier.
- Skill bonuses (e.g., `14+2`) are present in difficulty rows too. Use the same split-on-`+` algorithm.
- The same unit-to-class mapping from the existing parser applies (difficulty does not change a unit's class).
- Class bases are the same across difficulties (only personal bases change). Therefore, the same `dev/awakening_class_bases_raw.json` is used for subtracting class bases.

## Risks / Trade-offs

- **[Risk] Serenes Forest page structure changes or is unavailable** → Mitigation: Same as existing scrapers — raw JSON is cached locally. Once scraped, the parser runs offline.
- **[Risk] Incorrect difficulty-row parsing (e.g., a unit name that naturally contains parentheses)** → Mitigation: The set of units with difficulty variants is known and small (17 units). The parser will validate against an explicit list of expected unit names with difficulty variants. Unexpected names produce a warning and are skipped.
- **[Risk] Difficulty selector adds visual clutter to column headers** → Mitigation: Selector appears only for units with `baseStatsByDifficulty`. Most units (Chrom, Lissa, etc.) have no selector. Follow the existing Personal/Effective pill pattern for visual consistency.
- **[Risk] `compareUnits` accepts two separate difficulty params, which is asymmetric** → Mitigation: This is intentional. In a cross-difficulty comparison (e.g., Hard Flavia vs Lunatic Flavia), each unit needs independent difficulty selection. The per-unit state in the comparator page makes this natural.

## Human Handoff

The following require manual review outside the autonomous loop:
- **Manual fact-check of `dev/awakening_difficulty_personal_bases.json`**: Before updating `units.json`, a human should spot-check the computed difficulty-specific personal bases against known values (e.g., Flavia's Hard personal bases from `hidden/TODO.md`).
- **Manual browser verification of the difficulty selector UI**: After implementation, visually confirm the selector appears for the correct 17 units, swaps stats correctly, and does not appear for units without variants.
