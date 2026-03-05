## 1. Pill Components Creation

- [ ] 1.1 Create `components/ui/AffinityPill.tsx` to display affinity icon and name.
  - Apply CSS classes broadly similar to `SupportPill` (lines 10-11, 25) / `ClassPill` (line 10): `inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border`
  - Add the lucide-react `<Info className="w-3 h-3 opacity-60" />` icon inside the pill span when clickable (like `AbilityPill.tsx` lines 79-81).
  - Implement a `<Modal>` pop-up component when clicked, utilizing the same size and text coloring as `AbilityPill` and `SupportPill`.
  - Format the modal title as `<h3 className="text-lg font-bold text-fe-blue-900">` (like `AbilityPill.tsx` line 87).
  - Format the modal subtitle/body as `<p className="text-sm text-fe-blue-700">` (like `AbilityPill.tsx` line 90).
  - List the detailed stat bonuses in the modal body, optionally using `<span className="font-semibold text-fe-blue-900">` for label titles.
- [ ] 1.2 Create `components/ui/MovementTypePill.tsx` to display movement type icon and name.
  - Apply CSS classes broadly similar to `SupportPill` or `AbilityPill` (lines 10-11): `inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border`
  - Include the `<Info className="w-3 h-3 opacity-60" />` icon (like `ClassPill.tsx` line 42).
  - Implement a `<Modal>` pop-up component when clicked containing terrain interaction descriptions.
  - Format the modal title as `<h3 className="text-lg font-bold text-fe-blue-900">`.
  - Format the modal text describing terrain interactions as `<p className="text-sm text-fe-blue-700">`.

## 2. Refactoring Existing Components

- [ ] 2.1 Update `components/ui/ClassPill.tsx` to embed `MovementTypePill` instead of rendering movement type directly.
- [ ] 2.2 Re-verify `ClassPill.tsx` styles and layout to accommodate the embedded `MovementTypePill`.

## 3. Comparison Grid Integration

- [ ] 3.1 Update `components/features/ComparisonGrid.tsx` to replace the Class column modal trigger with `ClassPill`.
- [ ] 3.2 Update `components/features/ComparisonGrid.tsx` to replace the Movement Type column modal trigger with `MovementTypePill`.
- [ ] 3.3 Update `components/features/ComparisonGrid.tsx` to replace the Affinity column modal trigger with `AffinityPill`.
- [ ] 3.4 Adjust `ComparisonGrid.tsx` CSS/styling to ensure the new pills fit neatly within the grid layout.
