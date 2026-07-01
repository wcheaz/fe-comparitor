## Why

Currently, when viewing support partners for Fire Emblem: Awakening units in the comparator, clicking on a support partner pill displays "Affinities: None + None" and shows no support bonuses. This is because Awakening does not use the GBA/PoR style elemental affinity system, but rather uses the game-specific Dual System (Pair Up, Dual Support, Dual Strike, and Dual Guard).

## What Changes

- Implement Awakening-specific support bonus calculations and presentation in the support bonuses modal.
- Hide the "Affinities" line in the support bonuses modal when neither unit has an affinity (such as in Awakening).
- Add support for calculating and displaying Pair Up bonuses (stat additions based on helper unit's stats, class bonuses, and support level).
- Add support for calculating and displaying Dual Support, Dual Strike, and Dual Guard rates based on support level and unit stats.

## Capabilities

### New Capabilities
- `awakening-support-bonuses`: Calculations, formula evaluation, and state representation for Awakening-specific Dual System mechanics (Pair Up, Dual Support, Dual Strike, and Dual Guard).

### Modified Capabilities
- `support-bonuses-modal`: Expand the modal UI to display Awakening-specific Dual System details when viewing supports for Awakening units, and hide the affinity row when no affinities are present.

## Impact

- **UI Components**: `ComparisonGrid.tsx` modal rendering to switch layout and content when the units are from Awakening.
- **Helper Modules**: Creation of `lib/supports-awakening.ts` containing the lookup tables and formula helpers for Dual System calculations.
- **Data Models**: Class definitions in `data/awakening/classes.json` can optionally be used/read, or hardcoded mapping can be reference-matched for class Pair Up bonuses.
