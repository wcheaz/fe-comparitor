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
  mov: 'Mov',
  aid: 'Aid'
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

  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov', 'aid'];

  // Create a base set of keys to display
  let statKeys = statOrder.filter(key => allStatKeys.has(key));

  // If both skl and dex exist, we only want to show one combined row
  const hasSkl = allStatKeys.has('skl');
  const hasDex = allStatKeys.has('dex');

  if (hasSkl && hasDex) {
    // Keep 'skl' as the representative key for the combined row, remove 'dex'
    statKeys = statKeys.filter(key => key !== 'dex');
  }

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
            // For combined skl/dex row, we need to pull from either stat
            let baseValue = unit.stats[statKey] ?? '-';
            let growthValue = unit.growths[statKey] ?? '-';

            if (statKey === 'skl' && hasDex && !allStatKeys.has('skl')) {
              // If it's a dex-only unit but we're processing 'skl' as the representative key
              baseValue = unit.stats['dex'] ?? '-';
              growthValue = unit.growths['dex'] ?? '-';
            } else if (statKey === 'skl' && hasSkl && hasDex && (unit.stats['skl'] === undefined || unit.stats['skl'] === null)) {
              // If it's the combined row, but this specific unit only has dex
              baseValue = unit.stats['dex'] ?? '-';
              growthValue = unit.growths['dex'] ?? '-';
            }

            return (
              <tr key={statKey} className="border-b hover:bg-muted/50">
                <td className="p-2 font-medium">
                  {statKey === 'str' && !allStatKeys.has('mag') ? 'Str/Mag' :
                    statKey === 'skl' && hasDex ? (hasSkl ? 'Skl/Dex' : 'Dex') :
                      statKey === 'skl' ? 'Skl' :
                        (STAT_LABELS[statKey] || statKey.toUpperCase())}
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