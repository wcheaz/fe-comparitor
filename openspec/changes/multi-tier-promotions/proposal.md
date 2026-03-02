## Why
Some units in Fire Emblem, such as the FE8 Trainees or characters in games with reclassing, can promote or reclass multiple times, resetting their levels. The current table doesn't fully support dynamically adding these multiple promotion tiers or handling the unique level ranges (like trainee levels or varying max level caps) associated with these mechanics, which leads to incorrect stat representations and broken table layouts.

## What Changes
- Add a dynamically appearing "+" button in the "promotion levels" section to allow users to add another promotion level, provided the unit has an "extra promotion" available.
- Add a corresponding "-" button to remove the latest promotion/reclass option.
- Introduce a new "Max Level" data field for units.
- **BREAKING**: Stats for units that exceed their specific "Max Level" will now display as "-", matching the behavior for levels beneath their base.
- Specifically insert 10 rows at the top of the table for FE8 Trainee units to represent their 10 "trainee" levels (levels -10 to 0) before they are forced to promote.
- Reformat the table's level column to dynamically handle "infinite" growth without resetting levels on promotion, while keeping the level 21 "promoted level 1" format for standard GBA-style units.
- Dynamically scale the table's default maximum level based on the highest max level of the currently selected units (e.g., expanding up to 60 for FE10 units, or sticking to 40 for standard/infinite growth).

## Capabilities

### New Capabilities
- `unit-level-caps`: Data model and business logic handling for individual unit maximum levels, infinite growth, and trainee-specific negative levels.

### Modified Capabilities
- `branching-promotions`: Requirements for the UI mechanics regarding how the user adds ("+") or removes ("-") sequential multi-tier promotion events depending on class availability.
- `stat-progression-table`: Requirements for dynamic default table length scaling, handling negative trainee rows, and rendering "-" for levels exceeding a unit's cap.

## Impact
- **Data**: Requires updating unit schemas and JSON files across all supported games to include `maxLevel` and handling for infinite growth flags.
- **UI**: Significant changes to `StatProgressionTable.tsx` to handle dynamic row generation (negative rows, variable table endpoints) and the "Promotion Levels" configuration UI.
- **Logic**: Modifications to `lib/stats.ts` to respect `maxLevel`, Trainee negative levels, and infinite level formatting when generating the stat progression array.
