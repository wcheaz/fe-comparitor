## ADDED Requirements

### Requirement: Trainee Tier Promotion Offset
The system SHALL apply negative offset levels (virtual mapping) for Trainee units (e.g. FE8 Recruits) to ensure their stat progressions calculate pre-Tier 1 bases without inflating tier scales or duplicating rows.

#### Scenario: Trainee unit progression maps to Tier 0
- **WHEN** a trainee unit's progression is generated 
- **THEN** their internal level is virtually mapped between -9 and 0, rendering visually as `Level 1 (Trainee)` through `Level 10 (Trainee)`.

### Requirement: Trainee Promotion Level Cap
The system SHALL lock a Trainee's initial promotion dropdown explicitly to Level 10, preventing promotion selection at standard levels (10-20).

#### Scenario: User attempts to change Trainee promotion level
- **WHEN** a user views the promotion configuration for a Trainee unit's first tier
- **THEN** the promotion level dropdown is locked to `10`.

### Requirement: Visual Indicator for Trainee Promotion
The system SHALL render the `✨` promotion icon at the Trainee's forced promotion level threshold.

#### Scenario: Trainee transitions to Tier 1
- **WHEN** a Trainee unit hits Level 10 and promotes to a Base class
- **THEN** the stats table renders a `✨` icon next to the stat values for that row.
