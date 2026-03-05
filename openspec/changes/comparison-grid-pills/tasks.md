## 1. Pill Components Creation

- [ ] 1.1 Create `components/ui/AffinityPill.tsx` to display affinity icon and name.
  - Apply the `.pill-base` CSS class.
  - Add the lucide-react `<Info className="w-3 h-3 opacity-60" />` icon inside the pill span when clickable.
  - Implement a `<Modal>` pop-up component when clicked.
  - Format the modal title with `.pill-modal-title`.
  - Format the modal subtitle/body with `.pill-modal-text`.
  - List the detailed stat bonuses in the modal body, optionally using `.pill-modal-label` for label titles.
- [ ] 1.2 Create `components/ui/MovementTypePill.tsx` to display movement type icon and name.
  - Apply the `.pill-base` CSS class.
  - Include the `<Info className="w-3 h-3 opacity-60" />` icon (like `ClassPill.tsx` line 42).
  - Implement a `<Modal>` pop-up component when clicked containing terrain interaction descriptions.
  - Format the modal title with `.pill-modal-title`.
  - Format the modal text describing terrain interactions with `.pill-modal-text`.

## 2. Global CSS Refactoring

- [ ] 2.1 Refactor `components/ui/SupportPill.tsx`, `components/ui/ClassPill.tsx`, and `components/ui/AbilityPill.tsx` to use the new `.pill-base`, `.pill-modal-title`, `.pill-modal-subtitle`, `.pill-modal-text`, and `.pill-modal-label` CSS classes from `app/globals.css`.

## 3. Refactoring Existing Components

- [ ] 3.1 Update `components/ui/ClassPill.tsx` to embed `MovementTypePill` instead of rendering movement type directly.
- [ ] 3.2 Re-verify `ClassPill.tsx` styles and layout to accommodate the embedded `MovementTypePill`.

## 4. Comparison Grid Integration

- [ ] 4.1 Update `components/features/ComparisonGrid.tsx` to replace the Class column modal trigger with `ClassPill`.
- [ ] 4.2 Update `components/features/ComparisonGrid.tsx` to replace the Movement Type column modal trigger with `MovementTypePill`.
- [ ] 4.3 Update `components/features/ComparisonGrid.tsx` to replace the Affinity column modal trigger with `AffinityPill`.
- [ ] 4.4 Adjust `ComparisonGrid.tsx` CSS/styling to ensure the new pills fit neatly within the grid layout.
