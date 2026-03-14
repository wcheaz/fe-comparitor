## Why

The current display of Class, Movement Type, and Affinity in the Comparison Grid uses generic modals, which interrupts the user flow and is inconsistent with how abilities are currently displayed (using `AbilityPill`). Changing these to dedicated pill components provides a cleaner, more consistent, and readable UI at a glance.

## What Changes

- Replace the modal triggers for Class, Movement Type, and Affinity in `ComparisonGrid.tsx` with dedicated pill components.
- Utilize the existing `ClassPill` component for the Class display in the grid.
- Create a new `AffinityPill` UI component.
- Create a new `MovementTypePill` UI component.
- Update `ClassPill` to incorporate the new `MovementTypePill` in place of its current movement type textual/icon display.

## Capabilities

### New Capabilities
- `affinity-pill`: A reusable UI component for displaying unit affinities with an embedded modal or tooltip if necessary.
- `movement-type-pill`: A reusable UI component for displaying movement types.

### Modified Capabilities
- `comparison-grid`: UI update to render `ClassPill`, `AffinityPill`, and `MovementTypePill` instead of modal triggers.
- `class-pill`: Update requirement to embed the new `MovementTypePill` component instead of rendering the movement type directly.

## Impact

- **UI Components:** `components/ui/ClassPill.tsx` (Modified), `components/ui/AffinityPill.tsx` (New), `components/ui/MovementTypePill.tsx` (New).
- **Features:** `components/features/ComparisonGrid.tsx` (Modified).
