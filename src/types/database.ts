export type UserRole = 'student' | 'academician' | 'industry' | 'institution';

export type OpportunityType = 'internship' | 'job' | 'apprenticeship' | 'live_project';

export type FacultyOppType = 'faculty_internship' | 'fdp' | 'industrial_training' | 'consultancy' | 'collaborative_research';

export type ApplicationStatus = 'applied' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'offered' | 'rejected';

export type SkillCategory = 'technical' | 'soft' | 'aptitude' | 'domain_specialized';

export type HealthcareDomain = 'modern_medicine' | 'ayurveda' | 'yoga_naturopathy' | 'unani' | 'siddha' | 'homoeopathy' | 'allied_health' | 'healthcare_technology';

export type VerificationStatus = 'self_declared' | 'pending' | 'verified' | 'assessment_verified' | 'faculty_verified' | 'hospital_verified' | 'institution_verified' | 'government_verified' | 'industry_verified' | 'rejected' | 'expired' | 'revoked';

export type CredentialType = 'degree' | 'certificate' | 'internship' | 'clinical_skill' | 'research' | 'registration' | 'achievement';

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
  healthcare_domain?: HealthcareDomain;
  specialization?: string;
  preferred_career_path?: string;
  clinical_experience_hours?: number;
  research_interests?: string[];
  verification_status?: VerificationStatus;
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
  verification_status?: VerificationStatus;
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

export interface AssessmentResult {
  score: number;
  totalQuestions: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  gaps: string[];
}

export interface InstitutionAnalytics {
  totalStudents: number;
  completedAssessments: number;
  activePlacements: number;
  activeIndustryPartners: number;
  skillGaps: Array<{
    skill: string;
    industryDemand: number;
    cohortMastery: number;
    deficit: number;
    status: 'Critical Deficit' | 'Moderate Gap' | 'Satisfactory';
  }>;
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
  item_type: 'project' | 'certification' | 'internship_report' | 'academic_record' | 'achievement' | 'case_study' | 'clinical_observation' | 'research' | 'cme';
  description?: string;
  verification_status: VerificationStatus;
  verification_issuer?: string;
  document_url?: string;
  date_awarded?: string;
}

export interface CredentialVerification {
  id: string;
  student_profile_id: string;
  credential_type: CredentialType;
  title: string;
  issuer_name: string;
  issuer_id?: string;
  source_system: 'digilocker' | 'nad' | 'university_api' | 'hospital_api' | 'private_issuer' | 'qr_code' | 'manual_review';
  credential_reference?: string;
  status: VerificationStatus;
  verified_at?: string;
  expires_at?: string;
  failure_reason?: string;
}

export interface SkillEvidence {
  id: string;
  student_profile_id: string;
  skill_id: string;
  evidence_type: 'assessment' | 'case_study' | 'internship_logbook' | 'certificate' | 'supervisor_feedback' | 'research_project';
  evidence_reference?: string;
  assessor_name?: string;
  assessor_role?: string;
  status: VerificationStatus;
  score?: number;
  feedback?: string;
  verified_at?: string;
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
