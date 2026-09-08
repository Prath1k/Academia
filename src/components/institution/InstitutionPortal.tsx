import React, { useEffect, useState } from 'react';
import { InstitutionAnalytics } from '../../types/database';
import { dataService } from '../../services/dataService';
import { WorkspaceSkeleton } from '../WorkspaceSkeleton';
import { AnalyticsStatCard, BarChart, ChartDatum, ComparisonBars, DonutChart } from '../AnalyticsCharts';
import {
  BarChart3,
  ClipboardCheck,
  School,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const InstitutionPortal: React.FC = () => {
  const [analytics, setAnalytics] = useState<InstitutionAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dataService.getInstitutionAnalytics().then(setAnalytics).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <WorkspaceSkeleton variant="institution" />;
  }

  const skillGapMetrics = analytics?.skillGaps || [];
  const placementStats = analytics ? [
    { title: 'Total Registered Students', value: analytics.totalStudents.toLocaleString(), change: 'Live student profiles' },
    { title: 'Completed Skill Assessments', value: analytics.completedAssessments.toLocaleString(), change: 'Profiles with readiness scores' },
    { title: 'Active Internship Placements', value: analytics.activePlacements.toLocaleString(), change: 'Shortlisted, interview, or offered' },
    { title: 'Active Industry Partners', value: analytics.activeIndustryPartners.toLocaleString(), change: 'Partners with active opportunities' }
  ] : [];
  const completionRate = analytics?.totalStudents
    ? Math.round((analytics.completedAssessments / analytics.totalStudents) * 100)
    : 0;
  const skillGapSeverity: ChartDatum[] = analytics ? [
    { label: 'Critical deficit', value: analytics.skillGaps.filter(row => row.status === 'Critical Deficit').length, color: '#f43f5e' },
    { label: 'Moderate gap', value: analytics.skillGaps.filter(row => row.status === 'Moderate Gap').length, color: '#f59e0b' },
    { label: 'Satisfactory', value: analytics.skillGaps.filter(row => row.status === 'Satisfactory').length, color: '#10b981' }
  ].filter(item => item.value > 0) : [];
  const comparisonData = analytics?.skillGaps.slice(0, 6).map(row => ({
    label: row.skill,
    first: row.industryDemand,
    second: row.cohortMastery
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40 flex items-center gap-1.5">
              <School className="w-3 h-3 text-purple-400" />
              Institutional Career & Placement Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cohort Placement Readiness & Curriculum Alignment
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Monitor institutional skill trajectories, identify emerging industry skill deficits to modernize university syllabi, and track campus placement and internship conversions in real time.
          </p>
        </div>
      </div>

      {/* Cohort Analytics */}
      <section className="space-y-4" aria-labelledby="institution-analytics-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">Cohort intelligence</p>
            <h2 id="institution-analytics-heading" className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">Readiness signals for better decisions</h2>
          </div>
          <p className="text-xs text-slate-500">A visual summary of student readiness and curriculum pressure points.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsStatCard label="Assessment completion" value={`${completionRate}%`} detail={`${analytics?.completedAssessments || 0} of ${analytics?.totalStudents || 0} students`} tone="blue" />
          <AnalyticsStatCard label="Placement activity" value={(analytics?.activePlacements || 0).toLocaleString()} detail="Shortlisted, interview, or offered" tone="emerald" />
          <AnalyticsStatCard label="Critical gaps" value={(analytics?.skillGaps.filter(row => row.status === 'Critical Deficit').length || 0).toLocaleString()} detail="Priority curriculum signals" tone="rose" />
          <AnalyticsStatCard label="Industry partners" value={(analytics?.activeIndustryPartners || 0).toLocaleString()} detail="Partners with active demand" tone="amber" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <div><h3 className="flex items-center gap-2 text-base font-bold text-slate-950"><ClipboardCheck className="h-4 w-4 text-blue-600" />Assessment coverage</h3><p className="mt-1 text-xs text-slate-500">How much of the cohort has a current readiness signal.</p></div>
            <div className="mt-5"><DonutChart data={[{ label: 'Completed', value: analytics?.completedAssessments || 0, color: '#2563eb' }, { label: 'Pending', value: Math.max((analytics?.totalStudents || 0) - (analytics?.completedAssessments || 0), 0), color: '#cbd5e1' }]} total={analytics?.totalStudents || 0} /></div>
            <p className="mt-5 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-900">{completionRate >= 70 ? 'Most of the cohort has measurable readiness data.' : 'Assessment coverage is still developing; prioritize outreach before making cohort-wide curriculum decisions.'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <div><h3 className="flex items-center gap-2 text-base font-bold text-slate-950"><BarChart3 className="h-4 w-4 text-amber-600" />Gap severity distribution</h3><p className="mt-1 text-xs text-slate-500">Count of tracked skills by action status.</p></div>
            <div className="mt-6"><BarChart data={skillGapSeverity} max={Math.max(...skillGapSeverity.map(item => item.value), 1)} suffix=" skill" /></div>
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"><Target className="mt-0.5 h-4 w-4 shrink-0" /><span>{skillGapSeverity.find(item => item.label === 'Critical deficit')?.value || 0} critical skill gap{(skillGapSeverity.find(item => item.label === 'Critical deficit')?.value || 0) === 1 ? '' : 's'} should lead curriculum review.</span></div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div><h3 className="text-base font-bold text-slate-950">Demand versus cohort mastery</h3><p className="mt-1 text-xs text-slate-500">The top tracked skills, shown as industry demand versus current mastery.</p></div>
            <p className="text-xs font-semibold text-blue-700">{analytics?.skillGaps[0] ? `${analytics.skillGaps[0].skill} needs the closest look` : 'Waiting for skill data'}</p>
          </div>
          <div className="mt-5"><ComparisonBars data={comparisonData} firstLabel="Industry demand" secondLabel="Cohort mastery" /></div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {placementStats.map((st) => (
          <div key={st.title} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">{st.title}</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{st.value}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{st.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cohort Skill Gap Heatmap */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Institutional Curriculum vs Industry Demand Heatmap</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies competency gaps where industry job criteria significantly outpace student cohort syllabus coverage.
            </p>
          </div>
          <button
            onClick={() => {
              const rows = [['Skill', 'Industry demand', 'Cohort mastery', 'Deficit', 'Status'], ...skillGapMetrics.map(row => [row.skill, `${row.industryDemand}%`, `${row.cohortMastery}%`, `${row.deficit}%`, row.status])];
              const csv = rows.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n');
              const link = document.createElement('a');
              link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
              link.download = 'curriculum-modernization-report.csv';
              link.click();
              URL.revokeObjectURL(link.href);
            }}
            disabled={!analytics}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            Export Curriculum Modernization Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th className="py-3 px-4">Skill Domain</th>
                <th className="py-3 px-4">Industry Demand</th>
                <th className="py-3 px-4">Cohort Mastery</th>
                <th className="py-3 px-4">Deficit Gap</th>
                <th className="py-3 px-4">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {skillGapMetrics.length === 0 && (
                <tr><td colSpan={5} className="py-8 px-4 text-center text-slate-400">No live opportunity requirements or assessment data is available yet.</td></tr>
              )}
              {skillGapMetrics.map((row) => (
                <tr key={row.skill} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{row.skill}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400">{row.industryDemand}%</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${row.industryDemand}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300">{row.cohortMastery}%</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${row.cohortMastery}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    -{row.deficit}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      row.status === 'Critical Deficit'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                        : row.status === 'Moderate Gap'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
