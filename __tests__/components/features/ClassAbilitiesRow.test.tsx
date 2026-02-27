import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClassAbilitiesRow } from '@/components/features/ClassAbilitiesRow';
import { Unit } from '@/types/unit';

// Mock test data
const mockUnitWithAbilities: Unit = {
  id: 'test-unit-1',
  name: 'Test Unit 1',
  game: 'test_game',
  class: 'paladin',
  joinChapter: 'Chapter 1',
  level: 1,
  stats: { hp: 30, str: 11, skl: 10, spd: 10, lck: 8, def: 10, res: 5 },
  growths: { hp: 70, str: 30, skl: 40, spd: 30, lck: 20, def: 35, res: 25 },
  isPromoted: true
};

const mockUnitWithoutAbilities: Unit = {
  id: 'test-unit-2',
  name: 'Test Unit 2',
  game: 'test_game',
  class: 'mercenary',
  joinChapter: 'Chapter 1',
  level: 1,
  stats: { hp: 18, str: 5, skl: 6, spd: 7, lck: 5, def: 4, res: 1 },
  growths: { hp: 60, str: 40, skl: 50, spd: 45, lck: 30, def: 25, res: 15 },
  isPromoted: false
};

const mockClasses = [
  {
    id: 'paladin',
    name: 'Paladin',
    game: 'test_game',
    type: 'promoted',
    baseStats: { hp: 30, str: 11, skl: 10, spd: 10, lck: 8, def: 10, res: 5, con: 11, mov: 8 },
    promotionBonus: {},
    promotesTo: [],
    classAbilities: ['Horse', 'Axes', 'Lances']
  },
  {
    id: 'mercenary',
    name: 'Mercenary',
    game: 'test_game',
    type: 'unpromoted',
    baseStats: { hp: 20, str: 6, skl: 8, spd: 7, lck: 5, def: 5, res: 0, con: 7, mov: 5 },
    promotionBonus: { hp: 8, str: 3, skl: 4, spd: 3, lck: 2, def: 3, res: 2, con: 2, mov: 1 },
    promotesTo: ['hero'],
    classAbilities: []
  }
];

describe('ClassAbilitiesRow', () => {
  describe('Rendering', () => {
    it('should render class abilities when unit has class abilities', () => {
      render(
        <ClassAbilitiesRow
          unit={mockUnitWithAbilities}
          classes={mockClasses}
        />
      );

      // Should render the "Class Abilities" label
      expect(screen.getByText('Class Abilities')).toBeInTheDocument();

      // Should render each ability as a pill/badge
      expect(screen.getByText('Horse')).toBeInTheDocument();
      expect(screen.getByText('Axes')).toBeInTheDocument();
      expect(screen.getByText('Lances')).toBeInTheDocument();
    });

    it('should not render when unit has no class abilities', () => {
      const { container } = render(
        <ClassAbilitiesRow
          unit={mockUnitWithoutAbilities}
          classes={mockClasses}
        />
      );

      // Should not render anything when there are no class abilities
      expect(container.firstChild).toBeNull();
    });

    it('should render mixed ability types (stat bonuses and named abilities)', () => {
      const unitWithMixedAbilities: Unit = {
        ...mockUnitWithAbilities,
        class: 'berserker'
      };

      const classesWithMixedAbilities = [
        {
          id: 'berserker',
          name: 'Berserker',
          game: 'test_game',
          type: 'promoted',
          baseStats: { hp: 32, str: 14, skl: 8, spd: 6, lck: 5, def: 8, res: 2, con: 12, mov: 6 },
          promotionBonus: {},
          promotesTo: [],
          classAbilities: ['Slayer', '+15 Crit', 'Axes']
        }
      ];

      render(
        <ClassAbilitiesRow
          unit={unitWithMixedAbilities}
          classes={classesWithMixedAbilities}
        />
      );

      // Should render all types of abilities
      expect(screen.getByText('Slayer')).toBeInTheDocument();
      expect(screen.getByText('+15 Crit')).toBeInTheDocument();
      expect(screen.getByText('Axes')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render abilities as styled pills/badges', () => {
      render(
        <ClassAbilitiesRow
          unit={mockUnitWithAbilities}
          classes={mockClasses}
        />
      );

      // Check that abilities are rendered with pill styling
      const horseAbility = screen.getByText('Horse');
      const axesAbility = screen.getByText('Axes');
      const lancesAbility = screen.getByText('Lances');

      // Should have pill styling classes
      expect(horseAbility).toHaveClass('inline-flex');
      expect(axesAbility).toHaveClass('inline-flex');
      expect(lancesAbility).toHaveClass('inline-flex');
    });

    it('should handle empty class abilities array gracefully', () => {
      const { container } = render(
        <ClassAbilitiesRow
          unit={mockUnitWithoutAbilities}
          classes={mockClasses}
        />
      );

      // Should not throw errors and should return null
      expect(container.firstChild).toBeNull();
    });

    it('should handle missing class data gracefully', () => {
      const unitWithMissingClass: Unit = {
        ...mockUnitWithAbilities,
        class: 'non_existent_class'
      };

      const { container } = render(
        <ClassAbilitiesRow
          unit={unitWithMissingClass}
          classes={mockClasses}
        />
      );

      // Should not throw errors and should return null when class is not found
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      render(
        <ClassAbilitiesRow
          unit={mockUnitWithAbilities}
          classes={mockClasses}
        />
      );

      // The "Class Abilities" label should be properly labeled
      const classAbilitiesLabel = screen.getByText('Class Abilities');
      expect(classAbilitiesLabel).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single ability correctly', () => {
      const unitWithSingleAbility: Unit = {
        ...mockUnitWithAbilities,
        class: 'assassin'
      };

      const classesWithSingleAbility = [
        {
          id: 'assassin',
          name: 'Assassin',
          game: 'test_game',
          type: 'promoted',
          baseStats: { hp: 26, str: 6, skl: 11, spd: 11, lck: 0, def: 4, res: 2, con: 6, mov: 6 },
          promotionBonus: {},
          promotesTo: [],
          classAbilities: ['Silencer']
        }
      ];

      render(
        <ClassAbilitiesRow
          unit={unitWithSingleAbility}
          classes={classesWithSingleAbility}
        />
      );

      // Should render single ability
      expect(screen.getByText('Silencer')).toBeInTheDocument();
      expect(screen.getByText('Class Abilities')).toBeInTheDocument();
    });

    it('should handle large number of abilities', () => {
      const unitWithManyAbilities: Unit = {
        ...mockUnitWithAbilities,
        class: 'lord'
      };

      const classesWithManyAbilities = [
        {
          id: 'lord',
          name: 'Lord',
          game: 'test_game',
          type: 'unpromoted',
          baseStats: { hp: 20, str: 5, skl: 5, spd: 5, lck: 5, def: 5, res: 5, con: 7, mov: 5 },
          promotionBonus: {},
          promotesTo: [],
          classAbilities: ['Swords', 'Leadership', '+10 Hit', '+5 Crit', 'Locktouch', 'Canto', 'Chart', 'Bond']
        }
      ];

      render(
        <ClassAbilitiesRow
          unit={unitWithManyAbilities}
          classes={classesWithManyAbilities}
        />
      );

      // Should render all abilities
      expect(screen.getByText('Swords')).toBeInTheDocument();
      expect(screen.getByText('Leadership')).toBeInTheDocument();
      expect(screen.getByText('+10 Hit')).toBeInTheDocument();
      expect(screen.getByText('+5 Crit')).toBeInTheDocument();
      expect(screen.getByText('Locktouch')).toBeInTheDocument();
      expect(screen.getByText('Canto')).toBeInTheDocument();
      expect(screen.getByText('Chart')).toBeInTheDocument();
      expect(screen.getByText('Bond')).toBeInTheDocument();
    });
  });
});