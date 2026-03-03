# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

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

## Specifications

branching-promotions/spec.md
## MODIFIED Requirements

### Requirement: Multi-Tier Promotion Support
The system SHALL support and track sequential promotion events for units that can promote multiple times or reclass linearly.

#### Scenario: Unit promotes through multiple tiers
- **WHEN** a unit promotes from a base class to an advanced class, and then to a third-tier class
- **THEN** the system tracks the selected class for each level threshold and applies the appropriate sequence of class bases and promotion bonuses.

#### Scenario: System provides UI to append multi-tier promotions
- **WHEN** the user is viewing the "Promotion Levels" section for a unit
- **AND** the currently selected class for their latest promotion event has valid entries in its `promotesTo` array
- **THEN** the system renders a "+" button that, when clicked, adds a new sequential promotion event to the unit's timeline.

#### Scenario: System provides UI to remove multi-tier promotions
- **WHEN** a unit has more than one promotion event configured
- **THEN** the system renders a "-" button next to the "+" button that, when clicked, removes the most recently added promotion event from the unit's timeline.

stat-progression-table/spec.md
## MODIFIED Requirements

### Requirement: Table Range and Base Level Padding
The table SHALL span from the lowest base level or trainee offset of the selected units up to the highest calculated `maxLevel` across all selected units (or level 40 by default if no `maxLevel` caps are found), padding out-of-bounds units with `-`.

#### Scenario: Units with mismatched base levels
- **WHEN** Unit A has base level 1 and Unit B has base level 5
- **THEN** the table begins at level 1, and rows 1-4 display `-` for Unit B's stats.
- **THEN** at level 5, Unit B's stats begin to display.

#### Scenario: Unit with Trainee negative offset levels
- **WHEN** Unit A is a Trainee with 10 offset levels (conceptually -10 to 0) and Unit B is a standard unit with base level 1
- **THEN** the table begins at the offset equivalent of -10.
- **AND** rows -10 through 0 display `-` for Unit B's stats while Unit A's trainee stats are calculated.

#### Scenario: Unit exceeds their max level
- **WHEN** the current table row level exceeds the specific `maxLevel` defined for a unit
- **THEN** that unit's stat cells render as `-` for all subsequent rows, indicating they cannot grow further.

### Requirement: Table Range Expansion
The table SHALL provide a toggle to expand the displayed levels up to level 100, or adapt to infinite scrolling if an infinite `maxLevel` flag is present.

#### Scenario: User wants to see extended levels
- **WHEN** the user clicks the "Expand to Level 100" toggle
- **THEN** the table generates and displays rows up to effective level 100.

#### Scenario: Unit has infinite level cap
- **WHEN** a selected unit has a `maxLevel` set to "infinite"
- **THEN** the table's upper bound is uncapped or set to a high visual limit (e.g., 100) regardless of the standard default.

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions by resetting the displayed level counter to 1 while maintaining internal cumulative progression, unless the unit's game mechanics dictate continuous leveling.

#### Scenario: Unit crosses level 20 unpromoted
- **WHEN** a row is generated for a standard unit passing unpromoted level 20
- **THEN** the row label indicates "Level 1 (Promoted)" instead of "Level 21".

#### Scenario: Unit has infinite sequential leveling
- **WHEN** a row is generated for a unit from a game that does not reset levels on promotion/reclass (e.g., infinite growth mechanics)
- **THEN** the row label continues sequentially (e.g., "Level 21") without appending "(Promoted)".

unit-level-caps/spec.md
## ADDED Requirements

### Requirement: Maximum Level Tracking
The system SHALL support tracking and utilizing a unit-specific maximum level cap derived from game data.
#### Scenario: Unit with standard level cap
- **WHEN** a standard unpromoted unit (e.g., Roy) is loaded
- **THEN** their `maxLevel` is implicitly or explicitly set to 20.
#### Scenario: Unit with extended level cap
- **WHEN** a special unit (e.g., FE10 unit with 3 tiers) is loaded
- **THEN** their cumulative `maxLevel` represents their absolute maximum achievable level across all tiers (e.g., 60).

### Requirement: Trainee Level Representation
The system SHALL support and calculate stats for units starting at "negative" relative levels to represent pre-base classes (Trainees).
#### Scenario: Trainee unit loads
- **WHEN** an FE8 Trainee (e.g., Amelia) is loaded
- **THEN** the system calculates their initial 10 levels as levels -10 to 0 (or equivalent internal offset) before they reach standard level 1.

### Requirement: Infinite Leveling Flag
The system SHALL support a flag indicating a unit or game allows for infinite leveling/reclassing loops.
#### Scenario: Game with infinite leveling
- **WHEN** a unit from a game with infinite reclassing (e.g., FE13/FE14) is processed
- **THEN** the system ignores absolute max level caps and allows the level counter to scale indefinitely up to the table's visual rendering limit.



## Design

## Context
Currently, the `StatProgressionTable` generates levels and stats assuming a standard 1-20 unpromoted to 1-20 promoted flow. When a unit can promote multiple times (e.g., FE8 Trainees like Amelia, or multiple reclassing tiers) or has unique level constraints (infinite growth, higher level caps), the table bounds, level counting, and stat progression algorithms break. We need to introduce multi-tier promotion tracking and flexible level bounding to support these mechanics.

## Goals / Non-Goals

**Goals:**
- Refactor the UI to dynamically add and remove multiple promotion events for a single unit.
- Properly map negative/offset levels for Trainee units (e.g., levels -10 to 0).
- Support variable unit maximum levels (`maxLevel`), stopping stat calculations and rendering `-` when exceeded.

**Non-Goals:**
- Supporting infinite, arbitrary horizontal reclassing (FE11+ style) - this design focuses on linear or branching forward promotion/class advancements.
- Generating table rows infinitely; the table should still cap at a reasonable maximum visual bound based on the selected units.

## Decisions

1. **`PromotionEvent` UI Management**: 
   - The "Promotion Levels" UI in `StatProgressionTable` will change from a static pair of inputs to a dynamic list.
   - We will add `+` and `-` buttons that trigger handlers to append/pop elements from the `promotionEvents` array explicitly for units whose class trees support it.
   
2. **Trainee Level Virtualization**: 
   - Instead of breaking the 1-indexed level paradigm, we will represent Trainee levels conceptually in the table as starting below the standard tier structure (e.g., using `Level X (Trainee)` strings). The `generateProgressionArray` function will be updated to handle pre-base offset math.

3. **`maxLevel` Property**: 
   - We will introduce a `maxLevel?: number | "infinite"` property to the `Unit` data schema. 
   - The stat generation loop will halt stat accumulation if the internal counter exceeds this value, emitting a flag that forces the UI to render `-`.
   - The overall table's rendering bounds will query all selected units' `maxLevel`s to determine how far down to render rows by default.

## Risks / Trade-offs

- **[Risk]** Clunky UI with too many promotion dropdowns. → **Mitigation**: Only show the `+` button if the *currently active class* in the unit's final promotion event has an available `promotesTo` array.
- **[Risk]** Stat generation logic `generateProgressionArray` becoming overly complex and breaking existing unit calculations. → **Mitigation**: Ensure backward compatibility. Units without `maxLevel` default to the standard 40/20 caps. Standard FE7/FE6 calculations should pass cleanly through the updated loops if `promotionEvents` length is 1.

## Current Task Context

## Current Task
- - [/] 10.1 **Diagnose**: In `StatProgressionTable.tsx` (around line 348), the `.map` iteration relies on a hardcoded array of `[{ level: 20, selectedClassId: unitClass?.promotesTo?.[0] || '' }]` if `promotionEvents[unit.id]` is empty. This forces the table's internal array data mapper to assume the unit promotes at level 20 initially, even though the `<select>` tag maps its values independently to force `10` visually.
## Completed Tasks for Git Commit
- [x] 1.1 Update the `Unit` interface in `types/unit.ts` (around line 44) to include `maxLevel?: number | "infinite"`.
- [x] 1.2 Update the documentation in `hidden/FORMATTING.md` to detail the new `maxLevel` property within the Unit Schema configuration.
- [x] 2.1 Refactor `generateProgressionArray` in `lib/stats.ts` (specifically the loop bounds starting passing line 288) to support negative offset numerical levels for Trainees.
- [x] 2.2 Update `generateProgressionArray` in `lib/stats.ts` to respect `unit.maxLevel`, halting stat accumulation or emitting `isSkipped = true` for row bounds that exceed the arbitrary cap.
- [x] 2.3 Refactor the internal `tier` tracking and level capping inside `generateProgressionArray` (lines 288-340) to account for infinite continuous leveling loops if `maxLevel === "infinite"`.
- [x] 2.4 Update the promotion tier evaluation logic in `generateProgressionArray` (lines 234-286 and 300-340) to iterate sequentially through the full `promotionEvents` array for multi-tier promotion stat stacking, rather than exclusively processing index 0.
- [x] 3.1 In `components/features/StatProgressionTable.tsx` (around lines 87-88), replace the hardcoded `const minLevel = 1;` and `const maxLevel = 40;` to dynamically compute boundaries by querying the minimum base level and maximum `maxLevel` values inside the `units` array.
- [x] 3.2 Update the `for (let i = 0; i < totalLevels; i++)` loop in `StatProgressionTable.tsx` (line 124) to properly map rows when traversing from negative trainee bounds upwards.
- [x] 3.3 Ensure the table cell output logic inside `StatProgressionTable.tsx` (lines 452+ inside tbody) outputs `-` for units whose level exceeds their calculated `maxLevel` bound.
- [x] 4.1 In `app/comparator/page.tsx` (line 14), ensure the `promotionEvents` state handler can smoothly process array push/pop operations passed from child components.
- [x] 4.2 In `components/features/StatProgressionTable.tsx` (lines 297-354), modify the UI rendering of the `<select>` level and class inputs to dynamically `.map()` across the `promotionEvents[unit.id]` array instead of hardcoding to index `[0]`.
- [x] 4.3 Implement a `+` `<button>` in `StatProgressionTable.tsx` (within the promotion section mapping) that triggers `onPromotionEventsChange` to append a new sequential `PromotionEvent` if the current final selected class natively supports further `promotesTo` branching.
- [x] 4.4 Implement a `-` `<button>` in `StatProgressionTable.tsx` (within the same promotion mapping block) that triggers `onPromotionEventsChange` to pop the trailing promotion event from `promotionEvents[unit.id]`, disabling the button if the array length is 1 or less.
- [x] 5.1 In `StatProgressionTable.tsx`, define a constant list or helper function (e.g., `isTraineeClass`) to identify FE8 trainee class IDs (`recruit`, `recruit_2`, `pupil`, `pupil_2`, `journeyman`, `journeyman_2`).
- [x] 5.2 Within the `.map()` for `promotionEvents` (around line 323), resolve the `currentTierClass` for the dropdown row. For tier 1 (`eventIndex === 0`), this is the unit's base class. For tier 2+, it's the class from `promotionEvents[unit.id][eventIndex - 1].selectedClassId`.
- [x] 5.3 Implement conditional logic for the level `<select>` (around line 346): if `isTraineeClass(currentTierClass)`, only render an `<option value={10}>10</option>`. Otherwise, render the standard 10-20 mapped array.
- [x] 5.4 When adding new promotion tiers to trainees via the `onPromotionEventsChange` handlers, default the new event's `level` property to `10` instead of `20` if the prior class is a trainee class.
- [x] 6.1 **Diagnose**: When `promotionEvents[unit.id]` is undefined, the `+` button calls `onAddPromotionEvent` with ONLY the new Tier 2 event. This sets state to `[Tier 2]`, overriding Tier 1 and hiding the `+` button. Similarly, dropdown `onChange` handlers fail to properly scaffold Tier 1.
- [x] 6.2 **Fix Dropdowns**: In `StatProgressionTable.tsx`'s level and class `<select onChanges>`, if `promotionEvents[unit.id]` is undefined/empty, explicitly seed `updatedEvents` with `[{ level: 20, selectedClassId: unitClass?.promotesTo?.[0] }]` before applying the user's new change.
- [x] 6.3 **Fix `+` Button**: In the `+` button `onClick`, replace `onAddPromotionEvent` entirely. Instead, seed `currentEvents` with the fallback Tier 1 event if empty. Then push the new Tier 2+ event. Finally, use `onPromotionEventsChange` to save the full array (`[Tier 1, Tier 2]`).
- [x] 6.4 **Fix `-` Button**: In the `-` button `onClick`, replace `onRemovePromotionEvent`. If `events.length > 1`, pop the last element and call `onPromotionEventsChange` directly. Ensure `page.tsx`'s supplementary add/remove functions are no longer needed.
- [x] 7.1 **Diagnose**: `getFinalTierClass()` currently returns `unitClass` when `events.length === 0`. Since Roy can promote once, `unitClass.promotesTo.length > 0` is true, so `canAddPromotionTier` is true. But the default UI already *shows* his only promotion, which CANNOT promote further.
- [x] 7.2 **Fix**: In `StatProgressionTable.tsx` (around line 337), change the fallback return of `getFinalTierClass()` to be the default *promoted* class currently displayed: `return classes.find(c => c.id === unitClass?.promotesTo?.[0])`.
- [x] 7.3 **Test**: Verify that units with only 1 promotion tier (like Roy or Neimi) no longer display the `+` or `-` buttons under their name, while multi-tier units (Amelia, Ross) correctly show them.
- [x] 8.1 In `StatProgressionTable.tsx` (inside the `promotionEvents` `.map()` block around line 323), calculate the starting class for *each specific tier iteration* (`eventIndex`).
- [x] 8.2 For `eventIndex === 0`, derive the `classOptions` from the unit's base class. For `eventIndex > 0`, derive the `classOptions` using the `selectedClassId` from the *previous* tier's event (`promotionEvents[unit.id][eventIndex - 1]`).
- [x] 8.3 Calculate `tierPromotionOptions` and `tierHasBranchingOptions` locally within this map loop using the correct tier class, passing it into the `getPromotionOptions` and `hasBranchingPromotions` helper functions.
- [x] 8.4 Render the class selection `<select>` dropdown using these locally scoped `tierPromotionOptions`, ensuring that Tier 2+ correctly displays branching choices (like Paladin/General for Tier 1 Cavalier/Knight completions) rather than incorrectly displaying Tier 1 options again.
- [x] 9.1 **Diagnose**: The level and class `<select>` inputs in `StatProgressionTable.tsx` are using `disabled={!canAddPromotionTier}`. Because `canAddPromotionTier` evaluates whether the *end of the promotion chain* can promote further, it becomes `false` as soon as the final tier is reached (like Roy's only promotion, or Amelia's final Paladin tier), incorrectly locking all previously selectable dropdowns for that unit. Additionally, units unable to promote at all (like Seth) still render a broken, empty tier because the map loop unconditionally executes.
- [x] 9.2 **Fix Un-Promotables**: In `StatProgressionTable.tsx` (around line 348), define `const unitCanPromote = (unitClass?.promotesTo?.length ?? 0) > 0`. Wrap the entire `(promotionEvents[unit.id] || [...]).map(...)` block in `if (unitCanPromote)`. If `!unitCanPromote`, render a fallback message like `<span className="text-gray-400 text-sm ml-2">Cannot promote</span>` instead of dropdowns.
- [x] 9.3 **Fix Dropdowns**: Change the `disabled` property on both the level and class `<select>` elements to simply `disabled={!unitCanPromote}` instead of `disabled={!canAddPromotionTier}`. This ensures the inputs remain freely editable as long as the base unit possesses promotion capabilities, while keeping the `+` button natively tied to the `canAddPromotionTier` constraint.
- [x] 10.2 **Fix**: When generating the fallback map array (`promotionEvents[unit.id] || [...]`), dynamically check `if (isTraineeClass(unitClass?.id || ''))` and construct the fallback event with `level: 10` instead of `20`.
- [x] 11.1 **Diagnose**: The component's table engine expects `generateProgressionArray` to receive accurate events. When the core map loop resolves `currentTierClass` (line 351), it queries `promotionEvents[unit.id][eventIndex - 1]?.selectedClassId`.
- [x] 11.2 **Fix Array Generation Consistency**: In `StatProgressionTable.tsx` `+` button click handler, ensure that the newly pushed tier event correctly assigns `selectedClassId` as `lastSelectedClass.promotesTo[0]`, which populates the next row's `currentTierClass` so it displays branching options instead of rendering a blank `<select>`.
