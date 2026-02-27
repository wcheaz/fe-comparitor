# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

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

## Specifications

support-bonuses-modal/spec.md
## ADDED Requirements

### Requirement: Support Bonuses Modal Display
The system SHALL display a modal detailing the specific stat bonuses provided by a support relationship between two units.

#### Scenario: Opening the support bonuses modal
- **WHEN** the user clicks on a support partner pill in the Unit Details table
- **THEN** a modal opens.
- **AND** the modal displays the specific bonuses (e.g., Attack, Defense, Hit, Avoid, Crit, Dodge) gained at each support level (C, B, A, S).

### Requirement: Accurate Support Calculations
The system SHALL accurately calculate the displayed support bonuses based on the specific game's mechanics and the affinities or specific paired bonuses of the units involved.

#### Scenario: Calculating bonuses for a specific pair
- **WHEN** the support bonuses modal is populated
- **THEN** the required math (combining affinities and multiplying by support level) is accurately performed using `lib/affinities.ts` or equivalent logic.

unit-supports-display/spec.md
## ADDED Requirements

### Requirement: Unit Support Partners List
The system SHALL display a list of all potential support partners for a given unit when that unit is selected in the comparator.

#### Scenario: Viewing a unit's details
- **WHEN** a unit is displayed in the Unit Details table
- **THEN** a new row labeled "Supports" is visible.
- **AND** this row contains a visual element (like a pill) for each character the unit can build a support with.

### Requirement: Interactive Support Elements
The system SHALL make the supporting unit elements interactive to allow users to view detailed information about the support relationship.

#### Scenario: Clicking on a support partner
- **WHEN** the user clicks on a supporting unit's pill
- **THEN** the system registers the interaction and triggers the display of the support bonuses modal.



## Design

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

## Current Task Context

## Current Task
- - [ ] Create `components/ui/SupportPill.tsx` based on `AbilityPill.tsx`. It needs to display the supporting unit's name and an affinity icon.
