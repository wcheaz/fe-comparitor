## ADDED Requirements

### Requirement: Stat Highlighting
The system SHALL visually highlight the superior stat value when comparing two units side-by-side in the comparison grid.

#### Scenario: Unit A has higher stat
- **WHEN** Unit A's calculated stat (base, growth, or average) is strictly greater than Unit B's corresponding stat
- **THEN** Unit A's stat cell SHALL have a distinct background color (e.g., green highlight) to indicate superiority, and Unit B's cell SHALL have no highlight.

#### Scenario: Unit B has higher stat
- **WHEN** Unit B's calculated stat is strictly greater than Unit A's corresponding stat
- **THEN** Unit B's stat cell SHALL have the distinct highlight color, and Unit A's cell SHALL have no highlight.

#### Scenario: Stats are equal
- **WHEN** Unit A's calculated stat is exactly equal to Unit B's corresponding stat
- **THEN** neither Unit A's nor Unit B's stat cell SHALL have any highlight.

#### Scenario: Missing stat
- **WHEN** either Unit A or Unit B is missing the stat being compared (e.g., value is undefined or N/A)
- **THEN** neither cell SHALL be highlighted.
