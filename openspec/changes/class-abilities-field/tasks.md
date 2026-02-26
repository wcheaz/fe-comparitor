## 1. TypeScript Interface & Data Layer

- [ ] 1.1 In `types/unit.ts`, rename `hiddenModifiers: string[]` to `classAbilities: string[]` on the `Class` interface
- [ ] 1.2 In `lib/data.ts` (`transformJsonToClass`), update the field mapping to: `classAbilities: rawClass.classAbilities || rawClass.hiddenModifiers || []`
- [ ] 1.3 In `lib/stats.ts`, rename the `hiddenModifiers` field to `classAbilities` in the `ProgressionRow` promotion info type definition and all internal references

## 2. JSON Data Migration — FE6 (Binding Blade)

- [ ] 2.1 Rename `hiddenModifiers` → `classAbilities` in all entries of `data/binding_blade/classes.json`
- [ ] 2.2 Set `classAbilities: ["+30 Crit"]` for Swordmaster (M and F variants)
- [ ] 2.3 Set `classAbilities: ["+15 Crit"]` for Sniper (M and F variants)
- [ ] 2.4 Set `classAbilities: ["+30 Crit", "Water Walk"]` for Berserker
- [ ] 2.5 Set `classAbilities: ["Locktouch", "Steal"]` for Thief (M and F variants)
- [ ] 2.6 Set `classAbilities: ["Silencer", "Locktouch", "Steal"]` for Assassin
- [ ] 2.7 Set `classAbilities: ["Water Walk"]` for Pirate
- [ ] 2.8 Set `classAbilities: ["Mountain Walk"]` for Brigand
- [ ] 2.9 Set `classAbilities: ["Dance"]` for Dancer and `["Play"]` for Bard

## 3. JSON Data Migration — FE7 (Blazing Sword)

- [ ] 3.1 Rename `hiddenModifiers` → `classAbilities` in all entries of `data/blazing_blade/classes.json`
- [ ] 3.2 Set `classAbilities: ["+15 Crit"]` for Swordmaster (M and F variants)
- [ ] 3.3 Set `classAbilities: ["+15 Crit"]` for Sniper (M and F variants)
- [ ] 3.4 Set `classAbilities: ["+15 Crit", "Water Walk"]` for Berserker
- [ ] 3.5 Set `classAbilities: ["Locktouch", "Steal"]` for Thief (M and F variants)
- [ ] 3.6 Set `classAbilities: ["Silencer", "Locktouch", "Steal"]` for Assassin
- [ ] 3.7 Set `classAbilities: ["Water Walk"]` for Pirate and Corsair
- [ ] 3.8 Set `classAbilities: ["Mountain Walk"]` for Brigand
- [ ] 3.9 Set `classAbilities: ["Dance"]` for Dancer and `["Play"]` for Bard

## 4. JSON Data Migration — FE8 (Sacred Stones)

- [ ] 4.1 Create `data/sacred_stones/classes.json` entries with `classAbilities` field (no legacy key to rename)
- [ ] 4.2 Set `classAbilities: ["+15 Crit"]` for Swordmaster (M and F)
- [ ] 4.3 Set `classAbilities: ["Sure Strike"]` for Sniper (M and F)
- [ ] 4.4 Set `classAbilities: ["+15 Crit", "Water Walk"]` for Berserker
- [ ] 4.5 Set `classAbilities: ["Silencer", "Locktouch", "Steal"]` for Assassin (M and F)
- [ ] 4.6 Set `classAbilities: ["Locktouch", "Steal"]` for Thief
- [ ] 4.7 Set `classAbilities: ["Pick", "Steal"]` for Rogue
- [ ] 4.8 Set `classAbilities: ["Great Shield"]` for General (M and F)
- [ ] 4.9 Set `classAbilities: ["Pierce", "Canto"]` for Wyvern Knight
- [ ] 4.10 Set `classAbilities: ["Slayer"]` for Bishop (M and F)
- [ ] 4.11 Set `classAbilities: ["Summon"]` for Summoner (M and F)
- [ ] 4.12 Set `classAbilities: ["Dance"]` for Dancer
- [ ] 4.13 Set `classAbilities: ["Water Walk"]` for Pirate; `["Mountain Walk"]` for Brigand
- [ ] 4.14 Set `classAbilities: ["+15 Crit"]` for Journeyman (tier 2) and Recruit (tier 2)
- [ ] 4.15 Set `classAbilities: ["All Magic Types"]` for Pupil (tier 2)
- [ ] 4.16 Set `classAbilities: ["Canto"]` for all cavalry/flying classes (Paladin M/F, Great Knight M/F, Mage Knight M/F, Valkyrie, Ranger M/F, Falcoknight, Wyvern Lord)

## 5. JSON Data Migration — Other Games

- [ ] 5.1 Rename `hiddenModifiers` → `classAbilities` in all entries of `data/three_houses/classes.json`
- [ ] 5.2 Rename `hiddenModifiers` → `classAbilities` in all entries of `data/engage/classes.json`

## 6. Test & Script Updates

- [ ] 6.1 In `__tests__/lib/stats.test.ts`, rename all `hiddenModifiers` references in mock class objects to `classAbilities`
- [ ] 6.2 Update the assertion `promotionInfo?.hiddenModifiers` → `promotionInfo?.classAbilities` in the test file
- [ ] 6.3 In `dev/build_fe7_classes.py`, rename the output key from `"hiddenModifiers"` → `"classAbilities"` (line: `c_obj["hiddenModifiers"] = ...`)
- [ ] 6.4 Run `npm test` and confirm all tests pass
- [ ] 6.5 Run `grep -r "hiddenModifiers" --include="*.ts" --include="*.tsx" --include="*.json" .` and confirm zero results

## 7. UI — Class Abilities Row in Unit Details Table

- [ ] 7.1 In `ComparisonGrid.tsx`, add a conditional "Class Abilities" row to the Unit Details `<tbody>` after the "Promotion Options" row, using the same class lookup pattern (`c.id === unit.class... && c.game === unit.game`)
- [ ] 7.2 Row renders only when `units.some(u => cls?.classAbilities?.length > 0)`
- [ ] 7.3 Each ability renders as a pill badge: `bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`
- [ ] 7.4 Cells where the unit's class has no abilities render a dash (`-`)

## 8. UI — Class Abilities in Promotion Details Modal

- [ ] 8.1 In `renderPromotionDetails` in `ComparisonGrid.tsx`, add a "Class Abilities" section after the "Weapons" section, conditionally rendered when `promoClass.classAbilities?.length > 0`
- [ ] 8.2 Each ability in the modal renders as a pill badge using the same style as weapons (`bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium`)

## 9. Verification

- [ ] 9.1 Load the comparator with a FE6 Swordmaster and confirm the "Class Abilities" row shows `+30 Crit`
- [ ] 9.2 Load the comparator with a FE7 Swordmaster and confirm it shows `+15 Crit` (different from FE6)
- [ ] 9.3 Load an FE8 unit (e.g., Eirika → Myrmidon path → Assassin) and confirm the promotion modal for Assassin shows `Silencer`, `Locktouch`, `Steal` pills
- [ ] 9.4 Load an FE8 unit that promotes to Bishop and confirm the promotion modal shows `Slayer`
- [ ] 9.5 Load a unit with no class abilities (e.g., any Cavalier) and confirm the "Class Abilities" row either shows `-` or is absent
