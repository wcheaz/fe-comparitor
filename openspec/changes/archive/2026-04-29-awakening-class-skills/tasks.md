## 1. Scrape and parse skills data from Serenes Forest

- [x] 1.1 Create `dev/scrape_awakening_skills.py` that fetches the Obtainable Skills table from `https://serenesforest.net/awakening/miscellaneous/skills/` using `pandas.read_html`, extracts rows with Icon/Skill/Effect/Activation/Class/Level columns, and saves to `dev/awakening_skills_raw.json`.
  - **Done when**: Script runs without error, `dev/awakening_skills_raw.json` exists and contains 50+ skill entries with Skill, Effect, Activation, Class, Level fields.
  - **Verify by**: `python3 dev/scrape_awakening_skills.py && python3 -c "import json; d=json.load(open('dev/awakening_skills_raw.json')); print(f'{len(d)} entries')"` — expect 50+ entries.
  - **Stop and hand off if**: Serenes Forest returns a different table structure or blocks the request.

- [x] 1.2 Create `dev/parse_awakening_skills.py` that reads `dev/awakening_skills_raw.json`, maps each row's Class field to the corresponding class ID in `data/awakening/classes.json`, builds `"Skill Name (Lv. N)"` strings using the frozen mapping from `design.md`, updates each class's `classAbilities` field, validates all mapped class IDs exist in the JSON, and writes the updated file back.
  - **Done when**: Script runs without error, all 44 previously-empty classes now have populated `classAbilities`, the 10 already-populated classes are unchanged, and the 8 enemy/special classes remain empty.
  - **Verify by**: `python3 dev/parse_awakening_skills.py && python3 -c "import json; cs=json.load(open('data/awakening/classes.json')); empty=[c['name'] for c in cs if not c.get('classAbilities')]; print(f'Empty: {len(empty)} classes: {empty}')"` — expect exactly 8 enemy/special classes with empty arrays.
  - **Stop and hand off if**: A class ID in the frozen mapping does not exist in `classes.json`, indicating a data schema mismatch that requires human decision.

## 2. Verify ability definitions completeness

- [x] 2.1 Run a verification that every skill name referenced in all Awakening `classAbilities` (with `(Lv. N)` suffix stripped) has a matching entry in `lib/abilities.ts` `abilityDefinitions`. If any are missing, add them with description, procCondition, procChance, and gameSpecificDetails.Awakening sourced from the Serenes Forest table.
  - **Done when**: A grep or script confirms every stripped skill name appears as a key in `abilityDefinitions` in `lib/abilities.ts`, and each has a non-empty description and Awakening gameSpecificDetails.
  - **Verify by**: `grep -c "Awakening" lib/abilities.ts` shows count matching expected, and manual spot-check of 5 random skills confirms description and gameSpecificDetails are present.
  - **Stop and hand off if**: A skill name from the table has no corresponding definition and the exact wording is ambiguous — ask for human clarification on the description.

## 3. End-to-end validation

- [x] 3.1 Run the project build and lint to confirm no regressions from the data changes. Verify in the browser that the Awakening class comparison view shows populated Class Abilities pills for all 46 playable classes, and that clicking a pill opens the detail modal with the correct description and proc information.
  - **Done when**: `npm run build` completes without errors, `npm run lint` passes, and browser inspection confirms at least 5 spot-checked classes (Lord, Dark Flier, Dread Fighter, Berserker, War Monk) display correct clickable skill pills with accurate detail modals.
  - **Verify by**: `npm run build && npm run lint` both exit 0. Open the browser to the Awakening comparison, select units from diverse classes, confirm Class Abilities row shows 2 pills per playable class and clicking a pill shows the correct ability description.
  - **Stop and hand off if**: Build or lint fails with errors unrelated to this change (pre-existing issues).
