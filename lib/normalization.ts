import { Unit, UnitStats } from '@/types/unit';

/**
 * Configuration for stat normalization across different Fire Emblem games
 */
export interface StatNormalizationConfig {
  // Standard stat key to possible variants mapping
  statVariants: Record<string, string[]>;
  // Default values for missing stats
  defaultValues: Record<string, number>;
  // Stat display names
  displayNames: Record<string, string>;
}

/**
 * Default normalization configuration covering most Fire Emblem games
 */
const DEFAULT_NORMALIZATION_CONFIG: StatNormalizationConfig = {
  statVariants: {
    'hp': ['hp', 'HP', 'hit_points', 'HitPoints'],
    'str': ['str', 'STR', 'strength', 'Strength', 'pow', 'POW', 'power', 'Power'],
    'mag': ['mag', 'MAG', 'magic', 'Magic'],
    'skl': ['skl', 'SKL', 'skill', 'Skill'],
    'dex': ['dex', 'DEX', 'dexterity', 'Dexterity'],
    'spd': ['spd', 'SPD', 'speed', 'Speed', 'agi', 'AGI', 'agility', 'Agility'],
    'lck': ['lck', 'LCK', 'luck', 'Luck', 'luc', 'LUC'],
    'def': ['def', 'DEF', 'defense', 'Defense'],
    'res': ['res', 'RES', 'resistance', 'Resistance', 'mag_def', 'mag_defense'],
    'con': ['con', 'CON', 'constitution', 'Constitution'],
    'bld': ['bld', 'BLD', 'build', 'Build'],
    'mov': ['mov', 'MOV', 'movement', 'Movement', 'move_range'],
    'cha': ['cha', 'CHA', 'charm', 'Charm']
  },
  defaultValues: {
    'hp': 0,
    'str': 0,
    'mag': 0,
    'skl': 0,
    'dex': 0,
    'spd': 0,
    'lck': 0,
    'def': 0,
    'res': 0,
    'con': 0,
    'bld': 0,
    'mov': 0,
    'cha': 0
  },
  displayNames: {
    'hp': 'HP',
    'str': 'Strength',
    'mag': 'Magic',
    'skl': 'Skill',
    'dex': 'Dexterity',
    'spd': 'Speed',
    'lck': 'Luck',
    'def': 'Defense',
    'res': 'Resistance',
    'con': 'Constitution',
    'bld': 'Build',
    'mov': 'Movement',
    'cha': 'Charm'
  }
};

/**
 * Normalize a stat key to its standard form
 * 
 * @param key - The stat key to normalize
 * @param config - Normalization configuration
 * @returns The normalized stat key
 */
export function normalizeStatKey(key: string, config: StatNormalizationConfig = DEFAULT_NORMALIZATION_CONFIG): string {
  // Convert to lowercase for case-insensitive matching
  const normalizedKey = key.toLowerCase();
  
  // Find the matching standard key
  for (const [standardKey, variants] of Object.entries(config.statVariants)) {
    if (variants.some(variant => variant.toLowerCase() === normalizedKey)) {
      return standardKey;
    }
  }
  
  // If no match found, return the original key
  return key;
}

/**
 * Normalize a complete UnitStats object
 * 
 * @param stats - The UnitStats object to normalize
 * @param config - Normalization configuration
 * @returns Normalized UnitStats object
 */
export function normalizeStats(stats: UnitStats, config: StatNormalizationConfig = DEFAULT_NORMALIZATION_CONFIG): UnitStats {
  const normalizedStats: UnitStats = {};
  
  // Process each stat in the input
  for (const [key, value] of Object.entries(stats)) {
    const normalizedKey = normalizeStatKey(key, config);
    // Only include recognized stats with valid values
    if (config.statVariants[normalizedKey] && value !== undefined && value !== null) {
      normalizedStats[normalizedKey] = Number(value);
    }
  }
  
  // Fill in missing stats with default values
  for (const [statKey, defaultValue] of Object.entries(config.defaultValues)) {
    if (normalizedStats[statKey] === undefined) {
      normalizedStats[statKey] = defaultValue;
    }
  }
  
  return normalizedStats;
}

/**
 * Normalize a complete Unit object
 * 
 * @param unit - The Unit object to normalize
 * @param config - Normalization configuration
 * @returns Normalized Unit object
 */
export function normalizeUnit(unit: Unit, config: StatNormalizationConfig = DEFAULT_NORMALIZATION_CONFIG): Unit {
  return {
    ...unit,
    stats: normalizeStats(unit.stats, config),
    growths: normalizeStats(unit.growths, config),
    maxStats: unit.maxStats ? normalizeStats(unit.maxStats, config) : undefined
  };
}

/**
 * Normalize an array of units
 * 
 * @param units - Array of units to normalize
 * @param config - Normalization configuration
 * @returns Array of normalized units
 */
export function normalizeUnits(units: Unit[], config: StatNormalizationConfig = DEFAULT_NORMALIZATION_CONFIG): Unit[] {
  return units.map(unit => normalizeUnit(unit, config));
}

/**
 * Get display name for a stat
 * 
 * @param statKey - The stat key
 * @param config - Normalization configuration
 * @returns Display name for the stat
 */
export function getStatDisplayName(statKey: string, config: StatNormalizationConfig = DEFAULT_NORMALIZATION_CONFIG): string {
  const normalizedKey = normalizeStatKey(statKey, config);
  return config.displayNames[normalizedKey] || normalizedKey.toUpperCase();
}

/**
 * Check if a stat is valid/recognized
 * 
 * @param statKey - The stat key to check
 * @param config - Normalization configuration
 * @returns True if the stat is recognized
 */
export function isValidStat(statKey: string, config: StatNormalizationConfig = DEFAULT_NORMALIZATION_CONFIG): boolean {
  const normalizedKey = normalizeStatKey(statKey, config);
  return normalizedKey in config.statVariants;
}

/**
 * Get all recognized stat keys
 * 
 * @param config - Normalization configuration
 * @returns Array of all recognized stat keys
 */
export function getAllStatKeys(config: StatNormalizationConfig = DEFAULT_NORMALIZATION_CONFIG): string[] {
  return Object.keys(config.statVariants);
}

/**
 * Create a custom normalization configuration
 * Useful for game-specific configurations
 * 
 * @param overrides - Configuration overrides
 * @returns New normalization configuration
 */
export function createNormalizationConfig(overrides: Partial<StatNormalizationConfig>): StatNormalizationConfig {
  return {
    statVariants: { ...DEFAULT_NORMALIZATION_CONFIG.statVariants, ...overrides.statVariants },
    defaultValues: { ...DEFAULT_NORMALIZATION_CONFIG.defaultValues, ...overrides.defaultValues },
    displayNames: { ...DEFAULT_NORMALIZATION_CONFIG.displayNames, ...overrides.displayNames }
  };
}