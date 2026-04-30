'use client';

import React, { useState } from 'react';
import { Unit, PromotionEvent, ReclassEvent } from '@/types/unit';
import { UnitSelector } from '@/components/features/UnitSelector';
import { ComparisonGrid } from '@/components/features/ComparisonGrid';
import { StatProgressionTable } from '@/components/features/StatProgressionTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ComparatorPage() {
  const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
  const [promotionEvents, setPromotionEvents] = useState<Record<string, PromotionEvent[]>>({});
  const [reclassEvents, setReclassEvents] = useState<Record<string, ReclassEvent[]>>({});
  const [hidePreJoinRows, setHidePreJoinRows] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Record<string, string>>({});
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
      <div className="px-4 lg:px-6 py-8">
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

        {/* Unit Selector */}
        <div className="mb-8">
          <UnitSelector
            selectedUnits={selectedUnits}
            onUnitSelect={handleUnitSelect}
            onUnitRemove={handleUnitRemove}
            maxUnits={maxUnits}
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <ComparisonGrid
            units={selectedUnits}
            promotionEvents={promotionEvents}
            reclassEvents={reclassEvents}
            onPromotionEventsChange={handlePromotionEventsChange}
            onReclassEventsChange={handleReclassEventsChange}
            selectedDifficulties={selectedDifficulties}
            onSelectedDifficultiesChange={setSelectedDifficulties}
            showStats={true}
            showGrowths={true}
          />

          {/* Stat Progression Tables — one per unit */}
          {selectedUnits.length > 0 && (
            <div>
              {selectedUnits.length === 2 && (
                <div className="flex items-center justify-end mb-2">
                  <label className="flex items-center space-x-2 whitespace-nowrap text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={hidePreJoinRows}
                      onChange={(e) => setHidePreJoinRows(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span>Hide unavailable levels</span>
                  </label>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedUnits.map((unit, index) => {
                  const otherUnit = selectedUnits.length === 2
                    ? selectedUnits[index === 0 ? 1 : 0]
                    : undefined;
                  return (
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
                          selectedDifficulty={selectedDifficulties[unit.id]}
                          {...(otherUnit ? {
                            otherUnit,
                            otherUnitPromotionEvents: promotionEvents[otherUnit.id] || [],
                            otherUnitReclassEvents: reclassEvents[otherUnit.id] || [],
                            otherUnitSelectedDifficulty: selectedDifficulties[otherUnit.id],
                            hidePreJoinRows,
                          } : {})}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
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