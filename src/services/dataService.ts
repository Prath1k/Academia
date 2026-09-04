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
  AssessmentQuestion,
  AssessmentSubmission,
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
  MOCK_QUESTIONS,
  MOCK_APPLICATIONS
} from '../data/mockFallbackData';

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
    const newId = `opp-${Date.now()}`;
    const newOpp: Opportunity = { ...opp, id: newId };
    
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('opportunities').insert([{
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

  // Assessment Questions
  async getAssessmentQuestions(category?: SkillCategory): Promise<AssessmentQuestion[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('assessment_questions').select('*');
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (!error && data) return data as AssessmentQuestion[];
    }
    if (category) return MOCK_QUESTIONS.filter(q => q.category === category);
    return MOCK_QUESTIONS;
  },

  // Submit Assessment Result
  async submitAssessment(submission: Omit<AssessmentSubmission, 'id' | 'attempted_at'>): Promise<AssessmentSubmission> {
    const newSubmission: AssessmentSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      attempted_at: new Date().toISOString()
    };
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('assessment_submissions').insert([newSubmission]);
    }
    return newSubmission;
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
      id: `app-${Date.now()}`,
      applied_at: new Date().toISOString()
    };
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('applications').insert([newApp]);
    }
    localApplications = [newApp, ...localApplications];
    return newApp;
  }
};
