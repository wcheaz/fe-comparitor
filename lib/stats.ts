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
    classAbilities: string[];
  };
  cappedStats: Record<string, boolean>;
  isSkipped?: boolean;
}> {
  const progression: any[] = [];
  const actualStartLevel = startLevel || 1;
  const actualEndLevel = endLevel || 40;

  // Determine if this specific unit is a trainee
  const isTrainee = ['recruit', 'recruit_2', 'pupil', 'pupil_2', 'journeyman', 'journeyman_2'].includes(
    unit.class.toLowerCase().replace(/\s+/g, '_')
  );
  // Trainees start at internalLevel -9 (10 trainee levels: -9 to 0)
  const hasTraineeLevels = isTrainee;
  const traineeOffset = hasTraineeLevels ? -9 : 0;

  // Find the unit's class data
  let baseClass = classes?.find((cls: any) => cls.id === unit.class.toLowerCase().replace(/\s+/g, '_') && cls.game === unit.game);

  // Handle pre-promoted units matching
  if (unit.isPromoted && baseClass?.type === 'unpromoted') {
    baseClass = classes?.find((cls: any) =>
      baseClass?.promotesTo?.includes(cls.id) && cls.type === 'promoted' && cls.game === unit.game
    );
  }

  // Determine promotion levels and target classes for multi-tier promotions
  const promoLevels: number[] = [];
  const promoTargetIds: string[] = [];

  // Default to single promotion at level 20 if no promotion events
  if (promotionEvents.length === 0) {
    promoLevels.push(20);
    promoTargetIds.push(baseClass?.promotesTo?.[0] || '');
  } else {
    // Iterate through all promotion events
    promotionEvents.forEach((event, index) => {
      promoLevels.push(event.level);
      promoTargetIds.push(event.selectedClassId ||
        (index === 0 ? baseClass?.promotesTo?.[0] || '' : ''));
    });
  }

  // Pre-calculate promoted baseline stats for multi-tier promotions
  const promotedStats: UnitStats[] = [];
  const promotedClasses: any[] = [];

  if (!unit.isPromoted && baseClass?.promotesTo?.length > 0) {
    let currentStats: UnitStats = { ...unit.stats };

    // Process each promotion event sequentially
    for (let i = 0; i < promoLevels.length; i++) {
      const promoLevel = promoLevels[i];
      const promoTargetId = promoTargetIds[i];

      // Calculate stats right at promotion level
      const levelDiff = i === 0 ? Math.max(0, promoLevel - unit.level) : Math.max(0, promoLevel - 1); // Subsequent promotions grow from level 1
      const prePromoStats: UnitStats = {};

      // Growth to promotion
      const allStatKeys = Array.from(new Set([...Object.keys(currentStats), ...Object.keys(unit.growths)]));
      allStatKeys.forEach(statKey => {
        const growthRate = unit.growths[statKey] || 0;
        const baseStat = currentStats[statKey] || 0;
        const growthAmount = (growthRate * levelDiff) / 100;
        let calculatedStat = Math.round((baseStat + growthAmount) * 100) / 100;
        const prePromoCap = unit.maxStats?.[statKey] ?? baseClass?.maxStats?.[statKey] ?? (statKey === 'hp' ? 99 : 40);
        prePromoStats[statKey] = Math.min(calculatedStat, prePromoCap);
      });

      // Apply promotion bonuses
      let promotedClass = classes?.find((cls: any) => cls.id === promoTargetId && cls.game === unit.game);
      if (!promotedClass && i === 0 && baseClass.promotesTo?.[0]) {
        promotedClass = classes?.find((cls: any) => cls.id === baseClass.promotesTo[0] && cls.game === unit.game);
      }

      if (promotedClass) {
        const newPromotedStats: UnitStats = { ...prePromoStats };
        if (promotedClass.promotionBonus) {
          Object.entries(promotedClass.promotionBonus).forEach(([statKey, bonus]) => {
            if (bonus !== undefined) {
              newPromotedStats[statKey] = (newPromotedStats[statKey] || 0) + (bonus as number);
            }
          });
        }
        if (promotedClass.baseStats) {
          Object.entries(promotedClass.baseStats).forEach(([statKey, classBase]) => {
            if (newPromotedStats[statKey] !== undefined && classBase !== undefined) {
              newPromotedStats[statKey] = Math.max(newPromotedStats[statKey] || 0, classBase as number);
            }
          });
        }

        promotedStats.push(newPromotedStats);
        promotedClasses.push(promotedClass);
        currentStats = newPromotedStats; // Use these stats for the next promotion
      }
    }
  }

  for (let internalLevel = actualStartLevel; internalLevel <= actualEndLevel; internalLevel++) {
    let tier: number;
    let displayLevelNum: number;
    let displayLevel: string;
    let isPromotionLevel = false;
    let isSkipped = false;
    let currentClass = baseClass;
    let baseStatForCalc: UnitStats = unit.stats;
    let levelDiff = 0;
    let promotionInfo = undefined;

    // Handle trainee levels (negative levels and 0)
    if (internalLevel <= 0) {
      tier = 0; // Trainee tier
      displayLevelNum = internalLevel + 10; // -9 becomes 1, 0 becomes 10
      displayLevel = `Level ${displayLevelNum} (Trainee)`;
    } else {
      // Standard level calculation (1-based)
      tier = Math.floor((internalLevel - 1) / 20) + 1;
      displayLevelNum = ((internalLevel - 1) % 20) + 1;

      if (tier === 1) {
        displayLevel = `Level ${displayLevelNum}`;
      } else {
        displayLevel = `Level ${displayLevelNum} (Tier ${tier})`;
      }
    }

    // Handle tier-specific logic
    if (tier === 0) {
      if (!isTrainee || unit.isPromoted) {
        isSkipped = true; // Standard units do not have trainee rows
      } else {
        levelDiff = displayLevelNum - unit.level;
        if (displayLevelNum < unit.level || displayLevelNum > (promoLevels[0] || 10)) {
          isSkipped = true;
        }
      }
    } else if (tier === 1) {
      if (unit.isPromoted) {
        isSkipped = true;
      } else {
        if (isTrainee) {
          currentClass = promotedClasses[0] || baseClass;
          baseStatForCalc = promotedStats[0] || unit.stats;

          const targetPromoLevel = promoLevels[1] || 20;
          if (displayLevelNum < 1 || displayLevelNum > targetPromoLevel) {
            isSkipped = true;
          }

          levelDiff = displayLevelNum - 1;

          const currentPromoIndex = promoLevels.findIndex((lvl, i) => i === 1 && lvl === displayLevelNum);
          if (currentPromoIndex >= 0 && currentClass?.promotesTo?.length > 0) {
            isPromotionLevel = true;
            if (promotedClasses[currentPromoIndex]) {
              promotionInfo = {
                className: promotedClasses[currentPromoIndex].name,
                classAbilities: promotedClasses[currentPromoIndex].classAbilities || []
              };
            }
          }
        } else {
          currentClass = baseClass;
          baseStatForCalc = unit.stats;

          const targetPromoLevel = promoLevels[0] || 20;
          if (displayLevelNum < unit.level || displayLevelNum > targetPromoLevel) {
            isSkipped = true;
          }
          levelDiff = displayLevelNum - unit.level;

          const currentPromoIndex = promoLevels.findIndex((lvl, i) => i === 0 && lvl === displayLevelNum);
          if (currentPromoIndex >= 0 && baseClass?.promotesTo?.length > 0) {
            isPromotionLevel = true;
            if (promotedClasses[currentPromoIndex]) {
              promotionInfo = {
                className: promotedClasses[currentPromoIndex].name,
                classAbilities: promotedClasses[currentPromoIndex].classAbilities || []
              };
            }
          }
        }
      }
    } else if (tier === 2) {
      if (!unit.isPromoted) {
        if (isTrainee) {
          currentClass = promotedClasses[1] || promotedClasses[0] || baseClass;
          baseStatForCalc = promotedStats[1] || promotedStats[0] || unit.stats;
          levelDiff = displayLevelNum - 1;

          if (!promotedClasses[0]?.promotesTo?.length) {
            isSkipped = true;
          }
        } else {
          currentClass = promotedClasses[0] || baseClass;
          baseStatForCalc = promotedStats[0] || unit.stats;

          levelDiff = displayLevelNum - 1;

          if (!baseClass?.promotesTo?.length) {
            isSkipped = true;
          }
        }
      } else {
        // Pre-promoted unit starts in Tier 2
        currentClass = baseClass;
        baseStatForCalc = unit.stats;
        if (displayLevelNum < unit.level) {
          isSkipped = true;
        }
        levelDiff = displayLevelNum - unit.level;
      }
    } else {
      // Handle tier 3+ progression
      const hasInfiniteLeveling = unit.maxLevel === "infinite";

      if (hasInfiniteLeveling) {
        // For infinite leveling, allow continuous progression through all tiers
        // The stat calculation continues using the last known promoted class stats
        const lastPromotionIndex = Math.max(0, promotedClasses.length - 1);
        currentClass = promotedClasses[lastPromotionIndex] || baseClass;
        baseStatForCalc = promotedStats[lastPromotionIndex] || unit.stats;

        // Calculate level difference for continuous leveling
        // For tiers beyond 2, we accumulate the level differences from previous tiers
        const previousTiersLevels = (tier - 2) * 20; // 20 levels per previous tier
        levelDiff = displayLevelNum - 1 + previousTiersLevels;

        // For trainee units, add the trainee levels count to the level difference
        if (hasTraineeLevels) {
          const traineeLevelsGained = Math.max(0, (promoLevels[0] || 10) - unit.level);
          levelDiff += traineeLevelsGained;
        }

        // Don't skip tiers for infinite leveling
        isSkipped = false;
      } else {
        // Standard behavior: skip tiers 3+ if not infinite leveling
        isSkipped = true;
      }
    }

    // Check maxLevel constraints
    if (!isSkipped && unit.maxLevel !== undefined && unit.maxLevel !== "infinite") {
      const maxLevelCap = unit.maxLevel as number;

      // Calculate the effective level considering trainee offsets
      let effectiveLevel: number;
      if (tier === 0) {
        // For trainee levels, they don't count toward the max level cap
        effectiveLevel = 0;
      } else if (hasTraineeLevels) {
        // For units with trainee levels, account for the trainee progression
        const traineeLevelsCount = Math.abs(traineeOffset);
        effectiveLevel = internalLevel + traineeLevelsCount;
      } else {
        effectiveLevel = internalLevel;
      }

      // If the effective level exceeds maxLevel, skip this row
      if (effectiveLevel > maxLevelCap) {
        isSkipped = true;
      }
    }

    const levelStats: UnitStats = {};
    const cappedStats: Record<string, boolean> = {};

    if (!isSkipped) {
      const allStatsForLevel = Array.from(new Set([...Object.keys(unit.stats), ...Object.keys(unit.growths)]));
      allStatsForLevel.forEach(statKey => {
        const growthRate = unit.growths[statKey] || 0;
        const baseStatValue = baseStatForCalc[statKey] || 0;
        const growthAmount = (growthRate * levelDiff) / 100;
        let finalStat = Math.round((baseStatValue + growthAmount) * 100) / 100;

        const cap = unit.maxStats?.[statKey] ?? currentClass?.maxStats?.[statKey] ?? (statKey === 'hp' ? 99 : 40);
        if (finalStat >= cap) {
          finalStat = cap;
          cappedStats[statKey] = true;
        } else {
          cappedStats[statKey] = false;
        }
        levelStats[statKey] = Math.max(0, finalStat);
      });
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