# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

The current promotion options row inside the `ComparisonGrid` unit details table is not compatible with our recent implementation of multiple promotion tiers, as it only shows the first "level" of promotion or reclassing. Given the increasing complexity of displaying branching and multi-tier promotions, this UI element has outgrown the cramped table format and needs a dedicated, dynamic section.

## What Changes

- **Remove** the "Promotion Options" row from the `ComparisonGrid`'s Unit Details table.
- **Create** a new standalone component (e.g., `PromotionOptions.tsx`) to handle displaying and selecting class promotions.
- **Move** this new component to its own dedicated section in the website flow (likely below the Unit Details or Stats sections).
- **Update** the new section to dynamically feature *every* possible promotion and reclass option a unit has across multiple tiers, rather than just the first level.

## Capabilities

### New Capabilities
- `dynamic-promotion-ui`: Extracting the promotion options into a dedicated, dynamic UI component that supports multi-tier and branching class paths outside of the standard comparison table.

### Modified Capabilities
- `branching-promotions`: Updating the UI requirements to specify that branching and multi-tier options are displayed in a dedicated standalone section rather than an inline table row.

## Impact

- `components/features/ComparisonGrid.tsx`: Will have the promotion options row removed, simplifying the component.
- Layout files (e.g., `app/comparator/page.tsx` or unit detail pages): Will need to integrate the new promotion options component.
- User Experience: Selecting classes will be moved to a more prominent, capable UI section that doesn't feel constrained by table cells.

## Specifications

branching-promotions/spec.md
## MODIFIED Requirements

### Requirement: User Selects Promotion Path
The system SHALL provide a dedicated, extracted UI mechanism allowing the user to select a specific promotion path when a unit has multiple valid promotion options defined in the game data.

#### Scenario: Unit with branching promotions
- **WHEN** the user selects a unit with branching promotions (e.g. from Sacred Stones or Awakening)
- **THEN** an independent UI outside the standard comparison grid allows the user to individually select which class each promotion tier resolves to.

### Requirement: Multi-Tier Promotion Support
The system SHALL support and track sequential promotion events for units that can promote multiple times or reclass linearly within a dedicated section.

#### Scenario: Unit promotes through multiple tiers
- **WHEN** a unit promotes from a base class to an advanced class, and then to a third-tier class
- **THEN** the system tracks the selected class for each level threshold and applies the appropriate sequence of class bases and promotion bonuses.

#### Scenario: System provides UI to append multi-tier promotions
- **WHEN** the user is viewing the dedicated "Promotion Planner" section for a unit
- **AND** the currently selected class for their latest promotion event has valid entries in its `promotesTo` array (including resolving the target class of trainee promotions)
- **THEN** the system renders a "+" button that, when clicked, adds a new sequential promotion event to the unit's timeline.

#### Scenario: System provides UI to remove multi-tier promotions
- **WHEN** a unit has more than one promotion event configured
- **THEN** the system renders a "-" button next to the "+" button in the dedicated promotion planner that, when clicked, removes the most recently added promotion event from the unit's timeline.

dynamic-promotion-ui/spec.md
## ADDED Requirements

### Requirement: Dedicated Promotion UI
The system SHALL display all unit promotion and reclassing options in a dedicated UI section visually distinct from the primary `ComparisonGrid` data table.

#### Scenario: Displaying options outside the grid
- **WHEN** a user is comparing units
- **THEN** an independent UI component (e.g., `PromotionOptions` or `PromotionPathPlanner`) is rendered outside the standard unit details table to host interactive class selection.

### Requirement: Multi-Tier Visibility
The system SHALL visually represent the full sequential depth of a unit's possible promotion tiers.

#### Scenario: Visualizing sequential promotions
- **WHEN** a unit can promote multiple times (e.g., Trainee -> Tier 1 -> Tier 2)
- **THEN** the dedicated UI section displays these distinct promotion levels as sequential, selectable steps or dropdown menus.

### Requirement: Interactive Path Selection
The system SHALL allow users to directly click or select specific class choices within the dedicated promotion UI to alter the unit's active promotion path.

#### Scenario: User clicks a class choice
- **WHEN** the user interacts with a class option in the multi-tier visualization
- **THEN** that class becomes the active selected promotion for that respective tier, updating the `promotionEvents` state.



## Design

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

## Current Task Context

## Current Task
- - [ ] 1.1 Create file `components/features/PromotionPathPlanner.tsx`.
