## 1. Scaffold `PromotionOptionsDisplay` Component

- [x] 1.1 Create file `components/features/PromotionOptionsDisplay.tsx`.
- [x] 1.2 Import React, `useState`, `useEffect`. Import `Unit`, `Class` interfaces and `getAllClasses` from `@/lib/data`.
- [x] 1.3 Import UI primitives: `Card`, `CardContent`, `CardHeader`, `CardTitle` from `@/components/ui/card`.
- [x] 1.4 Define interface `PromotionOptionsDisplayProps` with property `unit` (`Unit | null`).
- [x] 1.5 Create and export the `PromotionOptionsDisplay` functional component. Check `if (!unit) return null;`.
- [x] 1.6 Return a basic `<Card>` container wrapping a `<CardHeader>` with `<CardTitle>Promotion Options - {unit.name}</CardTitle>` and an empty `<CardContent>`.

## 2. Implement Recursive Class Traversal

- [x] 2.1 In `PromotionOptionsDisplay.tsx`, add a `useState` for `classes` and a `useEffect` to fetch all classes using `getAllClasses()`.
- [x] 2.2 Create a recursive helper function `getPromotionTree(classId: string, visited = new Set<string>())` that finds the class in the loaded array for `unit.game`. 
- [x] 2.3 Inside the helper, if the class has a `promotesTo` array (length > 0) and the `classId` isn't in `visited` (to prevent infinite loops), map over its IDs and recursively call `getPromotionTree` on each, returning a nested node structure (e.g., `{ cls: Class, promotions: [...] }`).
- [x] 2.4 Use `useMemo` to invoke `getPromotionTree` starting from `unit.classId` (or `unit.class`) whenever the `classes` state or `unit` changes.

## 3. Create `ClassPill` Component

- [ ] 3.1 Create file `components/ui/ClassPill.tsx`.
- [ ] 3.2 Import React, `useState`, `Modal` from `@/components/ui/modal`, `Info` from `lucide-react`, and `Class` interface.
- [ ] 3.3 Define `ClassPillProps` accepting a `cls` (Class) object.
- [ ] 3.4 Implement a clickable pill styling (e.g. `inline-flex items-center gap-1 rounded-full px-2 py-1 bg-fe-blue-100 text-fe-blue-900 border border-fe-blue-300 hover:bg-fe-blue-200 cursor-pointer text-xs font-medium`).
- [ ] 3.5 Inside `ClassPill`, maintain `isModalOpen` state. Clicking the pill sets it to true.
- [ ] 3.6 Render `<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>` containing details about the class (e.g., Weapons, Class Modifiers, Movement Type, Description).
- [ ] 3.7 Ensure the pill renders `{cls.name}` alongside a small `<Info className="w-3 h-3 opacity-60" />` icon, mirroring `SupportPill` styling.

## 4. Render Promotion Options Tree

- [ ] 4.1 In `PromotionOptionsDisplay.tsx`, import `ClassPill`.
- [ ] 4.2 Define a recursive rendering component `ClassNode({ node })` to display the tree.
- [ ] 4.3 For each `node` in the tree, render a `<ClassPill cls={node.cls} />`. If it has `promotions` (children), render a nested `<ul className="ml-6 mt-2 space-y-2 border-l-2 border-fe-blue-200 pl-4">` containing the mapped children nodes wrapped in `<li>` tags.
- [ ] 4.4 Inside the main `PromotionOptionsDisplay` component's `<CardContent>`, render the `ClassNode` starting with the root tree returned from `useMemo`. 
- [ ] 4.5 Ensure the UI gracefully handles units that cannot promote (e.g., display "No promotion options available").

## 5. Integrate and Clean Up

- [x] 5.1 Delete the previous `components/features/PromotionPathPlanner.tsx` file if it exists.
- [x] 5.2 Open `app/comparator/page.tsx` and import `PromotionOptionsDisplay` instead of the planner.
- [x] 5.3 Replace the mapped `<PromotionPathPlanner>` instances below the `<ComparisonGrid>` with `<PromotionOptionsDisplay unit={unit} />`.
- [x] 5.4 Open `components/features/ComparisonGrid.tsx`. Locate and completely delete the inline "Promotion Options" `<TableRow>` so it is removed from the unit details table.
- [ ] 5.5 Verify `npm run dev` renders a static, nested list using interactive `ClassPill` components for every tier of promotion for the selected units.
