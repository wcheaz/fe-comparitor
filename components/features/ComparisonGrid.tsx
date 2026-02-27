import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit, Class, PromotionEvent } from '@/types/unit';
import { UnitCard } from './UnitCard';
import { StatTable } from './StatTable';
import { ClassAbilitiesRow } from './ClassAbilitiesRow';
import AbilityPill from '@/components/ui/AbilityPill';
import SupportPill from '@/components/ui/SupportPill';
import { getMinLevel, getMaxLevel } from '@/lib/stats';
import { getAllClasses, getAllUnits } from '@/lib/data';
import { Info } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { getAffinityByName, calculateSupportBonuses } from '@/lib/affinities';
import { getMovementByName } from '@/lib/movements';
import { getWeaponByName } from '@/lib/weapons';
import { cn } from '@/lib/utils';

interface ComparisonGridProps {
  units: Unit[];
  promotionEvents?: Record<string, PromotionEvent[]>;
  showStats?: boolean;
  showGrowths?: boolean;
  className?: string;
}

export function ComparisonGrid({
  units,
  promotionEvents,
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
  const [allUnits, setAllUnits] = React.useState<Unit[]>([]);

  // State for affinity modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAffinity, setSelectedAffinity] = useState<string | null>(null);

  // State for movement modal
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<{ type: string, game: string } | null>(null);

  // State for class modal
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // State for weapon modal
  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);

  // State for promotion modal
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [selectedPromotionClass, setSelectedPromotionClass] = useState<Class | null>(null);

  // State for support bonuses modal
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedSupportPartner, setSelectedSupportPartner] = useState<string | null>(null);
  const [selectedSupportUnit, setSelectedSupportUnit] = useState<Unit | null>(null);

  // Handle affinity info icon click
  const handleAffinityInfoClick = (affinityName: string) => {
    setSelectedAffinity(affinityName);
    setIsModalOpen(true);
  };

  // Handle movement info icon click
  const handleMovementInfoClick = (movementType: string, game: string) => {
    setSelectedMovement({ type: movementType, game });
    setIsMovementModalOpen(true);
  };

  // Handle class info click
  const handleClassInfoClick = (cls: Class) => {
    setSelectedClass(cls);
    setIsClassModalOpen(true);
  };

  // Handle weapon info icon click
  const handleWeaponInfoClick = (weaponName: string) => {
    setSelectedWeapon(weaponName);
    setIsWeaponModalOpen(true);
  };

  // Handle promotion info icon click
  const handlePromotionInfoClick = (promotionString: string, game: string) => {
    const promoClass = classes.find(c => (c.id === promotionString || c.name === promotionString) && c.game === game);
    if (promoClass) {
      setSelectedPromotionClass(promoClass);
      setIsPromotionModalOpen(true);
    }
  };

  // Handle support partner click
  const handleSupportPartnerClick = (partnerName: string, currentUnit: Unit) => {
    setSelectedSupportPartner(partnerName);
    setSelectedSupportUnit(currentUnit);
    setIsSupportModalOpen(true);
  };

  // Find partner unit by name using the cached allUnits state
  const findPartnerUnit = (partnerName: string, game: string): Unit | null => {
    return allUnits.find(u => u.name === partnerName && u.game === game) || null;
  };

  // Render affinity details for modal
  const renderAffinityDetails = () => {
    if (!selectedAffinity) {
      return null;
    }

    const affinityData = getAffinityByName(selectedAffinity);

    if (!affinityData) {
      return (
        <div>
          <h2 className="text-2xl font-bold">{selectedAffinity} Affinity</h2>
          <p>Affinity data not found.</p>
        </div>
      );
    }

    const gameName = 'Binding Blade'; // Or pass it down if dynamic
    const supportLevels: Array<'C' | 'B' | 'A'> = ['C', 'B', 'A'];

    return (
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{affinityData.name} Affinity</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{affinityData.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Support Bonuses</h3>
            <p className="text-sm text-muted-foreground mb-3">
              These bonuses are added per support level when fighting near the supported partner, and any fractional values are rounded down in-game.
            </p>
            <div className="space-y-3">
              {supportLevels.map(level => {
                const bonuses = calculateSupportBonuses(affinityData, gameName, level);
                if (bonuses.length === 0) return null;

                return (
                  <div key={level} className="border-l-4 border-primary pl-3">
                    <h4 className="font-semibold text-primary">{level} Support</h4>
                    <ul className="mt-1 space-x-2 flex flex-wrap">
                      {bonuses.map((bonus, index) => (
                        <li key={index} className="text-sm text-muted-foreground inline-flex items-center after:content-[','] last:after:content-none pr-1">
                          {bonus}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render movement details for modal
  const renderMovementDetails = () => {
    if (!selectedMovement) return null;

    const movementData = getMovementByName(selectedMovement.type);
    if (!movementData) {
      return (
        <div>
          <h2 className="text-2xl font-bold">{selectedMovement.type} Movement</h2>
          <p>Movement data not found.</p>
        </div>
      );
    }

    const { game } = selectedMovement;
    const gameDetail = movementData.gameSpecificDetails?.[game];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-bold">{movementData.name} Movement</h2>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Description</h3>
          <p className="text-muted-foreground">{movementData.description}</p>
        </div>

        {movementData.abilities && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Abilities</h3>
            <p className="text-muted-foreground">{movementData.abilities}</p>
          </div>
        )}

        {movementData.weaknesses && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Weaknesses</h3>
            <p className="text-muted-foreground">{movementData.weaknesses}</p>
          </div>
        )}

        {gameDetail && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Game Specific Bonuses</h3>
            <p className="border-l-4 border-primary pl-3 py-1 font-medium bg-primary/10 rounded-r text-primary-foreground">
              {gameDetail}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render class details for modal
  const renderClassDetails = () => {
    if (!selectedClass) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
        </div>

        {selectedClass.description ? (
          <div>
            <h3 className="text-lg font-semibold mb-1">Description & Special Qualities</h3>
            <p className="text-muted-foreground">{selectedClass.description}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">No special qualities or description available for this class.</p>
        )}
      </div>
    );
  };

  // Render weapon details for modal
  const renderWeaponDetails = () => {
    if (!selectedWeapon) return null;

    const weaponData = getWeaponByName(selectedWeapon);
    if (!weaponData) {
      return (
        <div>
          <h2 className="text-2xl font-bold">{selectedWeapon}</h2>
          <p>Weapon data not found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-bold">{weaponData.name}</h2>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
            {weaponData.type} - {weaponData.rank}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-2">
          <div className="bg-muted/50 p-2 rounded text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">Mt</div>
            <div className="font-bold">{weaponData.might}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">Hit</div>
            <div className="font-bold">{weaponData.hit}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">Crit</div>
            <div className="font-bold">{weaponData.crit}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">Wt</div>
            <div className="font-bold">{weaponData.weight}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">Rng</div>
            <div className="font-bold">{weaponData.range}</div>
          </div>
          <div className="bg-muted/50 p-2 rounded text-center">
            <div className="text-xs text-muted-foreground font-medium mb-1">Uses</div>
            <div className="font-bold">{weaponData.uses === Infinity ? '∞' : weaponData.uses ?? '-'}</div>
          </div>
        </div>

        {weaponData.description && (
          <div className="pt-2 border-t">
            <h3 className="text-sm font-semibold mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">{weaponData.description}</p>
          </div>
        )}
      </div>
    );
  };

  // Render promotion details for modal
  const renderPromotionDetails = () => {
    if (!selectedPromotionClass) return null;

    const promoClass = selectedPromotionClass;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-bold">{promoClass.name} Promotion Details</h2>
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-semibold mb-2">Promotion Bonuses</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {Object.entries(promoClass.promotionBonus).map(([statKey, value]) => {
              if (value === undefined) return null;

              let label = statKey.toUpperCase();
              if (statKey !== 'hp') {
                label = statKey.charAt(0).toUpperCase() + statKey.slice(1);
              }
              if (statKey === 'mov') label = 'Mov';
              if (statKey === 'con') label = 'Con';
              if (statKey === 'bld') label = 'Bld';
              if (statKey === 'res') label = 'Res';
              if (statKey === 'def') label = 'Def';
              if (statKey === 'lck') label = 'Lck';
              if (statKey === 'spd') label = 'Spd';
              if (statKey === 'skl') label = 'Skl';
              if (statKey === 'dex') label = 'Dex';
              if (statKey === 'str') label = 'Str';
              if (statKey === 'mag') label = 'Mag';

              return (
                <div key={statKey} className="bg-muted/50 p-2 rounded text-center">
                  <div className="text-xs text-muted-foreground font-medium mb-1">{label}</div>
                  <div className="font-bold">{(value as number) > 0 ? `+${value}` : value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {promoClass.classAbilities && promoClass.classAbilities.length > 0 && (
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-2">Class Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {promoClass.classAbilities.map((ability, index) => (
                <AbilityPill
                  key={index}
                  ability={ability}
                  game={promoClass.game}
                />
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-1">Movement Type</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
              {promoClass.movementType || 'Infantry'}
            </span>
          </div>
        </div>

        {promoClass.weapons && promoClass.weapons.length > 0 && (
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-1">Weapons</h3>
            <div className="flex flex-wrap gap-2">
              {promoClass.weapons.map(weapon => (
                <span key={weapon} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                  {weapon}
                </span>
              ))}
            </div>
          </div>
        )}

        {promoClass.description && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-1">Description & Special Qualities</h3>
            <p className="text-muted-foreground">{promoClass.description}</p>
          </div>
        )}
      </div>
    );
  };

  // Calculate combined support bonuses for two units
  const calculateCombinedSupportBonuses = (unit1: Unit, unit2: Unit, level: 'C' | 'B' | 'A') => {
    const affinity1 = getAffinityByName(unit1.affinity || 'Fire');
    const affinity2 = getAffinityByName(unit2.affinity || 'Fire');

    if (!affinity1 || !affinity2) return [];

    const gameKey = unit1.game.includes('Binding Blade') || unit1.game.includes('Blazing Blade') || unit1.game.includes('Sacred Stones') ? 'GBA' :
      unit1.game.includes('Path of Radiance') ? 'Path of Radiance' : null;

    if (!gameKey) return [];

    const bonuses1 = affinity1.bonuses[gameKey as keyof typeof affinity1.bonuses];
    const bonuses2 = affinity2.bonuses[gameKey as keyof typeof affinity2.bonuses];

    if (!bonuses1 || !bonuses2) return [];

    const multiplierMap = { 'C': 1, 'B': 2, 'A': 3 };
    const mult = multiplierMap[level];

    const combinedBonuses: string[] = [];

    // Combine both affinities' bonuses
    const totalAttack = (bonuses1.attack + bonuses2.attack) * mult;
    const totalDefense = (bonuses1.defense + bonuses2.defense) * mult;
    const totalHit = (bonuses1.hit + bonuses2.hit) * mult;
    const totalAvoid = (bonuses1.avoid + bonuses2.avoid) * mult;
    const totalCritical = (bonuses1.critical + bonuses2.critical) * mult;
    const totalDodge = (bonuses1.dodge + bonuses2.dodge) * mult;

    if (totalAttack > 0) combinedBonuses.push(`Attack +${totalAttack.toFixed(1).replace('.0', '')}`);
    if (totalDefense > 0) combinedBonuses.push(`Defense +${totalDefense.toFixed(1).replace('.0', '')}`);
    if (totalHit > 0) combinedBonuses.push(`Hit +${totalHit.toFixed(1).replace('.0', '')}`);
    if (totalAvoid > 0) combinedBonuses.push(`Avoid +${totalAvoid.toFixed(1).replace('.0', '')}`);
    if (totalCritical > 0) combinedBonuses.push(`Critical +${totalCritical.toFixed(1).replace('.0', '')}`);
    if (totalDodge > 0) combinedBonuses.push(`Dodge +${totalDodge.toFixed(1).replace('.0', '')}`);

    return combinedBonuses;
  };

  // Render support bonuses modal content
  const renderSupportBonusesModal = () => {
    if (!selectedSupportUnit || !selectedSupportPartner) return null;

    const partnerUnit = findPartnerUnit(selectedSupportPartner, selectedSupportUnit.game);
    if (!partnerUnit) return null;

    const supportLevels: Array<'C' | 'B' | 'A'> = ['C', 'B', 'A'];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-bold">Support Bonuses</h2>
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>{selectedSupportUnit.name}</strong> + <strong>{selectedSupportPartner}</strong></p>
          <p>Affinities: {selectedSupportUnit.affinity || 'None'} + {partnerUnit.affinity || 'None'}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Combined Support Bonuses</h3>
          <p className="text-sm text-muted-foreground">
            These bonuses are applied to both units when fighting near each other.
          </p>

          <div className="grid gap-3">
            {supportLevels.map(level => {
              const bonuses = calculateCombinedSupportBonuses(selectedSupportUnit, partnerUnit, level);
              if (bonuses.length === 0) return null;

              return (
                <div key={level} className="border-l-4 border-primary pl-3">
                  <h4 className="font-semibold text-primary">{level} Support</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bonuses.map((bonus, index) => (
                      <span key={index} className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {bonus}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    getAllClasses().then(setClasses).catch(console.error);
    getAllUnits().then(setAllUnits).catch(console.error);
  }, []);

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
                  {units.map((unit) => {
                    const cls = classes.find(c => (c.id === unit.class.toLowerCase().replace(/\s+/g, '_') || c.name === unit.class) && c.game === unit.game);
                    const displayName = cls ? cls.name : unit.class;
                    return (
                      <td key={`class-${unit.id}`} className="text-center p-2">
                        <div className="flex items-center justify-center gap-1">
                          {displayName}
                          {cls && (
                            <Info
                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              aria-label={`View details about ${displayName} class`}
                              onClick={() => handleClassInfoClick(cls)}
                            />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Join Chapter</td>
                  {units.map((unit) => (
                    <td key={`join-${unit.id}`} className="text-center p-2">
                      {Array.isArray(unit.joinChapter)
                        ? unit.joinChapter.join(', ')
                        : unit.joinChapter}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Movement Type</td>
                  {units.map((unit) => {
                    const cls = classes.find(c => (c.id === unit.class.toLowerCase().replace(/\s+/g, '_') || c.name === unit.class) && c.game === unit.game);
                    const movType = cls?.movementType || 'Infantry';
                    return (
                      <td key={`movement-${unit.id}`} className="text-center p-2">
                        <div className="flex items-center justify-center gap-1">
                          {movType}
                          <Info
                            className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            aria-label={`View details about ${movType} movement`}
                            onClick={() => handleMovementInfoClick(movType, unit.game)}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Level</td>
                  {units.map((unit) => (
                    <td key={`level-${unit.id}`} className="text-center p-2">
                      Lv. {unit.level}{unit.isPromoted ? ' (Promoted)' : ''}
                    </td>
                  ))}
                </tr>
                {/* Class Abilities Row */}
                {units.some(unit => {
                  const cls = classes.find(c => (c.id === unit.class.toLowerCase().replace(/\s+/g, '_') || c.name === unit.class) && c.game === unit.game);
                  return cls && cls.classAbilities && cls.classAbilities.length > 0;
                }) && (
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium align-top">Class Abilities</td>
                      {units.map((unit) => (
                        <td key={`abilities-${unit.id}`} className="text-center p-2 align-top">
                          <ClassAbilitiesRow
                            unit={unit}
                            classes={classes}
                          />
                        </td>
                      ))}
                    </tr>
                  )}
                {units.some(u => {
                  const cls = classes.find(c => (c.id === u.class.toLowerCase().replace(/\s+/g, '_') || c.name === u.class) && c.game === u.game);
                  return cls && cls.promotesTo && cls.promotesTo.length > 0;
                }) && (
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium align-top">Promotion Options</td>
                      {units.map((unit) => {
                        const cls = classes.find(c => (c.id === unit.class.toLowerCase().replace(/\s+/g, '_') || c.name === unit.class) && c.game === unit.game);
                        const promotesTo = cls?.promotesTo || [];
                        const selectedClassId = promotionEvents?.[unit.id]?.[0]?.selectedClassId || promotesTo[0];
                        return (
                          <td key={`promo-${unit.id}`} className="text-center p-2 align-top">
                            {promotesTo.length > 0 ? (
                              <div className="flex flex-col items-center gap-2">
                                {promotesTo.map((promoId) => {
                                  const promoCls = classes.find(c => (c.id === promoId || c.name === promoId) && c.game === unit.game);
                                  const displayName = promoCls ? promoCls.name : promoId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                  const isSelected = promoId === selectedClassId;
                                  return (
                                    <div key={promoId} className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${isSelected ? 'bg-blue-100 border border-blue-300' : 'bg-muted/30'}`}>
                                      {isSelected && (
                                        <span className="text-blue-600 font-bold">✓</span>
                                      )}
                                      <span className={isSelected ? 'font-bold text-blue-800' : ''}>{displayName}</span>
                                      {promoCls && (
                                        <Info
                                          className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors shrink-0"
                                          aria-label={`View details about ${displayName} promotion`}
                                          onClick={() => handlePromotionInfoClick(promoId, unit.game)}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                {units.some(u => u.affinity) && (
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">Affinity</td>
                    {units.map((unit) => (
                      <td key={`affinity-${unit.id}`} className="text-center p-2">
                        <div className="flex items-center justify-center gap-1">
                          {unit.affinity || '-'}
                          {unit.affinity && (
                            <Info
                              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              aria-label={`View details about ${unit.affinity} affinity`}
                              onClick={() => handleAffinityInfoClick(unit.affinity!)}
                            />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}
                {units.some(u => u.prf && u.prf.length > 0) && (
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium align-top">Prf Weapons</td>
                    {units.map((unit) => (
                      <td key={`prf-${unit.id}`} className="text-center p-2 align-top">
                        {unit.prf && unit.prf.length > 0 ? (
                          <div className="flex flex-col items-center gap-2">
                            {unit.prf.map((weaponName, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-sm bg-muted/30 px-2 py-1 rounded">
                                <span>{weaponName}</span>
                                <Info
                                  className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors shrink-0"
                                  aria-label={`View details about ${weaponName}`}
                                  onClick={() => handleWeaponInfoClick(weaponName)}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )}
                {units.some(u => u.baseWeaponRanks && Object.keys(u.baseWeaponRanks).length > 0) && (
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium align-top">Weapon Ranks</td>
                    {units.map((unit) => (
                      <td key={`rank-${unit.id}`} className="text-center p-2 align-top">
                        {unit.baseWeaponRanks && Object.keys(unit.baseWeaponRanks).length > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            {Object.entries(unit.baseWeaponRanks).map(([weaponType, rank]) => (
                              <div key={weaponType} className="flex items-center gap-1 text-sm bg-muted/20 px-2 py-0.5 rounded">
                                <span className="text-muted-foreground">{weaponType}:</span>
                                <span className="font-semibold">{rank}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )}
                {units.some(u => u.supports && u.supports.length > 0) && (
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium align-top">Supports</td>
                    {units.map((unit) => (
                      <td key={`supports-${unit.id}`} className="text-center p-2 align-top">
                        {unit.supports && unit.supports.length > 0 ? (
                          <div className="max-h-32 overflow-y-auto pr-1">
                            <div className="grid grid-cols-2 gap-2">
                              {unit.supports.map((partnerName, idx) => (
                                <div key={idx} className="flex justify-center w-full">
                                  <SupportPill
                                    partnerName={partnerName}
                                    game={unit.game}
                                    onPartnerClick={(partnerName) => handleSupportPartnerClick(partnerName, unit)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )}
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
                              {getStatLabel(statKey, units)}
                            </td>
                            {units.map((unit, unitIndex) => {
                              let baseValue = unit.stats[statKey] ?? '-';
                              if (statKey === 'skl' && baseValue === '-') {
                                baseValue = unit.stats['dex'] ?? '-';
                              }

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
                                {getStatLabel(statKey, units)}
                              </td>
                              {units.map((unit, unitIndex) => {
                                let growthValue = unit.growths[statKey] ?? '-';
                                if (statKey === 'skl' && growthValue === '-') {
                                  growthValue = unit.growths['dex'] ?? '-';
                                }

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

      {/* Affinity Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          {renderAffinityDetails()}
        </div>
      </Modal>

      {/* Movement Details Modal */}
      <Modal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
      >
        <div className="space-y-4">
          {renderMovementDetails()}
        </div>
      </Modal>

      {/* Class Details Modal */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      >
        <div className="space-y-4">
          {renderClassDetails()}
        </div>
      </Modal>

      {/* Weapon Details Modal */}
      <Modal
        isOpen={isWeaponModalOpen}
        onClose={() => setIsWeaponModalOpen(false)}
      >
        <div className="space-y-4">
          {renderWeaponDetails()}
        </div>
      </Modal>

      {/* Promotion Details Modal */}
      <Modal
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
      >
        <div className="space-y-4">
          {renderPromotionDetails()}
        </div>
      </Modal>

      {/* Support Bonuses Modal */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      >
        <div className="space-y-4">
          {renderSupportBonusesModal()}
        </div>
      </Modal>

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
  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov', 'aid'];

  let common = statOrder.filter(stat => statSet.has(stat));
  if (statSet.has('skl') && statSet.has('dex')) {
    common = common.filter(c => c !== 'dex');
  }
  return common;
}

function getCommonBaseStats(units: Unit[]): string[] {
  if (units.length < 2) {
    return getCommonStats(units);
  }

  const commonStats: string[] = [];
  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov', 'aid'];

  statOrder.forEach(statKey => {
    const hasValidStat = units.some(unit =>
      unit.stats[statKey] !== undefined &&
      unit.stats[statKey] !== null
    );

    if (hasValidStat) {
      commonStats.push(statKey);
    }
  });

  let common = commonStats;
  const hasSkl = units.some(unit => unit.stats['skl'] !== undefined && unit.stats['skl'] !== null);
  const hasDex = units.some(unit => unit.stats['dex'] !== undefined && unit.stats['dex'] !== null);
  if (hasSkl && hasDex) {
    common = common.filter((c: string) => c !== 'dex');
  }

  return common;
}

function getCommonGrowthStats(units: Unit[]): string[] {
  if (units.length < 2) {
    return getCommonStats(units);
  }

  const commonStats: string[] = [];
  const statOrder = ['hp', 'str', 'mag', 'skl', 'dex', 'spd', 'lck', 'def', 'res', 'cha', 'con', 'bld', 'mov', 'aid'];

  statOrder.forEach(statKey => {
    const hasValidGrowth = units.some(unit =>
      unit.growths[statKey] !== undefined &&
      unit.growths[statKey] !== null
    );

    if (hasValidGrowth) {
      commonStats.push(statKey);
    }
  });

  let common = commonStats;
  const hasSkl = units.some(unit => unit.growths['skl'] !== undefined && unit.growths['skl'] !== null);
  const hasDex = units.some(unit => unit.growths['dex'] !== undefined && unit.growths['dex'] !== null);
  if (hasSkl && hasDex) {
    common = common.filter((c: string) => c !== 'dex');
  }

  return common;
}

function getStatLabel(statKey: string, units?: Unit[]): string {
  const labels: Record<string, string> = {
    hp: 'HP',
    str: 'Str',
    mag: 'Mag',
    skl: 'Skl',
    spd: 'Spd',
    lck: 'Lck',
    def: 'Def',
    res: 'Res',
    con: 'Con',
    bld: 'Bld',
    mov: 'Mov',
    aid: 'Aid',
    cha: 'Cha'
  };

  if (statKey === 'skl' && units) {
    const hasDex = units.some(u =>
      (u.stats && u.stats.dex !== undefined) ||
      (u.growths && u.growths.dex !== undefined)
    );
    const hasSkl = units.some(u =>
      (u.stats && u.stats.skl !== undefined) ||
      (u.growths && u.growths.skl !== undefined)
    );
    if (hasDex && hasSkl) return 'Skl/Dex';
    if (hasDex) return 'Dex';
    return 'Skl';
  }

  if (statKey === 'str' && units) {
    const hasMag = units.some(u =>
      (u.stats && u.stats.mag !== undefined) ||
      (u.growths && u.growths.mag !== undefined)
    );
    if (!hasMag) {
      return 'Str/Mag';
    }
  }

  return labels[statKey] || statKey.toUpperCase();
}

function getHighlightStats(units: Unit[], statKey: string, statType: 'base' | 'growth'): { isHighest: boolean; isEqual: boolean }[] {
  return units.map((unit, index) => {
    let currentValue = statType === 'base'
      ? unit.stats[statKey]
      : unit.growths[statKey];

    if (statKey === 'skl' && (currentValue === undefined || currentValue === null)) {
      currentValue = statType === 'base' ? unit.stats['dex'] : unit.growths['dex'];
    }

    // If current value is undefined, no highlight
    if (currentValue === undefined || currentValue === null) {
      return { isHighest: false, isEqual: false };
    }

    // Check if this value is strictly greater than all other units' values
    const isHighest = units.every((otherUnit, otherIndex) => {
      if (otherIndex === index) return true; // Skip comparing with self

      let otherValue = statType === 'base'
        ? otherUnit.stats[statKey]
        : otherUnit.growths[statKey];

      if (statKey === 'skl' && (otherValue === undefined || otherValue === null)) {
        otherValue = statType === 'base' ? otherUnit.stats['dex'] : otherUnit.growths['dex'];
      }

      // If other value is undefined/null, do not highlight as higher
      if (otherValue === undefined || otherValue === null) {
        return false;
      }

      // Current value must be strictly greater than other value
      return currentValue > otherValue;
    });

    // Check if all non-undefined values are equal
    const allValues = units.map(u => {
      let val = statType === 'base' ? u.stats[statKey] : u.growths[statKey];
      if (statKey === 'skl' && (val === undefined || val === null)) {
        val = statType === 'base' ? u.stats['dex'] : u.growths['dex'];
      }
      return val;
    }).filter(val => val !== undefined && val !== null);

    const isEqual = allValues.length > 1 && allValues.every(val => val === currentValue) && currentValue !== 0;

    return { isHighest, isEqual };
  });
}