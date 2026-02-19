import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit } from '@/types/unit';
import { UnitCard } from './UnitCard';
import { StatTable } from './StatTable';
import { CombinedAverageStatsTable } from './CombinedAverageStatsTable';
import { calculateAverageStats, getMinLevel, getMaxLevel } from '@/lib/stats';

interface ComparisonGridProps {
  units: Unit[];
  showStats?: boolean;
  showGrowths?: boolean;
  showAverage?: boolean;
  className?: string;
}

export function ComparisonGrid({ 
  units, 
  showStats = true,
  showGrowths = true,
  showAverage = false,
  className 
}: ComparisonGridProps) {
  // Memoize level calculations for all units to avoid recalculation on re-renders
  const { minLevel, maxLevel } = useMemo(() => {
    return {
      minLevel: getMinLevel(units),
      maxLevel: getMaxLevel(units)
    };
  }, [units]);

  

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
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Comparing {units.length} unit{units.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Unit Cards Grid - Simplified headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
          />
        ))}
      </div>

      {/* Basic Unit Information - Horizontal */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Detail</th>
                  {units.map((unit) => (
                    <th key={`header-${unit.id}`} className="text-center p-2 font-medium">
                      {unit.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Class</td>
                  {units.map((unit) => (
                    <td key={`class-${unit.id}`} className="text-center p-2">
                      {unit.class}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Join Chapter</td>
                  {units.map((unit) => (
                    <td key={`join-${unit.id}`} className="text-center p-2">
                      {unit.joinChapter}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Level</td>
                  {units.map((unit) => (
                    <td key={`level-${unit.id}`} className="text-center p-2">
                      Lv. {unit.level}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Affinity</td>
                  {units.map((unit) => (
                    <td key={`affinity-${unit.id}`} className="text-center p-2">
                      {unit.affinity || '-'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Base Stats - Horizontal */}
      {showStats && (
        <Card>
          <CardHeader>
            <CardTitle>Base Stats</CardTitle>
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
                    <tr key={`base-${statKey}`} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">
                        {getStatLabel(statKey)}
                      </td>
                      {units.map((unit) => {
                        const baseValue = unit.stats[statKey] ?? '-';
                        
                        return (
                          <td key={`base-${statKey}-${unit.id}`} className="text-center p-2">
                            <span className="font-medium">{baseValue}</span>
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

      {/* Growth Rates - Horizontal */}
      {showStats && showGrowths && (
        <Card>
          <CardHeader>
            <CardTitle>Growth Rates</CardTitle>
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
                    <tr key={`growth-${statKey}`} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">
                        {getStatLabel(statKey)}
                      </td>
                      {units.map((unit) => {
                        const growthValue = unit.growths[statKey] ?? '-';
                        
                        return (
                          <td key={`growth-${statKey}-${unit.id}`} className="text-center p-2">
                            <span className="font-medium">{growthValue}{growthValue !== '-' ? '%' : ''}</span>
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

      {/* Supports - Horizontal */}
      {units.some(unit => unit.supports && unit.supports.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Supports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Support Partners</th>
                    {units.map((unit) => (
                      <th key={`header-${unit.id}`} className="text-center p-2 font-medium">
                        {unit.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">Supports</td>
                    {units.map((unit) => (
                      <td key={`supports-${unit.id}`} className="text-center p-2">
                        {unit.supports && unit.supports.length > 0 ? (
                          <div className="space-y-1">
                            {unit.supports.map((support, index) => (
                              <div key={index} className="text-sm">
                                {support}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combined Average Stats Table */}
      {showAverage && (
        <CombinedAverageStatsTable 
          units={units}
          maxLevel={maxLevel}
        />
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