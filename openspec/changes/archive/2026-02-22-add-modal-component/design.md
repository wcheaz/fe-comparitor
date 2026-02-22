## Context
The Fire Emblem Unit Comparator currently displays a large amount of information on the main layout. To provide more depth without cluttering the primary view, we need a flexible modal component. This modal will allow users to view detailed supplementary information, such as PRF weapon stats, class type descriptions (Infantry, Armored, Flying), and affinity definitions, on demand.

## Goals / Non-Goals
**Goals:**
- Create a reusable, flexible React modal component capable of rendering arbitrary children.
- Include a clear close ("x") button within the modal.
- The modal should ONLY close when the "x" button is clicked (no backdrop click dismissal), allowing users to keep the modal open to compare specific details side-by-side with the main content.
- Ensure the modal stands out from the main page through distinct background styling defined in `global.css`.

**Non-Goals:**
- Complex multi-step wizard modals.
- Building the specific contents for PRF stats or affinity details inside the base modal component itself (the modal should be a generic container, while the specific content is passed down as children).

## Decisions
1. **Component Location:** Create the component in `components/ui/modal.tsx` (or similar generic UI directory) to ensure it is accessible across different features.
2. **State Management:** The open/closed state of the modal will be managed by the parent component that triggers it, using standard React state (`useState`). The modal will accept `isOpen` and `onClose` props.
3. **Styling:** The styling will use vanilla CSS in `global.css` per project conventions. We will define a `.modal-backdrop` and `.modal-content` class to handle the overlay positioning and modal body styling, respectively.
4. **Portal Rendering:** If necessary for z-index or DOM hierarchy issues, consider using React Portals, though standard absolute/fixed positioning in the main layout may suffice given the current plain CSS structure.

## Risks / Trade-offs
- **[Risk]** Modal backdrop might not cover the entire screen if not positioned correctly.
  - **Mitigation:** Use `position: fixed`, `top: 0`, `left: 0`, `width: 100vw`, `height: 100vh`, and a high `z-index` in `global.css` for the backdrop.
- **[Risk]** Accessibility (focus trapping, ESC key to close).
  - **Mitigation:** Add basic ARIA roles (`role="dialog"`) and `tabIndex`. For the scope of this change, we'll focus on the visual functionality and basic click handlers as requested, but we should ensure the "x" button is a clear `<button>` element.
