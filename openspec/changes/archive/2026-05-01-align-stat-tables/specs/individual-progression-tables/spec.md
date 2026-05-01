## MODIFIED Requirements

### Requirement: Dual Independent Progression Table Layout
The comparator page SHALL render two independent `StatProgressionTable` instances side-by-side, one per selected unit, each inside its own `Card`. When two units are selected, the page SHALL pass each table the other unit and its promotion/reclass events as props so that each table can compute cross-unit stat highlights. The two tables still render their own stat key sets independently and do not share row state. The data table portion of each card SHALL start at the same vertical position via coordinated `min-height` on the promotion/reclass section (see `table-vertical-alignment` spec), but the tables remain independent in all other respects.

#### Scenario: Two units with different stat sets
- **WHEN** unit A has `{ hp, str, skl, spd, lck, def, res }` and unit B has `{ hp, str, mag, dex, spd, lck, def, res, cha, bld }`
- **THEN** unit A's table shows 7 columns and unit B's table shows 10 columns
- **AND** the tables render independently with no shared stat reconciliation
- **AND** cells at matching levels are highlighted green or yellow based on cross-unit comparison

#### Scenario: Two units with different level ranges
- **WHEN** unit A starts at level 1 and unit B starts at level 10
- **THEN** both tables hide rows below level 10 (valid-level filtering)
- **AND** rows at level 10 and above are highlighted based on cross-unit stat comparison

#### Scenario: Cross-unit stat highlighting in per-unit tables
- **WHEN** two units are selected and their per-unit tables are rendered
- **THEN** cells where one unit's stat is strictly higher SHALL have `bg-green-500/20`
- **AND** cells where both units have equal non-zero stats SHALL have `bg-yellow-500/20`
- **AND** cells where no valid comparison exists (missing stat, skipped row, no matching level) SHALL have no comparison highlight

#### Scenario: Data tables are vertically aligned despite different promotion section heights
- **WHEN** two units are selected and their promotion/reclass sections have different heights
- **THEN** the data table headers in both cards appear at the same Y position
- **AND** each table still renders its own stat keys, rows, and promotion events independently
