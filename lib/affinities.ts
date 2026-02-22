// FE6 (Binding Blade) Affinity data structure
export interface AffinityData {
  id: string;
  name: string;
  element: string;
  description: string;
  statBonuses: {
    attack?: number;
    defense?: number;
    hit?: number;
    avoid?: number;
    critical?: number;
    avoidCritical?: number;
  };
  supportBonuses: {
    levelC: string[];
    levelB: string[];
    levelA: string[];
    levelS: string[];
  };
}

export const FE6_AFFINITIES: AffinityData[] = [
  {
    id: 'fire',
    name: 'Fire',
    element: 'Anima',
    description: 'A passionate affinity that boosts offensive capabilities. Strong against Wind, weak against Thunder.',
    statBonuses: {
      attack: 1,
      critical: 5,
    },
    supportBonuses: {
      levelC: ['Attack +1', 'Critical +5'],
      levelB: ['Attack +1', 'Critical +10', 'Hit +5'],
      levelA: ['Attack +2', 'Critical +15', 'Hit +10'],
      levelS: ['Attack +3', 'Critical +20', 'Hit +15', 'Avoid +5'],
    },
  },
  {
    id: 'thunder',
    name: 'Thunder',
    element: 'Anima',
    description: 'A dynamic affinity that provides balanced bonuses. Strong against Fire, weak against Wind.',
    statBonuses: {
      attack: 1,
      hit: 5,
    },
    supportBonuses: {
      levelC: ['Attack +1', 'Hit +5'],
      levelB: ['Attack +1', 'Hit +10', 'Avoid +5'],
      levelA: ['Attack +2', 'Hit +15', 'Avoid +10'],
      levelS: ['Attack +2', 'Hit +20', 'Avoid +15', 'Critical +5'],
    },
  },
  {
    id: 'wind',
    name: 'Wind',
    element: 'Anima',
    description: 'A swift affinity that enhances accuracy and evasion. Strong against Thunder, weak against Fire.',
    statBonuses: {
      avoid: 5,
      avoidCritical: 5,
    },
    supportBonuses: {
      levelC: ['Avoid +5', 'Avoid Critical +5'],
      levelB: ['Avoid +10', 'Avoid Critical +10', 'Hit +5'],
      levelA: ['Avoid +15', 'Avoid Critical +15', 'Hit +10'],
      levelS: ['Avoid +20', 'Avoid Critical +20', 'Hit +15', 'Attack +1'],
    },
  },
  {
    id: 'light',
    name: 'Light',
    element: 'Light',
    description: 'A divine affinity that provides defensive bonuses. Effective against Dark affinities.',
    statBonuses: {
      defense: 1,
      avoidCritical: 10,
    },
    supportBonuses: {
      levelC: ['Defense +1', 'Avoid Critical +10'],
      levelB: ['Defense +1', 'Avoid Critical +15', 'Avoid +5'],
      levelA: ['Defense +2', 'Avoid Critical +20', 'Avoid +10'],
      levelS: ['Defense +3', 'Avoid Critical +25', 'Avoid +15', 'Hit +5'],
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    element: 'Dark',
    description: 'A mysterious affinity that focuses on critical hits. Strong against Light affinities.',
    statBonuses: {
      critical: 10,
      attack: 1,
    },
    supportBonuses: {
      levelC: ['Critical +10', 'Attack +1'],
      levelB: ['Critical +15', 'Attack +1', 'Hit +5'],
      levelA: ['Critical +20', 'Attack +2', 'Hit +10'],
      levelS: ['Critical +25', 'Attack +3', 'Hit +15', 'Defense +1'],
    },
  },
  {
    id: 'ice',
    name: 'Ice',
    element: 'Anima',
    description: 'A cold affinity that boosts defensive capabilities. Provides balanced defensive bonuses.',
    statBonuses: {
      defense: 1,
      avoid: 5,
    },
    supportBonuses: {
      levelC: ['Defense +1', 'Avoid +5'],
      levelB: ['Defense +1', 'Avoid +10', 'Hit +5'],
      levelA: ['Defense +2', 'Avoid +15', 'Hit +10'],
      levelS: ['Defense +3', 'Avoid +20', 'Hit +15', 'Critical +5'],
    },
  },
  {
    id: 'heaven',
    name: 'Heaven',
    element: 'Anima',
    description: 'A sacred affinity that provides excellent all-around bonuses. Considered the most balanced affinity.',
    statBonuses: {
      attack: 1,
      defense: 1,
      hit: 3,
      avoid: 3,
    },
    supportBonuses: {
      levelC: ['Attack +1', 'Defense +1'],
      levelB: ['Attack +1', 'Defense +1', 'Hit +3', 'Avoid +3'],
      levelA: ['Attack +2', 'Defense +2', 'Hit +6', 'Avoid +6'],
      levelS: ['Attack +3', 'Defense +3', 'Hit +10', 'Avoid +10', 'Critical +10'],
    },
  },
];

// Helper function to get affinity by ID
export function getAffinityById(id: string): AffinityData | undefined {
  return FE6_AFFINITIES.find(affinity => affinity.id === id);
}

// Helper function to get affinity by name
export function getAffinityByName(name: string): AffinityData | undefined {
  return FE6_AFFINITIES.find(affinity => 
    affinity.name.toLowerCase() === name.toLowerCase()
  );
}

// Helper function to get all affinity names
export function getAffinityNames(): string[] {
  return FE6_AFFINITIES.map(affinity => affinity.name);
}

// Helper function to get affinities by element
export function getAffinitiesByElement(element: string): AffinityData[] {
  return FE6_AFFINITIES.filter(affinity => 
    affinity.element.toLowerCase() === element.toLowerCase()
  );
}