import { Unit } from './types/unit';
import { generateProgressionArray } from './lib/stats';
import classes from './data/blazing_blade/classes.json';

const mockFE7Lord = {
  id: "eliwood",
  name: "Eliwood",
  game: "The Blazing Blade",
  class: "Lord",
  level: 1,
  stats: {
    "hp": 18,
    "str": 5,
    "skl": 5,
    "spd": 7,
    "lck": 7,
    "def": 5,
    "res": 0,
    "con": 7,
    "mov": 5
  },
  growths: {
    "hp": 80,
    "str": 45,
    "skl": 50,
    "spd": 40,
    "lck": 45,
    "def": 30,
    "res": 35
  },
  isPromoted: false,
  baseWeaponRanks: {},
  skills: [],
  supports: [],
  reclassOptions: [],
  promotions: [],
  crests: []
};

// add game field to classes to simulate what data.ts does
const mappedClasses = classes.map((c: any) => ({ ...c, game: "The Blazing Blade" }));

const progression = generateProgressionArray(mockFE7Lord as any, 1, 23, mappedClasses);

progression.forEach(levelRow => {
  if (levelRow.internalLevel >= 19 && levelRow.internalLevel <= 23) {
    console.log(`Level ${levelRow.internalLevel} (promoted? ${levelRow.isPromotionLevel}): HP: ${levelRow.stats.hp}, Str: ${levelRow.stats.str}`);
  }
});
