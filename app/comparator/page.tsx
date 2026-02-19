'use client';

import React, { useState } from 'react';
import { Unit } from '@/types/unit';
import { UnitSelector } from '@/components/features/UnitSelector';
import { ComparisonGrid } from '@/components/features/ComparisonGrid';
import { LevelSlider } from '@/components/features/LevelSlider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ComparatorPage() {
  const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
  const [targetLevel, setTargetLevel] = useState(20);
  const maxUnits = 4;

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnits(prev => [...prev, unit]);
  };

  const handleUnitRemove = (unitId: string) => {
    setSelectedUnits(prev => prev.filter(unit => unit.id !== unitId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-fe-blue-50 to-fe-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-fe-blue-900 mb-4">
            Unit Comparator
          </h1>
          <p className="text-lg text-fe-blue-700 max-w-2xl mx-auto">
            Compare up to 4 units side-by-side. Select units, adjust the target level, 
            and see detailed statistics and growth rates.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Unit Selector */}
            <UnitSelector
              selectedUnits={selectedUnits}
              onUnitSelect={handleUnitSelect}
              onUnitRemove={handleUnitRemove}
              maxUnits={maxUnits}
            />

            {/* Level Control */}
            <LevelSlider
              minLevel={1}
              maxLevel={99}
              currentLevel={targetLevel}
              onLevelChange={setTargetLevel}
            />
          </div>

          {/* Main Content - Comparison Grid */}
          <div className="lg:col-span-3">
            <ComparisonGrid
              units={selectedUnits}
              targetLevel={targetLevel}
              showStats={true}
              showGrowths={true}
              showAverage={true}
            />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-fe-blue-700">
                <div>
                  <h3 className="font-semibold mb-2">1. Select Units</h3>
                  <p>Use the unit selector to choose up to 4 units to compare. 
                  Filter by game or search for specific units.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. Adjust Level</h3>
                  <p>Use the level slider to see how units' stats would look at different levels. 
                  This calculates averages based on growth rates.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3. Analyze Results</h3>
                  <p>View base stats, growth rates, and calculated averages. 
                  Compare units side-by-side to find the best fit for your team.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}