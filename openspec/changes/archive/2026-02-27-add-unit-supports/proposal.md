## Why

Units in Fire Emblem games have the ability to form supports with specific other units. These supports provide statistical bonuses to both units when they are deployed together or are in close proximity, playing a significant role in unit evaluation and team composition. Currently, this information is missing from the comparator, making it difficult to fully assess a unit's potential based on their support options.

## What Changes

- Add a new row to the Unit Details table that lists the units the currently selected unit can support with.
- The supporting units will be displayed as interactive elements, similar to the `AbilityPill` component.
- Clicking on a supporting unit's pill will open a modal that details the specific bonuses the unit receives from that support relationship (e.g., at C, B, A, and S ranks).
- This requires expanding the unit data structure to include support partners and their corresponding affinity or bonus calculations if they differ from the standard affinity logic.

## Capabilities

### New Capabilities
- `unit-supports-display`: Add capability to view a list of a unit's possible support partners.
- `support-bonuses-modal`: Add capability to view the specific mathematical bonuses provided by a particular support relationship within a modal.

### Modified Capabilities
- `unit-details-table`: Expand the table to accommodate the new "Supports" row.

## Impact

- **UI Components**: Modifications to the `ComparisonGrid` or unit details view to render the new row and support pills. We will likely create a new `SupportPill.tsx` component (or reuse/adapt an existing one) and utilize the existing `Modal` component.
- **Data Models**: `types/unit.ts` or related data definitions must be updated to include support lists.
- **Data Files**: The JSON data files for each game will need to be updated to include the support relationships.
- **Calculation Logic**: `lib/affinities.ts` or a new `lib/supports.ts` might be needed to map support partners to their generated bonuses.
