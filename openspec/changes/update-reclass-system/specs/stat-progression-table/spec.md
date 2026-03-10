# Capability: Stat Progression Table (Modified)

## Overview
The `StatProgressionTable` and its underlying `generateProgressionArray` algorithm currently only handle linear and branching promotions. It needs to be modified to calculate, map, and display reclassing options and their resulting paths dynamically.

## Requirements
- The UI must render available "Reclass" options in the "Promotion Levels" configuration alongside or in place of "Promote" options when the unit hits the appropriate level threshold.
- The `generateProgressionArray` function in `lib/stats.ts` must accurately map class transitions, applying the new class's `statModifiers` to reset the unit's caps and factoring in the new class's `baseStats`.
- Reclassing drops the unit back to Level 1 of the selected class, but keeps their accumulated generic stats intact.
- The average stat differences between the old class's growths and the newly reclassed growths must smoothly propagate downwards for levels mapped *after* a Reclass Event.
- Prevent infinitely large stat tables by enforcing a cap on the number of stacked reclass events a user can click (or ensuring "maxLevel" continues to bound the table height effectively).
