## ADDED Requirements

### Requirement: Possible Skills row in Unit Details table
The ComparisonGrid Unit Details table SHALL include a "Possible Skills" row that displays all skills a unit could possibly learn by reclassing into any of their `reclassOptions` classes **and** by subsequently promoting those reclass classes. The row SHALL render after the "Starting Skills" row and before the "Supports" row.

For each unit column, the system SHALL:
1. Read the unit's `reclassOptions` array (list of class IDs)
2. For each reclass class ID, look up the corresponding `Class` object and read its `classSkills` array
3. For each reclass class, also look up each class in its `promotesTo` array and read those promoted classes' `classSkills`
4. Collect all skills from all reclass classes and their promoted classes into a single list
5. Exclude any skill already present on the unit's current class's `classSkills` array
6. Render each remaining skill as a `SkillPill` component, annotated with the originating class name

The row SHALL only render when at least one displayed unit has non-empty `reclassOptions` that produce at least one possible skill not already on the unit's current class.

#### Scenario: Awakening unit with reclass options shows possible skills including promoted class skills
- **WHEN** Chrom (Lord class, `reclassOptions: ["cavalier", "archer"]`) is displayed in the ComparisonGrid
- **AND** the Cavalier class has `classSkills: ["Discipline (Lv. 1)", "Outdoor Fighter (Lv. 10)"]` and `promotesTo: ["great_knight", "paladin"]`
- **AND** the Paladin class has `classSkills: ["Dual Guard+ (Lv. 1)", "Rescue (Lv. 10)"]`
- **AND** the Great Knight class has `classSkills: ["Dual Guard+ (Lv. 1)", "Luna (Lv. 10)"]`
- **AND** the Archer class has `classSkills: ["Skill +2 (Lv. 1)", "Quick Burn (Lv. 10)"]` and `promotesTo: ["sniper", "bow_knight"]`
- **THEN** the Possible Skills row SHALL display all skills from Cavalier, Paladin, Great Knight, Archer, Sniper, and Bow Knight as SkillPills
- **AND** no skill from Chrom's current Lord/Tactician class SHALL appear in the possible skills list

#### Scenario: Unit without reclass options does not show the row
- **WHEN** a GBA unit (e.g., Roy from Binding Blade) with no `reclassOptions` is displayed
- **THEN** the Possible Skills row SHALL NOT render

#### Scenario: Reclass class with no skills and no promoted skills does not contribute pills
- **WHEN** a unit has `reclassOptions: ["cavalier"]` and the Cavalier class has `classSkills: []` and all its promoted classes also have `classSkills: []`
- **AND** the unit's current class also has `classSkills: []`
- **THEN** no Possible Skills pills are rendered for that unit column

#### Scenario: Duplicate skills across multiple classes appear once
- **WHEN** a unit has `reclassOptions: ["cavalier"]` and Cavalier promotes to Paladin
- **AND** both Cavalier and Paladin share a skill (e.g., "Dual Guard+ (Lv. 1)")
- **AND** the unit's current class does NOT have "Dual Guard+ (Lv. 1)"
- **THEN** "Dual Guard+ (Lv. 1)" SHALL appear as a single SkillPill, not duplicated

#### Scenario: Row visibility depends on at least one unit having possible skills
- **WHEN** the ComparisonGrid displays multiple units
- **AND** none of them have `reclassOptions` or none produce possible skills
- **THEN** the "Possible Skills" row SHALL NOT render at all

#### Scenario: Unit with no possible skills shows "None"
- **WHEN** the Possible Skills row is visible (at least one unit has possible skills)
- **AND** a specific unit in the grid has `reclassOptions` but all reclass and promoted class skills are already on the unit's current class
- **THEN** that unit's cell SHALL display "None" as muted text

### Requirement: Possible Skills are annotated with originating class name
Each skill displayed in the Possible Skills row SHALL show the name of the class it originates from. This allows users to understand which reclass path grants each skill.

The class name SHALL be displayed as a small label or badge adjacent to (or above/below) each SkillPill. If the same skill appears in multiple classes (after deduplication), the skill SHALL be displayed once with all originating class names listed.

#### Scenario: Skill from one class shows single class label
- **WHEN** "Discipline (Lv. 1)" is a skill unique to the Cavalier class
- **THEN** the SkillPill for "Discipline (Lv. 1)" SHALL display "Cavalier" as its originating class label

#### Scenario: Skill shared across multiple classes shows all class labels
- **WHEN** "Dual Guard+ (Lv. 1)" appears in both Paladin and Great Knight classes
- **AND** both classes are in the unit's reclass/promotion chain
- **THEN** the SkillPill for "Dual Guard+ (Lv. 1)" SHALL display both "Paladin" and "Great Knight" as originating class labels

#### Scenario: Promoted class skills show the promoted class name, not the base class
- **WHEN** a unit reclasses to Cavalier which promotes to Paladin
- **AND** Paladin has the skill "Rescue (Lv. 10)"
- **THEN** the originating class label for "Rescue (Lv. 10)" SHALL be "Paladin", not "Cavalier"

### Requirement: Possible Skills are color-coded by tier and level
Each skill pill in the Possible Skills row SHALL be color-coded based on the tier of the originating class and the level requirement parsed from the skill name. This gives users a visual cue about when and where each skill becomes available.

The level requirement SHALL be parsed from the skill name using the pattern `(Lv. X)`. If no level suffix is present, the skill SHALL be treated as level 1.

Coloring SHALL use a distinct combination of tier × level. The exact colors are a design choice left to the implementer, but the following combinations SHALL be visually distinguishable:

| Tier | Level | Variant |
|------|-------|---------|
| Unpromoted | 1 | `unpromoted-lv1` |
| Unpromoted | 10 | `unpromoted-lv10` |
| Unpromoted | 5 (or other) | `unpromoted-lv5` |
| Promoted | 1 | `promoted-lv1` |
| Promoted | 5 | `promoted-lv5` |
| Promoted | 10 (or other) | `promoted-lv10` |

If a skill appears in multiple classes with different tiers, the skill SHALL use the color of the first class it was encountered in (deterministic ordering based on reclassOptions iteration order).

#### Scenario: Unpromoted class skill at level 1 gets unpromoted-lv1 color
- **WHEN** "Discipline (Lv. 1)" is a skill from the Cavalier class (unpromoted)
- **THEN** the SkillPill SHALL use the `unpromoted-lv1` color variant

#### Scenario: Promoted class skill at level 1 gets promoted-lv1 color
- **WHEN** "Dual Guard+ (Lv. 1)" is a skill from the Paladin class (promoted)
- **THEN** the SkillPill SHALL use the `promoted-lv1` color variant

#### Scenario: Skill at level 10 gets level-10 variant
- **WHEN** "Outdoor Fighter (Lv. 10)" is a skill from the Cavalier class (unpromoted)
- **THEN** the SkillPill SHALL use the `unpromoted-lv10` color variant

#### Scenario: Skill with no level suffix treated as level 1
- **WHEN** a skill like "Dance" has no `(Lv. X)` suffix and is from an unpromoted class
- **THEN** the SkillPill SHALL use the `unpromoted-lv1` color variant

#### Scenario: Skill shared across tiers uses first-encountered tier color
- **WHEN** "Dual Guard+ (Lv. 1)" appears in both Cavalier (unpromoted) and Paladin (promoted)
- **AND** Cavalier is encountered first in the reclassOptions iteration
- **THEN** the SkillPill SHALL use the `unpromoted-lv1` color variant
