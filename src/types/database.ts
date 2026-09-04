export type UserRole = 'student' | 'academician' | 'industry' | 'institution';

export type OpportunityType = 'internship' | 'job' | 'apprenticeship' | 'live_project';

export type FacultyOppType = 'faculty_internship' | 'fdp' | 'industrial_training' | 'consultancy' | 'collaborative_research';

export type ApplicationStatus = 'applied' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'offered' | 'rejected';

export type SkillCategory = 'technical' | 'soft' | 'aptitude' | 'domain_specialized';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
  institution_or_company?: string;
  department?: string;
  bio?: string;
  phone?: string;
  created_at: string;
}

export interface SkillMaster {
  id: string;
  name: string;
  category: SkillCategory;
  domain_tag: string;
  priority_weight: number;
  description?: string;
}

export interface StudentProfile {
  id: string;
  profile_id: string;
  degree: string;
  major: string;
  year_of_study: number;
  cgpa: number;
  resume_url?: string;
  portfolio_url?: string;
  overall_readiness_score: number;
  profile?: Profile;
  skills?: StudentSkill[];
}

export interface StudentSkill {
  id: string;
  student_profile_id: string;
  skill_id: string;
  proficiency_level: number; // 1 to 5
  is_verified: boolean;
  verified_by?: string;
  skill?: SkillMaster;
}

export interface AssessmentQuestion {
  id: string;
  category: SkillCategory;
  skill_id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface AssessmentSubmission {
  id: string;
  student_profile_id: string;
  category: SkillCategory;
  score: number;
  total_questions: number;
  strengths: string[];
  gaps: string[];
  feedback?: string;
  attempted_at: string;
}

export interface Opportunity {
  id: string;
  company_id: string;
  title: string;
  type: OpportunityType;
  domain: string;
  location: string;
  stipend_or_salary?: string;
  duration?: string;
  openings: number;
  description: string;
  eligibility?: string;
  deadline?: string;
  is_active: boolean;
  company?: Profile;
  required_skills?: Array<{
    skill: SkillMaster;
    is_mandatory: boolean;
    weight: number;
  }>;
}

export interface FacultyOpportunity {
  id: string;
  posted_by: string;
  title: string;
  type: FacultyOppType;
  department: string;
  duration: string;
  stipend_or_grant?: string;
  location: string;
  requirements: string;
  description: string;
  is_active: boolean;
  poster?: Profile;
}

export interface LearningProgram {
  id: string;
  company_id: string;
  title: string;
  provider_name: string;
  type: string;
  duration_hours: number;
  syllabus_summary?: string;
  target_skills: string[];
  link_url?: string;
  enrollment_count: number;
}

export interface CollaborationInitiative {
  id: string;
  initiator_id: string;
  title: string;
  type: string;
  target_institution?: string;
  description: string;
  status: string;
  event_date?: string;
  initiator?: Profile;
}

export interface DigitalPortfolioItem {
  id: string;
  student_profile_id: string;
  title: string;
  item_type: 'project' | 'certification' | 'internship_report' | 'academic_record' | 'achievement';
  description?: string;
  verification_status: 'verified' | 'pending';
  verification_issuer?: string;
  document_url?: string;
  date_awarded?: string;
}

export interface Application {
  id: string;
  opportunity_id: string;
  student_profile_id: string;
  match_score: number;
  status: ApplicationStatus;
  cover_letter?: string;
  mentor_feedback?: string;
  applied_at: string;
  opportunity?: Opportunity;
}
