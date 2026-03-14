## Why

The application currently supports *Binding Blade*, *Three Houses*, and *Engage*. Adding data for *Fire Emblem Awakening* expands the comparator's catalog to one of the most mechanically distinct entries in the series, incorporating new systems like innate weaknesses, starting skills, and class stat modifiers alongside traditional unit metrics. This also sets the foundation for tracking personal vs class growths over a character's lifecycle.

## What Changes

- Add *Fire Emblem Awakening* unit data including bases, personal growths, join chapters, weapon ranks, and starting skills.
- Ignore "Child" units for this initial import iteration.
- Implement "innate weaknesses" for units (e.g., dragon weakness for Nowi).
- Add Awakening class details including tier, stat modifiers, class growths, movement types, and abilities.
- Compile and define Awakening-specific abilities for reference in ability information displays.

## Capabilities

### New Capabilities
- `fe-awakening-data`: Comprehensive ingestion of Awakening unit, class, and ability data, including the mechanics for innate weaknesses and class stat modifiers, into `units.json` and `classes.json`.
- `unit-innate-weaknesses`: Extends the unit details display to show innate weaknesses separate from class-based weaknesses.
- `class-growths-and-modifiers`: Tracking and display mechanics designed specifically to factor in class-based stat bonuses and distinct class/personal growth rates.

### Modified Capabilities
- `class-abilities-display`: Requirement update to handle Awakening's extensive personal/class skill system alongside legacy class abilities.
- `stat-progression-table`: Modifications needed to correctly calculate stats resulting from separating personal unit growths from class-specific growths.

## Impact

- A `data/awakening/` directory will be created to house `units.json`, `classes.json`, etc.
- Updates to `types/unit.ts` to track `innateWeaknesses` on the literal `Unit` model, and class `growths`/`statModifiers` on the `Class` model.
- Updates to `lib/normalization.ts` and `lib/stats.ts` to properly aggregate and calculate the sum of base stats + class modifiers + class growths + personal growths.
