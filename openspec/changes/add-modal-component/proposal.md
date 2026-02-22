## Why
We need a reusable and highly flexible modal component to show panels of information on the screen without navigating away from the main flow. This will be used to provide extra information to the user about specific items, such as a PRF weapon's stats, class types (e.g., "Infantry", "Armored", or "Flying"), and unit properties like "Dark" affinity. This provides a better user experience for quick interactions or viewing supplementary details.

## What Changes
- Add a new generic modal component that is highly flexible and capable of rendering various types of children/content.
- The modal will appear when triggered by a button click.
- The modal will disappear ONLY when a close ("x") button on the modal is clicked, allowing users to compare details side-by-side.
- The modal will be styled with a different background color from the main page to ensure readability.
- All styling for the modal will be added to `global.css`.

## Capabilities
### New Capabilities
- `modal-ui`: A reusable UI component that renders a temporary dialog/panel over the application's main content, supporting open/close state management.


### Modified Capabilities

## Impact
- New component added to the UI components directory.
- `global.css` updated with new modal styles.
