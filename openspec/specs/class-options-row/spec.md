# Capability: class-options-row

## Purpose

Displays all promotion and reclass class options for a unit within the Unit Details table as tier-color-coded `ClassPill` components. This row replaces the standalone `PromotionOptionsDisplay` card.

## Requirements

### Requirement: Class Change Options row in Unit Details table
The ComparisonGrid Unit Details table SHALL include a "Class Change Options" row that displays all classes a unit can change into via promotion chains and reclass options. The row SHALL render after the "Class" row and before the "Join Chapter" row.

For each unit column, the system SHALL:
1. Walk the unit's base class `promotesTo` chain recursively to collect all promotion target classes
2. If the unit's game is "awakening" and the unit has `reclassOptions`, expand ALL reclass-reachable classes without level/tier validation: iterate `reclassOptions`, add each base class, then walk each base class's `promotesTo` chain and add those classes too. Do NOT filter through `isValidReclass` — this display is informational and shows every class reachable through any combination of reclass + promotion, regardless of current level or tier.
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
The class option computation SHALL use a shared utility function `getClassChangeOptions(unit, classes)` exported from `lib/stats.ts`. This function SHALL return a merged, deduplicated, tier-sorted class list. Unlike the stat progression table's reclass validation (which uses `getValidReclassOptions` with level/tier checks), this function SHALL expand reclass options without validation to show all reachable classes.

#### Scenario: Low-level unit still shows all reclass-reachable classes
- **WHEN** Chrom (Lord, level 1, `reclassOptions: ["lord", "cavalier", "archer"]`) is processed by `getClassChangeOptions`
- **THEN** the result SHALL include Cavalier, Archer, and all their promoted classes (Paladin, Great Knight, Sniper, Bow Knight)
- **AND** the result SHALL NOT be filtered by level or `isValidReclass`

#### Scenario: Unit shows reclass promoted variants even when current tier blocks direct reclass to tier 2
- **WHEN** Cherche (Wyvern Rider, tier 1, level 12, `reclassOptions: ["wyvern_rider", "troubadour", "cleric"]`) is processed
- **THEN** the result SHALL include Troubadour, Cleric, and all their promoted classes (e.g., Valkyrie, War Cleric)
- **AND** the tier 1→tier 2 reclass restriction in `isValidReclass` SHALL NOT apply to this display

#### Scenario: Game gating is preserved
- **WHEN** `getClassChangeOptions` is called for a non-Awakening unit
- **THEN** the function SHALL only return promotion chain classes, not reclass targets
