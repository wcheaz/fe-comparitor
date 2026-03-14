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
