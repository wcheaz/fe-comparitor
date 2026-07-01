## ADDED Requirements

### Requirement: Awakening Pair Up Bonus Calculation
The system SHALL calculate the Pair Up stat bonuses received by a lead unit from a support unit.
The total Pair Up bonus for a stat is the sum of:
1. The support unit's Stat Bonus based on their raw stats (Stat 10–19: +1, 20–29: +2, 30+: +3).
2. The support unit's Class Bonus.
3. The Support Level Bonus (+1 to all non-movement class bonuses for C or B support, +2 for A or S support).

#### Scenario: Calculating Pair Up bonuses
- **WHEN** calculating the Pair Up bonuses for a lead unit with a support unit
- **THEN** the system applies the support unit's class bonuses plus the support level bonus and their raw stats' bonuses correctly.

### Requirement: Awakening Dual Support Bonus Lookup
The system SHALL retrieve Dual Support bonuses (Hit, Avoid, Critical, and Dodge/Critical Avoid) based on a combined support rank from 1 to 12.
Support level ranks are defined as: None = 1, C = 2, B = 3, A = 4, S = 5.
If the unit has the "Dual Support+" skill, the support rank is increased by +4, capped at a maximum rank of 12.

#### Scenario: Retrieving Dual Support bonuses
- **WHEN** looking up Dual Support bonuses for a combined rank
- **THEN** the system returns the corresponding Hit, Avoid, Critical, and Dodge values according to the Dual Support table.

### Requirement: Awakening Dual Strike and Dual Guard Rates
The system SHALL calculate the Dual Strike and Dual Guard activation rates based on the lead unit's stats, the support unit's stats, and their support level.
Dual Strike Rate: `(Lead Skill + Support Skill) / 4 + BaseRate` (where BaseRate is C = 30%, B = 40%, A = 50%, S = 60%, None = 20%). Dual Strike+ adds +10%.
Dual Guard Rate: `(Lead Stat + Support Stat) / 4 + BaseRate` (where Stat is Def for physical attacks, Res for magical attacks, and BaseRate is C = 2%, B = 5%, A = 7%, S = 10%, None = 0%). Dual Guard+ adds +10%.

#### Scenario: Calculating activation rates
- **WHEN** calculating activation rates for a pair
- **THEN** the system evaluates the formulas using the respective stats, support level, and skill modifiers.
