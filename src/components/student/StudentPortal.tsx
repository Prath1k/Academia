import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  Opportunity,
  LearningProgram,
  DigitalPortfolioItem,
  Application,
  AssessmentQuestion
} from '../../types/database';
import { RadarChart } from '../RadarChart';
import { SkillAssessmentModal } from './SkillAssessmentModal';
import { SkillGapModal } from './SkillGapModal';
import { dataService } from '../../services/dataService';
import { skillEngine } from '../../services/skillEngine';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Briefcase,
  BookOpen,
  Award,
  ChevronRight,
  Clock,
  MapPin,
  Building2,
  FileCheck,
  TrendingUp
} from 'lucide-react';

interface Props {
  student: StudentProfile;
  onStudentProfileSwitch?: (id: string) => void;
}

export const StudentPortal: React.FC<Props> = ({ student }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [learnings, setLearnings] = useState<LearningProgram[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<DigitalPortfolioItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'applications' | 'learning'>('opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');

  // Modals state
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [student.id]);

  const loadData = async () => {
    const [opps, lrn, port, apps, qns] = await Promise.all([
      dataService.getOpportunities(),
      dataService.getLearningPrograms(),
      dataService.getDigitalPortfolio(student.id),
      dataService.getApplications(student.id),
      dataService.getAssessmentQuestions()
    ]);
    setOpportunities(opps);
    setLearnings(lrn);
    setPortfolioItems(port);
    setApplications(apps);
    setQuestions(qns);
    setAppliedIds(new Set(apps.map(a => a.opportunity_id)));
  };

  const handleApply = async (opp: Opportunity) => {
    const gap = skillEngine.analyzeSkillGap(student, opp);
    const newApp = await dataService.applyToOpportunity({
      opportunity_id: opp.id,
      student_profile_id: student.id,
      match_score: gap.matchPercentage,
      status: 'applied',
      cover_letter: 'Applied via Universal Academia-Industry Collaboration Nexus with verified skills portfolio.',
      mentor_feedback: 'Application under initial screening review.'
    });
    setApplications(prev => [newApp, ...prev]);
    setAppliedIds(prev => new Set([...prev, opp.id]));
    setSelectedOpportunity(null);
  };

  const handleAssessmentCompleted = (score: number, _strengths: string[], _gaps: string[]) => {
    student.overall_readiness_score = score;
    loadData();
  };

  const radarData = [
    { label: 'Technical', value: 88 },
    { label: 'Domain Core', value: student.major.includes('Ayurved') ? 92 : 84 },
    { label: 'Soft Skills', value: 85 },
    { label: 'Problem Solving', value: 80 },
    { label: 'Ethics & GCP', value: 90 }
  ];

  const rankedOpps = skillEngine.rankOpportunities(student, opportunities).filter(opp => {
    if (domainFilter !== 'all' && opp.domain !== domainFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.company?.institution_or_company?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile & Career Radar Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-3 gap-8 items-center relative z-10">
          {/* Student Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Verified Student Profile
              </span>
              <span className="text-xs text-slate-400">CGPA: <strong className="text-white">{student.cgpa}</strong></span>
              <span className="text-xs text-slate-400">Year: <strong className="text-white">{student.year_of_study}th Year</strong></span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {student.profile?.full_name}
              </h1>
              <p className="text-sm text-slate-300 font-medium mt-0.5">
                {student.degree} in {student.major}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                {student.profile?.institution_or_company}
              </p>
            </div>

            {/* Verified Skills Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Assessed & Verified Competencies
              </span>
              <div className="flex flex-wrap gap-2">
                {student.skills?.map((sk) => (
                  <span
                    key={sk.id}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>{sk.skill?.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">({sk.proficiency_level}/5)</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setIsAssessmentOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Take Industry Assessment Questionnaire</span>
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Digital Portfolio ({portfolioItems.length} items)</span>
              </button>
            </div>
          </div>

          {/* Competency Radar Visualizer */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-2">
              Career Readiness Vector
            </span>
            <RadarChart data={radarData} size={220} />
            <div className="mt-2 text-center">
              <span className="text-xs text-slate-400">Industry Readiness Score: </span>
              <strong className="text-emerald-400 text-sm font-bold">{student.overall_readiness_score}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { id: 'opportunities', label: 'Recommended Internships & Jobs', count: rankedOpps.length, icon: Briefcase },
            { id: 'portfolio', label: 'Student Digital Portfolio', count: portfolioItems.length, icon: Award },
            { id: 'applications', label: 'Application Pipeline', count: applications.length, icon: FileCheck },
            { id: 'learning', label: 'Industry Learning Programs', count: learnings.length, icon: BookOpen }
          ].map(({ id, label, count, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-[10px] text-slate-300">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Recommended Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Search & Domain Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by role, company, or required skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {[
                { id: 'all', label: 'All Disciplines' },
                { id: 'software', label: 'Software / IT' },
                { id: 'ayush_pharma', label: 'Ayush & Pharma' },
                { id: 'engineering', label: 'Engineering' }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setDomainFilter(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    domainFilter === id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {rankedOpps.map((opp) => {
              const hasApplied = appliedIds.has(opp.id);
              return (
                <div
                  key={opp.id}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 border border-slate-800"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {opp.type}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 capitalize">
                            {opp.domain.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                          {opp.company?.institution_or_company}
                        </p>
                      </div>

                      {/* Match Score Badge */}
                      <div className="text-right shrink-0">
                        <div className="px-2.5 py-1 rounded-xl bg-emerald-950/70 border border-emerald-800/50 text-emerald-300 flex items-center gap-1">
                          <span className="text-xs font-extrabold">{opp.matchScore}%</span>
                          <span className="text-[10px] text-emerald-400 font-medium">Match</span>
                        </div>
                        <span className="text-[9px] text-slate-500 block mt-0.5">Skill Fit</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Metadata chips */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" />{opp.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" />{opp.duration}</span>
                      <span className="text-emerald-400 font-semibold">{opp.stipend_or_salary}</span>
                    </div>

                    {/* Required Skills tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.required_skills?.map((rs) => (
                        <span
                          key={rs.skill.name}
                          className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800"
                        >
                          {rs.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedOpportunity(opp)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      <span>Explain Skill Gap</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleApply(opp)}
                      disabled={hasApplied}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        hasApplied
                          ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {hasApplied ? 'Applied' : '1-Click Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Digital Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Student Verified Digital Portfolio</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official repository of verified projects, certifications, research reports, and achievements.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified by Academic Council
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {portfolioItems.map((item) => (
              <div key={item.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.item_type}
                  </span>
                  <span className="text-xs text-slate-400">{item.date_awarded}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Issuer: <strong className="text-slate-200">{item.verification_issuer}</strong></span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Applications Tracker */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-white">Active Internship & Placement Applications</h3>
            <p className="text-xs text-slate-400">Track your interview status, candidate rankings, and mentor feedback.</p>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="glass-panel rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{app.opportunity?.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                      {app.match_score}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-400" />
                    {app.opportunity?.company?.institution_or_company}
                  </p>
                  {app.mentor_feedback && (
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 mt-2">
                      <strong className="text-emerald-400 font-medium">Recruiter Feedback: </strong>
                      {app.mentor_feedback}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-200 uppercase tracking-wider">
                    Status: {app.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Industry Learning Programs */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Industry Learning & Certification Programs</h3>
              <p className="text-xs text-slate-400">
                Company-published training programs, workshops, and certifications to acquire in-demand skills before applying.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {learnings.map((lrn) => (
              <div key={lrn.id} className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {lrn.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lrn.duration_hours} Hours
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{lrn.title}</h4>
                  <p className="text-xs text-slate-400">Provided by: <strong className="text-slate-300">{lrn.provider_name}</strong></p>
                  <p className="text-xs text-slate-300 leading-relaxed">{lrn.syllabus_summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{lrn.enrollment_count} Enrolled</span>
                  <a
                    href={lrn.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                  >
                    Enroll Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <SkillAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        questions={questions}
        studentProfileId={student.id}
        onAssessmentCompleted={handleAssessmentCompleted}
      />

      <SkillGapModal
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        opportunity={selectedOpportunity}
        student={student}
        onApply={handleApply}
        hasApplied={selectedOpportunity ? appliedIds.has(selectedOpportunity.id) : false}
      />
    </div>
  );
};
