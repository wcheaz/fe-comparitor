## Why

The level comparison component currently lists skill pills as purely static, visual elements without support for clicking to view their descriptions. Additionally, it lacks growth rate details, making it harder for users to evaluate long-term unit potential directly within the side-by-side comparison view.

## What Changes

1. **Interactive and Stylized Skill Pills**: Modify the skill pills rendered inside the level comparison component's active ("Has Skills") and learnable ("Possible Skills") lists to be fully interactive (clickable to open description modal) and stylized with colored borders based on their class tier and unlock level, matching the behavior in the reclass/promotions sections.
2. **Growth Rates Comparison Section**: Introduce an "Effective Growth Rates" side-by-side comparison table directly below the stats table, displaying growth rates for the units at their selected progression steps (incorporating class growth modifiers for games like Awakening), highlighting higher values, and showing differences.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `level-comparison`: Add interactivity/styling to skill pills and introduce a growth rate comparison section in the matchup table.

## Impact

- **UI Components**: Update [LevelComparison](file:///home/ncheaz/git/fe-comparator/components/features/LevelComparison.tsx) to pass `game` and `variant` props to `SkillPill` components, and render the growth rates table.
- **Tests**: Add unit test cases in [LevelComparison.test.tsx](file:///home/ncheaz/git/fe-comparator/__tests__/components/features/LevelComparison.test.tsx) for testing growths rendering, higher growth highlights, and interactive skill pills.
