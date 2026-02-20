'use client';

import React, { useState, useMemo } from 'react';
import { Unit, UnitStats, Class } from '@/types/unit';
import { generateProgressionArray } from '@/lib/stats';
import { getAllClasses } from '@/lib/data';

interface StatProgressionTableProps {
  units: Unit[];
}

interface ProgressionRow {
  internalLevel: number;
  displayLevel: string;
  stats: UnitStats[];
  cappedStats: Record<string, boolean>[];
  isPromotionLevel: boolean;
  promotionInfo?: {
    className: string;
    hiddenModifiers: string[];
  };
}

export function StatProgressionTable({ units }: StatProgressionTableProps) {
  const [expandToLevel100, setExpandToLevel100] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);

  // Load classes data
  React.useEffect(() => {
    const loadClasses = async () => {
      const allClasses = await getAllClasses();
      setClasses(allClasses);
    };
    loadClasses();
  }, []);

  // Calculate progression data
  const progressionData = useMemo(() => {
    if (units.length === 0) return { rows: [], statKeys: [] };

    const getEffectiveLevel = (u: Unit) => u.isPromoted ? u.level + 20 : u.level;
    const minLevel = Math.min(...units.map(getEffectiveLevel));
    const maxLevel = Math.max(expandToLevel100 ? 100 : 40, ...units.map(getEffectiveLevel));

    // Generate progression arrays for all units
    const allProgressions = units.map(unit =>
      generateProgressionArray(unit, minLevel, maxLevel, classes)
    );

    // Get all stat keys from all units
    const allStatKeys = new Set<string>();
    units.forEach(unit => {
      Object.keys(unit.stats).forEach(key => allStatKeys.add(key));
    });

    // Define proper stat order and filter display stats
    const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov'];
    const displayStats = statOrder.filter(key =>
      allStatKeys.has(key) && !['mov', 'con', 'bld', 'cha'].includes(key)
    );

    // Create rows by aligning progression data from all units
    const rows: ProgressionRow[] = [];
    const totalLevels = maxLevel - minLevel + 1;

    for (let i = 0; i < totalLevels; i++) {
      const currentInternalLevel = minLevel + i;
      let displayLevel = `Level ${currentInternalLevel}`;
      let isPromotionLevel = false;

      if (currentInternalLevel === 20) {
        displayLevel = `Level 20`;
        isPromotionLevel = true;
      } else if (currentInternalLevel === 21) {
        displayLevel = "Level 1 (Promoted)";
      } else if (currentInternalLevel > 21) {
        displayLevel = `Level ${currentInternalLevel - 20} (Promoted)`;
      }

      const rowData: ProgressionRow = {
        internalLevel: currentInternalLevel,
        displayLevel,
        stats: [],
        cappedStats: [],
        isPromotionLevel
      };

      // Collect data for each unit at this level index
      for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
        const unitProgression = allProgressions[unitIndex];
        const levelData = unitProgression[i];

        if (levelData) {
          if (levelData.promotionInfo && !rowData.promotionInfo) {
            rowData.promotionInfo = levelData.promotionInfo;
          }

          rowData.stats.push(levelData.stats);
          rowData.cappedStats.push(levelData.cappedStats);
        } else {
          // Fallback for missing data
          rowData.stats.push({});
          rowData.cappedStats.push({});
        }
      }

      rows.push(rowData);
    }

    return { rows, statKeys: displayStats };
  }, [units, expandToLevel100, classes]);

  if (units.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Select units to view stat progression
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Average Stats</h2>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={expandToLevel100}
              onChange={(e) => setExpandToLevel100(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Expand to Level 100</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                Level
              </th>
              {units.map((unit, unitIndex) => (
                <th
                  key={unit.id}
                  colSpan={progressionData.statKeys.length}
                  className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-900 bg-gray-100"
                >
                  {unit.name}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
              </th>
              {units.map((unit, unitIndex) => (
                <React.Fragment key={unit.id}>
                  {progressionData.statKeys.map(statKey => (
                    <th
                      key={`${unit.id}-${statKey}`}
                      className="border border-gray-300 px-2 py-1 text-center text-xs font-medium text-gray-700 bg-gray-50"
                    >
                      {statKey.toUpperCase()}
                    </th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {progressionData.rows.map((row, rowIndex) => (
              <tr key={row.internalLevel} className={`${row.isPromotionLevel ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900 sticky left-0 bg-white">
                  {row.displayLevel}
                </td>
                {units.map((unit, unitIndex) => (
                  <React.Fragment key={`${row.internalLevel}-${unit.id}`}>
                    {progressionData.statKeys.map(statKey => {
                      const unitStats = row.stats[unitIndex];
                      const unitCappedStats = row.cappedStats[unitIndex];
                      const statValue = unitStats[statKey];
                      const isCapped = unitCappedStats?.[statKey];
                      const effectiveUnitLevel = unit.isPromoted ? unit.level + 20 : unit.level;
                      const shouldShowDash = row.internalLevel < effectiveUnitLevel;

                      return (
                        <td
                          key={`${row.internalLevel}-${unit.id}-${statKey}`}
                          className={`border border-gray-300 px-2 py-1 text-center text-sm ${row.isPromotionLevel ? 'bg-blue-100' : ''} ${isCapped ? 'text-green-600 font-bold' : ''}`}
                        >
                          {shouldShowDash ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            <span>
                              {statValue !== undefined ? Math.round(statValue) : '-'}
                              {/* Highlight promotion level */}
                              {row.isPromotionLevel && (
                                <span className="ml-1 text-xs text-blue-600">✨</span>
                              )}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold">
            Legend:
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-blue-600">✨</span>
            <span>Promotion level</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">-</span>
            <span>Unit not yet available at this level</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-green-600 font-bold">20</span>
            <span>Stat capped</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300"></div>
            <span>Promotion level row</span>
          </div>
        </div>
      </div>
    </div>
  );
}