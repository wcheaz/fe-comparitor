## Why

The website is currently very plain and not user-friendly. The vertical layout makes it difficult to quickly compare two units side-by-side. Moving to a horizontal layout will vastly improve the UX and readability of the tool.

## What Changes

- Redesign the unit comparison view to be horizontal rather than vertical.
- Create specific sections for each major category of comparison so that details align vertically (e.g., unit 1's join chapter is on the left, unit 2's join chapter is on the right at the same vertical position).
- Apply this horizontal alignment to all major unit detail categories, including but not limited to:
  - Join Chapter
  - Unit Growths
  - Unit Bases
  - Unit average stats across all levels as a single combined table (starting at the lower base level among compared units; if a unit starts at a higher level than another, their stats for earlier levels should be shown as "-")
  - Unit support list
- Format stats (like growths and bases) as tables, preferring horizontal table layouts for easier parsing.
- Fix broken CSS affecting elements like text color to ensure the page is styled correctly and functionally intact.

## Capabilities

### New Capabilities

- `horizontal-comparison`: Implement side-by-side horizontal comparison for unit details, including aligned sections for join chapter, growths, bases, average stats, and supports, along with table-based stat formatting.
- `ui-styling-fixes`: Fix broken CSS rules to restore intended text colors and overall visual design of the application.

### Modified Capabilities

## Impact

- **UI/Layout**: Complete overhaul of the unit comparison page layout.
- **Components**: Updates to all components that render unit stats (growths, bases, averages, supports) to support table formatting and horizontal arrangement.
- **Styling**: Extensive updates to global and component-level CSS to fix broken styles and support the new layout.
