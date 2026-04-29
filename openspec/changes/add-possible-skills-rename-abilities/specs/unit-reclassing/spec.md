## ADDED Requirements

### Requirement: reclassOptions data is available for possible skills derivation
The `reclassOptions` field on the `Unit` interface SHALL be populated for all units in games that support reclassing (e.g., Awakening). This field is consumed by the Possible Skills display feature to derive skills obtainable through reclassing. No changes to the reclassing validation logic or event system are required.

#### Scenario: Awakening units have reclassOptions populated
- **WHEN** an Awakening unit is loaded (e.g., Chrom)
- **THEN** the unit's `reclassOptions` array SHALL contain the class IDs the unit can reclass into (e.g., `["cavalier", "archer", "dk_noble"]`)

#### Scenario: GBA units have no reclassOptions
- **WHEN** a GBA unit (e.g., Roy from Binding Blade) is loaded
- **THEN** the unit SHALL NOT have `reclassOptions` or it SHALL be undefined/empty
