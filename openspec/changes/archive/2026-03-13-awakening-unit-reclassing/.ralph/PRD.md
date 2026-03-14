# Product Requirements Document

*Generated from OpenSpec artifacts*

## Proposal

## Why
The current stat progression table only supports standard linear or branching promotions and lacks the ability to handle lateral or vertical reclassing, a core progression mechanic in Fire Emblem Awakening. Implementing this feature is necessary to accurately simulate and compare the full potential of Awakening units.

## What Changes
- Introduce horizontal (same tier) and vertical (promoted tier) reclassing options to the "Promotion Levels" section of the `StatProgressionTable`.
- Update the level progression logic to return Awakening units to level 1 upon reclassing.
- Support infinite consecutive reclassing events, assuming units reach the required level (e.g. 10+ for unpromoted, 1+ for promoted).
- Ensure that class level caps (20 for most classes, 30 for special classes defined in `lib/stats.ts`) are correctly enforced across all reclassing cycles.
- Extend the `generateProgressionArray` function and relevant state in `StatProgressionTable` to handle sequential reclassing events alongside standard promotion events.

## Capabilities

### New Capabilities
- `unit-reclassing`: Supports adding reclassing events to a unit's progression path, resetting their level to 1, and applying the new class's growth rates and modifiers while retaining cumulative stats.

### Modified Capabilities
- `stat-progression-table`: The progression table must now accommodate level resets and non-linear class progression.
- `unit-level-caps`: Needs to correctly track and enforce class level caps across multiple reclassing cycles.

## Impact
- **Impacted Code**: `lib/stats.ts` (`generateProgressionArray`), `components/features/StatProgressionTable.tsx`, `components/features/PromotionOptionsDisplay.tsx`.
- **System**: The generation of stat progression arrays must be refactored to support infinite progression lengths by compounding sequential reclass loops, rather than being strictly bound to flat level limits.

## Specifications

stat-progression-table/spec.md
## MODIFIED Requirements

### Requirement: Promotion Mechanics Integration
The table SHALL account for unit promotions and reclass events. For standard games, it may increment indefinitely or within standard tiers. For games with reclassing (e.g., Awakening), it SHALL reset the displayed level counter to 1 while maintaining internal cumulative stat progression upon every promotion or reclass event.

#### Scenario: Unit crosses level 20 unpromoted without events
- **WHEN** a row is generated for a standard unit passing unpromoted level 20 without explicit promotion events
- **THEN** the row label indicates "Level 1 (Promoted)" instead of "Level 21".

#### Scenario: Unit has infinite sequential leveling
- **WHEN** a row is generated for a unit from a game that does not reset levels on promotion/reclass (e.g., infinite growth mechanics)
- **THEN** the row label continues sequentially (e.g., "Level 21") without appending "(Promoted)".

#### Scenario: Unit formally reclasses or promotes via event
- **WHEN** a reclass or promotion event is explicitly triggered at level X
- **THEN** the subsequent row immediately resets to "Level 1" under the new class's banner, regardless of if X was 10, 20, or another valid level.

unit-level-caps/spec.md
## MODIFIED Requirements

### Requirement: Infinite Leveling Flag
The system SHALL support dynamic progression bounds where the table visually generates up to a reasonable cap (e.g., 40 rows per class cycle), but does not strictly cut off cumulative growth. It SHALL respect internal class max levels (e.g., 20 or 30) for individual cycles, terminating table generation only when the final class cycle reaches its cap.

#### Scenario: Game with infinite leveling via reclassing
- **WHEN** a unit from a game with infinite reclassing (e.g., Awakening) is processed
- **THEN** the system enforces the current class's level cap (e.g., 20) to stop row generation for that specific sequence.
- **AND** if another reclass event is appended, row generation resumes from level 1 up to the new class's level cap.

### Requirement: Maximum Level Tracking
The system SHALL support tracking and utilizing a unit-specific and class-specific maximum level cap derived from game data to dictate when to halt stat row generation.

#### Scenario: Unit with standard level cap
- **WHEN** a standard unpromoted unit (e.g., Roy) is loaded
- **THEN** their `maxLevel` is implicitly or explicitly set to 20.
- **AND** row generation ceases after 20 unless a promotion event exists.

#### Scenario: Unit with extended level cap
- **WHEN** a special unit (e.g., FE10 unit with 3 tiers) is loaded
- **THEN** their cumulative `maxLevel` represents their absolute maximum achievable level across all tiers (e.g., 60).

#### Scenario: Special class with level 30 cap
- **WHEN** a unit enters a special class (e.g., Manakete, Taguel, Villager, Dancer)
- **THEN** the table generates rows up to level 30 for that class cycle instead of the standard 20.

unit-reclassing/spec.md
## ADDED Requirements

### Requirement: Unit Reclassing Event Support
The system SHALL allow users to add "reclass" progression events for units from supported games, effectively returning the unit's level to 1 while retaining accumulated stats.

#### Scenario: Unit reclasses into the same tier
- **WHEN** a unit adds a horizontal reclass event to their progression path
- **THEN** their internal level resets to 1.
- **AND** their accumulated stats carry over to the new class base calculating modifiers.
- **AND** the table rows continue generating from level 1.

#### Scenario: Unit reclasses into a higher tier
- **WHEN** an unpromoted unit reaches level 10 or higher and adds a vertical reclass event (e.g., Master Seal)
- **THEN** their internal level resets to 1, changing their tier to Promoted.
- **AND** the table rows continue generating from level 1.

#### Scenario: Enforcing minimum level for reclassing
- **WHEN** a user attempts to reclass an unpromoted unit before level 10
- **THEN** the system SHALL reject the event or display an invalid state, as Awakening unpromoted units must reach level 10 to reclass.



## Design

## Context
Fire Emblem Awakening introduces a reclassing system via Second Seals and Master Seals, allowing units to change to a different class of the same tier (horizontal) or a promoted tier (vertical). When a unit reclasses, their level resets to 1, but they retain their accumulated stats. This means they can theoretically level up infinitely, constrained only by their absolute maximum stat caps. The current `StatProgressionTable` only supports linear or branching standard promotions, and its underlying array generation in `lib/stats.ts` assumes a flat maximum level scale.

## Goals / Non-Goals

**Goals:**
- Update `generateProgressionArray` in `lib/stats.ts` to support level resets to 1 upon reclassing, while carrying over accumulated stats and applying the new class's modifiers/growths.
- Modify `StatProgressionTable.tsx` and `PromotionOptionsDisplay.tsx` to handle an unbounded array of sequential `PromotionEvent` objects, where events can include reclassing into the same tier or a different tier.
- Accurately apply class level caps (20 for most, 30 for special classes) within each reclassing cycle.

**Non-Goals:**
- Implementing the specific UI for selecting the Second/Master seals (we will just allow class selection).
- Support for games other than Awakening right now (though the logic should be flexible enough to extend to Fates later).

## Decisions

- **Event-Driven Progression Logic:** The `promotionEvents` array will act as a chronological log of class changes. Each entry in the array will represent an event (either a standard promotion or a reclass).
- **Infinite Row Generation:** `generateProgressionArray` will loop continuously, generating rows. When it hits a level where a `PromotionEvent` occurs, it processes the class change, resets the internal tracking level to 1, recalculates the base stat offsets based on the new class modifiers, and continues generating rows using the new class's growth rates until the next event or the class level cap is reached.
- **Max Level Handling:** To prevent infinite loops in the UI when no further events exist, the generation will stop when the unit hits their final class's level cap (e.g., 20 or 30) after the last logged event.

## Risks / Trade-offs

- **Risk**: Performance issues in React rendering if a user inputs an excessive number of consecutive reclass events (e.g., 50 reclasses).
  - **Mitigation**: Implement a sensible hard cap on the number of `PromotionEvent` entries a user can add (e.g., max 10 events) or virtualize the table rows if performance severely degrades.
- **Risk**: Stat calculation inaccuracies due to complex modifier swapping.
  - **Mitigation**: Ensure that when a class change occurs, the previous class's stat modifiers are subtracted, and the new class's modifiers are added. Base stats should represent the raw accumulated stat points independent of class.

## Current Task Context

## Current Task
- 1.1 In `lib/stats.ts` (`generateProgressionArray`, lines 311-333), ensure `reclassEvents` are properly typed and accepted as an argument alongside `promotionEvents`.
