# Implementation Tasks: add-unit-supports

## 1. UI Components Setup
- [ ] Create `components/ui/SupportPill.tsx` based on `AbilityPill.tsx`. It needs to display the supporting unit's name and an affinity icon.
- [ ] Add interactive `onClick` logic to `SupportPill` that triggers the shared `<Modal>` component with the selected support partner's data.

## 2. Comparison Grid Integration
- [ ] In `components/features/ComparisonGrid.tsx`, locate the "Unit Details" table section.
- [ ] Conditionally add a new row labeled "Supports" if `unit.supports` exists and has length > 0.
- [ ] Render a list of `SupportPill` components inside the new row data cell, mapping over the `unit.supports` array.

## 3. Support Bonuses Modal Logic
- [ ] Add state to `ComparisonGrid.tsx` (or a dedicated modal manager) to track the `selectedSupportPartner` and the `selectedUnit`.
- [ ] Implement a lookup function to fetch the full unit data of the `selectedSupportPartner` using their name/ID.
- [ ] Inside the `<Modal>` content for supports, calculate the combined C, B, A, and S rank bonuses using `lib/affinities.ts` taking both units' affinities into account (if the game supports affinity math, primarily GBA and PoR).
- [ ] Display the calculated bonuses in a clean grid within the modal.

## 4. Game Data Updates
- [ ] Use parsed data from `data/supports_temp.json` to update `data/binding_blade/units.json` to include the `supports` array for units.
- [ ] Use parsed data from `data/supports_temp.json` to update `data/blazing_blade/units.json` to include the `supports` array for units.
- [ ] Use parsed data from `data/supports_temp.json` to update `data/sacred_stones/units.json` to include the `supports` array for units.
- [ ] Update `data/path_of_radiance/units.json` (if it exists) with `supports` arrays.
- [ ] Ensure all units used for support math have a valid `affinity` defined in their JSON.
- [ ] **Do NOT delete the `data/supports_temp.json` file after completing these tasks; keep it for reference.**
