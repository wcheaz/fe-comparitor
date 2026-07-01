## Why

Currently, comparing two units side-by-side requires the user to scroll through separate, multi-row progression tables or sync them to the lowest common level. There is no simple way to directly compare two units at specific, independent points in their progression (e.g., Roy at Level 16 Promoted vs. Shanna at Level 10 Unpromoted) to see their exact effective stats, stat differences, and active vs. possible skills.

## What Changes

1. **Independent Level Selection**: Provide dropdown level selectors for each selected unit, letting users choose independent points in their progression.
2. **Side-by-Side Stat Comparison**: Display a clear comparison table showing the chosen levels, current classes, and side-by-side stats with highlight indicators for higher stats and capped stats.
3. **Awakening Skill Categorization**: Specifically for Fire Emblem: Awakening, show the unit's active skills (has skills) at the chosen level vs. their possible skills (learnable/reclass skills) with no overlap.
4. **Integration**: Place this matchup section directly above the detailed progression stats table.

## Capabilities

### New Capabilities
- `level-comparison`: Enables side-by-side stat and skill comparison between two units at independently chosen progression levels.

### Modified Capabilities
<!-- None -->

## Scope and Boundaries

### In Scope
- Single-level comparison UI displayed when exactly 2 units are selected.
- Dropdown selectors populated from the unit's non-skipped progression steps (incorporating class history and level-ups).
- Side-by-side stat rows with difference markers and green/red highlights.
- Awakening skills split into "Has Skills" (starting skills + class skills unlocked at or below the selected level) and "Possible Skills" (other skills from reclass options or promotion options, excluding those already in "Has Skills").
- Secondary stats comparison (e.g., Movement `mov`, Constitution `con`, Build `bld`) dynamically displayed depending on the game.

### Non-Goals
- Support for Three Houses reclassing/skills in this matchup view (deferred to a later change).
- Editing promotion or reclass events directly in the level comparison panel (configuration remains in the tables below).

## Impact

- **UI Components**: Create `components/features/LevelComparison.tsx` and integrate it in `app/comparator/page.tsx`.
- **Logic**: Use `generateProgressionArray` from `lib/stats.ts` to retrieve the unit's stats and class history.
