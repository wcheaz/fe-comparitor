## 1. State Management

- [ ] 1.1 Lift `promotionEvents` state from `StatProgressionTable` up to `ComparatorPage` (`app/comparator/page.tsx`)
- [ ] 1.2 Pass `promotionEvents` and `setPromotionEvents` as props from `ComparatorPage` to `StatProgressionTable`
- [ ] 1.3 Pass `promotionEvents` as props from `ComparatorPage` to `ComparisonGrid`

## 2. Stat Calculation Logic

- [ ] 2.1 Update `generateProgressionArray` in `lib/stats.ts` to use the user-selected `selectedClassId` from the `PromotionEvent` array instead of always defaulting to `promotesTo[0]`
- [ ] 2.2 Update `calculateAverageStats` in `lib/stats.ts` to accept optional `classes` and `promotionEvents` parameters, and internally delegate to `generateProgressionArray` when promotion data is available
- [ ] 2.3 Ensure that when no `PromotionEvent` is provided for a unit, `generateProgressionArray` continues to default to `baseClass.promotesTo[0]`

## 3. UI: Promotion Class Selector

- [ ] 3.1 In `StatProgressionTable`, add a class selection dropdown next to the existing promotion level dropdown for each unit that has branching promotions
- [ ] 3.2 The dropdown SHALL display the human-readable name of each promotion option, defaulting to the first option
- [ ] 3.3 Changing the class dropdown SHALL update the `promotionEvents` state for that unit, triggering recalculation of the stat progression

## 4. Props and Interface Updates

- [ ] 4.1 Update `StatProgressionTableProps` interface to accept `promotionEvents` and `onPromotionEventsChange` props
- [ ] 4.2 Update `ComparisonGridProps` interface to accept `promotionEvents` prop so the Unit Details table can display the currently selected promotion class

## 5. Verification

- [ ] 5.1 Verify that selecting a different promotion class for a Sacred Stones unit (e.g. with 2 branching options) updates the stat progression table correctly
- [ ] 5.2 Verify that the app behaves identically to current behavior when no promotion class is explicitly selected
- [ ] 5.3 Verify that the promotion class selector only appears for units with more than one promotion option
