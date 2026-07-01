'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Unit, UnitStats, Class, PromotionEvent, ReclassEvent } from '@/types/unit';
import { generateProgressionArray, getEffectiveGrowths } from '@/lib/stats';
import { getAllClasses } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillPill from '@/components/ui/SkillPill';

const PRIMARY_STAT_ORDER = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha'];
const SECONDARY_STAT_ORDER = ['mov', 'con', 'bld', 'aid'];

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  str: 'Str',
  mag: 'Mag',
  skl: 'Skl',
  dex: 'Dex',
  spd: 'Spd',
  lck: 'Lck',
  def: 'Def',
  res: 'Res',
  cha: 'Cha',
  mov: 'Move',
  con: 'Con',
  bld: 'Build',
  aid: 'Aid',
};

interface ProgressionRow {
  internalLevel: number;
  displayLevel: string;
  tier: number;
  class: string;
  stats: UnitStats;
  cappedStats: Record<string, boolean>;
  isSkipped: boolean;
  isPromotionLevel: boolean;
  isReclassLevel: boolean;
  promotionInfo?: { className: string; classSkills: string[] };
  reclassInfo?: { className: string };
}

interface LevelComparisonProps {
  unitA: Unit;
  unitB: Unit;
  promotionEventsA?: PromotionEvent[];
  promotionEventsB?: PromotionEvent[];
  reclassEventsA?: ReclassEvent[];
  reclassEventsB?: ReclassEvent[];
  selectedDifficultyA?: string;
  selectedDifficultyB?: string;
  classes?: Class[];
}

function cleanSkillName(skill: string): string {
  return skill.replace(/\s*\(Lv\.\s*\d+\)\s*$/, '').trim();
}

function extractSkillLevel(skill: string): number | null {
  const match = skill.match(/\(Lv\.\s*(\d+)\)/);
  return match ? parseInt(match[1], 10) : null;
}

function bucketLevel(level: number): 1 | 5 | 10 {
  if (level <= 1) return 1;
  if (level <= 5) return 5;
  return 10;
}

type SkillTierVariant =
  | 'unpromoted-lv1'
  | 'unpromoted-lv5'
  | 'unpromoted-lv10'
  | 'promoted-lv1'
  | 'promoted-lv5'
  | 'promoted-lv10';

function getSkillVariant(
  skillName: string,
  game: string,
  classes: Class[]
): SkillTierVariant | undefined {
  for (const cls of classes) {
    if (cls.game !== game || !cls.classSkills) continue;
    for (const raw of cls.classSkills) {
      if (cleanSkillName(raw) === skillName) {
        const level = extractSkillLevel(raw) ?? 1;
        const bucketed = bucketLevel(level);
        const tier = cls.type === 'trainee' ? 'unpromoted' : cls.type;
        return `${tier}-lv${bucketed}` as SkillTierVariant;
      }
    }
  }
  return undefined;
}

function parseDisplayLevelNum(displayLevel: string): number {
  const match = displayLevel.match(/^Level\s+(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function findClassByName(classes: Class[], name: string, game: string): Class | undefined {
  return classes.find(c => c.name === name && c.game === game);
}

function findClassById(classes: Class[], id: string, game: string): Class | undefined {
  const normalized = id.toLowerCase().replace(/\s+/g, '_');
  return classes.find(c =>
    (c.id === normalized || c.id === id || c.name === id) && c.game === game
  );
}

function buildOptionLabel(row: ProgressionRow): string {
  const levelNum = parseDisplayLevelNum(row.displayLevel);
  let label = `Level ${levelNum} (${row.class})`;
  if (row.tier === 0) {
    label += ' (Trainee)';
  } else if (row.tier > 1) {
    label += ` (Tier ${row.tier})`;
  }
  return label;
}

function computeHasSkills(
  unit: Unit,
  steps: ProgressionRow[],
  selectedIndex: number,
  classes: Class[]
): string[] {
  const hasSkills = new Set<string>();
  const initial = unit.startingSkills || unit.skills || [];
  initial.forEach(s => hasSkills.add(cleanSkillName(s)));

  for (let i = 0; i <= selectedIndex && i < steps.length; i++) {
    const step = steps[i];
    const cls = findClassByName(classes, step.class, unit.game);
    if (!cls || !cls.classSkills) continue;
    const lvl = parseDisplayLevelNum(step.displayLevel);
    for (const skill of cls.classSkills) {
      const reqLevel = extractSkillLevel(skill);
      if (reqLevel === null || lvl >= reqLevel) {
        hasSkills.add(cleanSkillName(skill));
      }
    }
  }

  return Array.from(hasSkills);
}

function computePossibleSkills(
  unit: Unit,
  hasSkills: Set<string>,
  classes: Class[]
): string[] {
  if (!unit.reclassOptions || unit.reclassOptions.length === 0) return [];

  const possible = new Set<string>();
  const collect = (cls: Class | undefined) => {
    if (!cls || !cls.classSkills) return;
    for (const skill of cls.classSkills) {
      const cleaned = cleanSkillName(skill);
      if (!hasSkills.has(cleaned)) {
        possible.add(cleaned);
      }
    }
  };

  for (const reclassId of unit.reclassOptions) {
    const reclassCls = findClassById(classes, reclassId, unit.game);
    collect(reclassCls);
    if (reclassCls?.promotesTo) {
      for (const promotesToId of reclassCls.promotesTo) {
        collect(findClassById(classes, promotesToId, unit.game));
      }
    }
  }

  if (unit.reclassOptions.includes('tactician')) {
    collect(findClassById(classes, 'grandmaster', unit.game));
  }
  if (unit.reclassOptions.includes('villager')) {
    collect(findClassById(classes, 'fighter', unit.game));
    collect(findClassById(classes, 'mercenary', unit.game));
  }

  return Array.from(possible);
}

export function LevelComparison({
  unitA,
  unitB,
  promotionEventsA = [],
  promotionEventsB = [],
  reclassEventsA = [],
  reclassEventsB = [],
  selectedDifficultyA,
  selectedDifficultyB,
  classes: propClasses,
}: LevelComparisonProps) {
  const [internalClasses, setInternalClasses] = useState<Class[]>([]);
  const classes = propClasses ?? internalClasses;

  useEffect(() => {
    if (propClasses) return;
    let cancelled = false;
    getAllClasses()
      .then(all => {
        if (!cancelled) setInternalClasses(all);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [propClasses]);

  const stepsA = useMemo<ProgressionRow[]>(() => {
    if (classes.length === 0) return [];
    const all = generateProgressionArray(
      unitA,
      undefined,
      undefined,
      classes,
      promotionEventsA,
      reclassEventsA,
      selectedDifficultyA
    ) as unknown as ProgressionRow[];
    return all.filter(row => !row.isSkipped);
  }, [unitA, classes, promotionEventsA, reclassEventsA, selectedDifficultyA]);

  const stepsB = useMemo<ProgressionRow[]>(() => {
    if (classes.length === 0) return [];
    const all = generateProgressionArray(
      unitB,
      undefined,
      undefined,
      classes,
      promotionEventsB,
      reclassEventsB,
      selectedDifficultyB
    ) as unknown as ProgressionRow[];
    return all.filter(row => !row.isSkipped);
  }, [unitB, classes, promotionEventsB, reclassEventsB, selectedDifficultyB]);

  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(0);

  useEffect(() => {
    if (stepsA.length > 0 && indexA > stepsA.length - 1) {
      setIndexA(stepsA.length - 1);
    }
  }, [stepsA.length, indexA]);

  useEffect(() => {
    if (stepsB.length > 0 && indexB > stepsB.length - 1) {
      setIndexB(stepsB.length - 1);
    }
  }, [stepsB.length, indexB]);

  if (classes.length === 0 || stepsA.length === 0 || stepsB.length === 0) {
    return (
      <Card data-testid="level-comparison">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">Loading level comparison…</div>
        </CardContent>
      </Card>
    );
  }

  const safeIndexA = Math.min(indexA, stepsA.length - 1);
  const safeIndexB = Math.min(indexB, stepsB.length - 1);
  const stepA = stepsA[safeIndexA];
  const stepB = stepsB[safeIndexB];
  const statsA = stepA.stats;
  const statsB = stepB.stats;

  const primaryKeys = PRIMARY_STAT_ORDER.filter(
    k => statsA[k] !== undefined || statsB[k] !== undefined
  );
  const secondaryKeys = SECONDARY_STAT_ORDER.filter(
    k => statsA[k] !== undefined || statsB[k] !== undefined
  );

  const isAwakeningA = unitA.game === 'Awakening';
  const isAwakeningB = unitB.game === 'Awakening';
  const hasSkillsA = isAwakeningA
    ? computeHasSkills(unitA, stepsA, safeIndexA, classes)
    : [];
  const possibleSkillsA = isAwakeningA
    ? computePossibleSkills(unitA, new Set(hasSkillsA), classes)
    : [];
  const hasSkillsB = isAwakeningB
    ? computeHasSkills(unitB, stepsB, safeIndexB, classes)
    : [];
  const possibleSkillsB = isAwakeningB
    ? computePossibleSkills(unitB, new Set(hasSkillsB), classes)
    : [];

  const classA = findClassByName(classes, stepA.class, unitA.game);
  const growthsA = isAwakeningA ? getEffectiveGrowths(unitA, classA) : unitA.growths;
  const classB = findClassByName(classes, stepB.class, unitB.game);
  const growthsB = isAwakeningB ? getEffectiveGrowths(unitB, classB) : unitB.growths;

  const growthKeys = PRIMARY_STAT_ORDER.filter(
    k => growthsA[k] !== undefined || growthsB[k] !== undefined
  );

  const renderStatRow = (key: string) => {
    const valA = statsA[key];
    const valB = statsB[key];
    const aHas = valA !== undefined;
    const bHas = valB !== undefined;
    const numA = aHas ? (valA as number) : 0;
    const numB = bHas ? (valB as number) : 0;
    const diff = Math.round((numA - numB) * 100) / 100;
    const aHigher = aHas && (!bHas || numA > numB);
    const bHigher = bHas && (!aHas || numB > numA);
    const aCapped = !!stepA.cappedStats[key];
    const bCapped = !!stepB.cappedStats[key];
    const label = STAT_LABELS[key] || key;

    return (
      <tr key={key} data-stat={key}>
        <td className="px-3 py-2 text-sm font-medium text-gray-700">{label}</td>
        <td className={`px-3 py-2 text-sm text-center ${aHigher ? 'bg-green-500/20' : ''}`}>
          <span className={aCapped ? 'text-green-600 font-bold' : ''}>{aHas ? numA : '—'}</span>
        </td>
        <td className={`px-3 py-2 text-sm text-center ${bHigher ? 'bg-green-500/20' : ''}`}>
          <span className={bCapped ? 'text-green-600 font-bold' : ''}>{bHas ? numB : '—'}</span>
        </td>
        <td
          className={`px-3 py-2 text-sm text-center font-mono ${
            diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          {aHas && bHas ? (diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)) : '—'}
        </td>
      </tr>
    );
  };

  const renderGrowthRow = (key: string) => {
    const valA = growthsA[key];
    const valB = growthsB[key];
    const aHas = valA !== undefined;
    const bHas = valB !== undefined;
    const numA = aHas ? (valA as number) : 0;
    const numB = bHas ? (valB as number) : 0;
    const diff = numA - numB;
    const aHigher = aHas && (!bHas || numA > numB);
    const bHigher = bHas && (!aHas || numB > numA);
    const label = STAT_LABELS[key] || key;

    return (
      <tr key={key} data-growth={key}>
        <td className="px-3 py-2 text-sm font-medium text-gray-700">{label}</td>
        <td className={`px-3 py-2 text-sm text-center ${aHigher ? 'bg-green-500/20' : ''}`}>
          {aHas ? `${numA}%` : '—'}
        </td>
        <td className={`px-3 py-2 text-sm text-center ${bHigher ? 'bg-green-500/20' : ''}`}>
          {bHas ? `${numB}%` : '—'}
        </td>
        <td
          className={`px-3 py-2 text-sm text-center font-mono ${
            diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          {aHas && bHas ? (diff > 0 ? `+${diff}%` : `${diff}%`) : '—'}
        </td>
      </tr>
    );
  };

  return (
    <Card data-testid="level-comparison">
      <CardHeader>
        <CardTitle className="text-xl">Level Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-fe-blue-900">{unitA.name}</label>
            <select
              aria-label={`Level selector for ${unitA.name}`}
              data-testid="level-select-a"
              value={safeIndexA}
              onChange={e => setIndexA(parseInt(e.target.value, 10))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {stepsA.map((row, i) => (
                <option key={i} value={i}>
                  {buildOptionLabel(row)}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">Class: {stepA.class}</p>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-fe-blue-900">{unitB.name}</label>
            <select
              aria-label={`Level selector for ${unitB.name}`}
              data-testid="level-select-b"
              value={safeIndexB}
              onChange={e => setIndexB(parseInt(e.target.value, 10))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {stepsB.map((row, i) => (
                <option key={i} value={i}>
                  {buildOptionLabel(row)}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">Class: {stepB.class}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Stat</th>
                <th className="px-3 py-2 text-center text-sm font-semibold text-fe-blue-700">
                  {unitA.name}
                </th>
                <th className="px-3 py-2 text-center text-sm font-semibold text-fe-blue-700">
                  {unitB.name}
                </th>
                <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700">Diff</th>
              </tr>
            </thead>
            <tbody>
              {primaryKeys.map(k => renderStatRow(k))}
              {secondaryKeys.length > 0 && (
                <tr key="__secondary__" className="border-t">
                  <td colSpan={4} className="px-3 py-1 text-xs font-semibold uppercase text-gray-500">
                    Secondary Stats
                  </td>
                </tr>
              )}
              {secondaryKeys.map(k => renderStatRow(k))}
            </tbody>
          </table>
        </div>

        <div data-testid="growth-rates-section" className="overflow-x-auto">
          <h4 className="mb-2 text-sm font-semibold text-fe-blue-900">Effective Growth Rates</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Stat</th>
                <th className="px-3 py-2 text-center text-sm font-semibold text-fe-blue-700">
                  {unitA.name}
                </th>
                <th className="px-3 py-2 text-center text-sm font-semibold text-fe-blue-700">
                  {unitB.name}
                </th>
                <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700">Diff</th>
              </tr>
            </thead>
            <tbody>
              {growthKeys.length === 0 ? (
                <tr key="__no-growth__">
                  <td colSpan={4} className="px-3 py-2 text-center text-xs text-muted-foreground">
                    No growth rate data available.
                  </td>
                </tr>
              ) : (
                growthKeys.map(k => renderGrowthRow(k))
              )}
            </tbody>
          </table>
        </div>

        {(isAwakeningA || isAwakeningB) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isAwakeningA && (
              <SkillList
                unit={unitA}
                classes={classes}
                hasSkills={hasSkillsA}
                possibleSkills={possibleSkillsA}
              />
            )}
            {isAwakeningB && (
              <SkillList
                unit={unitB}
                classes={classes}
                hasSkills={hasSkillsB}
                possibleSkills={possibleSkillsB}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SkillListProps {
  unit: Unit;
  classes: Class[];
  hasSkills: string[];
  possibleSkills: string[];
}

function SkillList({ unit, classes, hasSkills, possibleSkills }: SkillListProps) {
  return (
    <div data-testid={`skills-${unit.id}`} className="space-y-3">
      <h4 className="text-sm font-semibold text-fe-blue-900">{unit.name} — Skills</h4>
      <div className="space-y-2">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Has Skills</p>
          <div data-testid={`has-skills-${unit.id}`} className="flex flex-wrap gap-1.5">
            {hasSkills.length === 0 ? (
              <span className="text-xs text-muted-foreground">None</span>
            ) : (
              hasSkills.map(s => (
                <SkillPill
                  key={s}
                  skill={s}
                  game={unit.game}
                  variant={getSkillVariant(s, unit.game, classes)}
                />
              ))
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Possible Skills</p>
          <div data-testid={`possible-skills-${unit.id}`} className="flex flex-wrap gap-1.5">
            {possibleSkills.length === 0 ? (
              <span className="text-xs text-muted-foreground">None</span>
            ) : (
              possibleSkills.map(s => (
                <SkillPill
                  key={s}
                  skill={s}
                  game={unit.game}
                  variant={getSkillVariant(s, unit.game, classes)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
