import { Unit } from './types/unit';
import { generateProgressionArray } from './lib/stats';
import classes from './data/blazing_blade/classes.json';

const mockFE7Kent = {
  id: "kent",
  name: "Kent",
  game: "The Blazing Blade",
  class: "Cavalier", // Unpromoted class that exists
  level: 1,
  stats: {
    "hp": 20, "str": 6, "skl": 6, "spd": 7, "lck": 2, "def": 5, "res": 1, "con": 9, "mov": 7
  },
  growths: {
    "hp": 85, "str": 40, "skl": 50, "spd": 45, "lck": 20, "def": 25, "res": 25
  },
  isPromoted: false,
  baseWeaponRanks: {},
  skills: [], supports: [], reclassOptions: [], promotions: [], crests: []
};

// add game field to classes and fix paladin_m to paladin
const mappedClasses = classes.map((c: any) => ({ 
  ...c, 
  game: "The Blazing Blade",
  promotesTo: c.promotesTo?.map((id: string) => id === "paladin_m" ? "paladin" : id)
}));

const progression = generateProgressionArray(mockFE7Kent as any, 1, 23, mappedClasses);

progression.forEach(levelRow => {
  if (levelRow.internalLevel >= 19 && levelRow.internalLevel <= 23) {
    console.log(`Level ${levelRow.internalLevel}: HP: ${levelRow.stats.hp}, Str: ${levelRow.stats.str}`);
  }
});
