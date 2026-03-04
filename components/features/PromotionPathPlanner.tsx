import React, { useState, useMemo, useEffect } from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Unit, Class, PromotionEvent } from '@/types/unit';
import { PlusIcon, MinusIcon } from 'lucide-react';
import { getAllClasses } from '@/lib/data';

interface PromotionPathPlannerProps {
  unit: Unit | null;
  promotionEvents: PromotionEvent[];
  onPromotionChange: (events: PromotionEvent[]) => void;
}

export const PromotionPathPlanner: React.FC<PromotionPathPlannerProps> = ({
  unit,
  promotionEvents,
  onPromotionChange
}) => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const loadClasses = async () => {
      const allClasses = await getAllClasses();
      setClasses(allClasses);
    };
    loadClasses();
  }, []);

  if (!unit) return null;

  const promotionTiers = useMemo(() => {
    if (classes.length === 0) return [];

    const tiers: Class[][] = [];
    let currentClassId = unit.class; // Start with the unit's current class name

    for (let step = 0; step < promotionEvents.length + 1; step++) {
      // For subsequent steps, we use the user's selected promotion path
      if (step > 0 && promotionEvents[step - 1]?.selectedClassId) {
        currentClassId = promotionEvents[step - 1].selectedClassId;
      }

      // Find the current class in the game data
      const currentClass = classes.find((c: Class) =>
        (c.id === currentClassId || c.name === currentClassId) && c.game === unit.game
      );

      if (currentClass && currentClass.promotesTo.length > 0) {
        // Map promotion IDs to full class objects
        const promotionOptions = currentClass.promotesTo
          .map((promoClassId: string) => classes.find((c: Class) => c.id === promoClassId && c.game === unit.game))
          .filter((cls): cls is Class => cls !== undefined);

        tiers.push(promotionOptions);
      } else {
        // No promotion options available
        tiers.push([]);
      }
    }

    return tiers;
  }, [unit, promotionEvents, classes]);

  const handleClassSelect = (index: number, newClassId: string) => {
    let newEvents = [...promotionEvents];

    // Update the target index
    newEvents[index] = { ...newEvents[index], selectedClassId: newClassId };

    // Set default level if creating a new event
    if (!newEvents[index].level) {
      newEvents[index].level = 10;
    }

    // Slice off invalid higher tiers
    newEvents = newEvents.slice(0, index + 1);

    onPromotionChange(newEvents);
  };

  const handleAddTier = () => {
    // Find the latest selected class or use the current class if none selected
    const latestEvent = promotionEvents[promotionEvents.length - 1];
    const currentClassId = latestEvent?.selectedClassId || unit.class;

    // Find the current class and get its first promotion option
    const currentClass = classes.find((c: Class) =>
      (c.id === currentClassId || c.name === currentClassId) && c.game === unit.game
    );

    if (currentClass && currentClass.promotesTo.length > 0) {
      const firstPromoClassId = currentClass.promotesTo[0];
      const newEvent: PromotionEvent = {
        level: 10,
        selectedClassId: firstPromoClassId
      };

      onPromotionChange([...promotionEvents, newEvent]);
    }
  };

  const handleRemoveTier = () => {
    if (promotionEvents.length > 0) {
      onPromotionChange(promotionEvents.slice(0, -1));
    }
  };

  // Check if we can add more tiers
  const canAddTier = (() => {
    if (classes.length === 0 || promotionEvents.length === 0) return true;

    const latestEvent = promotionEvents[promotionEvents.length - 1];
    if (!latestEvent.selectedClassId) return false;

    const currentClass = classes.find((c: Class) =>
      c.id === latestEvent.selectedClassId && c.game === unit.game
    );

    return currentClass && currentClass.promotesTo.length > 0;
  })();

  return (
    <div className="space-y-4">
      {promotionTiers.map((tier, index) => (
        <div key={index} className="flex items-center space-x-4">
          <span className="text-sm font-medium w-20">Tier {index + 1}</span>
          <Select
            value={promotionEvents[index]?.selectedClassId || ''}
            onChange={(e) => handleClassSelect(index, e.target.value)}
            options={[
              { value: '', label: 'Select a class' },
              ...tier.map(cls => ({ value: cls.id, label: cls.name }))
            ]}
          />
        </div>
      ))}

      <div className="flex space-x-2">
        <Button
          onClick={handleAddTier}
          disabled={!canAddTier}
          size="sm"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Tier
        </Button>

        <Button
          onClick={handleRemoveTier}
          disabled={promotionEvents.length === 0}
          size="sm"
          variant="outline"
        >
          <MinusIcon className="w-4 h-4 mr-1" />
          Remove Tier
        </Button>
      </div>
    </div>
  );
};