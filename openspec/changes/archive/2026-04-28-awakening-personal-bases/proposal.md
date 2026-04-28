## Why

Many Awakening units in `data/awakening/units.json` have incorrect base stats. For example, Cherche is listed with 0 strength when she actually has 7 personal strength. The root cause is that the current data mixes "personal bases" (unit-specific) with "final bases" (personal + class bases) inconsistently. Since the application needs personal bases to support promotion and reclassing calculations, all Awakening units need their personal base stats derived correctly from verified sources.

## What Changes

- Add a scraper script (`dev/scrape_awakening_unit_bases.py`) that fetches the **visible (final) base stats** for all Awakening main-story, child, and SpotPass characters from Serenes Forest (`https://serenesforest.net/awakening/characters/base-stats/main-story/`), saving raw output to `dev/awakening_unit_bases_raw.json`.
- Add a scraper script (`dev/scrape_awakening_class_bases.py`) that fetches the **class base stats** for all Awakening classes from Serenes Forest (`https://serenesforest.net/awakening/classes/base-stats/`), saving raw output to `dev/awakening_class_bases_raw.json`.
- Add a parser script (`dev/parse_awakening_personal_bases.py`) that computes **personal base stats** by subtracting each unit's class base stats from their visible final base stats, and outputs results to `dev/awakening_personal_bases.json` as an intermediary file for manual fact-checking.
- Update `data/awakening/units.json` with the corrected personal base stats for all units.
- Add a validation test confirming personal bases are always ≤ final bases (since class bases cannot be negative).

## Capabilities

### New Capabilities
- `awakening-personal-bases-scraper`: Scripts to scrape visible unit bases and class bases from Serenes Forest, compute personal bases via subtraction, and validate the results.

### Modified Capabilities
- `fe-awakening-data`: The Awakening unit data spec is modified to require that `stats` in `data/awakening/units.json` contains **personal base stats** (final visible bases minus class bases), not a mix of personal and final values.

## Impact

- `data/awakening/units.json`: All unit `stats` objects will be corrected to contain accurate personal base stats.
- `dev/`: Three new scripts added (two scrapers, one parser). Two new raw JSON intermediaries. One new computed intermediary JSON.
- `hidden/SCRAPING_SUMMARY.md`: Should be updated to document the new scripts.
- No UI or API changes required; the application logic already expects personal bases — the data was simply wrong.
