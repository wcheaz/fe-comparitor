## Why

Seventeen Awakening classes in `data/awakening/classes.json` have their `growths` field set to all zeros. Without class growth data, the stat progression table for Awakening units in those classes cannot compute meaningful level-up projections, since the combined growth formula (`personal growth + class growth`) collapses to personal-only rates. The correct class growth rates are available from Serenes Forest's class growth rate table.

## What Changes

- Populate the `growths` object on all 17 Awakening classes that currently have all-zero growth rates, using the canonical class growth values from `https://serenesforest.net/awakening/classes/growth-rates/`.
- All eight stat keys (`hp`, `str`, `mag`, `skl`, `spd`, `lck`, `def`, `res`) MUST be set to their correct integer values. Per Serenes Forest, `lck` is 0 for every Awakening class.

### Classes requiring growth data (all-zero currently)

| Class | HP | Str | Mag | Skl | Spd | Lck | Def | Res |
|---|---|---|---|---|---|---|---|---|
| Archer | 45 | 15 | 0 | 30 | 15 | 0 | 10 | 5 |
| Pegasus Knight | 40 | 15 | 5 | 25 | 25 | 0 | 5 | 10 |
| Warrior | 45 | 25 | 0 | 20 | 15 | 0 | 10 | 5 |
| Lord | 40 | 20 | 0 | 20 | 20 | 0 | 10 | 5 |
| Wyvern Rider | 45 | 30 | 0 | 15 | 15 | 0 | 10 | 5 |
| Cleric | 35 | 5 | 15 | 15 | 15 | 0 | 5 | 15 |
| Troubadour | 35 | 0 | 20 | 10 | 20 | 0 | 5 | 15 |
| Villager | 35 | 10 | 0 | 5 | 5 | 0 | 10 | 5 |
| Dancer | 35 | 5 | 0 | 25 | 25 | 0 | 5 | 5 |
| Dark Mage | 50 | 5 | 15 | 15 | 15 | 0 | 10 | 10 |
| Trickster | 35 | 10 | 15 | 25 | 20 | 0 | 5 | 10 |
| Thief | 35 | 15 | 5 | 25 | 25 | 0 | 5 | 5 |
| Fighter | 45 | 25 | 0 | 20 | 15 | 0 | 10 | 5 |
| Mage | 35 | 0 | 20 | 20 | 20 | 0 | 5 | 10 |
| Taguel | 45 | 20 | 0 | 15 | 15 | 0 | 15 | 5 |
| Manakete | 50 | 20 | 5 | 20 | 20 | 0 | 15 | 15 |
| War Monk | 45 | 15 | 15 | 10 | 15 | 0 | 10 | 10 |

### Out of scope (deferred)

Some earlier-populated classes (tactician, cavalier, knight, myrmidon, mercenary, grandmaster, paladin, great_knight, swordmaster, hero) have growth values that are significantly higher than Serenes Forest class-only rates. These may have been sourced from a combined personal+class reference or a different source. Correcting those is a separate data-audit concern and is NOT part of this change.

## Capabilities

### New Capabilities

- `awakening-class-growths-data`: Populate correct Serenes Forest class growth rates for the 17 Awakening classes currently missing growth data in `data/awakening/classes.json`.

### Modified Capabilities

- `class-growths-and-modifiers`: The spec's "Awakening class loaded" scenario implicitly assumes non-zero class growths exist. This change makes that assumption true for the 17 previously-empty classes.

## Impact

- **`data/awakening/classes.json`**: The `growths` field on 17 class objects changes from all-zeros to correct Serenes Forest values. No schema changes, no new fields, no field removals.
- **No code changes**: This is a data-only change. The stat progression formula in `lib/stats.ts` already sums `unit.growths + class.growths` correctly. Once class growths are populated, the existing calculation produces correct results.
- **No breaking changes**: Downstream consumers already handle zero growths gracefully; populating real values only improves accuracy.
