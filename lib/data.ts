import { Unit, UnitStats } from '@/types/unit';
import { normalizeUnit } from './normalization';

// Cache for loaded units to avoid repeated file reading
let unitsCache: Unit[] | null = null;

export async function getAllUnits(): Promise<Unit[]> {
  if (unitsCache) {
    return unitsCache;
  }

  try {
    // Import all JSON data files
    const [bindingBladeUnits, threeHousesUnits, engageUnits] = await Promise.all([
      import('@/data/binding_blade_units.json').then(m => m.default),
      import('@/data/three_houses_units.json').then(m => m.default),
      import('@/data/engage_units.json').then(m => m.default)
    ]);

    // Transform and merge all units
    const allUnits = [
      ...bindingBladeUnits.map(transformJsonToUnit),
      ...threeHousesUnits.map(transformJsonToUnit),
      ...engageUnits.map(transformJsonToUnit)
    ];

    unitsCache = allUnits;
    return allUnits;
  } catch (error) {
    console.error('Error loading units data:', error);
    throw new Error('Failed to load units data');
  }
}

export async function getUnitsByGame(game: string): Promise<Unit[]> {
  try {
    const allUnits = await getAllUnits();
    return allUnits.filter((unit: Unit) => unit.game === game);
  } catch (error) {
    console.error(`Error loading units for game ${game}:`, error);
    throw new Error(`Failed to load units for game ${game}`);
  }
}

export async function getUnitById(id: string): Promise<Unit | null> {
  try {
    const allUnits = await getAllUnits();
    return allUnits.find((unit: Unit) => unit.id === id) ?? null;
  } catch (error) {
    console.error(`Error loading unit with id ${id}:`, error);
    throw new Error(`Failed to load unit with id ${id}`);
  }
}

// Helper function to transform raw JSON data to Unit interface
function transformJsonToUnit(rawUnit: any): Unit {
  // Transform individual stat properties to UnitStats object
  const stats: UnitStats = {};
  const growths: UnitStats = {};

  // Extract base stats - handle both direct properties and nested stats object
  const statKeys = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'con', 'bld', 'mov', 'cha'];
  statKeys.forEach(key => {
    if (rawUnit[key] !== undefined) {
      stats[key] = rawUnit[key];
    } else if (rawUnit.stats && rawUnit.stats[key] !== undefined) {
      stats[key] = rawUnit.stats[key];
    }
  });

  // Extract growth rates - handle both nested growths object and direct growth properties
  if (rawUnit.growths) {
    Object.keys(rawUnit.growths).forEach(key => {
      if (rawUnit.growths[key] !== undefined) {
        growths[key] = rawUnit.growths[key];
      }
    });
  } else {
    // Look for direct growth properties like str_growth, mag_growth, etc.
    statKeys.forEach(key => {
      const growthKey = `${key}_growth`;
      if (rawUnit[growthKey] !== undefined) {
        growths[key] = rawUnit[growthKey];
      }
    });
  }

  // Create base unit object
  const unit: Unit = {
    id: rawUnit.id,
    name: rawUnit.name,
    game: rawUnit.game,
    class: rawUnit.class,
    joinChapter: rawUnit.joinChapter || '',
    level: rawUnit.level || 1,
    stats,
    growths,
    skills: rawUnit.skills || [],
    supports: rawUnit.supports || [],
    reclassOptions: rawUnit.reclassOptions || [],
    promotions: rawUnit.promotions || [],
    affinity: rawUnit.affinity,
    maxStats: rawUnit.maxStats
  };

  // Apply normalization to standardize stat keys and handle missing stats
  return normalizeUnit(unit);
}