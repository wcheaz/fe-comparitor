# Capability: Unit Reclassing

## Overview
Reclassing allows units to horizontally and vertically change classes independently of the standard "level 10 -> promotion -> level 1" promotion system. Character progression in games like Awakening supports branching into entirely different class trees via items like the Second Seal.

## Requirements
- Introduce a mechanism to define `reclassOptions` for any given unit, similar to the existing `promotions` array.
- Units can reclass to Tier 1 classes under the following conditions:
  - If they are currently in a Tier 2 class (any level).
  - If they are currently in a Tier 1 class and are at least Level 10.
- Units can reclass to Tier 2 classes under the following conditions:
  - If they are currently in a Tier 2 class and are at least Level 10.
- Level resets to 1 upon reclassing, and accumulated stats/growths persist. Max stats are bound by the new class modifiers.

## Constraints
- The reclass logic must be flexible enough to allow characters from Awakening (or Fates in the future) to easily fetch their reclass sets without hardcoding individual classes inside the core logic components.
- Standard "promotion" rules must still apply correctly to games that do not support reclassing (like GBA Fire Emblem).
- Must prevent Infinite loops in the UI when offering reclassing paths.
