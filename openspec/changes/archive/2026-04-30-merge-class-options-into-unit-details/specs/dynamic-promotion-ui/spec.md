## REMOVED Requirements

### Requirement: Dedicated Promotion UI
**Reason**: The standalone `PromotionOptionsDisplay` card is replaced by the new "Class Change Options" row in the Unit Details table. The card-based display is no longer rendered.
**Migration**: Class change options are now displayed inline in the ComparisonGrid as a table row. The `ClassChangeOptionsRow` component handles the rendering. The stat progression table remains the interactive UI for managing class change events.

### Requirement: Multi-Tier Visibility
**Reason**: Absorbed by the class change options row which shows all tiers sorted by tier descending. The recursive tree visualization is replaced by a flat sorted list with tier-based color coding.
**Migration**: All promotion and reclass targets are displayed as tier-sorted `ClassPill` components with color coding that visually distinguishes tiers.

### Requirement: Interactive Path Selection
**Reason**: This interactive functionality already exists in the `StatProgressionTable` component's class change dropdown. It was duplicated in the `PromotionOptionsDisplay`. The progression table remains the sole interactive UI.
**Migration**: Users configure class changes exclusively through the stat progression table's level/class selectors.
