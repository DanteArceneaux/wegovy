import { memo } from 'react';
import { WeightEntry } from '../../types';

interface WeightChartProps {
  data: WeightEntry[];
  goal: number;
}

export const WeightChart = memo(({ data, goal }: WeightChartProps) => {
  if (!data || data.length < 2) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
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
    <div className="h-64 w-full relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.25)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </linearGradient>
        </defs>

        {/* Goal Line */}
        {goalY >= 0 && goalY <= 100 && (
          <line
            x1="0" y1={goalY} x2="100" y2={goalY}
            stroke="rgba(16, 185, 129, 0.5)"
            strokeWidth="0.8"
            strokeDasharray="6 4"
          />
        )}

        {/* Gradient Area */}
        <path d={areaD} fill="url(#chartGradient)" />

        {/* Main Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.3))' }}
        />

        {/* Data Points - Show all but prevent overcrowding */}
        {points.map((pt, i) => {
          // Show point if it's start, end, or reasonably spaced (e.g. every 5th point if > 15 points)
          const shouldShow = points.length <= 15 || i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 6) === 0;

          if (!shouldShow) return null;

          return (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="white"
                stroke="#6366f1"
                strokeWidth="2.5"
                className="transition-all duration-300 hover:r-5"
              />
            </g>
          );
        })}
      </svg>

      {/* Target Label */}
      {goalY >= 0 && goalY <= 100 && (
        <div
          className="absolute right-0 flex items-center gap-2"
          style={{
            top: `${goalY}%`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shadow-sm">
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Target</span>
          </div>
        </div>
      )}
    </div>
  );
});

WeightChart.displayName = 'WeightChart';
