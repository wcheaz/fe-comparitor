'use client';

import React, { useState, useMemo } from 'react';
import { Unit, UnitStats, Class, PromotionEvent, ReclassEvent } from '@/types/unit';
import { generateProgressionArray, getValidReclassOptions } from '@/lib/stats';
import { getAllClasses } from '@/lib/data';
import SkillPill from '@/components/ui/SkillPill';
import { Modal } from '@/components/ui/modal';

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

interface StatProgressionTableProps {
  unit: Unit | null;
  promotionEvents: PromotionEvent[];
  reclassEvents: ReclassEvent[];
  onPromotionEventsChange: (events: PromotionEvent[]) => void;
  onReclassEventsChange: (events: ReclassEvent[]) => void;
  otherUnit?: Unit;
  otherUnitPromotionEvents?: PromotionEvent[];
  otherUnitReclassEvents?: ReclassEvent[];
}

interface ProgressionRow {
  internalLevel: number;
  displayLevel: string;
  stats: UnitStats;
  cappedStats: Record<string, boolean>;
  isSkipped: boolean;
  isPromotionLevel: boolean;
  promotionInfo?: {
    className: string;
    classSkills: string[];
  };
}

function effectiveStartLevel(u: Unit): number {
  if (u.isPromoted === true || u.level < 1) return 1;
  return u.level;
}

export function StatProgressionTable({ unit, promotionEvents, reclassEvents, onPromotionEventsChange, onReclassEventsChange, otherUnit, otherUnitPromotionEvents, otherUnitReclassEvents }: StatProgressionTableProps) {
  const [expandToLevel100, setExpandToLevel100] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [visibleStats, setVisibleStats] = useState<Set<string>>(new Set());
  const [hasInitializedStats, setHasInitializedStats] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [selectedPromotionInfo, setSelectedPromotionInfo] = useState<{
    className: string;
    classSkills: string[];
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
    if (!unit) return { rows: [] as ProgressionRow[], statKeys: [] as string[] };

    const unitClass = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_') && c.game === unit.game);
    const hasTraineeLevels = isTraineeClass(unitClass?.id || '');
    const minLevel = Math.min(hasTraineeLevels ? -10 : unit.level, 1);

    const allEvents = [...promotionEvents, ...reclassEvents];
    let internalLvls = unit.maxLevel === "infinite" ? 100 : (unit.maxLevel || 40);
    if (allEvents.length > 0) {
      internalLvls += allEvents.length * 30;
    }
    const maxLevelFromUnit = Math.max(40, internalLvls);
    const maxLevel = expandToLevel100 ? Math.max(maxLevelFromUnit, 100) : maxLevelFromUnit;

    const progression = generateProgressionArray(unit, minLevel, maxLevel, classes, promotionEvents, reclassEvents);

    const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov', 'aid'];
    const excludedStats = new Set(['mov', 'con', 'bld', 'aid']);
    const displayStats = Object.keys(unit.stats)
      .filter(key => !excludedStats.has(key) && unit.stats[key] !== undefined && unit.stats[key] !== null)
      .sort((a, b) => statOrder.indexOf(a) - statOrder.indexOf(b));

    const rows: ProgressionRow[] = [];
    for (let i = 0; i < progression.length; i++) {
      const levelData = progression[i];

      rows.push({
        internalLevel: levelData.internalLevel,
        displayLevel: levelData.displayLevel || `Level ${levelData.internalLevel}`,
        stats: levelData.stats,
        cappedStats: levelData.cappedStats,
        isSkipped: !!levelData.isSkipped,
        isPromotionLevel: levelData.isPromotionLevel,
        promotionInfo: levelData.promotionInfo,
      });
    }

    if (!hasInitializedStats && displayStats.length > 0) {
      setVisibleStats(new Set(displayStats));
      setHasInitializedStats(true);
    }

    return { rows, statKeys: displayStats };
  }, [unit, expandToLevel100, classes, promotionEvents, reclassEvents]);

  const otherUnitProgressionMap = useMemo(() => {
    if (!otherUnit) return new Map<number, ProgressionRow>();

    const otherUnitClass = classes.find(c => c.id === otherUnit.class.toLowerCase().replace(/\s+/g, '_') && c.game === otherUnit.game);
    const otherHasTraineeLevels = isTraineeClass(otherUnitClass?.id || '');
    const otherMinLevel = Math.min(otherHasTraineeLevels ? -10 : otherUnit.level, 1);

    const otherAllEvents = [...(otherUnitPromotionEvents || []), ...(otherUnitReclassEvents || [])];
    let otherInternalLvls = otherUnit.maxLevel === "infinite" ? 100 : (otherUnit.maxLevel || 40);
    if (otherAllEvents.length > 0) {
      otherInternalLvls += otherAllEvents.length * 30;
    }
    const otherMaxLevelFromUnit = Math.max(40, otherInternalLvls);
    const otherMaxLevel = expandToLevel100 ? Math.max(otherMaxLevelFromUnit, 100) : otherMaxLevelFromUnit;

    const otherProgression = generateProgressionArray(
      otherUnit,
      otherMinLevel,
      otherMaxLevel,
      classes,
      otherUnitPromotionEvents || [],
      otherUnitReclassEvents || []
    );

    const map = new Map<number, ProgressionRow>();
    for (const levelData of otherProgression) {
      map.set(levelData.internalLevel, {
        internalLevel: levelData.internalLevel,
        displayLevel: levelData.displayLevel || `Level ${levelData.internalLevel}`,
        stats: levelData.stats,
        cappedStats: levelData.cappedStats,
        isSkipped: !!levelData.isSkipped,
        isPromotionLevel: levelData.isPromotionLevel,
        promotionInfo: levelData.promotionInfo,
      });
    }
    return map;
  }, [otherUnit, otherUnitPromotionEvents, otherUnitReclassEvents, classes, expandToLevel100]);

  const filteredRows = useMemo(() => {
    if (!otherUnit || !unit) return progressionData.rows;
    const minVisibleLevel = Math.max(effectiveStartLevel(unit), effectiveStartLevel(otherUnit));
    return progressionData.rows.filter(row => row.internalLevel >= minVisibleLevel);
  }, [progressionData.rows, otherUnit, unit]);

  if (!unit) {
    return (
      <div className="text-center py-8 text-gray-500">
        Select a unit to view stat progression
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
  const handlePromotionInfoClick = (promotionInfo: { className: string; classSkills: string[] }, gameId: string) => {
    setSelectedPromotionInfo({
      ...promotionInfo,
      gameId
    });
    setIsPromotionModalOpen(true);
  };

  // Render promotion details modal
  const renderPromotionDetailsModal = () => {
    if (!selectedPromotionInfo) return null;

    const { className, classSkills, gameId } = selectedPromotionInfo;
    const classData = classes.find(c => c.name === className && c.game === gameId);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2 pr-8">
          <h2 className="text-2xl font-bold">{className} Promotion Details</h2>
        </div>

        {classData && classData.classSkills && classData.classSkills.length > 0 && (
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-2">Class Skills</h3>
            <div className="flex flex-wrap gap-2">
              {classData.classSkills.map((skill, index) => (
                <SkillPill
                  key={index}
                  skill={skill}
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
                  const hasDex = (unit.stats && unit.stats.dex !== undefined) || (unit.growths && unit.growths.dex !== undefined);
                  const hasSkl = (unit.stats && unit.stats.skl !== undefined) || (unit.growths && unit.growths.skl !== undefined);
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

      <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <span className="text-sm font-semibold text-gray-700 w-full mb-1">Promotion & Reclass Levels:</span>
        {(() => {
          const unitClass = classes.find(c => c.id === unit.class.toLowerCase().replace(/\s+/g, '_') && c.game === unit.game);
          const unitReclassEvents = reclassEvents;
          const unitPromotionEvents = promotionEvents;

          const getCurrentClass = () => {
            if (unitReclassEvents.length > 0) {
              const lastReclassEvent = unitReclassEvents[unitReclassEvents.length - 1];
              return classes.find(c => c.id === lastReclassEvent.selectedClassId && c.game === unit.game);
            }
            if (unitPromotionEvents.length > 0) {
              const lastPromotionEvent = unitPromotionEvents[unitPromotionEvents.length - 1];
              return classes.find(c => c.id === lastPromotionEvent.selectedClassId && c.game === unit.game);
            }
            return unitClass;
          };

          const currentClass = getCurrentClass();

          const baseOrReclassedClass = unitReclassEvents.length > 0
            ? classes.find(c => c.id === unitReclassEvents[unitReclassEvents.length - 1].selectedClassId && c.game === unit.game)
            : unitClass;

          const unitCanPromote = (baseOrReclassedClass?.promotesTo?.length ?? 0) > 0 || unitPromotionEvents.length > 0;
          const unitCanReclass = unit.game?.toLowerCase() === 'awakening' && currentClass;

          return (
            <div className="flex flex-col space-y-3">
              {(unitCanPromote || unitCanReclass) && (
                <div className="flex flex-col space-y-2">
                  <span className="text-xs font-medium text-gray-600">Class Changes:</span>

                  {(() => {
                    const allEvents: Array<{type: 'promotion' | 'reclass', originalIndex: number, level: number, selectedClassId: string, order: number}> = [];

                    unitPromotionEvents.forEach((event, idx) => {
                      allEvents.push({ type: 'promotion', originalIndex: idx, level: event.level, selectedClassId: event.selectedClassId, order: event.order ?? (idx * 2) });
                    });
                    unitReclassEvents.forEach((event, idx) => {
                      allEvents.push({ type: 'reclass', originalIndex: idx, level: event.level, selectedClassId: event.selectedClassId, order: event.order ?? (idx * 2 + 1) });
                    });

                    allEvents.sort((a, b) => {
                      if (a.order !== b.order) return a.order - b.order;
                      if (a.level !== b.level) return a.level - b.level;
                      return a.type === 'reclass' ? -1 : 1;
                    });

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
                      const previousClassId = eventIndex === 0
                        ? unitClass?.id
                        : allEvents[eventIndex - 1].selectedClassId;
                      const previousClass = classes.find(c => c.id === previousClassId && c.game === unit.game);

                      const promoOptionIds = previousClass?.promotesTo || [];

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

                      sortedValidOptions.sort((a, b) => {
                        if (a.id === previousClassId && b.id !== previousClassId) return 1;
                        if (b.id === previousClassId && a.id !== previousClassId) return -1;
                        const tierA = a.tier ? parseInt(String(a.tier)) : (a.type === 'promoted' ? 2 : 1);
                        const tierB = b.tier ? parseInt(String(b.tier)) : (b.type === 'promoted' ? 2 : 1);
                        return tierB - tierA;
                      });

                      return (
                        <div key={`classchange-${eventIndex}`} className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Change {eventIndex + 1}:</span>

                          <select
                            id={`change-level-${eventIndex}`}
                            value={event.level}
                            onChange={(e) => {
                              const level = Number(e.target.value);

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
                                  updatedEvents.push({ level, selectedClassId: newSelectedClassId, order: Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1 });
                                }
                                onPromotionEventsChange(updatedEvents);
                              } else {
                                const updatedEvents = [...unitReclassEvents];
                                updatedEvents[event.originalIndex] = { ...updatedEvents[event.originalIndex], level, selectedClassId: newSelectedClassId };
                                onReclassEventsChange(updatedEvents);
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
                              id={`change-class-${eventIndex}`}
                              value={event.selectedClassId || sortedValidOptions[0]?.id || ''}
                              onChange={(e) => {
                                const selectedClassId = e.target.value;

                                const isNowPromotion = previousClass?.promotesTo?.includes(selectedClassId);

                                if (isNowPromotion && event.type === 'reclass') {
                                  const updatedReclass = unitReclassEvents.filter((_, i) => i !== event.originalIndex);
                                  const nextOrder = Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1;
                                  const updatedPromo = [...unitPromotionEvents, { level: event.level, selectedClassId, order: nextOrder }];
                                  onReclassEventsChange(updatedReclass);
                                  onPromotionEventsChange(updatedPromo);
                                } else if (!isNowPromotion && event.type === 'promotion') {
                                  const updatedPromo = unitPromotionEvents.filter((_, i) => i !== event.originalIndex);
                                  const nextOrder = Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1;
                                  const updatedReclass = [...unitReclassEvents, { level: event.level, selectedClassId, order: nextOrder }];
                                  onPromotionEventsChange(updatedPromo);
                                  onReclassEventsChange(updatedReclass);
                                } else {
                                  if (isNowPromotion) {
                                    const updatedPromo = [...unitPromotionEvents];
                                    if (event.originalIndex < updatedPromo.length) {
                                      updatedPromo[event.originalIndex] = { ...updatedPromo[event.originalIndex], selectedClassId };
                                    } else {
                                      updatedPromo.push({ level: event.level, selectedClassId, order: Math.max(...unitPromotionEvents.map(e => e.order ?? 0), ...unitReclassEvents.map(e => e.order ?? 0), -1) + 1 });
                                    }
                                    onPromotionEventsChange(updatedPromo);
                                  } else {
                                    const updatedReclass = [...unitReclassEvents];
                                    updatedReclass[event.originalIndex] = { ...updatedReclass[event.originalIndex], selectedClassId };
                                    onReclassEventsChange(updatedReclass);
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

              <div className="flex items-center space-x-2 ml-6">
                {(unitCanPromote || unitCanReclass) && (
                  <button
                    onClick={() => {
                      const hasNoRealEvents = unitPromotionEvents.length === 0 && unitReclassEvents.length === 0;

                      if (hasNoRealEvents && baseOrReclassedClass?.promotesTo && baseOrReclassedClass.promotesTo.length > 0) {
                        const seededEvent: PromotionEvent = {
                          level: isTraineeClass(baseOrReclassedClass.id) ? 10 : 20,
                          selectedClassId: baseOrReclassedClass.promotesTo[0],
                          order: 0
                        };

                        const promotedClass = classes.find(c => c.id === seededEvent.selectedClassId && c.game === unit.game);

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
                            onPromotionEventsChange([seededEvent, newEvent]);
                          } else {
                            const newEvent: ReclassEvent = { level: 20, selectedClassId: picked.id, order: 1 };
                            onPromotionEventsChange([seededEvent]);
                            onReclassEventsChange([newEvent]);
                          }
                        } else {
                          onPromotionEventsChange([seededEvent]);
                        }
                        return;
                      }

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
                          onPromotionEventsChange([...unitPromotionEvents, newEvent]);
                        } else {
                          const newEvent: ReclassEvent = {
                            level: defaultLevel,
                            selectedClassId: selectedClass.id,
                            order: nextOrder
                          };
                          onReclassEventsChange([...unitReclassEvents, newEvent]);
                        }
                      }
                    }}
                    className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                    title="Add class change"
                  >
                    +
                  </button>
                )}

                {(unitPromotionEvents.length + unitReclassEvents.length > 1) && (
                  <button
                    onClick={() => {
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
                           onPromotionEventsChange(unitPromotionEvents.filter((_, i) => i !== lastEvent.idx));
                        } else {
                          onReclassEventsChange(unitReclassEvents.filter((_, i) => i !== lastEvent.idx));
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
        })()}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                Level
              </th>
              {activeStatKeys.map((statKey) => {
                let statLabel = statKey.toUpperCase();
                if (statKey === 'str' && !progressionData.statKeys.includes('mag')) {
                  statLabel = 'STR/MAG';
                } else if (statKey === 'skl') {
                  const hasDex = (unit.stats && unit.stats.dex !== undefined) || (unit.growths && unit.growths.dex !== undefined);
                  const hasSkl = (unit.stats && unit.stats.skl !== undefined) || (unit.growths && unit.growths.skl !== undefined);
                  if (hasDex && hasSkl) statLabel = 'SKL/DEX';
                  else if (hasDex) statLabel = 'DEX';
                }

                return (
                  <th
                    key={`header-${statKey}`}
                    className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-900 bg-gray-100 border-l-4 border-l-gray-400"
                  >
                    {statLabel}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, rowIndex) => (
              <tr key={row.internalLevel} className={`${row.isPromotionLevel ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900 sticky left-0 bg-white">
                  {row.displayLevel}
                </td>
                {activeStatKeys.map((statKey) => {
                  let rawStatValue = row.stats[statKey];
                  if (statKey === 'skl' && (rawStatValue === undefined || rawStatValue === null)) {
                    rawStatValue = row.stats['dex'];
                  }

                  const statValue = rawStatValue !== undefined ? Number(rawStatValue.toFixed(2)) : undefined;

                  let isCapped = row.cappedStats?.[statKey];
                  if (statKey === 'skl' && (isCapped === undefined || isCapped === null)) {
                    isCapped = row.cappedStats?.['dex'];
                  }

                  const shouldShowDash = row.isSkipped;

                  let highlightClass = row.isPromotionLevel ? 'bg-blue-100' : '';

                  if (otherUnit && !shouldShowDash) {
                    const otherRow = otherUnitProgressionMap.get(row.internalLevel);
                    if (otherRow && !otherRow.isSkipped) {
                      let rawOtherStatValue = otherRow.stats[statKey];
                      if (statKey === 'skl' && (rawOtherStatValue === undefined || rawOtherStatValue === null)) {
                        rawOtherStatValue = otherRow.stats['dex'];
                      }
                      if (rawStatValue !== undefined && rawStatValue !== null && rawOtherStatValue !== undefined && rawOtherStatValue !== null) {
                        if (rawStatValue > rawOtherStatValue) {
                          highlightClass = 'bg-green-500/20';
                        } else if (rawStatValue === rawOtherStatValue && rawStatValue !== 0) {
                          highlightClass = 'bg-yellow-500/20';
                        } else {
                          highlightClass = '';
                        }
                      }
                    }
                  }

                  return (
                    <td
                      key={`${row.internalLevel}-${statKey}`}
                      className={`border border-gray-300 px-2 py-1 text-center text-sm ${highlightClass} ${isCapped ? 'text-green-600 font-bold' : ''} border-l-4 border-l-gray-400`}
                    >
                      {shouldShowDash ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span>
                          {statValue !== undefined ? statValue : '-'}
                          {row.isPromotionLevel && row.promotionInfo && (
                            <button
                              onClick={() => handlePromotionInfoClick(row.promotionInfo || { className: '', classSkills: [] }, unit.game)}
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