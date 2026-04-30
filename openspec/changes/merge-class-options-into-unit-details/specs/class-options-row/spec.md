# Capability: class-options-row

## Purpose

Displays all promotion and reclass class options for a unit within the Unit Details table as tier-color-coded `ClassPill` components. This row replaces the standalone `PromotionOptionsDisplay` card.

## ADDED Requirements

### Requirement: Class Change Options row in Unit Details table
The ComparisonGrid Unit Details table SHALL include a "Class Change Options" row that displays all classes a unit can change into via promotion chains and reclass options. The row SHALL render after the "Class" row and before the "Join Chapter" row.

For each unit column, the system SHALL:
1. Walk the unit's base class `promotesTo` chain recursively to collect all promotion target classes
2. If the unit's game is "awakening" and the unit has `reclassOptions`, call `getValidReclassOptions()` to collect valid reclass target classes (including their expanded `promotesTo` chains)
3. Merge both sets into a deduplicated collection keyed by class ID
4. Exclude the unit's current base class from the collection
5. Sort the result by tier descending (tier 2 first, then tier 1, then tier 0)
6. Render each class as a `ClassPill` component with a tier-aware variant

The row SHALL only render when at least one displayed unit has at least one class change option.

Units with no class change options in a visible row SHALL display "None" as muted text.

#### Scenario: Awakening unit with promotion and reclass options shows all classes
- **WHEN** Chrom (Lord class, `reclassOptions: ["cavalier", "archer"]`) is displayed in the ComparisonGrid
- **AND** Lord promotes to Great Lord
- **AND** Cavalier promotes to Paladin and Great Knight
- **AND** Archer promotes to Sniper and Bow Knight
- **THEN** the "Class Change Options" row SHALL display ClassPill components for Great Lord, Paladin, Great Knight, Sniper, Bow Knight, Cavalier, and Archer
- **AND** promoted classes (Great Lord, Paladin, Great Knight, Sniper, Bow Knight) SHALL appear before unpromoted classes (Cavalier, Archer) in the sort order

#### Scenario: GBA unit with only promotion options shows promotion targets
- **WHEN** a GBA unit (e.g., Roy from Binding Blade) with a promotion chain but no `reclassOptions` is displayed
- **THEN** the "Class Change Options" row SHALL display only the promotion target classes as ClassPill components
- **AND** no reclass classes SHALL appear

#### Scenario: Unit with no promotion or reclass options shows "None"
- **WHEN** the "Class Change Options" row is visible because another unit has options
- **AND** a specific unit has no `promotesTo` chain and no `reclassOptions`
- **THEN** that unit's cell SHALL display "None" as muted text

#### Scenario: Row hidden when no units have class change options
- **WHEN** all displayed units have no `promotesTo` targets and no `reclassOptions`
- **THEN** the "Class Change Options" row SHALL NOT render

#### Scenario: Duplicate classes across promotion and reclass paths appear once
- **WHEN** a class appears in both a unit's promotion chain and their reclass expansion
- **THEN** that class SHALL render as a single ClassPill, not duplicated

### Requirement: Class Change Options row uses shared utility function
The class option computation SHALL use a shared utility function `getClassChangeOptions(unit, classes)` exported from `lib/stats.ts`. This function SHALL return the same merged, deduplicated, tier-sorted class list used by the stat progression table's class change dropdown.

#### Scenario: Shared utility returns identical results to stat progression dropdown
- **WHEN** `getClassChangeOptions(chrom, allClasses)` is called for an Awakening unit with reclass options
- **THEN** the returned class list SHALL contain exactly the same classes (by ID) that appear in the stat progression table's class change dropdown for that unit

#### Scenario: Game gating is preserved
- **WHEN** `getClassChangeOptions` is called for a non-Awakening unit
- **THEN** the function SHALL only return promotion chain classes, not reclass targets
