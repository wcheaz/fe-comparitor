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
