export type SupportLevel = 'C' | 'B' | 'A' | 'S';

export interface AffinityBonus {
  attack: number;
  defense: number;
  hit: number;
  avoid: number;
  critical: number;
  dodge: number; // Also known as Critical Avoid
}

export interface AffinityBonusesByGame {
  'GBA'?: AffinityBonus;
  'Path of Radiance'?: AffinityBonus;
  'Radiant Dawn'?: AffinityBonus;
}

export interface AffinityData {
  id: string;
  name: string;
  description: string;
  bonuses: AffinityBonusesByGame;
}

// GBA Bonus definitions (Fire Emblem 6, 7, 8)
const GBA_BONUSES: Record<string, AffinityBonus> = {
  Fire: { attack: 0.5, defense: 0, hit: 2.5, avoid: 2.5, critical: 2.5, dodge: 0 },
  Thunder: { attack: 0, defense: 0.5, hit: 0, avoid: 2.5, critical: 2.5, dodge: 2.5 },
  Wind: { attack: 0.5, defense: 0, hit: 2.5, avoid: 0, critical: 2.5, dodge: 2.5 },
  Ice: { attack: 0, defense: 0.5, hit: 2.5, avoid: 2.5, critical: 0, dodge: 2.5 },
  Dark: { attack: 0, defense: 0, hit: 2.5, avoid: 2.5, critical: 2.5, dodge: 2.5 },
  Light: { attack: 0.5, defense: 0.5, hit: 2.5, avoid: 0, critical: 2.5, dodge: 0 },
  Anima: { attack: 0.5, defense: 0.5, hit: 0, avoid: 2.5, critical: 0, dodge: 2.5 },
};

// Path of Radiance Bonus definitions (Fire Emblem 9)
const POR_BONUSES: Record<string, AffinityBonus> = {
  Fire: { attack: 0.5, defense: 0, hit: 2.5, avoid: 0, critical: 0, dodge: 0 },
  Thunder: { attack: 0, defense: 0.5, hit: 0, avoid: 2.5, critical: 0, dodge: 0 },
  Wind: { attack: 0, defense: 0, hit: 2.5, avoid: 2.5, critical: 0, dodge: 0 },
  Ice: { attack: 0, defense: 0.5, hit: 2.5, avoid: 0, critical: 0, dodge: 0 },
  Dark: { attack: 0.5, defense: 0, hit: 0, avoid: 2.5, critical: 0, dodge: 0 },
  Light: { attack: 0, defense: 0.5, hit: 2.5, avoid: 0, critical: 0, dodge: 0 },
  Water: { attack: 0.5, defense: 0.5, hit: 0, avoid: 0, critical: 0, dodge: 0 },
  Earth: { attack: 0, defense: 0, hit: 0, avoid: 5.0, critical: 0, dodge: 0 },
  Heaven: { attack: 0, defense: 0, hit: 5.0, avoid: 0, critical: 0, dodge: 0 },
};

export const AFFINITIES: AffinityData[] = [
  {
    id: 'fire',
    name: 'Fire',
    description: 'A passionate affinity that boosts offensive capabilities.',
    bonuses: {
      'GBA': GBA_BONUSES['Fire'],
      'Path of Radiance': POR_BONUSES['Fire'],
    }
  },
  {
    id: 'thunder',
    name: 'Thunder',
    description: 'A dynamic affinity that provides balanced bonuses.',
    bonuses: {
      'GBA': GBA_BONUSES['Thunder'],
      'Path of Radiance': POR_BONUSES['Thunder'],
    }
  },
  {
    id: 'wind',
    name: 'Wind',
    description: 'A swift affinity that enhances accuracy and evasion.',
    bonuses: {
      'GBA': GBA_BONUSES['Wind'],
      'Path of Radiance': POR_BONUSES['Wind'],
    }
  },
  {
    id: 'ice',
    name: 'Ice',
    description: 'A cold affinity that boosts defensive capabilities.',
    bonuses: {
      'GBA': GBA_BONUSES['Ice'],
      'Path of Radiance': POR_BONUSES['Ice'],
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'A mysterious affinity that focuses on critical hits and evasion.',
    bonuses: {
      'GBA': GBA_BONUSES['Dark'],
      'Path of Radiance': POR_BONUSES['Dark'],
    }
  },
  {
    id: 'light',
    name: 'Light',
    description: 'A divine affinity that provides defensive bonuses.',
    bonuses: {
      'GBA': GBA_BONUSES['Light'],
      'Path of Radiance': POR_BONUSES['Light'],
    }
  },
  {
    id: 'anima',
    name: 'Anima',
    description: 'A robust affinity that provides a wide range of reliable bonuses.',
    bonuses: {
      'GBA': GBA_BONUSES['Anima'],
    }
  },
  {
    id: 'water',
    name: 'Water',
    description: 'A flowing affinity balancing both offense and defense evenly.',
    bonuses: {
      'Path of Radiance': POR_BONUSES['Water'],
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    description: 'A grounded affinity that heavily enhances evasion.',
    bonuses: {
      'Path of Radiance': POR_BONUSES['Earth'],
    }
  },
  {
    id: 'heaven',
    name: 'Heaven',
    description: 'A sacred affinity that focuses purely on maximizing accuracy.',
    bonuses: {
      'Path of Radiance': POR_BONUSES['Heaven'],
    }
  },
];

export function getAffinityById(id: string): AffinityData | undefined {
  return AFFINITIES.find(affinity => affinity.id === id);
}

export function getAffinityByName(name: string): AffinityData | undefined {
  // Catch potential misspellings or localizations like "Lightning" for "Light"
  const normalizedName = name.toLowerCase() === 'lightning' ? 'light' : name.toLowerCase();
  return AFFINITIES.find(affinity =>
    affinity.name.toLowerCase() === normalizedName
  );
}

export function getAffinityNames(): string[] {
  return AFFINITIES.map(affinity => affinity.name);
}

/**
 * Helper to calculate string representation of support bonuses for a given level
 * (Level C = 1x multiplier, B = 2x, A = 3x, S = 4x)
 */
export function calculateSupportBonuses(affinity: AffinityData, game: string, level: SupportLevel): string[] {
  const gameKey = game.includes('Three Houses') ? undefined :
    (game.includes('Binding Blade') || game.includes('Blazing Blade') || game.includes('Sacred Stones')) ? 'GBA' :
      game.includes('Path of Radiance') ? 'Path of Radiance' : undefined;

  if (!gameKey) return [];

  const baseBonuses = affinity.bonuses[gameKey as keyof AffinityBonusesByGame];
  if (!baseBonuses) return [];

  const multiplierMap: Record<SupportLevel, number> = {
    'C': 1,
    'B': 2,
    'A': 3,
    'S': 4 // Note: GBA/PoR rarely have S-supports giving extra multiplier in same way but keeping for flexibility
  };

  const mult = multiplierMap[level];
  const items: string[] = [];

  // Floor the totals (for rendering individual halves, usually we render them as 0.5 per support and then 
  // round down in game, but when summarizing a single affinity's contribution, showing decimals is fine or multiplying it.
  // Standard wiki format shows the *total per support rank*, we will show mathematically exact multiplier).
  if (baseBonuses.attack) items.push(`Attack +${(baseBonuses.attack * mult).toFixed(1).replace('.0', '')}`);
  if (baseBonuses.defense) items.push(`Defense +${(baseBonuses.defense * mult).toFixed(1).replace('.0', '')}`);
  if (baseBonuses.hit) items.push(`Hit +${(baseBonuses.hit * mult).toFixed(1).replace('.0', '')}`);
  if (baseBonuses.avoid) items.push(`Avoid +${(baseBonuses.avoid * mult).toFixed(1).replace('.0', '')}`);
  if (baseBonuses.critical) items.push(`Critical +${(baseBonuses.critical * mult).toFixed(1).replace('.0', '')}`);
  if (baseBonuses.dodge) items.push(`Dodge +${(baseBonuses.dodge * mult).toFixed(1).replace('.0', '')}`);

  return items;
}