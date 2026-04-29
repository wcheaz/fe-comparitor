## MODIFIED Requirements

### Requirement: Dual Independent Progression Table Layout
The comparator page SHALL render two independent `StatProgressionTable` instances side-by-side, one per selected unit, each inside its own `Card`. The two tables do not share row state, alignment, or stat key sets. When two units are selected, the page SHALL compute a shared `minVisibleLevel` and pass it to both tables so that rows where either unit has `isSkipped: true` are hidden from both tables. When only one unit is selected, no `minVisibleLevel` is passed and each table renders all rows independently.

#### Scenario: Two units with different stat sets
- **WHEN** unit A has `{ hp, str, skl, spd, lck, def, res }` and unit B has `{ hp, str, mag, dex, spd, lck, def, res, cha, bld }`
- **THEN** unit A's table shows 7 columns and unit B's table shows 10 columns
- **AND** the tables render independently with no shared stat reconciliation

#### Scenario: Two units with different level ranges
- **WHEN** unit A starts at level 1 and unit B starts at level 10
- **THEN** both tables receive `minVisibleLevel={10}`
- **AND** rows below level 10 are hidden from both tables
- **AND** neither table shows `"-"` rows for pre-join levels

#### Scenario: Pre-promoted unit with late-joining normal unit
- **WHEN** unit A is pre-promoted (`isPromoted: true`, level 1) and unit B joins at level 15
- **THEN** both tables receive `minVisibleLevel={15}`
- **AND** unit A's table hides its real data rows for levels 1–14
- **AND** unit B's table hides its `isSkipped` rows for levels 1–14

#### Scenario: No stat highlighting in per-unit tables
- **WHEN** two units are selected and their per-unit tables are rendered
- **THEN** no cell in either table is highlighted green or yellow based on cross-unit comparison
- **AND** stat highlighting is only present in the `ComparisonGrid` base/growth tables
