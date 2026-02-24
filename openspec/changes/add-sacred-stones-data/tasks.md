## 1. Data Implementation

- [x] 1.1 Scrape and compile FE8 playable character names from [Fire Emblem Wiki: List of characters in Fire Emblem: The Sacred Stones](https://fireemblemwiki.org/wiki/List_of_characters_in_Fire_Emblem:_The_Sacred_Stones).
- [x] 1.2 Scrape and compile FE8 unit base stats from [Serenes Forest: Base Stats](https://serenesforest.net/the-sacred-stones/characters/base-stats/).
- [x] 1.3 Scrape and compile FE8 unit growth rates from [Serenes Forest: Growth Rates](https://serenesforest.net/the-sacred-stones/characters/growth-rates/).
- [x] 1.4 Validate compiled unit data against sources and merge into `data/sacred_stones/units.json`.
- [x] 1.5 Scrape and compile FE8 class promotion gains from [Serenes Forest: Promotion Gains](https://serenesforest.net/the-sacred-stones/classes/promotion-gains/).
- [x] 1.6 Scrape and compile FE8 class maximum stats from [Serenes Forest: Maximum Stats](https://serenesforest.net/the-sacred-stones/classes/maximum-stats/).
- [x] 1.7 Validate compiled class data against sources and format as `data/sacred_stones/classes.json`, ensuring `promotesTo` correctly maps branching tiers completely (e.g., Trainee to Tier 1, then Tier 1 to Tier 2 choices).
- [x] 1.8 Map FE8-specific PRF weapons (e.g., Rapier, Reginleif) into `lib/weapons.ts` or relevant item data stores.

## 2. Infrastructure Updates

- [x] 2.1 Update `types/unit.ts` to include a new `PromotionEvent` interface (or similar) to track `{ level: number, selectedClassId: string }` instead of a flat `promotionLevels: Record<string, number>`.
- [x] 2.2 Refactor `generateProgressionArray` in `lib/stats.ts` to accept an array of `PromotionEvent`s instead of a single `promotionLevel` property.
- [x] 2.3 Update the `generateProgressionArray` loop to recursively look up the `Class` object based on the latest `PromotionEvent.selectedClassId`, applying its `promotionBonus` and adjusting `maxStats` caps at the exact level the promotion occurs.
- [x] 2.4 Ensure the internal `level` counter in `generateProgressionArray` resets to 1 upon every valid `PromotionEvent` hit, while continuing to iterate up to the global max row index (e.g., 40).

## 3. UI Updates

- [x] 3.1 Update the state in `components/features/StatProgressionTable.tsx` from `promotionLevels` to an array-based or nested object state capable of tracking multiple `PromotionEvent`s per unit.
- [x] 3.2 Add a new helper function or sub-component in `StatProgressionTable.tsx` to detect when a unit's current active class has `promotesTo.length > 1`. 
- [x] 3.3 Render a dropdown `<select>` UI element for branching choices dynamically, allowing the user to select their desired promotion path (e.g., choice between Paladin or Great Knight).
- [ ] 3.4 Update the `generateProgressionArray` mapping logic in the table rendering code to correctly handle the new `generateProgressionArray` function signature and properly label row headers (e.g., "Level 1 (Tier 2)").

## 4. Verification & Polish

- [ ] 4.1 Write a test script or use the `dev/` directory to validate `generateProgressionArray` accuracy for a standard 1-tier unit (e.g., Seth) to ensure no regressions.
- [ ] 4.2 Write a test script to validate average stat generation accuracy for a standard 2-tier branching unit (e.g., Eirika, Franz), checking math against expected values.
- [ ] 4.3 Write a test script to validate average stat generation accuracy for a 3-tier branching unit (e.g., Ross, Amelia, Ewan), verifying cumulative stats across all 3 class stages.
- [ ] 4.4 Run `openspec archive change add-sacred-stones-data` once all tasks are complete and verified.
