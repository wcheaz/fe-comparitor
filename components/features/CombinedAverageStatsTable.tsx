import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit } from '@/types/unit';
import { calculateAverageStats } from '@/lib/stats';

interface CombinedAverageStatsTableProps {
  units: Unit[];
  maxLevel: number;
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

export function CombinedAverageStatsTable({ 
  units, 
  maxLevel, 
  className 
}: CombinedAverageStatsTableProps) {
  if (units.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">No Units Selected</h3>
            <p>Select units to compare their stats and growth rates.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the minimum base level among all units
  const minLevel = Math.min(...units.map(unit => unit.level));

  // Get all unique stat keys from all units
  const allStatKeys = new Set<string>();
  units.forEach(unit => {
    Object.keys(unit.stats).forEach(stat => allStatKeys.add(stat));
    Object.keys(unit.growths).forEach(stat => allStatKeys.add(stat));
  });

  const statKeys = Array.from(allStatKeys).filter(key => key in STAT_LABELS);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Combined Average Stats</CardTitle>
        <div className="text-sm text-muted-foreground">
          Showing stats from Level {minLevel} to {maxLevel}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Level</th>
                {units.map((unit) => (
                  <th key={`header-${unit.id}`} className="text-center p-2 font-medium">
                    {unit.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Render a row for each level from minLevel to maxLevel */}
              {Array.from({ length: maxLevel - minLevel + 1 }, (_, index) => {
                const rowLevel = minLevel + index;
                
                return (
                  <tr key={`level-${rowLevel}`} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">
                      Level {rowLevel}
                    </td>
                    {units.map((unit) => {
                      // Check if rowLevel < unit.level
                      if (rowLevel < unit.level) {
                        return (
                          <td key={`unit-${unit.id}-level-${rowLevel}`} className="text-center p-2">
                            <span className="text-muted-foreground">-</span>
                          </td>
                        );
                      }
                      
                      // If rowLevel >= unit.level, calculate average stats
                      const averageStats = calculateAverageStats(unit, rowLevel);
                      
                      // Create a summary cell showing total stats for this level
                      const totalStats = statKeys.reduce((sum, statKey) => {
                        const statValue = averageStats[statKey] || 0;
                        return sum + statValue;
                      }, 0);
                      
                      return (
                        <td key={`unit-${unit.id}-level-${rowLevel}`} className="text-center p-2">
                          <span className="font-medium text-fe-blue-600">
                            {totalStats.toFixed(1)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p><span className="text-muted-foreground">-</span> Unit not available at this level</p>
          <p>Numbers show total stats (sum of all stats) at that level</p>
        </div>
      </CardContent>
    </Card>
  );
}