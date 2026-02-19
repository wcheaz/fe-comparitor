'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllUnits, getUnitsByGame } from '@/lib/data';
import { UnitCard } from '@/components/features/UnitCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorBoundary, ErrorDisplay } from '@/components/ui/error-boundary';

// Game information for roster links
const GAMES = [
  {
    id: 'binding-blade',
    name: 'Fire Emblem: Binding Blade',
    path: '/games/binding-blade'
  },
  {
    id: 'three-houses',
    name: 'Fire Emblem: Three Houses',
    path: '/games/three-houses'
  },
  {
    id: 'engage',
    name: 'Fire Emblem: Engage',
    path: '/games/engage'
  }
];

async function getQuickCompareUnits() {
  try {
    const allUnits = await getAllUnits();
    
    // Select 2 random units from different games if possible
    const shuffled = [...allUnits].sort(() => 0.5 - Math.random());
    let unit1 = shuffled[0];
    let unit2 = shuffled[1];
    
    // Try to get units from different games
    for (let i = 2; i < shuffled.length && unit1?.game === unit2?.game; i++) {
      if (shuffled[i].game !== unit1?.game) {
        unit2 = shuffled[i];
        break;
      }
    }
    
    return [unit1, unit2].filter(Boolean);
  } catch (error) {
    console.error('Error getting quick compare units:', error);
    return [];
  }
}

export default function HomePage() {
  const [quickCompareUnits, setQuickCompareUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuickCompareUnits();
  }, []);

  async function loadQuickCompareUnits() {
    setIsLoading(true);
    try {
      const units = await getQuickCompareUnits();
      setQuickCompareUnits(units);
    } catch (error) {
      console.error('Error loading quick compare units:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-fe-blue-50 to-fe-blue-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fe-blue-900 mb-4">
          Fire Emblem Unit Comparator
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-fe-blue-700 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Compare unit statistics, growth rates, and potential across multiple Fire Emblem games. 
          Make informed decisions about your team composition and unit development.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button size="lg" className="bg-fe-gold-600 hover:bg-fe-gold-700 text-white w-full sm:w-auto" asChild>
            <Link href="/comparator">
              Start Comparing
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-fe-gold-600 text-fe-gold-600 hover:bg-fe-gold-50" asChild>
            <Link href="#features">
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Compare Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-fe-blue-900 mb-4">
            Quick Compare
          </h2>
          <p className="text-fe-blue-700">
            Here are two randomly selected units from different games to get you started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {quickCompareUnits.map((unit, index) => (
            <Card key={unit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {unit.name} - {unit.game}
                </CardTitle>
                <CardDescription>
                  {unit.class} • Level {unit.level}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UnitCard unit={unit} />
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/units/${unit.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild>
            <Link href={`/comparator?units=${quickCompareUnits.map(u => u.id).join(',')}`}>
              Compare These Units
            </Link>
          </Button>
          <Button variant="outline" className="ml-4" onClick={loadQuickCompareUnits}>
            Get New Pair
          </Button>
        </div>
      </section>

      {/* Game Rosters Section */}
      <section className="container mx-auto px-4 py-12 bg-fe-blue-50 rounded-lg border border-fe-blue-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-fe-blue-900 mb-4">
            Browse Game Rosters
          </h2>
          <p className="text-fe-blue-700">
            Explore units from each Fire Emblem game available in our database
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {GAMES.map((game) => (
            <Card key={game.id} className="hover:shadow-lg transition-shadow cursor-pointer border-fe-gold-200 hover:border-fe-gold-400">
              <CardHeader className="text-center bg-gradient-to-r from-fe-blue-50 to-fe-blue-100 rounded-t-lg">
                <CardTitle className="text-xl text-fe-blue-900">
                  {game.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <Button variant="outline" className="w-full border-fe-gold-600 text-fe-gold-600 hover:bg-fe-gold-50" asChild>
                  <Link href={`/games/${game.id}`}>
                    View {game.name.split(': ')[1]} Units
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-fe-blue-900 mb-4">
            Key Features
          </h2>
          <p className="text-fe-blue-700">
            Everything you need to analyze and compare Fire Emblem units
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="border-fe-gold-200 hover:border-fe-gold-400 hover:shadow-lg transition-all">
            <CardHeader className="bg-gradient-to-r from-fe-gold-50 to-fe-gold-100 rounded-t-lg">
              <CardTitle className="text-lg text-fe-blue-900">Stat Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fe-blue-700">
                Compare base stats, growth rates, and calculated averages at any level
              </p>
            </CardContent>
          </Card>

          <Card className="border-fe-gold-200 hover:border-fe-gold-400 hover:shadow-lg transition-all">
            <CardHeader className="bg-gradient-to-r from-fe-gold-50 to-fe-gold-100 rounded-t-lg">
              <CardTitle className="text-lg text-fe-blue-900">Multi-Game Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fe-blue-700">
                Compare units across different Fire Emblem games with normalized data
              </p>
            </CardContent>
          </Card>

          <Card className="border-fe-gold-200 hover:border-fe-gold-400 hover:shadow-lg transition-all">
            <CardHeader className="bg-gradient-to-r from-fe-gold-50 to-fe-gold-100 rounded-t-lg">
              <CardTitle className="text-lg text-fe-blue-900">Visual Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fe-blue-700">
                Growth charts and visual stat differences for easy analysis
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}