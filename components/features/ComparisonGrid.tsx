import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit } from '@/types/unit';
import { UnitCard } from './UnitCard';
import { StatTable } from './StatTable';
import { calculateAverageStats } from '@/lib/stats';

interface ComparisonGridProps {
  units: Unit[];
  targetLevel?: number;
  showStats?: boolean;
  showGrowths?: boolean;
  showAverage?: boolean;
  className?: string;
}

export function ComparisonGrid({ 
  units, 
  targetLevel, 
  showStats = true,
  showGrowths = true,
  showAverage = false,
  className 
}: ComparisonGridProps) {
  // Memoize calculated stats for all units to avoid recalculation on re-renders
  const calculatedStats = useMemo(() => {
    if (!targetLevel) return {};
    
    return units.reduce((acc, unit) => {
      acc[unit.id] = calculateAverageStats(unit, targetLevel);
      return acc;
    }, {} as Record<string, ReturnType<typeof calculateAverageStats>>);
  }, [units, targetLevel]);

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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Comparison</CardTitle>
          {targetLevel && (
            <div className="text-sm text-muted-foreground">
              Showing stats calculated at Level {targetLevel}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Comparing {units.length} unit{units.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Unit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            targetLevel={targetLevel}
            showStats={showStats}
          />
        ))}
      </div>

      {/* Stat Tables Grid */}
      {showStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {units.map((unit) => (
            <StatTable
              key={`stats-${unit.id}`}
              unit={unit}
              targetLevel={targetLevel}
              showGrowths={showGrowths}
              showAverage={showAverage}
            />
          ))}
        </div>
      )}

      {/* Side-by-side Stat Comparison */}
      {units.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Side-by-Side Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Stat</th>
                    {units.map((unit) => (
                      <th key={`header-${unit.id}`} className="text-center p-2 font-medium">
                        {unit.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getCommonStats(units).map((statKey) => (
                    <tr key={statKey} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">
                        {getStatLabel(statKey)}
                      </td>
                      {units.map((unit) => {
                        const baseValue = unit.stats[statKey] ?? '-';
                        const growthValue = unit.growths[statKey] ?? '-';
                        const averageValue = targetLevel 
                          ? calculatedStats[unit.id]?.[statKey] ?? '-'
                          : '-';
                        
                        return (
                          <td key={`${statKey}-${unit.id}`} className="text-center p-2">
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">Base: </span>
                                {baseValue}
                              </div>
                              {showGrowths && growthValue !== '-' && (
                                <div className="text-xs text-muted-foreground">
                                  Growth: {growthValue}%
                                </div>
                              )}
                              {showAverage && averageValue !== '-' && (
                                <div className="text-xs text-fe-blue-600">
                                  Avg: {typeof averageValue === 'number' ? averageValue.toFixed(1) : averageValue}
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function getCommonStats(units: Unit[]): string[] {
  const statSet = new Set<string>();
  
  units.forEach(unit => {
    Object.keys(unit.stats).forEach(stat => statSet.add(stat));
    Object.keys(unit.growths).forEach(stat => statSet.add(stat));
  });

  // Return stats in a logical order
  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'con', 'bld', 'mov', 'cha'];
  
  return statOrder.filter(stat => statSet.has(stat));
}

function getStatLabel(statKey: string): string {
  const labels: Record<string, string> = {
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
  
  return labels[statKey] || statKey.toUpperCase();
}