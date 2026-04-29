import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClassSkillsRow } from '@/components/features/ClassSkillsRow';
import { Unit } from '@/types/unit';

const mockUnitWithSkills: Unit = {
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

const mockUnitWithoutSkills: Unit = {
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
    type: 'promoted' as const,
    baseStats: { hp: 30, str: 11, skl: 10, spd: 10, lck: 8, def: 10, res: 5, con: 11, mov: 8 },
    promotionBonus: {},
    promotesTo: [],
    classSkills: ['Horse', 'Axes', 'Lances']
  },
  {
    id: 'mercenary',
    name: 'Mercenary',
    game: 'test_game',
    type: 'unpromoted' as const,
    baseStats: { hp: 20, str: 6, skl: 8, spd: 7, lck: 5, def: 5, res: 0, con: 7, mov: 5 },
    promotionBonus: { hp: 8, str: 3, skl: 4, spd: 3, lck: 2, def: 3, res: 2, con: 2, mov: 1 },
    promotesTo: ['hero'],
    classSkills: []
  }
];

describe('ClassSkillsRow', () => {
  describe('Rendering', () => {
    it('should render class skills when unit has class skills', () => {
      render(
        <ClassSkillsRow
          unit={mockUnitWithSkills}
          classes={mockClasses}
        />
      );

      expect(screen.getByText('Class Skills')).toBeInTheDocument();

      expect(screen.getByText('Horse')).toBeInTheDocument();
      expect(screen.getByText('Axes')).toBeInTheDocument();
      expect(screen.getByText('Lances')).toBeInTheDocument();
    });

    it('should not render when unit has no class skills', () => {
      const { container } = render(
        <ClassSkillsRow
          unit={mockUnitWithoutSkills}
          classes={mockClasses}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render mixed skill types (stat bonuses and named skills)', () => {
      const unitWithMixedSkills: Unit = {
        ...mockUnitWithSkills,
        class: 'berserker'
      };

      const classesWithMixedSkills = [
        {
          id: 'berserker',
          name: 'Berserker',
          game: 'test_game',
          type: 'promoted' as const,
          baseStats: { hp: 32, str: 14, skl: 8, spd: 6, lck: 5, def: 8, res: 2, con: 12, mov: 6 },
          promotionBonus: {},
          promotesTo: [],
          classSkills: ['Slayer', '+15 Crit', 'Axes']
        }
      ];

      render(
        <ClassSkillsRow
          unit={unitWithMixedSkills}
          classes={classesWithMixedSkills}
        />
      );

      expect(screen.getByText('Slayer')).toBeInTheDocument();
      expect(screen.getByText('+15 Crit')).toBeInTheDocument();
      expect(screen.getByText('Axes')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render skills as styled pills/badges', () => {
      render(
        <ClassSkillsRow
          unit={mockUnitWithSkills}
          classes={mockClasses}
        />
      );

      const horseSkill = screen.getByText('Horse');
      const axesSkill = screen.getByText('Axes');
      const lancesSkill = screen.getByText('Lances');

      expect(horseSkill).toHaveClass('inline-flex');
      expect(axesSkill).toHaveClass('inline-flex');
      expect(lancesSkill).toHaveClass('inline-flex');
    });

    it('should handle empty class skills array gracefully', () => {
      const { container } = render(
        <ClassSkillsRow
          unit={mockUnitWithoutSkills}
          classes={mockClasses}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle missing class data gracefully', () => {
      const unitWithMissingClass: Unit = {
        ...mockUnitWithSkills,
        class: 'non_existent_class'
      };

      const { container } = render(
        <ClassSkillsRow
          unit={unitWithMissingClass}
          classes={mockClasses}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      render(
        <ClassSkillsRow
          unit={mockUnitWithSkills}
          classes={mockClasses}
        />
      );

      const classSkillsLabel = screen.getByText('Class Skills');
      expect(classSkillsLabel).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single skill correctly', () => {
      const unitWithSingleSkill: Unit = {
        ...mockUnitWithSkills,
        class: 'assassin'
      };

      const classesWithSingleSkill = [
        {
          id: 'assassin',
          name: 'Assassin',
          game: 'test_game',
          type: 'promoted' as const,
          baseStats: { hp: 26, str: 6, skl: 11, spd: 11, lck: 0, def: 4, res: 2, con: 6, mov: 6 },
          promotionBonus: {},
          promotesTo: [],
          classSkills: ['Silencer']
        }
      ];

      render(
        <ClassSkillsRow
          unit={unitWithSingleSkill}
          classes={classesWithSingleSkill}
        />
      );

      expect(screen.getByText('Silencer')).toBeInTheDocument();
      expect(screen.getByText('Class Skills')).toBeInTheDocument();
    });

    it('should handle large number of skills', () => {
      const unitWithManySkills: Unit = {
        ...mockUnitWithSkills,
        class: 'lord'
      };

      const classesWithManySkills = [
        {
          id: 'lord',
          name: 'Lord',
          game: 'test_game',
          type: 'unpromoted' as const,
          baseStats: { hp: 20, str: 5, skl: 5, spd: 5, lck: 5, def: 5, res: 5, con: 7, mov: 5 },
          promotionBonus: {},
          promotesTo: [],
          classSkills: ['Swords', 'Leadership', '+10 Hit', '+5 Crit', 'Locktouch', 'Canto', 'Chart', 'Bond']
        }
      ];

      render(
        <ClassSkillsRow
          unit={unitWithManySkills}
          classes={classesWithManySkills}
        />
      );

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
