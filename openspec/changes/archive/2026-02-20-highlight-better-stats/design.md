## Context

Currently, the `CombinedAverageStatsTable` and related comparison grids display stats for two units side-by-side but rely on the user to visually parse and identify which stat is higher. This can be tedious for large numbers of stats. We want to add a visual highlight to the "better" stat in each row when comparing Unit A and Unit B to improve the UX.

## Goals / Non-Goals

**Goals:**
- Visually highlight the higher stat value when comparing two units.
- Apply highlighting to Base Stats, Growth Rates, and Average Stats tables on the comparison page.
- Ensure the highlight is visually accessible and blends well with the existing dark mode theme.

**Non-Goals:**
- Making the highlighting color customizable by the user.
- Highlighting stats where a literal "lower" value might be considered better, unless specifically required. We will assume for standard combat stats (HP, Str, Mag, Spd, etc.) that higher is better.

## Decisions

- **Decision 1: Utility function vs. Inline comparison**
  - We will use an inline comparison (`valA > valB`) for most numeric stats since it is simple and effective. If specific stats ever require a "lower is better" logic in the future, we can refactor this into a dedicated utility function (`getBetterStat(stat, valA, valB)`).

- **Decision 2: Styling method**
  - We will use Tailwind CSS utility classes to apply the visual highlight.
  - *Rationale:* The project is already styled with Tailwind. Applying a background color class (e.g., `bg-green-500/20` or a theme-specific success color) dynamically based on the comparison result is the most idiomatic React/Tailwind approach.

- **Decision 3: Representing Promoted Status**
  - We will add an optional `isPromoted?: boolean` field to the `Unit` interface in `types/unit.ts`.
  - We will update the JSON data files (e.g., `data/binding_blade_units.json`) to include `"isPromoted": true` for prepromoted units like Marcus. If absent, it will default to `false`.
  - In `ComparisonGrid.tsx`, the level display will check this flag. If `true`, it will append a visual indicator (e.g., "Lv. X (Promoted)").

## Risks / Trade-offs

- **Risk:** The background color might clash with the existing text colors or zebra-striping in tables.
  - *Mitigation:* We will use a subtle, low-opacity background color (like `bg-green-500/20` or `bg-green-900/30` in dark mode) to ensure text remains highly readable.

- **Risk:** Handling undefined or missing stats (e.g., older games might not have a Magic stat for physical units).
  - *Mitigation:* The comparison logic must gracefully handle `undefined` values. If either value is missing, no highlight should be applied.
