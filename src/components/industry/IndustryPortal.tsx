import React, { useState, useEffect } from 'react';
import { Opportunity, Application, SkillMaster } from '../../types/database';
import { dataService } from '../../services/dataService';
import { WorkspaceSkeleton } from '../WorkspaceSkeleton';
import {
  Building2,
  PlusCircle,
  Users,
  Briefcase,
  X
} from 'lucide-react';

interface Props {
  currentUserId?: string;
}

export const IndustryPortal: React.FC<Props> = ({ currentUserId }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [skills, setSkills] = useState<SkillMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [skillWeights, setSkillWeights] = useState<Record<string, number>>({});
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'internship' | 'job' | 'apprenticeship' | 'live_project'>('internship');
  const [domain, setDomain] = useState('software');
  const [location] = useState('Hybrid');
  const [stipend, setStipend] = useState('₹30,000 / month');
  const [duration, setDuration] = useState('6 Months');
  const [description, setDescription] = useState('');
  const [eligibility] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [opps, apps, sks] = await Promise.all([
        dataService.getOpportunities(),
        dataService.getApplications(),
        dataService.getSkills()
      ]);
      setOpportunities(opps);
      setApplications(apps);
      setSkills(sks);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillIds.length) {
      setFormError('Select at least one required skill before publishing.');
      return;
    }
    setFormError('');
    setIsSaving(true);
    try {
      const created = await dataService.createOpportunity({
        company_id: currentUserId || '22222222-2222-2222-2222-222222220005',
        title,
        type,
        domain,
        location,
        stipend_or_salary: stipend,
        duration,
        openings: 3,
        description,
        eligibility,
        is_active: true,
        required_skills: selectedSkillIds.map(skillId => ({
          skill: skills.find(skill => skill.id === skillId)!,
          is_mandatory: true,
          weight: skillWeights[skillId] || 1
        }))
      });
      setOpportunities(prev => [created, ...prev]);
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setSelectedSkillIds([]);
      setSkillWeights({});
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Opportunity could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: Application['status']) => {
    await dataService.updateApplicationStatus(appId, newStatus);
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
  };

  if (isLoading) {
    return <WorkspaceSkeleton variant="industry" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40 flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-blue-400" />
                Industry Recruiter & Partner Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Post Skill-Weighted Openings & Shortlist Verified Talent
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Define required skill matrices, filter candidates by explainable match scores, and publish industry training programs to upskill university cohorts.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/20 shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Internship or Job</span>
          </button>
        </div>
      </div>

      {/* Grid: Posted Roles & Active Applicants */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Posted Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Active Company Postings ({opportunities.filter(opp => !currentUserId || opp.company_id === currentUserId).length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {!opportunities.filter(opp => !currentUserId || opp.company_id === currentUserId).length && (
              <div className="rounded-2xl border border-amber-800/50 bg-amber-950/20 p-5 text-sm text-amber-200">
                No active postings are available for this company yet. Publish a skill-weighted opportunity to start receiving applications.
              </div>
            )}
            {opportunities.filter(opp => !currentUserId || opp.company_id === currentUserId).map((opp) => (
              <div key={opp.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                        {opp.type}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                        {opp.domain.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">{opp.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{opp.location} • {opp.duration} • <strong className="text-emerald-400">{opp.stipend_or_salary}</strong></p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{opp.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.required_skills?.map(rs => (
                    <span key={rs.skill.name} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
                      {rs.skill.name} (wt: {rs.weight}x)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Incoming Candidate Applications & Shortlisting */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Candidate Shortlisting ({applications.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.opportunity?.title}</h4>
                    <span className="text-[10px] text-slate-400">Applicant: Aarav Sharma</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-mono text-xs font-bold">
                    {app.match_score}% Match
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                  {app.cover_letter}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Status: <span className="text-emerald-400">{app.status.replace('_', ' ')}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'rejected')}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Create Opportunity */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Post New Industry Opportunity</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Trial Associate or Cloud Systems Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Opportunity Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="internship">Internship</option>
                    <option value="job">Entry-Level Job</option>
                    <option value="apprenticeship">Apprenticeship</option>
                    <option value="live_project">Live Industry Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Domain Discipline</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="software">Software & Computer Science</option>
                    <option value="ayush_pharma">Ayush, Pharma & Life Sciences</option>
                    <option value="engineering">Core Engineering</option>
                    <option value="general">Management & Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Stipend / CTC</label>
                  <input
                    type="text"
                    required
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Duration & Location</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description & Key Deliverables</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline responsibilities, team structure, and projects..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Required Skills (For Matching Engine)</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {skills.map(sk => {
                    const isSelected = selectedSkillIds.includes(sk.id);
                    return (
                      <button
                        type="button"
                        key={sk.id}
                        onClick={() => {
                          setSelectedSkillIds(prev => 
                            isSelected ? prev.filter(id => id !== sk.id) : [...prev, sk.id]
                          );
                          setSkillWeights(prev => ({ ...prev, [sk.id]: prev[sk.id] || 1 }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {sk.name}
                      </button>
                    );
                  })}
                </div>
                {selectedSkillIds.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {selectedSkillIds.map(skillId => {
                      const skill = skills.find(item => item.id === skillId);
                      return skill ? (
                        <label key={skillId} className="flex items-center justify-between gap-3 text-[11px] text-slate-300">
                          <span>{skill.name} weight</span>
                          <select
                            value={skillWeights[skillId] || 1}
                            onChange={event => setSkillWeights(prev => ({ ...prev, [skillId]: Number(event.target.value) }))}
                            className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-slate-200"
                          >
                            <option value="1">1x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                            <option value="3">3x</option>
                          </select>
                        </label>
                      ) : null;
                    })}
                  </div>
                )}
                {formError && <p className="mt-2 text-xs text-rose-400">{formError}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
