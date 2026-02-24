import { Unit, UnitStats, PromotionEvent } from '@/types/unit';

/**
 * Calculate average stats for a unit at a target level based on growth rates
 * Formula: Base + (Growth * (TargetLevel - BaseLevel) / 100)
 * 
 * @param unit - The unit to calculate stats for
 * @param targetLevel - The target level to calculate stats at
 * @returns UnitStats object with calculated average stats
 */
export function calculateAverageStatsAtLevel(unit: Unit, level: number): UnitStats {
  return calculateAverageStats(unit, level);
}

/**
 * Calculate average stats for a unit at a target level based on growth rates
 * Formula: Base + (Growth * (TargetLevel - BaseLevel) / 100)
 * 
 * @param unit - The unit to calculate stats for
 * @param targetLevel - The target level to calculate stats at
 * @returns UnitStats object with calculated average stats
 */
export function calculateAverageStats(unit: Unit, targetLevel: number): UnitStats {
  const averageStats: UnitStats = {};
  const levelDiff = targetLevel - unit.level;

  // Get all stat keys from the unit's stats and growths
  const allStatKeys = new Set([
    ...Object.keys(unit.stats),
    ...Object.keys(unit.growths)
  ]);

  for (const statKey of allStatKeys) {
    const baseStat = unit.stats[statKey] || 0;
    const growthRate = unit.growths[statKey] || 0;

    // Calculate average stat using growth formula
    let calculatedStat = baseStat + (growthRate * levelDiff) / 100;

    // Apply stat caps if maxStats are available
    if (unit.maxStats && unit.maxStats[statKey] !== undefined) {
      const maxStat = unit.maxStats[statKey] || 0;
      calculatedStat = Math.min(calculatedStat, maxStat);
    }

    // Ensure stats don't go below 0 (handles negative level differences)
    calculatedStat = Math.max(0, calculatedStat);

    // Round to 2 decimal places for precision
    averageStats[statKey] = Math.round(calculatedStat * 100) / 100;
  }

  return averageStats;
}

/**
 * Compare stats between two units at a specific level
 * 
 * @param unitA - First unit to compare
 * @param unitB - Second unit to compare
 * @param level - Level to compare stats at
 * @returns Object containing stat differences (unitA - unitB)
 */
export function compareUnits(unitA: Unit, unitB: Unit, level: number): UnitStats {
  const statsA = calculateAverageStats(unitA, level);
  const statsB = calculateAverageStats(unitB, level);

  const differences: UnitStats = {};

  // Get all unique stat keys from both units
  const allStatKeys = new Set([
    ...Object.keys(statsA),
    ...Object.keys(statsB)
  ]);

  for (const statKey of allStatKeys) {
    const statA = statsA[statKey] || 0;
    const statB = statsB[statKey] || 0;
    differences[statKey] = Math.round((statA - statB) * 100) / 100;
  }

  return differences;
}

/**
 * Calculate stat growth summary for a unit
 * 
 * @param unit - The unit to analyze
 * @param startLevel - Starting level (defaults to unit's base level)
 * @param endLevel - Ending level
 * @returns Object containing growth summary
 */
export function getGrowthSummary(
  unit: Unit,
  startLevel?: number,
  endLevel?: number
): {
  statGains: UnitStats;
  totalGains: number;
  averageGrowth: number;
} {
  const actualStartLevel = startLevel || unit.level;
  const actualEndLevel = endLevel || actualStartLevel + 20; // Default 20 levels
  const levelDiff = actualEndLevel - actualStartLevel;

  const statGains: UnitStats = {};
  let totalPossibleGains = 0;
  let statCount = 0;

  // Calculate gains for each growth stat
  for (const [statKey, growthRate] of Object.entries(unit.growths)) {
    if (growthRate !== undefined) {
      const gains = (growthRate * levelDiff) / 100;
      statGains[statKey] = Math.round(gains * 100) / 100;
      totalPossibleGains += gains;
      statCount++;
    }
  }

  const averageGrowth = statCount > 0 ? totalPossibleGains / statCount : 0;

  return {
    statGains,
    totalGains: Math.round(totalPossibleGains * 100) / 100,
    averageGrowth: Math.round(averageGrowth * 100) / 100
  };
}

/**
 * Get effective stat range for a unit (min to max possible at a level)
 * 
 * @param unit - The unit to analyze
 * @param targetLevel - Target level
 * @returns Object containing min and max possible stats
 */
export function getStatRange(unit: Unit, targetLevel: number): {
  minStats: UnitStats;
  maxStats: UnitStats;
} {
  const minStats: UnitStats = {};
  const maxStats: UnitStats = {};
  const levelDiff = targetLevel - unit.level;

  for (const [statKey, baseStat] of Object.entries(unit.stats)) {
    if (baseStat === undefined) continue;

    const growthRate = unit.growths[statKey] || 0;

    // Min growth (typically 0% growth rate)
    const minPossible = baseStat;

    // Max growth (typically 100% growth rate for calculation purposes)
    let maxPossible = baseStat + (100 * levelDiff) / 100;

    // Apply stat caps if available
    if (unit.maxStats && unit.maxStats[statKey] !== undefined) {
      maxPossible = Math.min(maxPossible, unit.maxStats[statKey] || 0);
    }

    minStats[statKey] = minPossible;
    maxStats[statKey] = Math.round(maxPossible * 100) / 100;
  }

  return { minStats, maxStats };
}

/**
 * Calculate the maximum potential level across all compared units
 * 
 * @param units - Array of units to compare
 * @returns The maximum level among all units
 */
export function getMaxLevel(units: Unit[]): number {
  if (units.length === 0) return 0;

  return Math.max(...units.map(unit => unit.level));
}

/**
 * Calculate the minimum base level across all compared units
 * 
 * @param units - Array of units to compare
 * @returns The minimum level among all units
 */
export function getMinLevel(units: Unit[]): number {
  if (units.length === 0) return 0;

  return Math.min(...units.map(unit => unit.level));
}

/**
 * Generate a progression array for a unit from a starting level to an ending level
 * Handles multi-tier promotion mechanics with branching paths
 * 
 * @param unit - The unit to generate progression for
 * @param startLevel - The starting level (defaults to unit's base level)
 * @param endLevel - The ending level
 * @param classes - Optional array of class data for promotion mechanics
 * @param promotionEvents - Array of promotion events defining the promotion path
 * @returns Array of progression data, including stats and display level info
 */
export function generateProgressionArray(
  unit: Unit,
  startLevel?: number,
  endLevel?: number,
  classes?: any[],
  promotionEvents: PromotionEvent[] = []
): Array<{
  stats: UnitStats;
  displayLevel: string;
  internalLevel: number;
  isPromotionLevel: boolean;
  promotionInfo?: {
    className: string;
    hiddenModifiers: string[];
  };
  cappedStats: Record<string, boolean>;
  isSkipped?: boolean;
}> {
  const actualStartLevel = startLevel || unit.level;
  const actualEndLevel = endLevel || actualStartLevel + 20; // Default 20 levels

  const progression: Array<{
    stats: UnitStats;
    displayLevel: string;
    internalLevel: number;
    isPromotionLevel: boolean;
    promotionInfo?: {
      className: string;
      hiddenModifiers: string[];
    };
    cappedStats: Record<string, boolean>;
    isSkipped?: boolean;
  }> = [];

  let currentStats = { ...unit.stats };
  let promotedAtInternalLevel: number | null = null;

  // Find the unit's class data if classes are provided
  let currentClass = classes?.find((cls: any) => cls.id === unit.class.toLowerCase().replace(/\s+/g, '_'));

  // If the unit is already promoted, find its promoted class
  if (unit.isPromoted && currentClass?.type === 'unpromoted') {
    // Try to find the promoted version
    currentClass = classes?.find((cls: any) =>
      currentClass?.promotesTo?.includes(cls.id) && cls.type === 'promoted'
    );
  }

  // Helper function to find promotion event for a given level
  const findPromotionEvent = (level: number): PromotionEvent | undefined => {
    return promotionEvents.find(event => event.level === level);
  };

  // Helper function to get promotion level (fallback to 20 for backward compatibility)
  const getPromotionLevel = (level: number): number => {
    const promotionEvent = findPromotionEvent(level);
    return promotionEvent?.level || 20; // Default to 20 if no promotion event found
  };

  // Helper function to calculate display level and tier for multi-tier promotions
  const getDisplayInfo = (level: number) => {
    // Find all promotion events that have occurred before this level
    const pastPromotions = promotionEvents.filter(event => event.level < level);
    const tier = pastPromotions.length + 1; // +1 for starting tier
    
    // Find the most recent promotion before this level
    const lastPromotion = pastPromotions[pastPromotions.length - 1];
    const segmentStartLevel = lastPromotion ? lastPromotion.level : unit.level;
    const displayLevelNum = level - segmentStartLevel;
    
    return {
      tier,
      displayLevel: displayLevelNum,
      segmentStartLevel
    };
  };

  for (let internalLevel = actualStartLevel; internalLevel <= actualEndLevel; internalLevel++) {
    let displayLevel: string;
    let isPromotionLevel = false;
    let isSkipped = false;

    // Calculate display level and tier for multi-tier promotions
    const displayInfo = getDisplayInfo(internalLevel);
    const currentPromotionLevel = getPromotionLevel(internalLevel);
    
    if (displayInfo.tier === 1) {
      displayLevel = `Level ${displayInfo.displayLevel}`;
      // If the unit promotes early, levels after promotion don't exist for them in this tier
      if (!unit.isPromoted && internalLevel > currentPromotionLevel) {
        isSkipped = true;
      }
      if (internalLevel === currentPromotionLevel && !unit.isPromoted) {
        isPromotionLevel = true;
      }
    } else {
      displayLevel = `Level ${displayInfo.displayLevel} (Tier ${displayInfo.tier})`;
    }

    // Check if unit should promote at this internal level based on promotion events
    const currentPromotionEvent = findPromotionEvent(internalLevel);
    // Allow promotion if: there's a promotion event at this level AND the unit isn't already promoted at this exact level
    const shouldPromote = currentPromotionEvent && 
                         currentClass?.promotesTo?.length > 0 && 
                         (promotedAtInternalLevel === null || internalLevel > promotedAtInternalLevel);
    
    if (shouldPromote) {
      // Calculate stats at promotion level first (pre-promotion)
      const prePromotionStats: UnitStats = {};
      const allStatKeys = Array.from(new Set([...Object.keys(unit.stats), ...Object.keys(unit.growths)]));
      allStatKeys.forEach(statKey => {
        const growthRate = unit.growths[statKey] || 0;
        const baseStat = unit.stats[statKey] || 0;
        const currentPromotionLevel = getPromotionLevel(internalLevel);
        const levelDiff = currentPromotionLevel - unit.level;
        const growthAmount = (growthRate * levelDiff) / 100;
        let calculatedStat = Math.round((baseStat + growthAmount) * 100) / 100;

        const prePromoCap = unit.maxStats?.[statKey] ?? currentClass?.maxStats?.[statKey] ?? (statKey === 'hp' ? 99 : 40);
        prePromotionStats[statKey] = Math.min(calculatedStat, prePromoCap);
      });

      // Find the promoted class based on the promotion event
      let promotedClass = classes?.find((cls: any) => cls.id === currentPromotionEvent.selectedClassId);
      
      // Validate that the selected class is a valid promotion option
      if (!promotedClass || !currentClass?.promotesTo?.includes(currentPromotionEvent.selectedClassId)) {
        // Fallback to the first promotion option if the selected one is invalid
        const fallbackClassId = currentClass?.promotesTo?.[0];
        if (fallbackClassId) {
          promotedClass = classes?.find((cls: any) => cls.id === fallbackClassId);
        }
      }

      if (promotedClass) {
        // Start with pre-promotion stats
        currentStats = { ...prePromotionStats };

        // Apply promotion bonuses from the promoted class
        if (promotedClass.promotionBonus) {
          Object.entries(promotedClass.promotionBonus).forEach(([statKey, bonus]) => {
            if (bonus !== undefined) {
              currentStats[statKey] = (currentStats[statKey] || 0) + (bonus as number);
            }
          });
        }

        // Floor stats to class base stats of the promoted class
        if (promotedClass.baseStats) {
          Object.entries(promotedClass.baseStats).forEach(([statKey, classBase]) => {
            if (currentStats[statKey] !== undefined && classBase !== undefined) {
              currentStats[statKey] = Math.max(currentStats[statKey] || 0, classBase as number);
            }
          });
        }

        promotedAtInternalLevel = internalLevel;
        currentClass = promotedClass;
      }
    }

    // Calculate stats for this level
    const levelStats: UnitStats = { ...currentStats };
    const cappedStats: Record<string, boolean> = {};
    let promotionInfo: { className: string; hiddenModifiers: string[] } | undefined;

    // Apply growth rates
    // Apply growth rates
    const allStatsForLevel = Array.from(new Set([...Object.keys(unit.stats), ...Object.keys(unit.growths)]));
    allStatsForLevel.forEach(statKey => {
      const growthRate = unit.growths[statKey] || 0;
      let finalStat: number;

      const displayInfo = getDisplayInfo(internalLevel);
      let levelBase: number;
      let baseStatValue: number;

      if (displayInfo.tier === 1) {
        // First tier: use unit's base stats and level
        levelBase = unit.level;
        baseStatValue = unit.stats[statKey] || 0;
      } else {
        // Subsequent tiers: start from promoted stats and promotion level
        levelBase = displayInfo.segmentStartLevel;
        baseStatValue = currentStats[statKey] || 0;
      }

      const levelDiff = internalLevel - levelBase;
      const growthAmount = (growthRate * levelDiff) / 100;
      finalStat = Math.round((baseStatValue + growthAmount) * 100) / 100;

      const cap = unit.maxStats?.[statKey] ?? currentClass?.maxStats?.[statKey] ?? (statKey === 'hp' ? 99 : 40);
      if (finalStat >= cap) {
        finalStat = cap;
        cappedStats[statKey] = true;
      } else {
        cappedStats[statKey] = false;
      }

      levelStats[statKey] = finalStat;
    });

    // Add promotion info if this is a promotion level
    if (isPromotionLevel && currentClass) {
      let classToDisplay = currentClass;
      const currentPromotionLevel = getPromotionLevel(internalLevel);
      if (internalLevel === currentPromotionLevel && !unit.isPromoted && currentClass.promotesTo?.length > 0) {
        const promotedClass = classes?.find((cls: any) => cls.id === currentClass.promotesTo[0]);
        if (promotedClass) classToDisplay = promotedClass;
      }

      promotionInfo = {
        className: classToDisplay.name,
        hiddenModifiers: classToDisplay.hiddenModifiers || []
      };
    }

    progression.push({
      stats: levelStats,
      displayLevel,
      internalLevel,
      isPromotionLevel,
      promotionInfo,
      cappedStats,
      isSkipped
    });
  }

  return progression;
}