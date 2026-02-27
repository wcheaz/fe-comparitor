# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why

The existing `hiddenModifiers` field on the `Class` interface is a poorly named catch-all that conflates two different concepts: flat stat bonuses (like `+30 Crit`) and named class abilities or skills (like `Slayer`, `Canto`, `Locktouch`). As we add FE8 support — where classes have meaningful innate abilities (e.g., Bishops get `Slayer`, Berserkers get `+15 Crit`) — the current field name is misleading and the UI doesn't surface this information anywhere meaningful.

## What Changes

- **BREAKING: Rename `hiddenModifiers` → `classAbilities`** across the entire codebase: the `Class` TypeScript interface, `lib/data.ts` (class transformer), `lib/stats.ts` (progression output), all JSON class data files (`binding_blade`, `three_houses`, `engage`, `blazing_blade`), and `__tests__/lib/stats.test.ts`.
- Add a **"Class Abilities" row** to the Unit Details comparison table in `ComparisonGrid.tsx`, conditionally rendered only when at least one selected unit's class has a non-empty `classAbilities` array. Each ability is displayed as a pill/badge.
- Display **class abilities in the promotion details modal** (`renderPromotionDetails` in `ComparisonGrid.tsx`), so when a user clicks the ℹ️ icon next to a promotion option, the modal shows a "Class Abilities" section alongside existing promotion bonuses, movement type, and weapons.

## Capabilities

### New Capabilities

- `class-abilities-display`: Surfaces class abilities (formerly `hiddenModifiers`) in the Unit Details table as a new "Class Abilities" row, and within the promotion info modal for each promotion option.

### Modified Capabilities

- `horizontal-comparison`: The Unit Details table gains a new conditionally-rendered "Class Abilities" row that reads `classAbilities` from the unit's resolved class data.

## Impact

- **`types/unit.ts`**: `Class` interface field rename (`hiddenModifiers` → `classAbilities`)
- **`lib/data.ts`**: `transformJsonToClass` function — update field mapping from `rawClass.hiddenModifiers` → `rawClass.classAbilities` (with backward-compat fallback: `rawClass.classAbilities || rawClass.hiddenModifiers || []`)
- **`lib/stats.ts`**: `ProgressionRow` type and internal promotion info shape — rename field reference
- **`data/binding_blade/classes.json`**: Rename key in all class entries
- **`data/three_houses/classes.json`**: Rename key in all class entries
- **`data/engage/classes.json`**: Rename key in all class entries
- **`data/blazing_blade/classes.json`**: Rename key in all class entries (if applicable)
- **`components/features/ComparisonGrid.tsx`**: Add "Class Abilities" row to Unit Details table; add abilities section to `renderPromotionDetails`
- **`__tests__/lib/stats.test.ts`**: Update all `hiddenModifiers` references in mock class data and assertions to `classAbilities`
- **`dev/build_fe7_classes.py`**: Update the builder script key from `hiddenModifiers` → `classAbilities`

## Specifications

class-abilities-display/spec.md
## ADDED Requirements

### Requirement: Class abilities are stored per class in JSON data files
Each class entry in `data/<game>/classes.json` SHALL have a `classAbilities` field containing an array of strings. Each string represents an innate ability, special attribute, or passive bonus belonging to that class.

The field SHALL be populated according to game-accurate data. Implementers MUST consult the following reference pages when populating class abilities:
- **FE6 (Binding Blade)**: https://serenesforest.net/binding-blade/classes/introduction/
- **FE7 (Blazing Sword)**: https://serenesforest.net/blazing-sword/classes/introduction/
- **FE8 (Sacred Stones) Skills**: https://serenesforest.net/the-sacred-stones/miscellaneous/skills/
- **FE8 Class List**: https://fireemblemwiki.org/wiki/List_of_classes_in_Fire_Emblem:_The_Sacred_Stones

> **Important game context**: FE6 and FE7 do **not** have a formal "skills" system — abilities in these games are flat stat bonuses or innate movement/utility traits. FE8 introduces a proper skills system where specific classes gain activation-based skills (Great Shield, Pierce, Silencer, Slayer, Sure Strike). All are stored uniformly as strings in `classAbilities`.
>
> **FE6 vs FE7 differ**: The same class archetype (e.g., Swordmaster) has different bonus values between the two games. Always use the game-specific source.

**Authoritative `classAbilities` values by game:**

**Binding Blade (FE6):**

| Class | `classAbilities` |
|-------|-----------------|
| Swordmaster (M/F) | `["+30 Crit"]` |
| Berserker | `["+30 Crit", "Water Walk"]` |
| Sniper (M/F) | `["+15 Crit"]` |
| Thief (M/F) | `["Locktouch", "Steal"]` |
| Assassin | `["Silencer", "Locktouch", "Steal"]` |
| Pirate | `["Water Walk"]` |
| Brigand | `["Mountain Walk"]` |
| Dancer | `["Dance"]` |
| Bard | `["Play"]` |

**Blazing Sword (FE7):**

| Class | `classAbilities` |
|-------|-----------------|
| Swordmaster (M/F) | `["+15 Crit"]` |
| Berserker | `["+15 Crit", "Water Walk"]` |
| Sniper (M/F) | `["+15 Crit"]` |
| Thief (M/F) | `["Locktouch", "Steal"]` |
| Assassin | `["Silencer", "Locktouch", "Steal"]` |
| Pirate | `["Water Walk"]` |
| Corsair | `["Water Walk"]` |
| Brigand | `["Mountain Walk"]` |
| Dancer | `["Dance"]` |
| Bard | `["Play"]` |

**Sacred Stones (FE8):**

| Class | `classAbilities` |
|-------|-----------------|
| Swordmaster (M/F) | `["+15 Crit"]` |
| Sniper (M/F) | `["Sure Strike"]` |
| Berserker | `["+15 Crit", "Water Walk"]` |
| Assassin (M/F) | `["Silencer", "Locktouch", "Steal"]` |
| Thief | `["Locktouch", "Steal"]` |
| Rogue | `["Pick", "Steal"]` |
| General (M/F) | `["Great Shield"]` |
| Wyvern Knight | `["Pierce", "Canto"]` |
| Bishop (M/F) | `["Slayer"]` |
| Summoner (M/F) | `["Summon"]` |
| Dancer | `["Dance"]` |
| Pirate | `["Water Walk"]` |
| Brigand | `["Mountain Walk"]` |
| Journeyman (tier 2) | `["+15 Crit"]` |
| Recruit (tier 2) | `["+15 Crit"]` |
| Pupil (tier 2) | `["All Magic Types"]` |
| Paladin (M/F) | `["Canto"]` |
| Great Knight (M/F) | `["Canto"]` |
| Mage Knight (M/F) | `["Canto"]` |
| Valkyrie | `["Canto"]` |
| Ranger (M/F) | `["Canto"]` |
| Falcoknight | `["Canto"]` |
| Wyvern Lord | `["Canto"]` |

> **Note on Canto**: In FE8, cavalry and flying classes have Canto. Wyvern Knight is listed separately above since it also gains Pierce. Do NOT add Canto to Infantry classes.

#### Scenario: FE6 Swordmaster has +30 Crit
- **WHEN** the Binding Blade Swordmaster class is loaded
- **THEN** its `classAbilities` SHALL equal `["+30 Crit"]`

#### Scenario: FE7 Swordmaster has only +15 Crit, not +30
- **WHEN** the Blazing Sword Swordmaster class is loaded
- **THEN** its `classAbilities` SHALL equal `["+15 Crit"]`

#### Scenario: FE8 Bishop has Slayer
- **WHEN** a Sacred Stones Bishop class is loaded
- **THEN** its `classAbilities` SHALL contain `"Slayer"`

#### Scenario: FE8 Thief can Steal and open locks
- **WHEN** the Sacred Stones Thief class is loaded
- **THEN** its `classAbilities` SHALL contain `"Locktouch"` and `"Steal"`

#### Scenario: FE8 Rogue can Pick and Steal but does not have Silencer
- **WHEN** the Sacred Stones Rogue class is loaded
- **THEN** its `classAbilities` SHALL contain `"Pick"` and `"Steal"`
- **AND** it SHALL NOT contain `"Silencer"`

#### Scenario: FE8 Wyvern Knight has Pierce, not Ranger
- **WHEN** the Sacred Stones Wyvern Knight class is loaded
- **THEN** its `classAbilities` SHALL contain `"Pierce"` and `"Canto"`

#### Scenario: FE8 Sniper has Sure Strike
- **WHEN** the Sacred Stones Sniper class is loaded
- **THEN** its `classAbilities` SHALL contain `"Sure Strike"`

#### Scenario: FE8 Berserker has +15 Crit and Water Walk
- **WHEN** the Sacred Stones Berserker class is loaded
- **THEN** its `classAbilities` SHALL equal `["+15 Crit", "Water Walk"]`

#### Scenario: FE8 Summoner has Summon ability
- **WHEN** the Sacred Stones Summoner class is loaded
- **THEN** its `classAbilities` SHALL contain `"Summon"`

#### Scenario: Classes with no innate abilities have an empty array
- **WHEN** a class has no special innate abilities (e.g., Cavalier, Mage)
- **THEN** `classAbilities` SHALL be an empty array `[]`

---

### Requirement: Class field is renamed from hiddenModifiers to classAbilities
The `Class` TypeScript interface in `types/unit.ts` SHALL rename the field `hiddenModifiers: string[]` to `classAbilities: string[]`. All consuming code SHALL be updated accordingly.

The data transformer in `lib/data.ts` (`transformJsonToClass`) SHALL read `rawClass.classAbilities` with a backward-compatible fallback: `rawClass.classAbilities || rawClass.hiddenModifiers || []`.

#### Scenario: TypeScript interface uses classAbilities
- **WHEN** a `Class` object is constructed
- **THEN** it SHALL have a `classAbilities` field, not `hiddenModifiers`

#### Scenario: Data transformer reads classAbilities with fallback
- **WHEN** a JSON class entry has `hiddenModifiers` (old format) but no `classAbilities`
- **THEN** the transformer SHALL still populate `classAbilities` correctly from the fallback

#### Scenario: lib/stats.ts promotion info uses classAbilities
- **WHEN** `generateProgressionArray` emits promotion info for a level
- **THEN** the promotion info object SHALL use `classAbilities` (not `hiddenModifiers`)

---

### Requirement: Class Abilities are shown in the promotion details modal
When a user clicks the ℹ️ icon next to a promotion option in the Unit Details table, the resulting modal SHALL display a "Class Abilities" section if the promoted class has a non-empty `classAbilities` array.

The section SHALL render after the "Weapons" section and before the "Description" section. Each ability SHALL be displayed as a pill/badge styled consistently with the existing weapon pills (`bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`).

#### Scenario: Promotion modal shows abilities for FE8 Bishop
- **WHEN** a unit's promotion option is Bishop in Sacred Stones
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL display a "Class Abilities" section containing a `Slayer` badge

#### Scenario: Promotion modal suppresses abilities section when empty
- **WHEN** a unit's promotion option has no class abilities (e.g., Paladin in FE6)
- **AND** the user clicks the ℹ️ icon
- **THEN** the modal SHALL NOT render a "Class Abilities" section

#### Scenario: Promotion modal shows multiple abilities as separate pills
- **WHEN** a promoted class has multiple abilities (e.g., Assassin: Silencer, Locktouch, Steal)
- **THEN** each ability SHALL be rendered as a separate pill badge

horizontal-comparison/spec.md
## ADDED Requirements

### Requirement: Unit Details table shows Class Abilities row
The Unit Details comparison table in `ComparisonGrid.tsx` SHALL include a "Class Abilities" row. This row SHALL be conditionally rendered — it MUST only appear when at least one selected unit's resolved class has a non-empty `classAbilities` array.

The row SHALL be rendered after the "Promotion Options" row and before the "Affinity" row. Each ability SHALL be displayed as a pill/badge (`bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`). If a unit's class has no abilities, that cell SHALL render a dash (`-`).

The class SHALL be resolved using the same lookup pattern already used in the table: matching by `c.id === unit.class.toLowerCase().replace(/\s+/g, '_') || c.name === unit.class` and `c.game === unit.game`.

#### Scenario: Class Abilities row appears when a unit has abilities
- **WHEN** at least one selected unit's class has a non-empty `classAbilities` array
- **THEN** a "Class Abilities" row SHALL appear in the Unit Details table

#### Scenario: Class Abilities row does not appear when no unit has abilities
- **WHEN** none of the selected units' classes have any entries in `classAbilities`
- **THEN** the "Class Abilities" row SHALL NOT be rendered

#### Scenario: Mixed units — one with abilities, one without
- **WHEN** one selected unit is a Swordmaster (has `+30 Crit`) and the other is a Cavalier (no abilities)
- **THEN** the "Class Abilities" row SHALL appear
- **AND** the Swordmaster column SHALL show a `+30 Crit` pill
- **AND** the Cavalier column SHALL show a dash (`-`)

#### Scenario: Each ability is a separate pill badge
- **WHEN** a class has multiple abilities (e.g., Assassin: Silencer, Locktouch, Steal)
- **THEN** each ability SHALL be rendered as a separate pill in the table cell

#### Scenario: Cross-game comparison preserves game-accurate abilities
- **WHEN** a FE6 Swordmaster and a FE7 Swordmaster are compared
- **THEN** FE6 Swordmaster cell SHALL show `+30 Crit`
- **AND** FE7 Swordmaster cell SHALL show `+15 Crit`



## Design

## Context

The codebase has a `Class` TypeScript interface in `types/unit.ts` with a field `hiddenModifiers: string[]`. This field is populated from JSON class data files and threaded through `lib/data.ts`, `lib/stats.ts`, and the test suite. Currently, it is never rendered in the UI — usages in `lib/stats.ts` include it in the promotion info object for potential future use, but `ComparisonGrid.tsx` (the main comparison component) does not display it anywhere.

`ComparisonGrid.tsx` already has a pattern for conditional Unit Details table rows (e.g., "Promotion Options" row only shown when `promotesTo.length > 0`, "Affinity" only when any unit has an affinity) and an existing promotion details modal (`renderPromotionDetails`) that already shows promotion bonuses, movement type, and weapons.

## Goals / Non-Goals

**Goals:**
- Rename `hiddenModifiers` → `classAbilities` everywhere (interface, transformer, stats lib, JSON files, tests, dev scripts)
- Add a backward-compatible JSON key read in `lib/data.ts` to avoid breaking anything during migration
- Render a new "Class Abilities" row in the Unit Details table in `ComparisonGrid.tsx`
- Surface `classAbilities` in the promotion details modal, consistent with how weapons and movement type are already displayed

**Non-Goals:**
- Adding descriptions or tooltips to individual abilities (out of scope for this change)
- Defining a formal ability enum or type — abilities remain a `string[]`
- Altering how `classAbilities` affects stat calculations (no change to `generateProgressionArray` logic)
- Adding class abilities to the unit-level individual pages (`app/units/[id]`)

## Decisions

### 1. Rename is a breaking field-level rename, not a type-level change

The simplest approach is a direct string key rename. We do not introduce a new wrapper type or enum for abilities. `classAbilities: string[]` is semantically clear and consistent with how `weapons: string[]` is already typed.

**Alternative considered:** Adding an `abilities` sub-object with typed fields (e.g., `{ name: string; description: string }`). Rejected as over-engineering for now — descriptions can be added later when we have FE8 data to validate against.

### 2. Backward-compatible read in `lib/data.ts`

`transformJsonToClass` will read `rawClass.classAbilities || rawClass.hiddenModifiers || []`. This means JSON files can be migrated incrementally and nothing will break if a file is updated but the cache is stale during development. Once all JSON files are renamed, the `rawClass.hiddenModifiers` fallback can be removed in a follow-up.

**Alternative considered:** Strict read of `classAbilities` only, requiring a single atomic migration of all JSON files. Rejected as unnecessarily risky — the fallback costs nothing.

### 3. UI: "Class Abilities" row follows existing conditional row pattern

The row is conditionally rendered using the same pattern as "Promotion Options":
```tsx
{units.some(u => {
  const cls = classes.find(...);
  return cls && cls.classAbilities && cls.classAbilities.length > 0;
}) && (
  <tr>...</tr>
)}
```
Each ability is rendered as a small pill badge (same style as weapon tags in the promotion modal: `bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`).

### 4. Promotion modal: abilities section added after weapons section

`renderPromotionDetails` currently renders: Promotion Bonuses → Movement Type → Weapons → Description. We add a "Class Abilities" section after the weapons section, using the same pill style, mirroring how weapons are displayed. Conditionally rendered only when `promoClass.classAbilities?.length > 0`.

## Risks / Trade-offs

- **JSON files are large** (`binding_blade/classes.json` has ~2,200+ lines, `three_houses/classes.json` has ~1,400+ lines). A bulk sed-style rename is the right approach to avoid manual error. → Mitigation: Use a script or sed command to rename the key in all JSON files atomically.
- **Test file references** `hiddenModifiers` in mock class objects and one assertion (`promotionInfo?.hiddenModifiers`). The `lib/stats.ts` internal promotion info shape also uses `hiddenModifiers`. Both must be updated together. → Mitigation: `grep -r hiddenModifiers` after the rename to catch any missed references.
- **`lib/stats.ts` promotion info shape**: The `ProgressionRow` type includes `promotionInfo` which has a `hiddenModifiers` field internally. Since this is an internal type (not exported to consumers beyond the test), the rename is clean. → Mitigation: Update the type definition and all usages in the same PR.

## Migration Plan

1. Rename the field in `types/unit.ts` (`Class` interface)
2. Update `lib/data.ts` with the backward-compatible read
3. Update `lib/stats.ts` (`ProgressionRow` type and internal references)
4. Bulk rename `hiddenModifiers` → `classAbilities` in all four JSON class files
5. Update `__tests__/lib/stats.test.ts` mock data and assertions
6. Update `dev/build_fe7_classes.py` builder script
7. Add "Class Abilities" row to `ComparisonGrid.tsx` Unit Details table
8. Add abilities section to `renderPromotionDetails` in `ComparisonGrid.tsx`
9. Run `grep -r hiddenModifiers .` to verify no remaining references
10. Run `npm test` to confirm all tests pass

**Rollback**: All changes are additive or renames — reverting is a simple reverse rename. The backward-compat fallback in step 2 means partial rollback (reverting JSON files only) is safe.

## Open Questions

- Should abilities that are stat modifiers (e.g., `+15 Crit`) be visually distinguished from named abilities (e.g., `Slayer`) in the UI? Currently both are plain strings in the same array. This could be handled via a prefix convention (e.g., abilities starting with `+` get a different badge color) — deferred until FE8 data is populated.

## Current Task Context

## Current Task
- - [ ] 1.1 In `types/unit.ts`, rename `hiddenModifiers: string[]` to `classAbilities: string[]` on the `Class` interface
