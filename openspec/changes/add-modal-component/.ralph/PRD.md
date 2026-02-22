# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why
We need a reusable and highly flexible modal component to show panels of information on the screen without navigating away from the main flow. This will be used to provide extra information to the user about specific items, such as a PRF weapon's stats, class types (e.g., "Infantry", "Armored", or "Flying"), and unit properties like "Dark" affinity. This provides a better user experience for quick interactions or viewing supplementary details.

## What Changes
- Add a new generic modal component that is highly flexible and capable of rendering various types of children/content.
- The modal will appear when triggered by a button click.
- The modal will disappear ONLY when a close ("x") button on the modal is clicked, allowing users to compare details side-by-side.
- The modal will be styled with a different background color from the main page to ensure readability.
- All styling for the modal will be added to `global.css`.

## Capabilities
### New Capabilities
- `modal-ui`: A reusable UI component that renders a temporary dialog/panel over the application's main content, supporting open/close state management.


### Modified Capabilities

## Impact
- New component added to the UI components directory.
- `global.css` updated with new modal styles.

## Specifications

modal-ui/spec.md
## ADDED Requirements

### Requirement: Modal Base Component
The system SHALL provide a reusable modal component that acts as a temporary dialog or informational panel layered over the application's main content, capable of rendering arbitrary child elements.

#### Scenario: Display flexible content
- **WHEN** the modal component is instantiated with React child elements
- **THEN** the modal body renders those child elements visibly

### Requirement: State Management
The modal component's visibility SHALL be controlled externally via props (e.g., `isOpen` and `onClose`), allowing parent components to determine when the modal appears and disappears.

#### Scenario: Open modal
- **WHEN** the `isOpen` prop is true
- **THEN** the modal and its backdrop are visible on the screen

#### Scenario: Hide modal
- **WHEN** the `isOpen` prop is false
- **THEN** both the modal and its backdrop are completely hidden

### Requirement: Modal Dismissal
The modal SHALL provide a dedicated close button (an "x" icon or text) to request dismissal. The modal SHALL NOT close when a user clicks on the backdrop behind the modal, allowing users to safely interact with or compare the modal content alongside visible background elements.

#### Scenario: Click close button
- **WHEN** the user clicks the close ("x") button inside the modal
- **THEN** the component invokes the provided `onClose` callback

#### Scenario: Click backdrop
- **WHEN** the user clicks the darkened backdrop behind the modal content
- **THEN** the component does NOT invoke the `onClose` callback, and the modal remains open

### Requirement: Modal Styling
The modal SHALL be styled distinctly from the main page to ensure readability, utilizing a defined background color and appropriate layout CSS established in `global.css`.

#### Scenario: Visual distinction
- **WHEN** the modal is visible
- **THEN** its container possesses distinct background styling styling distinct from the application's underlying layout



## Design

## Context
The Fire Emblem Unit Comparator currently displays a large amount of information on the main layout. To provide more depth without cluttering the primary view, we need a flexible modal component. This modal will allow users to view detailed supplementary information, such as PRF weapon stats, class type descriptions (Infantry, Armored, Flying), and affinity definitions, on demand.

## Goals / Non-Goals
**Goals:**
- Create a reusable, flexible React modal component capable of rendering arbitrary children.
- Include a clear close ("x") button within the modal.
- The modal should ONLY close when the "x" button is clicked (no backdrop click dismissal), allowing users to keep the modal open to compare specific details side-by-side with the main content.
- Ensure the modal stands out from the main page through distinct background styling defined in `global.css`.

**Non-Goals:**
- Complex multi-step wizard modals.
- Building the specific contents for PRF stats or affinity details inside the base modal component itself (the modal should be a generic container, while the specific content is passed down as children).

## Decisions
1. **Component Location:** Create the component in `components/ui/modal.tsx` (or similar generic UI directory) to ensure it is accessible across different features.
2. **State Management:** The open/closed state of the modal will be managed by the parent component that triggers it, using standard React state (`useState`). The modal will accept `isOpen` and `onClose` props.
3. **Styling:** The styling will use vanilla CSS in `global.css` per project conventions. We will define a `.modal-backdrop` and `.modal-content` class to handle the overlay positioning and modal body styling, respectively.
4. **Portal Rendering:** If necessary for z-index or DOM hierarchy issues, consider using React Portals, though standard absolute/fixed positioning in the main layout may suffice given the current plain CSS structure.

## Risks / Trade-offs
- **[Risk]** Modal backdrop might not cover the entire screen if not positioned correctly.
  - **Mitigation:** Use `position: fixed`, `top: 0`, `left: 0`, `width: 100vw`, `height: 100vh`, and a high `z-index` in `global.css` for the backdrop.
- **[Risk]** Accessibility (focus trapping, ESC key to close).
  - **Mitigation:** Add basic ARIA roles (`role="dialog"`) and `tabIndex`. For the scope of this change, we'll focus on the visual functionality and basic click handlers as requested, but we should ensure the "x" button is a clear `<button>` element.

## Current Task Context

## Current Task
- - [ ] 3.1 Define FE6 affinity data structure containing names and stat bonus details.
## Completed Tasks for Git Commit
- [x] 1.1 Add `.modal-backdrop` styles to `app/global.css` for fixed full-screen overlay (darkened background, high z-index).
- [x] 1.2 Add `.modal-content` styles to `app/global.css` for the centered modal container (distinct background color, padding, max-width, border-radius).
- [x] 1.3 Add modal close button styles to `app/global.css` (positioning in top right, clear icon/text, no background/border).
- [x] 2.1 Create `components/ui/modal.tsx`.
- [x] 2.2 Define component props: `isOpen` (boolean), `onClose` (function), and `children` (ReactNode).
- [x] 2.3 Implement conditional rendering based on the `isOpen` prop.
- [x] 2.4 Render the backdrop `div` and the modal content `div` within it.
- [x] 2.5 Add an "x" `<button>` inside the modal content that calls `onClose` when clicked.
- [x] 2.6 IMPORTANT: Ensure no `onClick` handler is placed on the backdrop (or explicitly ignore clicks) to prevent backdrop click dismissal.
