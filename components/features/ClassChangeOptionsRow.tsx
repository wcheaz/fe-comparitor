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

  return (
    <div className={cn("flex flex-col items-center space-y-1", className)}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {options.map(cls => (
          <ClassPill
            key={cls.id}
            cls={cls}
            variant={cls.type === 'promoted' ? 'promoted' : 'unpromoted'}
          />
        ))}
      </div>
    </div>
  );
}
