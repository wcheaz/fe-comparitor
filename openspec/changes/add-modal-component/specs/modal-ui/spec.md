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
