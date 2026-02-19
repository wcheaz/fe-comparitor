import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit } from '@/types/unit';
import { calculateAverageStats } from '@/lib/stats';

interface StatTableProps {
  unit: Unit;
  targetLevel?: number;
  showGrowths?: boolean;
  showAverage?: boolean;
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
  con: 'Con',
  bld: 'Bld',
  mov: 'Mov',
  cha: 'Cha'
};

export function StatTable({ 
  unit, 
  targetLevel, 
  showGrowths = true, 
  showAverage = false, 
  className 
}: StatTableProps) {
  // Memoize average stats calculation to avoid recalculation on re-renders
  const averageStats = useMemo(() => {
    return targetLevel ? calculateAverageStats(unit, targetLevel) : null;
  }, [unit, targetLevel]);
  
  // Get all unique stat keys from stats, growths, and average stats
  const allStatKeys = new Set([
    ...Object.keys(unit.stats),
    ...Object.keys(unit.growths),
    ...(averageStats ? Object.keys(averageStats) : [])
  ]);

  const statKeys = Array.from(allStatKeys).filter(key => key in STAT_LABELS);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        {targetLevel && (
          <div className="text-sm text-muted-foreground">
            Level {targetLevel}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Stat</th>
                <th className="text-right p-2 font-medium">Base</th>
                {showGrowths && (
                  <th className="text-right p-2 font-medium">Growth</th>
                )}
                {showAverage && averageStats && (
                  <th className="text-right p-2 font-medium">Average</th>
                )}
              </tr>
            </thead>
            <tbody>
              {statKeys.map((statKey) => {
                const baseValue = unit.stats[statKey] ?? '-';
                const growthValue = unit.growths[statKey] ?? '-';
                const averageValue = averageStats?.[statKey] ?? '-';
                
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
                    {showAverage && averageStats && (
                      <td className="text-right p-2">
                        {typeof averageValue === 'number' ? averageValue.toFixed(1) : averageValue}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}