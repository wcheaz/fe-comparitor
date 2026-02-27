import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Unit, Class } from '@/types/unit';

const abilityPillVariants = cva(
  "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 border",
  {
    variants: {
      variant: {
        default: "bg-fe-gold-100 text-fe-blue-900 border-fe-gold-300 hover:bg-fe-gold-200",
        stat: "bg-fe-blue-100 text-fe-blue-900 border-fe-blue-300 hover:bg-fe-blue-200",
        weapon: "bg-fe-green-100 text-fe-blue-900 border-fe-green-300 hover:bg-fe-green-200",
      },
      size: {
        default: "h-6 py-1 px-2",
        sm: "h-5 px-1.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface AbilityPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof abilityPillVariants> {
  ability: string;
}

const AbilityPill: React.FC<AbilityPillProps> = ({ 
  ability, 
  variant, 
  size, 
  className, 
  ...props 
}) => {
  // Determine variant based on ability content
  let finalVariant = variant;
  if (!variant) {
    if (ability.startsWith('+')) {
      finalVariant = 'stat';
    } else if (['Swords', 'Lances', 'Axes', 'Bows', 'Light', 'Dark', 'Anima', 'Staves'].includes(ability)) {
      finalVariant = 'weapon';
    } else {
      finalVariant = 'default';
    }
  }

  return (
    <span
      className={cn(abilityPillVariants({ variant: finalVariant, size, className }))}
      {...props}
    >
      {ability}
    </span>
  );
};

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
    <div className={cn("flex flex-col space-y-2", className)}>
      <span className="text-sm font-medium text-fe-blue-900">
        Class Abilities
      </span>
      <div className="flex flex-wrap gap-1.5">
        {unitClass.classAbilities.map((ability, index) => (
          <AbilityPill 
            key={`${unitClass.id}-ability-${index}`}
            ability={ability}
            className="cursor-default"
          />
        ))}
      </div>
    </div>
  );
}