import React from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnitCard } from '@/components/features/UnitCard';
import { getUnitsByGame } from '@/lib/data';

interface GamePageProps {
  params: {
    gameId: string;
  };
}

// Map URL-friendly game IDs to display names
const GAME_NAMES: Record<string, string> = {
  'binding-blade': 'Fire Emblem: Binding Blade',
  'three-houses': 'Fire Emblem: Three Houses',
  'engage': 'Fire Emblem: Engage',
};

export default async function GamePage({ params }: GamePageProps) {
  const gameName = GAME_NAMES[params.gameId];
  
  if (!gameName) {
    notFound();
  }

  const units = await getUnitsByGame(gameName);

  return (
    <div className="min-h-screen bg-gradient-to-b from-fe-blue-50 to-fe-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-fe-blue-900 mb-4">
            {gameName}
          </h1>
          <p className="text-lg text-fe-blue-700 max-w-2xl mx-auto">
            Browse all units from {gameName}. Click on any unit to view detailed statistics 
            and compare with other units.
          </p>
          <div className="mt-4">
            <Button asChild>
              <a href="/comparator">
                Compare Units
              </a>
            </Button>
            <Button variant="outline" className="ml-4" asChild>
              <a href="/">
                Back to Home
              </a>
            </Button>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {units.map((unit) => (
            <Card key={unit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {unit.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UnitCard unit={unit} />
                <div className="mt-4 text-center">
                  <Button asChild>
                    <a href={`/units/${unit.id}`}>
                      View Details
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Top */}
        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <a href="#">
              Back to Top
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all games
export async function generateStaticParams() {
  const games = ['binding-blade', 'three-houses', 'engage'];
  return games.map((gameId) => ({
    gameId,
  }));
}