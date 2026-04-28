## MODIFIED Requirements

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
