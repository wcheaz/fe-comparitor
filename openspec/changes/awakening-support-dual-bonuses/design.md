## Context

The application currently has a GBA and Path of Radiance affinity system. However, Fire Emblem: Awakening does not use elemental affinities; instead, it uses the "Dual System" (Pair Up, Dual Support, Dual Strike, and Dual Guard) to calculate bonuses and activation rates when two units support each other. We need to implement this custom system in code and display it dynamically when a user inspects supports for an Awakening unit.

## Goals / Non-Goals

**Goals:**
- Hide the "Affinities: None + None" line in the support bonuses modal when affinities are absent.
- Create a dedicated library `lib/supports-awakening.ts` containing the lookup tables and formulas for the Awakening Dual System.
- Integrate the Awakening calculations into the support details modal (`ComparisonGrid.tsx`), displaying Pair Up bonuses, Dual Support ranks/bonuses, and Dual Strike/Guard rates for C, B, A, and S support ranks.
- Account for character skills (like "Dual Support+", "Dual Strike+", "Dual Guard+") in calculation rates.

**Non-Goals:**
- Modifying the underlying JSON database schemas for other games.
- Real-time combat forecasting or dynamic inventory adjustments in the support modal.

## Decisions

### 1. Hardcoded Class Pair Up Lookup vs. Data-Driven JSON properties
- **Alternative A (Selected)**: Define the class Pair Up bonuses as a hardcoded static dictionary in `lib/supports-awakening.ts`.
  - *Rationale*: Avoids having to manually edit, validate, and maintain `pairUpBonus` fields for 40+ classes in `data/awakening/classes.json`. The classes are static and well-documented.
- **Alternative B**: Modify the class JSON schema and add `pairUpBonus` properties to each class.
  - *Rationale*: More data-driven but introduces high friction for minor schema updates.

### 2. Separate Helper Library vs. Inline Component Code
- **Alternative A (Selected)**: Create `lib/supports-awakening.ts` to house all lookup maps, formulas, and helper functions.
  - *Rationale*: Keeps `ComparisonGrid.tsx` clean and testable. Allows writing unit tests directly for the Dual System calculations.
- **Alternative B**: Write calculations directly inside `ComparisonGrid.tsx`.
  - *Rationale*: Code is co-located but increases component complexity and makes testing difficult.

## Risks / Trade-offs

- **Risk: Unit Stat Reference in Pair Up**: Pair Up bonuses depend on the helper unit's stats, but stats depend on their current level/class in the comparator.
  - *Mitigation*: Use the base/effective stats of the units at their current selected levels. If stats are missing or unavailable, fallback to class base stats.
- **Risk: Dual Support+ and Dual Strike+/Guard+ Skill Detection**: The active skills can change rates.
  - *Mitigation*: Parse the unit's `startingSkills` or current class skills to check for "Dual Support+", "Dual Strike+", and "Dual Guard+" and apply the bonuses automatically.
