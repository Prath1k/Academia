import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  Profile,
  SkillMaster,
  StudentProfile,
  Opportunity,
  FacultyOpportunity,
  LearningProgram,
  CollaborationInitiative,
  DigitalPortfolioItem,
  CredentialVerification,
  AssessmentQuestion,
  AssessmentSubmission,
  AssessmentResult,
  InstitutionAnalytics,
  Application,
  UserRole,
  SkillCategory
} from '../types/database';
import {
  MOCK_PROFILES,
  MOCK_SKILLS,
  MOCK_STUDENT_PROFILES,
  MOCK_OPPORTUNITIES,
  MOCK_FACULTY_OPPORTUNITIES,
  MOCK_LEARNING_PROGRAMS,
  MOCK_COLLABORATIONS,
  MOCK_PORTFOLIO_ITEMS,
  MOCK_CREDENTIAL_VERIFICATIONS,
  MOCK_QUESTIONS,
  MOCK_APPLICATIONS
} from '../data/mockFallbackData';
import { normalizeText } from './security';

// In-memory state when running local / mock mode so mutations (e.g. creating opportunity, taking test, applying) persist during the session
let localOpportunities = [...MOCK_OPPORTUNITIES];
let localApplications = [...MOCK_APPLICATIONS];
let localFacultyOpps = [...MOCK_FACULTY_OPPORTUNITIES];
let localLearnings = [...MOCK_LEARNING_PROGRAMS];
let localStudentProfiles = [...MOCK_STUDENT_PROFILES];

export const dataService = {
  // Profiles
  async getProfiles(role?: UserRole): Promise<Profile[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('profiles').select('*');
      if (role) query = query.eq('role', role);
      const { data, error } = await query;
      if (!error && data) return data as Profile[];
    }
    return role ? MOCK_PROFILES.filter(p => p.role === role) : MOCK_PROFILES;
  },

  // Skills Master
  async getSkills(): Promise<SkillMaster[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('skills_master').select('*');
      if (!error && data) return data as SkillMaster[];
    }
    return MOCK_SKILLS;
  },

  // Student Profiles
  async getStudentProfile(profileId: string): Promise<StudentProfile | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          profile:profiles(*),
          skills:student_skills(
            *,
            skill:skills_master(*)
          )
        `)
        .eq('profile_id', profileId)
        .single();
      if (!error && data) return data as StudentProfile;
      return null;
    }
    const found = localStudentProfiles.find(s => s.profile_id === profileId || s.id === profileId);
    return found || localStudentProfiles[0];
  },

  // Opportunities (Internships & Jobs)
  async getOpportunities(filter?: { domain?: string; type?: string; search?: string }): Promise<Opportunity[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('opportunities')
        .select(`
          *,
          company:profiles(*),
          required_skills:opportunity_skills(
            is_mandatory,
            weight,
            skill:skills_master(*)
          )
        `)
        .eq('is_active', true);

      if (filter?.type && filter.type !== 'all') query = query.eq('type', filter.type);
      if (filter?.domain && filter.domain !== 'all') query = query.eq('domain', filter.domain);

      const { data, error } = await query;
      if (!error && data) return data as Opportunity[];
    }

    let list = [...localOpportunities];
    if (filter?.type && filter.type !== 'all') {
      list = list.filter(o => o.type === filter.type);
    }
    if (filter?.domain && filter.domain !== 'all') {
      list = list.filter(o => o.domain === filter.domain);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(o => 
        o.title.toLowerCase().includes(q) || 
        o.description.toLowerCase().includes(q) ||
        o.company?.institution_or_company?.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async createOpportunity(opp: Omit<Opportunity, 'id'>): Promise<Opportunity> {
    const newId = crypto.randomUUID();
    const newOpp: Opportunity = {
      ...opp,
      id: newId,
      title: normalizeText(opp.title, 180),
      location: normalizeText(opp.location, 180),
      stipend_or_salary: opp.stipend_or_salary ? normalizeText(opp.stipend_or_salary, 120) : undefined,
      duration: opp.duration ? normalizeText(opp.duration, 120) : undefined,
      description: normalizeText(opp.description, 4000),
      eligibility: opp.eligibility ? normalizeText(opp.eligibility, 2000) : undefined
    };
    
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('opportunities').insert([{
        id: newId,
        company_id: opp.company_id,
        title: opp.title,
        type: opp.type,
        domain: opp.domain,
        location: opp.location,
        stipend_or_salary: opp.stipend_or_salary,
        duration: opp.duration,
        openings: opp.openings,
        description: opp.description,
        eligibility: opp.eligibility,
        is_active: true
      }]);
      if (error) throw new Error(error.message);

      if (opp.required_skills?.length) {
        const { error: skillsError } = await supabase.from('opportunity_skills').insert(
          opp.required_skills.map(requiredSkill => ({
            opportunity_id: newId,
            skill_id: requiredSkill.skill.id,
            is_mandatory: requiredSkill.is_mandatory,
            weight: requiredSkill.weight
          }))
        );
        if (skillsError) {
          await supabase.from('opportunities').delete().eq('id', newId);
          throw new Error(`Opportunity skills could not be saved: ${skillsError.message}`);
        }
      }
    }
    localOpportunities = [newOpp, ...localOpportunities];
    return newOpp;
  },

  // Dedicated Faculty Opportunities (SIH Academician Requirement)
  async getFacultyOpportunities(type?: string): Promise<FacultyOpportunity[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('faculty_opportunities')
        .select('*, poster:profiles(*)')
        .eq('is_active', true);
      if (type && type !== 'all') query = query.eq('type', type);
      const { data, error } = await query;
      if (!error && data) return data as FacultyOpportunity[];
    }
    if (type && type !== 'all') {
      return localFacultyOpps.filter(f => f.type === type);
    }
    return localFacultyOpps;
  },

  // Learning Programs & Certifications
  async getLearningPrograms(): Promise<LearningProgram[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('learning_programs').select('*');
      if (!error && data) return data as LearningProgram[];
    }
    return localLearnings;
  },

  // Collaboration Initiatives
  async getCollaborations(): Promise<CollaborationInitiative[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('collaboration_initiatives').select('*, initiator:profiles(*)');
      if (!error && data) return data as CollaborationInitiative[];
    }
    return MOCK_COLLABORATIONS;
  },

  // Student Digital Portfolio
  async getDigitalPortfolio(studentProfileId: string): Promise<DigitalPortfolioItem[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('digital_portfolio_items')
        .select('*')
        .eq('student_profile_id', studentProfileId);
      if (!error && data) return data as DigitalPortfolioItem[];
    }
    return MOCK_PORTFOLIO_ITEMS.filter(p => p.student_profile_id === studentProfileId);
  },

  async getCredentialVerifications(studentProfileId: string): Promise<CredentialVerification[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('credential_verifications')
        .select('*')
        .eq('student_profile_id', studentProfileId)
        .order('created_at', { ascending: false });
      if (!error && data) return data as CredentialVerification[];
    }
    return MOCK_CREDENTIAL_VERIFICATIONS.filter(item => item.student_profile_id === studentProfileId);
  },

  // Assessment Questions
  async getAssessmentQuestions(category?: SkillCategory): Promise<AssessmentQuestion[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('assessment_questions_public').select('*');
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (!error && data) return data as AssessmentQuestion[];
      if (error) throw new Error(error.message);
    }
    if (category) return MOCK_QUESTIONS.filter(q => q.category === category);
    return MOCK_QUESTIONS;
  },

  async gradeAssessment(
    studentProfileId: string,
    answers: Record<string, 'A' | 'B' | 'C' | 'D'>
  ): Promise<AssessmentResult> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.rpc('grade_assessment', {
        requested_student_profile_id: studentProfileId,
        submitted_answers: answers
      });
      if (error) throw new Error(error.message);
      return {
        score: data.score,
        totalQuestions: data.total_questions,
        categoryScores: data.category_scores || {},
        strengths: data.strengths || [],
        gaps: data.gaps || []
      };
    }

    const questions = await this.getAssessmentQuestions();
    const correctCount = questions.filter(question => answers[question.id] === question.correct_option).length;
    const categoryTotals = new Map<string, { correct: number; total: number }>();
    questions.forEach(question => {
      const current = categoryTotals.get(question.category) || { correct: 0, total: 0 };
      current.total += 1;
      if (answers[question.id] === question.correct_option) current.correct += 1;
      categoryTotals.set(question.category, current);
    });
    const categoryScores = Object.fromEntries(
      Array.from(categoryTotals.entries()).map(([category, value]) => [category, Math.round((value.correct / value.total) * 100)])
    );
    const strengths = Array.from(categoryTotals.keys()).filter(category => categoryScores[category] >= 70).map(category => category.replace('_', ' '));
    const gaps = Array.from(categoryTotals.keys()).filter(category => categoryScores[category] < 70).map(category => category.replace('_', ' '));
    return {
      score: Math.round((correctCount / questions.length) * 100),
      totalQuestions: questions.length,
      categoryScores,
      strengths,
      gaps
    };
  },

  // Submit Assessment Result
  async submitAssessment(submission: Omit<AssessmentSubmission, 'id' | 'attempted_at'>): Promise<AssessmentSubmission> {
    const newSubmission: AssessmentSubmission = {
      ...submission,
      id: crypto.randomUUID(),
      attempted_at: new Date().toISOString()
    };
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('assessment_submissions').insert([newSubmission]);
      if (error) throw new Error(error.message);
    }
    return newSubmission;
  },

  async getInstitutionAnalytics(): Promise<InstitutionAnalytics> {
    const [students, opportunities, applications, skills] = await Promise.all([
      isSupabaseConfigured() && supabase
        ? supabase.from('student_profiles').select('*, skills:student_skills(*, skill:skills_master(*))')
        : Promise.resolve({ data: localStudentProfiles, error: null }),
      this.getOpportunities(),
      this.getApplications(),
      this.getSkills()
    ]);
    const studentRows = (students.data || localStudentProfiles) as StudentProfile[];
    const demand = new Map<string, number>();
    opportunities.forEach(opportunity => opportunity.required_skills?.forEach(required => {
      demand.set(required.skill.id, (demand.get(required.skill.id) || 0) + 1);
    }));
    const skillGaps = skills.map(skill => {
      const demandCount = demand.get(skill.id) || 0;
      const industryDemand = opportunities.length ? Math.round((demandCount / opportunities.length) * 100) : 0;
      const mastered = studentRows.filter(student => student.skills?.some(studentSkill => studentSkill.skill_id === skill.id && studentSkill.proficiency_level >= 3)).length;
      const cohortMastery = studentRows.length ? Math.round((mastered / studentRows.length) * 100) : 0;
      const deficit = Math.max(industryDemand - cohortMastery, 0);
      return {
        skill: skill.name,
        industryDemand,
        cohortMastery,
        deficit,
        status: deficit >= 35 ? 'Critical Deficit' as const : deficit >= 20 ? 'Moderate Gap' as const : 'Satisfactory' as const
      };
    }).filter(row => row.industryDemand > 0 || row.cohortMastery > 0).sort((a, b) => b.deficit - a.deficit).slice(0, 8);
    return {
      totalStudents: studentRows.length,
      completedAssessments: studentRows.filter(student => student.overall_readiness_score > 0).length,
      activePlacements: applications.filter(application => ['shortlisted', 'interview_scheduled', 'offered'].includes(application.status)).length,
      activeIndustryPartners: new Set(opportunities.map(opportunity => opportunity.company_id)).size,
      skillGaps
    };
  },

  // Applications
  async getApplications(studentProfileId?: string): Promise<Application[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities(*, company:profiles(*))
        `);
      if (studentProfileId) query = query.eq('student_profile_id', studentProfileId);
      const { data, error } = await query;
      if (!error && data) return data as Application[];
    }
    if (studentProfileId) return localApplications.filter(a => a.student_profile_id === studentProfileId);
    return localApplications;
  },

  async applyToOpportunity(application: Omit<Application, 'id' | 'applied_at'>): Promise<Application> {
    const newApp: Application = {
      ...application,
      id: crypto.randomUUID(),
      applied_at: new Date().toISOString()
    };
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('applications').insert([newApp]);
      if (error) throw new Error(error.message);
    }
    localApplications = [newApp, ...localApplications];
    return newApp;
  },

  async updateApplicationStatus(
    applicationId: string,
    status: Application['status']
  ): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);
      if (error) throw new Error(error.message);
    }

    localApplications = localApplications.map(application =>
      application.id === applicationId ? { ...application, status } : application
    );
  },

  async applyToFacultyOpportunity(
    facultyOpportunityId: string,
    academicianProfileId: string
  ): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('faculty_applications').insert([{
        id: crypto.randomUUID(),
        faculty_opportunity_id: facultyOpportunityId,
        academician_profile_id: academicianProfileId
      }]);
      if (error) throw new Error(error.message);
    }
  },

  async createCollaborationProposal(proposal: {
    initiatorId: string;
    title: string;
    type: string;
    description: string;
  }): Promise<void> {
    proposal = {
      ...proposal,
      title: normalizeText(proposal.title, 180),
      type: normalizeText(proposal.type, 80),
      description: normalizeText(proposal.description, 4000)
    };
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('collaboration_proposals').insert([{
        id: crypto.randomUUID(),
        initiator_id: proposal.initiatorId,
        title: proposal.title,
        type: proposal.type,
        description: proposal.description
      }]);
      if (error) throw new Error(error.message);
    }
  }
};
