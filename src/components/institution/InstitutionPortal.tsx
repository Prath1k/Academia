import React from 'react';
import {
  School,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const InstitutionPortal: React.FC = () => {
  // Cohort Skill Gap Breakdown for Academic Curricula Alignment
  const skillGapMetrics = [
    { skill: 'Good Clinical Practice (GCP)', industryDemand: 86, cohortMastery: 42, deficit: 44, status: 'Critical Deficit' },
    { skill: 'Herbal Formulation Quality Control', industryDemand: 78, cohortMastery: 51, deficit: 27, status: 'Moderate Gap' },
    { skill: 'Python Data Analysis & Pipelines', industryDemand: 92, cohortMastery: 74, deficit: 18, status: 'Satisfactory' },
    { skill: 'Healthcare Informatics & EHR', industryDemand: 80, cohortMastery: 38, deficit: 42, status: 'Critical Deficit' },
    { skill: 'Executive Cross-Disciplinary Presentation', industryDemand: 75, cohortMastery: 60, deficit: 15, status: 'Satisfactory' }
  ];

  const placementStats = [
    { title: 'Total Registered Students', value: '1,420', change: '+12% this year' },
    { title: 'Completed Skill Assessments', value: '1,180', change: '83% cohort completion' },
    { title: 'Active Internship Placements', value: '462', change: '+28% conversion' },
    { title: 'Active Industry MoUs', value: '38', change: 'Across Pharma, Tech & Ayush' }
  ];

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
          <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors">
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
