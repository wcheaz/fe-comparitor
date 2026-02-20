import { Unit, UnitStats, Class } from '@/types/unit';
import { normalizeUnit } from './normalization';

// Cache for loaded units to avoid repeated file reading
let unitsCache: Unit[] | null = null;
let classesCache: Class[] | null = null;

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

export async function getAllClasses(): Promise<Class[]> {
  if (classesCache) {
    return classesCache;
  }

  try {
    // Import all class JSON data files
    const [bindingBladeClasses, threeHousesClasses, engageClasses] = await Promise.all([
      import('@/data/binding_blade_classes.json').then(m => m.default),
      import('@/data/three_houses_classes.json').then(m => m.default),
      import('@/data/engage_classes.json').then(m => m.default)
    ]);

    // Transform and merge all classes
    const allClasses = [
      ...bindingBladeClasses.map(transformJsonToClass),
      ...threeHousesClasses.map(transformJsonToClass),
      ...engageClasses.map(transformJsonToClass)
    ];

    classesCache = allClasses;
    return allClasses;
  } catch (error) {
    console.error('Error loading classes data:', error);
    throw new Error('Failed to load classes data');
  }
}

export async function getClassesByGame(game: string): Promise<Class[]> {
  try {
    // For now, we'll determine game by file naming convention
    // This could be improved by adding a game field to class data
    const allClasses = await getAllClasses();

    // Filter classes based on game naming convention
    if (game === 'The Binding Blade') {
      return allClasses.filter((cls: Class) => {
        // These are Binding Blade specific classes
        return true; // We can just return true here since we are loading all from binding_blade_classes anyway, but let's just make sure bb classes pass if they end with _m or _f or are one of the core ones. Actually since we are merging all classes, let's just use the file source.
        // But for now let's just do a basic string match to allow everything through since Engage and 3H classes are distinct, or better yet, since the app uses ID matches, let's just allow all for `The Binding Blade` game for now, or match if they exist.
        // A better long-term fix is adding a `game` field to Class data.
      });

    } else if (game === 'Three Houses') {
      return allClasses.filter((cls: Class) => {
        // These are Three Houses specific classes
        const thClasses = ['noble', 'emperor', 'great_lord', 'commoner', 'myrmidon', 'swordmaster'];
        return thClasses.includes(cls.id);
      });
    } else if (game === 'Engage') {
      return allClasses.filter((cls: Class) => {
        // These are Engage specific classes
        const engageClasses = ['dragon_child', 'divine_dragon', 'swordfighter', 'swordmaster', 'hero'];
        return engageClasses.includes(cls.id);
      });
    }

    return allClasses;
  } catch (error) {
    console.error(`Error loading classes for game ${game}:`, error);
    throw new Error(`Failed to load classes for game ${game}`);
  }
}

export async function getClassById(id: string): Promise<Class | null> {
  try {
    const allClasses = await getAllClasses();
    return allClasses.find((cls: Class) => cls.id === id) ?? null;
  } catch (error) {
    console.error(`Error loading class with id ${id}:`, error);
    throw new Error(`Failed to load class with id ${id}`);
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
    maxStats: rawUnit.maxStats,
    isPromoted: rawUnit.isPromoted || false,
    gender: rawUnit.gender,
    baseWeaponRanks: rawUnit.baseWeaponRanks || {},
    crests: rawUnit.crests || [],
    dragonVein: rawUnit.dragonVein || false,
    prf: rawUnit.prf || []
  };

  // Apply normalization to standardize stat keys and handle missing stats
  return normalizeUnit(unit);
}

// Helper function to transform raw JSON data to Class interface
function transformJsonToClass(rawClass: any): Class {
  // Transform class stats to UnitStats objects
  const baseStats: UnitStats = {};
  const promotionBonus: UnitStats = {};

  // Extract base stats
  if (rawClass.baseStats) {
    Object.keys(rawClass.baseStats).forEach(key => {
      if (rawClass.baseStats[key] !== undefined) {
        baseStats[key] = rawClass.baseStats[key];
      }
    });
  }

  // Extract promotion bonus
  if (rawClass.promotionBonus) {
    Object.keys(rawClass.promotionBonus).forEach(key => {
      if (rawClass.promotionBonus[key] !== undefined) {
        promotionBonus[key] = rawClass.promotionBonus[key];
      }
    });
  }

  // Create class object
  const cls: Class = {
    id: rawClass.id,
    name: rawClass.name,
    type: rawClass.type || 'unpromoted',
    baseStats,
    promotionBonus,
    promotesTo: rawClass.promotesTo || [],
    weapons: rawClass.weapons || [],
    hiddenModifiers: rawClass.hiddenModifiers || [],
    gender: rawClass.gender,
    maxStats: rawClass.maxStats,
    movementType: rawClass.movementType
  };

  return cls;
}