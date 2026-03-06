## 1. Schema Definitions

- [ ] 1.1 Update `types/unit.ts` `Unit` interface to include `innateWeaknesses?: string[]` and `startingSkills?: string[]`.
- [ ] 1.2 Update `types/unit.ts` `Class` interface to include `growths?: StatBlock` and `statModifiers?: StatBlock`.

## 2. Stat Calculation Logic

- [ ] 2.1 Update `lib/normalization.ts` to recognize the `"Awakening"` game string if necessary for base stat ingestion.
- [ ] 2.2 Update `lib/stats.ts` `generateProgressionArray` to compute level 1 base stats as `unit.stats + currentClass.statModifiers` for Awakening units.
- [ ] 2.3 Update `lib/stats.ts` `generateProgressionArray` to compute total growth rates as `unit.growths + currentClass.growths` for Awakening units during level-ups.

## 3. UI Component Updates

- [ ] 3.1 Modify `ComparisonGrid.tsx` "Weaknesses" row to deduplicate and display both `unit.innateWeaknesses` and class weaknesses.
- [ ] 3.2 Modify `ComparisonGrid.tsx` "Unit Details" table to render a "Starting Skills" row using `<AbilityPill>` if `unit.startingSkills` exists.
- [ ] 3.3 Modify `StatProgressionTable.tsx` (or its child modal components) to display the "Class Abilities" section in the promotion info modal, rendering them as pills.

## 4. Data Entry: Classes

- [ ] 4.1 Create `data/awakening/classes.json`.
- [ ] 4.2 Populate base Awakening classes (e.g. Tactician, Cavalier, Knight, Myrmidon, Mercenary) with `statModifiers`, `growths`, `classAbilities`, `maxStats`, etc.
- [ ] 4.3 Populate promoted Awakening classes (e.g. Grandmaster, Paladin, Great Knight, Swordmaster, Hero) with their respective data.

## 5. Data Entry: Units

- [ ] 5.1 Create `data/awakening/units.json`.
- [ ] 5.2 Populate Generation 1 units (e.g. Chrom, Robin, Lissa, Frederick, Sully, Virion) with their personal `stats` (bases), `growths`, `innateWeaknesses` (if any), and `startingSkills`.

## 6. Integration

- [ ] 6.1 Update `lib/data.ts` to load and parse `data/awakening/classes.json` and `data/awakening/units.json`.
- [ ] 6.2 Export Awakening data so it becomes available in the application's game selector and unit selector components.

## Reference Links

*   **Base stats, weapon ranks, and inventory**: [https://serenesforest.net/awakening/characters/base-stats/main-story/](https://serenesforest.net/awakening/characters/base-stats/main-story/)
*   **Recruitment chapters**: [https://serenesforest.net/awakening/characters/recruitment/main-story/](https://serenesforest.net/awakening/characters/recruitment/main-story/)
*   **Base Growths**: [https://serenesforest.net/awakening/characters/growth-rates/base/](https://serenesforest.net/awakening/characters/growth-rates/base/)
*   **Class sets**: [https://serenesforest.net/awakening/characters/class-sets/](https://serenesforest.net/awakening/characters/class-sets/)
*   **Supports**: [https://serenesforest.net/awakening/characters/supports/](https://serenesforest.net/awakening/characters/supports/)
*   **Class bases**: [https://serenesforest.net/awakening/classes/base-stats/](https://serenesforest.net/awakening/classes/base-stats/)
*   **Class growths**: [https://serenesforest.net/awakening/classes/growth-rates/](https://serenesforest.net/awakening/classes/growth-rates/)
*   **Class max stats**: [https://serenesforest.net/awakening/classes/maximum-stats/](https://serenesforest.net/awakening/classes/maximum-stats/)
