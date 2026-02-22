## 1. CSS Setup

- [x] 1.1 Add `.modal-backdrop` styles to `app/global.css` for fixed full-screen overlay (darkened background, high z-index).
- [x] 1.2 Add `.modal-content` styles to `app/global.css` for the centered modal container (distinct background color, padding, max-width, border-radius).
- [x] 1.3 Add modal close button styles to `app/global.css` (positioning in top right, clear icon/text, no background/border).

## 2. Component Implementation

- [x] 2.1 Create `components/ui/modal.tsx`.
- [x] 2.2 Define component props: `isOpen` (boolean), `onClose` (function), and `children` (ReactNode).
- [x] 2.3 Implement conditional rendering based on the `isOpen` prop.
- [x] 2.4 Render the backdrop `div` and the modal content `div` within it.
- [x] 2.5 Add an "x" `<button>` inside the modal content that calls `onClose` when clicked.
- [x] 2.6 IMPORTANT: Ensure no `onClick` handler is placed on the backdrop (or explicitly ignore clicks) to prevent backdrop click dismissal.

## 3. Affinity Details Modal Integration

- [x] 3.1 Define FE6 affinity data structure containing names and stat bonus details.
- [x] 3.2 Add an Info icon component (`LucideReact` Info icon) next to the Affinity name in `ComparisonGrid.tsx` for units that possess an affinity.
- [x] 3.3 Add state to `ComparisonGrid.tsx` (e.g., `selectedAffinity`, `isModalOpen`) to track when an affinity's Info icon is clicked.
- [x] 3.4 Integrate the new `<Modal>` component inside `ComparisonGrid.tsx`.
- [x] 3.5 When the modal is open for an affinity, render the specific FE6 stat bonuses and description for that affinity inside the modal content.
