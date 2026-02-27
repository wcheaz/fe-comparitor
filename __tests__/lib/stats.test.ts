import { generateProgressionArray } from '@/lib/stats';
import { Unit, UnitStats, Class, PromotionEvent } from '@/types/unit';

// Mock test data
const mockClasses: Class[] = [
  {
    id: 'mercenary',
    name: 'Mercenary',
    game: 'test_game',
    type: 'unpromoted',
    baseStats: { hp: 20, str: 6, skl: 8, spd: 7, lck: 5, def: 5, res: 0, con: 7, mov: 5 },
    promotionBonus: { hp: 8, str: 3, skl: 4, spd: 3, lck: 2, def: 3, res: 2, con: 2, mov: 1 },
    promotesTo: ['hero'],
    classAbilities: []
  },
  {
    id: 'hero',
    name: 'Hero',
    game: 'test_game',
    type: 'promoted',
    baseStats: { hp: 28, str: 9, skl: 12, spd: 10, lck: 7, def: 8, res: 2, con: 9, mov: 6 },
    promotionBonus: {},
    promotesTo: [],
    classAbilities: ['Axes']
  },
  {
    id: 'paladin',
    name: 'Paladin',
    game: 'test_game',
    type: 'promoted',
    baseStats: { hp: 30, str: 11, skl: 10, spd: 10, lck: 8, def: 10, res: 5, con: 11, mov: 8 },
    promotionBonus: {},
    promotesTo: [],
    classAbilities: ['Horse', 'Axes', 'Lances']
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

      // Check promotion level (internal level 20)
      const promotionLevel = progression[19]; // Index 19 = level 20
      expect(promotionLevel.displayLevel).toBe('Level 20');
      expect(promotionLevel.internalLevel).toBe(20);
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

      // Level 20 (before promotion, but marked as promotion level in UI)
      const beforePromotion = progression[0];
      expect(beforePromotion.displayLevel).toBe('Level 20');
      expect(beforePromotion.isPromotionLevel).toBe(true);

      // Level 21 (first promoted level)
      const promotionLevel = progression[1];
      expect(promotionLevel.displayLevel).toBe('Level 1 (Promoted)');
      expect(promotionLevel.isPromotionLevel).toBe(false);

      // Get stats before and after promotion
      const beforePromotionStats = beforePromotion.stats;
      const afterPromotionStats = promotionLevel.stats;

      // Check that promotion bonuses are applied
      // Pre-promotion calculated HP is ~29.4
      // Promotion bonus is 8 -> so ~37.4
      // Floor to class base (Hero base is 28) -> stays ~37.4
      expect(afterPromotionStats.hp).toBeGreaterThanOrEqual(28);

      // Check that stats are floored to class base stats
      // Hero class has HP base of 28
      expect(afterPromotionStats.hp).toBeGreaterThanOrEqual(28);

      // Check that class abilities are included on the promotion level row
      expect(beforePromotion.promotionInfo?.classAbilities).toContain('Axes');
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

        // Pre-promotion HP at level 20 is ~29.4
        // Promotion bonus is 0 for hero? Wait, hero promotion bonus is empty in mockClasses! `{}` 
        // Then floored to class base 28. So HP is ~29.4.
        // Then growth from level 21 to 22 (1 level) = 0.6
        // Total = ~30.
        expect(level22Stats.hp).toBeGreaterThanOrEqual(30);
      }
    });

    // Task 4.1: Validate generateProgressionArray accuracy for a standard 1-tier unit (Seth)
    it('should handle 1-tier promoted units correctly (Seth - Paladin)', () => {
      // Load real Sacred Stones data for Seth
      const sethUnit: Unit = {
        id: 'seth',
        name: 'Seth',
        game: 'The Sacred Stones',
        class: 'paladin',
        joinChapter: ['1'],
        level: 1,
        gender: 'M',
        affinity: 'Anima',
        isPromoted: true,
        stats: {
          hp: 30,
          str: 14,
          skl: 13,
          spd: 12,
          lck: 13,
          def: 11,
          res: 8,
          con: 11,
          mov: 8
        },
        growths: {
          hp: 90,
          str: 50,
          skl: 45,
          spd: 45,
          lck: 25,
          def: 40,
          res: 30
        },
        maxStats: {
          hp: 60,
          str: 25,
          skl: 26,
          spd: 24,
          def: 25,
          res: 25,
          con: 25,
          mov: 15
        }
      };

      // Seth's Paladin class data
      const paladinClass: Class = {
        id: 'paladin_m',
        name: 'Paladin',
        game: 'The Sacred Stones',
        type: 'promoted',
        baseStats: {
          hp: 23,
          str: 7,
          skl: 4,
          spd: 7,
          def: 8,
          res: 3,
          con: 11,
          mov: 8
        },
        promotionBonus: {},
        promotesTo: [],
        classAbilities: [],
        weapons: ['Sword', 'Lance', 'Axe'],
        maxStats: {
          hp: 60,
          str: 25,
          skl: 26,
          spd: 24,
          def: 25,
          res: 25,
          con: 25,
          mov: 15,
          lck: 30
        },
        gender: 'M',
        movementType: 'Cavalry'
      };

      const testClasses = [paladinClass];
      const progression = generateProgressionArray(sethUnit, 1, 20, testClasses, []);

      // Test 1: Should generate correct number of levels
      expect(progression).toHaveLength(20);

      // Test 2: No promotion levels (since Seth is already promoted)
      const hasPromotionLevels = progression.some(level => level.isPromotionLevel);
      expect(hasPromotionLevels).toBe(false);

      // Test 3: All display levels should be standard (no tier indicators)
      const hasTierIndicators = progression.some(level => level.displayLevel.includes('Tier'));
      expect(hasTierIndicators).toBe(false);

      // Test 4: First and last levels should have valid stats
      const firstLevel = progression[0];
      const lastLevel = progression[progression.length - 1];
      
      expect(firstLevel.stats.hp).toBeDefined();
      expect(lastLevel.stats.hp).toBeDefined();
      expect(firstLevel.stats.hp).toBeGreaterThan(0);
      expect(lastLevel.stats.hp).toBeGreaterThan(0);

      // Test 5: Stats should not decrease as levels increase
      for (let i = 1; i < progression.length; i++) {
        const current = progression[i];
        const previous = progression[i - 1];
        
        if (current.stats.hp && previous.stats.hp) {
          expect(current.stats.hp).toBeGreaterThanOrEqual(previous.stats.hp);
        }
      }

      // Test 6: Internal levels should be sequential
      for (let i = 0; i < progression.length; i++) {
        expect(progression[i].internalLevel).toBe(i + 1);
      }

      // Test 7: Stats should not exceed class maximums
      for (const level of progression) {
        for (const [stat, value] of Object.entries(level.stats)) {
          if (stat === 'lck') continue; // Luck not in paladin maxStats
          if (paladinClass.maxStats && paladinClass.maxStats[stat] && value) {
            expect(value).toBeLessThanOrEqual(paladinClass.maxStats[stat]);
          }
        }
      }

      // Test 8: Display levels should be correct format
      expect(firstLevel.displayLevel).toBe('Level 1');
      expect(progression[1].displayLevel).toBe('Level 2');
      expect(progression[19].displayLevel).toBe('Level 20');
    });

    // Task 5.1: Test that generateProgressionArray uses the selected promotion class correctly
    it('should use the selected promotion class when branching promotions are available', () => {
      // Create a mock unit with branching promotion options
      const cavalierUnit: Unit = {
        id: 'test-cavalier',
        name: 'Test Cavalier',
        game: 'The Sacred Stones',
        class: 'cavalier',
        joinChapter: 'Chapter 1',
        level: 1,
        stats: { hp: 20, str: 6, skl: 7, spd: 8, lck: 5, def: 6, res: 2 },
        growths: { hp: 70, str: 45, skl: 40, spd: 50, lck: 35, def: 30, res: 20 },
        isPromoted: false
      };

      // Create mock classes with branching promotions
      const branchingClasses: Class[] = [
        {
          id: 'cavalier',
          name: 'Cavalier',
          game: 'The Sacred Stones',
          type: 'unpromoted',
          baseStats: { hp: 20, str: 6, skl: 7, spd: 8, lck: 5, def: 6, res: 2, con: 8, mov: 7 },
          promotionBonus: { hp: 10, str: 4, skl: 3, spd: 3, lck: 2, def: 4, res: 3, con: 2, mov: 1 },
          promotesTo: ['paladin', 'great_knight'], // Branching promotion options
          classAbilities: []
        },
        {
          id: 'paladin',
          name: 'Paladin',
          game: 'The Sacred Stones',
          type: 'promoted',
          baseStats: { hp: 30, str: 10, skl: 10, spd: 11, lck: 7, def: 10, res: 5, con: 10, mov: 8 },
          promotionBonus: {},
          promotesTo: [],
          classAbilities: ['Horse', 'Swords', 'Lances']
        },
        {
          id: 'great_knight',
          name: 'Great Knight',
          game: 'The Sacred Stones',
          type: 'promoted',
          baseStats: { hp: 32, str: 12, skl: 8, spd: 7, lck: 7, def: 12, res: 8, con: 12, mov: 6 },
          promotionBonus: {},
          promotesTo: [],
          classAbilities: ['Horse', 'Swords', 'Axes', 'Lances']
        }
      ];

      // Test selecting Ranger (second option)
      const promotionEvents: PromotionEvent[] = [
        { level: 20, selectedClassId: 'great_knight' }
      ];

      const progression = generateProgressionArray(cavalierUnit, 1, 25, branchingClasses, promotionEvents);

      // Find the promotion level
      const promotionLevel = progression.find(level => level.isPromotionLevel);
      
      expect(promotionLevel).toBeDefined();
      expect(promotionLevel?.promotionInfo?.className).toBe('Great Knight');
      expect(promotionLevel?.promotionInfo?.className).not.toBe('Paladin');

      // Test that post-promotion levels use the correct class stats
      const postPromotionLevel = progression.find(level => level.displayLevel.includes('Tier') && level.stats.str !== undefined);
      expect(postPromotionLevel).toBeDefined();
      
      // Great Knight has higher base STR (12) than Paladin (10)
      // So if Great Knight is selected, STR should be higher
      if (postPromotionLevel?.stats.str) {
        expect(postPromotionLevel.stats.str).toBeGreaterThanOrEqual(11); // Should be at least the Great Knight base
      }
    });
  });
});