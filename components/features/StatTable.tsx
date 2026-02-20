import React from 'react';
import { Unit } from '@/types/unit';

interface StatTableProps {
  unit: Unit;
  showGrowths?: boolean;
  className?: string;
}

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
  con: 'Con',
  bld: 'Bld',
  mov: 'Mov'
};

export function StatTable({
  unit,
  showGrowths = true,
  className
}: StatTableProps) {
  // Get all unique stat keys from stats and growths
  const allStatKeys = new Set([
    ...Object.keys(unit.stats),
    ...Object.keys(unit.growths)
  ]);

  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov'];
  const statKeys = statOrder.filter(key => allStatKeys.has(key));

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 font-medium">Stat</th>
            <th className="text-right p-2 font-medium">Base</th>
            {showGrowths && (
              <th className="text-right p-2 font-medium">Growth</th>
            )}
          </tr>
        </thead>
        <tbody>
          {statKeys.map((statKey) => {
            const baseValue = unit.stats[statKey] ?? '-';
            const growthValue = unit.growths[statKey] ?? '-';

            return (
              <tr key={statKey} className="border-b hover:bg-muted/50">
                <td className="p-2 font-medium">
                  {STAT_LABELS[statKey] || statKey.toUpperCase()}
                </td>
                <td className="text-right p-2">{baseValue}</td>
                {showGrowths && (
                  <td className="text-right p-2">
                    {growthValue !== '-' ? `${growthValue}%` : '-'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}