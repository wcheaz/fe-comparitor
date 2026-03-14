# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

The application currently supports *Binding Blade*, *Three Houses*, and *Engage*. Adding data for *Fire Emblem Awakening* expands the comparator's catalog to one of the most mechanically distinct entries in the series, incorporating new systems like innate weaknesses, starting skills, and class stat modifiers alongside traditional unit metrics. This also sets the foundation for tracking personal vs class growths over a character's lifecycle.

## What Changes

- Add *Fire Emblem Awakening* unit data including bases, personal growths, join chapters, weapon ranks, and starting skills.
- Ignore "Child" units for this initial import iteration.
- Implement "innate weaknesses" for units (e.g., dragon weakness for Nowi).
- Add Awakening class details including tier, stat modifiers, class growths, movement types, and abilities.
- Compile and define Awakening-specific abilities for reference in ability information displays.

## Capabilities

### New Capabilities
- `fe-awakening-data`: Comprehensive ingestion of Awakening unit, class, and ability data, including the mechanics for innate weaknesses and class stat modifiers, into `units.json` and `classes.json`.
- `unit-innate-weaknesses`: Extends the unit details display to show innate weaknesses separate from class-based weaknesses.
- `class-growths-and-modifiers`: Tracking and display mechanics designed specifically to factor in class-based stat bonuses and distinct class/personal growth rates.

### Modified Capabilities
- `class-abilities-display`: Requirement update to handle Awakening's extensive personal/class skill system alongside legacy class abilities.
- `stat-progression-table`: Modifications needed to correctly calculate stats resulting from separating personal unit growths from class-specific growths.

## Impact

- A `data/awakening/` directory will be created to house `units.json`, `classes.json`, etc.
- Updates to `types/unit.ts` to track `innateWeaknesses` on the literal `Unit` model, and class `growths`/`statModifiers` on the `Class` model.
- Updates to `lib/normalization.ts` and `lib/stats.ts` to properly aggregate and calculate the sum of base stats + class modifiers + class growths + personal growths.

## Specifications

class-abilities-display/spec.md
## MODIFIED Requirements

### Requirement: Class Abilities are shown in the promotion details modal
When a user clicks the ℹ️ icon next to a promotion option in the Unit Details table, the resulting modal SHALL display a "Class Abilities" section if the promoted class has a non-empty `classAbilities` array.

The section SHALL render after the "Weapons" section and before the "Description" section. Each ability SHALL be displayed as a pill/badge styled consistently with the existing weapon pills (`bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`).

#### Scenario: Promotion modal shows abilities for FE8 Bishop
- **WHEN** a unit's promotion option is Bishop in Sacred Stones
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL display a "Class Abilities" section containing a `Slayer` badge

#### Scenario: Promotion modal suppresses abilities section when empty
- **WHEN** a unit's promotion option has no class abilities (e.g., Paladin in FE6)
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL NOT render a "Class Abilities" section

#### Scenario: Promotion modal shows multiple abilities as separate pills
- **WHEN** a promoted class has multiple abilities (e.g., Assassin: Silencer, Locktouch, Steal)
- **THEN** each ability SHALL be rendered as a separate pill badge

## ADDED Requirements

### Requirement: Starting Skills tracking and display
The `Unit` model SHALL include an optional `startingSkills` string array. These skills SHALL be rendered in the UI using the `AbilityPill` component, similarly to `classAbilities`.

#### Scenario: Unit with starting skills
- **WHEN** an Awakening unit with starting skills (e.g. Chrom with Dual Strike) is loaded
- **THEN** `startingSkills` SHALL contain `"Dual Strike"`
- **AND** the UI components SHALL render this skill as an `AbilityPill`

class-growths-and-modifiers/spec.md
## ADDED Requirements

### Requirement: Class Growths and Stat Modifiers tracking
The `Class` model SHALL include optional `growths` and `statModifiers` objects to represent class-specific growth rates and base stat modifiers.

#### Scenario: Awakening class loaded
- **WHEN** an Awakening class is loaded
- **THEN** it SHALL possess `growths` and `statModifiers` separate from its `baseStats`

### Requirement: Combined Stat calculation for Awakening
When calculating average stats for an Awakening unit, the system SHALL sum the unit's personal bases with the class's `statModifiers`, and the unit's personal growths with the class's `growths`.

#### Scenario: Calculating Awakening unit stats
- **WHEN** generating the stat progression array for an Awakening unit
- **THEN** the starting stats at level 1 SHALL equal `unit.stats` + `currentClass.statModifiers`
- **AND** the growth rates used for level-ups SHALL equal `unit.growths` + `currentClass.growths`

fe-awakening-data/spec.md
## ADDED Requirements

### Requirement: Awakening Unit and Class Data ingestion
The system SHALL support loading unit and class data specifically for Fire Emblem Awakening from the `data/awakening/` directory.

#### Scenario: Awakening unit is loaded
- **WHEN** a unit from FE Awakening is loaded via `lib/data.ts`
- **THEN** it SHALL contain its personal base stats and personal growths
- **AND** it SHALL have `game` equal to `"Awakening"`

stat-progression-table/spec.md
## MODIFIED Requirements

### Requirement: Accurate Promotion Stat Adjustments
The system SHALL apply appropriate statistical bonuses when a unit promotes, according to their new class data defined in the game's class data file. The new class data used MUST correspond to the promotion path selected by the user, or the default first class if no selection is made. For games that use personal vs class bases/growths (e.g. Awakening), the system SHALL instead recalculate stats based on the new class's stat modifiers and growths rather than applying flat promotion bonuses.

#### Scenario: Unit receives promotion bonuses
- **WHEN** a legacy unit's progression crosses their promotion level
- **THEN** their stats are increased by the class's specified promotion bonuses.

#### Scenario: Awakening unit promotes/reclasses
- **WHEN** an Awakening unit's progression crosses their promotion/reclass level
- **THEN** their base stats are recalculated using their personal bases + the new class's stat modifiers.

#### Scenario: Unit stats are floored by class bases
- **WHEN** a unit's stats upon promotion are lower than the new class's base stats
- **THEN** their stats are raised exactly to match the class base stats.

#### Scenario: Unit benefits from hidden class modifiers
- **WHEN** a unit promotes into a class with hidden bonuses (e.g., Swordmaster +30 Crit, Flying)
- **THEN** the system accounts for and displays these modifiers in their progression or detailed breakdown.

unit-innate-weaknesses/spec.md
## ADDED Requirements

### Requirement: Unit Innate Weaknesses tracking
The `Unit` model SHALL include an optional `innateWeaknesses` string array representing vulnerabilities inherent to the character (e.g. Dragon, Beast) independent of their current class.

#### Scenario: Unit with innate weakness
- **WHEN** an Awakening unit like Nowi is loaded
- **THEN** `innateWeaknesses` SHALL contain `"Dragon"`

### Requirement: Display of Innate Weaknesses
The `ComparisonGrid` SHALL display a deduplicated combination of a unit's `innateWeaknesses` and their current class's movement type weaknesses in the "Weaknesses" section.

#### Scenario: Weakness display
- **WHEN** viewing Nowi in the Manakete class
- **THEN** the Weaknesses row SHALL show "Dragon" (from innate) and any class-specific weaknesses without duplicating "Dragon"



## Design

## Context

The current application can compare units across multiple Fire Emblem games (Binding Blade, Sacred Stones, Three Houses, Engage) by normalizing their stats and tracking their promotions. Fire Emblem Awakening introduces divergent mechanics:
1. **Personal vs. Class Growths**: A character's total growth rate is the sum of their personal absolute growths and the growths of their current class.
2. **Class Stat Modifiers**: Base stats for a unit are determined by their absolute personal base stats plus the absolute stat modifiers of their current class.
3. **Innate Weaknesses**: Some units (like Nowi or Panne) have inherent weaknesses (e.g., Dragon, Beast) regardless of their current class, distinct from the class-based weaknesses already modeled.
4. **Starting Skills**: Units can start with specific skills independent of their class abilities.

Integrating Awakening requires structural changes to the `Unit` and `Class` data models and the mathematical logic inside `lib/stats.ts`.

## Goals / Non-Goals

**Goals:**
- Update `types/unit.ts` to support personal base stats, class stat modifiers, personal growths, and class growths.
- Update `lib/stats.ts` and `lib/normalization.ts` to seamlessly calculate the sum of bases + modifiers and personal + class growths when generating average stats.
- Add an `innateWeaknesses` string array to the `Unit` model and display it in the Unit Details grid alongside/merged with class weaknesses.
- Support displaying starting skills.

**Non-Goals:**
- Implementing the "Child Unit" inheritance system (e.g., dynamic growths/bases based on parents) is completely out of scope for this iteration. 
- Pair Up stat calculations in the UI.

## Decisions

**1. Separation of Growths and Bases:**
- We will modify the `Unit` and `Class` schema. 
- For Awakening units, `Unit.stats` will represent their personal bases, and `Class.baseStats` will represent the Class modifiers. 
- *Rationale*: This strictly follows the internal math of Awakening while keeping the data entry clean. The normalization/averaging logic will check if a unit belongs to Awakening; if so, it will add `Unit.stats` and `Class.baseStats` to get the true starting stats.
- *Alternative*: Hardcoding the summed stats directly into the `Unit.stats` block for their starting class. *Rejected* because reclassing (Second Seals) in Awakening changes the class modifiers, so we need to track them independently to accurately calculate averages across different promotion paths.

**2. Innate Weaknesses:**
- We will add `innateWeaknesses?: string[]` to the `Unit` interface. 
- In the `ComparisonGrid` UI, the displayed weaknesses will be a deduplicated union of `unit.innateWeaknesses` and `unit.class.movementType.weaknesses`.

**3. Starting Skills:**
- We will add `startingSkills?: string[]` to the `Unit` interface. These will be rendered in the UI using the existing `AbilityPill` component, similar to how `classAbilities` are handled.

## Risks / Trade-offs

- **Risk**: Regression in calculation logic for FE6, FE7, FE8, FE16, or FE17 when adjusting the stats engine to sum personal and class stats. 
  - *Mitigation*: The summing logic in `lib/stats.ts` and `lib/normalization.ts` will be strictly gated behind a `unit.game === "Awakening"` check, ensuring legacy games still operate exclusively off their hardcoded unit bases.
- **Risk**: Missing stat properties if the schema mapping is incorrect.
  - *Mitigation*: Ensure all dummy stats (like `mag` or `con`) are appropriately mapped or explicitly zeroed out in the JSON parsing phase.

## Current Task Context

## Current Task
- - [ ] 1.1 Update `types/unit.ts` `Unit` interface to include `innateWeaknesses?: string[]` and `startingSkills?: string[]`.
