## Context

Currently, the Fire Emblem Unit Comparator allows users to view a unit's base stats, growth rates, and an estimated average stats table at a specific level selected via a slider. However, there is no comprehensive view that visualizes a unit's complete stat progression trajectory from their starting level up to their maximum potential. 
Adding a stat progression table will allow users to quickly scan and compare how a unit's stats (and those of another compared unit) scale over time without having to constantly scrub a slider.

## Goals / Non-Goals

**Goals:**
- Implement a comprehensive stat progression table component (`StatProgressionTable.tsx`).
- Provide rows for each level from the unit's base level to the level cap (default 40 effective level).
- Properly handle promotion resets (e.g., reaching level 20 unpromoted -> level 1 promoted).
- Gracefully handle cases where compared units have different base levels by padding the table with empty/null indicators for higher-level units until the table row reaches their base level.
- Support games with multiple promotions or extended level caps via an expansion toggle (up to level 100).
- Integrate with existing units data, detecting default promoted units (such as Marcus) and starting their table entries correctly at level 20 promoted.

**Non-Goals:**
- We are not changing the core calculation logic for how average stats are generated (we will reuse the existing calculation functions, iterating over the levels).
- We are not plotting this vertically/visually as a graph in this specific change (we already have a Recharts `GrowthChart`); this is a tabular data view.

## Decisions

- **Reusing Calculation Logic:** We will map over a range of levels and call the existing stat calculation logic for each row. This keeps the data consistent with the slider view.
- **Table Expansion Toggle:** To avoid overwhelming the UI with unnecessary rows (since most standard playthroughs cap functionally around level 40), the table will default to calculating up to level 40 (or effective level 40 for promoted units). A "Show Extended Levels" toggle will render rows up to level 100 to support games like *Shadows of Valentia* or infinite grinding scenarios.
- **Handling Mismatched Levels:** If Unit A starts at level 5 and Unit B starts at level 10, the table rows will begin at level 5. For rows 5 through 9, Unit B's cells will display a `-`. This provides a clean, aligned visual comparison once both units reach the same effective level.

## Risks / Trade-offs

- **Performance Risk:** Calculating average stats for 100 levels simultaneously for two units might cause slight rendering delays. 
  - *Mitigation:* We will memoize the calculation logic heavily using `useMemo` so that the table only recalculates when the selected units change.
- **Table Width Constraints:** Depending on the number of stats a game has, the screen might get cramped horizontally.
  - *Mitigation:* The table container will be `overflow-x-auto` to allow horizontal scrolling on smaller screens, matching the behavior of the existing `StatTable`.
