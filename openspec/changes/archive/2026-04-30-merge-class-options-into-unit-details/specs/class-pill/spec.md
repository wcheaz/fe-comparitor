## MODIFIED Requirements

### Requirement: Integrate Movement Type Pill
The `ClassPill` component SHALL embed the `MovementTypePill` component to display the movement type associated with the class, replacing any existing plain text or basic icon rendering for movement type.

#### Scenario: Viewing class movement type within class pill
- **WHEN** the `ClassPill` component renders a class's details or is expanded
- **THEN** it utilizes the `MovementTypePill` component to display the class's movement type

## ADDED Requirements

### Requirement: Tier-based color variants for ClassPill
The `ClassPill` component SHALL support tier-aware color variants that visually distinguish unpromoted classes from promoted classes. The component's CVA config SHALL accept `unpromoted` and `promoted` variant values in addition to the existing `default` variant.

The variant SHALL be determined by the class's `type` field:
- Classes with `type: 'promoted'` SHALL use the `promoted` variant
- Classes with `type: 'unpromoted'` or `type: 'trainee'` SHALL use the `unpromoted` variant

When no variant is explicitly provided, the `default` variant SHALL be used (preserving existing behavior for all current `ClassPill` usage).

#### Scenario: Promoted class pill uses purple/violet tones
- **WHEN** a `ClassPill` is rendered for a class with `type: 'promoted'` (e.g., Paladin, Sniper)
- **AND** the `variant` prop is set to `'promoted'`
- **THEN** the pill SHALL display with a purple/violet color scheme (background, text, and border)
- **AND** the pill SHALL be visually distinct from both the default blue and the unpromoted amber variants

#### Scenario: Unpromoted class pill uses amber/orange tones
- **WHEN** a `ClassPill` is rendered for a class with `type: 'unpromoted'` (e.g., Cavalier, Archer)
- **AND** the `variant` prop is set to `'unpromoted'`
- **THEN** the pill SHALL display with a warm amber/orange color scheme (background, text, and border)
- **AND** the pill SHALL be visually distinct from both the default blue and the promoted purple variants

#### Scenario: Trainee class pill uses unpromoted variant
- **WHEN** a `ClassPill` is rendered for a class with `type: 'trainee'` (e.g., Recruit, Pupil)
- **AND** the `variant` prop is set to `'unpromoted'`
- **THEN** the pill SHALL display with the same warm amber/orange color scheme as unpromoted classes

#### Scenario: Default variant is unchanged for existing usage
- **WHEN** a `ClassPill` is rendered without specifying a variant
- **THEN** the pill SHALL display with the existing blue `fe-blue` color scheme
- **AND** existing ClassPill instances throughout the application (e.g., the "Class" row, stat progression table) SHALL be visually unchanged

### Requirement: CSS classes for class pill tier variants
Two new CSS classes SHALL be added to `globals.css` under the "Class Variants" section:
- `.pill-variant-class-unpromoted` — warm amber/orange tones matching the unpromoted skill color spectrum
- `.pill-variant-class-promoted` — cool purple/violet tones matching the promoted skill color spectrum

#### Scenario: Unpromoted class variant CSS uses amber spectrum
- **WHEN** `.pill-variant-class-unpromoted` is applied to a class pill element
- **THEN** the element SHALL render with background, text, border, and hover colors in the amber/orange/yellow spectrum
- **AND** the colors SHALL be visually consistent with the unpromoted skill pill palette

#### Scenario: Promoted class variant CSS uses purple spectrum
- **WHEN** `.pill-variant-class-promoted` is applied to a class pill element
- **THEN** the element SHALL render with background, text, border, and hover colors in the purple/violet spectrum
- **AND** the colors SHALL be visually consistent with the promoted skill pill palette
