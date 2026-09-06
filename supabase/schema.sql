-- ====================================================================
-- ACADEMIA-INDUSTRY COLLABORATION PORTAL SCHEMA
-- Sponsoring Ministry: Ministry of Ayush / Centralized Collaboration Hub
-- Supports Students, Academicians, Industry Recruiters, and Institutions
-- ====================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'academician', 'industry', 'institution');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE opportunity_type AS ENUM ('internship', 'job', 'apprenticeship', 'live_project');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE faculty_opp_type AS ENUM ('faculty_internship', 'fdp', 'industrial_training', 'consultancy', 'collaborative_research');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('applied', 'under_review', 'shortlisted', 'interview_scheduled', 'offered', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_category AS ENUM ('technical', 'soft', 'aptitude', 'domain_specialized');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 3. Core Profiles Table (Works with Supabase Auth or Standalone UUIDs)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL DEFAULT 'student',
    requested_role user_role NOT NULL DEFAULT 'student',
    verification_status TEXT NOT NULL DEFAULT 'approved' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    institution_or_company TEXT,
    department TEXT,
    bio TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS requested_role user_role NOT NULL DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'approved';

-- ====================================================================
-- 4. Skills Master Taxonomy
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.skills_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category skill_category NOT NULL,
    domain_tag TEXT NOT NULL DEFAULT 'general', -- 'general', 'ayush', 'engineering', 'analytics', etc.
    priority_weight NUMERIC(3,2) DEFAULT 1.00,  -- Subtle background multiplier (e.g., 1.25 for Ayush priority)
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 5. Student Profiles & Relational Skills
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    degree TEXT NOT NULL,
    major TEXT NOT NULL,
    year_of_study INT DEFAULT 3,
    cgpa NUMERIC(3,2) DEFAULT 8.00,
    resume_url TEXT,
    portfolio_url TEXT,
    overall_readiness_score INT DEFAULT 70,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills_master(id) ON DELETE CASCADE,
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    UNIQUE(student_profile_id, skill_id)
);

-- ====================================================================
-- 6. Skill Assessment Question Bank & Submissions
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category skill_category NOT NULL,
    skill_id UUID REFERENCES public.skills_master(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.assessment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    category skill_category NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    strengths TEXT[],
    gaps TEXT[],
    feedback TEXT,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Client-facing assessment data must never include the answer key.
CREATE OR REPLACE VIEW public.assessment_questions_public AS
SELECT id, category, skill_id, question_text, option_a, option_b, option_c, option_d, created_at
FROM public.assessment_questions;

GRANT SELECT ON public.assessment_questions_public TO authenticated;

-- ====================================================================
-- 7. Industry Opportunities (Internships, Jobs, Apprenticeships)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type opportunity_type NOT NULL DEFAULT 'internship',
    domain TEXT NOT NULL DEFAULT 'general', -- 'general', 'ayush_pharma', 'software', 'healthcare'
    location TEXT NOT NULL DEFAULT 'Hybrid',
    stipend_or_salary TEXT,
    duration TEXT,
    openings INT DEFAULT 2,
    description TEXT NOT NULL,
    eligibility TEXT,
    deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.opportunity_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills_master(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    weight NUMERIC(3,2) DEFAULT 1.00,
    UNIQUE(opportunity_id, skill_id)
);

-- ====================================================================
-- 8. Applications & Tracking
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    match_score INT DEFAULT 0,
    status application_status DEFAULT 'applied',
    cover_letter TEXT,
    mentor_feedback TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(opportunity_id, student_profile_id)
);

-- ====================================================================
-- 9. Dedicated Portal for Academicians (Faculty Internships, FDPs, Research)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.faculty_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    posted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type faculty_opp_type NOT NULL,
    department TEXT NOT NULL,
    duration TEXT NOT NULL,
    stipend_or_grant TEXT,
    location TEXT NOT NULL,
    requirements TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.faculty_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_opportunity_id UUID NOT NULL REFERENCES public.faculty_opportunities(id) ON DELETE CASCADE,
    academician_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'submitted',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(faculty_opportunity_id, academician_profile_id)
);

-- ====================================================================
-- 10. Industry Learning Programs & Certifications
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.learning_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'certification', -- 'certification', 'workshop', 'mentorship_initiative'
    duration_hours INT DEFAULT 20,
    syllabus_summary TEXT,
    target_skills TEXT[],
    link_url TEXT,
    enrollment_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 11. Industry-Academia Collaboration Initiatives (Guest Lectures, Hackathons, MoUs)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.collaboration_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'guest_lecture', 'workshop', 'innovation_challenge', 'research_partnership', 'mou'
    target_institution TEXT,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    event_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.collaboration_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 12. Student Digital Portfolios (Verified Credentials, Projects & Reports)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.digital_portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    item_type TEXT NOT NULL, -- 'project', 'certification', 'internship_report', 'academic_record', 'achievement'
    description TEXT,
    verification_status TEXT DEFAULT 'verified', -- 'verified', 'pending'
    verification_issuer TEXT,
    document_url TEXT,
    date_awarded DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 13. Enable Row Level Security (RLS) & Policies
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_portfolio_items ENABLE ROW LEVEL SECURITY;

-- RLS helpers and policies. The SQL editor may be rerun safely during setup.
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT CASE WHEN verification_status = 'approved' THEN role ELSE 'student'::user_role END
    FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND (
        NEW.role IS DISTINCT FROM OLD.role OR
        NEW.requested_role IS DISTINCT FROM OLD.requested_role OR
        NEW.verification_status IS DISTINCT FROM OLD.verification_status
    ) THEN
        RAISE EXCEPTION 'Profile role and verification fields are managed by administrators';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role_escalation ON public.profiles;
CREATE TRIGGER protect_profile_role_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_escalation();

REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

DROP POLICY IF EXISTS "Public read access for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public read access for skills" ON public.skills_master;
DROP POLICY IF EXISTS "Public read access for student_profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Public read access for student_skills" ON public.student_skills;
DROP POLICY IF EXISTS "Public read access for assessment_questions" ON public.assessment_questions;
DROP POLICY IF EXISTS "Authenticated users can read assessment questions" ON public.assessment_questions;
DROP POLICY IF EXISTS "Public read access for assessment_submissions" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Public read access for opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Public read access for opportunity_skills" ON public.opportunity_skills;
DROP POLICY IF EXISTS "Public read access for applications" ON public.applications;
DROP POLICY IF EXISTS "Public read access for faculty_opportunities" ON public.faculty_opportunities;
DROP POLICY IF EXISTS "Public read access for learning_programs" ON public.learning_programs;
DROP POLICY IF EXISTS "Public read access for collaboration_initiatives" ON public.collaboration_initiatives;
DROP POLICY IF EXISTS "Public read access for digital_portfolio_items" ON public.digital_portfolio_items;
DROP POLICY IF EXISTS "Allow all insert for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all insert for student_profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Allow all insert for student_skills" ON public.student_skills;
DROP POLICY IF EXISTS "Allow all insert for assessment_submissions" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Allow all insert for opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Allow all insert for applications" ON public.applications;
DROP POLICY IF EXISTS "Allow all insert for faculty_opportunities" ON public.faculty_opportunities;
DROP POLICY IF EXISTS "Allow all insert for learning_programs" ON public.learning_programs;
DROP POLICY IF EXISTS "Allow all insert for collaboration_initiatives" ON public.collaboration_initiatives;
DROP POLICY IF EXISTS "Allow all insert for digital_portfolio_items" ON public.digital_portfolio_items;

CREATE POLICY "Users can read their own profile" ON public.profiles
    FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can create their own profile" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (id = auth.uid() AND role = 'student' AND verification_status = 'pending');
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Authenticated users can read skills" ON public.skills_master
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authorized users can read student profiles" ON public.student_profiles
    FOR SELECT TO authenticated USING (
        profile_id = auth.uid() OR public.current_user_role() IN ('academician', 'industry', 'institution')
    );
CREATE POLICY "Students can create their own student profile" ON public.student_profiles
    FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid() AND public.current_user_role() = 'student');
CREATE POLICY "Students can update their own student profile" ON public.student_profiles
    FOR UPDATE TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Authorized users can read student skills" ON public.student_skills
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles student
            WHERE student.id = student_profile_id
                AND (student.profile_id = auth.uid() OR public.current_user_role() IN ('academician', 'industry', 'institution'))
        )
    );
CREATE POLICY "Students can manage their own skills" ON public.student_skills
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.student_profiles WHERE id = student_profile_id AND profile_id = auth.uid())
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.student_profiles WHERE id = student_profile_id AND profile_id = auth.uid())
    );

CREATE POLICY "Students can create their own assessment submissions" ON public.assessment_submissions
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.student_profiles WHERE id = student_profile_id AND profile_id = auth.uid())
    );
CREATE POLICY "Students can read their own assessment submissions" ON public.assessment_submissions
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.student_profiles WHERE id = student_profile_id AND profile_id = auth.uid())
    );

CREATE OR REPLACE FUNCTION public.grade_assessment(
    requested_student_profile_id UUID,
    submitted_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    question_count INT;
    correct_count INT;
    percentage INT;
    submission_id UUID;
    category_scores JSONB;
    strengths TEXT[];
    gaps TEXT[];
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.student_profiles
        WHERE id = requested_student_profile_id AND profile_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Student profile does not belong to the authenticated user';
    END IF;

    SELECT COUNT(*)::INT,
           COUNT(*) FILTER (
               WHERE submitted_answers ->> id::TEXT = correct_option
           )::INT
    INTO question_count, correct_count
    FROM public.assessment_questions
    WHERE id::TEXT IN (SELECT jsonb_object_keys(submitted_answers));

    IF question_count = 0 THEN
        RAISE EXCEPTION 'No valid assessment answers were submitted';
    END IF;

    percentage := ROUND((correct_count::NUMERIC / question_count) * 100)::INT;

    SELECT COALESCE(jsonb_object_agg(category, score), '{}'::JSONB)
    INTO category_scores
    FROM (
        SELECT q.category::TEXT AS category,
               ROUND((COUNT(*) FILTER (WHERE submitted_answers ->> q.id::TEXT = q.correct_option)::NUMERIC / COUNT(*)) * 100)::INT AS score
        FROM public.assessment_questions q
        WHERE q.id::TEXT IN (SELECT jsonb_object_keys(submitted_answers))
        GROUP BY q.category
    ) category_results;

    SELECT COALESCE(array_agg(category), ARRAY[]::TEXT[])
    INTO strengths
    FROM (
        SELECT q.category::TEXT AS category
        FROM public.assessment_questions q
        WHERE q.id::TEXT IN (SELECT jsonb_object_keys(submitted_answers))
        GROUP BY q.category
        HAVING ROUND((COUNT(*) FILTER (WHERE submitted_answers ->> q.id::TEXT = q.correct_option)::NUMERIC / COUNT(*)) * 100) >= 70
    ) strong_categories;

    SELECT COALESCE(array_agg(category), ARRAY[]::TEXT[])
    INTO gaps
    FROM (
        SELECT q.category::TEXT AS category
        FROM public.assessment_questions q
        WHERE q.id::TEXT IN (SELECT jsonb_object_keys(submitted_answers))
        GROUP BY q.category
        HAVING ROUND((COUNT(*) FILTER (WHERE submitted_answers ->> q.id::TEXT = q.correct_option)::NUMERIC / COUNT(*)) * 100) < 70
    ) weak_categories;

    INSERT INTO public.assessment_submissions (
        student_profile_id, category, score, total_questions, strengths, gaps, feedback
    ) VALUES (
        requested_student_profile_id,
        'technical',
        percentage,
        question_count,
        strengths,
        gaps,
        CASE WHEN percentage >= 80 THEN 'Exceptional Industry Readiness' ELSE 'Good foundational grasp with identified upskilling paths.' END
    ) RETURNING id INTO submission_id;

    UPDATE public.student_profiles
    SET overall_readiness_score = percentage
    WHERE id = requested_student_profile_id;

    RETURN jsonb_build_object(
        'id', submission_id,
        'score', percentage,
        'total_questions', question_count,
        'category_scores', category_scores,
        'strengths', strengths,
        'gaps', gaps
    );
END;
$$;

REVOKE ALL ON FUNCTION public.grade_assessment(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.grade_assessment(UUID, JSONB) TO authenticated;
REVOKE ALL ON public.assessment_questions FROM authenticated;

CREATE POLICY "Authenticated users can read active opportunities" ON public.opportunities
    FOR SELECT TO authenticated USING (is_active = true OR company_id = auth.uid());
CREATE POLICY "Industry users can create their own opportunities" ON public.opportunities
    FOR INSERT TO authenticated WITH CHECK (company_id = auth.uid() AND public.current_user_role() = 'industry');
CREATE POLICY "Industry users can update their own opportunities" ON public.opportunities
    FOR UPDATE TO authenticated USING (company_id = auth.uid()) WITH CHECK (company_id = auth.uid());
CREATE POLICY "Industry users can delete their own opportunities" ON public.opportunities
    FOR DELETE TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Authenticated users can read opportunity skills" ON public.opportunity_skills
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Opportunity owners can manage opportunity skills" ON public.opportunity_skills
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.opportunities WHERE id = opportunity_id AND company_id = auth.uid())
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.opportunities WHERE id = opportunity_id AND company_id = auth.uid())
    );

CREATE POLICY "Users can read relevant applications" ON public.applications
    FOR SELECT TO authenticated USING (
        student_profile_id IN (SELECT id FROM public.student_profiles WHERE profile_id = auth.uid())
        OR opportunity_id IN (SELECT id FROM public.opportunities WHERE company_id = auth.uid())
    );
CREATE POLICY "Students can create their own applications" ON public.applications
    FOR INSERT TO authenticated WITH CHECK (
        student_profile_id IN (SELECT id FROM public.student_profiles WHERE profile_id = auth.uid())
    );
CREATE POLICY "Opportunity owners can update applications" ON public.applications
    FOR UPDATE TO authenticated USING (
        opportunity_id IN (SELECT id FROM public.opportunities WHERE company_id = auth.uid())
    ) WITH CHECK (
        opportunity_id IN (SELECT id FROM public.opportunities WHERE company_id = auth.uid())
    );

CREATE POLICY "Authenticated users can read faculty opportunities" ON public.faculty_opportunities
    FOR SELECT TO authenticated USING (is_active = true OR posted_by = auth.uid());
CREATE POLICY "Authorized users can create faculty opportunities" ON public.faculty_opportunities
    FOR INSERT TO authenticated WITH CHECK (
        posted_by = auth.uid() AND public.current_user_role() IN ('academician', 'industry', 'institution')
    );
CREATE POLICY "Authors can update faculty opportunities" ON public.faculty_opportunities
    FOR UPDATE TO authenticated USING (posted_by = auth.uid()) WITH CHECK (posted_by = auth.uid());
CREATE POLICY "Authors can delete faculty opportunities" ON public.faculty_opportunities
    FOR DELETE TO authenticated USING (posted_by = auth.uid());

CREATE POLICY "Academicians read own faculty applications" ON public.faculty_applications
    FOR SELECT TO authenticated USING (academician_profile_id = auth.uid());
CREATE POLICY "Faculty opportunity owners read applications" ON public.faculty_applications
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.faculty_opportunities fo WHERE fo.id = faculty_opportunity_id AND fo.posted_by = auth.uid())
    );
CREATE POLICY "Academicians create own faculty applications" ON public.faculty_applications
    FOR INSERT TO authenticated WITH CHECK (
        academician_profile_id = auth.uid() AND public.current_user_role() = 'academician'
    );

CREATE POLICY "Authenticated users can read learning programs" ON public.learning_programs
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Industry users can manage their learning programs" ON public.learning_programs
    FOR ALL TO authenticated USING (company_id = auth.uid() AND public.current_user_role() = 'industry')
    WITH CHECK (company_id = auth.uid() AND public.current_user_role() = 'industry');

CREATE POLICY "Authenticated users can read collaborations" ON public.collaboration_initiatives
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their own collaborations" ON public.collaboration_initiatives
    FOR INSERT TO authenticated WITH CHECK (initiator_id = auth.uid());
CREATE POLICY "Initiators can update collaborations" ON public.collaboration_initiatives
    FOR UPDATE TO authenticated USING (initiator_id = auth.uid()) WITH CHECK (initiator_id = auth.uid());
CREATE POLICY "Initiators can delete collaborations" ON public.collaboration_initiatives
    FOR DELETE TO authenticated USING (initiator_id = auth.uid());

CREATE POLICY "Users read own collaboration proposals" ON public.collaboration_proposals
    FOR SELECT TO authenticated USING (initiator_id = auth.uid());
CREATE POLICY "Academicians create own collaboration proposals" ON public.collaboration_proposals
    FOR INSERT TO authenticated WITH CHECK (
        initiator_id = auth.uid() AND public.current_user_role() = 'academician'
    );

CREATE POLICY "Users can read relevant portfolio items" ON public.digital_portfolio_items
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles student
            WHERE student.id = student_profile_id
                AND (student.profile_id = auth.uid() OR public.current_user_role() IN ('academician', 'industry', 'institution'))
        )
    );
CREATE POLICY "Students can manage their own portfolio" ON public.digital_portfolio_items
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.student_profiles WHERE id = student_profile_id AND profile_id = auth.uid())
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.student_profiles WHERE id = student_profile_id AND profile_id = auth.uid())
    );

-- ====================================================================
-- 14. SEED DATA (Realistic Universal & Priority Ayush Profiles)
-- ====================================================================

-- Master Skills (Technical, Soft, and Domain)
INSERT INTO public.skills_master (id, name, category, domain_tag, priority_weight, description) VALUES
('11111111-1111-1111-1111-111111110001', 'Python Data Analysis', 'technical', 'engineering', 1.00, 'Data wrangling, pandas, and statistical computation'),
('11111111-1111-1111-1111-111111110002', 'Full-Stack Web Development', 'technical', 'engineering', 1.00, 'Modern web frameworks, React, TypeScript, APIs'),
('11111111-1111-1111-1111-111111110003', 'Machine Learning & AI', 'technical', 'engineering', 1.00, 'Supervised learning, deep learning models, LLMs'),
('11111111-1111-1111-1111-111111110004', 'Good Clinical Practice (GCP)', 'domain_specialized', 'ayush', 1.25, 'Standard compliance for clinical trials and patient documentation'),
('11111111-1111-1111-1111-111111110005', 'Herbal Formulation & Standardization', 'domain_specialized', 'ayush', 1.30, 'Phytochemical extraction, stability testing, and Ayush pharmacopoeia'),
('11111111-1111-1111-1111-111111110006', 'Pharmacovigilance & Drug Safety', 'domain_specialized', 'ayush', 1.25, 'Adverse event reporting and medical ethics compliance'),
('11111111-1111-1111-1111-111111110007', 'Critical Problem Solving', 'soft', 'general', 1.00, 'Analytical reasoning, structured solution design'),
('11111111-1111-1111-1111-111111110008', 'Cross-Disciplinary Communication', 'soft', 'general', 1.00, 'Executive presentation and stakeholder reporting'),
('11111111-1111-1111-1111-111111110009', 'Project Management & Agile', 'soft', 'management', 1.00, 'Scrum methodologies, sprint tracking, team leadership'),
('11111111-1111-1111-1111-111111110010', 'Healthcare Informatics & EHR', 'domain_specialized', 'ayush', 1.20, 'Electronic health records and Ayush hospital management systems')
ON CONFLICT (id) DO NOTHING;

-- Seed Profiles (Representing all 4 Roles)
INSERT INTO public.profiles (id, role, full_name, email, institution_or_company, department, bio) VALUES
('22222222-2222-2222-2222-222222220001', 'student', 'Aarav Sharma', 'aarav.sharma@uni.ac.in', 'Delhi Technological University', 'Computer Science & Biomedical Eng', 'Senior year student specializing in data analytics and healthcare systems.'),
('22222222-2222-2222-2222-222222220002', 'student', 'Dr. Priya Varma', 'priya.varma@ayush.edu.in', 'All India Institute of Ayurveda', 'Ayurvedic Medicine & Pharmacology', 'Post-graduate scholar researching botanical extracts and clinical protocols.'),
('22222222-2222-2222-2222-222222220003', 'academician', 'Prof. Rajesh Kulkarni', 'rajesh.kulkarni@institute.edu', 'National Institute of Technology', 'School of Biosciences & Health Tech', 'Dean of Academic Collaborations with 18+ years in clinical research partnerships.'),
('22222222-2222-2222-2222-222222220004', 'industry', 'Sun Healthcare & Phytotech', 'careers@sunphytotech.com', 'Sun Phytotech Ltd.', 'Talent Acquisition & R&D Division', 'Leading herbal biotechnology and health tech enterprise with 5000+ employees.'),
('22222222-2222-2222-2222-222222220005', 'industry', 'Apex Digital Health Solutions', 'recruiting@apexdigital.io', 'Apex Digital Health', 'Engineering & Clinical AI', 'Fast-growing digital health platform powering smart clinical automation across India.'),
('22222222-2222-2222-2222-222222220006', 'institution', 'University Institute Admin', 'tpo@centraluni.ac.in', 'Central University Placement Cell', 'Training & Placement Office', 'Institutional placement monitoring cell facilitating student and faculty career growth.')
ON CONFLICT (id) DO NOTHING;

-- Seed Student Profiles
INSERT INTO public.student_profiles (id, profile_id, degree, major, year_of_study, cgpa, overall_readiness_score) VALUES
('33333333-3333-3333-3333-333333330001', '22222222-2222-2222-2222-222222220001', 'B.Tech', 'Biomedical & Data Systems', 4, 8.85, 84),
('33333333-3333-3333-3333-333333330002', '22222222-2222-2222-2222-222222220002', 'MD (Ayurveda)', 'Dravyaguna & Clinical Pharmacology', 2, 9.20, 89)
ON CONFLICT (id) DO NOTHING;

-- Seed Student Skills
INSERT INTO public.student_skills (student_profile_id, skill_id, proficiency_level, is_verified, verified_by) VALUES
('33333333-3333-3333-3333-333333330001', '11111111-1111-1111-1111-111111110001', 5, true, 'University Lab Faculty'),
('33333333-3333-3333-3333-333333330001', '11111111-1111-1111-1111-111111110002', 4, true, 'Online Certificate'),
('33333333-3333-3333-3333-333333330001', '11111111-1111-1111-1111-111111110007', 4, true, 'Assessment Test'),
('33333333-3333-3333-3333-333333330002', '11111111-1111-1111-1111-111111110004', 5, true, 'Clinical Board Examination'),
('33333333-3333-3333-3333-333333330002', '11111111-1111-1111-1111-111111110005', 5, true, 'Ayush Council Certified'),
('33333333-3333-3333-3333-333333330002', '11111111-1111-1111-1111-111111110006', 4, true, 'Hospital Internship')
ON CONFLICT (student_profile_id, skill_id) DO NOTHING;

-- Seed Assessment Questions (Technical & Soft Skills)
INSERT INTO public.assessment_questions (category, skill_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
('technical', '11111111-1111-1111-1111-111111110001', 'In Python Pandas, which method is the most efficient way to handle missing numeric values with the column mean?', 'df.dropna()', 'df.fillna(df.mean(numeric_only=True))', 'df.replace(0)', 'df.interpolate(method="polynomial")', 'B', 'fillna with column mean replaces NaN entries without removing critical records.'),
('domain_specialized', '11111111-1111-1111-1111-111111110004', 'Under Good Clinical Practice (GCP) guidelines, what document must be secured before any patient clinical trial intervention begins?', 'Laboratory Receipt', 'Institutional Ethics Committee Approval & Informed Consent', 'Commercial Patent', 'Marketing Authorization', 'B', 'GCP mandates ethical clearance and signed informed consent prior to clinical trials.'),
('domain_specialized', '11111111-1111-1111-1111-111111110005', 'Which analytical technique is universally recognized in Ayush pharmacopoeial standards for chromatographic fingerprinting of herbal raw materials?', 'Simple filtration', 'High-Performance Thin-Layer Chromatography (HPTLC)', 'Refractometry', 'pH titration', 'B', 'HPTLC provides reproducible chromatographic fingerprints for herbal standardization.'),
('soft', '11111111-1111-1111-1111-111111110007', 'When your team discovers an unexpected data inconsistency two days prior to project deployment, what is the best immediate response?', 'Ignore the anomaly and proceed', 'Conduct root-cause triage, communicate stakeholder impact, and isolate the faulty pipeline', 'Blame external API providers', 'Postpone release indefinitely without notifying team', 'B', 'Proactive triage, transparency, and targeted containment demonstrate executive critical thinking.'),
('soft', '11111111-1111-1111-1111-111111110008', 'What is the most effective approach to explain complex clinical trial data to non-medical business leaders?', 'Use raw medical jargon', 'Use visual executive dashboards highlighting patient outcomes, regulatory risks, and milestone metrics', 'Refuse to share data', 'Provide an unorganized 200-page raw report', 'B', 'Translating technical domain details into executive visual insights bridges cross-functional understanding.')
ON CONFLICT DO NOTHING;

-- Seed Opportunities (Universal tech + Priority Ayush opportunities)
INSERT INTO public.opportunities (id, company_id, title, type, domain, location, stipend_or_salary, duration, openings, description, eligibility) VALUES
('44444444-4444-4444-4444-444444440001', '22222222-2222-2222-2222-222222220005', 'Healthcare Data & Full-Stack Systems Intern', 'internship', 'software', 'Bengaluru (Hybrid)', '₹35,000 / month', '6 Months', 4, 'Build and optimize real-time patient data pipelines and responsive clinician dashboards. Open to engineering, computer science, and bioinformatics students.', 'Final year B.Tech/MCA/M.Tech with strong React and Python/database knowledge.'),
('44444444-4444-4444-4444-444444440002', '22222222-2222-2222-2222-222222220004', 'Clinical Research & Pharmacovigilance Fellow', 'internship', 'ayush_pharma', 'New Delhi / On-Site', '₹40,000 / month', '6 Months', 2, 'Work with senior pharmacologists on clinical trial documentation, botanical product safety, and Good Clinical Practice compliance.', 'BAMS / B.Pharm / M.Pharm / Life Sciences graduates with strong ethics training.'),
('44444444-4444-4444-4444-444444440003', '22222222-2222-2222-2222-222222220004', 'Herbal Formulation Quality Analyst', 'job', 'ayush_pharma', 'Haridwar R&D Center', '₹7.5 LPA', 'Full-time', 3, 'Perform HPTLC, chromatographic fingerprinting, and quality standardization for herbal and nutraceutical formulations under NABL compliance.', 'Postgraduates in Phytochemistry, Pharmacognosy, or Analytical Chemistry.')
ON CONFLICT (id) DO NOTHING;

-- Seed Opportunity Required Skills
INSERT INTO public.opportunity_skills (opportunity_id, skill_id, is_mandatory, weight) VALUES
('44444444-4444-4444-4444-444444440001', '11111111-1111-1111-1111-111111110001', true, 1.2),
('44444444-4444-4444-4444-444444440001', '11111111-1111-1111-1111-111111110002', true, 1.0),
('44444444-4444-4444-4444-444444440001', '11111111-1111-1111-1111-111111110007', false, 0.8),
('44444444-4444-4444-4444-444444440002', '11111111-1111-1111-1111-111111110004', true, 1.3),
('44444444-4444-4444-4444-444444440002', '11111111-1111-1111-1111-111111110006', true, 1.2),
('44444444-4444-4444-4444-444444440003', '11111111-1111-1111-1111-111111110005', true, 1.4),
('44444444-4444-4444-4444-444444440003', '11111111-1111-1111-1111-111111110006', false, 1.0)
ON CONFLICT DO NOTHING;

-- Seed Dedicated Faculty / Academician Opportunities
INSERT INTO public.faculty_opportunities (id, posted_by, title, type, department, duration, stipend_or_grant, location, requirements, description) VALUES
('55555555-5555-5555-5555-555555550001', '22222222-2222-2222-2222-222222220004', 'Industrial Faculty Sabbatical in High-Throughput Drug Screening', 'faculty_internship', 'Biosciences & Pharmacology', '2 Months', '₹85,000 / month grant', 'Pune R&D Hub', 'Ph.D / Associate Professors in Life Sciences, Chemistry, or Ayush medicine.', 'Hands-on industrial research sabbatical to understand industrial validation pipelines and modernize university curriculum.'),
('55555555-5555-5555-5555-555555550002', '22222222-2222-2222-2222-222222220005', 'Faculty Development Program (FDP): AI in Healthcare Diagnostics', 'fdp', 'Computer Science & Biomedical Eng', '2 Weeks', 'Fully Sponsored', 'Online / Virtual', 'Faculty members teaching Computer Science, Data Science, or Medical Electronics.', 'Intensive hands-on training on deploying medical imaging algorithms and EHR automation in hospital networks.'),
('55555555-5555-5555-5555-555555550003', '22222222-2222-2222-2222-222222220004', 'Collaborative Research Grant: Standardization of Polyherbal Extracts', 'collaborative_research', 'Pharmacognosy & Chemistry', '12 Months', '₹15,00,000 Project Grant', 'University Lab & Industry Lab', 'Recognized University Lab with HPTLC and spectroscopic facilities.', 'Joint academia-industry funded research to establish standardized pharmacopoeial protocols for high-demand wellness herbs.')
ON CONFLICT (id) DO NOTHING;

-- Seed Industry Learning Programs
INSERT INTO public.learning_programs (id, company_id, title, provider_name, type, duration_hours, syllabus_summary, target_skills, link_url, enrollment_count) VALUES
('66666666-6666-6666-6666-666666660001', '22222222-2222-2222-2222-222222220004', 'GCP & Clinical Documentation Mastery', 'Sun Phytotech Academy', 'certification', 16, 'Ethics in trials, adverse event reporting, ICH-GCP regulatory filing.', ARRAY['Good Clinical Practice (GCP)', 'Pharmacovigilance & Drug Safety'], 'https://ayurgyan.gov.in', 280),
('66666666-6666-6666-6666-666666660002', '22222222-2222-2222-2222-222222220005', 'Modern Full-Stack Healthcare Engineering', 'Apex Health Labs', 'workshop', 24, 'Building HIPAA/NABH compliant microservices with React & FastAPIs.', ARRAY['Full-Stack Web Development', 'Healthcare Informatics & EHR'], 'https://swayam.gov.in', 420)
ON CONFLICT (id) DO NOTHING;

-- Seed Student Digital Portfolio Items
INSERT INTO public.digital_portfolio_items (student_profile_id, title, item_type, description, verification_status, verification_issuer, date_awarded) VALUES
('33333333-3333-3333-3333-333333330001', 'AI-Assisted Diagnostic Triage for Primary Health Centers', 'project', 'Developed an automated symptom-triage engine deployed across 4 community clinics.', 'verified', 'Smart Healthcare Hackathon Winner', '2026-04-15'),
('33333333-3333-3333-3333-333333330002', 'Standardization of Ashwagandha Active Withanolides using HPTLC', 'project', 'Conducted chromatographic fingerprinting across 12 harvested regional samples.', 'verified', 'National Institute of Ayurveda', '2026-05-20')
ON CONFLICT DO NOTHING;

-- Seed Collaboration Initiatives
INSERT INTO public.collaboration_initiatives (initiator_id, title, type, target_institution, description, status, event_date) VALUES
('22222222-2222-2222-2222-222222220004', 'National Ayush & HealthTech Innovation Challenge 2026', 'innovation_challenge', 'Open to all Recognized Universities', 'Annual university challenge inviting student and faculty teams to build smart clinical solutions.', 'open', '2026-10-15'),
('22222222-2222-2222-2222-222222220005', 'Expert Guest Lecture: Scaling Telemedicine Pipelines', 'guest_lecture', 'Delhi Technological University', 'Interactive 2-hour masterclass by Apex VP of Engineering for pre-final and final year cohorts.', 'scheduled', '2026-09-28')
ON CONFLICT DO NOTHING;
