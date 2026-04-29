import React from 'react';
import { cn } from "@/lib/utils";
import { Unit, Class } from '@/types/unit';
import SkillPill from '@/components/ui/SkillPill';

interface ClassSkillsRowProps {
  unit: Unit;
  classes: Class[];
  className?: string;
}

export function ClassSkillsRow({
  unit,
  classes,
  className
}: ClassSkillsRowProps) {
  const unitClass = classes.find(cls =>
    cls.id === unit.class.toLowerCase().replace(/\s+/g, '_') &&
    cls.game === unit.game
  );

  if (!unitClass || !unitClass.classSkills || unitClass.classSkills.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <span className="text-sm font-medium text-fe-blue-900">
        Class Skills
      </span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {unitClass.classSkills.map((skill, index) => (
          <SkillPill
            key={`${unitClass.id}-skill-${index}`}
            skill={skill}
            game={unit.game}
          />
        ))}
      </div>
    </div>
  );
}
