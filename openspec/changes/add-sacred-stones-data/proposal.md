## Why

Fire Emblem: The Sacred Stones introduces branching promotion paths and unique "Trainee" units that can promote multiple times. Adding support for these flexible promotion trees is crucial for accurately representing FE8 and lays the groundwork for later games with more complex class systems (e.g., Awakening, Fates). It expands the app's supported titles to encompass the entire Game Boy Advance era.

## What Changes

- Add unit base data for all playable characters in Fire Emblem: The Sacred Stones to `data/sacred_stones/units.json`.
- Add class data (base stats, promo gains, movement types, etc.) to `data/sacred_stones/classes.json`.
- Enhance the class/promotion tracking infrastructure across the app to support an arbitrary number of recursive promotion tiers (Tier 0 -> Tier 1 -> Tier 2 -> etc.) instead of hardcoded singular promotions.
- Update stat calculators and UI components to seamlessly handle branching choices and multi-tier progressions.

## Capabilities

### New Capabilities
- `multi-tier-promotions`: Infrastructure and UI support for arbitrary depth in class promotion trees and branching promotion choices.
- `sacred-stones-data`: Integration of unit and class data specifically for Fire Emblem: The Sacred Stones.

### Modified Capabilities
- `stat-progression`: Update the average stat calculations to smoothly factor in branching paths and an arbitrary amount of promotions/recets. 

## Impact

- `lib/stats.ts`: Heavy refactoring required to handle recursive stat calculation when a unit passes through multiple tiers of promotion bonuses.
- `components/features/StatProgressionTable.tsx`: UI will need to handle distinct display states when multiple branching promotions occur, allowing users to potentially select which path a character progressed down.
- Data parser layers may need tweaking to flexibly read an unbounded chain of `promotesTo` properties.
