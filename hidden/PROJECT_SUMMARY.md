# Fire Emblem Unit Comparator - Project Summary

This document outlines the features implemented in the Fire Emblem Unit Comparator project thus far, based on an analysis of the codebase.

## Core Features Implemented

1. **Multi-Game Support**
   - The application supports units from multiple Fire Emblem titles, currently including:
     - *Binding Blade*
     - *Three Houses*
     - *Engage*
   - Game-specific data is stored in individual JSON files within the `data/` directory.

2. **Data Normalization & Flexible Schema**
   - The project successfully handles varying stat systems across different games (e.g., handling "Build" vs "Constitution", absent Magic stats in older games). This is managed via parsing and normalization logic in `lib/normalization.ts` and `lib/data.ts`.

3. **Individual Unit Pages**
   - Dedicated pages (`app/units/[id]`) to view a specific unit's detailed breakdown, including their base stats, growth rates, and other inherent properties.

4. **Game-Specific Pages**
   - Pages focused on exploring units within a specific game environment (`app/games/[gameId]`).

5. **Unit Comparison**
   - A dedicated comparator page (`app/comparator`) allowing users to select and compare two different units side-by-side, even across different games.

6. **Interactive UI Components**
   - **Unit Selector**: A functional UI component (`UnitSelector.tsx`) to easily search and choose units for comparison.
   - **Level Slider**: A dynamic slider (`LevelSlider.tsx`) that allows users to adjust the unit's level. The application re-calculates and displays expected stats at the chosen level based on the unit's base stats and growth rates.
   - **Stat Tables**: Clean tabular displays (`StatTable.tsx`) for base, growth, and current average stats.
   - **Combined Average Stats Table**: A unified view for comparing the averaged stats of two units side-by-side (`CombinedAverageStatsTable.tsx`).
   - **Stat Difference Helper**: Visual helpers (`StatDifferenceHelper.tsx`) that explicitly highlight the delta between stats of compared units.
   - **Growth Charts**: Graphical visualization of a unit's growth rates using Recharts (`GrowthChart.tsx`).

7. **Modern Tech Stack & Styling**
   - Built on Next.js 14 and React 18.
   - Styled using Tailwind CSS, including a custom dark-mode/theming setup (`globals.css` and `tailwind.config.ts`).
   - UI primitive components (buttons, cards, inputs, selects) built for reusability in `components/ui/`.

## Changelog & Future Updates

*Whenever a new change or feature is made to the project, please list it below for reference.*

- (No recent changes logged yet)
