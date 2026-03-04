## ADDED Requirements

### Requirement: Dedicated Promotion UI
The system SHALL display all unit promotion and reclassing options in a dedicated UI section visually distinct from the primary `ComparisonGrid` data table.

#### Scenario: Displaying options outside the grid
- **WHEN** a user is comparing units
- **THEN** an independent UI component (e.g., `PromotionOptions` or `PromotionPathPlanner`) is rendered outside the standard unit details table to host interactive class selection.

### Requirement: Multi-Tier Visibility
The system SHALL visually represent the full sequential depth of a unit's possible promotion tiers.

#### Scenario: Visualizing sequential promotions
- **WHEN** a unit can promote multiple times (e.g., Trainee -> Tier 1 -> Tier 2)
- **THEN** the dedicated UI section displays these distinct promotion levels as sequential, selectable steps or dropdown menus.

### Requirement: Interactive Path Selection
The system SHALL allow users to directly click or select specific class choices within the dedicated promotion UI to alter the unit's active promotion path.

#### Scenario: User clicks a class choice
- **WHEN** the user interacts with a class option in the multi-tier visualization
- **THEN** that class becomes the active selected promotion for that respective tier, updating the `promotionEvents` state.
