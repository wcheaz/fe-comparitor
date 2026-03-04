## 1. Scaffold `PromotionPathPlanner` Component

- [ ] 1.1 Create file `components/features/PromotionPathPlanner.tsx`.
- [ ] 1.2 Import React, `useState`, `useMemo` from 'react'.
- [ ] 1.3 Import UI primitives: `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` from `@/components/ui/select`.
- [ ] 1.4 Import `Button` from `@/components/ui/button`.
- [ ] 1.5 Import `Unit`, `GameData`, `PromotionEvent` interfaces from `@/types` or relevant data lib.
- [ ] 1.6 Import icons: `PlusIcon`, `MinusIcon` from `lucide-react`.
- [ ] 1.7 Define interface `PromotionPathPlannerProps` with properties: `unit` (Unit | null), `promotionEvents` (PromotionEvent[]), and `onPromotionChange` ((events: PromotionEvent[]) => void).
- [ ] 1.8 Create and export the `PromotionPathPlanner` functional component using the defined props.
- [ ] 1.9 Add an early return: `if (!unit) return null;`.
- [ ] 1.10 Return a basic `<div className="space-y-4">` container wrapping a header `<h3 className="text-lg font-semibold">Promotion Path for {unit.name}</h3>`.

## 2. Implement Class Traversal Logic

- [ ] 2.1 In `PromotionPathPlanner.tsx`, create a `useMemo` hook named `promotionTiers` returning an array of valid class options per tier.
- [ ] 2.2 Inside `promotionTiers`, initialize a `tiers` array of arrays: `let tiers: any[][] = [];`.
- [ ] 2.3 Inside `promotionTiers`, define the starting class ID: `let currentClassId = unit.classId;`.
- [ ] 2.4 Inside `promotionTiers`, loop through `promotionEvents.length + 1` times. At each step, find the current class in `GameData.classes` matching `c.game === unit.game && c.id === currentClassId`.
- [ ] 2.5 Inside the loop, if the class has a `promotesTo` array (length > 0), map these IDs to comprehensive class objects and push to `tiers`.
- [ ] 2.6 Inside the loop, update `currentClassId` to `promotionEvents[step]?.classId` for the next iteration (verifying the user's selected path).

## 3. Implement Multi-Tier Selection UI

- [ ] 3.1 In `PromotionPathPlanner.tsx`, beneath the header, map over the `promotionTiers` array.
- [ ] 3.2 For each tier, render a flex container with a "Tier {index + 1}" label and a `<Select>` dropdown.
- [ ] 3.3 Set the `<Select>` value to `promotionEvents[index]?.classId || ''`.
- [ ] 3.4 Populate `<SelectItem>` components inside the dropdown using the class objects resolved in the current `tier` array.

## 4. Implement Event Handlers 

- [ ] 4.1 In `PromotionPathPlanner.tsx`, create `handleClassSelect(index: number, newClassId: string)`.
- [ ] 4.2 Inside `handleClassSelect`, clone `promotionEvents`.
- [ ] 4.3 Still in `handleClassSelect`, update the target index: `newEvents[index] = { ...newEvents[index], classId: newClassId }`.
- [ ] 4.4 Set default level if creating a new event: `if (!newEvents[index].level) newEvents[index].level = 10;`.
- [ ] 4.5 Slice off invalid higher tiers (e.g. `newEvents = newEvents.slice(0, index + 1);`).
- [ ] 4.6 Call `onPromotionChange(newEvents)`.
- [ ] 4.7 Wire `handleClassSelect` to the `<Select>` `onValueChange` prop.

## 5. Implement Add/Remove Tier Buttons

- [ ] 5.1 In `PromotionPathPlanner.tsx`, structure a `div` at the bottom for "+" and "-" `<Button>`s.
- [ ] 5.2 Add `onClick` to "+": Append a new `PromotionEvent` containing the first `promotesTo` class from the final tier, and call `onPromotionChange`.
- [ ] 5.3 Add `disabled` state to "+": Disable if the latest class in the chain has `promotesTo.length === 0`.
- [ ] 5.4 Add `onClick` to "-": Call `onPromotionChange(promotionEvents.slice(0, -1))`.
- [ ] 5.5 Add `disabled` state to "-": Disable if `promotionEvents.length === 0`.

## 6. Integrate and Clean Up

- [ ] 6.1 Open `app/comparator/page.tsx`. Import `PromotionPathPlanner`.
- [ ] 6.2 In `page.tsx`, directly below the `<ComparisonGrid>`, add a new two-column CSS grid (`grid-cols-2 gap-8`).
- [ ] 6.3 In the left column, render `<PromotionPathPlanner unit={unit1} promotionEvents={unit1Promotions} onPromotionChange={setUnit1Promotions} />`.
- [ ] 6.4 In the right column, render `<PromotionPathPlanner unit={unit2} promotionEvents={unit2Promotions} onPromotionChange={setUnit2Promotions} />`.
- [ ] 6.5 Open `components/features/ComparisonGrid.tsx`.
- [ ] 6.6 In `ComparisonGrid.tsx`, locate the "Promotion Options" `<TableRow>` (approx line 535) and fully delete it.
- [ ] 6.7 Start `npm run dev` and manually verify the new planner correctly drives changes in the `StatProgressionTable`.
