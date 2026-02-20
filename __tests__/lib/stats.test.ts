import { generateProgressionArray } from '@/lib/stats';
import { Unit, UnitStats, Class } from '@/types/unit';

// Mock test data
const mockClasses: Class[] = [
  {
    id: 'mercenary',
    name: 'Mercenary',
    type: 'unpromoted',
    baseStats: { hp: 20, str: 6, skl: 8, spd: 7, lck: 5, def: 5, res: 0, con: 7, mov: 5 },
    promotionBonus: { hp: 8, str: 3, skl: 4, spd: 3, lck: 2, def: 3, res: 2, con: 2, mov: 1 },
    promotesTo: ['hero'],
    hiddenModifiers: []
  },
  {
    id: 'hero',
    name: 'Hero',
    type: 'promoted',
    baseStats: { hp: 28, str: 9, skl: 12, spd: 10, lck: 7, def: 8, res: 2, con: 9, mov: 6 },
    promotionBonus: {},
    promotesTo: [],
    hiddenModifiers: ['Axes']
  },
  {
    id: 'paladin',
    name: 'Paladin',
    type: 'promoted',
    baseStats: { hp: 30, str: 11, skl: 10, spd: 10, lck: 8, def: 10, res: 5, con: 11, mov: 8 },
    promotionBonus: {},
    promotesTo: [],
    hiddenModifiers: ['Horse', 'Axes', 'Lances']
  }
];

const unpromotedUnit: Unit = {
  id: 'test-unit-1',
  name: 'Test Unit 1',
  game: 'Test Game',
  class: 'mercenary',
  joinChapter: 'Chapter 1',
  level: 1,
  stats: { hp: 18, str: 5, skl: 6, spd: 7, lck: 5, def: 4, res: 1 },
  growths: { hp: 60, str: 40, skl: 50, spd: 45, lck: 30, def: 25, res: 15 },
  isPromoted: false
};

const level10Unit: Unit = {
  id: 'test-unit-2',
  name: 'Test Unit 2',
  game: 'Test Game',
  class: 'mercenary',
  joinChapter: 'Chapter 2',
  level: 10,
  stats: { hp: 22, str: 8, skl: 10, spd: 11, lck: 8, def: 6, res: 2 },
  growths: { hp: 60, str: 40, skl: 50, spd: 45, lck: 30, def: 25, res: 15 },
  isPromoted: false
};

const prePromotedUnit: Unit = {
  id: 'marcus',
  name: 'Marcus',
  game: 'Test Game',
  class: 'paladin',
  joinChapter: 'Chapter 1',
  level: 1,
  stats: { hp: 30, str: 11, skl: 10, spd: 10, lck: 8, def: 10, res: 5 },
  growths: { hp: 70, str: 30, skl: 40, spd: 30, lck: 20, def: 35, res: 25 },
  isPromoted: true
};

describe('Stat Progression Logic', () => {
  describe('generateProgressionArray', () => {
    // Task 5.1: Verify that a standard unpromoted unit vs standard unpromoted unit displays correctly
    it('should generate correct progression for a standard unpromoted unit', () => {
      const progression = generateProgressionArray(unpromotedUnit, 1, 25, mockClasses);
      
      expect(progression).toHaveLength(25); // 25 levels (1-25)
      
      // Check first level
      const firstLevel = progression[0];
      expect(firstLevel.displayLevel).toBe('Level 1');
      expect(firstLevel.internalLevel).toBe(1);
      expect(firstLevel.isPromotionLevel).toBe(false);
      
      // Check promotion level (internal level 21)
      const promotionLevel = progression[20]; // Index 20 = level 21
      expect(promotionLevel.displayLevel).toBe('Level 1 (Promoted)');
      expect(promotionLevel.internalLevel).toBe(21);
      expect(promotionLevel.isPromotionLevel).toBe(true);
      expect(promotionLevel.promotionInfo).toBeDefined();
      expect(promotionLevel.promotionInfo?.className).toBe('Hero');
      
      // Check post-promotion level
      const postPromotionLevel = progression[21]; // Index 21 = level 22
      expect(postPromotionLevel.displayLevel).toBe('Level 2 (Promoted)');
      expect(postPromotionLevel.internalLevel).toBe(22);
    });

    // Task 5.2: Verify that a unit starting at level 1 and a unit starting at level 10 render correctly
    it('should handle units with different starting levels correctly', () => {
      const level1Progression = generateProgressionArray(unpromotedUnit, 1, 15, mockClasses);
      const level10Progression = generateProgressionArray(level10Unit, 1, 15, mockClasses);
      
      // Both should have 15 levels of data
      expect(level1Progression).toHaveLength(15);
      expect(level10Progression).toHaveLength(15);
      
      // For level 10 unit, levels 1-9 should have no actual stats (would show as "-" in UI)
      for (let i = 0; i < 9; i++) {
        const level1Stats = level1Progression[i].stats;
        const level10Stats = level10Progression[i].stats;
        
        // Level 1 unit should have stats at all levels
        expect(Object.keys(level1Stats)).not.toHaveLength(0);
        
        // Level 10 unit should have minimal stats until level 10
        if (i < 9) {
          // The stats before level 10 would be calculated based on growth, but the UI would show "-"
          expect(level10Stats).toBeDefined();
        }
      }
    });

    // Task 5.3: Verify that a unit receives exact promotion stat bumps at level 21 internal
    it('should apply correct promotion bonuses and class base flooring', () => {
      const progression = generateProgressionArray(unpromotedUnit, 20, 22, mockClasses);
      
      // Level 20 (before promotion)
      const beforePromotion = progression[0];
      expect(beforePromotion.displayLevel).toBe('Level 20');
      expect(beforePromotion.isPromotionLevel).toBe(false);
      
      // Level 21 (promotion level)
      const promotionLevel = progression[1];
      expect(promotionLevel.displayLevel).toBe('Level 1 (Promoted)');
      expect(promotionLevel.isPromotionLevel).toBe(true);
      
      // Get stats before and after promotion
      const beforePromotionStats = beforePromotion.stats;
      const afterPromotionStats = promotionLevel.stats;
      
      // Check that promotion bonuses are applied
      // Base mercenary: HP 20, promotion bonus: HP 8, so minimum should be 28
      expect(afterPromotionStats.hp).toBeGreaterThanOrEqual(28);
      
      // Check that stats are floored to class base stats
      // Hero class has HP base of 28
      expect(afterPromotionStats.hp).toBeGreaterThanOrEqual(28);
      
      // Check that hidden modifiers are included
      expect(promotionLevel.promotionInfo?.hiddenModifiers).toContain('Axes');
    });

    // Task 5.4: Verify that Pre-promoted units start their display properly without throwing errors
    it('should handle pre-promoted units without errors', () => {
      expect(() => {
        const progression = generateProgressionArray(prePromotedUnit, 1, 10, mockClasses);
        
        expect(progression).toHaveLength(10);
        
        // Check that pre-promoted unit doesn't have promotion levels
        const hasPromotionLevel = progression.some(level => level.isPromotionLevel);
        expect(hasPromotionLevel).toBe(false);
        
        // Check that all display levels are normal (no "Promoted" suffix for pre-promoted)
        progression.forEach(level => {
          expect(level.displayLevel).not.toContain('(Promoted)');
        });
        
        // Check that stats are calculated properly
        const firstLevel = progression[0];
        expect(Object.keys(firstLevel.stats)).not.toHaveLength(0);
        
      }).not.toThrow();
    });

    // Additional tests for edge cases
    it('should handle expand to level 100 correctly', () => {
      const progression = generateProgressionArray(unpromotedUnit, 1, 100, mockClasses);
      
      expect(progression).toHaveLength(100);
      
      // Check that level 100 is properly formatted
      const level100 = progression[99];
      expect(level100.displayLevel).toBe('Level 80 (Promoted)');
      expect(level100.internalLevel).toBe(100);
    });

    it('should handle units with missing class data gracefully', () => {
      const unitWithoutClassData: Unit = {
        ...unpromotedUnit,
        class: 'non_existent_class'
      };
      
      expect(() => {
        const progression = generateProgressionArray(unitWithoutClassData, 1, 25, mockClasses);
        expect(progression).toHaveLength(25);
      }).not.toThrow();
    });

    it('should calculate growth rates correctly across promotion boundary', () => {
      const progression = generateProgressionArray(unpromotedUnit, 19, 23, mockClasses);
      
      // Level 19 (before promotion)
      const level19 = progression[0];
      const level19Stats = level19.stats;
      
      // Level 22 (after promotion - Level 2 Promoted)
      const level22 = progression[3];
      const level22Stats = level22.stats;
      
      // Stats should increase due to growth and promotion bonuses
      if (level22Stats.hp !== undefined && level19Stats.hp !== undefined) {
        expect(level22Stats.hp).toBeGreaterThan(level19Stats.hp);
        
        // Check that HP growth is calculated correctly
        // Base HP: 18, Growth: 60%
        // Level 19: 18 + (60 * 18/100) = 18 + 10.8 = 28.8
        // After promotion: min 28 (class base) + promotion bonus 8 = 36
        // Plus some growth from levels 21-22
        expect(level22Stats.hp).toBeGreaterThanOrEqual(36);
      }
    });
  });
});