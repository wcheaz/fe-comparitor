## 1. ClassPill Tier Variants

- [x] 1.1 Add two new CSS classes (`.pill-variant-class-unpromoted` and `.pill-variant-class-promoted`) to `globals.css` in the "Class Variants" section (after line 141). Unpromoted uses amber/orange tones (`bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200`). Promoted uses purple/violet tones (`bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200`). Verify by confirming the classes compile and visually match the corresponding skill pill palette when rendered.
      **Done when**: Both CSS classes exist in `globals.css` and the app builds without errors (`npm run build` or `next build`).

- [x] 1.2 Add `unpromoted` and `promoted` variant values to the `classPillVariants` CVA config in `components/ui/ClassPill.tsx` (lines 12-29). Map `unpromoted` to `"pill-variant-class-unpromoted"` and `promoted` to `"pill-variant-class-promoted"`. The existing `default` variant and all current `ClassPill` usage without explicit variant remain unchanged.
      **Done when**: `ClassPill` accepts `variant="unpromoted"` and `variant="promoted"` props without TypeScript errors. The default variant still renders blue styling when no variant is specified. Verify with `npm run build`.

## 2. Shared Utility Function

- [x] 2.1 Export a `getClassChangeOptions(unit: Unit, classes: Class[]): Class[]` function from `lib/stats.ts`. This function extracts the `unifiedOptions` computation currently in `PromotionOptionsDisplay.tsx` (lines 89-133): walk `promotesTo` chains from the unit's base class, add Awakening reclass options via `getValidReclassOptions()`, deduplicate by class ID, exclude the unit's base class, and sort by tier descending. Preserve the existing game gate (`unit.game?.toLowerCase() === 'awakening'`).
      **Done when**: The function is exported from `lib/stats.ts`, returns identical results to the current `PromotionOptionsDisplay.unifiedOptions` memo, and TypeScript compiles. Verify by running `npm run build`.

## 3. ClassChangeOptionsRow Component

- [x] 3.1 Create `components/features/ClassChangeOptionsRow.tsx` following the pattern of `PossibleSkillsRow.tsx`. The component accepts `{ unit: Unit; classes: Class[] }`, calls `getClassChangeOptions(unit, classes)`, returns `null` if the result is empty, otherwise renders a `flex-wrap` layout of `ClassPill` components. Each pill receives a `variant` prop: `"promoted"` for classes where `cls.type === 'promoted'`, `"unpromoted"` for classes where `cls.type === 'unpromoted'` or `cls.type === 'trainee'`.
      **Done when**: The component file exists, imports `getClassChangeOptions` and `ClassPill`, renders tier-colored pills, and TypeScript compiles. Verify with `npm run build`.

## 4. ComparisonGrid Integration

- [x] 4.1 Add the "Class Change Options" row to the Unit Details table in `components/features/ComparisonGrid.tsx`. Insert it after the "Class" row (after line 578) and before the "Join Chapter" row (line 579). Import `ClassChangeOptionsRow`. The row label is "Class Change Options". Use the same conditional rendering pattern as other rows: only render when `units.some(u => getClassChangeOptions(u, classes).length > 0)`. For units with no options in a visible row, display "None" as muted text.
      **Done when**: The row renders in the correct position, shows tier-colored class pills for units with options, shows "None" for units without options, and hides entirely when no units have options. Verify by running the dev server and visually confirming with an Awakening unit (e.g., Chrom) and a GBA unit side by side. Stop and hand off if the row causes layout breakage or the conditional visibility logic is incorrect.

## 5. Remove PromotionOptionsDisplay

- [x] 5.1 Remove the `PromotionOptionsDisplay` render block from `app/comparator/page.tsx` (lines 71-77, the `<PromotionOptionsDisplay key={...} unit={unit} />` calls). Remove the import of `PromotionOptionsDisplay` from the same file. Do NOT delete the `PromotionOptionsDisplay.tsx` file itself (leave for follow-up cleanup).
      **Done when**: The standalone class change options card no longer appears on the comparator page. The Unit Details table's new "Class Change Options" row is the only place class options appear. Verify by running the dev server and confirming no duplicate display. `npm run build` passes with no errors.
