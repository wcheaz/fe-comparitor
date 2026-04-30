## ADDED Requirements

### Requirement: Cross-unit per-cell highlight computation
The `StatProgressionTable` component SHALL accept optional `otherUnit`, `otherUnitPromotionEvents`, and `otherUnitReclassEvents` props. When `otherUnit` is provided, the component SHALL compute the other unit's full progression array using `generateProgressionArray` and build a lookup map keyed by `internalLevel`. For each rendered row at a given `internalLevel`, if the other unit has a corresponding row at that level, the component SHALL compare stat values cell-by-cell and apply highlight classes.

#### Scenario: Higher stat gets green highlight
- **WHEN** unit A's STR at internal level 10 is 12.5 and unit B's STR at internal level 10 is 10.0
- **THEN** unit A's STR cell at that level SHALL have class `bg-green-500/20`
- **AND** unit B's STR cell at that level SHALL have no comparison highlight

#### Scenario: Equal non-zero stats get yellow highlight
- **WHEN** unit A's SPD at internal level 15 is 18.0 and unit B's SPD at internal level 15 is 18.0
- **THEN** both units' SPD cells at that level SHALL have class `bg-yellow-500/20`

#### Scenario: Equal zero stats get no highlight
- **WHEN** unit A's LCK at internal level 5 is 0 and unit B's LCK at internal level 5 is 0
- **THEN** neither unit's LCK cell SHALL have a comparison highlight

#### Scenario: Missing stat key on other unit
- **WHEN** unit A has a `skl` stat key but unit B uses `dex` instead of `skl`
- **THEN** the component SHALL look up `dex` on unit B as a fallback for `skl` on unit A
- **AND** if the fallback key is also missing, no highlight SHALL be applied

#### Scenario: Other unit has no row at this internal level
- **WHEN** unit A has a row at internal level 30 but unit B's progression terminates at internal level 25
- **THEN** unit A's row at internal level 30 SHALL have no comparison highlight

#### Scenario: IsSkipped row produces no highlight on either table
- **WHEN** unit A has `isSkipped: true` at internal level 3 and unit B has real stats at internal level 3
- **THEN** neither unit A's nor unit B's row at that level SHALL receive a comparison highlight

#### Scenario: Single unit mode — no highlighting
- **WHEN** `otherUnit` is not provided (undefined or null)
- **THEN** no cell in the table SHALL receive a comparison highlight
- **AND** the component SHALL NOT compute the other unit's progression

### Requirement: Highlight class overrides promotion background
When a cell has both a promotion-level background (`bg-blue-100`) and a comparison highlight, the comparison highlight (`bg-green-500/20` or `bg-yellow-500/20`) SHALL take precedence. The promotion sparkle icon (`✨`) SHALL remain visible regardless of highlight class.

#### Scenario: Promotion level with higher stat
- **WHEN** a row is a promotion level (blue background) and unit A's stat is higher than unit B's
- **THEN** unit A's cell SHALL show `bg-green-500/20` instead of `bg-blue-100`
- **AND** the sparkle icon SHALL still be visible

#### Scenario: Promotion level with equal stats
- **WHEN** a row is a promotion level and both units have equal non-zero stats
- **THEN** both cells SHALL show `bg-yellow-500/20` instead of `bg-blue-100`

### Requirement: Valid-level filtering when two units are selected
When `otherUnit` is provided, the component SHALL compute `minVisibleLevel = Math.max(effectiveStartLevel(thisUnit), effectiveStartLevel(otherUnit))` where `effectiveStartLevel` returns `1` for pre-promoted units (`isPromoted === true`) or units with `level < 1`, otherwise returns `unit.level`. Rows with `internalLevel < minVisibleLevel` SHALL be excluded from rendering.

#### Scenario: Two normal units with different base levels
- **WHEN** unit A has level 5 and unit B has level 10
- **THEN** both tables SHALL exclude rows with `internalLevel < 10`

#### Scenario: Pre-promoted unit paired with normal unit
- **WHEN** unit A is pre-promoted (`isPromoted: true`, level 1) and unit B is level 15
- **THEN** both tables SHALL exclude rows with `internalLevel < 15`

#### Scenario: Two pre-promoted units
- **WHEN** both units have `isPromoted: true`
- **THEN** no rows are filtered (`minVisibleLevel = 1`)

#### Scenario: Single unit mode — no filtering
- **WHEN** `otherUnit` is not provided
- **THEN** all rows including `isSkipped` rows SHALL render as before

### Requirement: Legend entries for comparison highlights
When `otherUnit` is provided, the legend SHALL include two additional entries: a green swatch labeled "Higher stat" and a yellow swatch labeled "Equal stats". These entries SHALL NOT appear when `otherUnit` is not provided.

#### Scenario: Two units selected — full legend
- **WHEN** two units are selected and highlighting is active
- **THEN** the legend SHALL show "Higher stat" with a green swatch and "Equal stats" with a yellow swatch

#### Scenario: One unit selected — no comparison legend
- **WHEN** only one unit is selected
- **THEN** the legend SHALL NOT show the "Higher stat" or "Equal stats" entries

#### Scenario: Skipped-row legend adapts to filtering
- **WHEN** two units are selected and valid-level filtering removes all `isSkipped` rows
- **THEN** the "Unit not yet available at this level" legend entry SHALL NOT appear
