import { getAllUnits, getUnitsByGame, getUnitById } from '@/lib/data';
import { units } from '@/data/units';

// Mock the data to avoid importing actual data files in tests
jest.mock('@/data/units', () => ({
  units: [
    {
      id: 'marth',
      name: 'Marth',
      game: 'shadow-dragon',
      class: 'Lord',
      joinChapter: 'Prologue',
      level: 1,
      stats: { hp: 18, str: 5, skl: 5, spd: 7, lck: 7, def: 4, res: 2 },
      growths: { hp: 80, str: 40, skl: 50, spd: 60, lck: 50, def: 30, res: 20 }
    },
    {
      id: 'ike',
      name: 'Ike',
      game: 'path-of-radiance',
      class: 'Ranger',
      joinChapter: 'Chapter 1',
      level: 1,
      stats: { hp: 20, str: 7, skl: 6, spd: 6, lck: 5, def: 5, res: 2 },
      growths: { hp: 85, str: 60, skl: 45, spd: 45, lck: 40, def: 40, res: 25 }
    }
  ]
}));

describe('Data Service', () => {
  describe('getAllUnits', () => {
    it('should return all units from the data', () => {
      const result = getAllUnits();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Marth');
      expect(result[1].name).toBe('Ike');
    });

    it('should return units with correct structure', () => {
      const result = getAllUnits();
      const marth = result.find(u => u.id === 'marth');
      
      expect(marth).toBeDefined();
      expect(marth).toHaveProperty('id');
      expect(marth).toHaveProperty('name');
      expect(marth).toHaveProperty('game');
      expect(marth).toHaveProperty('class');
      expect(marth).toHaveProperty('stats');
      expect(marth).toHaveProperty('growths');
    });
  });

  describe('getUnitsByGame', () => {
    it('should return units for a specific game', () => {
      const result = getUnitsByGame('shadow-dragon');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Marth');
    });

    it('should return empty array for non-existent game', () => {
      const result = getUnitsByGame('non-existent-game');
      expect(result).toHaveLength(0);
    });

    it('should be case insensitive', () => {
      const result1 = getUnitsByGame('shadow-dragon');
      const result2 = getUnitsByGame('Shadow-Dragon');
      expect(result1).toEqual(result2);
    });
  });

  describe('getUnitById', () => {
    it('should return the correct unit by id', () => {
      const result = getUnitById('marth');
      expect(result).toBeDefined();
      expect(result!.name).toBe('Marth');
    });

    it('should return null for non-existent id', () => {
      const result = getUnitById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should be case sensitive for id', () => {
      const result = getUnitById('Marth');
      expect(result).toBeNull();
    });
  });
});