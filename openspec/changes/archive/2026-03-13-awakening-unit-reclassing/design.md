## Context
Fire Emblem Awakening introduces a reclassing system via Second Seals and Master Seals, allowing units to change to a different class of the same tier (horizontal) or a promoted tier (vertical). When a unit reclasses, their level resets to 1, but they retain their accumulated stats. This means they can theoretically level up infinitely, constrained only by their absolute maximum stat caps. The current `StatProgressionTable` only supports linear or branching standard promotions, and its underlying array generation in `lib/stats.ts` assumes a flat maximum level scale.

## Goals / Non-Goals

**Goals:**
- Update `generateProgressionArray` in `lib/stats.ts` to support level resets to 1 upon reclassing, while carrying over accumulated stats and applying the new class's modifiers/growths.
- Modify `StatProgressionTable.tsx` and `PromotionOptionsDisplay.tsx` to handle an unbounded array of sequential `PromotionEvent` objects, where events can include reclassing into the same tier or a different tier.
- Accurately apply class level caps (20 for most, 30 for special classes) within each reclassing cycle.

**Non-Goals:**
- Implementing the specific UI for selecting the Second/Master seals (we will just allow class selection).
- Support for games other than Awakening right now (though the logic should be flexible enough to extend to Fates later).

## Decisions

- **Event-Driven Progression Logic:** The `promotionEvents` array will act as a chronological log of class changes. Each entry in the array will represent an event (either a standard promotion or a reclass).
- **Infinite Row Generation:** `generateProgressionArray` will loop continuously, generating rows. When it hits a level where a `PromotionEvent` occurs, it processes the class change, resets the internal tracking level to 1, recalculates the base stat offsets based on the new class modifiers, and continues generating rows using the new class's growth rates until the next event or the class level cap is reached.
- **Max Level Handling:** To prevent infinite loops in the UI when no further events exist, the generation will stop when the unit hits their final class's level cap (e.g., 20 or 30) after the last logged event.

## Risks / Trade-offs

- **Risk**: Performance issues in React rendering if a user inputs an excessive number of consecutive reclass events (e.g., 50 reclasses).
  - **Mitigation**: Implement a sensible hard cap on the number of `PromotionEvent` entries a user can add (e.g., max 10 events) or virtualize the table rows if performance severely degrades.
- **Risk**: Stat calculation inaccuracies due to complex modifier swapping.
  - **Mitigation**: Ensure that when a class change occurs, the previous class's stat modifiers are subtracted, and the new class's modifiers are added. Base stats should represent the raw accumulated stat points independent of class.
