## Why

The current promotion options row inside the `ComparisonGrid` unit details table is not compatible with our recent implementation of multiple promotion tiers, as it only shows the first "level" of promotion or reclassing. Given the increasing complexity of displaying branching and multi-tier promotions, this UI element has outgrown the cramped table format and needs a dedicated, dynamic section.

## What Changes

- **Remove** the "Promotion Options" row from the `ComparisonGrid`'s Unit Details table.
- **Create** a new standalone component (e.g., `PromotionOptions.tsx`) to handle displaying and selecting class promotions.
- **Move** this new component to its own dedicated section in the website flow (likely below the Unit Details or Stats sections).
- **Update** the new section to dynamically feature *every* possible promotion and reclass option a unit has across multiple tiers, rather than just the first level.

## Capabilities

### New Capabilities
- `dynamic-promotion-ui`: Extracting the promotion options into a dedicated, dynamic UI component that supports multi-tier and branching class paths outside of the standard comparison table.

### Modified Capabilities
- `branching-promotions`: Updating the UI requirements to specify that branching and multi-tier options are displayed in a dedicated standalone section rather than an inline table row.

## Impact

- `components/features/ComparisonGrid.tsx`: Will have the promotion options row removed, simplifying the component.
- Layout files (e.g., `app/comparator/page.tsx` or unit detail pages): Will need to integrate the new promotion options component.
- User Experience: Selecting classes will be moved to a more prominent, capable UI section that doesn't feel constrained by table cells.
