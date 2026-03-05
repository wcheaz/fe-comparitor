import React, { useState, useEffect, useMemo } from 'react';
import { Unit, Class } from '@/types/unit';
import { getAllClasses } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClassPill from '@/components/ui/ClassPill';

interface PromotionOptionsDisplayProps {
  unit: Unit | null;
}

interface ClassNode {
  cls: Class;
  promotions: ClassNode[];
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
  unit
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
  const getPromotionTree = (classId: string, targetUnit: Unit, visited = new Set<string>()): ClassNode | null => {
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
  };

  // Build the promotion tree using useMemo
  const promotionTree = useMemo(() => {
    if (classes.length === 0 || !unit) {
      return null;
    }
    return getPromotionTree(unit.class, unit);
  }, [classes, unit]);

  if (!unit) return null;

  return (
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
  );
};