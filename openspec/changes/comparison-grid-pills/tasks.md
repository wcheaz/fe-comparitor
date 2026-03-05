## 1. Pill Components Creation

- [x] 1.1 Create `components/ui/AffinityPill.tsx` to display affinity icon and name.
  - Setup a `cva` definition mapping affinity variants to their respective global CSS classes (e.g., `fire: "pill-variant-affinity-fire"`, `ice: "pill-variant-affinity-ice"`, etc.).
  - Apply the `.pill-base` CSS class within the cva base string.
  - Add the lucide-react `<Info className="w-3 h-3 opacity-60" />` icon inside the pill span when clickable.
  - Implement a `<Modal>` pop-up component when clicked.
  - Format the modal title with `.pill-modal-title`.
  - Format the modal subtitle/body with `.pill-modal-text`.
  - List the detailed stat bonuses in the modal body, using `.pill-modal-label` for label titles.
- [x] 1.2 Create `components/ui/MovementTypePill.tsx` to display movement type icon and name.
  - Setup a `cva` definition mapping movement type variants to their global CSS classes (e.g., `infantry: "pill-variant-movement-infantry"`, `armored: "pill-variant-movement-armored"`, etc.).
  - Apply the `.pill-base` CSS class within the cva base string.
  - Include the `<Info className="w-3 h-3 opacity-60" />` icon (like `ClassPill.tsx` line 42).
  - Implement a `<Modal>` pop-up component when clicked containing terrain interaction descriptions.
  - Format the modal title with `.pill-modal-title`.
  - Format the modal text describing terrain interactions with `.pill-modal-text`.

## 2. Global CSS Refactoring

- [x] 2.1 Refactor `components/ui/SupportPill.tsx`, `components/ui/ClassPill.tsx`, and `components/ui/AbilityPill.tsx` to use their new `.pill-variant-*` global CSS classes in their `cva` definitions.
- [x] 2.2 Re-verify all modal pop-ups in those 3 components to use `.pill-modal-title`, `.pill-modal-subtitle`, `.pill-modal-text`, and `.pill-modal-label` with the newer, larger text sizes defined in `app/globals.css`.

## 3. Refactoring Existing Components

- [x] 3.1 Update `components/ui/ClassPill.tsx` to embed `MovementTypePill` instead of rendering movement type directly.
- [x] 3.2 Re-verify `ClassPill.tsx` styles and layout to accommodate the embedded `MovementTypePill`.

## 4. Comparison Grid Integration

- [x] 4.1 Update `components/features/ComparisonGrid.tsx` to replace the Class column modal trigger with `ClassPill`.
- [x] 4.2 Update `components/features/ComparisonGrid.tsx` to replace the Movement Type column modal trigger with `MovementTypePill`.
- [x] 4.3 Update `components/features/ComparisonGrid.tsx` to replace the Affinity column modal trigger with `AffinityPill`.
- [x] 4.4 Adjust `ComparisonGrid.tsx` CSS/styling to ensure the new pills fit neatly within the grid layout.
