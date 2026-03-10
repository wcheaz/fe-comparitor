'use client';

import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation'; // TEMPORARILY DISABLED
import { Unit, PromotionEvent, ReclassEvent, Class } from '@/types/unit';
import { getUnitById, getAllClasses } from '@/lib/data';
import { UnitSelector } from '@/components/features/UnitSelector';
import { ComparisonGrid } from '@/components/features/ComparisonGrid';
import { StatProgressionTable } from '@/components/features/StatProgressionTable';
import { PromotionOptionsDisplay } from '@/components/features/PromotionOptionsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ComparatorPage() {
  const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
  const [promotionEvents, setPromotionEvents] = useState<Record<string, PromotionEvent[]>>({});
  const [reclassEvents, setReclassEvents] = useState<Record<string, ReclassEvent[]>>({});
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const maxUnits = 4;

  // TEMPORARILY DISABLED: Load pre-selected units from URL parameters
  // This was causing build issues with static generation
  useEffect(() => {
    // Load classes data
    getAllClasses().then(setClasses).catch(console.error);

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

  const handlePromotionEventsChange = (newEvents: Record<string, PromotionEvent[]>) => {
    setPromotionEvents(newEvents);
  };

  const handleReclassEventsChange = (newEvents: Record<string, ReclassEvent[]>) => {
    setReclassEvents(newEvents);
  };

  // Utility functions for push/pop operations
  const addPromotionEvent = (unitId: string, event: PromotionEvent) => {
    setPromotionEvents(prev => ({
      ...prev,
      [unitId]: [...(prev[unitId] || []), event]
    }));
  };

  const removePromotionEvent = (unitId: string) => {
    setPromotionEvents(prev => {
      const currentEvents = prev[unitId] || [];
      if (currentEvents.length <= 1) return prev; // Don't remove if only one or none
      return {
        ...prev,
        [unitId]: currentEvents.slice(0, -1) // Remove last event
      };
    });
  };

  // Handler for individual unit promotion changes
  const handleUnit1PromotionChange = (events: PromotionEvent[]) => {
    if (selectedUnits[0]) {
      setPromotionEvents(prev => ({
        ...prev,
        [selectedUnits[0].id]: events
      }));
    }
  };

  const handleUnit2PromotionChange = (events: PromotionEvent[]) => {
    if (selectedUnits[1]) {
      setPromotionEvents(prev => ({
        ...prev,
        [selectedUnits[1].id]: events
      }));
    }
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
          <div className="xl:col-span-9 space-y-6">
            <ComparisonGrid
              units={selectedUnits}
              promotionEvents={promotionEvents}
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

            {/* Stat Progression Table */}
            {selectedUnits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Stat Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatProgressionTable
                    units={selectedUnits}
                    promotionEvents={promotionEvents}
                    reclassEvents={reclassEvents}
                    onPromotionEventsChange={handlePromotionEventsChange}
                    onReclassEventsChange={handleReclassEventsChange}
                    onAddPromotionEvent={addPromotionEvent}
                    onRemovePromotionEvent={removePromotionEvent}
                  />
                </CardContent>
              </Card>
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
                  <p>Use the unit selector to choose up to 4 units to compare.
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