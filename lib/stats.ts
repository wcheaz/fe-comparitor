import { Unit, UnitStats, PromotionEvent, ReclassEvent } from '@/types/unit';

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
 * Get the tier of a class based on class data
 * 
 * @param classId - The ID of the class to check
 * @param classes - Array of class data
 * @returns The tier number (0 for trainee, 1 for base, 2 for promoted, etc.)
 */
export function getClassTier(classId: string, classes: any[]): number {
  const normalizedClassId = classId.toLowerCase().replace(/\s+/g, '_');
  const classData = classes?.find((cls: any) => cls.id === normalizedClassId);
  
  if (!classData) {
    return 1; // Default to tier 1 if class not found
  }
  
  // Trainee classes (tier 0)
  const traineeClasses = ['recruit', 'recruit_2', 'pupil', 'pupil_2', 'journeyman', 'journeyman_2'];
  if (traineeClasses.includes(normalizedClassId)) {
    return 0;
  }
  
  // Promoted classes (tier 2+)
  if (classData.type === 'promoted') {
    return 2;
  }
  
  // Base classes (tier 1)
  return 1;
}

/**
 * Check if a reclass is valid based on tier rules and level requirements
 * 
 * @param currentClassId - The current class ID
 * @param targetClassId - The target class ID for reclass
 * @param currentLevel - The current level of the unit
 * @param classes - Array of class data
 * @returns True if the reclass is valid, false otherwise
 */
export function isValidReclass(
  currentClassId: string, 
  targetClassId: string, 
  currentLevel: number, 
  classes: any[]
): boolean {
  const currentTier = getClassTier(currentClassId, classes);
  const targetTier = getClassTier(targetClassId, classes);
  
  // Can reclass to the same class at max level (20 normally, 30 for special classes)
  if (currentClassId.toLowerCase().replace(/\s+/g, '_') === targetClassId.toLowerCase().replace(/\s+/g, '_')) {
    const specialClasses = ['taguel', 'manakete', 'villager', 'lodestar', 'bride', 'dancer', 'dread_fighter', 'conqueror'];
    const normalizedId = currentClassId.toLowerCase().replace(/\s+/g, '_');
    const requiredLevel = specialClasses.includes(normalizedId) ? 30 : 20;
    
    if (currentLevel >= requiredLevel) {
      return true;
    }
    return false;
  }
  
  // Rules for reclassing to Tier 1 classes
  if (targetTier === 1) {
    // Can reclass to Tier 1 if currently in Tier 2 (any level)
    if (currentTier === 2) {
      return true;
    }
    // Can reclass to Tier 1 if currently in Tier 1 and at least level 10
    if (currentTier === 1 && currentLevel >= 10) {
      return true;
    }
    return false;
  }
  
  // Rules for reclassing to Tier 2 classes
  if (targetTier === 2) {
    // Can reclass to Tier 2 if currently in Tier 2 and at least level 10
    if (currentTier === 2 && currentLevel >= 10) {
      return true;
    }
    return false;
  }
  
  // No reclassing to trainee classes (tier 0)
  return false;
}

/**
 * Get valid reclass options for a unit based on current class and level
 * 
 * @param unit - The unit to get reclass options for
 * @param classes - Array of class data
 * @returns Array of valid class IDs that the unit can reclass to
 */
export function getValidReclassOptions(unit: Unit, classes: any[], currentLevel?: number, currentClassId?: string): string[] {
  if (!unit.reclassOptions || unit.reclassOptions.length === 0) {
    return [];
  }
  
  const validOptions: string[] = [];
  const levelToCheck = Number(currentLevel ?? unit.level);
  const classToCheck = currentClassId ?? unit.class;
  
  // Get all expanded reclass class IDs (including promotesTo chains)
  const expandedClassIds = new Set<string>();
  
  for (const baseId of unit.reclassOptions) {
    expandedClassIds.add(baseId);
    
    // Find this base class and add its promotions
    const baseClass = classes.find((c: any) => c.id === baseId && c.game === unit.game);
    if (baseClass && baseClass.promotesTo) {
      for (const promoId of baseClass.promotesTo) {
        expandedClassIds.add(promoId);
      }
    }
  }
  
  // Special case for Tactician -> Grandmaster
  if (unit.reclassOptions.includes('tactician')) {
    expandedClassIds.add('grandmaster');
  }
  // Special case for Villager
  if (unit.reclassOptions.includes('villager')) {
    expandedClassIds.add('fighter');
    expandedClassIds.add('mercenary');
  }

  for (const rawTargetClassId of Array.from(expandedClassIds)) {
    const targetClassId = rawTargetClassId.toLowerCase().replace(/\s+/g, '_');
    if (isValidReclass(classToCheck, targetClassId, levelToCheck, classes)) {
      validOptions.push(targetClassId);
    }
  }
  
  return validOptions;
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
  promotionEvents: PromotionEvent[] = [],
  reclassEvents: ReclassEvent[] = []
): Array<{
  stats: UnitStats;
  displayLevel: string;
  internalLevel: number;
  isPromotionLevel: boolean;
  isReclassLevel: boolean;
  promotionInfo?: {
    className: string;
    classAbilities: string[];
  };
  reclassInfo?: {
    className: string;
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

// Combine and sort all events (promotions and reclasses) chronologically by order
  const allEvents: Array<{type: 'promotion' | 'reclass', level: number, selectedClassId: string, order: number}> = [];
  
  // Add promotion events
  promotionEvents.forEach((event, index) => {
    allEvents.push({
      type: 'promotion',
      level: event.level,
      selectedClassId: event.selectedClassId,
      order: event.order ?? (index * 2) // Fallback for legacy events
    });
  });
  
  // Add reclass events
  reclassEvents.forEach((event, index) => {
    allEvents.push({
      type: 'reclass',
      level: event.level,
      selectedClassId: event.selectedClassId,
      order: event.order ?? (index * 2 + 1) // Fallback for legacy events
    });
  });

  // If no explicit events of any kind exist but the base class can promote,
  // inject a default promotion at level 20 (or 10 for trainees)
  if (promotionEvents.length === 0 && reclassEvents.length === 0 && baseClass?.promotesTo && baseClass.promotesTo.length > 0) {
    allEvents.push({
      type: 'promotion',
      level: isTrainee ? 10 : 20,
      selectedClassId: baseClass.promotesTo[0],
      order: -1 // Default events sort first
    });
  }
  
  // Sort all events by order (sequential insertion order)
  allEvents.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    // At the same order/level, process reclass events before promotion events
    return a.type === 'reclass' ? -1 : 1;
  });

  // State initialization
  let currentClass = baseClass;
  let displayLevelNum = unit.level;
  let tier = unit.isPromoted ? 2 : (isTrainee ? 0 : 1);
  let baseStatsForCurrentClass = { ...unit.stats };
  let startLevelForCurrentClass = displayLevelNum;
  
  let nextEventIndex = 0;
  
  // Helper to calculate exact stat accumulation up to the current level within a given class
  const calculateCurrentStats = (currLevel: number, cls: any, baseStats: UnitStats) => {
    const levelDiff = Math.max(0, currLevel - startLevelForCurrentClass);
    const result: UnitStats = {};
    const allStatKeys = Array.from(new Set([...Object.keys(unit.stats), ...Object.keys(unit.growths)]));
    
    allStatKeys.forEach(statKey => {
      let growthRate = unit.growths[statKey] || 0;
      if (unit.game === "Awakening" && cls?.growths) {
        growthRate += (cls.growths[statKey] || 0);
      }
      
      const baseStatValue = baseStats[statKey] || 0;
      const growthAmount = (growthRate * levelDiff) / 100;
      let finalStat = Math.round((baseStatValue + growthAmount) * 100) / 100;
      
      const currentCap = unit.maxStats?.[statKey] ?? cls?.maxStats?.[statKey] ?? (statKey === 'hp' ? 99 : 40);
      finalStat = Math.min(finalStat, currentCap);
      finalStat = Math.max(0, finalStat);
      
      result[statKey] = finalStat;
    });
    return result;
  };
  
  const applyAwakeningModifiers = (stats: UnitStats, cls: any) => {
    if (unit.game !== "Awakening" || !cls?.statModifiers) return stats;
    const modified = { ...stats };
    Object.entries(cls.statModifiers).forEach(([statKey, modifier]) => {
      if (modifier !== undefined) {
        modified[statKey] = (modified[statKey] || 0) + (modifier as number);
      }
    });
    return modified;
  };

  const getLevelCap = (cls: any) => {
    if (!cls) return 20;
    if (unit.game === "Awakening") {
      const specialClassIds = ["taguel", "manakete", "villager", "dancer", "lodestar", "bride", "dread_fighter", "conqueror"];
      if (specialClassIds.includes(cls.id)) return 30;
    }
    return 20;
  };

  let pendingReclassFlag = false;
  let reclassTargetName = "";
  const allRows: any[] = [];
  const safeClasses = classes || [];

  for (let internalLevel = actualStartLevel; internalLevel <= actualEndLevel; internalLevel++) {
    let isSkipped = false;
    let isPromotionLevel = false;
    let promotionInfo: any = undefined;
    let isReclassLevel = pendingReclassFlag; // Carried over from the end of the last frame
    let reclassInfo: any = pendingReclassFlag ? { className: reclassTargetName } : undefined;

    pendingReclassFlag = false; // reset for next frame

    // Handle "padding" rows for characters that join late so the UI table lines up correctly
    if (internalLevel < unit.level && !unit.isPromoted && !isTrainee) {
       allRows.push({
         internalLevel,
         displayLevel: `Level ${internalLevel}`,
         tier: tier,
         class: currentClass?.name || 'Unknown',
         stats: applyAwakeningModifiers(baseStatsForCurrentClass, currentClass),
         cappedStats: {},
         isPromotionLevel: false,
         isSkipped: true
       });
       continue;
    }

    // Peek ahead to see if the CURRENT row is the level where the user makes a class change
    // We attach the ✨ Promotion icon to this row so the user knows this is where the action happens
    if (nextEventIndex < allEvents.length && allEvents[nextEventIndex].level === displayLevelNum) {
       const nextEvent = allEvents[nextEventIndex];
       const targetClass = safeClasses.find(c => c.id === nextEvent.selectedClassId && c.game === unit.game);
       if (targetClass && nextEvent.type === 'promotion') {
         isPromotionLevel = true;
         promotionInfo = {
           className: targetClass.name,
           classAbilities: targetClass.classAbilities || []
         };
       }
    }

    const currentTrueStats = calculateCurrentStats(displayLevelNum, currentClass, baseStatsForCurrentClass);
    const displayStats = applyAwakeningModifiers(currentTrueStats, currentClass);
    
    // Check caps
    const cappedStats: Record<string, boolean> = {};
    const allStatKeys = Array.from(new Set([...Object.keys(unit.stats), ...Object.keys(unit.growths)]));
    allStatKeys.forEach(statKey => {
      const currentCap = unit.maxStats?.[statKey] ?? currentClass?.maxStats?.[statKey] ?? (statKey === 'hp' ? 99 : 40);
      let unmodifiedStat = currentTrueStats[statKey] || 0;
      if (unmodifiedStat >= currentCap) {
        cappedStats[statKey] = true;
      }
    });

    let displayLevelStr = `Level ${displayLevelNum}`;
    if (isReclassLevel) {
      displayLevelStr += ` (Reclassed to ${currentClass?.name || 'Unknown'})`;
    } else if (tier === 0) {
      displayLevelStr += ` (Trainee)`;
    } else if (tier > 1) {
      displayLevelStr += ` (Tier ${tier})`;
    }

    // Skip logic bounds checking
    const cap = getLevelCap(currentClass);
    const hasMoreEvents = nextEventIndex < allEvents.length;
    
    if (displayLevelNum > cap && !hasMoreEvents && unit.maxLevel !== "infinite") {
      break; // The unit has reached their final natural level cap; stop generating rows.
    }

    allRows.push({
      internalLevel,
      displayLevel: displayLevelStr,
      tier,
      class: currentClass?.name || 'Unknown',
      stats: displayStats,
      cappedStats,
      isPromotionLevel,
      promotionInfo,
      isReclassLevel,
      reclassInfo,
      isSkipped: false
    });

    // After rendering the row, we apply any class change triggers sequentially
    // So the NEXT row is Level 1 of the new class
    let didChangeClass = false;
    while (nextEventIndex < allEvents.length) {
      const nextEvent = allEvents[nextEventIndex];
      // Note: Because we clamped displayLevelNum to cap above, this relies on the precise equality match
      if (nextEvent.level === displayLevelNum) {
        const targetClass = safeClasses.find(c => c.id === nextEvent.selectedClassId && c.game === unit.game);
        if (!targetClass) {
          nextEventIndex++;
          continue;
        }
        
        let isEventValid = true;
        if (nextEvent.type === 'reclass') {
          isEventValid = isValidReclass(currentClass?.id || unit.class, targetClass.id, displayLevelNum, safeClasses);
        } else if (nextEvent.type === 'promotion') {
          isEventValid = currentClass?.promotesTo?.includes(targetClass.id) ?? false;
        }

        if (!isEventValid) {
          nextEventIndex++;
          continue;
        }

        // Finalize base stats for transitioning
        const finalizedStats = calculateCurrentStats(displayLevelNum, currentClass, baseStatsForCurrentClass);
        
        if (nextEvent.type === 'promotion') {
          const newStats = { ...finalizedStats };
          if (targetClass.promotionBonus) {
            Object.entries(targetClass.promotionBonus).forEach(([k, v]) => {
              newStats[k] = (newStats[k] || 0) + (v as number);
            });
          }
          if (targetClass.baseStats) {
            Object.entries(targetClass.baseStats).forEach(([k, v]) => {
              newStats[k] = Math.max(newStats[k] || 0, v as number);
            });
          }
          currentClass = targetClass;
          tier = isTrainee && tier === 0 ? 1 : 2; 
          baseStatsForCurrentClass = newStats;
        } else if (nextEvent.type === 'reclass') {
          currentClass = targetClass;
          tier = typeof targetClass.tier === 'number' ? targetClass.tier : (typeof targetClass.tier === 'string' ? parseInt(targetClass.tier) : 1);
          baseStatsForCurrentClass = { ...finalizedStats };
          pendingReclassFlag = true;
          reclassTargetName = targetClass.name;
        }
        
        displayLevelNum = 0; // will become 1 right below
        startLevelForCurrentClass = 1;
        didChangeClass = true;
        nextEventIndex++;
      } else {
        break;
      }
    }

    // Advance chronological state to next frame
    if (!didChangeClass) {
        displayLevelNum++;
    } else {
        displayLevelNum = 1;
    }
  }

  return allRows;
}