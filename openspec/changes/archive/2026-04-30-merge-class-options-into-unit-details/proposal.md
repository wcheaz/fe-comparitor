## Why

The "Class Change Options" section currently lives as a standalone card (`PromotionOptionsDisplay`) separate from the "Unit Details" table in `ComparisonGrid`. This creates visual disconnection — the user must look in two different places to understand a unit's class options. Additionally, the class change options section only shows promotion chains and Awakening reclass targets as flat `ClassPill` components with a single uniform color, even though the "Possible Skills" row already color-codes by tier (unpromoted = warm yellow/orange, promoted = cool purple/violet). The pills should use the same tier-based visual language.

The stat progression table's class change dropdown already merges promotions and reclasses into a single selector. The dedicated class change options section should present that same unified list.

## What Changes

- **Merge `PromotionOptionsDisplay` into the Unit Details table**: Move the class change options from the standalone card into the `ComparisonGrid` Unit Details table as a new row, similar to how "Possible Skills" and "Class Skills" are rendered as table rows. The standalone `PromotionOptionsDisplay` card will be removed from the comparator page.
- **Show reclass options alongside promotion options**: The class change options row MUST show the same merged list of promotion targets and reclass targets that the stat progression table's class change dropdown uses — sourced from `promotesTo` chains and `getValidReclassOptions()`. Currently the standalone card already handles this for Awakening; no new data plumbing is needed, but the row must render them identically.
- **Color-code class pills by tier**: `ClassPill` components in the class change options row MUST use tier-based coloring: unpromoted classes (tier 1) use the warm yellow/amber/orange spectrum already established for unpromoted skills, and promoted classes (tier 2) use the cool purple/violet spectrum already established for promoted skills. Trainee classes (tier 0) use the unpromoted spectrum. This mirrors the visual language of the "Possible Skills" row.

## Capabilities

### New Capabilities
- `class-options-row`: A new Unit Details table row that displays all promotion and reclass class options as tier-color-coded `ClassPill` components, replacing the standalone `PromotionOptionsDisplay` card.

### Modified Capabilities
- `class-pill`: Add tier-aware color variants (unpromoted, promoted) to the `ClassPill` component, mirroring the tier-based color scheme already used by `SkillPill`.
- `comparison-grid`: Add a "Class Change Options" row to the Unit Details table, rendered after the "Class" row and before "Join Chapter", showing all promotion and reclass targets as tier-color-coded `ClassPill` components.
- `dynamic-promotion-ui`: The standalone `PromotionOptionsDisplay` card is removed from the comparator page. Its display responsibilities are absorbed by the new class options row in `ComparisonGrid`.

## Impact

- **Components**: `ComparisonGrid.tsx` gains a new table row; `ClassPill.tsx` gains tier-based CVA variants; `PromotionOptionsDisplay.tsx` is removed or deprecated.
- **Styling**: `globals.css` gains new pill variant classes for unpromoted and promoted class pills (reusing the existing yellow/orange and purple/violet spectrums).
- **Page layout**: `comparator/page.tsx` removes the `PromotionOptionsDisplay` render block; Unit Details table grows by one row.
- **No data/API changes**: All required data (`promotesTo`, `reclassOptions`, `getValidReclassOptions`) already exists.
- **No breaking changes**: Existing stat progression table behavior is unaffected.
