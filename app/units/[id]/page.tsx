import React from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnitCard } from '@/components/features/UnitCard';
import { StatTable } from '@/components/features/StatTable';
// import { GrowthChart } from '@/components/features/GrowthChart'; // TEMPORARILY DISABLED
import { getUnitById, getAllUnits } from '@/lib/data';
import { calculateAverageStats } from '@/lib/stats';
import { Unit } from '@/types/unit';

interface UnitDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const unit = await getUnitById(params.id);

  if (!unit) {
    notFound();
  }

  // Calculate stats at max level for display
  const calculatedLevel = 20; // Could be game-specific
  const calculatedStats = calculateAverageStats(unit, calculatedLevel);
  const unitWithCalculatedStats = { ...unit, stats: calculatedStats };

  // Get other units for comparison suggestions
  const allUnits = await getAllUnits();
  const sameGameUnits = allUnits
    .filter(u => u.game === unit.game && u.id !== unit.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Unit Info */}
        <div className="lg:col-span-1 space-y-6">
          <UnitCard
            unit={unitWithCalculatedStats}
            className="w-full"
          />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <a href={`/comparator?units=${unit.id}`}>
                  Compare with Other Units
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={`/comparator?units=${unit.id}`}>
                  Add to Comparison
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Same Game Units */}
          {sameGameUnits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Other {unit.game} Units</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sameGameUnits.map((relatedUnit) => (
                  <div key={relatedUnit.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
                        <span className="text-sm font-bold">{relatedUnit.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{relatedUnit.name}</p>
                        <p className="text-xs text-muted-foreground">{relatedUnit.class}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/units/${relatedUnit.id}`}>View</a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Stats and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Stats and Growth Rates - Side by Side */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="w-full md:w-1/2 min-w-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Base Stats (Level {unit.level})</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatTable unit={unit} showGrowths={false} />
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-1/2 min-w-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Growth Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatTable unit={unit} showGrowths={true} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Calculated Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Average Stats at Level {calculatedLevel}</CardTitle>
            </CardHeader>
            <CardContent>
              <StatTable unit={unitWithCalculatedStats} showGrowths={false} />
            </CardContent>
          </Card>

          {/* Growth Chart - TEMPORARILY DISABLED DUE TO BUILD ERROR */}
          {/* 
          <Card>
            <CardHeader>
              <CardTitle>Growth Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <GrowthChart units={[unit]} />
            </CardContent>
          </Card>
          */}

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Game:</span>
                  <span className="ml-2">{unit.game}</span>
                </div>
                <div>
                  <span className="font-medium">Class:</span>
                  <span className="ml-2">{unit.class}</span>
                </div>
                <div>
                  <span className="font-medium">Joins:</span>
                  <span className="ml-2">{unit.joinChapter}</span>
                </div>
                <div>
                  <span className="font-medium">Base Level:</span>
                  <span className="ml-2">Lv. {unit.level}{unit.isPromoted ? ' (Promoted)' : ''}</span>
                </div>
              </div>

              {unit.affinity && (
                <div className="text-sm">
                  <span className="font-medium">Support Affinity:</span>
                  <span className="ml-2">{unit.affinity}</span>
                </div>
              )}

              {unit.skills && unit.skills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {unit.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {unit.supports && unit.supports.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Support Partners:</h4>
                  <div className="flex flex-wrap gap-2">
                    {unit.supports.map((support, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                      >
                        {support}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {unit.reclassOptions && unit.reclassOptions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Reclass Options:</h4>
                  <div className="flex flex-wrap gap-2">
                    {unit.reclassOptions.map((option, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all units (for SSG)
export async function generateStaticParams() {
  const units = await getAllUnits();
  return units.map((unit) => ({
    id: unit.id,
  }));
}