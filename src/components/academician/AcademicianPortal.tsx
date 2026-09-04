import React, { useState, useEffect } from 'react';
import { FacultyOpportunity, CollaborationInitiative } from '../../types/database';
import { dataService } from '../../services/dataService';
import {
  Microscope,
  Building2,
  Calendar,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  BookmarkPlus
} from 'lucide-react';

interface Props {
  currentUserId?: string;
}

export const AcademicianPortal: React.FC<Props> = ({ currentUserId }) => {
  const [opportunities, setOpportunities] = useState<FacultyOpportunity[]>([]);
  const [collaborations, setCollaborations] = useState<CollaborationInitiative[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // Proposal form state
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalType, setProposalType] = useState('research_partnership');
  const [proposalDesc, setProposalDesc] = useState('');

  useEffect(() => {
    loadFacultyData();
  }, []);

  const loadFacultyData = async () => {
    const [opps, collabs] = await Promise.all([
      dataService.getFacultyOpportunities(),
      dataService.getCollaborations()
    ]);
    setOpportunities(opps);
    setCollaborations(collabs);
  };

  const handleApply = async (id: string) => {
    if (currentUserId) {
      await dataService.applyToFacultyOpportunity(id, currentUserId);
    }
    setAppliedIds(prev => new Set([...prev, id]));
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserId) {
      await dataService.createCollaborationProposal({
        initiatorId: currentUserId,
        title: proposalTitle,
        type: proposalType,
        description: proposalDesc
      });
    }
    setProposalSuccess(true);
    setTimeout(() => {
      setProposalSuccess(false);
      setShowProposalModal(false);
      setProposalTitle('');
      setProposalDesc('');
    }, 1800);
  };

  const filteredOpps = opportunities.filter(opp => {
    if (activeFilter === 'all') return true;
    return opp.type === activeFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800/40 flex items-center gap-1.5">
              <Microscope className="w-3 h-3 text-teal-400" />
              Dedicated Academician & Faculty Hub
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Industrial Sabbaticals, FDPs & Collaborative Research
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Bridge academic curricula with frontier industry practices. Discover fully-funded faculty sabbaticals, AI & healthcare FDPs, live R&D grants, and consultancy calls directly sponsored by leading enterprises.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setShowProposalModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-teal-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Propose Industry-Academia Collaborative Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        {[
          { id: 'all', label: 'All Opportunities' },
          { id: 'faculty_internship', label: 'Faculty Sabbaticals & Internships' },
          { id: 'fdp', label: 'Faculty Development Programs (FDPs)' },
          { id: 'collaborative_research', label: 'R&D Grants & Research Partnerships' }
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === id
                ? 'bg-teal-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid of Opportunities */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpps.map((opp) => {
          const isApplied = appliedIds.has(opp.id);
          return (
            <div
              key={opp.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/40">
                    {opp.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">{opp.stipend_or_grant}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{opp.title}</h3>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{opp.poster?.institution_or_company}</span>
                </p>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {opp.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <p><strong className="text-slate-300">Eligibility: </strong>{opp.requirements}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" />{opp.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" />{opp.duration}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleApply(opp.id)}
                  disabled={isApplied}
                  className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isApplied
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/20'
                  }`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{isApplied ? 'Application Submitted' : 'Register / Apply Now'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collaboration Initiatives Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Live Industry-Academia Collaborative Initiatives</h3>
            <p className="text-xs text-slate-400">Upcoming guest lectures, university MoUs, and innovation challenges</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {collaborations.map((collab) => (
            <div key={collab.id} className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {collab.type.replace('_', ' ')}
                  </span>
                  {collab.event_date && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{collab.event_date}</span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">{collab.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Target: <strong className="text-slate-300">{collab.target_institution}</strong></p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{collab.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Initiated by: <strong className="text-slate-200">{collab.initiator?.institution_or_company}</strong></span>
                <span className="text-teal-400 font-semibold uppercase text-[10px] tracking-wider">{collab.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Propose Project Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5 text-slate-100">
            <div>
              <h3 className="text-base font-bold text-white">Propose Collaboration / Research Project</h3>
              <p className="text-xs text-slate-400 mt-0.5">Submit your institutional research proposal to our industry partners network.</p>
            </div>

            {proposalSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto" />
                <p className="text-sm font-bold text-white">Proposal Successfully Dispatched!</p>
                <p className="text-xs text-slate-400">Industry partners in your domain will be notified.</p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initiative Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Joint Pharmacognosy Lab Research or Guest Lecture Series"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Collaboration Type</label>
                  <select
                    value={proposalType}
                    onChange={(e) => setProposalType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="research_partnership">Collaborative Research Partnership</option>
                    <option value="guest_lecture">Expert Guest Lecture Series</option>
                    <option value="workshop">Industrial Skills Workshop</option>
                    <option value="mou">Institutional MoU</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Scope & Objectives</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe laboratory infrastructure, proposed timeline, and academic deliverables..."
                    value={proposalDesc}
                    onChange={(e) => setProposalDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProposalModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors"
                  >
                    Send Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
