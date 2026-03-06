# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

The current display of Class, Movement Type, and Affinity in the Comparison Grid uses generic modals, which interrupts the user flow and is inconsistent with how abilities are currently displayed (using `AbilityPill`). Changing these to dedicated pill components provides a cleaner, more consistent, and readable UI at a glance.

## What Changes

- Replace the modal triggers for Class, Movement Type, and Affinity in `ComparisonGrid.tsx` with dedicated pill components.
- Utilize the existing `ClassPill` component for the Class display in the grid.
- Create a new `AffinityPill` UI component.
- Create a new `MovementTypePill` UI component.
- Update `ClassPill` to incorporate the new `MovementTypePill` in place of its current movement type textual/icon display.

## Capabilities

### New Capabilities
- `affinity-pill`: A reusable UI component for displaying unit affinities with an embedded modal or tooltip if necessary.
- `movement-type-pill`: A reusable UI component for displaying movement types.

### Modified Capabilities
- `comparison-grid`: UI update to render `ClassPill`, `AffinityPill`, and `MovementTypePill` instead of modal triggers.
- `class-pill`: Update requirement to embed the new `MovementTypePill` component instead of rendering the movement type directly.

## Impact

- **UI Components:** `components/ui/ClassPill.tsx` (Modified), `components/ui/AffinityPill.tsx` (New), `components/ui/MovementTypePill.tsx` (New).
- **Features:** `components/features/ComparisonGrid.tsx` (Modified).

## Specifications

affinity-pill/spec.md
## ADDED Requirements

### Requirement: Render Affinity Pill
The system SHALL provide a reusable UI component to display a unit's affinity.

#### Scenario: Displaying affinity with text and icon
- **WHEN** the affinity pill component is rendered with a valid affinity
- **THEN** it displays the corresponding affinity icon and name within a pill-shaped container

### Requirement: Interactive Affinity Information
The affinity pill SHALL be interactive, providing more details about the affinity when the user interacts with it.

#### Scenario: Viewing affinity details
- **WHEN** a user hovers over or clicks the affinity pill
- **THEN** a tooltip or popover appears, detailing the stat bonuses granted by that affinity

class-pill/spec.md
## ADDED Requirements

### Requirement: Integrate Movement Type Pill
The `ClassPill` component SHALL embed the `MovementTypePill` component to display the movement type associated with the class, replacing any existing plain text or basic icon rendering for movement type.

#### Scenario: Viewing class movement type within class pill
- **WHEN** the `ClassPill` component renders a class's details or is expanded
- **THEN** it utilizes the `MovementTypePill` component to display the class's movement type

comparison-grid/spec.md
## ADDED Requirements

### Requirement: Display Class as Pill in Grid
The Comparison Grid SHALL render the Class column using the `ClassPill` component instead of text that triggers a modal.

#### Scenario: Viewing class in comparison grid
- **WHEN** a user views the Class column for a unit in the Comparison Grid
- **THEN** they see the `ClassPill` component corresponding to that unit's class

### Requirement: Display Movement Type as Pill in Grid
The Comparison Grid SHALL render the Movement Type column using the `MovementTypePill` component instead of text that triggers a modal.

#### Scenario: Viewing movement type in comparison grid
- **WHEN** a user views the Movement Type column for a unit in the Comparison Grid
- **THEN** they see the `MovementTypePill` component corresponding to that unit's movement type

### Requirement: Display Affinity as Pill in Grid
The Comparison Grid SHALL render the Affinity column using the `AffinityPill` component instead of text that triggers a modal.

#### Scenario: Viewing affinity in comparison grid
- **WHEN** a user views the Affinity column for a unit in the Comparison Grid
- **THEN** they see the `AffinityPill` component corresponding to that unit's affinity

movement-type-pill/spec.md
## ADDED Requirements

### Requirement: Render Movement Type Pill
The system SHALL provide a reusable UI component to display a unit's or class's movement type.

#### Scenario: Displaying movement type
- **WHEN** the movement type pill component is rendered with a valid movement type
- **THEN** it displays the corresponding movement type icon and name within a formatted pill container

### Requirement: Interactive Movement Type Information
The movement type pill SHALL provide additional information upon user interaction.

#### Scenario: Viewing movement type details
- **WHEN** a user hovers over or clicks the movement type pill
- **THEN** a tooltip or modal appears, describing the movement type and its terrain interactions/costs



## Design

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

## Current Task Context

## Current Task
- - [ ] 1.2 Format `components/ui/AffinityPill.tsx`:
## Completed Tasks for Git Commit
- [x] 1.1 Create `components/ui/AffinityPill.tsx` to display affinity icon and name.
- [x] 1.3 Create `components/ui/MovementTypePill.tsx` to display movement type icon and name.
- [x] 2.1 Refactor `components/ui/SupportPill.tsx`, `components/ui/ClassPill.tsx`, and `components/ui/AbilityPill.tsx` to use their new `.pill-variant-*` global CSS classes in their `cva` definitions.
- [x] 2.2 Re-verify all modal pop-ups in those 3 components to use `.pill-modal-title`, `.pill-modal-subtitle`, `.pill-modal-text`, and `.pill-modal-label` with the newer, larger text sizes defined in `app/globals.css`.
- [x] 3.1 Update `components/ui/ClassPill.tsx` to embed `MovementTypePill` instead of rendering movement type directly.
- [x] 3.2 Re-verify `ClassPill.tsx` styles and layout to accommodate the embedded `MovementTypePill`.
- [x] 4.1 Update `components/features/ComparisonGrid.tsx` to replace the Class column modal trigger with `ClassPill`.
- [x] 4.2 Update `components/features/ComparisonGrid.tsx` to replace the Movement Type column modal trigger with `MovementTypePill`.
- [x] 4.3 Update `components/features/ComparisonGrid.tsx` to replace the Affinity column modal trigger with `AffinityPill`.
- [x] 4.4 Adjust `ComparisonGrid.tsx` CSS/styling to ensure the new pills fit neatly within the grid layout.
