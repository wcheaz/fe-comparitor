import React from 'react';
import { cn } from "@/lib/utils";
import { Unit, Class } from '@/types/unit';
import { getClassChangeOptions } from '@/lib/stats';
import ClassPill from '@/components/ui/ClassPill';

interface ClassChangeOptionsRowProps {
  unit: Unit;
  classes: Class[];
  className?: string;
}

export function ClassChangeOptionsRow({
  unit,
  classes,
  className
}: ClassChangeOptionsRowProps) {
  const options = getClassChangeOptions(unit, classes);

  if (options.length === 0) {
    return null;
  }

  // Group options by tier: trainee, unpromoted, promoted
  const traineeOptions = options.filter(cls => cls.type === 'trainee');
  const unpromotedOptions = options.filter(cls => cls.type === 'unpromoted');
  const promotedOptions = options.filter(cls => cls.type === 'promoted');

  const groups = [
    { key: 'trainee', items: traineeOptions },
    { key: 'unpromoted', items: unpromotedOptions },
    { key: 'promoted', items: promotedOptions }
  ].filter(group => group.items.length > 0);

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {groups.map(group => (
        <div key={group.key} className="flex flex-wrap justify-center gap-1.5">
          {group.items.map(cls => (
            <ClassPill
              key={cls.id}
              cls={cls}
              variant={cls.type === 'promoted' ? 'promoted' : 'unpromoted'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
