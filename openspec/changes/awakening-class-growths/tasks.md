## 1. Fix Incorrect Non-Zero Class Growths

- [x] 1.1 Replace the incorrect `growths` objects on the following 10 classes in `data/awakening/classes.json`. These classes have inflated values that do not match Serenes Forest class-only growth rates. Replace with the correct values below.

  - `tactician` → `{ hp: 40, str: 15, mag: 15, skl: 15, spd: 15, lck: 0, def: 10, res: 10 }`
  - `cavalier` → `{ hp: 45, str: 20, mag: 0, skl: 20, spd: 20, lck: 0, def: 10, res: 5 }`
  - `knight` → `{ hp: 50, str: 25, mag: 0, skl: 15, spd: 10, lck: 0, def: 15, res: 5 }`
  - `myrmidon` → `{ hp: 40, str: 20, mag: 0, skl: 25, spd: 25, lck: 0, def: 5, res: 5 }`
  - `mercenary` → `{ hp: 45, str: 20, mag: 0, skl: 25, spd: 20, lck: 0, def: 10, res: 5 }`
  - `grandmaster` → `{ hp: 40, str: 15, mag: 15, skl: 15, spd: 15, lck: 0, def: 10, res: 10 }`
  - `paladin` → `{ hp: 45, str: 20, mag: 0, skl: 20, spd: 20, lck: 0, def: 10, res: 10 }`
  - `great_knight` → `{ hp: 50, str: 25, mag: 0, skl: 15, spd: 15, lck: 0, def: 15, res: 5 }`
  - `swordmaster` → `{ hp: 40, str: 20, mag: 0, skl: 25, spd: 25, lck: 0, def: 5, res: 10 }`
  - `hero` → `{ hp: 45, str: 20, mag: 0, skl: 25, spd: 20, lck: 0, def: 10, res: 5 }`

  Done when: All 10 classes have growths matching the values above. No other fields on any class entry are changed.

## 2. Populate All-Zero Class Growths

- [ ] 2.1 Replace the all-zero `growths` objects with correct Serenes Forest class growth rates for the following 17 classes in `data/awakening/classes.json`. Each class `growths` object MUST contain all eight stat keys (`hp`, `str`, `mag`, `skl`, `spd`, `lck`, `def`, `res`).

  **Unpromoted classes:**
  - `archer` → `{ hp: 45, str: 15, mag: 0, skl: 30, spd: 15, lck: 0, def: 10, res: 5 }`
  - `pegasus_knight` → `{ hp: 40, str: 15, mag: 5, skl: 25, spd: 25, lck: 0, def: 5, res: 10 }`
  - `lord` → `{ hp: 40, str: 20, mag: 0, skl: 20, spd: 20, lck: 0, def: 10, res: 5 }`
  - `wyvern_rider` → `{ hp: 45, str: 30, mag: 0, skl: 15, spd: 15, lck: 0, def: 10, res: 5 }`
  - `cleric` → `{ hp: 35, str: 5, mag: 15, skl: 15, spd: 15, lck: 0, def: 5, res: 15 }`
  - `troubadour` → `{ hp: 35, str: 0, mag: 20, skl: 10, spd: 20, lck: 0, def: 5, res: 15 }`
  - `villager` → `{ hp: 35, str: 10, mag: 0, skl: 5, spd: 5, lck: 0, def: 10, res: 5 }`
  - `dancer` → `{ hp: 35, str: 5, mag: 0, skl: 25, spd: 25, lck: 0, def: 5, res: 5 }`
  - `dark_mage` → `{ hp: 50, str: 5, mag: 15, skl: 15, spd: 15, lck: 0, def: 10, res: 10 }`
  - `thief` → `{ hp: 35, str: 15, mag: 5, skl: 25, spd: 25, lck: 0, def: 5, res: 5 }`
  - `fighter` → `{ hp: 45, str: 25, mag: 0, skl: 20, spd: 15, lck: 0, def: 10, res: 5 }`
  - `mage` → `{ hp: 35, str: 0, mag: 20, skl: 20, spd: 20, lck: 0, def: 5, res: 10 }`
  - `taguel` → `{ hp: 45, str: 20, mag: 0, skl: 15, spd: 15, lck: 0, def: 15, res: 5 }`
  - `manakete` → `{ hp: 50, str: 20, mag: 5, skl: 20, spd: 20, lck: 0, def: 15, res: 15 }`

  **Promoted classes:**
  - `warrior` → `{ hp: 45, str: 25, mag: 0, skl: 20, spd: 15, lck: 0, def: 10, res: 5 }`
  - `trickster` → `{ hp: 35, str: 10, mag: 15, skl: 25, spd: 20, lck: 0, def: 5, res: 10 }`
  - `war_monk` → `{ hp: 45, str: 15, mag: 15, skl: 10, spd: 15, lck: 0, def: 10, res: 10 }`

  Done when: All 17 classes have non-zero growths matching the values above. No other fields on any class entry are changed.

## 3. Validate All Changes

- [ ] 3.1 Validate the edited file. Run `node -e "JSON.parse(require('fs').readFileSync('data/awakening/classes.json','utf8'))"` to confirm valid JSON. Then spot-check at least 3 classes from each group: one from the 10 corrected classes (e.g., `knight`), one from the 17 filled classes (e.g., `archer`), and one from the 22 previously-correct classes (e.g., `sniper`) to confirm values match Serenes Forest.

  Done when: JSON parses without error and all 3 spot-checked classes match exactly.

  Stop and hand off if: JSON parse fails — do not attempt to fix structure errors by guessing; re-read the file to find the syntax issue.
