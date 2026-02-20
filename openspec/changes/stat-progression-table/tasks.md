## 1. Helper Logic Updates

- [ ] 1.1 Update `lib/calculations.ts` (or relevant logic file) to expose a function that generates a progression array for a unit from a starting level to an ending level.
- [ ] 1.2 Ensure the progression array generation correctly handles the promotion reset (e.g., Level 21 internal -> Level 1 Promoted).

## 2. Component Implementation

- [ ] 2.1 Create `components/features/StatProgressionTable.tsx`.
- [ ] 2.2 Implement the base table structure, rendering stats as columns and levels as rows.
- [ ] 2.3 Add logic to determine the lowest base level between compared units to use as the starting row.
- [ ] 2.4 Add padding logic: when rendering a row that is lower than a unit's base level, display `-` for their stats.
- [ ] 2.5 Add a state toggle for "Expand to Level 100".
- [ ] 2.6 When the toggle is active, generation logic should continue up to effective level 100 instead of 40.

## 3. UI Integration

- [ ] 3.1 Import and mount `StatProgressionTable` into `app/comparator/page.tsx` (or the relevant container component).
- [ ] 3.2 Ensure it is provided with the currently selected units and their game data.

## 4. Testing & Verification

- [ ] 4.1 Verify that a standard unpromoted unit vs standard unpromoted unit displays correctly.
- [ ] 4.2 Verify that a unit starting at level 1 and a unit starting at level 10 render correctly (the level 10 unit should have `-` for rows 1-9).
- [ ] 4.3 Verify that Pre-promoted units (like Marcus) start their display properly without throwing errors.
