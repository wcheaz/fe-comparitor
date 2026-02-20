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

    const minLevel = Math.min(...units.map(unit => unit.level));
    const maxLevel = expandToLevel100 ? 100 : 40;

    // Generate progression arrays for all units
    const allProgressions = units.map(unit => 
      generateProgressionArray(unit, minLevel, maxLevel, classes)
    );

    // Get all stat keys from all units
    const allStatKeys = new Set<string>();
    units.forEach(unit => {
      Object.keys(unit.stats).forEach(key => allStatKeys.add(key));
    });

    // Remove movement and build/constitution from display stats
    const displayStats = Array.from(allStatKeys).filter(key => 
      !['mov', 'con', 'bld', 'cha'].includes(key)
    ).sort();

    // Create rows by aligning progression data from all units
    const rows: ProgressionRow[] = [];
    const totalLevels = maxLevel - minLevel + 1;
    
    for (let i = 0; i < totalLevels; i++) {
      const rowData: ProgressionRow = {
        internalLevel: minLevel + i,
        displayLevel: `Level ${minLevel + i}`,
        stats: [],
        isPromotionLevel: false
      };
      
      // Collect data for each unit at this level index
      for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
        const unitProgression = allProgressions[unitIndex];
        const levelData = unitProgression[i];
        
        if (levelData) {
          // Use the display level and promotion info from the first unit's progression
          if (unitIndex === 0) {
            rowData.displayLevel = levelData.displayLevel;
            rowData.isPromotionLevel = levelData.isPromotionLevel;
            rowData.promotionInfo = levelData.promotionInfo;
          }
          
          rowData.stats.push(levelData.stats);
        } else {
          // Fallback for missing data
          rowData.stats.push({});
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
        <h2 className="text-xl font-semibold">Stat Progression Table</h2>
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
                  {/* Show hidden modifiers on promotion level */}
                  {row.promotionInfo?.hiddenModifiers && row.promotionInfo.hiddenModifiers.length > 0 && (
                    <div className="text-xs text-blue-600">
                      {row.promotionInfo.hiddenModifiers.join(', ')}
                    </div>
                  )}
                </td>
                {units.map((unit, unitIndex) => (
                  <React.Fragment key={`${row.internalLevel}-${unit.id}`}>
                    {progressionData.statKeys.map(statKey => {
                      const unitStats = row.stats[unitIndex];
                      const statValue = unitStats[statKey];
                      const shouldShowDash = row.internalLevel < unit.level;
                      
                      return (
                        <td 
                          key={`${row.internalLevel}-${unit.id}-${statKey}`}
                          className={`border border-gray-300 px-2 py-1 text-center text-sm ${
                            row.isPromotionLevel ? 'bg-blue-100' : ''
                          }`}
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
          <div className="flex items-center space-x-1">
            <span className="text-blue-600">✨</span>
            <span>Promotion level</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-blue-600">+30 Crit, Flying, etc.</span>
            <span>Hidden class modifiers</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">-</span>
            <span>Unit not yet available at this level</span>
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