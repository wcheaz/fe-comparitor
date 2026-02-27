# Implementation Tasks: add-unit-supports

## 1. UI Components Setup
- [x] Create `components/ui/SupportPill.tsx` based on `AbilityPill.tsx`. It needs to display the supporting unit's name and an affinity icon.
- [x] Add interactive `onClick` logic to `SupportPill` that triggers the shared `<Modal>` component with the selected support partner's data.

## 2. Comparison Grid Integration
- [x] In `components/features/ComparisonGrid.tsx`, locate the "Unit Details" table section.
- [x] Conditionally add a new row labeled "Supports" if `unit.supports` exists and has length > 0.
- [x] Render a list of `SupportPill` components inside the new row data cell, mapping over the `unit.supports` array.

## 3. Support Bonuses Modal Logic
- [x] Add state to `ComparisonGrid.tsx` (or a dedicated modal manager) to track the `selectedSupportPartner` and the `selectedUnit`.
- [x] Implement a lookup function to fetch the full unit data of the `selectedSupportPartner` using their name/ID.
- [x] Inside the `<Modal>` content for supports, calculate the combined C, B, A rank bonuses using `lib/affinities.ts` taking both units' affinities into account (if the game supports affinity math, primarily GBA and PoR).
- [x] Display the calculated bonuses in a clean grid within the modal.

## 4. Game Data Updates
- [x] Use parsed data from `data/supports_temp.json` to update `data/binding_blade/units.json` to include the `supports` array for units.
- [x] Use parsed data from `data/supports_temp.json` to update `data/blazing_blade/units.json` to include the `supports` array for units.
- [x] Use parsed data from `data/supports_temp.json` to update `data/sacred_stones/units.json` to include the `supports` array for units.
- [x] Update `data/path_of_radiance/units.json` (if it exists) with `supports` arrays.
- [x] Ensure all units used for support math have a valid `affinity` defined in their JSON.
- [x] **Do NOT delete the `data/supports_temp.json` file after completing these tasks; keep it for reference.**

## 5. Bug Fix: Accurate Partner Affinity Lookup
- [x] Diagnose: In `ComparisonGrid.tsx`, the `findPartnerUnit` function is currently returning a mock unit with a hardcoded `affinity: 'Fire'`.
- [x] Fix: Update `ComparisonGrid.tsx` or `UnitSelector` to utilize `getAllUnits` from `lib/data.ts` to perform an actual lookup for the `partnerUnit` by name and game, retrieving their true affinity.

## 6. UI Refinement: Scrollable Constraints
- [x] Update `components/features/ComparisonGrid.tsx`'s "Supports" row to render its pills within a scrollable container.
- [x] Constrain the container's height (e.g. `max-h-32`) and enable vertical scrolling (`overflow-y-auto`).
- [x] Use a CSS grid (`grid-cols-2`) or flex wrap layout to display exactly 2 `SupportPill`s per row.
