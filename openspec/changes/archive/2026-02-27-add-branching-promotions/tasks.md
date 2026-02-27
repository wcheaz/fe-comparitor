## 1. Lift Promotion State to ComparatorPage

- [x] 1.1 In `app/comparator/page.tsx`, add state: `const [promotionEvents, setPromotionEvents] = useState<Record<string, PromotionEvent[]>>({});` (import `PromotionEvent` from `@/types/unit`)
- [x] 1.2 In `app/comparator/page.tsx`, pass `promotionEvents` and `onPromotionEventsChange={setPromotionEvents}` as props to `<StatProgressionTable>` on line 79
- [x] 1.3 In `app/comparator/page.tsx`, pass `promotionEvents` as a prop to `<ComparisonGrid>` on line 66

## 2. Update StatProgressionTable to Accept Props

- [x] 2.1 In `components/features/StatProgressionTable.tsx`, update the `StatProgressionTableProps` interface (line 46) to add: `promotionEvents: Record<string, PromotionEvent[]>` and `onPromotionEventsChange: (events: Record<string, PromotionEvent[]>) => void`
- [x] 2.2 In the component function signature (line 64), destructure the new props: `{ units, promotionEvents, onPromotionEventsChange }`
- [x] 2.3 Remove the local `promotionEvents` state declaration on line 67: `const [promotionEvents, setPromotionEvents] = useState<Record<string, PromotionEvent[]>>({});`
- [x] 2.4 Replace all occurrences of `setPromotionEvents` in the component (lines 314, 336) with `onPromotionEventsChange`

## 3. Ensure Class Selector Renders for Branching Promotions

The class selector UI already exists at lines 328-349 of `StatProgressionTable.tsx`. It renders a `<select>` dropdown when `hasBranchingOptions && promotionOptions.length > 0`. These helper functions are defined at lines 11-31. **Verify that this block is present and functional after the refactor in step 2.** Specifically:

- [x] 3.1 Confirm that the existing `hasBranchingPromotions()` helper (line 11) correctly checks `classObj.promotesTo.length > 1` — this is what drives visibility of the class selector
- [x] 3.2 Confirm that the existing `getPromotionOptions()` helper (line 19) correctly maps `classObj.promotesTo` to `{ id, name }` objects using the loaded `classes` array
- [x] 3.3 Confirm that the class selector `<select>` at lines 329-348 uses the correct `value` (`promotionEvents[unit.id]?.[0]?.selectedClassId || promotionOptions[0]?.id || ''`) and that its `onChange` calls `onPromotionEventsChange` (after step 2.4)
- [x] 3.4 Confirm the class selector `<select>` renders promotion options with their human-readable `option.name`, not their raw ID

## 4. Update ComparisonGrid to Display Selected Promotion

- [x] 4.1 In `components/features/ComparisonGrid.tsx`, update `ComparisonGridProps` (line 14) to add: `promotionEvents?: Record<string, PromotionEvent[]>`
- [x] 4.2 Destructure `promotionEvents` in the component function (line 21)
- [x] 4.3 In the "Promotion Options" row of the Unit Details table (lines 486-519), visually indicate which promotion class is currently selected (e.g. bold text or a checkmark next to the selected class name). Use `promotionEvents[unit.id]?.[0]?.selectedClassId` to determine the selection, defaulting to `promotesTo[0]`

## 5. Verify generateProgressionArray Uses Selected Class

The logic in `lib/stats.ts` at lines 234-241 already reads the selected class from `promotionEvents`:
```
let promoTargetId = baseClass?.promotesTo?.[0];
if (promotionEvents.length > 0) {
  promoLevel = promotionEvents[0].level;
  promoTargetId = promotionEvents[0].selectedClassId || promoTargetId;
}
```
This is then used at line 264 to find the `promotedClass`. **No changes needed here** — just verify it works end-to-end.

- [x] 5.1 Write a unit test in `__tests__/lib/stats.test.ts` that calls `generateProgressionArray` with a mock unit that has a branching class (e.g. `promotesTo: ['hero', 'ranger']`), passing `promotionEvents: [{ level: 20, selectedClassId: 'ranger' }]`, and asserts that the promotion info references "Ranger" not "Hero"
- [x] 5.2 Run `npx jest` and confirm all tests pass

## 6. End-to-End Visual Verification

- [x] 6.1 Run `npm run dev`, navigate to `/comparator`, select a Sacred Stones unit with branching promotions (e.g. a Cavalier who can promote to Paladin or Great Knight)
- [x] 6.2 Confirm the "Promotion Levels" section in the Stat Progression Table shows **two** dropdowns per branching unit: one for level, one for class
- [x] 6.3 Change the class dropdown and confirm the stat values in the table update to reflect the new class's promotion bonuses and caps
- [x] 6.4 Confirm that units with only one promotion option (e.g. Binding Blade units) do NOT show a class dropdown — only the level dropdown
- [x] 6.5 Confirm that if no class is selected, the app behaves identically to before (defaults to first promotion option)
