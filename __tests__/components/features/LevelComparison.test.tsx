import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LevelComparison } from '@/components/features/LevelComparison';
import { Unit, Class } from '@/types/unit';

const mockClasses: Class[] = [
  {
    id: 'lord',
    name: 'Lord',
    game: 'The Binding Blade',
    type: 'unpromoted',
    baseStats: {},
    promotionBonus: {},
    promotesTo: [],
    classSkills: [],
    maxStats: { hp: 60, str: 20, skl: 20, spd: 20, lck: 20, def: 20, res: 20, con: 15, mov: 15 },
  },
  {
    id: 'tactician',
    name: 'Tactician',
    game: 'Awakening',
    type: 'unpromoted',
    tier: '1',
    baseStats: { hp: 16, str: 4, mag: 3, skl: 5, spd: 5, lck: 0, def: 5, res: 3 },
    promotionBonus: {},
    promotesTo: ['grandmaster'],
    classSkills: ['Veteran (Lv. 1)', 'Solidarity (Lv. 10)'],
    maxStats: { hp: 60, str: 25, mag: 25, skl: 30, spd: 30, lck: 45, def: 25, res: 25 },
    growths: { hp: 40, str: 15, mag: 15, skl: 15, spd: 15, lck: 0, def: 10, res: 10 },
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    game: 'Awakening',
    type: 'promoted',
    tier: '2',
    baseStats: { hp: 20, str: 7, mag: 6, skl: 7, spd: 7, lck: 0, def: 7, res: 5 },
    promotionBonus: {},
    promotesTo: [],
    classSkills: ['Ignis (Lv. 5)', 'Rally Spectrum (Lv. 15)'],
    maxStats: { hp: 80, str: 40, mag: 40, skl: 45, spd: 45, lck: 80, def: 35, res: 35 },
    growths: { hp: 40, str: 15, mag: 15, skl: 15, spd: 15, lck: 0, def: 10, res: 10 },
  },
  {
    id: 'cavalier',
    name: 'Cavalier',
    game: 'Awakening',
    type: 'unpromoted',
    tier: '1',
    baseStats: { hp: 19, str: 6, mag: 0, skl: 7, spd: 7, lck: 1, def: 8, res: 2 },
    promotionBonus: {},
    promotesTo: ['great_knight'],
    classSkills: ['Armsthrift (Lv. 1)'],
    maxStats: { hp: 60, str: 25, mag: 20, skl: 30, spd: 30, lck: 30, def: 30, res: 20 },
    growths: {},
  },
  {
    id: 'great_knight',
    name: 'Great Knight',
    game: 'Awakening',
    type: 'promoted',
    tier: '2',
    baseStats: { hp: 24, str: 9, mag: 0, skl: 9, spd: 6, lck: 0, def: 11, res: 3 },
    promotionBonus: {},
    promotesTo: [],
    classSkills: ['Discipline (Lv. 1)', 'Dual Strike+ (Lv. 10)'],
    maxStats: {},
    growths: {},
  },
];

const unitStrong: Unit = {
  id: 'strong',
  name: 'Strong',
  game: 'The Binding Blade',
  class: 'lord',
  joinChapter: '1',
  level: 1,
  stats: { hp: 30, str: 10, skl: 10, spd: 10, lck: 10, def: 10, res: 5, con: 7, mov: 5 },
  growths: { hp: 50, str: 40, skl: 40, spd: 40, lck: 30, def: 30, res: 20 },
  maxStats: { hp: 60, str: 20, skl: 20, spd: 20, lck: 10, def: 20, res: 20, con: 15, mov: 15 },
};

const unitWeak: Unit = {
  id: 'weak',
  name: 'Weak',
  game: 'The Binding Blade',
  class: 'lord',
  joinChapter: '1',
  level: 1,
  stats: { hp: 20, str: 5, skl: 5, spd: 5, lck: 5, def: 4, res: 1, con: 5, mov: 5 },
  growths: { hp: 60, str: 30, skl: 30, spd: 30, lck: 40, def: 20, res: 10 },
  maxStats: { hp: 60, str: 20, skl: 20, spd: 20, lck: 20, def: 20, res: 20, con: 15, mov: 15 },
};

const robin: Unit = {
  id: 'robin_m',
  name: 'Robin (M)',
  game: 'Awakening',
  class: 'tactician',
  joinChapter: 'Premonition',
  level: 1,
  stats: { hp: 3, str: 2, mag: 2, skl: 0, spd: 1, lck: 4, def: 1, res: 1 },
  growths: { hp: 40, str: 40, mag: 35, skl: 35, spd: 35, lck: 55, def: 30, res: 20 },
  startingSkills: ['Veteran'],
  reclassOptions: ['tactician', 'cavalier'],
};

const secondAwakening: Unit = {
  id: 'sully',
  name: 'Sully',
  game: 'Awakening',
  class: 'cavalier',
  joinChapter: 'Chapter 1',
  level: 1,
  stats: { hp: 7, str: 3, mag: 0, skl: 4, spd: 5, lck: 3, def: 4, res: 0 },
  growths: { hp: 50, str: 40, skl: 40, spd: 40, lck: 35, def: 30, res: 15 },
  reclassOptions: ['cavalier'],
};

describe('LevelComparison', () => {
  describe('Level selectors', () => {
    it('renders a dropdown for each unit populated with progression steps', () => {
      render(
        <LevelComparison unitA={unitStrong} unitB={unitWeak} classes={mockClasses} />
      );

      const selectA = screen.getByTestId('level-select-a');
      const selectB = screen.getByTestId('level-select-b');
      expect(selectA).toBeInTheDocument();
      expect(selectB).toBeInTheDocument();

      // Options show level + class name per spec
      expect(within(selectA).getByRole('option', { name: 'Level 1 (Lord)' })).toBeInTheDocument();
      expect(within(selectB).getByRole('option', { name: 'Level 1 (Lord)' })).toBeInTheDocument();
    });
  });

  describe('Stat matchup comparison', () => {
    it('highlights the higher stat with a green background and shows the difference', () => {
      const { container } = render(
        <LevelComparison unitA={unitStrong} unitB={unitWeak} classes={mockClasses} />
      );

      const strRow = container.querySelector('[data-stat="str"]');
      expect(strRow).not.toBeNull();
      const cells = strRow!.querySelectorAll('td');
      // Strong str=10 > Weak str=5 -> A cell highlighted, diff +5.00
      expect(cells[1]).toHaveClass('bg-green-500/20');
      expect(cells[2]).not.toHaveClass('bg-green-500/20');
      expect(cells[3].textContent).toBe('+5.00');
    });

    it('renders capped stats in bold green text', () => {
      const { container } = render(
        <LevelComparison unitA={unitStrong} unitB={unitWeak} classes={mockClasses} />
      );

      // Strong lck=10 hits cap (maxStats.lck=10) at level 1
      const lckRow = container.querySelector('[data-stat="lck"]');
      const aCellSpan = lckRow!.querySelectorAll('td')[1].querySelector('span');
      expect(aCellSpan).toHaveClass('text-green-600');
      expect(aCellSpan).toHaveClass('font-bold');
    });
  });

  describe('Secondary stats display', () => {
    it('renders mov/con rows when at least one unit defines them', () => {
      const { container } = render(
        <LevelComparison unitA={unitStrong} unitB={unitWeak} classes={mockClasses} />
      );

      expect(container.querySelector('[data-stat="con"]')).not.toBeNull();
      expect(container.querySelector('[data-stat="mov"]')).not.toBeNull();
    });

    it('omits secondary stat rows when neither unit defines them', () => {
      const { container } = render(
        <LevelComparison unitA={robin} unitB={secondAwakening} classes={mockClasses} />
      );

      expect(container.querySelector('[data-stat="con"]')).toBeNull();
      expect(container.querySelector('[data-stat="mov"]')).toBeNull();
      expect(container.querySelector('[data-stat="bld"]')).toBeNull();
    });
  });

  describe('Awakening skill matchup', () => {
    it('splits Has Skills and Possible Skills with zero overlap at level 20', () => {
      render(
        <LevelComparison unitA={robin} unitB={unitWeak} classes={mockClasses} />
      );

      // Select Robin at level 20 unpromoted (Tactician)
      const selectA = screen.getByTestId('level-select-a');
      const level20Option = within(selectA).getByRole('option', {
        name: 'Level 20 (Tactician)',
      }) as HTMLOptionElement;
      fireEvent.change(selectA, { target: { value: level20Option.value } });

      const hasContainer = screen.getByTestId(`has-skills-${robin.id}`);
      const possibleContainer = screen.getByTestId(`possible-skills-${robin.id}`);

      // Has Skills: Veteran (Lv.1) + Solidarity (Lv.10) + starting Veteran
      expect(within(hasContainer).getByText('Veteran')).toBeInTheDocument();
      expect(within(hasContainer).getByText('Solidarity')).toBeInTheDocument();

      // Possible Skills: Ignis (Grandmaster), Armsthrift (Cavalier), etc.
      expect(within(possibleContainer).getByText('Ignis')).toBeInTheDocument();
      expect(within(possibleContainer).getByText('Armsthrift')).toBeInTheDocument();

      // Zero overlap: Veteran/Solidarity must NOT appear in Possible Skills
      expect(within(possibleContainer).queryByText('Veteran')).toBeNull();
      expect(within(possibleContainer).queryByText('Solidarity')).toBeNull();
    });

    it('only includes class skills unlocked at or below the selected level in Has Skills', () => {
      render(
        <LevelComparison unitA={robin} unitB={unitWeak} classes={mockClasses} />
      );

      // Default level 1: Veteran (Lv.1) unlocked, Solidarity (Lv.10) not yet
      const hasContainer = screen.getByTestId(`has-skills-${robin.id}`);
      expect(within(hasContainer).getByText('Veteran')).toBeInTheDocument();
      expect(within(hasContainer).queryByText('Solidarity')).toBeNull();
    });
  });
});
