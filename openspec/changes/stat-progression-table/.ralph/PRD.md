# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

Currently, there is no table that the user can view to see stat progression as levels increase. Adding a stat progression table to the unit comparator view will provide users with a significantly better understanding of how units grow over time, enabling deeper analytical comparisons. Furthermore, a unit's raw growth isn't the whole story—promotions play a massive role by providing flat stat bonuses and raising minimum base stats.

## What Changes

- Add a new stat progression table to the unit comparator view.
- Introduce `<game>_classes.json` data files to define class base stats, promotion bonuses, and hidden/innate class abilities (e.g., Flying, +30 Crit).
- Update stat calculation to accurately apply class promotion bonuses and floor stats to the new class's base stats upon promotion.
- Support displaying different stats as columns and unit levels as rows.
- The table will span from the lowest base level of the compared units up to level 40 by default.
- Integrate promotion logic: Once a unit hits level 20, they transition to level 1 promoted, and units promoted by default (like Marcus) start at level 20 promoted.
- Handle mismatched starting levels by displaying a "-" for higher-level units until the table reaches their base level.
- Support varying level caps across different Fire Emblem games.
- Add a toggleable option to expand the table up to level 100.

## Capabilities

### New Capabilities
- `stat-progression-table`: A dynamic table component that predicts and displays unit stats across all levels from base to level cap, accounting for multi-game promotion rules, varying base levels, and class specific base stats/bonuses.

### Modified Capabilities

## Impact

- `data/`: Will contain new `<game>_classes.json` files for the supported games.
- `lib/calculations.ts`: Logic will be expanded to support adding flat promotion bonuses and flooring units to class bases upon reaching promotion levels.
- `app/comparator/page.tsx`: Will need to incorporate the new table component.
- `components/features/`: Will house the new progression table component and its subcomponents.

## Specifications

stat-progression-table/spec.md
## ADDED Requirements

### Requirement: Stat Progression Table Exists
The system SHALL provide a table visualizing stat progression across levels for the compared units.

#### Scenario: User navigates to comparator with units selected
- **WHEN** the user has selected at least one unit in the comparator
- **THEN** a Stat Progression Table is rendered showing each stat as a column and increasing levels as rows.

### Requirement: Table Range and Base Level Padding
The table SHALL span from the lowest base level of the selected units up to level 40 by default, padding higher-level units with `-`.

#### Scenario: Units with mismatched base levels
- **WHEN** Unit A has base level 1 and Unit B has base level 5
- **THEN** the table begins at level 1, and rows 1-4 display `-` for Unit B's stats.
- **THEN** at level 5, Unit B's stats begin to display.

### Requirement: Table Range Expansion
The table SHALL provide a toggle to expand the displayed levels up to level 100.

#### Scenario: User wants to see extended levels
- **WHEN** the user clicks the "Expand to Level 100" toggle
- **THEN** the table generates and displays rows up to effective level 100.

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions by resetting the displayed level counter to 1 while maintaining internal cumulative progression.

#### Scenario: Unit crosses level 20 unpromoted
- **WHEN** a row is generated for a standard unit passing unpromoted level 20
- **THEN** the row label indicates "Level 1 (Promoted)" instead of "Level 21".

### Requirement: Accurate Promotion Stat Adjustments
The system SHALL apply appropriate statistical bonuses when a unit promotes, according to their new class data defined in the game's class data file.

#### Scenario: Unit receives promotion bonuses
- **WHEN** a unit's progression crosses their promotion level
- **THEN** their stats are increased by the class's specified promotion bonuses.

#### Scenario: Unit stats are floored by class bases
- **WHEN** a unit's stats upon promotion are lower than the new class's base stats
- **THEN** their stats are raised exactly to match the class base stats.

#### Scenario: Unit benefits from hidden class modifiers
- **WHEN** a unit promotes into a class with hidden bonuses (e.g., Swordmaster +30 Crit, Flying)
- **THEN** the system accounts for and displays these modifiers in their progression or detailed breakdown.



## Design

## Context

Currently, the Fire Emblem Unit Comparator allows users to view a unit's base stats, growth rates, and an estimated average stats table at a specific level selected via a slider. However, there is no comprehensive view that visualizes a unit's complete stat progression trajectory from their starting level up to their maximum potential. Additionally, true stat progression requires accounting for class promotions, which inherently alter stats via promotion bonuses and class bases. 
Adding a stat progression table and accurate class-based calculation logic will allow users to quickly scan and compare how a unit's stats scale over time.

## Goals / Non-Goals

**Goals:**
- Implement a comprehensive stat progression table component (`StatProgressionTable.tsx`).
- Introduce `<game>_classes.json` to store class characteristics, including base stats, promotion stat bonuses, and hidden/innate bonuses (like +30 Crit for Swordmasters or Flying properties).
- Accurate stat calculation upon promotion by augmenting unit stats with class promotion bonuses and flooring them to class base stats.
- Provide rows for each level from the unit's base level to the level cap (default 40 effective level).
- Properly handle promotion resets (e.g., reaching level 20 unpromoted -> level 1 promoted).
- Gracefully handle cases where compared units have different base levels by padding the table with empty/null indicators for higher-level units until the table row reaches their base level.
- Support games with multiple promotions or extended level caps via an expansion toggle (up to level 100).
- Integrate with existing units data, detecting default promoted units.

**Non-Goals:**
- We are not plotting this vertically/visually as a graph in this specific change (we already have a Recharts `GrowthChart`); this is a tabular data view.

## Decisions

- **Class Data Files:** We will introduce `<game>_classes.json` alongside the unit data. This separates unit-specific inherent properties from class-bound properties, keeping the architecture clean and allowing accurate processing of class changes.
- **Reusing Calculation Logic:** We will map over a range of levels. The core calculation function will be extended to conditionally apply promotion arrays and class base floors when a unit crosses the promotion threshold.
- **Table Expansion Toggle:** To avoid overwhelming the UI with unnecessary rows, the table will default to calculating up to level 40. A "Show Extended Levels" toggle will render rows up to level 100.
- **Handling Mismatched Levels:** If Unit A starts at level 5 and Unit B starts at level 10, the table rows will begin at level 5. For rows 5 through 9, Unit B's cells will display a `-`. 

## Risks / Trade-offs

- **Data Entry Overhead:** Manually adding class bonuses for every game requires significant JSON compilation.
  - *Mitigation:* We will start strictly with the requested classes or a localized subset for testing, scaling up data entry over time.
- **Performance Risk:** Calculating average stats for 100 levels simultaneously for two units, plus class logic checks, might cause slight rendering delays. 
  - *Mitigation:* We will memoize the calculation logic heavily using `useMemo`.

## Current Task Context

## Current Task
- - [ ] 1.1 Create `<game>_classes.json` files for each supported game (e.g., `binding_blade_classes.json`) containing class bases, promotion bonuses, and hidden modifiers.
