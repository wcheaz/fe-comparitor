import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit } from '@/types/unit';

interface UnitCardProps {
  unit: Unit;
  targetLevel?: number;
  showStats?: boolean;
  className?: string;
}

export function UnitCard({ unit, targetLevel, showStats = false, className }: UnitCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{unit.name}</span>
          <span className="text-sm text-muted-foreground">{unit.game}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-fe-gold-100 rounded-lg flex items-center justify-center border-2 border-fe-gold-300">
            <span className="text-2xl font-bold text-fe-blue-900">{unit.name.charAt(0)}</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-fe-blue-900">{unit.class}</p>
            <p className="text-xs text-fe-blue-600">
              Joins: {unit.joinChapter} • Lv. {unit.level}
            </p>
            {targetLevel && (
              <p className="text-xs text-fe-blue-600">
                Calculated at Lv. {targetLevel}
              </p>
            )}
          </div>
        </div>
        
        {showStats && unit.stats && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(unit.stats).map(([stat, value]) => (
              <div key={stat} className="flex justify-between text-fe-blue-900">
                <span className="font-medium text-fe-blue-700">{stat.toUpperCase()}:</span>
                <span className="text-fe-gold-700 font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
        
        {unit.affinity && (
          <div className="text-xs text-fe-blue-600">
            Affinity: <span className="font-medium text-fe-gold-700">{unit.affinity}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}