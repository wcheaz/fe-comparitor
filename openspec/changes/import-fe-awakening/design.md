## Context

The current application can compare units across multiple Fire Emblem games (Binding Blade, Sacred Stones, Three Houses, Engage) by normalizing their stats and tracking their promotions. Fire Emblem Awakening introduces divergent mechanics:
1. **Personal vs. Class Growths**: A character's total growth rate is the sum of their personal absolute growths and the growths of their current class.
2. **Class Stat Modifiers**: Base stats for a unit are determined by their absolute personal base stats plus the absolute stat modifiers of their current class.
3. **Innate Weaknesses**: Some units (like Nowi or Panne) have inherent weaknesses (e.g., Dragon, Beast) regardless of their current class, distinct from the class-based weaknesses already modeled.
4. **Starting Skills**: Units can start with specific skills independent of their class abilities.

Integrating Awakening requires structural changes to the `Unit` and `Class` data models and the mathematical logic inside `lib/stats.ts`.

## Goals / Non-Goals

**Goals:**
- Update `types/unit.ts` to support personal base stats, class stat modifiers, personal growths, and class growths.
- Update `lib/stats.ts` and `lib/normalization.ts` to seamlessly calculate the sum of bases + modifiers and personal + class growths when generating average stats.
- Add an `innateWeaknesses` string array to the `Unit` model and display it in the Unit Details grid alongside/merged with class weaknesses.
- Support displaying starting skills.

**Non-Goals:**
- Implementing the "Child Unit" inheritance system (e.g., dynamic growths/bases based on parents) is completely out of scope for this iteration. 
- Pair Up stat calculations in the UI.

## Decisions

**1. Separation of Growths and Bases:**
- We will modify the `Unit` and `Class` schema. 
- For Awakening units, `Unit.stats` will represent their personal bases, and `Class.baseStats` will represent the Class modifiers. 
- *Rationale*: This strictly follows the internal math of Awakening while keeping the data entry clean. The normalization/averaging logic will check if a unit belongs to Awakening; if so, it will add `Unit.stats` and `Class.baseStats` to get the true starting stats.
- *Alternative*: Hardcoding the summed stats directly into the `Unit.stats` block for their starting class. *Rejected* because reclassing (Second Seals) in Awakening changes the class modifiers, so we need to track them independently to accurately calculate averages across different promotion paths.

**2. Innate Weaknesses:**
- We will add `innateWeaknesses?: string[]` to the `Unit` interface. 
- In the `ComparisonGrid` UI, the displayed weaknesses will be a deduplicated union of `unit.innateWeaknesses` and `unit.class.movementType.weaknesses`.

**3. Starting Skills:**
- We will add `startingSkills?: string[]` to the `Unit` interface. These will be rendered in the UI using the existing `AbilityPill` component, similar to how `classAbilities` are handled.

## Risks / Trade-offs

- **Risk**: Regression in calculation logic for FE6, FE7, FE8, FE16, or FE17 when adjusting the stats engine to sum personal and class stats. 
  - *Mitigation*: The summing logic in `lib/stats.ts` and `lib/normalization.ts` will be strictly gated behind a `unit.game === "Awakening"` check, ensuring legacy games still operate exclusively off their hardcoded unit bases.
- **Risk**: Missing stat properties if the schema mapping is incorrect.
  - *Mitigation*: Ensure all dummy stats (like `mag` or `con`) are appropriately mapped or explicitly zeroed out in the JSON parsing phase.
