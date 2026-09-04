import React from 'react';
import { X, CheckCircle2, AlertTriangle, BookOpen, Building2, MapPin, Briefcase } from 'lucide-react';
import { Opportunity, StudentProfile } from '../../types/database';
import { skillEngine, SkillGapAnalysis } from '../../services/skillEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  student: StudentProfile;
  onApply: (opportunity: Opportunity) => void;
  hasApplied: boolean;
}

export const SkillGapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  opportunity,
  student,
  onApply,
  hasApplied
}) => {
  if (!isOpen || !opportunity) return null;

  const gap: SkillGapAnalysis = skillEngine.analyzeSkillGap(student, opportunity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {opportunity.type.toUpperCase()}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 capitalize">
                Domain: {opportunity.domain.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{opportunity.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-emerald-400" />{opportunity.company?.institution_or_company}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" />{opportunity.location}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">{opportunity.stipend_or_salary}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Diagnostic Match Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400">Explainable Skill Compatibility</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-emerald-400">{gap.matchPercentage}%</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  {gap.readinessVerdict}
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>{gap.matchedSkills.length} of {(opportunity.required_skills || []).length} criteria fulfilled</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Weighted with domain benchmark</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Role Overview</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              {opportunity.description}
            </p>
          </div>

          {/* Skill Breakdown: Matched vs Gaps */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Matched */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Match ({gap.matchedSkills.length})</span>
              </h4>
              <div className="space-y-2">
                {gap.matchedSkills.map((s) => (
                  <div key={s.name} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-emerald-200">{s.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Proficiency: {s.proficiency}/5</span>
                    </div>
                  </div>
                ))}
                {gap.matchedSkills.length === 0 && (
                  <p className="text-xs text-slate-500 italic">No direct verified match yet.</p>
                )}
              </div>
            </div>

            {/* Missing & Bridge Roadmap */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Skill Gaps ({gap.missingSkills.length})</span>
              </h4>
              <div className="space-y-2">
                {gap.missingSkills.map((s) => (
                  <div key={s.name} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-amber-200">{s.name}</span>
                      {s.isMandatory && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold">
                          Required
                        </span>
                      )}
                    </div>
                    {s.bridgeModule && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                        <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">Bridge Module: {s.bridgeModule}</span>
                      </div>
                    )}
                  </div>
                ))}
                {gap.missingSkills.length === 0 && (
                  <p className="text-xs text-emerald-400 italic">All required competencies satisfied!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg">
            Back to Search
          </button>
          <button
            onClick={() => onApply(opportunity)}
            disabled={hasApplied}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              hasApplied
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{hasApplied ? 'Application Submitted' : 'Apply for this Opportunity'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
