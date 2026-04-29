## ADDED Requirements

### Requirement: Cross-unit valid level floor computation
The comparator page SHALL compute a `minVisibleLevel` value when two units are selected. This value SHALL be `Math.max(effectiveStartLevel(unitA), effectiveStartLevel(unitB))`. The `effectiveStartLevel` of a unit SHALL be `1` if the unit is pre-promoted (`isPromoted === true`) or has a base level less than 1; otherwise it SHALL be the unit's `level` field. When only one unit is selected, `minVisibleLevel` SHALL NOT be computed (no filtering applied).

#### Scenario: Two normal units with different base levels
- **WHEN** unit A has `level: 5` (not promoted, not trainee) and unit B has `level: 10` (not promoted, not trainee) are both selected
- **THEN** `minVisibleLevel` SHALL be `10`

#### Scenario: Pre-promoted unit paired with normal unit
- **WHEN** unit A has `level: 1, isPromoted: true` and unit B has `level: 15, isPromoted: false`
- **THEN** `minVisibleLevel` SHALL be `15`

#### Scenario: Two pre-promoted units
- **WHEN** both units have `isPromoted: true`
- **THEN** `minVisibleLevel` SHALL be `1`

#### Scenario: Single unit selected
- **WHEN** only one unit is selected
- **THEN** no `minVisibleLevel` is passed to the table
- **AND** the table renders all rows unfiltered (including `isSkipped` rows)

#### Scenario: Trainee unit paired with normal unit
- **WHEN** a trainee unit with negative base level is paired with a level 8 normal unit
- **THEN** `minVisibleLevel` SHALL be `8`

### Requirement: Row filtering by valid level floor
The `StatProgressionTable` component SHALL accept an optional `minVisibleLevel` prop. When provided, the component SHALL exclude all rows where `internalLevel` is less than `minVisibleLevel`. When `minVisibleLevel` is not provided (undefined or null), the component SHALL render all rows without filtering.

#### Scenario: Table receives minVisibleLevel of 10
- **WHEN** `minVisibleLevel={10}` is passed to a unit that joins at level 5
- **THEN** rows with `internalLevel` 1 through 9 SHALL NOT be rendered
- **AND** rows with `internalLevel` 10 and above SHALL be rendered

#### Scenario: Table receives no minVisibleLevel
- **WHEN** `minVisibleLevel` is not passed to the component
- **THEN** all rows including `isSkipped` rows SHALL be rendered as before

#### Scenario: minVisibleLevel equals unit's own base level
- **WHEN** unit A joins at level 5, unit B joins at level 5, and `minVisibleLevel={5}`
- **THEN** rows 1–4 SHALL NOT be rendered
- **AND** rows 5 and above SHALL be rendered

#### Scenario: minVisibleLevel below unit's own base level
- **WHEN** unit A joins at level 10, unit B joins at level 5, and `minVisibleLevel={5}`
- **THEN** unit A's table SHALL NOT render rows 1–4 (isSkipped)
- **AND** unit A's table SHALL render rows 5–9 as `isSkipped` with dashes
- **AND** unit A's table SHALL render rows 10+ with real stats

### Requirement: Legend adapts to filtered state
The `StatProgressionTable` legend entry for `"Unit not yet available at this level"` SHALL only appear when at least one visible row in the rendered table has `isSkipped: true`. When all `isSkipped` rows have been filtered out by `minVisibleLevel`, the legend entry SHALL NOT be rendered.

#### Scenario: Filtered table hides all skipped rows
- **WHEN** `minVisibleLevel` is set and all `isSkipped` rows are filtered out
- **THEN** the "Unit not yet available at this level" legend entry SHALL NOT appear

#### Scenario: Unfiltered table shows skipped rows
- **WHEN** `minVisibleLevel` is not set and `isSkipped` rows exist in the data
- **THEN** the "Unit not yet available at this level" legend entry SHALL appear
