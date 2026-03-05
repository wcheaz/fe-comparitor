# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

The current promotion options row inside the `ComparisonGrid` unit details table is not compatible with our recent implementation of multiple promotion tiers, as it only shows the first "level" of promotion or reclassing. Given the increasing complexity of displaying branching and multi-tier promotions, this UI element has outgrown the cramped table format and needs a dedicated, dynamic section.

## What Changes

- **Remove** the "Promotion Options" row from the `ComparisonGrid`'s Unit Details table.
- **Create** a new standalone component (e.g., `PromotionOptions.tsx`) to handle displaying and selecting class promotions.
- **Move** this new component to its own dedicated section in the website flow (likely below the Unit Details or Stats sections).
- **Update** the new section to dynamically feature *every* possible promotion and reclass option a unit has across multiple tiers, rather than just the first level.

## Capabilities

### New Capabilities
- `dynamic-promotion-ui`: Extracting the promotion options into a dedicated, dynamic UI component that supports multi-tier and branching class paths outside of the standard comparison table.

### Modified Capabilities
- `branching-promotions`: Updating the UI requirements to specify that branching and multi-tier options are displayed in a dedicated standalone section rather than an inline table row.

## Impact

- `components/features/ComparisonGrid.tsx`: Will have the promotion options row removed, simplifying the component.
- Layout files (e.g., `app/comparator/page.tsx` or unit detail pages): Will need to integrate the new promotion options component.
- User Experience: Selecting classes will be moved to a more prominent, capable UI section that doesn't feel constrained by table cells.

## Specifications

branching-promotions/spec.md
## MODIFIED Requirements

### Requirement: User Selects Promotion Path
The system SHALL provide a dedicated, extracted UI mechanism allowing the user to select a specific promotion path when a unit has multiple valid promotion options defined in the game data.

#### Scenario: Unit with branching promotions
- **WHEN** the user selects a unit with branching promotions (e.g. from Sacred Stones or Awakening)
- **THEN** an independent UI outside the standard comparison grid allows the user to individually select which class each promotion tier resolves to.

### Requirement: Multi-Tier Promotion Support
The system SHALL support and track sequential promotion events for units that can promote multiple times or reclass linearly within a dedicated section.

#### Scenario: Unit promotes through multiple tiers
- **WHEN** a unit promotes from a base class to an advanced class, and then to a third-tier class
- **THEN** the system tracks the selected class for each level threshold and applies the appropriate sequence of class bases and promotion bonuses.

#### Scenario: System provides UI to append multi-tier promotions
- **WHEN** the user is viewing the dedicated "Promotion Planner" section for a unit
- **AND** the currently selected class for their latest promotion event has valid entries in its `promotesTo` array (including resolving the target class of trainee promotions)
- **THEN** the system renders a "+" button that, when clicked, adds a new sequential promotion event to the unit's timeline.

#### Scenario: System provides UI to remove multi-tier promotions
- **WHEN** a unit has more than one promotion event configured
- **THEN** the system renders a "-" button next to the "+" button in the dedicated promotion planner that, when clicked, removes the most recently added promotion event from the unit's timeline.

dynamic-promotion-ui/spec.md
## ADDED Requirements

### Requirement: Dedicated Promotion UI
The system SHALL display all unit promotion and reclassing options in a dedicated UI section visually distinct from the primary `ComparisonGrid` data table.

#### Scenario: Displaying options outside the grid
- **WHEN** a user is comparing units
- **THEN** an independent UI component (e.g., `PromotionOptions` or `PromotionPathPlanner`) is rendered outside the standard unit details table to host interactive class selection.

### Requirement: Multi-Tier Visibility
The system SHALL visually represent the full sequential depth of a unit's possible promotion tiers.

#### Scenario: Visualizing sequential promotions
- **WHEN** a unit can promote multiple times (e.g., Trainee -> Tier 1 -> Tier 2)
- **THEN** the dedicated UI section displays these distinct promotion levels as sequential, selectable steps or dropdown menus.

### Requirement: Interactive Path Selection
The system SHALL allow users to directly click or select specific class choices within the dedicated promotion UI to alter the unit's active promotion path.

#### Scenario: User clicks a class choice
- **WHEN** the user interacts with a class option in the multi-tier visualization
- **THEN** that class becomes the active selected promotion for that respective tier, updating the `promotionEvents` state.



## Design

## Context

Currently, the unit comparator application presents a user's unit choices side-by-side in the `ComparisonGrid`. Inside this grid, the "Unit Details" table contains an inline row for "Promotion Options". However, with the recent addition of multi-tier promotions (e.g., Trainees from FE8) and branching paths (e.g., FE8 Cavaliers promoting to either Paladin or Great Knight), that row has become too cramped and restricted to effectively show all choices and sequences. It only realistically supports showing the immediate next tier of classes. 

We need to break this functionality out into its own dedicated UI section where users can freely configure and visualize complex, multi-stage promotion paths without breaking the layout of the comparison table.

## Goals / Non-Goals

**Goals:**
- Extract the promotion UI from `ComparisonGrid.tsx` into a robust, dedicated component/section (e.g. `PromotionPathPlanner.tsx` or similar).
- Maintain shared state so that class selections made in the new section correctly propagate to the `ComparisonGrid` stats and the `StatProgressionTable`.
- Support visualization and selection for unlimited, sequential multi-tier promotion steps.
- Provide a clean, unconstrained layout (e.g., flowchart-like or sequential cards) for branching class choices.

**Non-Goals:**
- Modifying the underlying stat calculation logic in `lib/stats.ts` (this already supports the `promotionEvents` arrays).
- Modifying the JSON data schemas for units or classes.

## Decisions

- **Decision 1: Shared State Lift**
  - *Rationale*: The promotion state (`promotionEvents` array) must be shared between the `StatProgressionTable`, `ComparisonGrid`, and the new promotion section. Currently it is lifted to `app/comparator/page.tsx`. This architecture will be maintained; the new component will simply accept the state and update handlers as props instead of `ComparisonGrid`.
- **Decision 2: Component Structure & Flow**
  - *Rationale*: We will create a new section, likely placed immediately below the primary `ComparisonGrid` or between the grid and the `StatProgressionTable`. This gives the UI full width to display branching paths horizontally or vertically as needed.
  - *Alternatives considered*: Keeping it in the `ComparisonGrid` but making it a pop-up modal. A modal distances the user from seeing the real-time stat changes, whereas an inline dedicated section allows for immediate visual feedback.

## Risks / Trade-offs

- **[Risk] Disconnect in User Experience** → By removing the promotion selector from the immediate "Unit Details" table, users might miss it or not realize its connection. 
  - **Mitigation**: Place the new section prominently and perhaps add a placeholder/link inside the `ComparisonGrid` (where the row used to be) that scrolls the user down to the promotion planner.

## Current Task Context

## Current Task
- - [ ] 10.1 Diagnose `components/ui/modal.tsx` (or whatever hook manages body scrolling when modals open/close). The issue is likely that closing the inner modal removes `overflow: hidden` from the body, or closing the outer modal fails to restore `overflow: auto`/`unset` because of conflicting state or race conditions.
## Completed Tasks for Git Commit
- [x] 1.1 Create file `components/features/PromotionOptionsDisplay.tsx`.
- [x] 1.2 Import React, `useState`, `useEffect`. Import `Unit`, `Class` interfaces and `getAllClasses` from `@/lib/data`.
- [x] 1.3 Import UI primitives: `Card`, `CardContent`, `CardHeader`, `CardTitle` from `@/components/ui/card`.
- [x] 1.4 Define interface `PromotionOptionsDisplayProps` with property `unit` (`Unit | null`).
- [x] 1.5 Create and export the `PromotionOptionsDisplay` functional component. Check `if (!unit) return null;`.
- [x] 1.6 Return a basic `<Card>` container wrapping a `<CardHeader>` with `<CardTitle>Promotion Options - {unit.name}</CardTitle>` and an empty `<CardContent>`.
- [x] 2.1 In `PromotionOptionsDisplay.tsx`, add a `useState` for `classes` and a `useEffect` to fetch all classes using `getAllClasses()`.
- [x] 2.2 Create a recursive helper function `getPromotionTree(classId: string, visited = new Set<string>())` that finds the class in the loaded array for `unit.game`. 
- [x] 2.3 Inside the helper, if the class has a `promotesTo` array (length > 0) and the `classId` isn't in `visited` (to prevent infinite loops), map over its IDs and recursively call `getPromotionTree` on each, returning a nested node structure (e.g., `{ cls: Class, promotions: [...] }`).
- [x] 2.4 Use `useMemo` to invoke `getPromotionTree` starting from `unit.classId` (or `unit.class`) whenever the `classes` state or `unit` changes.
- [x] 3.1 Create file `components/ui/ClassPill.tsx`.
- [x] 3.2 Import React, `useState`, `Modal` from `@/components/ui/modal`, `Info` from `lucide-react`, and `Class` interface.
- [x] 3.3 Define `ClassPillProps` accepting a `cls` (Class) object.
- [x] 3.4 Implement a clickable pill styling (e.g. `inline-flex items-center gap-1 rounded-full px-2 py-1 bg-fe-blue-100 text-fe-blue-900 border border-fe-blue-300 hover:bg-fe-blue-200 cursor-pointer text-xs font-medium`).
- [x] 3.5 Inside `ClassPill`, maintain `isModalOpen` state. Clicking the pill sets it to true.
- [x] 3.6 Render `<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>` containing details about the class (e.g., Weapons, Class Modifiers, Movement Type, Description).
- [x] 3.7 Ensure the pill renders `{cls.name}` alongside a small `<Info className="w-3 h-3 opacity-60" />` icon, mirroring `SupportPill` styling.
- [x] 4.1 In `PromotionOptionsDisplay.tsx`, import `ClassPill`.
- [x] 4.2 Define a recursive rendering component `ClassNode({ node })` to display the tree.
- [x] 4.3 For each `node` in the tree, render a `<ClassPill cls={node.cls} />`. If it has `promotions` (children), render a nested `<ul className="ml-6 mt-2 space-y-2 border-l-2 border-fe-blue-200 pl-4">` containing the mapped children nodes wrapped in `<li>` tags.
- [x] 4.4 Inside the main `PromotionOptionsDisplay` component's `<CardContent>`, render the `ClassNode` starting with the root tree returned from `useMemo`. 
- [x] 4.5 Ensure the UI gracefully handles units that cannot promote (e.g., display "No promotion options available").
- [x] 5.1 Delete the previous `components/features/PromotionPathPlanner.tsx` file if it exists.
- [x] 5.2 Open `app/comparator/page.tsx` and import `PromotionOptionsDisplay` instead of the planner.
- [x] 5.3 Replace the mapped `<PromotionPathPlanner>` instances below the `<ComparisonGrid>` with `<PromotionOptionsDisplay unit={unit} />`.
- [x] 5.4 Open `components/features/ComparisonGrid.tsx`. Locate and completely delete the inline "Promotion Options" `<TableRow>` so it is removed from the unit details table.
- [x] 5.5 Verify `npm run dev` renders a static, nested list using interactive `ClassPill` components for every tier of promotion for the selected units.
- [x] 6.1 Open `components/ui/ClassPill.tsx`.
- [x] 6.2 Increase the size of the pill to make it more visible and easier to read (e.g., using `px-3 py-1.5 text-sm` instead of smaller sizes).
- [x] 6.3 Inside the `<Modal>` section of `ClassPill.tsx`, locate and remove any elements displaying the `game` property (e.g. `<p className="text-xs text-muted-foreground">Game: {game}</p>`).
- [x] 6.4 Save changes and verify the pill looks appropriately larger and the modal no longer shows the game name.
- [x] 7.1 Open `components/ui/ClassPill.tsx`.
- [x] 7.2 Replace the container inside `<Modal>` with `<div className="space-y-4 min-w-[300px] sm:min-w-[400px]">` to guarantee a larger width like the affinity modals.
- [x] 7.3 Change the Class Name header to use `<h2 className="text-2xl font-bold text-foreground">` so it appears large, black/dark, and formatted like a main title. Wrap it in a border div if needed (`<div className="flex items-center justify-between border-b pb-2">`).
- [x] 7.4 Change the category subtitles (e.g., Weapon type, Movement type, Class Type) to use `<h3 className="text-lg font-semibold mb-2 text-foreground">` so they are distinct, large, and black/dark but smaller than the main title.
- [x] 7.5 Save changes and verify the opened modal has appropriately large text, clear category dividers, and an expanded overall size.
- [x] 8.1 In `components/ui/ClassPill.tsx`, change the pill itself to use styling matching standard pills (e.g., `text-xs font-semibold px-2.5 py-1 rounded-full bg-fe-blue-100 text-fe-blue-900 border border-fe-blue-300`).
- [x] 8.2 Import `AbilityPill` from `@/components/ui/AbilityPill` in `ClassPill.tsx`.
- [x] 8.3 Inside the `ClassPill` modal's render function, check if the class has `classAbilities`. If `cls.classAbilities?.length > 0`, render an `<AbilityPill>` component for each to display the skill information.
- [x] 8.4 Verify the updated pill style matches expectations and the new `<AbilityPill>` renders inside the `<Modal>`.
- [x] 9.1 Open `components/ui/modal.tsx` or the CSS file where `.modal-backdrop` and `.modal-content` are defined (e.g. `app/globals.css`).
- [x] 9.2 The issue occurs because multiple modals are stacking and their overlapping/overflow properties are creating excessive scroll space on the `body`. Investigate whether a React portal (e.g., `createPortal`) is needed to attach modals directly to `document.body`, or if `overflow: hidden` needs to be toggled on the `body` when any modal is open.
- [x] 9.3 If the modals use absolute/fixed positioning, ensure `.modal-backdrop` spans `100vw` and `100vh` strictly without extending the document height, and `.modal-content` is properly centered using `fixed` positioning and `max-h-screen` or `max-h-[90vh]` with `overflow-y-auto`.
- [x] 9.4 Save changes, trigger a nested modal (e.g., clicking Canto inside Cavalier), and verify the excessive scrolling is resolved.
