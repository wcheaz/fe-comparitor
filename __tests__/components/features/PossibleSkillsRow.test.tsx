import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PossibleSkillsRow } from '@/components/features/PossibleSkillsRow';
import { Unit, Class } from '@/types/unit';

const mockClasses: Class[] = [
  {
    id: 'trainee_class',
    name: 'Trainee Class',
    game: 'test_game',
    type: 'trainee',
    baseStats: {},
    promotionBonus: {},
    promotesTo: [],
    classSkills: ['Trainee Skill (Lv. 1)']
  },
  {
    id: 'trainee_class_2',
    name: 'Trainee Class 2',
    game: 'test_game',
    type: 'trainee',
    baseStats: {},
    promotionBonus: {},
    promotesTo: [],
    classSkills: ['Trainee Skill 2 (Lv. 1)']
  },
  {
    id: 'unpromoted_class_1',
    name: 'Unpromoted Class 1',
    game: 'test_game',
    type: 'unpromoted',
    baseStats: {},
    promotionBonus: {},
    promotesTo: ['promoted_class_1'],
    classSkills: ['Unpromoted Skill (Lv. 5)']
  },
  {
    id: 'promoted_class_1',
    name: 'Promoted Class 1',
    game: 'test_game',
    type: 'promoted',
    baseStats: {},
    promotionBonus: {},
    promotesTo: [],
    classSkills: ['Promoted Skill (Lv. 15)']
  }
];

const mockUnit: Unit = {
  id: 'test-unit',
  name: 'Test Unit',
  game: 'test_game',
  class: 'trainee_class',
  joinChapter: 'Chapter 1',
  level: 1,
  stats: {},
  growths: {},
  reclassOptions: ['trainee_class', 'trainee_class_2', 'unpromoted_class_1', 'promoted_class_1']
};

describe('PossibleSkillsRow', () => {
  it('should render skills grouped into separate lines by tier', () => {
    const { container } = render(
      <PossibleSkillsRow
        unit={mockUnit}
        classes={mockClasses}
      />
    );

    // Should render the skill names (without current class skill 'Trainee Skill (Lv. 1)')
    expect(screen.queryByText('Trainee Skill (Lv. 1)')).not.toBeInTheDocument();
    expect(screen.getByText('Trainee Skill 2 (Lv. 1)')).toBeInTheDocument();
    expect(screen.getByText('Unpromoted Skill (Lv. 5)')).toBeInTheDocument();
    expect(screen.getByText('Promoted Skill (Lv. 15)')).toBeInTheDocument();

    // Verify container grouping: there should be three distinct flex rows under the main container
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('flex-col');

    const rows = outerDiv?.childNodes;
    expect(rows).toHaveLength(3); // trainee, unpromoted, promoted
  });

  it('should render None if there are no reclass options', () => {
    const unitNoOptions: Unit = {
      ...mockUnit,
      reclassOptions: []
    };

    const { container } = render(
      <PossibleSkillsRow
        unit={unitNoOptions}
        classes={mockClasses}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
