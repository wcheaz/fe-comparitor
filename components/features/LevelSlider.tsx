import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LevelSliderProps {
  minLevel?: number;
  maxLevel?: number;
  currentLevel: number;
  onLevelChange: (level: number) => void;
  className?: string;
}

export function LevelSlider({ 
  minLevel = 1, 
  maxLevel = 99, 
  currentLevel, 
  onLevelChange, 
  className 
}: LevelSliderProps) {
  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value);
    onLevelChange(newLevel);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Level Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Level: {currentLevel}
          </span>
          <div className="flex gap-2">
            <span className="text-xs text-muted-foreground">{minLevel}</span>
            <span className="text-xs text-muted-foreground">{maxLevel}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <input
            type="range"
            min={minLevel}
            max={maxLevel}
            value={currentLevel}
            onChange={handleLevelChange}
            className="w-full h-2 bg-fe-gold-200 rounded-lg appearance-none cursor-pointer accent-fe-gold-600 hover:accent-fe-gold-700"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <button
              onClick={() => onLevelChange(Math.max(minLevel, currentLevel - 1))}
              disabled={currentLevel <= minLevel}
              className="px-2 py-1 bg-fe-blue-100 text-fe-blue-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-fe-blue-200 transition-colors"
            >
              -1
            </button>
            <button
              onClick={() => onLevelChange(Math.min(maxLevel, currentLevel + 1))}
              disabled={currentLevel >= maxLevel}
              className="px-2 py-1 bg-fe-blue-100 text-fe-blue-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-fe-blue-200 transition-colors"
            >
              +1
            </button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Adjust the level to calculate average stats based on growth rates.</p>
        </div>
      </CardContent>
    </Card>
  );
}