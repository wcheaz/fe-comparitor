## Why

In Fire Emblem Awakening, 17 units have different personal base stats on Hard and/or Lunatic difficulty compared to Normal. Currently, the application only stores Normal-mode personal bases. Users cannot see or compare how a unit's bases change across difficulties — a significant omission for players planning Lunatic or Lunatic+ runs.

## What Changes

- Extend the `Unit` type in `types/unit.ts` with an optional `baseStatsByDifficulty` field containing personal base stats keyed by difficulty name (e.g., `hard`, `lunatic`). Only present on units that actually differ.
- Create a new scraper/parse pipeline that captures Hard and Lunatic personal bases from the existing Serenes Forest data source (the same tables already scraped, but currently filtering out `(H)`/`(L)` rows).
- Populate `baseStatsByDifficulty` on the 17 affected Awakening units in `data/awakening/units.json`.
- Add a per-unit difficulty selector in `ComparisonGrid` that appears only for units with `baseStatsByDifficulty`. When toggled, the selector swaps the personal bases used in stat calculations (base stats card, progression table, stat difference helper).
- Thread the selected difficulty through `lib/stats.ts` functions (`getEffectiveBaseStats`, `calculateAverageStats`, `generateProgressionArray`) so that progression and comparison logic uses the correct stat set.

## Capabilities

### New Capabilities
- `difficulty-variant-bases-data`: Scraper, parser, and data schema for per-difficulty personal base stats. Covers the `baseStatsByDifficulty` field on `Unit`, the scraping pipeline to capture Hard/Lunatic rows from Serenes Forest, and the data transformation in `lib/data.ts`.
- `difficulty-variant-bases-ui`: Per-unit difficulty toggle in the comparison grid. Covers the selector component, the integration with `ComparisonGrid` and `StatProgressionTable`, and the threading of selected difficulty through `lib/stats.ts` calculation functions.

### Modified Capabilities
- `fe-awakening-data`: The Awakening unit data spec must allow an optional `baseStatsByDifficulty` field. The existing requirement that `stats` contains Normal-mode personal bases is unchanged; the new field supplements it for difficulty-variant units.
- `awakening-personal-bases-scraper`: The existing scraper requirement to skip `(H)`/`(L)` rows must be reversed for a new difficulty-aware scraping path. The existing Normal-only scraper and parser remain functional for their original purpose; a new parallel pipeline captures difficulty variants.

## Impact

- **`types/unit.ts`**: Add `baseStatsByDifficulty?: Record<string, UnitStats>` to the `Unit` interface.
- **`data/awakening/units.json`**: 17 units gain a `baseStatsByDifficulty` field. No other fields change.
- **`lib/data.ts`**: `transformJsonToUnit()` must populate `baseStatsByDifficulty` from the JSON.
- **`lib/stats.ts`**: `getEffectiveBaseStats()` and all downstream functions must accept an optional difficulty parameter and select stats from `baseStatsByDifficulty` when provided.
- **`components/features/ComparisonGrid.tsx`**: Add per-unit difficulty selector (visible only when `baseStatsByDifficulty` exists). Pass selected difficulty to stat functions.
- **`components/features/StatProgressionTable.tsx`**: Accept and forward difficulty parameter.
- **`components/features/StatDifferenceHelper.tsx`**: Accept and forward difficulty parameter.
- **`app/comparator/page.tsx`**: Hold per-unit difficulty state (one per selected unit).
- **`dev/`**: New scraper script for difficulty-variant raw data, and new parser to compute difficulty-specific personal bases.
- **`hidden/SCRAPING_SUMMARY.md`**: Document the new scripts.

## Scope

### In scope (first rollout)
- Awakening game only — the only game in this codebase with Serenes Forest difficulty-variant base stats.
- 17 units with difficulty variants: Libra, Anna, Cherche, Henry, Say'ri, Tiki, Basilio, Flavia, Gangrel, Walhart, Emmeryn, Yen'fay, Aversa, Priam (Hard + Lunatic); Gregor, Nowi, Tharja (Lunatic only).
- Personal base stats only. Growth rates, stat modifiers, and skills are NOT affected by difficulty.
- The difficulty selector swaps personal bases only. Effective bases are recomputed as `personal_base_for_difficulty + class_base`.

### Non-goals
- Difficulty-variant data for other games (Fates, Three Houses, etc.) — schema supports it, but data population is deferred.
- Difficulty-variant growth rates (Awakening growths do not change by difficulty).
- Lunatic+ as a separate difficulty (Serenes Forest groups Lunatic and Lunatic+ bases together).
- Changing how Normal-mode stats are stored or computed (existing `stats` field is unchanged).

## Human Handoff

The following require manual review outside the autonomous loop:
- **Manual fact-check of difficulty-specific personal bases** in the intermediary JSON before updating `units.json`.
- **Manual verification of the difficulty selector UI** in the browser to confirm it appears for the correct units and swaps stats correctly.
