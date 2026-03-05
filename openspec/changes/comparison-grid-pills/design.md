## Context

The `ComparisonGrid` currently renders Class, Movement Type, and Affinity information via generic click-to-open modals. This is inconsistent with how other traits (like Abilities) are rendered as pills. To improve UI consistency and readability at a glance, we want to show these as pills. `ClassPill` and `AbilityPill` components already exist for their respective types, but we need new `AffinityPill` and `MovementTypePill` components. Furthermore, the `ClassPill` needs to be updated to integrate the new `MovementTypePill`.

## Goals / Non-Goals

**Goals:**
- Implement `AffinityPill` and `MovementTypePill` as standalone UI components.
- Update `ComparisonGrid.tsx` to use `ClassPill`, `AffinityPill`, and `MovementTypePill` instead of generic modal triggers for those respective columns.
- Update `ClassPill.tsx` to embed the new `MovementTypePill` for displaying class movement types.

**Non-Goals:**
- Redesigning the underlying data schema for affinities, movement types, or classes.
- Refactoring `AbilityPill` or other established UI components not directly involved in this change.

## Decisions

- **Dedicated Pill Components**: We will create dedicated React components for `AffinityPill` and `MovementTypePill`.
   - *Rationale*: Encapsulating these displays allows them to manage their own modal/tooltip behaviors, keeping the `ComparisonGrid` code clean and localized. It also enables reuse of these pills in other UI contexts (such as `ClassPill` for movement types).
- **Tooltips vs Modals for Pills**: The new pills should continue to support displaying more information when interacted with. To maintain feature parity with the previous modal behavior, we'll ensure they present the detailed description (e.g. affinity bonuses, movement type terrain costs) either through an embedded modal (similar to `AbilityPill` or `ClassPill`) or an interactive Popover/Tooltip, depending on how other generic pill/badge components manage expanded info.
- **`ClassPill` Integration**: The `MovementTypePill` will be inserted into the existing `ClassPill` component where movement type was previously rendered textually or as a simple icon.

## Risks / Trade-offs

- **Risk:** The pills might consume more horizontal or vertical space in the Comparison Grid than the previous text+modal trigger approach.
  - **Mitigation:** Ensure the new pill components accept standard styling props (e.g., `className`) to constrain their size, use flex layouts effectively, and maintain responsive padding within the `ComparisonGrid` columns.
