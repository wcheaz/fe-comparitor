'use client';

import React, { useState } from 'react';
import { Unit, PromotionEvent, ReclassEvent } from '@/types/unit';
import { UnitSelector } from '@/components/features/UnitSelector';
import { ComparisonGrid } from '@/components/features/ComparisonGrid';
import { StatProgressionTable } from '@/components/features/StatProgressionTable';
import { PromotionOptionsDisplay } from '@/components/features/PromotionOptionsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ComparatorPage() {
  const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
  const [promotionEvents, setPromotionEvents] = useState<Record<string, PromotionEvent[]>>({});
  const [reclassEvents, setReclassEvents] = useState<Record<string, ReclassEvent[]>>({});
  const maxUnits = 2;

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnits(prev => [...prev, unit]);
  };

  const handleUnitRemove = (unitId: string) => {
    setSelectedUnits(prev => prev.filter(unit => unit.id !== unitId));
  };

  const handlePromotionEventsChange = (newEvents: Record<string, PromotionEvent[]>) => {
    setPromotionEvents(newEvents);
  };

  const handleReclassEventsChange = (newEvents: Record<string, ReclassEvent[]>) => {
    setReclassEvents(newEvents);
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
            Compare 2 units side-by-side. Select units, adjust the target level,
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
          <div className="xl:col-span-9 space-y-6">
            <ComparisonGrid
              units={selectedUnits}
              promotionEvents={promotionEvents}
              reclassEvents={reclassEvents}
              onPromotionEventsChange={handlePromotionEventsChange}
              onReclassEventsChange={handleReclassEventsChange}
              showStats={true}
              showGrowths={true}
            />

            {/* Promotion Options Display */}
            {selectedUnits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {selectedUnits.map((unit) => (
                  <PromotionOptionsDisplay key={`promo-display-${unit.id}`} unit={unit} />
                ))}
              </div>
            )}

            {/* Stat Progression Tables — one per unit */}
            {selectedUnits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedUnits.map((unit) => (
                  <Card key={`progression-${unit.id}`}>
                    <CardHeader>
                      <CardTitle>{unit.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StatProgressionTable
                        unit={unit}
                        promotionEvents={promotionEvents[unit.id] || []}
                        reclassEvents={reclassEvents[unit.id] || []}
                        onPromotionEventsChange={(events) => {
                          setPromotionEvents(prev => ({ ...prev, [unit.id]: events }));
                        }}
                        onReclassEventsChange={(events) => {
                          setReclassEvents(prev => ({ ...prev, [unit.id]: events }));
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
                  <p>Use the unit selector to choose 2 units to compare.
                    Filter by game or search for specific units.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. View Progression</h3>
                  <p>The combined stats table shows how each unit&apos;s stats progress from their
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