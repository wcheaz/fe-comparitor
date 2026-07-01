## ADDED Requirements

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

---

### Requirement: Growth Rates Matchup Comparison
The level comparison panel SHALL display an "Effective Growth Rates" section below the stats table when exactly two units are selected.
1. The table SHALL display side-by-side growth rates of both units at their chosen progression steps (incorporating class growth modifiers for games like Awakening).
2. The higher growth rate value SHALL be highlighted in a green background.
3. The table SHALL show the numeric difference in growth rates (as percentages).

#### Scenario: Comparing growth rates side-by-side
- **WHEN** Unit A has 50% HP growth (higher) and Unit B has 40% HP growth at their chosen progression steps
- **THEN** Unit A's HP growth cell is highlighted in green, and the difference cell shows "+10%" towards Unit A
