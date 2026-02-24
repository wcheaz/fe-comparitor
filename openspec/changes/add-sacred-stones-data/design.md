## Context

Fire Emblem: The Sacred Stones (FE8) introduces branching promotions and "Trainee" classes (Ross, Amelia, Ewan) that can promote multiple times (e.g., Journeyman -> Fighter -> Warrior). Certain other Fire Emblem games also feature more than two tiers of classes (e.g., Radiant Dawn, Echoes: Shadows of Valentia). The current application architecture assumes a strict unpromoted -> promoted (2-tier) pipeline. To fully support FE8 and future-proof the application, the system must handle multi-tier, branching promotion paths dynamically.

## Goals / Non-Goals

**Goals:**
- Eliminate any special-casing for "Trainees" or specific class tiers.
- Enable class data to recursively define promotions via `promotesTo`, supporting an arbitrary number of promotion tiers.
- Update the stat progression math to resolve stats correctly as a unit traverses multiple class tiers.
- Allow the UI to present branching promotion choices to the user at each viable promotion level.

**Non-Goals:**
- Modifying the underlying combat or skill systems; this is strictly focused on stat progression and class pathing.
- Implementing automatic "best path" calculators.

## Decisions

- **Recursive Promotion Resolution:** The `promotesTo` array in `Class` data will be the sole source of truth for the promotion tree. A unit's starting class defines base stats and growths. When promoting, we simply look up the chosen class in `promotesTo`, apply its `promotionBonus`, and set it as the new active class. This seamlessly supports N-tiers of promotion without any tier-specific logic.
- **Path Selection State:** Since units may have branching promotions at multiple tiers (e.g., Trainee branches to Basic, Basic branches to Advanced), the UI state must change from tracking a simple `isPromoted` or `promotionLevel` to tracking an array of `PromotionEvent` objects containing `{ level, selectedClassId }`.
- **Level Resets:** For games where level resets to 1 upon promotion (like GBA games), the stat calculator will reset the internal level counter while tracking cumulative stats across the full 1-40 (or 1-60+) progression grid.

## Risks / Trade-offs

- **Risk: Increased complexity in `StatProgressionTable.tsx`** -> **Mitigation:** Isolate the promotion path selection into a dedicated sub-component that emits a cleaned array of chosen classes and levels to the main table.
- **Risk: Infinite promotion loops in data** -> **Mitigation:** Ensure data formatting guidelines (like `FORMATTING.md`) strictly forbid cyclic `promotesTo` references.
