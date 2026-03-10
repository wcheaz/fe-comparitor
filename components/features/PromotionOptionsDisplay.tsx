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

  // Build the promotion tree using useMemo
  const promotionTree = useMemo(() => {
    if (classes.length === 0 || !unit) {
      return null;
    }
    return getPromotionTree(unit.class, unit);
  }, [classes, unit, getPromotionTree]);

  // Get valid reclass options using useMemo
  const reclassOptions = useMemo(() => {
    if (classes.length === 0 || !unit || !unit.reclassOptions || unit.reclassOptions.length === 0) {
      return [];
    }

    // Helper function to get reason why reclass is invalid
    const getReclassInvalidReason = (targetUnit: Unit, targetClass: Class): string => {
      const validOptions = getValidReclassOptions(targetUnit, classes);
      if (!validOptions.includes(targetClass.id) && !validOptions.includes(targetClass.name)) {
        if (targetUnit.level < 10) {
          return "Must be at least Level 10";
        }
        return "Not a valid reclass target";
      }
      return "";
    };

    const validReclassOptions: ReclassOption[] = [];
    
    for (const classId of unit.reclassOptions) {
      const targetClass = classes.find((c: Class) => 
        (c.id === classId || c.name === classId) && c.game === unit.game
      );
      
      if (targetClass) {
        // Check if this reclass is valid based on tier rules and level
        const isValid = getValidReclassOptions(unit, classes).includes(classId);
        
        validReclassOptions.push({
          cls: targetClass,
          isValid,
          reason: isValid ? undefined : getReclassInvalidReason(unit, targetClass)
        });
      }
    }

    return validReclassOptions;
  }, [classes, unit]);

  if (!unit) return null;

  return (
    <div className="space-y-4">
      {/* Promotion Options Section */}
      <Card>
        <CardHeader>
          <CardTitle>Promotion Options - {unit.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {promotionTree ? (
            <ul className="space-y-2">
              <ClassNodeComponent node={promotionTree} />
            </ul>
          ) : (
            <p className="text-gray-600">No promotion options available</p>
          )}
        </CardContent>
      </Card>

      {/* Reclass Options Section */}
      {reclassOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reclass Options - {unit.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reclassOptions.map((option, index) => (
                <div 
                  key={`${option.cls.id}-${index}`}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    option.isValid 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ClassPill cls={option.cls} />
                    {!option.isValid && option.reason && (
                      <span className="text-sm text-gray-500 italic">
                        ({option.reason})
                      </span>
                    )}
                  </div>
                  {option.isValid && (
                    <button
                      onClick={() => {
                        if (!unit || !onReclassEventsChange) return;
                        
                        const newReclassEvent: ReclassEvent = {
                          level: unit.level,
                          selectedClassId: option.cls.id
                        };
                        
                        const currentEvents = reclassEvents[unit.id] || [];
                        const updatedEvents = [...currentEvents, newReclassEvent];
                        
                        onReclassEventsChange({
                          ...reclassEvents,
                          [unit.id]: updatedEvents
                        });
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      title="Reclass to this class"
                    >
                      Reclass Here
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Reclass Events Section */}
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