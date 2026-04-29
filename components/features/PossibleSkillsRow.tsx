import React from 'react';
import { cn } from "@/lib/utils";
import { Unit, Class } from '@/types/unit';
import SkillPill from '@/components/ui/SkillPill';

interface PossibleSkillsRowProps {
  unit: Unit;
  classes: Class[];
  className?: string;
}

function findClassById(classes: Class[], id: string, game: string): Class | undefined {
  const normalized = id.toLowerCase().replace(/\s+/g, '_');
  return classes.find(c =>
    (c.id === normalized || c.id === id || c.name === id) && c.game === game
  );
}

export function PossibleSkillsRow({
  unit,
  classes,
  className
}: PossibleSkillsRowProps) {
  if (!unit.reclassOptions || unit.reclassOptions.length === 0) {
    return null;
  }

  const currentClass = findClassById(classes, unit.class, unit.game);
  const currentSkills = new Set(currentClass?.classSkills || []);

  const skillToClassNames = new Map<string, string[]>();

  for (const reclassId of unit.reclassOptions) {
    const reclassCls = findClassById(classes, reclassId, unit.game);
    if (!reclassCls) continue;

    for (const skill of reclassCls.classSkills || []) {
      if (currentSkills.has(skill)) continue;
      const existing = skillToClassNames.get(skill);
      if (existing) {
        if (!existing.includes(reclassCls.name)) {
          existing.push(reclassCls.name);
        }
      } else {
        skillToClassNames.set(skill, [reclassCls.name]);
      }
    }

    for (const promotesToId of reclassCls.promotesTo || []) {
      const promotedCls = findClassById(classes, promotesToId, unit.game);
      if (!promotedCls) continue;

      for (const skill of promotedCls.classSkills || []) {
        if (currentSkills.has(skill)) continue;
        const existing = skillToClassNames.get(skill);
        if (existing) {
          if (!existing.includes(promotedCls.name)) {
            existing.push(promotedCls.name);
          }
        } else {
          skillToClassNames.set(skill, [promotedCls.name]);
        }
      }
    }
  }

  if (skillToClassNames.size === 0) {
    return null;
  }

  const entries = Array.from(skillToClassNames.entries());

  return (
    <div className={cn("flex flex-col items-center space-y-1", className)}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {entries.map(([skill, classNames]) => (
          <div key={skill} className="flex flex-col items-center gap-0.5">
            <SkillPill
              skill={skill}
              game={unit.game}
            />
            <span className="text-[10px] text-muted-foreground leading-tight">
              {classNames.join(', ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
