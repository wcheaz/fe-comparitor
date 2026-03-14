## MODIFIED Requirements

### Requirement: Class Abilities are shown in the promotion details modal
When a user clicks the ℹ️ icon next to a promotion option in the Unit Details table, the resulting modal SHALL display a "Class Abilities" section if the promoted class has a non-empty `classAbilities` array.

The section SHALL render after the "Weapons" section and before the "Description" section. Each ability SHALL be displayed as a pill/badge styled consistently with the existing weapon pills (`bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`).

#### Scenario: Promotion modal shows abilities for FE8 Bishop
- **WHEN** a unit's promotion option is Bishop in Sacred Stones
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL display a "Class Abilities" section containing a `Slayer` badge

#### Scenario: Promotion modal suppresses abilities section when empty
- **WHEN** a unit's promotion option has no class abilities (e.g., Paladin in FE6)
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL NOT render a "Class Abilities" section

#### Scenario: Promotion modal shows multiple abilities as separate pills
- **WHEN** a promoted class has multiple abilities (e.g., Assassin: Silencer, Locktouch, Steal)
- **THEN** each ability SHALL be rendered as a separate pill badge

## ADDED Requirements

### Requirement: Starting Skills tracking and display
The `Unit` model SHALL include an optional `startingSkills` string array. These skills SHALL be rendered in the UI using the `AbilityPill` component, similarly to `classAbilities`.

#### Scenario: Unit with starting skills
- **WHEN** an Awakening unit with starting skills (e.g. Chrom with Dual Strike) is loaded
- **THEN** `startingSkills` SHALL contain `"Dual Strike"`
- **AND** the UI components SHALL render this skill as an `AbilityPill`
