## Context

The existing comparator page allows users to view side-by-side progression tables, but lacks a quick, single-point comparison panel. The user needs to compare units at independently chosen points in their lifecycles. We will implement a `LevelComparison` component that calculates and highlights stat matchups and resolves active/possible skills.

## Goals / Non-Goals

**Goals:**
- Provide dropdown selectors populated from each unit's actual progression steps.
- Render a side-by-side stat matchup table displaying active stats, differences, and highlights for higher/capped stats.
- Show secondary stats (`mov`, `con`, `bld`) dynamically.
- For Fire Emblem: Awakening, separate skills into "Has Skills" (active at the chosen level) and "Possible Skills" (remaining learnable skills), ensuring no overlap.

**Non-Goals:**
- Supporting Three Houses skills/reclasses in this change (deferred).
- Editing class change configurations from within this matchup panel.

## Decisions

### 1. Data Retrieval and Level Selection
We will use the existing `generateProgressionArray` from `lib/stats.ts` to compute the list of valid levels for each unit. 
- **Alternative considered**: Stating a simple numerical level slider.
- **Why this was chosen**: Fire Emblem units have branching class paths and level caps. Dropdown selectors populated from the actual non-skipped rows of the progression array allow distinguishing between `Level 10 (Tactician)` and `Level 10 (Grandmaster)` or reclassed states.

### 2. Skill Classification Logic (Awakening)
To display "Has Skills" vs "Possible Skills":
1. For "Has Skills", we initialize with `unit.startingSkills || unit.skills || []`. We then scan the progression array from index `0` up to the selected step's index. For each step, we look at the class skill list (e.g. `["Veteran (Lv. 1)", "Solidarity (Lv. 10)"]`), extract the required level, and if the level at that step is greater than or equal to the required level, we add the skill name (cleaned of level suffix) to "Has Skills".
2. For "Possible Skills", we calculate all class skills from the unit's reclass options and promotions (using the logic in `PossibleSkillsRow.tsx`), and then filter out any skill names already present in the "Has Skills" set.
This ensures zero overlap and accurate active skill state.

### 3. UI Design and Theme Alignment
We will style the matchup table using standard Tailwind CSS classes to match the existing game-specific look. Capped stats will use bold green text (`text-green-600 font-bold`). Higher stats will have a light green background (`bg-green-500/20`).

## Risks / Trade-offs

- **[Risk] State desynchronization when promotion/reclass events are updated**
  - **Mitigation**: Memoize the level selectors and selected indices based on the active units and event state. If the selected index exceeds the new array length, clamp/reset the selector to index `0` (the unit's base level).
