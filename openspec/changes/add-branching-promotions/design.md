## Context

Currently, `StatProgressionTable` has local state for selecting a unit's promotion path (`promotionEvents: Record<string, PromotionEvent[]>`), and it passes this to `generateProgressionArray`. However, this state is localized. Other components like `ComparisonGrid` and `UnitDetailPage` use a simplistic `calculateAverageStats` function that only multiplies growth rates by level differences, ignoring promotion stat bonuses, class caps, and the user's selected promotion branch. The application needs a cohesive way to manage and calculate stats across all components when branching promotions are involved.

## Goals / Non-Goals

**Goals:**
- Provide a consistent user experience for selecting branching promotion paths for units in the comparator.
- Ensure that stat calculations in all views (tables, grids, and unit details) respect the user's selected promotion path.
- Ensure the app defaults to the first available promotion option for units if the user does not explicitly choose one.

**Non-Goals:**
- Handling "Tier 3" promotions (e.g., Trainee -> Tier 1 -> Tier 2 -> Tier 3) comprehensively, as the data model and logic currently focus on 1-2 tiers.
- Modifying growth rates upon promotion. GBA Fire Emblem classes primarily provide base stat bonuses rather than growth modifiers, and this change will not introduce class-based growth modifiers yet.

## Decisions

### 1. Centralize Promotion Selection State
**Decision:** Lift the `promotionEvents` state (which holds an array of `{ level: number; selectedClassId: string }` objects) up to the common parent (`ComparatorPage`). The UI for selecting a promotion class will be integrated directly alongside the level selector for each promotion tier.
**Rationale:** Both `StatProgressionTable` and `ComparisonGrid` need to know the selected promotion path. By passing `promotionEvents` and `setPromotionEvents` down as props, the UI for selecting both the level and the target class can live anywhere (like inside `StatProgressionTable`'s headers or `ComparatorPage`'s side panel). 
**Future-proofing:** The `PromotionEvent` array natively supports sequential promotions. While GBA games generally only use index 0, games with multiple tiers (e.g. Trainee -> Base -> Promoted, or Awakening/Fates branching) can simply append additional `PromotionEvent` elements to this array to build a complete sequence.

### 2. Refactor `calculateAverageStats` to use `generateProgressionArray`
**Decision:** Modify `calculateAverageStats({ ... }, targetLevel)` and `compareUnits` to accept the `promotionEvents` and `classes` parameter. Internally, `calculateAverageStats` will call `generateProgressionArray(unit, targetLevel, targetLevel, classes, promoEvents)` to get the accurate stats at that level.
**Rationale:** `generateProgressionArray` already correctly handles applying class base stats, promotion bonuses, and stat caps when a unit crosses their promotion level. Reusing this logic ensures calculations are identical across all views (e.g., `UnitDetailPage` vs `StatProgressionTable`), respecting the new defaults and branching choices.

### 3. Default Promotion Behavior
**Decision:** The UI and `generateProgressionArray` will continue to safely fallback to `baseClass.promotesTo[0]` if no `PromotionEvent` is found for the unit. 
**Rationale:** This ensures backwards compatibility and completely fulfills the requirement to "automatically default to the first value in the list... functioning identically to how it does now."

### 4. UI Placement
**Decision:** The promotion selection dropdowns will remain inside the `StatProgressionTable` component, located immediately next to the promotion level selection for each tier.
**Rationale:** This keeps the selection of "when" to promote intuitively grouped with "what" to promote into.

## Risks / Trade-offs

- **[Risk]** Refactoring `calculateAverageStats` to call `generateProgressionArray` might introduce a slight performance overhead since `generateProgressionArray` does a loop from startLevel to endLevel. 
  - *Mitigation*: The loop is maximum 40 iterations per unit, which is highly performant in JS. Memoization in React will prevent unnecessary recalculations.
- **[Risk]** Because the UI for selecting the promotion path is located inside the `StatProgressionTable`, users strictly looking at the `ComparisonGrid` or `UnitDetails` might not immediately realize they can change the promotion path if they don't scroll down to the table.
  - *Mitigation*: The UI is still present on the page. We will assess if this causes confusion post-launch.
