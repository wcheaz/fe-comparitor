# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

Currently, when a unit has branching promotions or multiple possible promotions, the application calculates their levels and stats as if they simply chose the first available promotion option. This is inaccurate for games with branching promotion trees (like Sacred Stones, Awakening, or Fates), where a unit's stat progression and class identity depend entirely on the user's choice of promotion. Allowing the user to select the promotion path enables accurate comparison and stat tracking across the full range of a unit's potential development.

## What Changes

- Add UI allowing users to select a specific promotion path when a unit has multiple options.
- The application will automatically default to the first available promotion option (or a specific default if defined), ensuring that the app functions identically to how it does now if the user does not explicitly choose a class.
- Update the stat progression calculation logic to use the statistics, growth rates, and caps of the user-selected (or default) promoted class rather than strictly the first option.
- Ensure the state of the selected promotion is tracked per-unit in the comparison state.
- **BREAKING**: The unit stat calculation functions will now require the selected promotion path as an input parameter / part of the unit state.

## Capabilities

### New Capabilities
- `branching-promotions`: Add capability to select and calculate stats based on a chosen promotion path for units with multiple promotion options.

### Modified Capabilities
- `stat-progression-table`: Update requirements to reflect that stats generated for promoted levels must correspond to the user-selected promotion option.

## Impact

- **UI Components**: Modifications to the comparison grid or unit details to render a promotion selector when applicable.
- **State Management**: The application state tracking selected units must be expanded to also track the selected promotion class ID for each unit.
- **Calculation Logic**: `lib/stats.ts` (e.g., `generateProgressionArray`) must be updated to factor in the selected promotion class instead of the first available one.
- **Data Models**: `types/unit.ts` must be updated to represent the chosen promotion path.

## Specifications

branching-promotions/spec.md
## ADDED Requirements

### Requirement: User Selects Promotion Path
The system SHALL provide a mechanism allowing the user to select a specific promotion path when a unit has multiple valid promotion options defined in the game data.

#### Scenario: Unit with branching promotions
- **WHEN** the user selects a unit with branching promotions (e.g. from Sacred Stones or Awakening)
- **THEN** an interface allows the user to individually select which class each promotion tier resolves to.

### Requirement: Default Promotion Path
The system SHALL automatically default the promotion path to the first available option in the unit's class data if the user has not explicitly made a selection.

#### Scenario: User does not select a promotion
- **WHEN** a unit with branching promotions is added to the comparator
- **AND** the user does not explicitly choose a promotion path
- **THEN** the application calculates stats and progression assuming the unit promotes into the first class listed in their base class's `promotesTo` array.

### Requirement: Multi-Tier Promotion Support
The system SHALL support and track sequential promotion events for units that can promote multiple times or reclass linearly.

#### Scenario: Unit promotes through multiple tiers
- **WHEN** a unit promotes from a base class to an advanced class, and then to a third-tier class
- **THEN** the system tracks the selected class for each level threshold and applies the appropriate sequence of class bases and promotion bonuses.

### Requirement: Stat Calculation Respects Promotion Path
The system SHALL calculate average unit stats (including caps and promotion bonuses) based explicitly on the user-selected promotion path.

#### Scenario: Stats calculated for a promoted level
- **WHEN** the application calculates a unit's stats at a level equal to or higher than their promotion level
- **THEN** the calculation applies the promotion bonuses, base stats, and stat caps of the specific class the user selected for that promotion.

stat-progression-table/spec.md
## MODIFIED Requirements

### Requirement: Accurate Promotion Stat Adjustments
The system SHALL apply appropriate statistical bonuses when a unit promotes, according to their new class data defined in the game's class data file. The new class data used MUST correspond to the promotion path selected by the user, or the default first class if no selection is made.

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

## Current Task Context

## Current Task
- - [ ] 1.1 In `app/comparator/page.tsx`, add state: `const [promotionEvents, setPromotionEvents] = useState<Record<string, PromotionEvent[]>>({});` (import `PromotionEvent` from `@/types/unit`)
