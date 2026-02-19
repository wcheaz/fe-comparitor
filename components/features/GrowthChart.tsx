import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Unit } from '@/types/unit';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface GrowthChartProps {
  units: Unit[];
  chartType?: 'radar' | 'bar';
  className?: string;
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  str: 'Str',
  mag: 'Mag',
  skl: 'Skl',
  dex: 'Dex',
  spd: 'Spd',
  lck: 'Lck',
  def: 'Def',
  res: 'Res',
  con: 'Con',
  bld: 'Bld',
  mov: 'Mov',
  cha: 'Cha'
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

// Core stats for better visualization (excluding less important ones)
const CORE_STATS = ['hp', 'str', 'mag', 'skl', 'spd', 'def', 'res'];

export function GrowthChart({ units, chartType = 'radar', className }: GrowthChartProps) {
  // Memoize radar data preparation to avoid recalculation on re-renders
  const radarData = useMemo(() => {
    return CORE_STATS.map(stat => ({
      stat: STAT_LABELS[stat] || stat.toUpperCase(),
      ...units.reduce((acc, unit, index) => {
        acc[unit.name] = unit.growths[stat] || 0;
        return acc;
      }, {} as Record<string, number>)
    }));
  }, [units]);

  // Memoize bar data preparation to avoid recalculation on re-renders
  const barData = useMemo(() => {
    return units.map(unit => ({
      name: unit.name,
      ...CORE_STATS.reduce((acc, stat) => {
        acc[STAT_LABELS[stat] || stat.toUpperCase()] = unit.growths[stat] || 0;
        return acc;
      }, {} as Record<string, number>)
    }));
  }, [units]);

  if (units.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Growth Rates Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No units selected for comparison</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Growth Rates Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'radar' ? (
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stat" />
              <PolarRadiusAxis domain={[0, 100]} />
              {units.map((unit, index) => (
                <Radar
                  key={unit.id}
                  name={unit.name}
                  dataKey={unit.name}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Legend />
            </RadarChart>
          ) : (
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {CORE_STATS.map((stat, index) => (
                <Bar
                  key={stat}
                  dataKey={STAT_LABELS[stat] || stat.toUpperCase()}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}