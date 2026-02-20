import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit, Class } from '@/types/unit';
import { UnitCard } from './UnitCard';
import { StatTable } from './StatTable';
import { getMinLevel, getMaxLevel } from '@/lib/stats';
import { getAllClasses } from '@/lib/data';

interface ComparisonGridProps {
  units: Unit[];
  showStats?: boolean;
  showGrowths?: boolean;
  className?: string;
}

export function ComparisonGrid({
  units,
  showStats = true,
  showGrowths = true,
  className
}: ComparisonGridProps) {
  // Memoize level calculations for all units to avoid recalculation on re-renders
  const { minLevel, maxLevel } = useMemo(() => {
    return {
      minLevel: getMinLevel(units),
      maxLevel: getMaxLevel(units)
    };
  }, [units]);

  const [classes, setClasses] = React.useState<Class[]>([]);

  React.useEffect(() => {
    getAllClasses().then(setClasses).catch(console.error);
  }, []); if (units.length === 0) {
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
                  {units.map((unit) => {
                    const cls = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_')) || classes.find(c => c.name === unit.class);
                    return (
                      <td key={`class-${unit.id}`} className="text-center p-2">
                        {cls ? cls.name : unit.class}
                      </td>
                    );
                  })}
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
                      Lv. {unit.level}{unit.isPromoted ? ' (Promoted)' : ''}
                    </td>
                  ))}
                </tr>
                {units.some(u => u.affinity) && (
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">Affinity</td>
                    {units.map((unit) => (
                      <td key={`affinity-${unit.id}`} className="text-center p-2">
                        {unit.affinity || '-'}
                      </td>
                    ))}
                  </tr>
                )}
                {units.some(u => u.baseWeaponRanks && Object.keys(u.baseWeaponRanks).length > 0) && (
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">Base Weapon Ranks</td>
                    {units.map((unit) => {
                      const ranks = unit.baseWeaponRanks || {};
                      const entries = Object.entries(ranks);
                      return (
                        <td key={`ranks-${unit.id}`} className="text-center p-2 text-sm">
                          {entries.length > 0 ? entries.map(([w, r]) => `${w}: ${r}`).join(', ') : '-'}
                        </td>
                      );
                    })}
                  </tr>
                )}
                {units.some(u => u.prf && u.prf.length > 0) && (
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">Prf Weapons</td>
                    {units.map((unit) => (
                      <td key={`prf-${unit.id}`} className="text-center p-2 text-sm">
                        {unit.prf && unit.prf.length > 0 ? unit.prf.join(', ') : '-'}
                      </td>
                    ))}
                  </tr>
                )}
                {units.some(u => (u.crests && u.crests.length > 0) || u.dragonVein) && (
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">Misc.</td>
                    {units.map((unit) => {
                      const miscItems = [];
                      if (unit.crests && unit.crests.length > 0) {
                        miscItems.push(`Crests: ${unit.crests.join(', ')}`);
                      }
                      if (unit.dragonVein) {
                        miscItems.push('Dragon Vein');
                      }

                      return (
                        <td key={`misc-${unit.id}`} className="text-center p-2 text-sm">
                          {miscItems.length > 0 ? (
                            <div className="space-y-1">
                              {miscItems.map((item, i) => (
                                <div key={i}>{item}</div>
                              ))}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )}

                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Promotes To</td>
                  {units.map((unit) => {
                    const cls = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_')) || classes.find(c => c.name === unit.class);
                    const promotesToNames = (cls?.promotesTo || []).map(id => {
                      const pCls = classes.find(c => c.id === id);
                      return pCls ? pCls.name : id;
                    });
                    return (
                      <td key={`promotes-${unit.id}`} className="text-center p-2 text-sm">
                        {promotesToNames.length > 0 ? promotesToNames.join(', ') : 'None'}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Class Modifiers</td>
                  {units.map((unit) => {
                    const cls = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_')) || classes.find(c => c.name === unit.class);

                    const allModifiers: string[] = [];

                    if (cls && cls.hiddenModifiers && cls.hiddenModifiers.length > 0) {
                      allModifiers.push(...cls.hiddenModifiers.map(m => `${m} (${cls.name})`));
                    }

                    if (cls && cls.promotesTo) {
                      cls.promotesTo.forEach(promoId => {
                        const pCls = classes.find(c => c.id === promoId);
                        if (pCls && pCls.hiddenModifiers && pCls.hiddenModifiers.length > 0) {
                          allModifiers.push(...pCls.hiddenModifiers.map(m => `${m} (${pCls.name})`));
                        }
                      });
                    }

                    return (
                      <td key={`modifiers-${unit.id}`} className="text-center p-2 text-sm">
                        {allModifiers.length > 0 ? (
                          <div className="space-y-1">
                            {allModifiers.map((mod, i) => (
                              <div key={i}>{mod}</div>
                            ))}
                          </div>
                        ) : 'None'}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Weapons</td>
                  {units.map((unit) => {
                    const cls = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_')) || classes.find(c => c.name === unit.class);
                    const weapons = cls?.weapons || [];

                    let weaponDisplay = 'None';
                    if (unit.game === 'Three Houses') {
                      const usesMagic = weapons.includes('Reason') || weapons.includes('Faith') || weapons.includes('Magic') || weapons.includes('Tomes') || weapons.includes('Staves') || weapons.includes('Dark Magic');
                      const usesGauntlets = weapons.includes('Fists') || weapons.includes('Gauntlets');

                      const parts = [];
                      parts.push(`Magic: ${usesMagic ? 'Yes' : 'No'}`);
                      parts.push(`Gauntlets: ${usesGauntlets ? 'Yes' : 'No'}`);
                      weaponDisplay = parts.join(', ');
                    } else if (weapons.length > 0) {
                      weaponDisplay = weapons.join(', ');
                    }

                    return (
                      <td key={`weapons-${unit.id}`} className="text-center p-2 text-sm">
                        {weaponDisplay}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Base Stats and Growth Rates - Side by Side */}
      {showStats && (
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="w-full md:w-1/2 min-w-0">
            <Card className="h-full">
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
                      {getCommonBaseStats(units).map((statKey) => {
                        const highlightStats = getHighlightStats(units, statKey, 'base');

                        return (
                          <tr key={`base-${statKey}`} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">
                              {getStatLabel(statKey)}
                            </td>
                            {units.map((unit, unitIndex) => {
                              const baseValue = unit.stats[statKey] ?? '-';
                              const highlight = highlightStats[unitIndex];

                              let highlightClass = '';
                              if (highlight.isHighest) {
                                highlightClass = 'bg-green-500/20';
                              } else if (highlight.isEqual) {
                                highlightClass = 'bg-yellow-500/20';
                              }

                              return (
                                <td
                                  key={`base-${statKey}-${unit.id}`}
                                  className={`text-center p-2 ${highlightClass}`}
                                >
                                  <span className="font-medium">{baseValue}</span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {showGrowths && (
            <div className="w-full md:w-1/2 min-w-0">
              <Card className="h-full">
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
                        {getCommonGrowthStats(units).map((statKey) => {
                          const highlightStats = getHighlightStats(units, statKey, 'growth');

                          return (
                            <tr key={`growth-${statKey}`} className="border-b hover:bg-muted/50">
                              <td className="p-2 font-medium">
                                {getStatLabel(statKey)}
                              </td>
                              {units.map((unit, unitIndex) => {
                                const growthValue = unit.growths[statKey] ?? '-';
                                const highlight = highlightStats[unitIndex];

                                let highlightClass = '';
                                if (highlight.isHighest) {
                                  highlightClass = 'bg-green-500/20';
                                } else if (highlight.isEqual) {
                                  highlightClass = 'bg-yellow-500/20';
                                }

                                return (
                                  <td
                                    key={`growth-${statKey}-${unit.id}`}
                                    className={`text-center p-2 ${highlightClass}`}
                                  >
                                    <span className="font-medium">{growthValue}{growthValue !== '-' ? '%' : ''}</span>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
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
  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov'];

  return statOrder.filter(stat => statSet.has(stat));
}

function getCommonBaseStats(units: Unit[]): string[] {
  if (units.length < 2) {
    return getCommonStats(units);
  }

  const commonStats: string[] = [];
  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov'];

  statOrder.forEach(statKey => {
    // Check if at least one unit has this base stat (non-zero and non-missing)
    // We treat 0 as "missing" for base stats like Bld/Cha/Mag in older games
    // Note: HP, Str, etc should never be naturally 0 base.
    const hasValidStat = units.some(unit =>
      unit.stats[statKey] !== undefined &&
      unit.stats[statKey] !== null &&
      unit.stats[statKey] !== 0
    );

    // Check if both units have missing or 0 base stat (filter out if both missing/zero)
    const bothMissingOrZero = units.every(unit =>
      unit.stats[statKey] === undefined ||
      unit.stats[statKey] === null ||
      unit.stats[statKey] === 0
    );

    if (hasValidStat && !bothMissingOrZero) {
      commonStats.push(statKey);
    }
  });

  return commonStats;
}

function getCommonGrowthStats(units: Unit[]): string[] {
  if (units.length < 2) {
    return getCommonStats(units);
  }

  const commonStats: string[] = [];
  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov'];

  statOrder.forEach(statKey => {
    // Check if at least one unit has this growth stat (non-zero and non-missing)
    const hasValidGrowth = units.some(unit =>
      unit.growths[statKey] !== undefined &&
      unit.growths[statKey] !== null &&
      unit.growths[statKey] !== 0
    );

    // Check if both units have missing or 0 growth (filter out if both missing/zero)
    const bothMissingOrZero = units.every(unit =>
      unit.growths[statKey] === undefined ||
      unit.growths[statKey] === null ||
      unit.growths[statKey] === 0
    );

    if (hasValidGrowth && !bothMissingOrZero) {
      commonStats.push(statKey);
    }
  });

  return commonStats;
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

function getHighlightStats(units: Unit[], statKey: string, statType: 'base' | 'growth'): { isHighest: boolean; isEqual: boolean }[] {
  return units.map((unit, index) => {
    const currentValue = statType === 'base'
      ? unit.stats[statKey]
      : unit.growths[statKey];

    // If current value is undefined, no highlight
    if (currentValue === undefined || currentValue === null) {
      return { isHighest: false, isEqual: false };
    }

    // Check if this value is strictly greater than all other units' values
    const isHighest = units.every((otherUnit, otherIndex) => {
      if (otherIndex === index) return true; // Skip comparing with self

      const otherValue = statType === 'base'
        ? otherUnit.stats[statKey]
        : otherUnit.growths[statKey];

      // If other value is undefined/null, current value is considered higher
      if (otherValue === undefined || otherValue === null) {
        return true;
      }

      // Current value must be strictly greater than other value
      return currentValue > otherValue;
    });

    // Check if all non-undefined values are equal
    const allValues = units.map(u =>
      statType === 'base' ? u.stats[statKey] : u.growths[statKey]
    ).filter(val => val !== undefined && val !== null);

    const isEqual = allValues.length > 1 && allValues.every(val => val === currentValue) && currentValue !== 0;

    return { isHighest, isEqual };
  });
}