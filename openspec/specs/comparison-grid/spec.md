## Requirements

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

### Requirement: Display Possible Skills row in Unit Details table
The Comparison Grid SHALL include a "Possible Skills" row in the Unit Details table, rendered after the "Starting Skills" row and before the "Supports" row. For each unit, the row SHALL display all skills obtainable from the unit's `reclassOptions` classes AND their promoted classes (via `promotesTo`) that are not already on the unit's current class's `classSkills`. Each skill SHALL render as a `SkillPill` with an originating class name label.

The row SHALL only render when at least one displayed unit has non-empty `reclassOptions` producing at least one deduplicated possible skill.

Units with no possible skills in a visible row SHALL display "None" as muted text.

#### Scenario: Possible Skills row renders for Awakening units with reclass options
- **WHEN** the Comparison Grid displays Awakening units with `reclassOptions`
- **AND** at least one reclass class or its promoted class has skills not on the unit's current class
- **THEN** the "Possible Skills" row SHALL render with SkillPill components annotated with class names

#### Scenario: Possible Skills row hidden when no units have reclass options
- **WHEN** the Comparison Grid displays only GBA units without `reclassOptions`
- **THEN** the "Possible Skills" row SHALL NOT render

### Requirement: Display Class Change Options row in Unit Details table
The ComparisonGrid Unit Details table SHALL include a "Class Change Options" row rendered after the "Class" row and before the "Join Chapter" row. For each unit, the row SHALL display all promotion and reclass target classes as tier-color-coded `ClassPill` components.

Each `ClassPill` in this row SHALL receive a variant prop based on the class's tier:
- `variant="promoted"` for classes with `type: 'promoted'`
- `variant="unpromoted"` for classes with `type: 'unpromoted'` or `type: 'trainee'`

The row SHALL only render when at least one displayed unit has at least one class change option. Units with no class change options in a visible row SHALL display "None" as muted text.

#### Scenario: Class Change Options row renders with tier-colored pills
- **WHEN** the ComparisonGrid displays an Awakening unit with both promotion and reclass options
- **THEN** the "Class Change Options" row SHALL render between the "Class" row and "Join Chapter" row
- **AND** each promoted class SHALL render as a `ClassPill` with `variant="promoted"` (purple/violet tones)
- **AND** each unpromoted class SHALL render as a `ClassPill` with `variant="unpromoted"` (amber/orange tones)

#### Scenario: Class Change Options row hidden when no units have options
- **WHEN** all displayed units have no `promotesTo` targets and no `reclassOptions`
- **THEN** the "Class Change Options" row SHALL NOT render
