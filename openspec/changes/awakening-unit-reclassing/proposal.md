## Why
The current stat progression table only supports standard linear or branching promotions and lacks the ability to handle lateral or vertical reclassing, a core progression mechanic in Fire Emblem Awakening. Implementing this feature is necessary to accurately simulate and compare the full potential of Awakening units.

## What Changes
- Introduce horizontal (same tier) and vertical (promoted tier) reclassing options to the "Promotion Levels" section of the `StatProgressionTable`.
- Update the level progression logic to return Awakening units to level 1 upon reclassing.
- Support infinite consecutive reclassing events, assuming units reach the required level (e.g. 10+ for unpromoted, 1+ for promoted).
- Ensure that class level caps (20 for most classes, 30 for special classes defined in `lib/stats.ts`) are correctly enforced across all reclassing cycles.
- Extend the `generateProgressionArray` function and relevant state in `StatProgressionTable` to handle sequential reclassing events alongside standard promotion events.

## Capabilities

### New Capabilities
- `unit-reclassing`: Supports adding reclassing events to a unit's progression path, resetting their level to 1, and applying the new class's growth rates and modifiers while retaining cumulative stats.

### Modified Capabilities
- `stat-progression-table`: The progression table must now accommodate level resets and non-linear class progression.
- `unit-level-caps`: Needs to correctly track and enforce class level caps across multiple reclassing cycles.

## Impact
- **Impacted Code**: `lib/stats.ts` (`generateProgressionArray`), `components/features/StatProgressionTable.tsx`, `components/features/PromotionOptionsDisplay.tsx`.
- **System**: The generation of stat progression arrays must be refactored to support infinite progression lengths by compounding sequential reclass loops, rather than being strictly bound to flat level limits.
