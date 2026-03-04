## 1. Scaffold `PromotionOptionsDisplay` Component

- [ ] 1.1 Create file `components/features/PromotionOptionsDisplay.tsx`.
- [ ] 1.2 Import React, `useState`, `useEffect`. Import `Unit`, `Class` interfaces and `getAllClasses` from `@/lib/data`.
- [ ] 1.3 Import UI primitives: `Card`, `CardContent`, `CardHeader`, `CardTitle` from `@/components/ui/card`.
- [ ] 1.4 Define interface `PromotionOptionsDisplayProps` with property `unit` (`Unit | null`).
- [ ] 1.5 Create and export the `PromotionOptionsDisplay` functional component. Check `if (!unit) return null;`.
- [ ] 1.6 Return a basic `<Card>` container wrapping a `<CardHeader>` with `<CardTitle>Promotion Options - {unit.name}</CardTitle>` and an empty `<CardContent>`.

## 2. Implement Recursive Class Traversal

- [ ] 2.1 In `PromotionOptionsDisplay.tsx`, add a `useState` for `classes` and a `useEffect` to fetch all classes using `getAllClasses()`.
- [ ] 2.2 Create a recursive helper function `getPromotionTree(classId: string, visited = new Set<string>())` that finds the class in the loaded array for `unit.game`. 
- [ ] 2.3 Inside the helper, if the class has a `promotesTo` array (length > 0) and the `classId` isn't in `visited` (to prevent infinite loops), map over its IDs and recursively call `getPromotionTree` on each, returning a nested node structure (e.g., `{ id, name, promotions: [...] }`).
- [ ] 2.4 Use `useMemo` to invoke `getPromotionTree` starting from `unit.classId` (or `unit.class`) whenever the `classes` state or `unit` changes.

## 3. Render Promotion Options Tree

- [ ] 3.1 Above the main component in `PromotionOptionsDisplay.tsx`, define a recursive recursive rendering component `ClassNode({ node })` to display the tree.
- [ ] 3.2 For each `node` in the tree, render its `name`. If it has `promotions` (children), render a nested `<ul>` containing the mapped children nodes wrapped in `<li>` tags. Add bullet point styling or visual hierarchy (e.g., `ml-4 list-disc`).
- [ ] 3.3 Inside the main `PromotionOptionsDisplay` component's `<CardContent>`, render the `ClassNode` starting with the root tree returned from `useMemo`. 
- [ ] 3.4 Ensure the UI gracefully handles units that cannot promote (e.g., display "No promotion options available").

## 4. Integrate and Clean Up

- [ ] 4.1 Delete the previous `components/features/PromotionPathPlanner.tsx` file if it exists.
- [ ] 4.2 Open `app/comparator/page.tsx` and import `PromotionOptionsDisplay` instead of the planner.
- [ ] 4.3 Replace the mapped `<PromotionPathPlanner>` instances below the `<ComparisonGrid>` with `<PromotionOptionsDisplay unit={unit} />`.
- [ ] 4.4 Open `components/features/ComparisonGrid.tsx`. Locate and completely delete the inline "Promotion Options" `<TableRow>` so it is removed from the unit details table.
- [ ] 4.5 Verify `npm run dev` renders a static, nested list displaying every tier of promotion for the selected units, removing the interactive planner functionality.
