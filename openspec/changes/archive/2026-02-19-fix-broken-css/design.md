## Context

The Fire Emblem Unit Comparator currently displays unit stats and details (such as join chapter, growths, bases, and averages) in a vertical layout. This makes it difficult for users to quickly compare units side-by-side as they must scroll or look back and forth between far-apart sections. The current CSS is also broken, preventing proper visual styling (e.g., text color, background). 

## Goals / Non-Goals

**Goals:**
- Transition the unit comparison layout from a vertical arrangement to a horizontal, side-by-side arrangement.
- Ensure details like join chapter, growths, and bases align horizontally across the compared units.
- Format numerical stats (growths, bases) into horizontal tables.
- Combine unit average stats into a single table across all levels, handling units with different starting base levels.
- Fix broken CSS rules to restore the intended visual themes and text colors.

**Non-Goals:**
- Completely rewriting the underlying stat calculation logic.
- Adding details/stats that are not currently part of the application context (e.g. adding new character attributes beyond what is already supported).

## Decisions

- **Combined Average Stats Table Construction:**
  - *Decision:* The combined average stats table will calculate its row index based on the lowest base level of the compared units. For units whose base level is higher than the current row's level, the UI will display a `-` character instead of numerical stats.
  - *Rationale:* This ensures visual continuity and alignment, making it immediately clear when a unit is unavailable or their base stats are not applicable at that specific level.
- **CSS Grid/Flexbox for Layout Alignment:**
  - *Decision:* Use CSS Grid and/flexbox to enforce horizontal alignment of major feature categories. 
  - *Rationale:* CSS Grid is well-suited for ensuring specific blocks (like the "Join Chapter" row or "Growths" table) maintain identical vertical placement across multiple unit columns, even if one unit's data takes up more space natively. Flexbox will be used for simpler horizontal alignments within individual tables.
- **Styling Fixes Strategy:**
  - *Decision:* Re-evaluate `globals.css` and the theme config to ensure text colors have appropriate contrast and are fully functional.

## Risks / Trade-offs

- **Risk:** The combined average stats table could become extremely long vertically if the level cap is high (e.g. 40 levels).
  - *Mitigation:* Ensure the table is clearly designed and possibly allow internal scrolling if it breaks the main page layout.
- **Risk:** Mobile responsiveness might suffer with a side-by-side horizontal comparison and table layouts.
  - *Mitigation:* The horizontal comparison should ideally gracefully degrade to a vertical layout (or require horizontal scrolling) on very small screens to maintain usability.
