## ADDED Requirements

### Requirement: Data Table Vertical Alignment Across Cards
When two units are selected and their stat progression tables are rendered side-by-side, the data table portion (the `<table>` element containing `<thead>` and `<tbody>`) in each card SHALL start at the same vertical pixel position. The promotion/reclass configuration section above each data table has variable height; the system SHALL ensure the data tables align regardless of that variability.

#### Scenario: Both units have promotion/reclass sections of different heights
- **WHEN** unit A has 3 class-change events and unit B has 0 class-change events
- **THEN** the data table header row in unit A's card and the data table header row in unit B's card appear at the same Y position
- **AND** the shorter promotion/reclass section (unit B's) has extra padding below it to match the taller section's height

#### Scenario: One unit can promote and the other cannot
- **WHEN** unit A can promote (shows promotion dropdowns) and unit B is already promoted or has no promotion options (shows no dropdowns or a minimal section)
- **THEN** the data table headers in both cards are vertically aligned
- **AND** unit B's promotion section is padded to match unit A's section height

#### Scenario: Adding a class-change event realigns both tables
- **WHEN** two units are displayed and the user adds a new class-change event to unit A
- **THEN** unit A's promotion section grows taller
- **AND** unit B's promotion section `min-height` updates to match the new taller height
- **AND** both data tables remain vertically aligned after the update

#### Scenario: Removing a class-change event realigns both tables
- **WHEN** two units are displayed and the user removes a class-change event from unit A, making unit A's section shorter than unit B's
- **THEN** unit A's promotion section `min-height` adjusts to match unit B's section height
- **AND** both data tables remain vertically aligned

#### Scenario: Single unit selected — no alignment applied
- **WHEN** only one unit is selected and a single stat progression table is rendered
- **THEN** no `min-height` override is applied to the promotion/reclass section
- **AND** the section renders at its natural content height

#### Scenario: Mobile layout — single column
- **WHEN** the viewport is below the `md` breakpoint and the layout is `grid-cols-1` (cards stacked vertically)
- **THEN** no `min-height` override is applied to the promotion/reclass section
- **AND** each card renders its promotion section at natural content height

### Requirement: Dynamic Height Measurement via ResizeObserver
Each `StatProgressionTable` SHALL measure the height of its promotion/reclass section using a `ResizeObserver` attached to the section's DOM node. The measured height SHALL be reported to the parent component via a callback prop whenever the section resizes.

#### Scenario: Initial render measurement
- **WHEN** a `StatProgressionTable` mounts with a promotion/reclass section
- **THEN** the `ResizeObserver` fires on the initial render and reports the section's content height to the parent

#### Scenario: Section resizes due to content change
- **WHEN** the user adds or removes a class-change event, changing the promotion section's height
- **THEN** the `ResizeObserver` fires and reports the updated height to the parent

#### Scenario: Cleanup on unmount
- **WHEN** a `StatProgressionTable` unmounts (e.g., the user removes the unit from selection)
- **THEN** the `ResizeObserver` is disconnected to prevent memory leaks
- **AND** the parent removes that unit's height from the coordination state

### Requirement: Coordination State in ComparatorPage
The `ComparatorPage` component SHALL maintain state tracking the measured height of each unit's promotion/reclass section. It SHALL compute the maximum of all tracked heights and pass it as a `minPromoSectionHeight` prop to each `StatProgressionTable`.

#### Scenario: Two units with measured heights of 80px and 120px
- **WHEN** unit A's section measures 80px and unit B's section measures 120px
- **THEN** both tables receive `minPromoSectionHeight: 120`
- **AND** unit A's section is padded to 120px via `min-height`

#### Scenario: Unit removed from selection
- **WHEN** two units are displayed and the user removes one
- **THEN** the remaining unit's `minPromoSectionHeight` becomes `undefined` or is not passed
- **AND** the remaining unit's promotion section renders at its natural content height

#### Scenario: Unit swapped for a different unit
- **WHEN** the user removes unit A and selects unit C while unit B remains
- **THEN** unit A's height entry is removed from coordination state
- **AND** unit C's section is measured on mount and coordination resumes between unit B and unit C
