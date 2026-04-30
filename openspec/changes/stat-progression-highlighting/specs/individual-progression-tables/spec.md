## MODIFIED Requirements

### Requirement: Dual Independent Progression Table Layout
The comparator page SHALL render two independent `StatProgressionTable` instances side-by-side, one per selected unit, each inside its own `Card`. When two units are selected, the page SHALL pass each table the other unit and its promotion/reclass events as props so that each table can compute cross-unit stat highlights. The two tables still render their own stat key sets independently and do not share row state or alignment.

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

### Requirement: Per-Unit Progression Table Component
The system SHALL provide a `StatProgressionTable` component that accepts a single `Unit` (instead of `Unit[]`) and renders that unit's full level-by-level stat progression in isolation. The component SHALL use only the stat keys present on that unit's `stats` object — no cross-unit stat reconciliation, no `getCommonStats`, no `skl`/`dex` collapsing, and no `str`/`mag` merge logic.

#### Scenario: Table shows only stats the unit has
- **WHEN** a GBA unit with stats `{ hp, str, skl, spd, lck, def, res }` is rendered in the per-unit table
- **THEN** the table columns are exactly those 7 stat keys
- **AND** no `mag`, `dex`, `cha`, `bld`, or `con` columns appear

#### Scenario: Table shows all levels from 1 to max
- **WHEN** a unit with base level 5 and max level 20 is rendered alone (no `otherUnit`)
- **THEN** the table displays rows from level 1 to level 20
- **AND** levels 1–4 show "-" for all stat cells

#### Scenario: Pre-join levels display dash
- **WHEN** a unit joins at level 10 and is rendered alone (no `otherUnit`)
- **THEN** levels 1–9 render "-" in every stat cell for that unit's table

#### Scenario: Promotion levels are highlighted within a single unit
- **WHEN** a unit promotes at level 10 and the table renders the level 10 row
- **THEN** the row is highlighted as a promotion level (sparkle icon visible)
- **AND** subsequent rows show the promoted class stats

#### Scenario: Reclass events are handled within a single unit
- **WHEN** an Awakening unit has a reclass event at level 15
- **THEN** the table renders level 15 as a reclass row with appropriate stat recalculation
- **AND** subsequent rows use the new class's growths and caps

#### Scenario: Stat caps are displayed per-unit
- **WHEN** a unit's calculated stat reaches the class or unit max cap
- **THEN** the capped stat value is displayed in green bold text
- **AND** the stat does not exceed the cap in subsequent rows
