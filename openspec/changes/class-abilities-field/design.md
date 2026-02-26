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
