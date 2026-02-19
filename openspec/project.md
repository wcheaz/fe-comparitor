# Fire Emblem Unit Comparator

## Purpose
A web application built to allow users to compare different units from the "Fire Emblem" game series. The primary goal is to provide a detailed analytical tool for players to evaluate unit performance throughout the game.

## Tech Stack
- **Framework**: Next.js (React)
- **Language**: TypeScript (Assumed based on Next.js best practices)
- **Data Source**: Multiple JSON files (e.g., `data/engage_units.json`, `data/three_houses_units.json`)

## Core Features
1.  **Join Time**: The specific chapter or point in the game where the character joins the party.
2.  **Base Stats**: The starting statistics of the character upon joining.
3.  **Growth Rates**: The percentage chance for each stat to increase upon leveling up.
4.  **Stat Averages**: Calculated statistics at various levels, derived from Base Stats and Growth Rates.
    - Formula: `Average = Base + (Growth Rate * Level Ups)`
5.  **Class**: The character's starting class and potential promotion paths.
6.  **Skills**: Inherent skills and learnable skills.

## Key Constraints
- **Multi-Game Support**: The application must support units from different Fire Emblem games.
- **Flexible Data Schema**: Different games have different stats (e.g., "Constitution" vs "Build", split Str/Mag vs combined).
    - Unit data JSONs must be treated as having optional fields.
    - The UI must gracefully handle missing stats (e.g., hide "Magic" if the unit doesn't have it, or display "N/A").
    - Data validation should be defining a "Core" set of fields (Name, Game) while allowing flexibility for stats.

## Future Features
- Additional features to be determined.
