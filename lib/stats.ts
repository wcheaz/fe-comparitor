import { Unit, UnitStats } from '@/types/unit';

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