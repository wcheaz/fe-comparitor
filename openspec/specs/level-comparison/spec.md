# Capability: Level Comparison

## Purpose
Provides a side-by-side level-based stat and skill matchup comparison between exactly two selected units, allowing independent level selection and dynamic secondary stat rendering.

## Requirements

### Requirement: Independent Level Selectors
The system SHALL display two independent dropdown selectors (one for each selected unit) when exactly two units are selected. The dropdown options SHALL contain all non-skipped steps in the unit's progression history, including their class names and level numbers.

#### Scenario: Dropdown selectors are populated
- **WHEN** exactly two units (e.g. Robin and Frederick) are selected
- **THEN** the level selector options display their class history, e.g., `Level 10 (Tactician)` and `Level 1 (Great Knight) (Tier 2)`

### Requirement: Stat Matchup Comparison
The system SHALL display a side-by-side comparison table of stats at the independently chosen levels. The higher stat value SHALL be highlighted in a green background, and capped stats SHALL be bolded/highlighted in green text. The table SHALL show the numeric difference between the two values.

#### Scenario: Comparing stats side-by-side
- **WHEN** Unit A has 25 Str (higher) and Unit B has 20 Str at their chosen levels
- **THEN** Unit A's Str cell is highlighted in green, and the difference cell shows `+5.00` towards Unit A

#### Scenario: Highlighting capped stats
- **WHEN** a unit's stat has reached its class cap at the chosen level
- **THEN** the stat value is highlighted in bold green text

### Requirement: Awakening Skill Matchup
For Fire Emblem: Awakening units, the comparison panel SHALL list two separate skill categories: "Has Skills" and "Possible Skills". 
1. "Has Skills" SHALL include starting/inherent skills and class skills unlocked at or below the selected level.
2. "Possible Skills" SHALL include class skills from promotion or reclass options that the unit can learn, excluding any skills already present in "Has Skills". There SHALL be no overlap between the two lists.

#### Scenario: Classifying skills for Awakening
- **WHEN** Robin is compared at Level 20 unpromoted (Tactician)
- **THEN** "Has Skills" shows `Veteran` (Lv. 1) and `Solidarity` (Lv. 10), and "Possible Skills" includes skills like `Ignis` or `Armsthrift` but excludes `Veteran` and `Solidarity`

### Requirement: Secondary Stats Display
The matchup table SHALL dynamically render rows for secondary stats (such as movement `mov`, constitution `con`, and build `bld`) only if at least one of the selected units has a non-undefined base value for that stat.

#### Scenario: Rendering secondary stats for GBA units
- **WHEN** comparing two Binding Blade units with constitution `con`
- **THEN** the comparison table displays a row for Constitution (Con)

### Requirement: Interactive Skill Matchup Pills
For Fire Emblem: Awakening units, the skill pills in the level comparison panel (both "Has Skills" and "Possible Skills") SHALL be interactive and styled.
1. Each skill pill SHALL be clickable and, on click, open a Modal displaying the skill's name, type (Active/Passive), description, proc chance, and proc condition if applicable.
2. The skill pills SHALL be styled with class tier and level-specific variants, matching the colors used in the class skills display.

#### Scenario: Clicking a skill pill opens detailed info
- **WHEN** Robin is compared and the user clicks on the "Veteran" skill pill in "Has Skills"
- **THEN** a Modal opens showing "Veteran" and its description

#### Scenario: Skill pills have colored variants
- **WHEN** Robin's skills are listed at Level 20 unpromoted
- **THEN** "Veteran" is styled with the "unpromoted-lv1" variant style, and "Solidarity" is styled with the "unpromoted-lv10" variant style

### Requirement: Growth Rates Matchup Comparison
The level comparison panel SHALL display an "Effective Growth Rates" section below the stats table when exactly two units are selected.
1. The table SHALL display side-by-side growth rates of both units at their chosen progression steps (incorporating class growth modifiers for games like Awakening).
2. The higher growth rate value SHALL be highlighted in a green background.
3. The table SHALL show the numeric difference in growth rates (as percentages).

#### Scenario: Comparing growth rates side-by-side
- **WHEN** Unit A has 50% HP growth (higher) and Unit B has 40% HP growth at their chosen progression steps
- **THEN** Unit A's HP growth cell is highlighted in green, and the difference cell shows "+10%" towards Unit A
