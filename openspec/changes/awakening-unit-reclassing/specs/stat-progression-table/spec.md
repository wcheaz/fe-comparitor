## MODIFIED Requirements

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions and reclass events. For standard games, it may increment indefinitely or within standard tiers. For games with reclassing (e.g., Awakening), it SHALL reset the displayed level counter to 1 while maintaining internal cumulative stat progression upon every promotion or reclass event.

#### Scenario: Unit crosses level 20 unpromoted without events
- **WHEN** a row is generated for a standard unit passing unpromoted level 20 without explicit promotion events
- **THEN** the row label indicates "Level 1 (Promoted)" instead of "Level 21".

#### Scenario: Unit has infinite sequential leveling
- **WHEN** a row is generated for a unit from a game that does not reset levels on promotion/reclass (e.g., infinite growth mechanics)
- **THEN** the row label continues sequentially (e.g., "Level 21") without appending "(Promoted)".

#### Scenario: Unit formally reclasses or promotes via event
- **WHEN** a reclass or promotion event is explicitly triggered at level X
- **THEN** the subsequent row immediately resets to "Level 1" under the new class's banner, regardless of if X was 10, 20, or another valid level.
