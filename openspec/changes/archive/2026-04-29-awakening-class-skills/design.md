## Context

The project is a Fire Emblem unit comparison tool. Awakening classes already have a `classAbilities: string[]` field in `data/awakening/classes.json`. 10 of 54 classes are populated; 44 have empty arrays. The `lib/abilities.ts` file contains ~90 Awakening skill definitions in a `Record<string, AbilityData>` dictionary. The UI (AbilityPill, ClassAbilitiesRow, ComparisonGrid) already renders any populated `classAbilities` — no UI changes needed.

The canonical data source is the Serenes Forest Awakening skills table at `https://serenesforest.net/awakening/miscellaneous/skills/`. This table maps every playable class to exactly 2 skills at specific levels.

## Goals / Non-Goals

**Goals:**
- Populate `classAbilities` for all 44 missing Awakening classes with accurate skill names and level numbers.
- Ensure every skill referenced in `classAbilities` has a corresponding entry in `lib/abilities.ts` with description, proc condition (if applicable), and proc chance (if applicable).
- Create a scraping script (`dev/scrape_awakening_skills.py`) and parsing script (`dev/parse_awakening_skills.py`) following the established `dev/` pipeline pattern.

**Non-Goals:**
- No UI component changes.
- No changes to `startingSkills` on units.
- No enemy-only skills or item-granted skills.
- No changes to non-Awakening game data.

## Decisions

### Decision 1: Skill string format remains `"Skill Name (Lv. N)"`

The 10 existing entries use the format `"Skill Name (Lv. N)"` (e.g., `"Veteran (Lv. 1)"`). All new entries will use the same format. The `getAbilityByName()` function in `lib/abilities.ts` strips the `(Lv. N)` suffix before dictionary lookup, so this format is already handled.

### Decision 2: Complete class-to-skill mapping (frozen)

This is the authoritative mapping from Serenes Forest. No interpretation or policy choice is needed.

#### Unpromoted Classes (2 skills each)

| Class ID | Class Name | classAbilities |
|----------|-----------|----------------|
| `lord` | Lord | `["Dual Strike+ (Lv. 1)", "Charm (Lv. 10)"]` |
| `tactician` | Tactician | `["Veteran (Lv. 1)", "Solidarity (Lv. 10)"]` *(already populated)* |
| `cavalier` | Cavalier | `["Discipline (Lv. 1)", "Outdoor Fighter (Lv. 10)"]` *(already populated)* |
| `knight` | Knight | `["Defense +2 (Lv. 1)", "Indoor Fighter (Lv. 10)"]` *(already populated)* |
| `myrmidon` | Myrmidon | `["Avoid +10 (Lv. 1)", "Vantage (Lv. 10)"]` *(already populated)* |
| `mercenary` | Mercenary | `["Armsthrift (Lv. 1)", "Patience (Lv. 10)"]` *(already populated)* |
| `fighter` | Fighter | `["HP +5 (Lv. 1)", "Zeal (Lv. 10)"]` |
| `barbarian` | Barbarian | `["Despoil (Lv. 1)", "Gamble (Lv. 10)"]` |
| `archer` | Archer | `["Skill +2 (Lv. 1)", "Prescience (Lv. 10)"]` |
| `thief` | Thief | `["Locktouch (Lv. 1)", "Movement +1 (Lv. 10)"]` |
| `pegasus_knight` | Pegasus Knight | `["Speed +2 (Lv. 1)", "Relief (Lv. 10)"]` |
| `wyvern_rider` | Wyvern Rider | `["Strength +2 (Lv. 1)", "Tantivy (Lv. 10)"]` |
| `mage` | Mage | `["Magic +2 (Lv. 1)", "Focus (Lv. 10)"]` |
| `dark_mage` | Dark Mage | `["Hex (Lv. 1)", "Anathema (Lv. 10)"]` |
| `priest` | Priest | `["Miracle (Lv. 1)", "Healtouch (Lv. 10)"]` |
| `cleric` | Cleric | `["Miracle (Lv. 1)", "Healtouch (Lv. 10)"]` |
| `troubadour` | Troubadour | `["Resistance +2 (Lv. 1)", "Demoiselle (Lv. 10)"]` |
| `villager` | Villager | `["Aptitude (Lv. 1)", "Underdog (Lv. 15)"]` |
| `dancer` | Dancer | `["Luck +4 (Lv. 1)", "Special Dance (Lv. 15)"]` |
| `taguel` | Taguel | `["Even Rhythm (Lv. 1)", "Beastbane (Lv. 15)"]` |
| `manakete` | Manakete | `["Odd Rhythm (Lv. 1)", "Wyrmsbane (Lv. 15)"]` |

#### Promoted Classes (2 skills each)

| Class ID | Class Name | classAbilities |
|----------|-----------|----------------|
| `great_lord` | Great Lord | `["Aether (Lv. 5)", "Rightful King (Lv. 15)"]` |
| `grandmaster` | Grandmaster | `["Ignis (Lv. 5)", "Rally Spectrum (Lv. 15)"]` *(already populated)* |
| `paladin` | Paladin | `["Defender (Lv. 5)", "Aegis (Lv. 15)"]` *(already populated)* |
| `great_knight` | Great Knight | `["Luna (Lv. 5)", "Dual Guard+ (Lv. 15)"]` *(already populated)* |
| `swordmaster` | Swordmaster | `["Astra (Lv. 5)", "Swordfaire (Lv. 15)"]` *(already populated)* |
| `hero` | Hero | `["Sol (Lv. 5)", "Axebreaker (Lv. 15)"]` *(already populated)* |
| `sniper` | Sniper | `["Hit Rate +20 (Lv. 5)", "Bowfaire (Lv. 15)"]` |
| `bow_knight` | Bow Knight | `["Rally Skill (Lv. 5)", "Bowbreaker (Lv. 15)"]` |
| `assassin` | Assassin | `["Lethality (Lv. 5)", "Pass (Lv. 15)"]` |
| `trickster` | Trickster | `["Lucky Seven (Lv. 5)", "Acrobat (Lv. 15)"]` |
| `warrior` | Warrior | `["Rally Strength (Lv. 5)", "Counter (Lv. 15)"]` |
| `berserker` | Berserker | `["Wrath (Lv. 5)", "Axefaire (Lv. 15)"]` |
| `falcon_knight` | Falcon Knight | `["Rally Speed (Lv. 5)", "Lancefaire (Lv. 15)"]` |
| `dark_flier` | Dark Flier | `["Rally Movement (Lv. 5)", "Galeforce (Lv. 15)"]` |
| `wyvern_lord` | Wyvern Lord | `["Quick Burn (Lv. 5)", "Swordbreaker (Lv. 15)"]` |
| `griffon_rider` | Griffon Rider | `["Deliverer (Lv. 5)", "Lancebreaker (Lv. 15)"]` |
| `sage` | Sage | `["Rally Magic (Lv. 5)", "Tomefaire (Lv. 15)"]` |
| `sorcerer` | Sorcerer | `["Vengeance (Lv. 5)", "Tomebreaker (Lv. 15)"]` |
| `dark_knight` | Dark Knight | `["Slow Burn (Lv. 5)", "Lifetaker (Lv. 15)"]` |
| `war_monk` | War Monk | `["Rally Luck (Lv. 5)", "Renewal (Lv. 15)"]` |
| `war_cleric` | War Cleric | `["Rally Luck (Lv. 5)", "Renewal (Lv. 15)"]` |
| `valkyrie` | Valkyrie | `["Rally Resistance (Lv. 5)", "Dual Support+ (Lv. 15)"]` |
| `general` | General | `["Rally Defense (Lv. 5)", "Pavise (Lv. 15)"]` |

#### DLC / Special Classes

| Class ID | Class Name | classAbilities |
|----------|-----------|----------------|
| `dread_fighter` | Dread Fighter | `["Resistance +10 (Lv. 1)", "Aggressor (Lv. 15)"]` |
| `bride` | Bride | `["Rally Heart (Lv. 1)", "Bond (Lv. 15)"]` |

#### Classes with no class-learned skills (keep empty)

The following classes exist in `classes.json` but are not on the Serenes Forest obtainable skills table — they are enemy-only, NPC-only, or special classes with no skill progression:

| Class ID | Class Name | Reason |
|----------|-----------|--------|
| `soldier` | Soldier | Enemy-only class |
| `merchant` | Merchant | NPC/Anna-only class |
| `revenant` | Revenant | Enemy-only class |
| `entombed` | Entombed | Enemy-only class |
| `conqueror` | Conqueror | Walhart-only class |
| `lodestar` | Lodestar | DLC class (no learnable skills listed) |
| `grima` | Grima | Story boss class |
| `mirage` | Mirage | DLC class (no learnable skills listed) |

These SHALL remain with `classAbilities: []`.

### Decision 3: Ability definitions completeness check

Every skill name referenced in the mapping above already exists in `lib/abilities.ts` `abilityDefinitions`. I verified this against the current file content. No new ability definitions are needed. However, the implementation task should verify this programmatically to catch any discrepancies.

### Decision 4: Scraping approach

Follow the existing `dev/` pipeline pattern:
1. `dev/scrape_awakening_skills.py` — uses `pandas.read_html` to extract the skills table from Serenes Forest, saves to `dev/awakening_skills_raw.json`.
2. `dev/parse_awakening_skills.py` — reads the raw JSON, maps skill rows to class IDs, writes a mapping file used to update `classes.json`.

The scraping script is for reproducibility and auditability. The actual data population can also be done directly by the parse script since the mapping is frozen in this design document.

## Risks / Trade-offs

- **[Risk: Scraped table format changes]** → Mitigation: The mapping is frozen in this design doc. The scrape script is for reference only; the parse script uses the frozen mapping.
- **[Risk: Class ID mismatch between mapping and `classes.json`]** → Mitigation: The parse script will validate every class ID in the mapping against actual IDs in `classes.json` and error on any mismatch.
- **[Risk: Duplicate skill names with different casing]** → Mitigation: All skill names are taken directly from the existing `abilityDefinitions` keys, which are the canonical names.
