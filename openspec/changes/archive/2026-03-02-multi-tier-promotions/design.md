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
