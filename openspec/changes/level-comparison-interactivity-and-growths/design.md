## Context

The existing `LevelComparison` component displays side-by-side stats and skills for two selected units. However, the skill pills in this matchup are static (purely visual) and lack colors, tooltips, or descriptions. Additionally, growth rates are not displayed, which makes it difficult to compare unit potential alongside their current averages.

## Goals / Non-Goals

**Goals:**
- Make skill pills in "Has Skills" and "Possible Skills" sections clickable (opening the info modal) and stylized with tier-specific colors.
- Display a side-by-side "Effective Growth Rates" comparison table below the stats table, incorporating class growth modifiers for Awakening.
- Highlight the higher growth rates and display the delta difference in percentages.

**Non-Goals:**
- Modifying growth rates or base stats from within this panel.
- Adding reclassing or promotion event triggers directly inside this panel (which remains in the tables below).

## Decisions

### 1. Skill Interactivity & Variant Resolution
We will pass the `game` prop to `SkillPill` to make them clickable. To style them like the "Possible Skills" section, we need to resolve their tier (`unpromoted` or `promoted`) and unlock level. We will implement a helper `getSkillVariant(skillName, game, classes)` that scans the class database to find the class teaching the skill and parses the level (e.g., `(Lv. 10)`) to return the correct variant string (e.g. `unpromoted-lv10`).
* **Alternative considered**: Storing the tier metadata directly in the state when computing lists.
* **Why chosen**: A database-wide class lookup handles starting skills (which are not in the reclass history) and class skills under a single, unified function.

### 2. Effective Growths Calculations
For non-Awakening units, growths are their personal base growths (`unit.growths`). For Awakening units, they are effective growths (personal + current class growths). We will import and use `getEffectiveGrowths` from `lib/stats.ts` to compute these based on the class of the unit at their selected progression step.
* **Alternative considered**: Implementing a separate custom growths calculator in the UI component.
* **Why chosen**: Reusing the existing `getEffectiveGrowths` function in `lib/stats.ts` maintains consistency in how class growth modifiers are calculated across the app.

### 3. Growth Rates Layout
We will display growth rates in a dedicated "Effective Growth Rates" table located directly below the stats table, maintaining the same side-by-side format (Columns: Stat, Unit A, Unit B, Diff).
* **Alternative considered**: Adding growths as extra columns in the main stats table.
* **Why chosen**: Keeps the layout clean and readable; mixing absolute average stats with percentage growth rates in a single table can confuse users.

## Risks / Trade-offs

- **[Risk] Performance hit due to searching classes list during render**
  - **Mitigation**: The search is restricted to a small list of classes (typically < 100 classes per game) and a handful of skills (at most 6 active skills and ~10 possible skills per unit). A simple array search is extremely fast and will not cause any UI lag.
