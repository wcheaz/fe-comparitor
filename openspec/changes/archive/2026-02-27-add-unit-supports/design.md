# Technical Design: add-unit-supports

## Architecture
The Unit Supports feature integrates directly into the existing `Unit Details` view of the `ComparisonGrid`. It heavily relies on the existing `Modal` component and `lib/affinities.ts` logic to calculate and display the math behind the supports, preventing the need for complex new state management architectures. 

The `Unit` data model, specifically the `supports` string array, will be utilized to link units to their valid partners.

## Data Model Changes
- **`types/unit.ts`**: The `Unit` interface already contains `supports?: string[]` and `affinity?: string`. We will strictly utilize these fields.
- **Game Data JSONs** (e.g., `data/blazing_blade/units.json`): Update unit entries to populate the `supports` array with the exact string names or IDs of the units they can support with.

## Component Updates
- **`components/ui/SupportPill.tsx` (New)**: A new interactive component heavily inspired by `AbilityPill.tsx`. It will display the name of the supporting unit and an icon representing their affinity. Clicking it triggers the Support Bonuses Modal.
- **`components/features/ComparisonGrid.tsx`**: Add a new row labeled "Supports" within the Unit Details table. This row maps over the selected unit's `supports` array and renders a `SupportPill` for each partner.
- **Support Bonuses Modal (Integrated)**: When a `SupportPill` is clicked, it opens a `<Modal>` containing a matrix. The matrix will compute and display the total combined bonuses for C, B, A, and S ranks between the two units, utilizing `calculateSupportBonuses` from `lib/affinities.ts`.

## Implementation Details
1. **Fetching Partner Affinity**: When clicking a support partner, the system must briefly look up the partner unit in the relevant game data to retrieve their `affinity`.
2. **Calculating Combined Bonuses**: Support bonuses in GBA Fire Emblem are the sum of both units' affinity bonuses, multiplied by the support level. 
   - *Example*: (Unit A Affinity Bonus + Unit B Affinity Bonus) * Support Level Multiplier.
   - The implementation will leverage `calculateSupportBonuses` in `lib/affinities.ts` to get the base string values, but may need a new utility function specifically for *combined* pairs (e.g., `calculateCombinedSupport(unit1Affinity, unit2Affinity, level)`).
3. **Modal Rendering**: The modal will display a small grid showing the math: `C Rank | B Rank | A Rank` and the respective stat increases (Attack, Defense, Hit, Avoid, Crit, Dodge) matching the standard FE wiki format.
