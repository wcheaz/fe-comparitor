# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

When comparing two units, it is not immediately obvious at a glance which unit has the superior stat (e.g., higher growth rate or base stat). Highlighting the better value makes the comparison grid much easier to read and allows users to quickly identify a unit's strengths over another without having to mentally compare the numbers.

## What Changes

- The comparison grid cells for stats (bases, growths, averages) will be updated to visually indicate the superior value.
- If Unit A has a higher value than Unit B for a specific stat, Unit A's cell will have a green background.
- If Unit B has the higher value, Unit B's cell will be green.
- If the values are equal, neither cell is highlighted.

## Capabilities

### New Capabilities
- `stat-highlighting`: Adds visual highlighting to the higher of two compared stats in the comparison grid.

### Modified Capabilities


## Impact

- `components/features/CombinedAverageStatsTable.tsx` and potentially other stat tables if they compare units side-by-side.
- Utility functions may need to be added to easily compare the stats.
- CSS/Tailwind styling for the grid cells to apply the green highlight.

## Specifications

stat-highlighting/spec.md
## ADDED Requirements

### Requirement: Stat Highlighting
The system SHALL visually highlight the superior stat value when comparing two units side-by-side in the comparison grid.

#### Scenario: Unit A has higher stat
- **WHEN** Unit A's calculated stat (base, growth, or average) is strictly greater than Unit B's corresponding stat
- **THEN** Unit A's stat cell SHALL have a distinct background color (e.g., green highlight) to indicate superiority, and Unit B's cell SHALL have no highlight.

#### Scenario: Unit B has higher stat
- **WHEN** Unit B's calculated stat is strictly greater than Unit A's corresponding stat
- **THEN** Unit B's stat cell SHALL have the distinct highlight color, and Unit A's cell SHALL have no highlight.

#### Scenario: Stats are equal
- **WHEN** Unit A's calculated stat is exactly equal to Unit B's corresponding stat
- **THEN** neither Unit A's nor Unit B's stat cell SHALL have any highlight.

#### Scenario: Missing stat
- **WHEN** either Unit A or Unit B is missing the stat being compared (e.g., value is undefined or N/A)
- **THEN** neither cell SHALL be highlighted.



## Design

## Context

Currently, the `CombinedAverageStatsTable` and related comparison grids display stats for two units side-by-side but rely on the user to visually parse and identify which stat is higher. This can be tedious for large numbers of stats. We want to add a visual highlight to the "better" stat in each row when comparing Unit A and Unit B to improve the UX.

## Goals / Non-Goals

**Goals:**
- Visually highlight the higher stat value when comparing two units.
- Apply highlighting to Base Stats, Growth Rates, and Average Stats tables on the comparison page.
- Ensure the highlight is visually accessible and blends well with the existing dark mode theme.

**Non-Goals:**
- Making the highlighting color customizable by the user.
- Highlighting stats where a literal "lower" value might be considered better, unless specifically required. We will assume for standard combat stats (HP, Str, Mag, Spd, etc.) that higher is better.

## Decisions

- **Decision 1: Utility function vs. Inline comparison**
  - We will use an inline comparison (`valA > valB`) for most numeric stats since it is simple and effective. If specific stats ever require a "lower is better" logic in the future, we can refactor this into a dedicated utility function (`getBetterStat(stat, valA, valB)`).

- **Decision 2: Styling method**
  - We will use Tailwind CSS utility classes to apply the visual highlight.
  - *Rationale:* The project is already styled with Tailwind. Applying a background color class (e.g., `bg-green-500/20` or a theme-specific success color) dynamically based on the comparison result is the most idiomatic React/Tailwind approach.

## Risks / Trade-offs

- **Risk:** The background color might clash with the existing text colors or zebra-striping in tables.
  - *Mitigation:* We will use a subtle, low-opacity background color (like `bg-green-500/20` or `bg-green-900/30` in dark mode) to ensure text remains highly readable.

- **Risk:** Handling undefined or missing stats (e.g., older games might not have a Magic stat for physical units).
  - *Mitigation:* The comparison logic must gracefully handle `undefined` values. If either value is missing, no highlight should be applied.

## Current Task Context

## Current Task
- - [ ] 1.1 Create inline logic or a helper function to determine the highest numeric value among a set of stat values for a given row.
