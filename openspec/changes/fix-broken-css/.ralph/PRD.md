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
- - [ ] 1.1 Review `app/globals.css` and fix `text-*` and `bg-*` classes to ensure readability across the `fe-blue` and `fe-gold` theme. Make sure `--foreground` contrasts well with `--background`.
