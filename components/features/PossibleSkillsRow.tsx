import React from 'react';
import { cn } from "@/lib/utils";
import { Unit, Class } from '@/types/unit';
import SkillPill from '@/components/ui/SkillPill';

interface PossibleSkillsRowProps {
  unit: Unit;
  classes: Class[];
  className?: string;
}

interface SkillMeta {
  classNames: string[];
  tier: 'unpromoted' | 'promoted' | 'trainee';
}

function findClassById(classes: Class[], id: string, game: string): Class | undefined {
  const normalized = id.toLowerCase().replace(/\s+/g, '_');
  return classes.find(c =>
    (c.id === normalized || c.id === id || c.name === id) && c.game === game
  );
}

function bucketLevel(level: number): 1 | 5 | 10 {
  if (level <= 1) return 1;
  if (level <= 5) return 5;
  return 10;
}

function resolveVariant(tier: string, skillName: string): "unpromoted-lv1" | "unpromoted-lv5" | "unpromoted-lv10" | "promoted-lv1" | "promoted-lv5" | "promoted-lv10" {
  const match = skillName.match(/\(Lv\.\s*(\d+)\)/);
  const level = match ? parseInt(match[1], 10) : 1;
  const bucketed = bucketLevel(level);
  const effectiveTier = tier === 'trainee' ? 'unpromoted' : tier;
  return `${effectiveTier}-lv${bucketed}` as typeof resolveVariant extends (...args: unknown[]) => infer R ? R : never;
}

function addSkill(
  map: Map<string, SkillMeta>,
  skill: string,
  cls: Class
) {
  const existing = map.get(skill);
  if (existing) {
    if (!existing.classNames.includes(cls.name)) {
      existing.classNames.push(cls.name);
    }
  } else {
    map.set(skill, {
      classNames: [cls.name],
      tier: cls.type,
    });
  }
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

  const skillMap = new Map<string, SkillMeta>();

  for (const reclassId of unit.reclassOptions) {
    const reclassCls = findClassById(classes, reclassId, unit.game);
    if (!reclassCls) continue;

    for (const skill of reclassCls.classSkills || []) {
      if (currentSkills.has(skill)) continue;
      addSkill(skillMap, skill, reclassCls);
    }

    for (const promotesToId of reclassCls.promotesTo || []) {
      const promotedCls = findClassById(classes, promotesToId, unit.game);
      if (!promotedCls) continue;

      for (const skill of promotedCls.classSkills || []) {
        if (currentSkills.has(skill)) continue;
        addSkill(skillMap, skill, promotedCls);
      }
    }
  }

  if (skillMap.size === 0) {
    return <span className="text-muted-foreground">None</span>;
  }

  const entries = Array.from(skillMap.entries());

  const traineeSkills = entries.filter(([_, meta]) => meta.tier === 'trainee');
  const unpromotedSkills = entries.filter(([_, meta]) => meta.tier === 'unpromoted');
  const promotedSkills = entries.filter(([_, meta]) => meta.tier === 'promoted');

  const groups = [
    { key: 'trainee', items: traineeSkills },
    { key: 'unpromoted', items: unpromotedSkills },
    { key: 'promoted', items: promotedSkills }
  ].filter(group => group.items.length > 0);

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {groups.map(group => (
        <div key={group.key} className="flex flex-wrap justify-center gap-1.5">
          {group.items.map(([skill, meta]) => (
            <div key={skill} className="flex flex-col items-center gap-0.5">
              <SkillPill
                skill={skill}
                game={unit.game}
                variant={resolveVariant(meta.tier, skill)}
              />
              <span className="text-[10px] text-muted-foreground leading-tight">
                {meta.classNames.join(', ')}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
