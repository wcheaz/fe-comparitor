# Implementation Tasks: Reclass System

## 1. Schema Definitions
- [x] 1.1 Update `types/unit.ts` `Unit` interface to add `reclassEvents?: ReclassEvent[]`.
- [x] 1.2 Create `ReclassEvent` interface in `types/unit.ts`.

## 2. Stat Calculation Logic
- [x] 2.1 Update `lib/stats.ts` to export standard tier parsing functions if necessary.
- [ ] 2.2 Modify `generateProgressionArray` in `lib/stats.ts` to sequentially process `reclassEvents` chronologically by level.
- [ ] 2.3 Implement stat retention and cap-resetting logic whenever a unit changes classes horizontally. Level must reset to 1.
- [ ] 2.4 Ensure Awakening units receive the new class's `statModifiers` when their class changes.

## 3. UI Component Updates
- [ ] 3.1 Update `components/features/PromotionOptionsDisplay.tsx` to handle `reclassOptions` for units that possess them.
- [ ] 3.2 Add UI controls for creating a `ReclassEvent` (similar to existing "Promote Here" flows).
- [ ] 3.3 Restrict valid reclass targets based on the current level and tier. Unpromoted units must reach Level 10 to reclass.

## 4. Integration
- [ ] 4.1 Update the `ComparisonGrid` state management to handle both promotion and reclass histories effectively.
- [ ] 4.2 Verify units from GBA games are not impacted by the new reclass paths.
