import React from 'react';

interface RadarDataPoint {
  label: string;
  value: number; // 0 - 100
}

interface Props {
  data: RadarDataPoint[];
  size?: number;
}

export const RadarChart: React.FC<Props> = ({ data, size = 260 }) => {
  const center = size / 2;
  const radius = (size / 2) - 35;
  const numPoints = data.length;

  // Compute vertex coordinates
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon path for values
  const polygonPoints = data.map((d, i) => {
    const { x, y } = getCoordinates(i, d.value);
    return `${x},${y}`;
  }).join(' ');

  // Concentric polygon background grids (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid */}
        {gridLevels.map((lvl) => {
          const gridPoints = data.map((_, i) => {
            const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
            const r = lvl * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');

          return (
            <polygon
              key={lvl}
              points={gridPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(16, 185, 129, 0.25)"
          stroke="#10b981"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Points and Labels */}
        {data.map((d, i) => {
          const pt = getCoordinates(i, d.value);
          const lblPt = getCoordinates(i, 118);
          return (
            <g key={d.label}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                className="fill-emerald-400 stroke-slate-900 stroke-2"
              />
              <text
                x={lblPt.x}
                y={lblPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-medium fill-slate-300 select-none"
              >
                {d.label} ({d.value}%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
