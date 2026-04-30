# Stat Highlighting

## Purpose

TBD

## Requirements

### Requirement: Stat Highlighting
The system SHALL visually highlight the superior stat value when comparing two units side-by-side. Highlighting SHALL apply in both the `ComparisonGrid` (base and growth tables) and the per-unit `StatProgressionTable` components when two units are selected.

In the `ComparisonGrid`, the highlight is computed per stat row across all selected units. In the `StatProgressionTable`, the highlight is computed per cell at each `internalLevel` by comparing against the other unit's stat at the same level.

The visual rules are identical across both contexts:
- The cell with the strictly highest stat value SHALL have `bg-green-500/20`.
- Cells where both units have equal non-zero values SHALL have `bg-yellow-500/20`.
- Cells with no valid comparison (missing, skipped, or unmatched level) SHALL have no highlight.

#### Scenario: Unit A has higher stat
- **WHEN** Unit A's calculated stat is strictly greater than Unit B's corresponding stat
- **THEN** Unit A's stat cell SHALL have `bg-green-500/20`
- **AND** Unit B's cell SHALL have no comparison highlight

#### Scenario: Unit B has higher stat
- **WHEN** Unit B's calculated stat is strictly greater than Unit A's corresponding stat
- **THEN** Unit B's stat cell SHALL have `bg-green-500/20`
- **AND** Unit A's cell SHALL have no comparison highlight

#### Scenario: Stats are equal and non-zero
- **WHEN** Unit A's calculated stat is exactly equal to Unit B's corresponding stat and both are non-zero
- **THEN** both cells SHALL have `bg-yellow-500/20`

#### Scenario: Stats are equal and zero
- **WHEN** Unit A's calculated stat and Unit B's corresponding stat are both exactly 0
- **THEN** neither cell SHALL have a comparison highlight

#### Scenario: Missing stat for one unit
- **WHEN** one unit is missing the stat being compared (value is undefined or N/A) while the other has a value
- **THEN** neither cell SHALL receive a comparison highlight (no inference from absence)

#### Scenario: Stat is 0 or missing for BOTH units
- **WHEN** the stat being compared has a value of `0` or is missing (`undefined`) for **both** Unit A and Unit B
- **THEN** in the `ComparisonGrid`, the entire stat row SHALL NOT be rendered
- **AND** in the `StatProgressionTable`, the cell SHALL have no comparison highlight
