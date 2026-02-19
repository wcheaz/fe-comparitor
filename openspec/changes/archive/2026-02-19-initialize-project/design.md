# Design: Project Initialization

## Context
We are building the "Fire Emblem Unit Comparator," a web application to compare unit statistics across various Fire Emblem games. This change initializes the project, setting up the foundation, data architecture, core logic, and UI.

## Goals / Non-Goals
- **Goals:**
    - Initialize a scalable Next.js project structure.
    - Define flexible TypeScript interfaces to handle data from multiple FE games (different stats, growth systems).
    - Implement core logic for stat prediction (averages based on growths).
    - Create a user-friendly UI for selecting and comparing units.
- **Non-Goals:**
    - distinct Backend/Database (we will use static JSON files for now).
    - User Authentication (comparison is stateless/local).
    - Mobile app (Responsive Web App is the target).

## Decisions
- **Decision: Next.js + TypeScript + Tailwind CSS**
    - **Why:** Industry standard for React apps, providing strong type safety (crucial for our complex data schemas) and rapid styling.
- **Decision: Static JSON Data Source**
    - **Why:** Game data is static and rarely changes. Avoiding a database reduces complexity and hosting costs.
    - **Alternatives:** Database (PostgreSQL/MongoDB) - overkill for read-only static data.
- **Decision: Client-Side Stat Calculation**
    - **Why:** Users need to interactively change levels and classes. Calculating on the client allows for instant feedback availability without server roundtrips.

## Risks / Trade-offs
- **Risk:** Large Data Files
    - **Mitigation:** If `data/` JSONs become too large, we will implement dynamic imports or fetch logic to load only the specific game data needed.
- **Risk:** Game Logic Variations (e.g., different rounding modes or caps)
    - **Mitigation:** The `UnitStats` interface is designed to be flexible (`[key: string]: number` index signature). We will start with a generic calculation model and abstract game-specific logic into strategy patterns if variations become too complex.

## Migration Plan
- N/A - usage of a new project.

## Open Questions
- Specifics of "Reclassing" logic for newer games (Engage/Three Houses) vs older games (GBA). We will start with "Base Class" assumptions and expand.
