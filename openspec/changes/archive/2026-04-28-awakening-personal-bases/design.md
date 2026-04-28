## Context

The project stores Awakening unit data in `data/awakening/units.json`. Each unit has a `stats` object that should contain **personal base stats** — the unit's innate stat values before class bases are added. The application later computes final visible stats as `personal base + class base`.

Currently, many units have incorrect stats. Some have zeros where personal bases should be non-zero (e.g., Cherche has `str: 0` instead of `str: 7`). Others appear to have final bases mixed in as personal bases. The root issue is that no authoritative source publishes "personal bases" directly — only the "final bases" (personal + class) visible on Serenes Forest.

The project already has a scraping/parsing pattern documented in `hidden/SCRAPING_SUMMARY.md`: a scrape step fetches raw HTML into JSON, then a parse step transforms raw data into the project schema. Several existing scripts in `dev/` follow this pattern.

The class bases table at `https://serenesforest.net/awakening/classes/base-stats/` provides class base stats for all Awakening classes (HP, Str, Mag, Skl, Spd, Def, Res — Luck is always 0). The unit visible bases table at `https://serenesforest.net/awakening/characters/base-stats/main-story/` provides the combined (personal + class) stats for every unit.

The math is: **personal_base = visible_base - class_base** for each stat.

### Serenes Forest data notes

From scraping the unit bases page:
- Some stats include skill bonuses appended with `+` (e.g., `14+2` for Cherche's Str). The **visible base** is the number before the `+`. The `+N` is from a personal skill like "Strength +2" and is NOT part of the base stat.
- Some stats show `24+5` for HP (e.g., Vaike). Again, only the part before `+` is the base. The `+5` comes from the "HP +5" skill.
- Hard mode and Lunatic variants are listed with `(H)` and `(L)` suffixes on the name — we only care about **Normal mode** stats.
- Avatar/Robin is listed as "Avatar" with class "Tactician" — needs to be mapped to `robin_m` / `robin_f`.
- SpotPass characters (Gangrel, Walhart, Emmeryn, Yen'fay, Aversa, Priam) are listed in a separate table at the bottom.
- Child characters have a note saying their listed stats are "absolute base stats before adding class bases" — meaning the child table already shows personal bases, NOT final bases. Children should NOT have class bases subtracted.

From scraping the class bases page:
- Luck is 0 for all classes (not listed in the table).
- Some classes are listed with gender variants: "Lord (M)", "Lord (F)".
- Taguel and Manakete have two rows: unshifted (actual bases) and shifted (in-class roll). Use the unshifted row (marked with `*`) as the class base.
- "Priest, Cleric" is a single combined row — both classes share the same bases.
- "War Monk/Cleric" is similarly combined.

### Unit-to-class mapping

Each unit's class in `units.json` must map to the correct class name on Serenes Forest:
| Unit class ID | Serenes Forest class name |
|---|---|
| `lord` | Lord (M) — for Chrom |
| `tactician` | Tactician — for Robin |
| `cleric` | Priest, Cleric — for Lissa |
| `great_knight` | Great Knight — for Frederick |
| `cavalier` | Cavalier |
| `archer` | Archer |
| `fighter` | Fighter |
| `mage` | Mage |
| `pegasus_knight` | Pegasus Knight |
| `knight` | Knight |
| `villager` | Villager |
| `myrmidon` | Myrmidon |
| `troubadour` | Troubadour |
| `taguel` | Taguel * |
| `thief` | Thief |
| `mercenary` | Mercenary |
| `wyvern_rider` | Wyvern Rider |
| `war_monk` | War Monk/Cleric — for Libra |
| `dark_mage` | Dark Mage |
| `trickster` | Trickster |
| `dancer` | Dancer |
| `manakete` | Manakete * — for Nowi, Tiki |
| `swordmaster` | Swordmaster |
| `warrior` | Warrior — for Basilio |
| `hero` | Hero — for Flavia |
| `dark_flier` | Dark Flier — for Aversa |
| `conqueror` | Conqueror — for Walhart |
| `sage` | Sage — for Emmeryn |

## Goals / Non-Goals

**Goals:**
- Derive accurate personal base stats for every Awakening unit currently in `data/awakening/units.json`
- Preserve intermediary raw and computed JSON files for manual fact-checking
- Validate that all computed personal bases are ≤ their corresponding visible final bases

**Non-Goals:**
- Adding new units not currently in `data/awakening/units.json` (e.g., child characters, SpotPass characters)
- Changing the JSON schema of `units.json`
- Modifying any UI components
- Scraping growth rates, stat modifiers, skills, or any non-base-stat data

## Decisions

### Decision 1: Use Serenes Forest as the single source of truth for visible bases and class bases

**Rationale**: Serenes Forest is the most authoritative publicly available source for Awakening stat data, credited to multiple contributors (FEA 2ch strategy wiki, Othin, Remnant Sage, MiruPage). The data is presented in structured HTML tables that `pandas.read_html` can parse reliably.

**Alternatives considered**: Using the Fire Emblem Wiki or in-game memory dumps —前者 is less structured for bulk extraction; the latter is not publicly available.

### Decision 2: Follow the existing scrape/parse pattern from `hidden/SCRAPING_SUMMARY.md`

The project has an established two-step pattern:
1. **Scrape**: `pandas.read_html` → raw JSON cache in `dev/`
2. **Parse**: raw JSON → project schema

Both scrapers output to `dev/` intermediary files. The parser reads from those intermediaries and outputs the final computed personal bases.

**Rationale**: Consistency with existing scripts (`scrape_awakening_bases.py`, `parse_awakening_bases.py`, etc.) reduces cognitive overhead and reuses proven patterns.

### Decision 3: Strip skill bonuses from visible base stats before subtraction

Stats like `14+2` on the Serenes Forest page include a skill bonus. The format is `{base}+{skill_bonus}`. Only the part before `+` is the actual visible base stat.

**Algorithm**: For each stat value, if it contains `+`, split on `+` and take the first part as an integer. Otherwise, parse the whole string as an integer.

### Decision 4: Children use their table values directly as personal bases

The Serenes Forest children's table explicitly states: "absolute base stats before adding their class's base stats." Therefore, children's listed stats ARE their personal bases already. No subtraction is needed for children.

Since children are not currently in `data/awakening/units.json`, this is noted for future reference only.

### Decision 5: Only scrape Normal mode stats

Hard mode `(H)` and Lunatic `(L)` rows are excluded. We use only the first (Normal) row for each character.

### Decision 6: Manual review gate between computation and units.json update

The parser writes personal bases to `dev/awakening_personal_bases.json`. A human reviews this intermediary file before the final update to `data/awakening/units.json`. This is a **human handoff point** documented outside the autonomous task loop.

## Risks / Trade-offs

- **[Risk] Serenes Forest page structure changes or is unavailable]** → Mitigation: Raw scraped JSON is cached locally in `dev/`. Once scraped, the parser can run offline. The scraper can be re-run if the data source changes.
- **[Risk] Incorrect class mapping for edge cases]** → Mitigation: The unit-to-class mapping table is explicitly documented in this design. The parser will log warnings for any unmapped class. The intermediary `dev/awakening_personal_bases.json` enables manual spot-checking.
- **[Risk] Taguel/Manakete class bases using wrong row]** → Mitigation: Design explicitly specifies using the unshifted (starred `*`) row for these classes, which gives the actual personal-stat-scale bases.
- **[Risk] Avatar stat variance from Asset/Flaw]** → Mitigation: The Serenes Forest page shows the "default" Avatar stats (before Asset/Flaw adjustments). Use those base values. The Robin unit in `units.json` already represents the "base" Robin before customization.
