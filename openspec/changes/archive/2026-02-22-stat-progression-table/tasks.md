## 1. Class Data Integration

- [x] 1.1 Create `<game>_classes.json` files for each supported game (e.g., `binding_blade_classes.json`) containing class bases, promotion bonuses, and hidden modifiers.
- [x] 1.2 Update the data fetching utilities (`lib/data.ts` or equivalent) to load and parse the new class JSON data.
- [x] 1.3 Update global TypeScript types to reflect `Class` entities, base stats, promotion bonuses, and hidden bonuses.

## 2. Helper Logic Updates

- [x] 2.1 Update `lib/calculations.ts` (or relevant logic file) to expose a function that generates a progression array for a unit from a starting level to an ending level.
- [x] 2.2 Ensure the progression array generation correctly handles the promotion reset (e.g., Level 21 internal -> Level 1 Promoted).
- [x] 2.3 Integrate class promotion bonuses from `<game>_classes.json` into the calculation logic so stats increase correctly upon reaching the promotion level.
- [x] 2.4 Integrate class base stats into the calculation logic to floor units' stats upon promotion if they fall below the class bases.

## 3. Component Implementation

- [x] 3.1 Create `components/features/StatProgressionTable.tsx`.
- [x] 3.2 Implement the base table structure, rendering stats as columns and levels as rows.
- [x] 3.3 Add logic to determine the lowest base level between compared units to use as the starting row.
- [x] 3.4 Add padding logic: when rendering a row that is lower than a unit's base level, display `-` for their stats.
- [x] 3.5 Add a state toggle for "Expand to Level 100".
- [x] 3.6 When the toggle is active, generation logic should continue up to effective level 100 instead of 40.
- [x] 3.7 Ensure any hidden class attributes (e.g., +30 Crit) are visually marked or reflected alongside the row where the promotion occurs.

## 4. UI Integration

- [x] 4.1 Import and mount `StatProgressionTable` into `app/comparator/page.tsx` (or the relevant container component).
- [x] 4.2 Ensure it is provided with the currently selected units and the freshly fetched generic class data.

## 5. Testing & Verification

- [x] 5.1 Verify that a standard unpromoted unit vs standard unpromoted unit displays correctly.
- [x] 5.2 Verify that a unit starting at level 1 and a unit starting at level 10 render correctly (the level 10 unit should have `-` for rows 1-9).
- [x] 5.3 Verify that a unit receives exact promotion stat bumps at level 21 internal, and their stats correctly jump up to match class bases if they were behind.
- [x] 5.4 Verify that Pre-promoted units (like Marcus) start their display properly without throwing errors.
