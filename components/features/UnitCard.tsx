import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit } from '@/types/unit';

interface UnitCardProps {
  unit: Unit;
  className?: string;
}

export function UnitCard({ unit, className }: UnitCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{unit.name}</span>
          <span className="text-sm text-muted-foreground">{unit.game}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-4">
        <div className="w-20 h-20 bg-fe-gold-100 rounded-full flex items-center justify-center border-4 border-fe-gold-300 shadow-lg">
          <span className="text-3xl font-bold text-fe-blue-900">{unit.name.charAt(0)}</span>
        </div>
      </CardContent>
    </Card>
  );
}