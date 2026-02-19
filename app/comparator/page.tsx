'use client';

import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation'; // TEMPORARILY DISABLED
import { Unit } from '@/types/unit';
import { getUnitById } from '@/lib/data';
import { UnitSelector } from '@/components/features/UnitSelector';
import { ComparisonGrid } from '@/components/features/ComparisonGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ComparatorPage() {
  const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const maxUnits = 4;

  // TEMPORARILY DISABLED: Load pre-selected units from URL parameters
  // This was causing build issues with static generation
  useEffect(() => {
    // For now, just set loading to false immediately
    setIsLoading(false);
    
    // TODO: Re-enable URL parameter loading when we have a proper solution
    // for client-side only parameter handling
  }, []);

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

        {/* Main Layout - Horizontal Comparison */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="xl:col-span-3 space-y-6">
            {/* Unit Selector */}
            <UnitSelector
              selectedUnits={selectedUnits}
              onUnitSelect={handleUnitSelect}
              onUnitRemove={handleUnitRemove}
              maxUnits={maxUnits}
            />

            
          </div>

          {/* Main Content - Horizontal Comparison Grid */}
          <div className="xl:col-span-9">
            <ComparisonGrid
              units={selectedUnits}
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
                  <h3 className="font-semibold mb-2">2. View Progression</h3>
                  <p>The combined stats table shows how each unit's stats progress from their 
                  base level to the maximum level, including stat calculations based on growth rates.</p>
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