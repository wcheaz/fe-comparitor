# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

The website is currently very plain and not user-friendly. The vertical layout makes it difficult to quickly compare two units side-by-side. Moving to a horizontal layout will vastly improve the UX and readability of the tool.

## What Changes

- Redesign the unit comparison view to be horizontal rather than vertical.
- Create specific sections for each major category of comparison so that details align vertically (e.g., unit 1's join chapter is on the left, unit 2's join chapter is on the right at the same vertical position).
- Apply this horizontal alignment to all major unit detail categories, including but not limited to:
  - Join Chapter
  - Unit Growths
  - Unit Bases
  - Unit average stats across all levels as a single combined table (starting at the lower base level among compared units; if a unit starts at a higher level than another, their stats for earlier levels should be shown as "-")
  - Unit support list
- Format stats (like growths and bases) as tables, preferring horizontal table layouts for easier parsing.
- Fix broken CSS affecting elements like text color to ensure the page is styled correctly and functionally intact.

## Capabilities

### New Capabilities

- `horizontal-comparison`: Implement side-by-side horizontal comparison for unit details, including aligned sections for join chapter, growths, bases, average stats, and supports, along with table-based stat formatting.
- `ui-styling-fixes`: Fix broken CSS rules to restore intended text colors and overall visual design of the application.

### Modified Capabilities

## Impact

- **UI/Layout**: Complete overhaul of the unit comparison page layout.
- **Components**: Updates to all components that render unit stats (growths, bases, averages, supports) to support table formatting and horizontal arrangement.
- **Styling**: Extensive updates to global and component-level CSS to fix broken styles and support the new layout.

## Specifications

horizontal-comparison/spec.md
## ADDED Requirements

### Requirement: Horizontal Unit Details Layout
The system SHALL display unit details (join chapter, supports) side-by-side horizontally so that compared units align vertically.

#### Scenario: Comparing two units
- **WHEN** two units are selected for comparison
- **THEN** their details (like join chapter and supports) appear side-by-side at the same vertical position on the page

### Requirement: Stats Displayed as Tabular Format
The system SHALL format unit stats (growths, bases) as horizontal tables for easier parsing.

#### Scenario: Viewing unit growths
- **WHEN** viewing the unit growths section
- **THEN** the growths are displayed in a clean horizontal table format

### Requirement: Combined Average Stats Table
The system SHALL combine the average stats for compared units into a single table across all levels. The table SHALL start at the lowest base level among the compared units. If a unit's base level is higher than the table's starting level, its stats for the earlier levels SHALL be displayed as "-".

#### Scenario: Comparing units with different base levels
- **WHEN** comparing a level 5 unit and a level 10 unit
- **THEN** a combined average stats table is displayed starting at level 5
- **AND** the level 10 unit's stats from level 5 to 9 are displayed as "-"

ui-styling-fixes/spec.md
## ADDED Requirements

### Requirement: Restored Text Colors and Theme
The system SHALL ensure that core CSS rules are functional such that all text colors, backgrounds, and overall visual design are rendered correctly as intended.

#### Scenario: Viewing the comparison page
- **WHEN** a user navigates to the unit comparison page
- **THEN** the text colors and layout elements display correctly according to the intended design



## Design

## Context

The Fire Emblem Unit Comparator currently displays unit stats and details (such as join chapter, growths, bases, and averages) in a vertical layout. This makes it difficult for users to quickly compare units side-by-side as they must scroll or look back and forth between far-apart sections. The current CSS is also broken, preventing proper visual styling (e.g., text color, background). 

## Goals / Non-Goals

**Goals:**
- Transition the unit comparison layout from a vertical arrangement to a horizontal, side-by-side arrangement.
- Ensure details like join chapter, growths, and bases align horizontally across the compared units.
- Format numerical stats (growths, bases) into horizontal tables.
- Combine unit average stats into a single table across all levels, handling units with different starting base levels.
- Fix broken CSS rules to restore the intended visual themes and text colors.

**Non-Goals:**
- Completely rewriting the underlying stat calculation logic.
- Adding details/stats that are not currently part of the application context (e.g. adding new character attributes beyond what is already supported).

## Decisions

- **Combined Average Stats Table Construction:**
  - *Decision:* The combined average stats table will calculate its row index based on the lowest base level of the compared units. For units whose base level is higher than the current row's level, the UI will display a `-` character instead of numerical stats.
  - *Rationale:* This ensures visual continuity and alignment, making it immediately clear when a unit is unavailable or their base stats are not applicable at that specific level.
- **CSS Grid/Flexbox for Layout Alignment:**
  - *Decision:* Use CSS Grid and/flexbox to enforce horizontal alignment of major feature categories. 
  - *Rationale:* CSS Grid is well-suited for ensuring specific blocks (like the "Join Chapter" row or "Growths" table) maintain identical vertical placement across multiple unit columns, even if one unit's data takes up more space natively. Flexbox will be used for simpler horizontal alignments within individual tables.
- **Styling Fixes Strategy:**
  - *Decision:* Re-evaluate `globals.css` and the theme config to ensure text colors have appropriate contrast and are fully functional.

## Risks / Trade-offs

- **Risk:** The combined average stats table could become extremely long vertically if the level cap is high (e.g. 40 levels).
  - *Mitigation:* Ensure the table is clearly designed and possibly allow internal scrolling if it breaks the main page layout.
- **Risk:** Mobile responsiveness might suffer with a side-by-side horizontal comparison and table layouts.
  - *Mitigation:* The horizontal comparison should ideally gracefully degrade to a vertical layout (or require horizontal scrolling) on very small screens to maintain usability.

## Current Task Context

## Current Task
- - [ ] 6.1 **Analyze Persistent Issue**: The previous agent successfully applied the grid classes to `ComparisonGrid.tsx`, but the browser still renders everything vertically without styling. 
## Completed Tasks for Git Commit
- [x] 1.1 Review `app/globals.css` and fix `text-*` and `bg-*` classes to ensure readability across the `fe-blue` and `fe-gold` theme. Make sure `--foreground` contrasts well with `--background`.
- [x] 1.2 Modify `Card` component's default text coloring inside `app/globals.css` or the related tailwind classes to fix unreadable contrast issues in `UnitCard` and `StatTable`.
- [x] 1.3 Update the standard table header and row CSS inside `globals.css` (e.g., `thead`, `tr`, `th`, `td`) to improve the contrast and visibility of tabular data.
- [x] 2.1 Refactor `app/comparator/page.tsx`'s layout container (`<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">`) and main content area to handle the new horizontal layout.
- [x] 2.2 Update `components/features/ComparisonGrid.tsx` to display specific statistics (like join chapter, growths, bases) aligned horizontally. 
- [x] 2.3 Move unit-specific details (like `JoinChapter`, `Class`, etc.) from individual vertical `UnitCard` components into horizontal side-by-side rows matching the `ComparisonGrid` style.
- [x] 2.4 Re-style `components/features/UnitCard.tsx` to just act as a headers for the units (Name, Portrait) rather than housing all details vertically.
- [x] 3.1 Refactor the `StatTable` component in `components/features/StatTable.tsx` to exclusively render base stats and growths. It should no longer handle the `averageStats` or `showAverage` prop.
- [x] 3.2 Ensure `StatTable.tsx` outputs a strictly horizontal table per unit or integrates into the main `ComparisonGrid` table loop to ensure perfect horizontal alignment.
- [x] 4.1 In `lib/stats.ts` (or equivalent utility), create a new helper function `calculateAverageStatsAtLevel(unit, level)` if it doesn't already exist, and calculate the maximum potential level across all compared units.
- [x] 4.2 In `components/features/ComparisonGrid.tsx`, determine the lowest base level (`unit.level`) among all selected units (`Math.min(...units.map(u => u.level))`).
- [x] 4.3 Create a new component `<CombinedAverageStatsTable units={units} maxLevel={maxLevel} />`.
- [x] 4.4 In `<CombinedAverageStatsTable>`, render a table row for *every level* from the lowest base level up to the `maxLevel` (typically 20 or 40).
- [x] 4.5 In the rendering loop for each level row, check if `rowLevel < unit.level`. If true, render `-` for that unit's stats in that row.
- [x] 4.6 If `rowLevel >= unit.level`, use `calculateAverageStats(unit, rowLevel)` to populate that unit's cell for that specific level.
- [x] 4.7 Integrate the `<CombinedAverageStatsTable>` at the bottom of the `<ComparisonGrid>`, completely replacing the existing target level average display mechanism and the `LevelSlider.tsx` control.
- [x] 5.1 **Analyze Current Implementation**: In `ComparisonGrid.tsx` and `app/units/[id]/page.tsx`, the layout relies on a `<div className="space-y-6">` wrapper to stack major unit detail sections (Basic Information, Base Stats, Growth Rates, etc.) vertically. While the data inside the tables correctly compares units horizontally, the parent structural containers are stacked block-level elements, creating a single "long list".
- [x] 5.2 **Diagnose Why It's Not Working**: The CSS meant to output a "2 column grid" is missing at the container level. The `space-y-6` class inherently applies vertical block flow. The tables themselves rely on `overflow-x-auto` which requires specific handling in grid systems. The user expects the *stat tables themselves* (Base Stats vs Growth Rates) or the *unit details cards* to sit perfectly adjacent to each other on wider screens.
- [x] 5.3 **Steps to Fix the CSS Styling**:
