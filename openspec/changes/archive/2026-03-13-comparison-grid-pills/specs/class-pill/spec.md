## ADDED Requirements

### Requirement: Integrate Movement Type Pill
The `ClassPill` component SHALL embed the `MovementTypePill` component to display the movement type associated with the class, replacing any existing plain text or basic icon rendering for movement type.

#### Scenario: Viewing class movement type within class pill
- **WHEN** the `ClassPill` component renders a class's details or is expanded
- **THEN** it utilizes the `MovementTypePill` component to display the class's movement type
