## ADDED Requirements

### Requirement: Sacred Stones Unit Data
The system SHALL include complete base unit data for all playable characters in Fire Emblem: The Sacred Stones.

#### Scenario: User selects a Sacred Stones unit
- **WHEN** the user opens the unit selector and browses or searches
- **THEN** characters from Fire Emblem: The Sacred Stones are available with their accurate base stats, growth rates, and starting equipment/classes.

### Requirement: Sacred Stones Class Data
The system SHALL include class data for all classes present in Fire Emblem: The Sacred Stones, fully mapping out the branching promotion trees.

#### Scenario: System resolves Sacred Stones class trees
- **WHEN** the system loads a Sacred Stones unit
- **THEN** it successfully identifies their class and recursively maps all available branching promotion options (e.g., Recruit -> Cavalier/Knight -> Paladin/Great Knight/General) with accurate bases and promo gains.
