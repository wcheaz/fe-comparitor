export interface UnitStats {
  hp?: number;
  str?: number;
  mag?: number;
  skl?: number; // Skill (GBA/Tellius)
  dex?: number; // Dexterity (3H/Engage)
  spd?: number;
  lck?: number;
  def?: number;
  res?: number;
  con?: number; // Constitution (GBA)
  bld?: number; // Build (Engage)
  mov?: number;
  cha?: number; // Charm (3H)
  [key: string]: number | undefined; // Flexible for future games
}

export interface PromotionOption {
  class: string;
  promoGains: UnitStats;
  // potential new growths?
}

export interface Unit {
  id: string;
  name: string;
  game: string;
  class: string;
  joinChapter: string;
  level: number; // Base level
  stats: UnitStats; // Base stats (includes HP)
  growths: UnitStats; // Growth rates
  maxStats?: UnitStats; // Optional caps
  skills?: string[];
  isPromoted?: boolean; // Flag for units that start in a promoted class
  gender?: 'M' | 'F';

  // New Advanced Features
  supports?: string[]; // List of unit IDs or Names this unit supports with
  reclassOptions?: string[]; // List of classes unit can reclass into
  promotions?: PromotionOption[]; // Branching promotion paths
  affinity?: string; // Support affinity (Fire, Thunder, etc.)
  baseWeaponRanks?: Record<string, string>; // Starting weapon ranks e.g. { Swords: "D", Lances: "E" }
  crests?: string[]; // Crests for Three Houses units
  dragonVein?: boolean; // Can use Dragon Veins (Fates)
  prf?: string[]; // Preferred/Unique weapons only this unit can use
}

export interface Class {
  id: string;
  name: string;
  type: 'unpromoted' | 'promoted';
  baseStats: UnitStats;
  promotionBonus: UnitStats;
  promotesTo: string[];
  weapons?: string[];
  hiddenModifiers: string[];
  gender?: 'M' | 'F';
  maxStats?: UnitStats;
  movementType?: string;
}

export interface GameData {
  id: string;
  name: string;
  maxLevel: number;
  statLabels: Record<string, string>;
  supportsGameSpecific?: {
    hasSkills?: boolean;
    hasSupports?: boolean;
    hasReclassing?: boolean;
    hasBranchingPromotions?: boolean;
  };
}