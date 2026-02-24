## ADDED Requirements

### Requirement: Arbitrary Promotion Tiers
The system SHALL support an unbounded number of class promotion tiers, resolving paths recursively via the `promotesTo` class property.

#### Scenario: Unit belongs to a 3-tier promotion class (Trainee)
- **WHEN** a unit starts in a tiered class (e.g., "Trainee") that promotes to a Basic class, which then promotes to an Advanced class
- **THEN** the system tracks and calculates cumulative stat progression across all 3 tiers natively without hardcoded Trainee exceptions.

### Requirement: Branching Promotion Path Selection
The system SHALL provide a UI mechanism to select which class a unit promotes into when multiple valid `promotesTo` options exist for their current class.

#### Scenario: Unit has branching promotion choices
- **WHEN** a unit reaches a promotion level and their current class has multiple entries in its `promotesTo` array (e.g., Cavalier -> Paladin or Great Knight)
- **THEN** the user is prompted or allowed to select the desired promotion branch.
- **THEN** the stat calculator applies the specific promotion bonuses and class caps of the user-selected branch.
