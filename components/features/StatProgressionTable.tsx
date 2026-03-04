'use client';

import React, { useState, useMemo } from 'react';
import { Unit, UnitStats, Class, PromotionEvent } from '@/types/unit';
import { generateProgressionArray } from '@/lib/stats';
import { getAllClasses } from '@/lib/data';

/**
 * Helper function to detect if a class has branching promotion options
 */
function hasBranchingPromotions(classObj: Class | undefined): boolean {
  if (!classObj) return false;
  return (classObj.promotesTo?.length ?? 0) > 1;
}

/**
 * Helper function to get promotion options with their display names
 */
function getPromotionOptions(classObj: Class | undefined, classes: Class[]): Array<{ id: string, name: string }> {
  if (!classObj || !classObj.promotesTo || classObj.promotesTo.length === 0) {
    return [];
  }

  return classObj.promotesTo.map(classId => {
    const targetClass = classes.find(c => c.id === classId && c.game === classObj.game);
    return {
      id: classId,
      name: targetClass?.name || classId
    };
  });
}

/**
 * Helper function to check if a class is an FE8 trainee class
 */
function isTraineeClass(classId: string): boolean {
  const traineeClassIds = [
    'recruit',
    'recruit_2',
    'pupil',
    'pupil_2',
    'journeyman',
    'journeyman_2'
  ];
  return traineeClassIds.includes(classId);
}

/**
 * Helper function to get the current class of a unit at a specific point in their promotion path
 */
function getCurrentClass(unit: Unit, classes: Class[], promotionEvents: PromotionEvent[]): Class | undefined {
  if (promotionEvents.length === 0) {
    return classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_') && c.game === unit.game);
  }

  // Find the most recent promotion event
  const latestEvent = promotionEvents[promotionEvents.length - 1];
  return classes.find(c => c.id === latestEvent.selectedClassId && c.game === unit.game);
}

interface StatProgressionTableProps {
  units: Unit[];
  promotionEvents: Record<string, PromotionEvent[]>;
  onPromotionEventsChange: (events: Record<string, PromotionEvent[]>) => void;
  onAddPromotionEvent?: (unitId: string, event: PromotionEvent) => void;
  onRemovePromotionEvent?: (unitId: string) => void;
}

interface ProgressionRow {
  internalLevel: number;
  displayLevel: string;
  stats: UnitStats[];
  cappedStats: Record<string, boolean>[];
  unitSkipped: boolean[];
  isPromotionLevel: boolean;
  isSkipped?: boolean;
  promotionInfo?: {
    className: string;
    classAbilities: string[];
  };
}

export function StatProgressionTable({ units, promotionEvents, onPromotionEventsChange, onAddPromotionEvent, onRemovePromotionEvent }: StatProgressionTableProps) {
  const [expandToLevel100, setExpandToLevel100] = useState(false);
  const [groupBy, setGroupBy] = useState<'stat' | 'unit'>('stat');
  const [classes, setClasses] = useState<Class[]>([]);
  const [visibleStats, setVisibleStats] = useState<Set<string>>(new Set());
  const [hasInitializedStats, setHasInitializedStats] = useState(false);

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
    if (units.length === 0) return { rows: [], statKeys: [] as string[], allProgressions: [] };

    // Calculate dynamic level boundaries based on units
    const minLevel = Math.min(...units.map(unit => {
      // For trainee units, we need to start at negative levels
      // Check if the unit's base class is a trainee class
      const unitClass = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_') && c.game === unit.game);
      const hasTraineeLevels = isTraineeClass(unitClass?.id || '');
      return hasTraineeLevels ? -10 : unit.level;
    }), 1);

    const maxLevelFromUnits = Math.max(...units.map(unit =>
      unit.maxLevel === "infinite" ? 100 : (unit.maxLevel || 40)
    ), 40);
    const maxLevel = expandToLevel100 ? Math.max(maxLevelFromUnits, 100) : maxLevelFromUnits;

    // Generate progression arrays for all units
    const allProgressions = units.map(unit =>
      generateProgressionArray(unit, minLevel, maxLevel, classes, promotionEvents[unit.id] ?? [])
    );

    // Get all stat keys from all units
    const allStatKeys = new Set<string>();
    units.forEach(unit => {
      Object.keys(unit.stats).forEach(key => allStatKeys.add(key));
    });

    // Define proper stat order and filter display stats
    const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov', 'aid'];
    let displayStats = statOrder.filter(key => {
      // Exclude stats that typically don't progress or aren't relevant
      if (!allStatKeys.has(key) || ['mov', 'con', 'bld', 'aid'].includes(key)) return false;

      // Filter out stats that are missing for all units
      const isEveryUnitMissing = units.every(unit =>
        unit.stats[key] === undefined ||
        unit.stats[key] === null
      );

      return !isEveryUnitMissing;
    });

    if (displayStats.includes('skl') && displayStats.includes('dex')) {
      displayStats = displayStats.filter(c => c !== 'dex');
    }

    // Create rows by aligning progression data from all units
    const rows: ProgressionRow[] = [];
    const totalLevels = maxLevel - minLevel + 1;

    for (let i = 0; i < totalLevels; i++) {
      const currentInternalLevel = minLevel + i;
      let displayLevel = `Level ${currentInternalLevel}`;

      // We will only highlight the global row as a "promotion level" if at least one unit promotes at this absolute row index.
      let isPromotionLevel = false;

      let rowDisplayLevel = `Level ${currentInternalLevel}`;
      let rowIsPromotionLevel = false;
      let rowPromotionInfo: { className: string; classAbilities: string[] } | undefined;

      const rowData: ProgressionRow = {
        internalLevel: currentInternalLevel,
        displayLevel: rowDisplayLevel,
        stats: [],
        cappedStats: [],
        unitSkipped: [],
        isPromotionLevel: false
      };

      let allUnitsShowDash = true;

      // Collect data for each unit at this level index
      for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
        const unit = units[unitIndex];
        const unitProgression = allProgressions[unitIndex];
        const levelData = unitProgression[i];

        const isUnitSkipped = levelData?.isSkipped ?? false;
        rowData.unitSkipped.push(isUnitSkipped);

        // A unit has valid data for this row if it's not marked skipped
        // The progression data's isSkipped flag already handles trainee level logic
        if (!isUnitSkipped) {
          allUnitsShowDash = false;
        }

        if (levelData) {
          // Use displayLevel from progression data for the first unit
          if (unitIndex === 0 && levelData.displayLevel) {
            rowDisplayLevel = levelData.displayLevel;
          }
          if (levelData.isPromotionLevel) {
            rowIsPromotionLevel = true;
            rowData.isPromotionLevel = true;
          }
          if (levelData.promotionInfo && !rowPromotionInfo) {
            rowPromotionInfo = levelData.promotionInfo;
            rowData.promotionInfo = levelData.promotionInfo;
          }

          if (levelData.isSkipped) {
            rowData.isSkipped = true; // Mark global row if ANY unit considers this a skipped virtual offset
          }

          rowData.stats.push(levelData.stats);
          rowData.cappedStats.push(levelData.cappedStats);
        } else {
          // Fallback for missing data
          rowData.stats.push({});
          rowData.cappedStats.push({});
        }
      }

      // Update the row display level with the tier information
      rowData.displayLevel = rowDisplayLevel;

      if (!allUnitsShowDash) {
        rows.push(rowData);
      }
    }

    // Initialize visible stats once when progression data first loads
    if (!hasInitializedStats && displayStats.length > 0) {
      setVisibleStats(new Set(displayStats));
      setHasInitializedStats(true);
    }

    return { rows, statKeys: displayStats, allProgressions };
  }, [units, expandToLevel100, classes, promotionEvents]);

  if (units.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Select units to view stat progression
      </div>
    );
  }

  const toggleStatVisibility = (statKey: string) => {
    setVisibleStats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(statKey)) {
        newSet.delete(statKey);
      } else {
        newSet.add(statKey);
      }
      return newSet;
    });
  };

  const getVisibleStatKeys = () => {
    return progressionData.statKeys.filter(key => visibleStats.has(key));
  };

  const activeStatKeys = getVisibleStatKeys();

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <div className="flex flex-col gap-2 min-w-0">
          <h2 className="text-xl font-semibold">Average Stats</h2>
          {progressionData.statKeys.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium mr-1">Visible Stats:</span>
              {progressionData.statKeys.map((statKey) => {
                let label = statKey.toUpperCase();
                if (statKey === 'str' && !progressionData.statKeys.includes('mag')) {
                  label = 'STR/MAG';
                } else if (statKey === 'skl') {
                  const hasDex = units.some(u => (u.stats && u.stats.dex !== undefined) || (u.growths && u.growths.dex !== undefined));
                  const hasSkl = units.some(u => (u.stats && u.stats.skl !== undefined) || (u.growths && u.growths.skl !== undefined));
                  if (hasDex && hasSkl) label = 'SKL/DEX';
                  else if (hasDex) label = 'DEX';
                }

                const isActive = visibleStats.has(statKey);
                return (
                  <button
                    key={`toggle-${statKey}`}
                    onClick={() => toggleStatVisibility(statKey)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${isActive
                      ? 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setGroupBy('stat')}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${groupBy === 'stat' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Group By Stat
            </button>
            <button
              onClick={() => setGroupBy('unit')}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${groupBy === 'unit' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Group By Unit
            </button>
          </div>
          <label className="flex items-center space-x-2 whitespace-nowrap">
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

      {/* Per-Unit Promotion Configs */}
      <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <span className="text-sm font-semibold text-gray-700 w-full mb-1">Promotion Levels:</span>
        {units.map(unit => {
          const unitClass = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_') && c.game === unit.game);

          // Dynamic check for final tier class promotion capability
          const getFinalTierClass = () => {
            const events = promotionEvents[unit.id] || [];
            if (events.length > 0) {
              const lastEvent = events[events.length - 1];
              return classes.find(c => c.id === lastEvent.selectedClassId && c.game === unit.game);
            }
            // For trainees with no events yet, we need to consider their base class's promotion target
            // as the current final tier class to check if it can promote further
            if (isTraineeClass(unitClass?.id || '')) {
              const basePromotionTarget = classes.find(c => c.id === unitClass?.promotesTo?.[0] && c.game === unit.game);
              return basePromotionTarget;
            }
            // For non-trainees, return the default promoted class
            return classes.find(c => c.id === unitClass?.promotesTo?.[0] && c.game === unit.game);
          };

          const finalTierClass = getFinalTierClass();
          
          // Verify that canAddPromotionTier properly evaluates to true when the final tier class has valid promotion targets
          const canAddPromotionTier = (() => {
            // Ensure finalTierClass exists and has valid promotesTo array
            if (!finalTierClass || !finalTierClass.promotesTo || finalTierClass.promotesTo.length === 0) {
              return false;
            }
            
            // Verify that the promotion targets are valid classes that exist in the game
            const validPromotionTargets = finalTierClass.promotesTo.filter(classId => 
              classes.some(c => c.id === classId && c.game === finalTierClass.game)
            );
            
            return validPromotionTargets.length > 0;
          })();

          // Check if the unit can promote at all
          const unitCanPromote = (unitClass?.promotesTo?.length ?? 0) > 0;

          return (
            <div key={`promo-${unit.id}`} className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">{unit.name}:</label>

              {/* Map through promotion events for this unit - only if unit can promote */}
              {unitCanPromote ? (
                (promotionEvents[unit.id] || [{
                  level: isTraineeClass(unitClass?.id || '') ? 10 : 20,
                  selectedClassId: unitClass?.promotesTo?.[0] || ''
                }]).map((event, eventIndex) => {
                  // Resolve the currentTierClass for the dropdown row
                  const currentTierClass = eventIndex === 0
                    ? unitClass
                    : classes.find(c => c.id === promotionEvents[unit.id][eventIndex - 1]?.selectedClassId && c.game === unit.game);

                  const tierHasBranchingOptions = hasBranchingPromotions(currentTierClass);
                  const tierPromotionOptions = getPromotionOptions(currentTierClass, classes);

                  return (
                    <div key={`promo-${unit.id}-${eventIndex}`} className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Tier {eventIndex + 1}:</span>

                      <select
                        id={`promo-${unit.id}-${eventIndex}`}
                        value={event.level}
                        disabled={!unitCanPromote}
                        onChange={(e) => {
                          const level = Number(e.target.value);
                          let updatedEvents = [...(promotionEvents[unit.id] || [])];

                          // If promotionEvents is empty, seed it with the default Tier 1 event
                          if (updatedEvents.length === 0) {
                            updatedEvents = [{
                              level: isTraineeClass(unitClass?.id || '') ? 10 : 20,
                              selectedClassId: unitClass?.promotesTo?.[0] || ''
                            }];
                          }

                          if (eventIndex < updatedEvents.length) {
                            updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], level };
                          } else {
                            updatedEvents.push({ level, selectedClassId: unitClass?.promotesTo?.[0] || '' });
                          }
                          onPromotionEventsChange({
                            ...promotionEvents,
                            [unit.id]: updatedEvents
                          });
                        }}
                        className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                      >
                        {isTraineeClass(currentTierClass?.id || '') ? (
                          <option value={10}>10</option>
                        ) : (
                          [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                            .filter(level => level >= Math.max(10, unit.level))
                            .map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))
                        )}
                      </select>

                      {tierHasBranchingOptions && tierPromotionOptions.length > 0 && (
                        <select
                          id={`promo-class-${unit.id}-${eventIndex}`}
                          value={event.selectedClassId || tierPromotionOptions[0]?.id || ''}
                          disabled={!unitCanPromote}
                          onChange={(e) => {
                            const selectedClassId = e.target.value;
                            let updatedEvents = [...(promotionEvents[unit.id] || [])];

                            // If promotionEvents is empty, seed it with the default Tier 1 event
                            if (updatedEvents.length === 0) {
                              updatedEvents = [{
                                level: isTraineeClass(unitClass?.id || '') ? 10 : 20,
                                selectedClassId: unitClass?.promotesTo?.[0] || ''
                              }];
                            }

                            if (eventIndex < updatedEvents.length) {
                              updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], selectedClassId };
                            } else {
                              updatedEvents.push({
                                level: isTraineeClass(currentTierClass?.id || '') ? 10 : 20,
                                selectedClassId
                              });
                            }
                            onPromotionEventsChange({
                              ...promotionEvents,
                              [unit.id]: updatedEvents
                            });
                          }}
                          className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                        >
                          {tierPromotionOptions.map(option => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-400 text-sm ml-2">Cannot promote</span>
              )}

              {/* Add + and - buttons for promotion tier management */}
              {(onAddPromotionEvent || onRemovePromotionEvent) && (
                <div className="flex items-center space-x-2 ml-6">
                  {/* Add button */}
                  {onAddPromotionEvent && canAddPromotionTier && (
                    <button
                      onClick={() => {
                        let currentEvents = [...(promotionEvents[unit.id] || [])];
                        let lastEvent = currentEvents[currentEvents.length - 1];
                        let lastSelectedClass = classes.find(c => c.id === lastEvent?.selectedClassId && c.game === unit.game);

                        // If promotionEvents is empty, seed it with the default Tier 1 event
                        if (currentEvents.length === 0) {
                          const fallbackEvent = {
                            level: isTraineeClass(unitClass?.id || '') ? 10 : 20,
                            selectedClassId: unitClass?.promotesTo?.[0] || ''
                          };
                          currentEvents = [fallbackEvent];
                          lastEvent = fallbackEvent;
                          lastSelectedClass = classes.find(c => c.id === fallbackEvent.selectedClassId && c.game === unit.game);
                        }

                        // Check if the last selected class can promote further
                        if (lastSelectedClass?.promotesTo && lastSelectedClass.promotesTo.length > 0) {
                          const newEvent: PromotionEvent = {
                            level: isTraineeClass(lastSelectedClass?.id || '') ? 10 : 20, // Default promotion level for additional tiers
                            selectedClassId: lastSelectedClass.promotesTo[0] // Default to first promotion option
                          };

                          // Push the new event and save the full array
                          currentEvents.push(newEvent);
                          onPromotionEventsChange({
                            ...promotionEvents,
                            [unit.id]: currentEvents
                          });
                        }
                      }}
                      disabled={!canAddPromotionTier}
                      className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-green-500"
                      title="Add promotion tier"
                    >
                      +
                    </button>
                  )}

                  {/* Remove button */}
                  {onRemovePromotionEvent && (promotionEvents[unit.id]?.length || 0) > 0 && (
                    <button
                      onClick={() => {
                        const currentEvents = [...(promotionEvents[unit.id] || [])];
                        if (currentEvents.length > 1) {
                          currentEvents.pop(); // Remove the last element
                          onPromotionEventsChange({
                            ...promotionEvents,
                            [unit.id]: currentEvents
                          });
                        }
                      }}
                      disabled={(promotionEvents[unit.id]?.length || 0) <= 1}
                      className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-red-500"
                      title="Remove promotion tier"
                    >
                      -
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            {groupBy === 'stat' ? (
              // --- STAT GROUPING ---
              <>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900" rowSpan={2}>
                    Level
                  </th>
                  {activeStatKeys.map((statKey) => {
                    let statLabel = statKey.toUpperCase();
                    if (statKey === 'str' && !progressionData.statKeys.includes('mag')) {
                      statLabel = 'STR/MAG';
                    } else if (statKey === 'skl') {
                      const hasDex = units.some(u => (u.stats && u.stats.dex !== undefined) || (u.growths && u.growths.dex !== undefined));
                      const hasSkl = units.some(u => (u.stats && u.stats.skl !== undefined) || (u.growths && u.growths.skl !== undefined));
                      if (hasDex && hasSkl) statLabel = 'SKL/DEX';
                      else if (hasDex) statLabel = 'DEX';
                    }

                    return (
                      <th
                        key={`header-${statKey}`}
                        colSpan={units.length}
                        className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-900 bg-gray-100 border-l-4 border-l-gray-400"
                      >
                        {statLabel}
                      </th>
                    );
                  })}
                </tr>
                <tr className="bg-gray-50">
                  {activeStatKeys.map((statKey, statIndex) => (
                    <React.Fragment key={`subheader-${statKey}`}>
                      {units.map((unit, unitIndex) => (
                        <th
                          key={`${statKey}-${unit.id}`}
                          className={`border border-gray-300 px-2 py-1 text-center text-xs font-medium text-gray-700 bg-gray-50 truncate max-w-[80px] ${unitIndex === 0 ? 'border-l-4 border-l-gray-400' : ''}`}
                          title={unit.name}
                        >
                          {unit.name}
                        </th>
                      ))}
                    </React.Fragment>
                  ))}
                </tr>
              </>
            ) : (
              // --- UNIT GROUPING ---
              <>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900" rowSpan={2}>
                    Level
                  </th>
                  {units.map((unit, unitIndex) => (
                    <th
                      key={`header-unit-${unit.id}`}
                      colSpan={activeStatKeys.length}
                      className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-900 bg-gray-100 border-l-4 border-l-gray-400"
                    >
                      {unit.name}
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  {units.map((unit, unitIndex) => (
                    <React.Fragment key={`subheader-unit-${unit.id}`}>
                      {activeStatKeys.map((statKey, statIndex) => {
                        let statLabel = statKey.toUpperCase();
                        if (statKey === 'str' && !progressionData.statKeys.includes('mag')) {
                          statLabel = 'STR/MAG';
                        } else if (statKey === 'skl') {
                          const hasDex = units.some(u => (u.stats && u.stats.dex !== undefined) || (u.growths && u.growths.dex !== undefined));
                          const hasSkl = units.some(u => (u.stats && u.stats.skl !== undefined) || (u.growths && u.growths.skl !== undefined));
                          if (hasDex && hasSkl) statLabel = 'SKL/DEX';
                          else if (hasDex) statLabel = 'DEX';
                        }

                        return (
                          <th
                            key={`${unit.id}-${statKey}`}
                            className={`border border-gray-300 px-2 py-1 text-center text-xs font-medium text-gray-700 bg-gray-50 ${statIndex === 0 ? 'border-l-4 border-l-gray-400' : ''}`}
                          >
                            {statLabel}
                          </th>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {progressionData.rows.map((row, rowIndex) => (
              <tr key={row.internalLevel} className={`${row.isPromotionLevel ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900 sticky left-0 bg-white">
                  {row.displayLevel}
                </td>
                {groupBy === 'stat' ? (
                  // --- STAT GROUPING BODY ---
                  activeStatKeys.map((statKey, statIndex) => (
                    <React.Fragment key={`${row.internalLevel}-${statKey}`}>
                      {units.map((unit, unitIndex) => {
                        const unitStats = row.stats[unitIndex];
                        const unitCappedStats = row.cappedStats[unitIndex];

                        let rawStatValue = unitStats[statKey];
                        if (statKey === 'skl' && (rawStatValue === undefined || rawStatValue === null)) {
                          rawStatValue = unitStats['dex'];
                        }

                        const statValue = rawStatValue !== undefined ? Math.round(rawStatValue) : undefined;

                        let isCapped = unitCappedStats?.[statKey];
                        if (statKey === 'skl' && (isCapped === undefined || isCapped === null)) {
                          isCapped = unitCappedStats?.['dex'];
                        }

                        const isUnitSkipped = row.unitSkipped[unitIndex];
                        const shouldShowDash = isUnitSkipped;

                        let isHighest = false;
                        let isEqual = false;

                        if (!shouldShowDash && statValue !== undefined) {
                          const allValidValues = units.map((u, i) => {
                            const eLv = u.isPromoted ? u.level + 20 : u.level;
                            if (row.internalLevel < eLv) return null;
                            let rv = row.stats[i]?.[statKey];
                            if (statKey === 'skl' && (rv === undefined || rv === null)) {
                              rv = row.stats[i]?.['dex'];
                            }
                            return rv !== undefined && rv !== null ? Math.round(rv) : null;
                          }).filter(v => v !== null) as number[];

                          if (allValidValues.length > 1) {
                            isHighest = units.every((otherUnit, otherIndex) => {
                              if (otherIndex === unitIndex) return true;
                              const otherEffectiveLv = otherUnit.isPromoted ? otherUnit.level + 20 : otherUnit.level;
                              if (row.internalLevel < otherEffectiveLv) return true;
                              let otherRaw = row.stats[otherIndex]?.[statKey];
                              if (statKey === 'skl' && (otherRaw === undefined || otherRaw === null)) {
                                otherRaw = row.stats[otherIndex]?.['dex'];
                              }
                              if (otherRaw === undefined || otherRaw === null) return false;
                              return statValue > Math.round(otherRaw);
                            });

                            isEqual = allValidValues.every(v => v === statValue) && statValue !== 0;
                          }
                        }

                        let highlightClass = '';
                        if (isHighest) {
                          highlightClass = 'bg-green-500/20';
                        } else if (isEqual) {
                          highlightClass = 'bg-yellow-500/20';
                        }

                        const displayColorClass = highlightClass || (row.isPromotionLevel ? 'bg-blue-100' : '');

                        return (
                          <td
                            key={`${row.internalLevel}-${statKey}-${unit.id}`}
                            className={`border border-gray-300 px-2 py-1 text-center text-sm ${displayColorClass} ${isCapped ? 'text-green-600 font-bold' : ''} ${unitIndex === 0 ? 'border-l-4 border-l-gray-400' : ''}`}
                          >
                            {shouldShowDash ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span>
                                {statValue !== undefined ? statValue : '-'}
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
                  ))
                ) : (
                  // --- UNIT GROUPING BODY ---
                  units.map((unit, unitIndex) => (
                    <React.Fragment key={`${row.internalLevel}-${unit.id}`}>
                      {activeStatKeys.map((statKey, statIndex) => {
                        const unitStats = row.stats[unitIndex];
                        const unitCappedStats = row.cappedStats[unitIndex];

                        let rawStatValue = unitStats[statKey];
                        if (statKey === 'skl' && (rawStatValue === undefined || rawStatValue === null)) {
                          rawStatValue = unitStats['dex'];
                        }

                        const statValue = rawStatValue !== undefined ? Math.round(rawStatValue) : undefined;

                        let isCapped = unitCappedStats?.[statKey];
                        if (statKey === 'skl' && (isCapped === undefined || isCapped === null)) {
                          isCapped = unitCappedStats?.['dex'];
                        }

                        const isUnitSkipped = row.unitSkipped[unitIndex];
                        const shouldShowDash = isUnitSkipped || row.internalLevel < unit.level;

                        let isHighest = false;
                        let isEqual = false;

                        if (!shouldShowDash && statValue !== undefined) {
                          const allValidValues = units.map((u, i) => {
                            const eLv = u.isPromoted ? u.level + 20 : u.level;
                            if (row.internalLevel < eLv) return null;
                            let rv = row.stats[i]?.[statKey];
                            if (statKey === 'skl' && (rv === undefined || rv === null)) {
                              rv = row.stats[i]?.['dex'];
                            }
                            return rv !== undefined && rv !== null ? Math.round(rv) : null;
                          }).filter(v => v !== null) as number[];

                          if (allValidValues.length > 1) {
                            isHighest = units.every((otherUnit, otherIndex) => {
                              if (otherIndex === unitIndex) return true;
                              const otherEffectiveLv = otherUnit.isPromoted ? otherUnit.level + 20 : otherUnit.level;
                              if (row.internalLevel < otherEffectiveLv) return true;
                              let otherRaw = row.stats[otherIndex]?.[statKey];
                              if (statKey === 'skl' && (otherRaw === undefined || otherRaw === null)) {
                                otherRaw = row.stats[otherIndex]?.['dex'];
                              }
                              if (otherRaw === undefined || otherRaw === null) return false;
                              return statValue > Math.round(otherRaw);
                            });

                            isEqual = allValidValues.every(v => v === statValue) && statValue !== 0;
                          }
                        }

                        let highlightClass = '';
                        if (isHighest) {
                          highlightClass = 'bg-green-500/20';
                        } else if (isEqual) {
                          highlightClass = 'bg-yellow-500/20';
                        }

                        const displayColorClass = highlightClass || (row.isPromotionLevel ? 'bg-blue-100' : '');

                        return (
                          <td
                            key={`${row.internalLevel}-${unit.id}-${statKey}`}
                            className={`border border-gray-300 px-2 py-1 text-center text-sm ${displayColorClass} ${isCapped ? 'text-green-600 font-bold' : ''} ${statIndex === 0 ? 'border-l-4 border-l-gray-400' : ''}`}
                          >
                            {shouldShowDash ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span>
                                {statValue !== undefined ? statValue : '-'}
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
                  ))
                )}
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