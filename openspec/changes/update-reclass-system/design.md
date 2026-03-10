# Design: Reclass System

## Architecture

To support the Awakening/Fates reclassing system, we need to extend the core progression logic in `lib/stats.ts` and the UI controls. 

1. **Data Structures**
    - The `Unit` interface in `types/unit.ts` already has a `reclassOptions?: string[]` array.
    - We will define a new `ReclassEvent` interface similar to `PromotionEvent`:
      ```ts
      export interface ReclassEvent {
        level: number;
        selectedClassId: string;
      }
      ```
    - The `Unit` interface will need a `reclassEvents?: ReclassEvent[]` array to track the user's selected reclass history in the UI.

2. **Progression Logic (`lib/stats.ts`)**
    - The `generateProgressionArray` function will need to accept `reclassEvents` alongside `promotionEvents`.
    - When a ReclassEvent occurs at a given level `L`:
      - The unit's internal level resets to 1. 
      - The `currentClass` changes to the `selectedClassId`.
      - The unit's accumulated stats up to level `L` are retained as the new baseline.
      - The unit's stat caps (`maxStats`) immediately change to the new class's caps.
      - The unit's `statModifiers` (for Awakening) swap to the new class's modifiers.

3. **UI Components**
    - `StatProgressionTable.tsx`: Update to watch for and render reclassing milestones similarly to how it handles promotion milestones. It will need new visual indicators that differentiate a "Reclass" (level resets to 1, usually) from a "Promotion".
    - `PromotionOptionsDisplay.tsx` (or a new `ReclassOptionsDisplay.tsx`): Update to provide dropdowns/buttons for the user to select valid reclass options at any given level > 10. Valid options depend on the unit's current tier and the rules defined in `specs/unit-reclassing/spec.md`.

## Implementation Approach

1. **Types**: Add `ReclassEvent` to `types/unit.ts` and add `reclassEvents?: ReclassEvent[]` to the `Unit` type (or manage it purely in UI state and pass it down).
2. **Logic Integration**: Refactor `generateProgressionArray` in `lib/stats.ts` to sequentially process all events (promotions AND reclasses) chronologically by level. Since reclassing resets the display level to 1, we must sort and process these events carefully.
3. **UI State**: In the parent component of the stat table (e.g. `ComparisonGrid`), add state for tracking reclass choices alongside promotion choices.
4. **Validation**: Ensure that a unit cannot reclass into a class they are already in or a class that violates the tier rules (no Tier 1 -> Tier 2 without passing level 10).
