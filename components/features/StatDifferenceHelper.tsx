import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit } from '@/types/unit';
import { compareUnits } from '@/lib/stats';

interface StatDifferenceHelperProps {
  unitA: Unit;
  unitB: Unit;
  targetLevel?: number;
  className?: string;
}

export function StatDifferenceHelper({ 
  unitA, 
  unitB, 
  targetLevel, 
  className 
}: StatDifferenceHelperProps) {
  if (!targetLevel) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Select a target level to see stat differences.
          </div>
        </CardContent>
      </Card>
    );
  }

  const differences = compareUnits(unitA, unitB, targetLevel);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Stat Differences</span>
          <span className="text-sm font-normal text-muted-foreground">
            At Level {targetLevel}
          </span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <span className="text-fe-blue-600">{unitA.name}</span>
          {' vs '}
          <span className="text-fe-red-600">{unitB.name}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(differences).map(([statKey, difference]) => {
            if (difference === undefined || difference === 0) return null; // Hide stats with no difference
            
            const isPositive = difference > 0;
            const statLabel = getStatLabel(statKey);
            
            return (
              <div key={statKey} className="flex items-center justify-between">
                <span className="font-medium">{statLabel}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm ${
                    isPositive ? 'text-fe-green-600' : 'text-fe-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{difference}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    isPositive 
                      ? 'bg-fe-green-100 text-fe-green-800' 
                      : 'bg-fe-red-100 text-fe-red-800'
                  }`}>
                    {isPositive ? unitA.name : unitB.name}
                  </span>
                </div>
              </div>
            );
          })}
          
          {Object.values(differences).every(diff => diff === undefined || diff === 0) && (
            <div className="text-center text-muted-foreground py-4">
              No stat differences at Level {targetLevel}
            </div>
          )}
        </div>
        
        {/* Summary Section */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <span className="font-medium">Positive numbers:</span> {unitA.name} has higher stats
            </p>
            <p>
              <span className="font-medium">Negative numbers:</span> {unitB.name} has higher stats
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get user-friendly stat labels
function getStatLabel(statKey: string): string {
  const labels: Record<string, string> = {
    hp: 'HP',
    str: 'Strength',
    mag: 'Magic',
    skl: 'Skill',
    dex: 'Dexterity',
    spd: 'Speed',
    lck: 'Luck',
    def: 'Defense',
    res: 'Resistance',
    con: 'Constitution',
    bld: 'Build',
    mov: 'Movement',
    cha: 'Charm'
  };
  
  return labels[statKey] || statKey.charAt(0).toUpperCase() + statKey.slice(1);
}