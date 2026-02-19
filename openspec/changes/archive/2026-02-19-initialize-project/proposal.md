# Fire Emblem Unit Comparator Implementation Proposal

This document outlines the detailed steps to build the Fire Emblem Unit Comparator web application.

## Phase 1: Project Initialization & Configuration

1.  **Initialize Next.js Project**
    -   Run `npx create-next-app@latest . --typescript --tailwind --eslint` (if not already initialized).
    -   Ensure `tsconfig.json` is configured with strict mode.
    -   Review `tailwind.config.ts` for theme customization (Fire Emblem inspired colors).
    -   Install additional dependencies: `clsx`, `tailwind-merge` (for utility classes), `recharts` or `chart.js` (for graphs).

2.  **Directory Structure Setup**
    -   Create `components/ui` for reusable UI components.
    -   Create `components/features` for domain-specific components (UnitCard, StatTable).
    -   Create `lib` for utility functions (stat calculations).
    -   Create `types` for TypeScript interfaces.
    -   Ensure `data` directory is populated with game JSONs.

## Phase 2: Data Architecture & Type Definitions

3.  **Define Core Interfaces (`types/unit.ts`)**
    -   Create `UnitStats` interface with all fields optional:
        ```typescript
        interface UnitStats {
            hp?: number;
            str?: number;
            mag?: number;
            skl?: number; // Skill (GBA/Tellius)
            dex?: number; // Dexterity (3H/Engage)
            spd?: number;
            lck?: number;
            def?: number;
            res?: number;
            con?: number; // Constitution (GBA)
            bld?: number; // Build (Engage)
            mov?: number;
            cha?: number; // Charm (3H)
            [key: string]: number | undefined; // Flexible for future games
        }
        ```
    -   Create `PromotionOption` interface for branching paths:
        ```typescript
        interface PromotionOption {
            class: string;
            promoGains: UnitStats;
            // potential new growths?
        }
        ```
    -   Create `Unit` interface:
        ```typescript
        interface Unit {
          id: string;
          name: string;
          game: string;
          class: string;
          joinChapter: string;
          level: number; // Base level
          stats: UnitStats; // Base stats (includes HP)
          growths: UnitStats; // Growth rates
          maxStats?: UnitStats; // Optional caps
          skills?: string[];

          // New Advanced Features
          supports?: string[]; // List of unit IDs or Names this unit supports with
          reclassOptions?: string[]; // List of classes unit can reclass into
          promotions?: PromotionOption[]; // Branching promotion paths
          affinity?: string; // Support affinity (Fire, Thunder, etc.)
        }
        ```
    -   Create `GameData` interface for game-specific metadata (stat labels, max level).
    -   **Consider separate `ClassData`** if reclassing changes base stats/growths significantly (e.g., Shadow Dragon/Awakening/Fates/Engage style). For now, `reclassOptions` and `promotions` on the unit might suffice for simple display, but full calc needs class data.

4.  **Implement Data Service (`lib/data.ts`)**
    -   Create function `getAllUnits()`: merging data from all JSON files.
    -   Create function `getUnitsByGame(game: string)`.
    -   Create function `getUnitById(id: string)`.
    -   Implement error handling for missing files or malformed data.

## Phase 3: Core Logic Implementation

5.  **Stat Calculation Utility (`lib/stats.ts`)**
    -   Implement `calculateAverageStats(unit: Unit, targetLevel: number): UnitStats`.
        -   Formula: `Base + (Growth * (TargetLevel - BaseLevel) / 100)`.
        -   Handle capping at max stats if data available.
        -   Handle negative level differences (if user selects lower level).
    -   Implement `compareUnits(unitA: Unit, unitB: Unit, level: number)` returning stat differences.

6.  **Data Normalization**
    -   Create utility to standardize stat keys (e.g., ensure "Str" vs "Strength" align if needed, or mapping config).
    -   Handle missing stats (e.g., Magic in games without Magic stat).

## Phase 4: UI Component Development

7.  **Shared UI Components**
    -   `Button`: standardized styles.
    -   `Card`: container with consistent padding/shadow.
    -   `Input/Select`: for unit filtering.

8.  **Feature Components**
    -   `UnitCard`: Displays unit portrait (placeholder if needed), name, class, join info.
    -   `StatTable`: Renders table of stats. Needs to handle dynamic keys.
        -   Columns: Stat Name | Base | Growth | Average (at Level X).
    -   `GrowthChart`: A radar chart or bar chart comparing growths of selected units.
    -   `LevelSlider`: Control to dynamically change the level for average stat calculation.

9.  **Comparison View Components**
    -   `UnitSelector`: Searchable dropdown to add unit to comparison.
    -   `ComparisonGrid`: Layout for side-by-side unit cards.
    -   `StatDifferenceHelper`: Visual indicator (green/red) for higher/lower stats.

## Phase 5: Page Implementation

10. **Home Page (`app/page.tsx`)**
    -   Hero section explaining purpose.
    -   "Quick Compare" feature (select 2 random or popular units).
    -   Links to specific Game rosters.

11. **Comparator Page (`app/comparator/page.tsx`)**
    -   State: `selectedUnits` (Array of Units).
    -   State: `targetLevel` (number).
    -   Layout:
        -   Top: Unit Selectors (allow adding up to 4 units).
        -   Middle: Controls (Level Slider, Toggle Display Mode).
        -   Bottom: Comparison Grid / Charts.

12. **Unit Detail Page (`app/units/[id]/page.tsx`)**
    -   Detailed view for a single unit.
    -   Lore/Description (if available).
    -   Full growth rates and base stats.
    -   "Compare with..." button.

## Phase 6: Styling & Polish

13. **Theming**
    -   Implementation of a color scheme fitting Fire Emblem (Blue/Gold/White or game specific).
    -   Responsive adjustments for mobile (stacking comparison cards).

14. **Optimization**
    -   `useMemo` for expensive stat calculations.
    -   Static Generation (SSG) for Unit Detail pages if data is static.

15. **Testing & Validation**
    -   Verify calculations against known averages (Serenes Forest or similar wiki).
    -   Test edge cases: Level 1 to Level 20/40 comparisons.
    -   Ensure missing stats (e.g., Constitution) don't break the UI.

## Phase 7: Deployment

16. **Build & Deploy**
    -   Run `npm run build` to check for type errors.
    -   Deploy to Vercel (or preferred host).
