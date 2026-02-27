import React from 'react';
import { cn } from "@/lib/utils";
import { Unit, Class } from '@/types/unit';
import AbilityPill from '@/components/ui/AbilityPill';

interface ClassAbilitiesRowProps {
  unit: Unit;
  classes: Class[];
  className?: string;
}

export function ClassAbilitiesRow({
  unit,
  classes,
  className
}: ClassAbilitiesRowProps) {
  // Find the unit's class
  const unitClass = classes.find(cls =>
    cls.id === unit.class.toLowerCase().replace(/\s+/g, '_') &&
    cls.game === unit.game
  );

  // If class not found or no class abilities, don't render anything
  if (!unitClass || !unitClass.classAbilities || unitClass.classAbilities.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <span className="text-sm font-medium text-fe-blue-900">
        Class Abilities
      </span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {unitClass.classAbilities.map((ability, index) => (
          <AbilityPill
            key={`${unitClass.id}-ability-${index}`}
            ability={ability}
            game={unit.game}
          />
        ))}
      </div>
    </div>
  );
}