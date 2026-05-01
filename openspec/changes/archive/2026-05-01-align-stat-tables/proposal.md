## Why

When two units are compared side-by-side, the stat progression table headers (and therefore all data rows) can appear at different vertical positions. This happens because the "Promotion & Reclass Levels" section above each data table has variable height — it is taller when a unit has more class-change events or when a unit can promote/reclass at all. Units that are already promoted (e.g., Perceval in FE6) or that have no reclass options render a shorter or absent section, pushing their data table up relative to the other card. This makes visual row-by-row comparison unreliable at a glance.

## What Changes

- The data table portion of each `StatProgressionTable` SHALL start at the same vertical position within its card, regardless of how much vertical space the promotion/reclass configuration section consumes above it.
- The promotion/reclass section remains independently scrollable and collapsible per unit — no cross-unit synchronization of promotion UI state is needed.
- This change only affects the vertical alignment of the table section; it does not change scrolling, highlighting, or stat computation.

## Capabilities

### New Capabilities
- `table-vertical-alignment`: Ensures the data table headers (and therefore rows) in both side-by-side stat progression cards always begin at the same Y position, so rows at the same level are visually aligned across the two cards.

### Modified Capabilities
- `individual-progression-tables`: The "Dual Independent Progression Table Layout" requirement currently states "do not share row state or alignment." This will be updated to allow vertical alignment of table start positions while preserving independent row state, stat keys, and promotion/reclass configuration.

## Implementation Approach

**Chosen strategy: JS measurement via `ResizeObserver` + shared React context**

The two side-by-side `StatProgressionTable` cards live in a `grid-cols-2` layout in `app/comparator/page.tsx`. Each card contains a variable-height promotion/reclass section followed by the data table. To align the tables:

1. **Introduce a shared alignment context** — a React context (or lifted state in `ComparatorPage`) that both cards subscribe to. It tracks the measured height of each card's promotion/reclass section and exposes the `max(Height_A, Height_B)` value.

2. **Measure with `ResizeObserver`** — each `StatProgressionTable` attaches a `ResizeObserver` to its promotion/reclass section's DOM node. When the section resizes (due to adding/removing class-change events, or initial render), it reports its height to the shared context.

3. **Apply `min-height` to the shorter section** — each promotion/reclass section uses the computed max height as its `min-height`, ensuring the data table below always starts at the same Y offset in both cards. When only one unit is selected (single-column layout), no alignment is needed and the `min-height` is `auto`.

**Alternatives considered and rejected:**

| Approach | Why rejected |
|---|---|
| CSS `min-height` with fixed value | Wastes space, fragile if content overflows the chosen value |
| Two-row page-level CSS Grid (split promo and table into separate grid rows) | Requires significant refactoring of `StatProgressionTable` into two sub-components and breaks the card-per-unit encapsulation |
| CSS Subgrid | Browser support still maturing; requires restructuring card internals into explicit grid rows |
| Absolute positioning of the promotion section | Creates overlap/scroll issues; fights the existing collapsible UI |

**Key constraints:**

- Desktop-only concern (`md:grid-cols-2`). The `min-height` override is a no-op on single-column mobile layout.
- The promotion/reclass section remains independently interactive — no cross-unit state synchronization.
- No new dependencies required; `ResizeObserver` is a native browser API.
- The table's own scroll container (`max-h-[70vh]`) and sticky headers are unaffected.

## Impact

- `components/features/StatProgressionTable.tsx`: Layout changes to decouple the promotion/reclass section height from the data table start position. The component may need a new prop or wrapper to participate in cross-card alignment.
- `app/comparator/page.tsx`: The grid container rendering both `Card` + `StatProgressionTable` pairs may need coordination logic or CSS changes to synchronize table start positions.
- `components/ui/card.tsx`: Minimal or no change expected — alignment is handled within `CardContent`.
- No API, data, or dependency changes.
- Desktop-only concern (`md:grid-cols-2`); single-column mobile layout is unaffected.
