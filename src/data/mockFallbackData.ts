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
  Application
} from '../types/database';

export const MOCK_PROFILES: Profile[] = [
  {
    id: '22222222-2222-2222-2222-222222220001',
    role: 'student',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@dtu.ac.in',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    institution_or_company: 'Delhi Technological University',
    department: 'Computer Science & Biomedical Eng',
    bio: 'Senior year engineering student passionate about healthcare predictive models and full-stack cloud systems.',
    phone: '+91 98765 43210',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: '22222222-2222-2222-2222-222222220002',
    role: 'student',
    full_name: 'Dr. Priya Varma',
    email: 'priya.varma@ayush.edu.in',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    institution_or_company: 'All India Institute of Ayurveda',
    department: 'Ayurvedic Medicine & Pharmacology',
    bio: 'Post-graduate scholar researching botanical phytochemical extraction, GCP compliance, and evidence-based wellness.',
    phone: '+91 98123 45678',
    created_at: '2026-02-15T11:00:00Z'
  },
  {
    id: '22222222-2222-2222-2222-222222220003',
    role: 'academician',
    full_name: 'Prof. Rajesh Kulkarni',
    email: 'rajesh.kulkarni@nitk.edu',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    institution_or_company: 'National Institute of Technology',
    department: 'School of Biosciences & Health Tech',
    bio: 'Dean of Industry Alliances with 18+ years running clinical research partnerships, FDPs, and incubation labs.',
    phone: '+91 94567 89012',
    created_at: '2025-11-01T08:00:00Z'
  },
  {
    id: '22222222-2222-2222-2222-222222220004',
    role: 'industry',
    full_name: 'Sun Phytotech & Herbal Labs',
    email: 'talent@sunphytotech.com',
    avatar_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
    institution_or_company: 'Sun Phytotech Ltd.',
    department: 'Talent Acquisition & Pharmacovigilance R&D',
    bio: 'Pioneering phytopharmaceutical enterprise integrating classical wisdom with modern clinical trials and NABL lab standards.',
    created_at: '2025-08-20T09:30:00Z'
  },
  {
    id: '22222222-2222-2222-2222-222222220005',
    role: 'industry',
    full_name: 'Apex Digital Health AI',
    email: 'recruiting@apexdigital.io',
    avatar_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150',
    institution_or_company: 'Apex Digital Health',
    department: 'Engineering & Clinical AI Platforms',
    bio: 'High-growth health-tech enterprise powering hospital EHR workflows and intelligent diagnostics across 120+ clinical networks.',
    created_at: '2025-09-12T14:15:00Z'
  },
  {
    id: '22222222-2222-2222-2222-222222220006',
    role: 'institution',
    full_name: 'University Placement Council',
    email: 'tpo@centraluni.ac.in',
    avatar_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150',
    institution_or_company: 'Central University Career Development Center',
    department: 'Training, Placement & Corporate Relations',
    bio: 'Empowering over 12,000 students and 450 faculty members with data-driven career diagnostics and industry partnerships.',
    created_at: '2025-07-01T12:00:00Z'
  }
];

export const MOCK_SKILLS: SkillMaster[] = [
  {
    id: '11111111-1111-1111-1111-111111110001',
    name: 'Python Data Analysis & Pipelines',
    category: 'technical',
    domain_tag: 'engineering',
    priority_weight: 1.0,
    description: 'Data wrangling, pandas, statistical computation, and ETL scripting'
  },
  {
    id: '11111111-1111-1111-1111-111111110002',
    name: 'Full-Stack Web Engineering',
    category: 'technical',
    domain_tag: 'engineering',
    priority_weight: 1.0,
    description: 'React, TypeScript, RESTful services, responsive UI design, API integration'
  },
  {
    id: '11111111-1111-1111-1111-111111110003',
    name: 'Machine Learning & Predictive Modeling',
    category: 'technical',
    domain_tag: 'engineering',
    priority_weight: 1.0,
    description: 'Supervised classification, regression, model validation, and deployment'
  },
  {
    id: '11111111-1111-1111-1111-111111110004',
    name: 'Good Clinical Practice (GCP)',
    category: 'domain_specialized',
    domain_tag: 'ayush',
    priority_weight: 1.25,
    description: 'Standard regulatory compliance for clinical research trials and patient documentation'
  },
  {
    id: '11111111-1111-1111-1111-111111110005',
    name: 'Herbal Formulation & Standardization',
    category: 'domain_specialized',
    domain_tag: 'ayush',
    priority_weight: 1.30,
    description: 'HPTLC chromatographic fingerprinting, phytochemical extraction, and pharmacopoeial tests'
  },
  {
    id: '11111111-1111-1111-1111-111111110006',
    name: 'Pharmacovigilance & Drug Safety',
    category: 'domain_specialized',
    domain_tag: 'ayush',
    priority_weight: 1.25,
    description: 'Adverse drug reaction (ADR) monitoring, medical ethics, and periodic safety reports'
  },
  {
    id: '11111111-1111-1111-1111-111111110007',
    name: 'Critical Thinking & Problem Solving',
    category: 'soft',
    domain_tag: 'general',
    priority_weight: 1.0,
    description: 'Structured analytical breakdown, root-cause triage, and decision modeling'
  },
  {
    id: '11111111-1111-1111-1111-111111110008',
    name: 'Executive Cross-Disciplinary Communication',
    category: 'soft',
    domain_tag: 'general',
    priority_weight: 1.0,
    description: 'Presenting technical findings to cross-functional stakeholders and writing clinical reports'
  },
  {
    id: '11111111-1111-1111-1111-111111110009',
    name: 'Project Management & Agile',
    category: 'soft',
    domain_tag: 'general',
    priority_weight: 1.0,
    description: 'Scrum sprint planning, issue tracking, milestones delivery, and cross-team alignment'
  },
  {
    id: '11111111-1111-1111-1111-111111110010',
    name: 'Healthcare Informatics & EHR',
    category: 'domain_specialized',
    domain_tag: 'ayush',
    priority_weight: 1.2,
    description: 'Electronic health record standards, NABH hospital compliance, and clinical databases'
  }
];

export const MOCK_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: '33333333-3333-3333-3333-333333330001',
    profile_id: '22222222-2222-2222-2222-222222220001',
    degree: 'B.Tech',
    major: 'Computer Science & Biomedical Systems',
    year_of_study: 4,
    cgpa: 8.85,
    overall_readiness_score: 84,
    profile: MOCK_PROFILES[0],
    skills: [
      {
        id: 's1',
        student_profile_id: '33333333-3333-3333-3333-333333330001',
        skill_id: '11111111-1111-1111-1111-111111110001',
        proficiency_level: 5,
        is_verified: true,
        verified_by: 'University Data Lab',
        skill: MOCK_SKILLS[0]
      },
      {
        id: 's2',
        student_profile_id: '33333333-3333-3333-3333-333333330001',
        skill_id: '11111111-1111-1111-1111-111111110002',
        proficiency_level: 4,
        is_verified: true,
        verified_by: 'Full-Stack Hackathon Evaluation',
        skill: MOCK_SKILLS[1]
      },
      {
        id: 's3',
        student_profile_id: '33333333-3333-3333-3333-333333330001',
        skill_id: '11111111-1111-1111-1111-111111110007',
        proficiency_level: 4,
        is_verified: true,
        verified_by: 'Aptitude Assessment Test',
        skill: MOCK_SKILLS[6]
      }
    ]
  },
  {
    id: '33333333-3333-3333-3333-333333330002',
    profile_id: '22222222-2222-2222-2222-222222220002',
    degree: 'MD (Ayurveda)',
    major: 'Dravyaguna & Clinical Pharmacology',
    year_of_study: 2,
    cgpa: 9.20,
    overall_readiness_score: 91,
    profile: MOCK_PROFILES[1],
    skills: [
      {
        id: 's4',
        student_profile_id: '33333333-3333-3333-3333-333333330002',
        skill_id: '11111111-1111-1111-1111-111111110004',
        proficiency_level: 5,
        is_verified: true,
        verified_by: 'National Clinical Board Certification',
        skill: MOCK_SKILLS[3]
      },
      {
        id: 's5',
        student_profile_id: '33333333-3333-3333-3333-333333330002',
        skill_id: '11111111-1111-1111-1111-111111110005',
        proficiency_level: 5,
        is_verified: true,
        verified_by: 'Ayush Pharmacopoeial Commission Lab',
        skill: MOCK_SKILLS[4]
      },
      {
        id: 's6',
        student_profile_id: '33333333-3333-3333-3333-333333330002',
        skill_id: '11111111-1111-1111-1111-111111110006',
        proficiency_level: 4,
        is_verified: true,
        verified_by: 'National Pharmacovigilance Program (PvPI)',
        skill: MOCK_SKILLS[5]
      }
    ]
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '44444444-4444-4444-4444-444444440001',
    company_id: '22222222-2222-2222-2222-222222220005',
    title: 'Healthcare Data & Full-Stack Systems Intern',
    type: 'internship',
    domain: 'software',
    location: 'Bengaluru (Hybrid)',
    stipend_or_salary: '₹35,000 / month',
    duration: '6 Months',
    openings: 4,
    description: 'Build and optimize real-time patient data pipelines and responsive clinician dashboards. Open to engineering, computer science, and bioinformatics students.',
    eligibility: 'Pre-final or Final year B.Tech/MCA/M.Tech with strong React and Python/database knowledge.',
    deadline: '2026-10-30',
    is_active: true,
    company: MOCK_PROFILES[4],
    required_skills: [
      { skill: MOCK_SKILLS[0], is_mandatory: true, weight: 1.2 },
      { skill: MOCK_SKILLS[1], is_mandatory: true, weight: 1.0 },
      { skill: MOCK_SKILLS[6], is_mandatory: false, weight: 0.8 }
    ]
  },
  {
    id: '44444444-4444-4444-4444-444444440002',
    company_id: '22222222-2222-2222-2222-222222220004',
    title: 'Clinical Research & Pharmacovigilance Fellow',
    type: 'internship',
    domain: 'ayush_pharma',
    location: 'New Delhi / On-Site',
    stipend_or_salary: '₹40,000 / month',
    duration: '6 Months',
    openings: 2,
    description: 'Work with senior pharmacologists on clinical trial documentation, botanical product safety, and Good Clinical Practice compliance.',
    eligibility: 'BAMS / B.Pharm / M.Pharm / Life Sciences graduates with strong ethics training.',
    deadline: '2026-11-15',
    is_active: true,
    company: MOCK_PROFILES[3],
    required_skills: [
      { skill: MOCK_SKILLS[3], is_mandatory: true, weight: 1.3 },
      { skill: MOCK_SKILLS[5], is_mandatory: true, weight: 1.2 },
      { skill: MOCK_SKILLS[7], is_mandatory: false, weight: 0.9 }
    ]
  },
  {
    id: '44444444-4444-4444-4444-444444440003',
    company_id: '22222222-2222-2222-2222-222222220004',
    title: 'Herbal Formulation Quality Analyst',
    type: 'job',
    domain: 'ayush_pharma',
    location: 'Haridwar R&D Center',
    stipend_or_salary: '₹7.5 - 9.0 LPA',
    duration: 'Full-Time',
    openings: 3,
    description: 'Perform HPTLC, chromatographic fingerprinting, and quality standardization for herbal and nutraceutical formulations under NABL compliance.',
    eligibility: 'Postgraduates in Phytochemistry, Pharmacognosy, or Analytical Chemistry.',
    deadline: '2026-12-01',
    is_active: true,
    company: MOCK_PROFILES[3],
    required_skills: [
      { skill: MOCK_SKILLS[4], is_mandatory: true, weight: 1.4 },
      { skill: MOCK_SKILLS[5], is_mandatory: false, weight: 1.0 },
      { skill: MOCK_SKILLS[6], is_mandatory: false, weight: 0.8 }
    ]
  },
  {
    id: '44444444-4444-4444-4444-444444440004',
    company_id: '22222222-2222-2222-2222-222222220005',
    title: 'Machine Learning Healthcare Research Intern',
    type: 'internship',
    domain: 'engineering',
    location: 'Hyderabad (Remote)',
    stipend_or_salary: '₹45,000 / month',
    duration: '3 Months',
    openings: 2,
    description: 'Collaborate with clinical teams to train transformer models for automated biomedical record classification.',
    eligibility: 'Strong proficiency in Python, PyTorch, and NLP.',
    deadline: '2026-11-20',
    is_active: true,
    company: MOCK_PROFILES[4],
    required_skills: [
      { skill: MOCK_SKILLS[0], is_mandatory: true, weight: 1.3 },
      { skill: MOCK_SKILLS[2], is_mandatory: true, weight: 1.5 },
      { skill: MOCK_SKILLS[6], is_mandatory: false, weight: 0.7 }
    ]
  }
];

export const MOCK_FACULTY_OPPORTUNITIES: FacultyOpportunity[] = [
  {
    id: '55555555-5555-5555-5555-555555550001',
    posted_by: '22222222-2222-2222-2222-222222220004',
    title: 'Industrial Faculty Sabbatical in High-Throughput Drug Screening',
    type: 'faculty_internship',
    department: 'Biosciences & Pharmacology',
    duration: '2 Months',
    stipend_or_grant: '₹85,000 / month grant',
    location: 'Pune R&D Hub',
    requirements: 'Ph.D / Associate Professors in Life Sciences, Chemistry, or Ayush medicine.',
    description: 'Hands-on industrial research sabbatical to understand industrial validation pipelines and modernize university curriculum.',
    is_active: true,
    poster: MOCK_PROFILES[3]
  },
  {
    id: '55555555-5555-5555-5555-555555550002',
    posted_by: '22222222-2222-2222-2222-222222220005',
    title: 'Faculty Development Program (FDP): AI in Healthcare Diagnostics',
    type: 'fdp',
    department: 'Computer Science & Biomedical Eng',
    duration: '2 Weeks (40 hrs)',
    stipend_or_grant: 'Fully Sponsored by Industry',
    location: 'Hybrid / Virtual',
    requirements: 'Faculty teaching Computer Science, Data Science, or Medical Electronics.',
    description: 'Intensive hands-on training on deploying medical imaging algorithms and EHR automation in hospital networks.',
    is_active: true,
    poster: MOCK_PROFILES[4]
  },
  {
    id: '55555555-5555-5555-5555-555555550003',
    posted_by: '22222222-2222-2222-2222-222222220004',
    title: 'Collaborative Research Grant: Standardization of Polyherbal Extracts',
    type: 'collaborative_research',
    department: 'Pharmacognosy & Chemistry',
    duration: '12 Months',
    stipend_or_grant: '₹15,00,000 Project Grant',
    location: 'University Lab & Industry Lab',
    requirements: 'Recognized University Lab with HPTLC and spectroscopic facilities.',
    description: 'Joint academia-industry funded research to establish standardized pharmacopoeial protocols for high-demand wellness herbs.',
    is_active: true,
    poster: MOCK_PROFILES[3]
  }
];

export const MOCK_LEARNING_PROGRAMS: LearningProgram[] = [
  {
    id: '66666666-6666-6666-6666-666666660001',
    company_id: '22222222-2222-2222-2222-222222220004',
    title: 'GCP & Clinical Documentation Mastery',
    provider_name: 'Sun Phytotech Academy & Ayurgyan',
    type: 'certification',
    duration_hours: 16,
    syllabus_summary: 'Ethics in trials, adverse event reporting, ICH-GCP regulatory filing and audit readiness.',
    target_skills: ['Good Clinical Practice (GCP)', 'Pharmacovigilance & Drug Safety'],
    link_url: 'https://ayush.gov.in',
    enrollment_count: 312
  },
  {
    id: '66666666-6666-6666-6666-666666660002',
    company_id: '22222222-2222-2222-2222-222222220005',
    title: 'Modern Full-Stack Healthcare Engineering',
    provider_name: 'Apex Health Engineering Labs',
    type: 'workshop',
    duration_hours: 24,
    syllabus_summary: 'Building HIPAA/NABH compliant microservices with React, TypeScript & FastAPIs.',
    target_skills: ['Full-Stack Web Engineering', 'Healthcare Informatics & EHR'],
    link_url: 'https://swayam.gov.in',
    enrollment_count: 540
  },
  {
    id: '66666666-6666-6666-6666-666666660003',
    company_id: '22222222-2222-2222-2222-222222220004',
    title: 'HPTLC Standardization & Quality Control in Herbal Formulations',
    provider_name: 'Ayush Center of Excellence',
    type: 'certification',
    duration_hours: 30,
    syllabus_summary: 'Sample preparation, mobile phase selection, densitometric scanning, and biomarker validation.',
    target_skills: ['Herbal Formulation & Standardization'],
    link_url: 'https://ayushcoe.in',
    enrollment_count: 198
  }
];

export const MOCK_COLLABORATIONS: CollaborationInitiative[] = [
  {
    id: 'c1',
    initiator_id: '22222222-2222-2222-2222-222222220004',
    title: 'National Ayush & HealthTech Innovation Challenge 2026',
    type: 'innovation_challenge',
    target_institution: 'Open to all Recognized Universities',
    description: 'Annual university challenge inviting student and faculty teams to build smart clinical solutions and standardization protocols.',
    status: 'open',
    event_date: '2026-10-15',
    initiator: MOCK_PROFILES[3]
  },
  {
    id: 'c2',
    initiator_id: '22222222-2222-2222-2222-222222220005',
    title: 'Expert Industry Masterclass: Scaling Telemedicine Pipelines',
    type: 'guest_lecture',
    target_institution: 'Delhi Technological University',
    description: 'Interactive 2-hour masterclass by Apex VP of Engineering for pre-final and final year student and faculty cohorts.',
    status: 'scheduled',
    event_date: '2026-09-28',
    initiator: MOCK_PROFILES[4]
  }
];

export const MOCK_PORTFOLIO_ITEMS: DigitalPortfolioItem[] = [
  {
    id: 'p1',
    student_profile_id: '33333333-3333-3333-3333-333333330001',
    title: 'AI-Assisted Diagnostic Triage for Primary Health Centers',
    item_type: 'project',
    description: 'Built a transformer-based symptom triage engine deployed experimentally in 4 community healthcare facilities.',
    verification_status: 'verified',
    verification_issuer: 'Smart Healthcare Hackathon National Winner',
    date_awarded: '2026-04-15'
  },
  {
    id: 'p2',
    student_profile_id: '33333333-3333-3333-3333-333333330001',
    title: 'Full-Stack Hospital Resource Management System',
    item_type: 'project',
    description: 'Scalable cloud dashboard tracking bed capacity, oxygen lines, and staff scheduling with real-time WebSockets.',
    verification_status: 'verified',
    verification_issuer: 'DTU Capstone Project Council',
    date_awarded: '2026-05-10'
  },
  {
    id: 'p3',
    student_profile_id: '33333333-3333-3333-3333-333333330002',
    title: 'Standardization of Ashwagandha Active Withanolides using HPTLC',
    item_type: 'project',
    description: 'Conducted chromatographic fingerprinting across 12 harvested regional samples to test seasonal potency variations.',
    verification_status: 'verified',
    verification_issuer: 'National Institute of Ayurveda',
    date_awarded: '2026-05-20'
  }
];

export const MOCK_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    category: 'technical',
    skill_id: '11111111-1111-1111-1111-111111110001',
    question_text: 'In Python Pandas, which method is the most efficient way to handle missing numeric values with the column mean?',
    option_a: 'df.dropna()',
    option_b: 'df.fillna(df.mean(numeric_only=True))',
    option_c: 'df.replace(0)',
    option_d: 'df.interpolate(method="polynomial")',
    correct_option: 'B',
    explanation: 'fillna with column mean replaces NaN entries without losing critical data records.'
  },
  {
    id: 'q2',
    category: 'technical',
    skill_id: '11111111-1111-1111-1111-111111110002',
    question_text: 'In modern React, what is the primary advantage of React Query or SWR over manual useEffect data fetching?',
    option_a: 'It compiles JavaScript into WebAssembly',
    option_b: 'It automatically manages caching, deduplication, background revalidation, and loading state',
    option_c: 'It replaces CSS stylesheets entirely',
    option_d: 'It disables cross-origin resource sharing',
    correct_option: 'B',
    explanation: 'React Query provides automated caching, deduplication, and background synchronization out of the box.'
  },
  {
    id: 'q3',
    category: 'domain_specialized',
    skill_id: '11111111-1111-1111-1111-111111110004',
    question_text: 'Under Good Clinical Practice (GCP) guidelines, what document must be secured before any patient clinical trial intervention begins?',
    option_a: 'Laboratory Purchase Receipt',
    option_b: 'Institutional Ethics Committee Approval & Signed Informed Consent',
    option_c: 'Commercial Trademark Certificate',
    option_d: 'National Marketing Authorization',
    correct_option: 'B',
    explanation: 'GCP mandates ethical clearance and signed informed consent prior to human clinical trials.'
  },
  {
    id: 'q4',
    category: 'domain_specialized',
    skill_id: '11111111-1111-1111-1111-111111110005',
    question_text: 'Which analytical technique is standard in Ayush pharmacopoeial protocols for chromatographic fingerprinting of herbal raw materials?',
    option_a: 'Simple gravity filtration',
    option_b: 'High-Performance Thin-Layer Chromatography (HPTLC)',
    option_c: 'Optical Refractometry',
    option_d: 'Acid-base volumetric titration',
    correct_option: 'B',
    explanation: 'HPTLC provides validated, reproducible chromatographic fingerprints for herbal standardization.'
  },
  {
    id: 'q5',
    category: 'soft',
    skill_id: '11111111-1111-1111-1111-111111110007',
    question_text: 'When your team discovers an unexpected data inconsistency two days prior to project deployment, what is the best immediate response?',
    option_a: 'Ignore the anomaly and proceed silently',
    option_b: 'Conduct root-cause triage, communicate stakeholder impact transparently, and isolate the faulty pipeline',
    option_c: 'Blame external database vendors publicly',
    option_d: 'Postpone release indefinitely without notifying team leads',
    correct_option: 'B',
    explanation: 'Proactive triage, transparency, and targeted containment demonstrate executive critical thinking.'
  },
  {
    id: 'q6',
    category: 'soft',
    skill_id: '11111111-1111-1111-1111-111111110008',
    question_text: 'What is the most effective approach to present complex technical/clinical research findings to non-technical business partners?',
    option_a: 'Use raw unannotated terminal logs or medical jargon',
    option_b: 'Use visual executive dashboards highlighting core metrics, patient/user impact, and clear next steps',
    option_c: 'Refuse to share data until they learn the terminology',
    option_d: 'Provide a 300-page raw text appendix without summary',
    correct_option: 'B',
    explanation: 'Translating complex findings into executive visual narratives bridges cross-disciplinary collaboration.'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app1',
    opportunity_id: '44444444-4444-4444-4444-444444440001',
    student_profile_id: '33333333-3333-3333-3333-333333330001',
    match_score: 92,
    status: 'interview_scheduled',
    cover_letter: 'Passionate about integrating modern cloud APIs with medical records.',
    mentor_feedback: 'Outstanding technical profile in data analysis and React systems. Scheduled for technical round.',
    applied_at: '2026-08-25T14:30:00Z',
    opportunity: MOCK_OPPORTUNITIES[0]
  },
  {
    id: 'app2',
    opportunity_id: '44444444-4444-4444-4444-444444440002',
    student_profile_id: '33333333-3333-3333-3333-333333330002',
    match_score: 96,
    status: 'shortlisted',
    cover_letter: 'Extensive hands-on lab experience in botanical standardization and GCP compliance.',
    mentor_feedback: 'Top-tier candidate with proven pharmacovigilance credentials.',
    applied_at: '2026-08-28T09:15:00Z',
    opportunity: MOCK_OPPORTUNITIES[1]
  }
];
