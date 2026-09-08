import React from 'react';

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
}

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  tone?: 'blue' | 'emerald' | 'amber' | 'rose';
}

const toneStyles = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700'
};

export const AnalyticsStatCard: React.FC<StatCardProps> = ({ label, value, detail, tone = 'blue' }) => (
  <div className={`rounded-2xl border p-4 ${toneStyles[tone]}`}>
    <p className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-75">{label}</p>
    <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">{value}</p>
    <p className="mt-1 text-xs text-slate-600">{detail}</p>
  </div>
);

export const BarChart: React.FC<{ data: ChartDatum[]; max?: number; suffix?: string }> = ({ data, max, suffix = '' }) => {
  const chartMax = max || Math.max(...data.map(item => item.value), 1);

  return (
    <div className="space-y-4" role="img" aria-label="Bar chart">
      {data.map(item => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700 truncate">{item.label}</span>
            <span className="font-mono font-bold text-slate-950">{item.value}{suffix}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max((item.value / chartMax) * 100, item.value ? 4 : 0)}%`, backgroundColor: item.color || '#2563eb' }}
            />
          </div>
        </div>
      ))}
      {!data.length && <p className="text-sm text-slate-500">No activity to chart yet.</p>}
    </div>
  );
};

export const ComparisonBars: React.FC<{ data: Array<{ label: string; first: number; second: number }>; firstLabel: string; secondLabel: string }> = ({ data, firstLabel, secondLabel }) => (
  <div className="space-y-4" role="img" aria-label="Comparison bar chart">
    <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-slate-500">
      <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{firstLabel}</span>
      <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-blue-500" />{secondLabel}</span>
    </div>
    {data.map(item => (
      <div key={item.label}>
        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-700 truncate">{item.label}</span>
          <span className="font-mono text-slate-600">{item.first}% / {item.second}%</span>
        </div>
        <div className="space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.first}%` }} /></div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${item.second}%` }} /></div>
        </div>
      </div>
    ))}
    {!data.length && <p className="text-sm text-slate-500">No skill evidence is available yet.</p>}
  </div>
);

export const DonutChart: React.FC<{ data: ChartDatum[]; total?: number }> = ({ data, total }) => {
  const chartTotal = total ?? data.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const gradient = chartTotal
    ? data.map(item => {
        const start = (offset / chartTotal) * 100;
        offset += item.value;
        return `${item.color || '#2563eb'} ${start}% ${(offset / chartTotal) * 100}%`;
      }).join(', ')
    : '#e2e8f0 0% 100%';

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center" role="img" aria-label="Donut chart">
      <div className="relative h-36 w-36 shrink-0 rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-2xl font-extrabold text-slate-950">{chartTotal}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</span>
        </div>
      </div>
      <div className="w-full space-y-2.5">
        {data.map(item => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
            <span className="inline-flex min-w-0 items-center gap-2 text-slate-600"><i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color || '#2563eb' }} /> <span className="truncate">{item.label}</span></span>
            <span className="font-mono font-bold text-slate-950">{item.value}</span>
          </div>
        ))}
        {!data.length && <p className="text-sm text-slate-500">No activity to chart yet.</p>}
      </div>
    </div>
  );
};