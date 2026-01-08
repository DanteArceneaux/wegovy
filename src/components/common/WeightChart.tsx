import { memo } from 'react';
import { WeightEntry } from '../../types';

interface WeightChartProps {
  data: WeightEntry[];
  goal: number;
}

export const WeightChart = memo(({ data, goal }: WeightChartProps) => {
  if (!data || data.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        Log at least 2 weights to see trend
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const weights = sortedData.map(d => d.weight);
  const minWeight = Math.min(...weights, goal) - 2;
  const maxWeight = Math.max(...weights) + 2;

  // Calculate SVG points
  const points = sortedData.map((d, i) => {
    const x = (i / (sortedData.length - 1)) * 100;
    const y = 100 - ((d.weight - minWeight) / (maxWeight - minWeight)) * 100;
    return { x, y };
  });

  // Create smooth Bezier path
  const createPath = (pts: { x: number, y: number }[]) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${cp1x},${pts[i].y} ${cp1x},${pts[i + 1].y} ${pts[i + 1].x},${pts[i + 1].y}`;
    }
    return d;
  };

  const pathD = createPath(points);
  const areaD = `${pathD} L 100,100 L 0,100 Z`;
  const goalY = 100 - ((goal - minWeight) / (maxWeight - minWeight)) * 100;

  return (
    <div className="h-48 w-full relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.2)" />
            <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
          </linearGradient>
        </defs>

        {/* Goal Line */}
        {goalY >= 0 && goalY <= 100 && (
          <line
            x1="0" y1={goalY} x2="100" y2={goalY}
            stroke="rgba(16, 185, 129, 0.3)"
            strokeWidth="0.5"
            strokeDasharray="2"
          />
        )}

        {/* Gradient Area */}
        <path d={areaD} fill="url(#chartGradient)" />

        {/* Main Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(79, 70, 229, 0.3))' }}
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2"
            fill="white"
            stroke="#4f46e5"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {goalY >= 0 && goalY <= 100 && (
        <div className="absolute right-0 flex items-center gap-1.5" style={{ top: `${goalY}%`, transform: 'translateY(-50%)' }}>
          <div className="w-8 h-[1px] bg-emerald-200"></div>
          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-1 rounded">Target</span>
        </div>
      )}
    </div>
  );
});

WeightChart.displayName = 'WeightChart';
