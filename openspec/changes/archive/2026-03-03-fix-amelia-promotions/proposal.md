## Why
The UI and stat calculation logic for units with multi-tier branching promotions (like FE8 Trainees such as Amelia) is currently bugged. When adding another promotion for Amelia, the options to add/remove promotions disappear, and the automatic unpromoted-to-base class promotion is missing the visual "✨" indicator. Furthermore, the stat progression calculations for these units are incorrect, applying the wrong leveling offsets and skipping tiers which results in massive, incorrect stat jumps. Fixing this is necessary to ensure the comparator accurately reflects trainee growth paths.

## What Changes
- Fix the logic that hides the `+` and `-` buttons for adding/removing promotion tiers so it correctly recognizes when a trainee can promote further.
- Ensure the "✨" promotion icon correctly renders for forced trainee-to-base class promotions.
- Correct the `generateProgressionArray` math to properly apply trainee leveling offsets (from virtual Level 1 to 10) and transition cleanly into Tier 1 computations without duplicating levels or incorrectly assuming a level 20 class promotion.

## Capabilities

### New Capabilities
- `trainee-promotions`: Define the specific requirements for how trainee units bridge the gap between Tier 0 (Trainee), Tier 1 (Base), and Tier 2 (Promoted), including UI requirements and stat calculation constraints.

### Modified Capabilities
- `branching-promotions`: Update existing promotion handling requirements to properly support variable-level forced early promotions (e.g., locking to level 10 for trainees instead of 20).

## Impact
- `components/features/StatProgressionTable.tsx`: UI rendering logic for the `+`/`-` tier buttons and table row promotion indicators.
- `lib/stats.ts`: Mathematical algorithms in `generateProgressionArray` for calculating stat growths across non-standard tier boundaries.
