## 1. Scrape Raw Data

- [x] 1.1 Create `dev/scrape_awakening_unit_bases.py` that fetches all tables from `https://serenesforest.net/awakening/characters/base-stats/main-story/` using `pandas.read_html`, extracts Normal-mode rows only (skipping rows with `(H)` or `(L)` in the Name), and saves the raw data to `dev/awakening_unit_bases_raw.json`.
  - Done when: `python dev/scrape_awakening_unit_bases.py` produces `dev/awakening_unit_bases_raw.json` with entries for Chrom, Lissa, Frederick, and all other main-story/SpotPass characters.
  - Verify by: `python dev/scrape_awakening_unit_bases.py && python -c "import json; d=json.load(open('dev/awakening_unit_bases_raw.json')); print(len(d), 'units scraped')"` — expect 30+ entries.
  - Stop and hand off if: Serenes Forest returns a 403/429 or table structure is unrecognizable.

- [x] 1.2 Create `dev/scrape_awakening_class_bases.py` that fetches all tables from `https://serenesforest.net/awakening/classes/base-stats/` using `pandas.read_html` and saves the raw data to `dev/awakening_class_bases_raw.json`.
  - Done when: `python dev/scrape_awakening_class_bases.py` produces `dev/awakening_class_bases_raw.json` with entries for Lord, Tactician, Cavalier, Knight, Myrmidon, Pegasus Knight, Wyvern Rider, Mage, Dark Mage, Taguel, Manakete, and all promoted classes.
  - Verify by: `python dev/scrape_awakening_class_bases.py && python -c "import json; d=json.load(open('dev/awakening_class_bases_raw.json')); print(len(d), 'classes scraped')"` — expect 35+ entries.
  - Stop and hand off if: Serenes Forest returns a 403/429 or table structure is unrecognizable.

## 2. Parse and Compute Personal Bases

- [x] 2.1 Create `dev/parse_awakening_personal_bases.py` that reads both raw JSON files, maps each unit's class to the correct Serenes Forest class name (using the mapping table in `design.md`), strips skill bonuses (splitting on `+` and taking the integer before it), subtracts class bases from visible bases, and writes results to `dev/awakening_personal_bases.json`. The output SHALL include unit name, class, visible bases, class bases, and computed personal bases for all 8 stats.
  - Done when: `python dev/parse_awakening_personal_bases.py` produces `dev/awakening_personal_bases.json` with entries for all units currently in `data/awakening/units.json`.
  - Verify by: `python dev/parse_awakening_personal_bases.py && python -c "import json; d=json.load(open('dev/awakening_personal_bases.json')); print(len(d), 'units parsed')"` — expect 28+ entries matching units.json.
  - Stop and hand off if: A unit's class cannot be mapped to any entry in the class bases data (log the unit name and class).

- [x] 2.2 Add validation to `dev/parse_awakening_personal_bases.py` that checks every computed personal base is ≤ the corresponding visible base. On failure, print the offending unit, stat, personal value, and visible value, then exit non-zero.
  - Done when: Running the parser on the current data exits with code 0 and prints a validation success message.
  - Verify by: `python dev/parse_awakening_personal_bases.py; echo "Exit code: $?"` — exit code must be 0.
  - Stop and hand off if: Validation fails (a personal base exceeds a visible base), indicating a scraping or mapping error that needs manual investigation.

## 3. Update units.json

- [x] 3.1 Update each unit's `stats` object in `data/awakening/units.json` with the computed personal bases from `dev/awakening_personal_bases.json`. Only the `stats` field changes; all other fields (growths, statModifiers, skills, etc.) remain untouched.
  - Done when: Every unit in `data/awakening/units.json` has `stats` values matching the computed personal bases in the intermediary file.
  - Verify by: `python -c "import json; u=json.load(open('data/awakening/units.json')); p=json.load(open('dev/awakening_personal_bases.json')); pm={e['name']:e for e in p}; mismatches=[(u['name'],k,u['stats'][k],pm[u['name']]['personal_bases'][k]) for u in u for k in u['stats'] if u['name'] in pm and u['stats'][k]!=pm[u['name']]['personal_bases'][k]]; print(f'{len(mismatches)} mismatches') or print('All match')"` — expect 0 mismatches.
  - Stop and hand off if: Any unit in `units.json` has no corresponding entry in the personal bases file.

## 4. Cleanup and Documentation

- [x] 4.1 Update `hidden/SCRAPING_SUMMARY.md` to document the three new scripts (`scrape_awakening_unit_bases.py`, `scrape_awakening_class_bases.py`, `parse_awakening_personal_bases.py`) and their input/output files.
  - Done when: The summary file lists all three scripts with descriptions and file paths.
  - Verify by: Read `hidden/SCRAPING_SUMMARY.md` and confirm all three scripts are documented.

## Human Handoff

The following items require manual human review and are NOT part of the autonomous loop:

- **Manual fact-check of `dev/awakening_personal_bases.json`**: Before task 3.1 is executed, a human should spot-check the computed personal bases against known values (e.g., Cherche's personal Str should be 7, not 0). The intermediary file is preserved specifically for this purpose.
- **Manual fact-check of `dev/awakening_unit_bases_raw.json`**: Verify the scraper captured correct values from the source page.
