# fe-comparator

A web application for comparing Fire Emblem units across multiple games. View and compare base stats, growth rates, and projected averages at any level side-by-side.

## Supported Games

- Fire Emblem: Binding Blade
- Fire Emblem: Blazing Blade
- Fire Emblem: Sacred Stones
- Fire Emblem: Awakening
- Fire Emblem: Three Houses
- Fire Emblem: Engage

## Features

- **Stat comparison** -- Compare base stats, growth rates, and calculated stat averages at any level between two units
- **Multi-game support** -- Compare units across different Fire Emblem titles with normalized data
- **Visual analytics** -- Growth charts and visual stat difference displays for quick analysis
- **Game rosters** -- Browse all units from each supported game
- **Unit details** -- View individual unit details including skills, weapon ranks, promotions, and reclass options where applicable
- **Quick compare** -- Randomly selects two units from different games for a quick comparison

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts (for growth charts)
- Jest and Playwright (for testing)

## Getting Started

### Prerequisites

- Node.js >= 24.0.0

### Installation

```
npm install
```

### Development

```
npm run dev
```

Open http://localhost:3000 in your browser.

### Build

```
npm run build
npm start
```

### Testing

```
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run e2e          # Run end-to-end tests (Playwright)
```

### Linting

```
npm run lint
```

## Project Structure

```
app/                  # Next.js App Router pages
  comparator/         # Side-by-side unit comparison page
  games/[gameId]/     # Game roster pages
  units/[id]/         # Individual unit detail pages
components/
  features/           # Domain-specific components (ComparisonGrid, GrowthChart, UnitCard, etc.)
  ui/                 # Reusable UI components (Button, Card, Modal, etc.)
data/                 # Static unit, class, and skill data per game (JSON)
lib/                  # Utility functions and data access layer
types/                # TypeScript type definitions
__tests__/            # Unit and e2e tests
```
