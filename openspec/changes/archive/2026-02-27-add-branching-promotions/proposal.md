## Why

Currently, when a unit has branching promotions or multiple possible promotions, the application calculates their levels and stats as if they simply chose the first available promotion option. This is inaccurate for games with branching promotion trees (like Sacred Stones, Awakening, or Fates), where a unit's stat progression and class identity depend entirely on the user's choice of promotion. Allowing the user to select the promotion path enables accurate comparison and stat tracking across the full range of a unit's potential development.

## What Changes

- Add UI allowing users to select a specific promotion path when a unit has multiple options.
- The application will automatically default to the first available promotion option (or a specific default if defined), ensuring that the app functions identically to how it does now if the user does not explicitly choose a class.
- Update the stat progression calculation logic to use the statistics, growth rates, and caps of the user-selected (or default) promoted class rather than strictly the first option.
- Ensure the state of the selected promotion is tracked per-unit in the comparison state.
- **BREAKING**: The unit stat calculation functions will now require the selected promotion path as an input parameter / part of the unit state.

## Capabilities

### New Capabilities
- `branching-promotions`: Add capability to select and calculate stats based on a chosen promotion path for units with multiple promotion options.

### Modified Capabilities
- `stat-progression-table`: Update requirements to reflect that stats generated for promoted levels must correspond to the user-selected promotion option.

## Impact

- **UI Components**: Modifications to the comparison grid or unit details to render a promotion selector when applicable.
- **State Management**: The application state tracking selected units must be expanded to also track the selected promotion class ID for each unit.
- **Calculation Logic**: `lib/stats.ts` (e.g., `generateProgressionArray`) must be updated to factor in the selected promotion class instead of the first available one.
- **Data Models**: `types/unit.ts` must be updated to represent the chosen promotion path.
