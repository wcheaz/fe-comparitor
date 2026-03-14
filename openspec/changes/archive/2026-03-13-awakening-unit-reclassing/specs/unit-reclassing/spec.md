## ADDED Requirements

### Requirement: Unit Reclassing Event Support
The system SHALL allow users to add "reclass" progression events for units from supported games, effectively returning the unit's level to 1 while retaining accumulated stats.

#### Scenario: Unit reclasses into the same tier
- **WHEN** a unit adds a horizontal reclass event to their progression path
- **THEN** their internal level resets to 1.
- **AND** their accumulated stats carry over to the new class base calculating modifiers.
- **AND** the table rows continue generating from level 1.

#### Scenario: Unit reclasses into a higher tier
- **WHEN** an unpromoted unit reaches level 10 or higher and adds a vertical reclass event (e.g., Master Seal)
- **THEN** their internal level resets to 1, changing their tier to Promoted.
- **AND** the table rows continue generating from level 1.

#### Scenario: Enforcing minimum level for reclassing
- **WHEN** a user attempts to reclass an unpromoted unit before level 10
- **THEN** the system SHALL reject the event or display an invalid state, as Awakening unpromoted units must reach level 10 to reclass.
