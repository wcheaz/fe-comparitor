import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectProps } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Unit } from '@/types/unit';
import { getAllUnits } from '@/lib/data';

interface UnitSelectorProps {
  selectedUnits: Unit[];
  onUnitSelect: (unit: Unit) => void;
  onUnitRemove: (unitId: string) => void;
  maxUnits?: number;
  className?: string;
}

const GAME_OPTIONS = [
  { value: 'all', label: 'All Games' },
  { value: 'The Binding Blade', label: 'Fire Emblem: Binding Blade' },
  { value: 'Three Houses', label: 'Fire Emblem: Three Houses' },
  { value: 'Engage', label: 'Fire Emblem: Engage' }
];

export function UnitSelector({
  selectedUnits,
  onUnitSelect,
  onUnitRemove,
  maxUnits = 4,
  className
}: UnitSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUnits() {
      try {
        const units = await getAllUnits();
        setAllUnits(units);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load units:', error);
        setIsLoading(false);
      }
    }

    loadUnits();
  }, []);

  useEffect(() => {
    let filtered = allUnits;

    // Filter by game if not 'all'
    if (selectedGame !== 'all') {
      filtered = filtered.filter(unit => unit.game === selectedGame);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(unit =>
        unit.name.toLowerCase().includes(term) ||
        unit.class.toLowerCase().includes(term) ||
        unit.game.toLowerCase().includes(term)
      );
    }

    // Remove already selected units
    filtered = filtered.filter(unit =>
      !selectedUnits.some(selected => selected.id === unit.id)
    );

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredUnits(filtered);
  }, [allUnits, searchTerm, selectedGame, selectedUnits]);

  const handleUnitSelect = (unit: Unit) => {
    if (selectedUnits.length < maxUnits) {
      onUnitSelect(unit);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Loading units...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        {/* Selected Units Display */}
        {selectedUnits.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Selected Units ({selectedUnits.length}/{maxUnits})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center gap-2 px-3 py-1 bg-fe-blue-100 text-fe-blue-800 rounded-full text-sm"
                >
                  <span>{unit.name}</span>
                  <button
                    onClick={() => onUnitRemove(unit.id)}
                    className="text-fe-blue-600 hover:text-fe-blue-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Search Units</label>
            <Input
              type="text"
              placeholder="Search by name, class, or game..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Filter by Game</label>
            <Select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              options={GAME_OPTIONS}
              className="w-full"
            />
          </div>
        </div>

        {/* Available Units List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">
            Available Units ({filteredUnits.length})
          </h3>

          {selectedUnits.length >= maxUnits && (
            <div className="text-sm text-muted-foreground">
              Maximum {maxUnits} units can be compared at once. Remove a unit to select another.
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-1">
            {filteredUnits.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                {searchTerm || selectedGame !== 'all'
                  ? 'No units match your filters.'
                  : 'No units available.'
                }
              </div>
            ) : (
              filteredUnits.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => handleUnitSelect(unit)}
                  disabled={selectedUnits.length >= maxUnits}
                  className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{unit.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {unit.class} • {unit.game}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Lv. {unit.level}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}