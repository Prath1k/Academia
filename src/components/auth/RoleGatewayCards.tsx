import React from 'react';
import { UserRole } from '../../types/database';
import {
  GraduationCap,
  Microscope,
  Building2,
  School,
  ShieldCheck
} from 'lucide-react';

interface Props {
  onSelectRoleLogin: (role: UserRole) => void;
  activeRole: UserRole;
}

export const RoleGatewayCards: React.FC<Props> = ({ onSelectRoleLogin, activeRole }) => {
  const cards: Array<{
    role: UserRole;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badge: string;
    btnText: string;
    features: string[];
  }> = [
    {
      role: 'student',
      title: 'Student Gateway',
      subtitle: 'Career Mapping & Placement',
      description: 'Complete skill diagnostic questionnaires, view explainable match ratings, and unlock verified digital portfolios.',
      icon: GraduationCap,
      accentColor: 'emerald',
      badge: 'Students & Scholars',
      btnText: 'Student Google Login',
      features: ['Diagnostic Questionnaire', 'Explainable Skill Gaps', '1-Click Applications']
    },
    {
      role: 'academician',
      title: 'Academician Portal',
      subtitle: 'Faculty Sabbaticals & FDPs',
      description: 'Explore sponsored industrial training, Faculty Development Programs (FDPs), and joint R&D research grants.',
      icon: Microscope,
      accentColor: 'violet',
      badge: 'Professors & Mentors',
      btnText: 'Faculty Google Login',
      features: ['Industry Sabbaticals', 'Healthcare & AI FDPs', 'Joint Research Grants']
    },
    {
      role: 'industry',
      title: 'Industry Workspace',
      subtitle: 'Skill-Weighted Hiring & Training',
      description: 'Post internships and jobs with custom skill weightings, review pre-assessed talent, and sponsor micro-internships.',
      icon: Building2,
      accentColor: 'blue',
      badge: 'Recruiters & Enterprises',
      btnText: 'Industry Google Login',
      features: ['Skill Taxonomy Builder', 'Candidate Matching', 'Publish Certifications']
    },
    {
      role: 'institution',
      title: 'Institution & TPO',
      subtitle: 'Curriculum & Placement Governance',
      description: 'Analyze cohort skill deficits vs live market demand to align university syllabi and track campus placements.',
      icon: School,
      accentColor: 'amber',
      badge: 'Colleges & Universities',
      btnText: 'Institutional Admin Login',
      features: ['Curriculum Deficit Heatmap', 'Placement Conversion KPIs', 'MoU Governance']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dedicated Role Gateways & Google Authentication</span>
          </h2>
          <p className="text-xs text-slate-500">Each persona provides dedicated access permissions, workflows, and analytics.</p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 self-start sm:self-auto">
          Active Workspace: <strong className="text-emerald-400 capitalize">{activeRole}</strong>
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((c) => {
          const Icon = c.icon;
          const isActive = activeRole === c.role;

          const colorClasses = {
            emerald: {
              cardBorder: isActive ? 'border-emerald-500/80 bg-emerald-950/20' : 'border-slate-800 hover:border-emerald-500/40',
              iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              btn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
              tag: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
            },
            violet: {
              cardBorder: isActive ? 'border-violet-500/80 bg-violet-950/20' : 'border-slate-800 hover:border-violet-500/40',
              iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
              btn: 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20',
              tag: 'bg-violet-950/80 text-violet-400 border-violet-800/60'
            },
            blue: {
              cardBorder: isActive ? 'border-blue-500/80 bg-blue-950/20' : 'border-slate-800 hover:border-blue-500/40',
              iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
              tag: 'bg-blue-950/80 text-blue-400 border-blue-800/60'
            },
            amber: {
              cardBorder: isActive ? 'border-amber-500/80 bg-amber-950/20' : 'border-slate-800 hover:border-amber-500/40',
              iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              btn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
              tag: 'bg-amber-950/80 text-amber-400 border-amber-800/60'
            }
          }[c.accentColor]!;

          return (
            <div
              key={c.role}
              className={`rounded-2xl p-4.5 border transition-all duration-200 flex flex-col justify-between space-y-3 bg-slate-900/60 ${colorClasses.cardBorder}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl border ${colorClasses.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorClasses.tag}`}>
                    {c.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{c.title}</h3>
                  <p className="text-[11px] text-slate-400">{c.subtitle}</p>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {c.description}
                </p>

                <ul className="space-y-1 text-[10px] text-slate-400 pt-1">
                  {c.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onSelectRoleLogin(c.role)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md ${colorClasses.btn}`}
                >
                  {/* Google G */}
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{c.btnText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
