import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Unit, Class, ReclassEvent } from '@/types/unit';
import { getAllClasses } from '@/lib/data';
import { getValidReclassOptions } from '@/lib/stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClassPill from '@/components/ui/ClassPill';

interface PromotionOptionsDisplayProps {
  unit: Unit | null;
  onReclassEventsChange?: (reclassEvents: Record<string, ReclassEvent[]>) => void;
  reclassEvents?: Record<string, ReclassEvent[]>;
}

interface ClassNode {
  cls: Class;
  promotions: ClassNode[];
}

interface ReclassOption {
  cls: Class;
  isValid: boolean;
  reason?: string;
}

// Recursive component to render class nodes
const ClassNodeComponent: React.FC<{ node: ClassNode }> = ({ node }) => {
  return (
    <li className="ml-4">
      <ClassPill cls={node.cls} />
      {node.promotions.length > 0 && (
        <ul className="ml-6 mt-2 space-y-2 border-l-2 border-fe-blue-200 pl-4">
          {node.promotions.map((promotionNode, index) => (
            <ClassNodeComponent key={`${promotionNode.cls.id}-${index}`} node={promotionNode} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const PromotionOptionsDisplay: React.FC<PromotionOptionsDisplayProps> = ({
  unit,
  onReclassEventsChange,
  reclassEvents = {}
}) => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const loadClasses = async () => {
      const allClasses = await getAllClasses();
      setClasses(allClasses);
    };
    loadClasses();
  }, []);

  // Recursive helper function to build promotion tree
  const getPromotionTree = useCallback((classId: string, targetUnit: Unit, visited = new Set<string>()): ClassNode | null => {
    if (visited.has(classId)) {
      return null; // Prevent infinite loops
    }
    visited.add(classId);

    // Find the class in the loaded classes
    const currentClass = classes.find((c: Class) => 
      (c.id === classId || c.name === classId) && c.game === targetUnit.game
    );

    if (!currentClass) {
      return null;
    }

    // Build the node
    const node: ClassNode = {
      cls: currentClass,
      promotions: []
    };

    // Recursively get promotion children
    if (currentClass.promotesTo.length > 0) {
      node.promotions = currentClass.promotesTo
        .map((promoId: string) => getPromotionTree(promoId, targetUnit, new Set(visited)))
        .filter((promoNode): promoNode is ClassNode => promoNode !== null);
    }

    return node;
  }, [classes]);

  // Combine and Sort all valid options
  const unifiedOptions = useMemo(() => {
    if (classes.length === 0 || !unit) {
      return [];
    }

    const optionsMap = new Map<string, Class>();

    // Add Promotions
    const getPromotions = (classId: string, visited = new Set<string>()) => {
      if (visited.has(classId)) return;
      visited.add(classId);

      const cls = classes.find(c => c.id === classId && c.game === unit.game);
      if (!cls) return;

      if (cls.id !== unit.class) { // Don't add base class to options
        optionsMap.set(cls.id, cls);
      }

      cls.promotesTo.forEach(promoId => getPromotions(promoId, new Set(visited)));
    };
    getPromotions(unit.class);

    // Add Reclasses
    if (unit.game?.toLowerCase() === 'awakening' && unit.reclassOptions) {
      const validReclasses = getValidReclassOptions(unit, classes);
      validReclasses.forEach(classId => {
        const cls = classes.find(c => c.id === classId && c.game === unit.game);
        if (cls) {
          optionsMap.set(cls.id, cls);
        }
      });
    }

    const sortedOptions = Array.from(optionsMap.values());

    // Sort by Tier (Tier 2 first, then Tier 1)
    sortedOptions.sort((a, b) => {
      const tierA = typeof a.tier === 'number' ? a.tier : 1;
      const tierB = typeof b.tier === 'number' ? b.tier : 1;
      return tierB - tierA; // Descending
    });

    return sortedOptions;
  }, [classes, unit]);

  if (!unit) return null;

  return (
    <div className="space-y-4">
      {/* Unified Class Change Options Section */}
      <Card>
        <CardHeader>
          <CardTitle>Class Change Options - {unit.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {unifiedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {unifiedOptions.map((cls, index) => (
                <div key={`${cls.id}-${index}`} className="flex items-center space-x-2">
                  <ClassPill cls={cls} />
                </div>
              ))}
            </div>
          ) : (
             <p className="text-gray-600">No class change options available</p>
          )}
        </CardContent>
      </Card>
      
      {/* Current Reclass Events Section (Read-Only) */}
      {reclassEvents[unit?.id || ''] && reclassEvents[unit?.id || ''].length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Reclass Events - {unit?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reclassEvents[unit?.id || ''].map((event, index) => {
                const targetClass = classes.find(c => c.id === event.selectedClassId && c.game === unit?.game);
                return (
                  <div key={`reclass-${unit?.id}-${index}`} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Level {event.level}:</span>
                      {targetClass && <ClassPill cls={targetClass} />}
                    </div>
                    <button
                      onClick={() => {
                        if (!unit || !onReclassEventsChange) return;
                        
                        const currentEvents = reclassEvents[unit.id] || [];
                        const updatedEvents = currentEvents.filter((_, i) => i !== index);
                        
                        onReclassEventsChange({
                          ...reclassEvents,
                          [unit.id]: updatedEvents
                        });
                      }}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      title="Remove this reclass event"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};