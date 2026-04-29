## Context

`data/awakening/classes.json` contains ~40 Awakening class objects. Each has a `growths` object with eight integer stat keys. Seventeen of those classes have `growths` set to all zeros, meaning any Awakening unit in those classes gets only their personal growth rate for stat progression — class contribution is effectively absent.

The existing stat progression system in `lib/stats.ts` already correctly computes `unit.growths[stat] + class.growths[stat]` for the effective growth rate. No code changes are needed — only the data values are wrong.

The canonical source is the Serenes Forest Awakening class growth rate table at `https://serenesforest.net/awakening/classes/growth-rates/`. That table lists class-only growth rates (added to a unit's personal growths for the full rate). All values in the table are non-negative integers. Luck is 0% for every class.

## Goals / Non-Goals

**Goals:**
- Replace the all-zero `growths` objects on exactly 17 class entries with the correct Serenes Forest class growth rates
- Preserve all other fields on those class objects unchanged (baseStats, statModifiers, maxStats, weapons, etc.)
- Ensure the data file remains valid JSON after edits

**Non-Goals:**
- Auditing or correcting the growth values on classes that already have non-zero growths (tactician, cavalier, knight, myrmidon, mercenary, grandmaster, paladin, great_knight, swordmaster, hero). Those values may originate from a different source and are a separate concern.
- Adding new class entries or removing existing ones
- Changing the JSON schema, TypeScript types, or any application code
- Writing a scraping/parsing script (the values are already known from the Serenes Forest page, which was fetched and verified)

## Decisions

### 1. Direct JSON edit, no script

**Decision**: Edit `data/awakening/classes.json` directly, replacing the zero growths with the correct values.

**Rationale**: The 17 target classes are identified by ID, the replacement values are known and verified from the source page, and the total edit count is small (17 objects, 8 fields each). Writing a scraping + parsing script would add dev-time complexity and an external dependency for a one-time mechanical data fix. The SCRAPING_SUMMARY.md pattern exists for future larger-scale scraping work, but is overkill here.

**Alternative considered**: Write a `parse_awakening_class_growths.py` script following the project's scraping/parsing pattern. Rejected because the values are already extracted and verified — a script adds build-time dependencies with no verification benefit.

### 2. Taguel uses male variant

**Decision**: The single `taguel` entry in classes.json uses the male (M) growth rates: `hp:45, str:20, mag:0, skl:15, spd:15, lck:0, def:15, res:5`.

**Rationale**: Serenes Forest lists two rows for Taguel — male and female — with different growths. The existing `taguel` entry in classes.json is a single class entry (not split by gender). Panne (the primary Taguel character) is female, but the class entry itself is gender-neutral. The male variant is used because it matches the unshifted base stat row already present in the file (the personal bases script uses the male/unshifted row for Taguel). Using the male rates maintains consistency with the base stat extraction approach.

### 3. Shared growths for paired classes

**Decision**: Where Serenes Forest lists two classes with identical growths in one row (e.g., "Fighter, Warrior" or "Mercenary, Hero"), each class entry gets the same growth values.

**Rationale**: The source table explicitly groups them: "Fighter, Warrior" share one row of growths. This means both the unpromoted and promoted class get identical class growth contributions. The promotion stat boost comes from the difference in `baseStats`, not from different class growth rates.

### 4. Value source and verification

**Decision**: Use the values from the Serenes Forest page fetched during the proposal phase. Cross-check each value against the table before writing.

**Rationale**: The page was fetched and parsed. The values are stable reference data that does not change. No re-fetching is needed.

## Risks / Trade-offs

- **[Taguel gender choice is a judgment call]** → The male rates are used because that's consistent with the base stat extraction. If the app later splits Taguel into gendered variants, both rows would need separate entries. This is noted as a future consideration, not a blocker.
- **[Existing inflated growths not addressed]** → The first ~10 classes have growths that don't match Serenes Forest class-only rates. Fixing those is deferred to a separate audit. The current change does not make this worse — it only fills in zeros.
- **[Manual edit risk]** → 136 individual field edits (17 classes × 8 stats). Mitigated by verifying the complete growths object per class against the source table after editing.
