## Context

The comparator page currently has two separate UI areas for class-related information:

1. **`PromotionOptionsDisplay`** (`components/features/PromotionOptionsDisplay.tsx`) — a standalone card rendered per-unit outside the Unit Details table. It shows all promotion chain classes and Awakening reclass targets as flat `ClassPill` components with uniform blue styling. It also renders a "Current Reclass Events" sub-card for managing active reclass events.

2. **Unit Details table** inside `ComparisonGrid` (`components/features/ComparisonGrid.tsx`) — a structured table with rows for Class, Join Chapter, Movement Type, Weaknesses, Level, Class Skills, Affinity, Prf Weapons, Weapon Ranks, Starting Skills, Possible Skills, and Supports.

The `ClassPill` component (`components/ui/ClassPill.tsx`) uses CVA with a single `default` variant mapped to `pill-variant-class-default` (blue `fe-blue` tones). It has no tier-aware color variants.

The `SkillPill` component already has tier+level variants (`unpromoted-lv1/5/10`, `promoted-lv1/5/10`) with warm yellow/orange for unpromoted and cool purple/violet for promoted, defined as CSS classes in `globals.css`.

The `PossibleSkillsRow` component demonstrates the pattern: it determines each class's tier via `cls.type` (value `'unpromoted'` or `'promoted'`), resolves a variant string, and passes it to `SkillPill`. The same approach can be applied to `ClassPill` using only the tier dimension (no level sub-variants needed for classes).

The `getValidReclassOptions()` function in `lib/stats.ts` already computes the full merged list of reclass targets (including expanded `promotesTo` chains). The `PromotionOptionsDisplay` already calls it and merges results with promotion options into `unifiedOptions`.

The stat progression table (`StatProgressionTable.tsx`) already merges promotion and reclass options in its class change dropdown using the same data sources.

## Goals / Non-Goals

**Goals:**
- Consolidate class change options into the Unit Details table as a new row, eliminating the separate card.
- Show the same unified list of promotion + reclass options that the stat progression table's dropdown uses.
- Add tier-based color coding to `ClassPill` matching the established visual language (warm tones for unpromoted, cool tones for promoted).
- Keep the reclass events read-only removal UI functional — move it into the table row alongside the pills, or into the existing stat progression table which already manages these events interactively.

**Non-Goals:**
- Changing how the stat progression table's class change dropdown works.
- Changing the `PossibleSkillsRow` or its color scheme.
- Adding level-based sub-variants to class pills (tier only).
- Supporting games beyond Awakening for reclassing (already gated by game check).
- Changing the data model or `getValidReclassOptions` logic.

## Decisions

### Decision 1: Extract option-gathering logic into a shared utility

**Choice**: Move the `unifiedOptions` computation from `PromotionOptionsDisplay` into a new exported function (e.g., `getClassChangeOptions`) in `lib/stats.ts`.

**Rationale**: The same merged list of promotion + reclass targets is needed in two places: the new Unit Details table row and the stat progression table dropdown. Currently this logic is duplicated in `PromotionOptionsDisplay.unifiedOptions` and `StatProgressionTable`'s inline computation. Extracting it eliminates duplication and ensures both surfaces show identical results.

**Alternative considered**: Inline the logic in both `ComparisonGrid` and keep it in `StatProgressionTable`. Rejected because the two implementations could diverge.

### Decision 2: ClassPill gets two new CVA variants — `unpromoted` and `promoted`

**Choice**: Add `unpromoted` and `promoted` variants to `ClassPill`'s CVA config, backed by two new CSS classes in `globals.css`.

**Rationale**: Mirrors the tier dimension of `SkillPill` without the level sub-variants. The color scheme reuses the established palette:
- Unpromoted: warm tones — `bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200` (matches `unpromoted-lv5` skill palette as a middle-ground representative).
- Promoted: cool tones — `bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200` (matches `promoted-lv5` skill palette).

These are deliberately mid-saturation shades so they're visually distinct from each other and from the default blue, without being as intense as the lv10 variants.

**Alternative considered**: Use the exact `pill-variant-skill-unpromoted-lv1` and `pill-variant-skill-promoted-lv1` CSS classes. Rejected because those are the lightest shades and may not provide enough visual weight for class pills, which are larger and more prominent than skill pills. Using dedicated class pill CSS classes also keeps the two concerns decoupled.

**Alternative considered**: Use `cls.type` directly to determine variant. This is the implementation approach — each `Class` object already has `cls.type` set to `'unpromoted'`, `'promoted'`, or `'trainee'`. Trainee maps to unpromoted variant.

### Decision 3: New `ClassChangeOptionsRow` component

**Choice**: Create a dedicated `ClassChangeOptionsRow` component (similar to `PossibleSkillsRow` and `ClassSkillsRow`) that receives `unit` and `classes` and renders the tier-color-coded class pills.

**Rationale**: Follows the established pattern — `PossibleSkillsRow`, `ClassSkillsRow` are separate components imported by `ComparisonGrid`. Keeps the row logic self-contained and testable.

**Implementation**:
- Accepts `unit: Unit`, `classes: Class[]`.
- Calls the shared `getClassChangeOptions(unit, classes)` utility to get the sorted class list.
- Maps each class to a `ClassPill` with variant determined by `cls.type` (`'promoted'` → `'promoted'`, `'unpromoted'`/`'trainee'` → `'unpromoted'`).
- Returns `null` if no options exist (unit has no promotions and no reclass options).

### Decision 4: Row placement — after "Class" row, before "Join Chapter"

**Choice**: Insert the "Class Change Options" row as the second row in the Unit Details table (after the "Class" row at line 564-578, before "Join Chapter" at line 579-588).

**Rationale**: Class change options are semantically about the unit's class, so they logically follow the current class row. Placing them before Join Chapter keeps class-related information grouped together at the top.

### Decision 5: Reclass events removal UI moves to stat progression table only

**Choice**: The "Current Reclass Events" sub-card from `PromotionOptionsDisplay` is removed entirely. Reclass event management already exists in `StatProgressionTable` via its interactive class change dropdowns, which include add/remove buttons.

**Rationale**: Having two places to manage reclass events (the standalone card and the progression table) creates duplication and potential state inconsistency. The progression table is the authoritative interactive UI. The new row in Unit Details is purely informational (read-only display of available options).

### Decision 6: Remove `PromotionOptionsDisplay` from the page

**Choice**: Delete the `PromotionOptionsDisplay` render block from `app/comparator/page.tsx` (lines 71-77). The component file can be deleted or left as dead code for a follow-up cleanup.

**Rationale**: Its responsibilities are fully absorbed by the new table row. Keeping it would mean maintaining duplicate display logic.

## Risks / Trade-offs

- **Row height for units with many options** → A unit like Chrom with many reclass options could produce a tall row. Mitigated by the existing `flex-wrap` layout that `PossibleSkillsRow` already uses successfully with similar pill density. The row will wrap pills naturally.
- **Trainee class tier ambiguity** → Trainee classes have `type: 'trainee'` and tier 0. The design maps them to the `unpromoted` variant, consistent with how `PossibleSkillsRow` already treats trainee tier (`effectiveTier = tier === 'trainee' ? 'unpromoted' : tier`). No risk of inconsistency.
- **Game-specific gating** → The shared utility function must preserve the existing game check (`unit.game?.toLowerCase() === 'awakening'`) for reclass options. Promotion options are game-agnostic. This is already handled in the existing `PromotionOptionsDisplay` logic that will be extracted.
