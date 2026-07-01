import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClassChangeOptionsRow } from '@/components/features/ClassChangeOptionsRow';
import { Unit, Class } from '@/types/unit';

const mockClasses: Class[] = [
  {
    id: 'trainee_class',
    name: 'Trainee Class',
    game: 'Awakening',
    type: 'trainee',
    baseStats: {},
    promotionBonus: {},
    promotesTo: ['unpromoted_class_1'],
    classSkills: []
  },
  {
    id: 'trainee_class_2',
    name: 'Trainee Class 2',
    game: 'Awakening',
    type: 'trainee',
    baseStats: {},
    promotionBonus: {},
    promotesTo: [],
    classSkills: []
  },
  {
    id: 'unpromoted_class_1',
    name: 'Unpromoted Class 1',
    game: 'Awakening',
    type: 'unpromoted',
    baseStats: {},
    promotionBonus: {},
    promotesTo: ['promoted_class_1'],
    classSkills: []
  },
  {
    id: 'promoted_class_1',
    name: 'Promoted Class 1',
    game: 'Awakening',
    type: 'promoted',
    baseStats: {},
    promotionBonus: {},
    promotesTo: [],
    classSkills: []
  }
];

const mockUnit: Unit = {
  id: 'test-unit',
  name: 'Test Unit',
  game: 'Awakening',
  class: 'trainee_class',
  joinChapter: 'Chapter 1',
  level: 1,
  stats: {},
  growths: {},
  reclassOptions: ['trainee_class', 'trainee_class_2', 'unpromoted_class_1', 'promoted_class_1']
};

describe('ClassChangeOptionsRow', () => {
  it('should render options grouped into separate lines by tier', () => {
    const { container } = render(
      <ClassChangeOptionsRow
        unit={mockUnit}
        classes={mockClasses}
      />
    );

    // Should render the class pills
    expect(screen.getByText('Trainee Class 2')).toBeInTheDocument();
    expect(screen.getByText('Unpromoted Class 1')).toBeInTheDocument();
    expect(screen.getByText('Promoted Class 1')).toBeInTheDocument();

    // Verify container grouping: there should be three distinct flex rows under the main container
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('flex-col');

    const rows = outerDiv?.childNodes;
    expect(rows).toHaveLength(3); // one for trainee, one for unpromoted, one for promoted
  });

  it('should render nothing if there are no reclass options', () => {
    const unitNoOptions: Unit = {
      ...mockUnit,
      class: 'promoted_class_1',
      reclassOptions: []
    };

    const { container } = render(
      <ClassChangeOptionsRow
        unit={unitNoOptions}
        classes={mockClasses}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
