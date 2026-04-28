## ADDED Requirements

### Requirement: Horizontal Unit Details Layout
The system SHALL display unit details (join chapter, supports) side-by-side horizontally so that compared units align vertically.

#### Scenario: Comparing two units
- **WHEN** two units are selected for comparison
- **THEN** their details (like join chapter and supports) appear side-by-side at the same vertical position on the page

### Requirement: Stats Displayed as Tabular Format
The system SHALL format unit stats (growths, bases) as horizontal tables for easier parsing.

#### Scenario: Viewing unit growths
- **WHEN** viewing the unit growths section
- **THEN** the growths are displayed in a clean horizontal table format

### Requirement: Combined Average Stats Table
The system SHALL render two independent per-unit stat progression tables instead of a single shared combined table. Each table displays one unit's full level-by-level stats in isolation, using only that unit's own stat keys, levels, and promotion/reclass events. The maximum number of selectable units is 2 (down from 4).

#### Scenario: Comparing two units with different base levels
- **WHEN** a level 1 unit and a level 10 unit are selected
- **THEN** two independent tables are rendered, one per unit
- **AND** each table shows all levels from 1 to max, with "-" for pre-join levels

#### Scenario: Comparing units with different stat keys
- **WHEN** a GBA unit (with `skl`) and a Three Houses unit (with `dex`) are compared
- **THEN** the GBA unit's table shows a `skl` column and the Three Houses unit's table shows a `dex` column
- **AND** no cross-unit stat collapsing or merging occurs

#### Scenario: Three or more units cannot be selected
- **WHEN** the user attempts to select a third unit
- **THEN** the system prevents the selection and indicates the maximum of 2 has been reached

### Requirement: Unit Details table shows Class Abilities row
The Unit Details comparison table in `ComparisonGrid.tsx` SHALL include a "Class Abilities" row. This row SHALL be conditionally rendered — it MUST only appear when at least one selected unit's resolved class has a non-empty `classAbilities` array.

The row SHALL be rendered after the "Promotion Options" row and before the "Affinity" row. Each ability SHALL be displayed as a pill/badge (`bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`). If a unit's class has no abilities, that cell SHALL render a dash (`-`).

The class SHALL be resolved using the same lookup pattern already used in the table: matching by `c.id === unit.class.toLowerCase().replace(/\s+/g, '_') || c.name === unit.class` and `c.game === unit.game`.

#### Scenario: Class Abilities row appears when a unit has abilities
- **WHEN** at least one selected unit's class has a non-empty `classAbilities` array
- **THEN** a "Class Abilities" row SHALL appear in the Unit Details table

#### Scenario: Class Abilities row does not appear when no unit has abilities
- **WHEN** none of the selected units' classes have any entries in `classAbilities`
- **THEN** the "Class Abilities" row SHALL NOT be rendered

#### Scenario: Mixed units — one with abilities, one without
- **WHEN** one selected unit is a Swordmaster (has `+30 Crit`) and the other is a Cavalier (no abilities)
- **THEN** the "Class Abilities" row SHALL appear
- **AND** the Swordmaster column SHALL show a `+30 Crit` pill
- **AND** the Cavalier column SHALL show a dash (`-`)

#### Scenario: Each ability is a separate pill badge
- **WHEN** a class has multiple abilities (e.g., Assassin: Silencer, Locktouch, Steal)
- **THEN** each ability SHALL be rendered as a separate pill in the table cell

#### Scenario: Cross-game comparison preserves game-accurate abilities
- **WHEN** a FE6 Swordmaster and a FE7 Swordmaster are compared
- **THEN** FE6 Swordmaster cell SHALL show `+30 Crit`
- **AND** FE7 Swordmaster cell SHALL show `+15 Crit`
