'use client';

import React, { useState, useMemo } from 'react';
import { Unit, UnitStats, Class, PromotionEvent, ReclassEvent } from '@/types/unit';
import { generateProgressionArray, getValidReclassOptions } from '@/lib/stats';
import { getAllClasses } from '@/lib/data';
import AbilityPill from '@/components/ui/AbilityPill';
import { Modal } from '@/components/ui/modal';
import { Info } from 'lucide-react';

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
  reclassEvents: Record<string, ReclassEvent[]>;
  onPromotionEventsChange: (events: Record<string, PromotionEvent[]>) => void;
  onReclassEventsChange: (events: Record<string, ReclassEvent[]>) => void;
  onAddPromotionEvent?: (unitId: string, event: PromotionEvent) => void;
  onRemovePromotionEvent?: (unitId: string) => void;
}

interface ProgressionRow {
  internalLevel: number;
  displayLevel: string;
  stats: UnitStats[];
  cappedStats: Record<string, boolean>[];
  unitSkipped: boolean[];
  unitIsPromotionLevel: boolean[];
  unitPromotionInfo: ({ className: string; classAbilities: string[] } | undefined)[];
  isPromotionLevel: boolean;
  isSkipped?: boolean;
  promotionInfo?: {
    className: string;
    classAbilities: string[];
  };
}

export function StatProgressionTable({ units, promotionEvents, reclassEvents, onPromotionEventsChange, onReclassEventsChange, onAddPromotionEvent, onRemovePromotionEvent }: StatProgressionTableProps) {
  const [expandToLevel100, setExpandToLevel100] = useState(false);
  const [groupBy, setGroupBy] = useState<'stat' | 'unit'>('stat');
  const [classes, setClasses] = useState<Class[]>([]);
  const [visibleStats, setVisibleStats] = useState<Set<string>>(new Set());
  const [hasInitializedStats, setHasInitializedStats] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [selectedPromotionInfo, setSelectedPromotionInfo] = useState<{
    className: string;
    classAbilities: string[];
    gameId: string;
  } | null>(null);

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

    const maxLevelFromUnits = Math.max(...units.map(unit => {
      const allEvents = [...(promotionEvents[unit.id] || []), ...(reclassEvents[unit.id] || [])];
      let internalLvls = unit.maxLevel === "infinite" ? 100 : (unit.maxLevel || 40);
      if (allEvents.length > 0) {
        // Assume roughly 20-30 internal levels required to process each class change fully
        internalLvls += allEvents.length * 30;
      }
      return Math.max(40, internalLvls);
    }), 40);
    const maxLevel = expandToLevel100 ? Math.max(maxLevelFromUnits, 100) : maxLevelFromUnits;

    // Generate progression arrays for all units
    const allProgressions = units.map(unit =>
      generateProgressionArray(unit, minLevel, maxLevel, classes, promotionEvents[unit.id] ?? [], reclassEvents[unit.id] ?? [])
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
    const maxProgressionLength = Math.max(...allProgressions.map(p => p.length), 0);

    for (let i = 0; i < maxProgressionLength; i++) {
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
        unitIsPromotionLevel: [],
        unitPromotionInfo: [],
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
          rowData.unitIsPromotionLevel.push(levelData.isPromotionLevel ?? false);
          rowData.unitPromotionInfo.push(levelData.promotionInfo);
        } else {
          // Fallback for missing data
          rowData.stats.push({});
          rowData.cappedStats.push({});
          rowData.unitIsPromotionLevel.push(false);
          rowData.unitPromotionInfo.push(undefined);
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
  }, [units, expandToLevel100, classes, promotionEvents, reclassEvents]);

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

  // Handle promotion info click
  const handlePromotionInfoClick = (promotionInfo: { className: string; classAbilities: string[] }, gameId: string) => {
    setSelectedPromotionInfo({
      ...promotionInfo,
      gameId
    });
    setIsPromotionModalOpen(true);
  };

  // Render promotion details modal
  const renderPromotionDetailsModal = () => {
    if (!selectedPromotionInfo) return null;

    const { className, classAbilities, gameId } = selectedPromotionInfo;
    const classData = classes.find(c => c.name === className && c.game === gameId);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2 pr-8">
          <h2 className="text-2xl font-bold">{className} Promotion Details</h2>
        </div>

        {classData && classData.classAbilities && classData.classAbilities.length > 0 && (
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-2">Class Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {classData.classAbilities.map((ability, index) => (
                <AbilityPill
                  key={index}
                  ability={ability}
                  game={gameId}
                />
              ))}
            </div>
          </div>
        )}

        {classData && classData.weapons && classData.weapons.length > 0 && (
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-1">Weapons</h3>
            <div className="flex flex-wrap gap-2">
              {classData.weapons.map(weapon => (
                <span key={weapon} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                  {weapon}
                </span>
              ))}
            </div>
          </div>
        )}

        {classData && classData.description && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-1">Description & Special Qualities</h3>
            <p className="text-muted-foreground">{classData.description}</p>
          </div>
        )}
      </div>
    );
  };

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

      {/* Per-Unit Promotion & Reclass Configs */}
      <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <span className="text-sm font-semibold text-gray-700 w-full mb-1">Promotion & Reclass Levels:</span>
        {units.map(unit => {
          const unitClass = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_') && c.game === unit.game);
          const unitReclassEvents = reclassEvents[unit.id] || [];
          const unitPromotionEvents = promotionEvents[unit.id] || [];

          // Get current class based on all events (both promotion and reclass)
          const getCurrentClass = () => {
            // Check reclass events first (most recent)
            if (unitReclassEvents.length > 0) {
              const lastReclassEvent = unitReclassEvents[unitReclassEvents.length - 1];
              return classes.find(c => c.id === lastReclassEvent.selectedClassId && c.game === unit.game);
            }
            // Then check promotion events
            if (unitPromotionEvents.length > 0) {
              const lastPromotionEvent = unitPromotionEvents[unitPromotionEvents.length - 1];
              return classes.find(c => c.id === lastPromotionEvent.selectedClassId && c.game === unit.game);
            }
            // Default to base class
            return unitClass;
          };

          const currentClass = getCurrentClass();

          const baseOrReclassedClass = unitReclassEvents.length > 0
            ? classes.find(c => c.id === unitReclassEvents[unitReclassEvents.length - 1].selectedClassId && c.game === unit.game)
            : unitClass;

          // Check if the unit's base class can promote, or if it already has existing promotion events
          const unitCanPromote = (baseOrReclassedClass?.promotesTo?.length ?? 0) > 0 || unitPromotionEvents.length > 0;

          // Check if the unit can reclass (based on game and current class)
          const unitCanReclass = unit.game?.toLowerCase() === 'awakening' && currentClass;

          return (
            <div key={`config-${unit.id}`} className="flex flex-col space-y-3">
              <label className="text-sm font-semibold text-gray-700">{unit.name}:</label>

              {/* Unified Class Changes Section */}
              {(unitCanPromote || unitCanReclass) && (
                <div className="flex flex-col space-y-2">
                  <span className="text-xs font-medium text-gray-600">Class Changes:</span>
                  
                  {(() => {
                    // Combine and sort events chronologically for UI rendering
                    const allEvents: Array<{type: 'promotion' | 'reclass', originalIndex: number, level: number, selectedClassId: string, order: number}> = [];
                    
                    unitPromotionEvents.forEach((event, idx) => {
                      allEvents.push({ type: 'promotion', originalIndex: idx, level: event.level, selectedClassId: event.selectedClassId, order: event.order ?? (idx * 2) });
                    });
                    unitReclassEvents.forEach((event, idx) => {
                      allEvents.push({ type: 'reclass', originalIndex: idx, level: event.level, selectedClassId: event.selectedClassId, order: event.order ?? (idx * 2 + 1) });
                    });
                    
                    // Sort by sequential order (same way lib/stats.ts processes them)
                    allEvents.sort((a, b) => {
                      if (a.order !== b.order) return a.order - b.order;
                      if (a.level !== b.level) return a.level - b.level;
                      return a.type === 'reclass' ? -1 : 1;
                    });
                    
                    // If no events exist but they CAN promote, seed a default empty promotion block for UI interaction
                    if (allEvents.length === 0 && unitCanPromote) {
                      allEvents.push({
                        type: 'promotion',
                        originalIndex: 0,
                        level: isTraineeClass(baseOrReclassedClass?.id || '') ? 10 : 20,
                        selectedClassId: baseOrReclassedClass?.promotesTo?.[0] || '',
                        order: 0
                      });
                    }

                    return allEvents.map((event, eventIndex) => {
                       // Determine what class the unit was right before this specific event decision
                      const previousClassId = eventIndex === 0 
                        ? unitClass?.id 
                        : allEvents[eventIndex - 1].selectedClassId;
                      const previousClass = classes.find(c => c.id === previousClassId && c.game === unit.game);

                      // Gather potential options for this event:
                      // 1. Promotions from the previous class
                      const promoOptionIds = previousClass?.promotesTo || [];
                      
                      // 2. Reclass options valid at this level and tier
                      const reclassOptionIds = unitCanReclass 
                        ? getValidReclassOptions(unit, classes, event.level, previousClass?.id)
                        : [];
                      
                      const validOptionsSet = new Set([...promoOptionIds, ...reclassOptionIds]);
                      const sortedValidOptions = Array.from(validOptionsSet)
                        .map(rawId => {
                          const classId = rawId.toLowerCase().replace(/\s+/g, '_');
                          return classes.find(c => c.id === classId && c.game === unit.game);
                        })
                        .filter(Boolean) as Class[];

                      // Sort by Tier (Tier 2 first, then Tier 1), current class last
                      sortedValidOptions.sort((a, b) => {
                        // Push current class to bottom
                        if (a.id === previousClassId && b.id !== previousClassId) return 1;
                        if (b.id === previousClassId && a.id !== previousClassId) return -1;
                        const tierA = a.tier ? parseInt(String(a.tier)) : (a.type === 'promoted' ? 2 : 1);
                        const tierB = b.tier ? parseInt(String(b.tier)) : (b.type === 'promoted' ? 2 : 1);
                        return tierB - tierA; // Descending
                      });

                      return (
                        <div key={`classchange-${unit.id}-${eventIndex}`} className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Change {eventIndex + 1}:</span>
                          
                          <select
                            id={`change-level-${unit.id}-${eventIndex}`}
                            value={event.level}
                            onChange={(e) => {
                              const level = Number(e.target.value);
                              
                              // Re-evaluate validity at the new level to prevent keeping invalid classes
                              const newReclassOptions = unitCanReclass ? getValidReclassOptions(unit, classes, level, previousClass?.id) : [];
                              let newSelectedClassId = event.selectedClassId;
                              
                              if (event.type === 'reclass' && !newReclassOptions.includes(event.selectedClassId)) {
                                newSelectedClassId = newReclassOptions.length > 0 ? newReclassOptions[0] : '';
                              } else if (event.type === 'promotion' && !promoOptionIds.includes(event.selectedClassId)) {
                                newSelectedClassId = promoOptionIds.length > 0 ? promoOptionIds[0] : '';
                              }

                              if (event.type === 'promotion') {
                                const updatedEvents = [...unitPromotionEvents];
                                if (event.originalIndex < updatedEvents.length) {
                                  updatedEvents[event.originalIndex] = { ...updatedEvents[event.originalIndex], level, selectedClassId: newSelectedClassId };
                                } else {
                                  // Seeded empty level from UI being interacted with
                                  updatedEvents.push({ level, selectedClassId: newSelectedClassId, order: Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1 });
                                }
                                onPromotionEventsChange({ ...promotionEvents, [unit.id]: updatedEvents });
                              } else {
                                const updatedEvents = [...unitReclassEvents];
                                updatedEvents[event.originalIndex] = { ...updatedEvents[event.originalIndex], level, selectedClassId: newSelectedClassId };
                                onReclassEventsChange({ ...reclassEvents, [unit.id]: updatedEvents });
                              }
                            }}
                            className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {isTraineeClass(previousClass?.id || '') ? (
                              <option value={10}>10</option>
                            ) : (
                              (() => {
                                const prevTier = typeof previousClass?.tier === 'number' ? previousClass.tier : (previousClass?.type === 'promoted' ? 2 : 1);
                                const isSpecial = ["taguel", "manakete", "villager", "dancer", "lodestar", "bride", "dread_fighter", "conqueror"].includes(previousClass?.id || '');
                                const maxLvl = isSpecial ? 30 : 20;
                                const minLvl = prevTier === 2 ? 1 : 10;
                                
                                const options = [];
                                for (let i = minLvl; i <= maxLvl; i++) {
                                  if (eventIndex === 0 && i < unit.level) continue;
                                  options.push(<option key={i} value={i}>{i}</option>);
                                }
                                return options;
                              })()
                            )}
                          </select>

                          {sortedValidOptions.length > 0 && (
                            <select
                              id={`change-class-${unit.id}-${eventIndex}`}
                              value={event.selectedClassId || sortedValidOptions[0]?.id || ''}
                              onChange={(e) => {
                                const selectedClassId = e.target.value;
                                
                                // To correctly update state, we need to know if the newly selected class is a promotion or a reclass
                                // It is a promotion if it exists within the generic promotesTo array of the previous class
                                const isNowPromotion = previousClass?.promotesTo?.includes(selectedClassId);

                                // If the event TYPE changed (i.e. was a promotion line, but user picked a reclass class)
                                // We have to rip it out of the old state array, and append it to the new state array
                                if (isNowPromotion && event.type === 'reclass') {
                                  const updatedReclass = unitReclassEvents.filter((_, i) => i !== event.originalIndex);
                                  const nextOrder = Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1;
                                  const updatedPromo = [...unitPromotionEvents, { level: event.level, selectedClassId, order: nextOrder }];
                                  onReclassEventsChange({ ...reclassEvents, [unit.id]: updatedReclass });
                                  onPromotionEventsChange({ ...promotionEvents, [unit.id]: updatedPromo });
                                } else if (!isNowPromotion && event.type === 'promotion') {
                                  const updatedPromo = unitPromotionEvents.filter((_, i) => i !== event.originalIndex);
                                  const nextOrder = Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1;
                                  const updatedReclass = [...unitReclassEvents, { level: event.level, selectedClassId, order: nextOrder }];
                                  onPromotionEventsChange({ ...promotionEvents, [unit.id]: updatedPromo });
                                  onReclassEventsChange({ ...reclassEvents, [unit.id]: updatedReclass });
                                } else {
                                  // The type remained the same, just update the selectedClassId
                                  if (isNowPromotion) {
                                    const updatedPromo = [...unitPromotionEvents];
                                    if (event.originalIndex < updatedPromo.length) {
                                      updatedPromo[event.originalIndex] = { ...updatedPromo[event.originalIndex], selectedClassId };
                                    } else {
                                      updatedPromo.push({ level: event.level, selectedClassId, order: Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1 }); // Was seed
                                    }
                                    onPromotionEventsChange({ ...promotionEvents, [unit.id]: updatedPromo });
                                  } else {
                                    const updatedReclass = [...unitReclassEvents];
                                    updatedReclass[event.originalIndex] = { ...updatedReclass[event.originalIndex], selectedClassId };
                                    onReclassEventsChange({ ...reclassEvents, [unit.id]: updatedReclass });
                                  }
                                }
                              }}
                              className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {sortedValidOptions.map(option => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Management Buttons */}
              <div className="flex items-center space-x-2 ml-6">
                {/* Add Class Change Button */}
                {(unitCanPromote || unitCanReclass) && (
                  <button
                    onClick={() => {
                      // If no real events exist but the UI shows a seeded default promotion,
                      // we need to commit that seeded event first, then add the new one on top
                      const hasNoRealEvents = unitPromotionEvents.length === 0 && unitReclassEvents.length === 0;

                      if (hasNoRealEvents && baseOrReclassedClass?.promotesTo && baseOrReclassedClass.promotesTo.length > 0) {
                        // Commit the seeded default promotion
                        const seededEvent: PromotionEvent = {
                          level: isTraineeClass(baseOrReclassedClass.id) ? 10 : 20,
                          selectedClassId: baseOrReclassedClass.promotesTo[0],
                          order: 0
                        };
                        
                        // Now figure out the next event based on the promoted class
                        const promotedClass = classes.find(c => c.id === seededEvent.selectedClassId && c.game === unit.game);
                        
                        // Gather all valid options from promoted class, sort by tier descending
                        const promoIds = promotedClass?.promotesTo || [];
                        const reclassIds = unitCanReclass
                          ? getValidReclassOptions(unit, classes, 20, promotedClass?.id)
                          : [];
                        const allIds = new Set([...promoIds, ...reclassIds]);
                        const sortedOpts = Array.from(allIds)
                          .map(rawId => {
                            const classId = rawId.toLowerCase().replace(/\s+/g, '_');
                            return classes.find(c => c.id === classId && c.game === unit.game);
                          })
                          .filter(Boolean) as Class[];
                        sortedOpts.sort((a, b) => {
                          if (a.id === promotedClass?.id && b.id !== promotedClass?.id) return 1;
                          if (b.id === promotedClass?.id && a.id !== promotedClass?.id) return -1;
                          const tierA = a.tier ? parseInt(String(a.tier)) : (a.type === 'promoted' ? 2 : 1);
                          const tierB = b.tier ? parseInt(String(b.tier)) : (b.type === 'promoted' ? 2 : 1);
                          return tierB - tierA;
                        });

                        if (sortedOpts.length > 0) {
                          const picked = sortedOpts[0];
                          const isPromo = promoIds.includes(picked.id);

                          if (isPromo) {
                            const newEvent: PromotionEvent = { level: 20, selectedClassId: picked.id, order: 1 };
                            onPromotionEventsChange({
                              ...promotionEvents,
                              [unit.id]: [seededEvent, newEvent]
                            });
                          } else {
                            const newEvent: ReclassEvent = { level: 20, selectedClassId: picked.id, order: 1 };
                            onPromotionEventsChange({
                              ...promotionEvents,
                              [unit.id]: [seededEvent]
                            });
                            onReclassEventsChange({
                              ...reclassEvents,
                              [unit.id]: [newEvent]
                            });
                          }
                        } else {
                          // No further options, just commit the seeded event
                          onPromotionEventsChange({
                            ...promotionEvents,
                            [unit.id]: [seededEvent]
                          });
                        }
                        return;
                      }

                      // Normal case: real events already exist
                      let lastEvent: {type: 'promotion'|'reclass', classId: string, level: number} | null = null;
                      
                      const allEvents = [
                        ...unitPromotionEvents.map(e => ({ type: 'promotion' as const, classId: e.selectedClassId, level: e.level, order: e.order ?? 0 })),
                        ...unitReclassEvents.map(e => ({ type: 'reclass' as const, classId: e.selectedClassId, level: e.level, order: e.order ?? 0 }))
                      ].sort((a, b) => {
                        if (a.order !== b.order) return a.order - b.order;
                        if (a.level !== b.level) return a.level - b.level;
                        return a.type === 'reclass' ? -1 : 1;
                      });

                      if (allEvents.length > 0) {
                        lastEvent = allEvents[allEvents.length - 1];
                      }

                      const currentResolvedClassId = lastEvent?.classId || unitClass?.id;
                      const currentResolvedClass = classes.find(c => c.id === currentResolvedClassId && c.game === unit.game);

                      // Gather all valid options (same as dropdown rendering)
                      const promoOptionIds = currentResolvedClass?.promotesTo || [];
                      const reclassOptionIds = unitCanReclass
                        ? getValidReclassOptions(unit, classes, 20, currentResolvedClassId)
                        : [];
                      
                      const allOptionIds = new Set([...promoOptionIds, ...reclassOptionIds]);
                      const sortedOptions = Array.from(allOptionIds)
                        .map(rawId => {
                          const classId = rawId.toLowerCase().replace(/\s+/g, '_');
                          return classes.find(c => c.id === classId && c.game === unit.game);
                        })
                        .filter(Boolean) as Class[];
                      
                      // Sort by tier descending (Tier 2 first), current class last — same order as dropdown
                      sortedOptions.sort((a, b) => {
                        if (a.id === currentResolvedClassId && b.id !== currentResolvedClassId) return 1;
                        if (b.id === currentResolvedClassId && a.id !== currentResolvedClassId) return -1;
                        const tierA = a.tier ? parseInt(String(a.tier)) : (a.type === 'promoted' ? 2 : 1);
                        const tierB = b.tier ? parseInt(String(b.tier)) : (b.type === 'promoted' ? 2 : 1);
                        return tierB - tierA;
                      });

                      if (sortedOptions.length > 0) {
                        const selectedClass = sortedOptions[0];
                        const isPromotion = promoOptionIds.includes(selectedClass.id);
                        const nextOrder = Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1;
                        const defaultLevel = isTraineeClass(currentResolvedClass?.id || '') ? 10 : 20;

                        if (isPromotion) {
                          const newEvent: PromotionEvent = {
                            level: defaultLevel,
                            selectedClassId: selectedClass.id,
                            order: nextOrder
                          };
                          onPromotionEventsChange({
                            ...promotionEvents,
                            [unit.id]: [...unitPromotionEvents, newEvent]
                          });
                        } else {
                          const newEvent: ReclassEvent = {
                            level: defaultLevel,
                            selectedClassId: selectedClass.id,
                            order: nextOrder
                          };
                          onReclassEventsChange({
                            ...reclassEvents,
                            [unit.id]: [...unitReclassEvents, newEvent]
                          });
                        }
                      }
                    }}
                    className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                    title="Add class change"
                  >
                    +
                  </button>
                )}

                {/* Remove Class Change Button */}
                {(unitPromotionEvents.length + unitReclassEvents.length > 1) && (
                  <button
                    onClick={() => {
                      // Figure out what the chronologically last event was
                      const allEvents = [
                        ...unitPromotionEvents.map((e, idx) => ({ type: 'promotion' as const, level: e.level, order: e.order ?? 0, idx })),
                        ...unitReclassEvents.map((e, idx) => ({ type: 'reclass' as const, level: e.level, order: e.order ?? 0, idx }))
                      ].sort((a, b) => {
                        if (a.order !== b.order) return a.order - b.order;
                        if (a.level !== b.level) return a.level - b.level;
                        return a.type === 'reclass' ? -1 : 1;
                      });

                      if (allEvents.length > 0) {
                        const lastEvent = allEvents[allEvents.length - 1];
                        if (lastEvent.type === 'promotion') {
                           onPromotionEventsChange({
                             ...promotionEvents,
                             [unit.id]: unitPromotionEvents.filter((_, i) => i !== lastEvent.idx)
                           });
                        } else {
                          onReclassEventsChange({
                            ...reclassEvents,
                            [unit.id]: unitReclassEvents.filter((_, i) => i !== lastEvent.idx)
                          });
                        }
                      }
                    }}
                    className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-red-500"
                    title="Remove class change"
                  >
                    -
                  </button>
                )}
              </div>
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

                        const statValue = rawStatValue !== undefined ? Number(rawStatValue.toFixed(2)) : undefined;

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
                            return rv !== undefined && rv !== null ? Number(rv.toFixed(2)) : null;
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
                              return statValue > Number(otherRaw.toFixed(2));
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
                                {row.unitIsPromotionLevel[unitIndex] && (
                                  <button
                                    onClick={() => handlePromotionInfoClick(row.unitPromotionInfo[unitIndex] || { className: '', classAbilities: [] }, unit.game)}
                                    className="ml-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                                    title="View promotion details"
                                  >
                                    ✨
                                  </button>
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

                        const statValue = rawStatValue !== undefined ? Number(rawStatValue.toFixed(2)) : undefined;

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
                            return rv !== undefined && rv !== null ? Number(rv.toFixed(2)) : null;
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
                              return statValue > Number(otherRaw.toFixed(2));
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
                                {row.unitIsPromotionLevel[unitIndex] && (
                                  <button
                                    onClick={() => handlePromotionInfoClick(row.unitPromotionInfo[unitIndex] || { className: '', classAbilities: [] }, unit.game)}
                                    className="ml-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                                    title="View promotion details"
                                  >
                                    ✨
                                  </button>
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

      {/* Promotion Details Modal */}
      <Modal
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
      >
        <div className="space-y-4">
          {renderPromotionDetailsModal()}
        </div>
      </Modal>
    </div>
  );
}