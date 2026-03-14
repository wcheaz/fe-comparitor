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

### Requirement: Reclassing UI Integration
The UI must render available "Reclass" options in the "Promotion Levels" configuration alongside or in place of "Promote" options when the unit hits the appropriate level threshold. The `generateProgressionArray` function in `lib/stats.ts` must accurately map class transitions, applying the new class's `statModifiers` to reset the unit's caps and factoring in the new class's `baseStats`. Reclassing drops the unit back to Level 1 of the selected class, but keeps their accumulated generic stats intact. The average stat differences between the old class's growths and the newly reclassed growths must smoothly propagate downwards for levels mapped *after* a Reclass Event. Prevent infinitely large stat tables by enforcing a cap on the number of stacked reclass events a user can click (or ensuring "maxLevel" continues to bound the table height effectively).

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
