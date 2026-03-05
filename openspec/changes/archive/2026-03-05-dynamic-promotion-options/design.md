## Context

Currently, the unit comparator application presents a user's unit choices side-by-side in the `ComparisonGrid`. Inside this grid, the "Unit Details" table contains an inline row for "Promotion Options". However, with the recent addition of multi-tier promotions (e.g., Trainees from FE8) and branching paths (e.g., FE8 Cavaliers promoting to either Paladin or Great Knight), that row has become too cramped and restricted to effectively show all choices and sequences. It only realistically supports showing the immediate next tier of classes. 

We need to break this functionality out into its own dedicated UI section where users can freely configure and visualize complex, multi-stage promotion paths without breaking the layout of the comparison table.

## Goals / Non-Goals

**Goals:**
- Extract the promotion UI from `ComparisonGrid.tsx` into a robust, dedicated component/section (e.g. `PromotionPathPlanner.tsx` or similar).
- Maintain shared state so that class selections made in the new section correctly propagate to the `ComparisonGrid` stats and the `StatProgressionTable`.
- Support visualization and selection for unlimited, sequential multi-tier promotion steps.
- Provide a clean, unconstrained layout (e.g., flowchart-like or sequential cards) for branching class choices.

**Non-Goals:**
- Modifying the underlying stat calculation logic in `lib/stats.ts` (this already supports the `promotionEvents` arrays).
- Modifying the JSON data schemas for units or classes.

## Decisions

- **Decision 1: Shared State Lift**
  - *Rationale*: The promotion state (`promotionEvents` array) must be shared between the `StatProgressionTable`, `ComparisonGrid`, and the new promotion section. Currently it is lifted to `app/comparator/page.tsx`. This architecture will be maintained; the new component will simply accept the state and update handlers as props instead of `ComparisonGrid`.
- **Decision 2: Component Structure & Flow**
  - *Rationale*: We will create a new section, likely placed immediately below the primary `ComparisonGrid` or between the grid and the `StatProgressionTable`. This gives the UI full width to display branching paths horizontally or vertically as needed.
  - *Alternatives considered*: Keeping it in the `ComparisonGrid` but making it a pop-up modal. A modal distances the user from seeing the real-time stat changes, whereas an inline dedicated section allows for immediate visual feedback.

## Risks / Trade-offs

- **[Risk] Disconnect in User Experience** → By removing the promotion selector from the immediate "Unit Details" table, users might miss it or not realize its connection. 
  - **Mitigation**: Place the new section prominently and perhaps add a placeholder/link inside the `ComparisonGrid` (where the row used to be) that scrolls the user down to the promotion planner.
